<?php

namespace Juzaweb\Modules\Api\Http\Controllers\Auth;

use GuzzleHttp\Exception\ClientException;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Juzaweb\Modules\Admin\Enums\UserStatus;
use Juzaweb\Modules\Admin\Http\Resources\UserResource;
use Juzaweb\Modules\Admin\Models\User;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Http\Resources\TokenResource;
use Juzaweb\Modules\Core\Models\UserSocialConnection;
use Laravel\Socialite\Contracts\User as SocialUser;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use OpenApi\Annotations as OA;

class SocialLoginController extends APIController
{
    /**
     * @OA\Post(
     *      path="/api/auth/user/social/{driver}/redirect",
     *      tags={"Auth"},
     *      summary="Login User with Social Redirect",
     *      operationId="user.social.redirect",
     *
     *      @OA\Parameter(
     *          name="driver",
     *          in="path",
     *          required=true,
     *          description="Social Driver",
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example="true"),
     *              @OA\Property(
     *                  property="data",
     *                  type="object",
     *                  properties={
     *                      @OA\Property(property="redirect_url", type="string"),
     *                      @OA\Property(property="provider", type="string"),
     *                  }
     *              )
     *          )
     *      ),
     *  )
     */
    public function redirect(string $driver): JsonResponse
    {
        if (! setting()->boolean("{$driver}_login", false)) {
            return $this->restFail(__('Invalid provider name :name', ['name' => Str::title($driver)]));
        }

        $redirectUrl = $this->getDriverRedirectUrl($driver);

        try {
            $socialite = $this->getProvider($driver)->redirectUrl($redirectUrl);
        } catch (InvalidArgumentException $e) {
            return $this->restFail($e->getMessage());
        } catch (ClientException $e) {
            report($e);

            return $this->restFail(__('Invalid credentials provided.'));
        }

        if (! method_exists($socialite, 'stateless')) {
            return $this->restFail(__('Provider does not support stateless authentication'));
        }

        return $this->restSuccess(
            [
                'redirect_url' => $socialite->stateless()->redirect()->getTargetUrl(),
                'provider' => $driver,
            ]
        );
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/social/{driver}/callback",
     *      tags={"Auth"},
     *      summary="Login User with Social Callback",
     *      operationId="user.social.callback",
     *
     *      @OA\Parameter(
     *          name="driver",
     *          in="path",
     *          required=true,
     *          description="Social Driver",
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example="true"),
     *              @OA\Property(
     *                  property="data",
     *                  type="object",
     *                  properties={
     *                      @OA\Property(property="redirect_url", type="string"),
     *                      @OA\Property(property="provider", type="string"),
     *                  }
     *              )
     *          )
     *      ),
     *  )
     */
    public function callback(string $driver): JsonResponse
    {
        if (! setting()->boolean("{$driver}_login", false)) {
            return $this->restFail(__('Invalid provider name :name', ['name' => Str::title($driver)]));
        }

        $redirectUrl = $this->getDriverRedirectUrl($driver);

        try {
            /** @var SocialUser $socicalUser */
            $socicalUser = $this->getProvider($driver)->redirectUrl($redirectUrl)->stateless()->user();
        } catch (InvalidArgumentException $e) {
            return $this->restFail($e->getMessage());
        } catch (ClientException $e) {
            report($e);

            return $this->restFail($e->getMessage());
        }

        $userSocial = UserSocialConnection::findByProvider($driver, $socicalUser->getId());

        if ($userSocial) {
            $user = $userSocial->user;

            if ($user->status === UserStatus::INACTIVE) {
                return $this->restFail(__('Your account has been deactivated.'));
            }

            return $this->loginAndResponseWithToken($user, $driver);
        }

        $user = DB::transaction(
            function () use ($socicalUser, $driver) {
                $password = Str::random(15);

                /** @var User $user */
                $user = User::firstOrCreate([
                    'email' => $socicalUser->getEmail(),
                ], [
                    'name' => $socicalUser->getName(),
                    'password' => Hash::make($password),
                ]);

                if (! $user->hasVerifiedEmail()) {
                    $user->markEmailAsVerified();
                }

                $user->socialConnections()->create([
                    'provider' => $driver,
                    'provider_id' => $socicalUser->getId(),
                    'provider_data' => [
                        'name' => $socicalUser->getName(),
                        'email' => $socicalUser->getEmail(),
                        'avatar' => $socicalUser->getAvatar(),
                        'nickname' => $socicalUser->getNickname(),
                    ],
                ]);

                if ($user->wasRecentlyCreated) {
                    event(new Registered($user));
                }

                return $user;
            }
        );

        return $this->loginAndResponseWithToken($user, $driver);
    }

    protected function getDriverRedirectUrl(string $driver): string
    {
        if ($url = config("services.{$driver}.redirect")) {
            return $url;
        }

        return url("/user/social/{$driver}/login");
    }

    protected function getProvider(string $method): AbstractProvider
    {
        $provider = config("core.social_login.providers.{$method}");

        if (empty($provider)) {
            abort(404, __('core::translation.page_not_found'));
        }

        $config = [
            'client_id' => setting("{$method}_client_id"),
            'client_secret' => setting("{$method}_client_secret"),
            'redirect' => $this->getDriverRedirectUrl($method),
        ];

        return Socialite::buildProvider(
            $provider,
            $config
        );
    }

    protected function loginAndResponseWithToken(User $user, string $driver): JsonResponse
    {
        event(new Login('api', $user, true));

        $response = User::generatePasswordGrantToken(
            $user->email,
            Hash::make($user->password)
        );

        return $this->restSuccess(
            [
                'token' => TokenResource::make($response),
                'user' => UserResource::make($user),
            ],
            __('Login success.')
        );
    }
}
