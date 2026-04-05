<?php

namespace Juzaweb\Modules\Api\Http\Controllers\Auth;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Juzaweb\Modules\Api\Http\Requests\Auth\ForgotPasswordRequest;
use Juzaweb\Modules\Api\Http\Requests\Auth\LoginRequest;
use Juzaweb\Modules\Api\Http\Requests\Auth\RefreshTokenRequest;
use Juzaweb\Modules\Api\Http\Requests\Auth\RegisterRequest;
use Juzaweb\Modules\Api\Http\Requests\Auth\ResendVerificationEmailRequest;
use Juzaweb\Modules\Api\Http\Requests\Auth\ResetPasswordRequest;
use Juzaweb\Modules\Api\Http\Resources\TokenResource;
use Juzaweb\Modules\Api\Http\Resources\UserResource;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Laravel\Passport\Http\Controllers\HandlesOAuthErrors;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Exception\OAuthServerException;
use Nyholm\Psr7\Response as Psr7Response;
use OpenApi\Annotations as OA;
use Psr\Http\Message\ServerRequestInterface;

class AuthController extends APIController
{
    use HandlesOAuthErrors;

    public function __construct(protected PasswordBroker $passwordBroker) {}

    /**
     * @OA\Post(
     *      path="/api/auth/user/login",
     *      tags={"Auth"},
     *      summary="Login User",
     *      operationId="user.login",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="email", type="string", example="admin@gmail.com"),
     *              @OA\Property(property="password", type="string", example="password"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(
     *                  property="data",
     *                  type="object",
     *                  @OA\Property(property="token", type="object", ref="#/components/schemas/TokenResource"),
     *                  @OA\Property(property="user", type="object", ref="#/components/schemas/UserResource"),
     *              )
     *          )
     *      ),
     *  )
     */
    public function login(LoginRequest $request): JsonResponse|UserResource
    {
        try {
            $response = User::generatePasswordGrantToken(
                $request->post('email'),
                $request->post('password')
            );
        } catch (OAuthServerException $e) {
            return $this->restFail($e->getMessage());
        }

        $user = User::where('email', $request->post('email'))->first();

        abort_if($user === null, 404, 'User not found');

        event(new Login('api', $user, true));

        $user->load(['roles', 'permissions']);

        return $this->restSuccess(
            [
                'token' => TokenResource::make($response),
                'user' => UserResource::make($user),
            ]
        );
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/refresh-token",
     *      tags={"Auth"},
     *      summary="Refresh Token",
     *      operationId="user.refresh",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="refresh_token", type="string"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(
     *                  property="data",
     *                  type="object",
     *                  @OA\Property(property="token", type="object", ref="#/components/schemas/TokenResource"),
     *              )
     *          )
     *      ),
     *  )
     */
    public function refreshToken(RefreshTokenRequest $request): JsonResponse
    {
        try {
            $requestData = [
                'grant_type' => 'refresh_token',
                'client_id' => config('auth.guards.api.client_id'),
                'client_secret' => config('auth.guards.api.client_secret'),
                'refresh_token' => $request->post('refresh_token'),
                'scope' => '*',
            ];

            $serverRequest = app(ServerRequestInterface::class)->withParsedBody($requestData);

            $response = $this->convertResponse(
                app(AuthorizationServer::class)->respondToAccessTokenRequest($serverRequest, new Psr7Response)
            );

            $response = json_decode($response->content(), false, 512, JSON_THROW_ON_ERROR);
        } catch (OAuthServerException $e) {
            return $this->restFail($e->getMessage(), 401);
        }

        return $this->restSuccess(
            [
                'token' => TokenResource::make($response),
            ]
        );
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/register",
     *      tags={"Auth"},
     *      summary="Register User",
     *      operationId="user.register",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="name", type="string"),
     *              @OA\Property(property="email", type="string"),
     *              @OA\Property(property="password", type="string"),
     *              @OA\Property(property="password_confirmation", type="string"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(property="data", type="object", ref="#/components/schemas/UserResource")
     *          )
     *      ),
     *  )
     */
    public function register(RegisterRequest $request): UserResource
    {
        $verifyEmail = setting('user_verification', false);
        $registerData = $request->safe()->merge([
            'password' => Hash::make($request->post('password')),
        ])->all();

        /** @var User $user */
        $user = DB::transaction(
            function () use ($registerData, $verifyEmail) {
                $user = new User;
                $user->fill($registerData);

                if (! $verifyEmail) {
                    $user->forceFill(['email_verified_at' => now()]);
                }

                $user->save();

                return $user;
            }
        );

        event(new Registered($user));

        return UserResource::make($user);
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/resend-verification-email",
     *      tags={"Auth"},
     *      summary="Resend Verification Email",
     *      operationId="user.resend-verification-email",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="email", type="string"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(property="message", type="string", example="Verification link sent!")
     *          )
     *      ),
     *  )
     */
    public function resendVerificationEmail(ResendVerificationEmailRequest $request): JsonResponse
    {
        $user = User::where('email', $request->post('email'))->first();

        if ($user === null || $user->hasVerifiedEmail()) {
            return $this->restFail('Your email has already been verified.');
        }

        $user->sendEmailVerificationNotification();

        return $this->restSuccess([], 'Verification link sent!');
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/email/verify/{id}/{hash}",
     *      tags={"Auth"},
     *      summary="Verify Email",
     *      operationId="user.verify-email",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(property="message", type="string", example="Your email has been verified.")
     *          )
     *      ),
     *  )
     */
    public function verifyEmail(Request $request, string $id, string $hash): JsonResponse
    {
        $user = User::find($id);

        if ($user === null) {
            return $this->restFail(__('Invalid verification token.'));
        }

        if (! hash_equals((string) $user->getKey(), $id)) {
            return $this->restFail(__('Invalid verification token.'));
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return $this->restFail(__('Invalid verification token.'));
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();

            event(new Verified($user));
        }

        return $this->restSuccess([], __('Your email has been verified.'));
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/forgot-password",
     *      tags={"Auth"},
     *      summary="Forgot Password",
     *      operationId="user.forgot-password",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="email", type="string"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(property="message", type="string", example="We have e-mailed your password reset link!")
     *          )
     *      ),
     *  )
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->post('email'))->first();

        if ($user === null) {
            // Avoid email scanning attacks
            return $this->restSuccess([], 'We have e-mailed your password reset link!');
        }

        DB::transaction(
            function () use ($user) {
                $token = $this->passwordBroker->createToken($user);

                $user->sendPasswordResetNotification($token);
            }
        );

        return $this->restSuccess([], 'We have e-mailed your password reset link!');
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/reset-password/{token}",
     *      tags={"Auth"},
     *      summary="Reset Password",
     *      operationId="user.reset-password",
     *
     *      @OA\Parameter(
     *          name="token",
     *          description="Password Reset Token",
     *          required=true,
     *          in="path",
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="email", type="string"),
     *              @OA\Property(property="password", type="string"),
     *              @OA\Property(property="password_confirmation", type="string"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(property="message", type="string", example="Your password has been reset!")
     *          )
     *      ),
     *  )
     */
    public function resetPassword(ResetPasswordRequest $request, string $token): JsonResponse
    {
        $status = Password::reset(
            $request->merge(['token' => $token])->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)]);

                $user->save();

                $user->passwordResets()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return $this->restFail(__($status));
        }

        return $this->restSuccess(['status' => __($status)], 'Your password has been reset!');
    }

    /**
     * @OA\Post(
     *      path="/api/auth/user/logout",
     *      tags={"Auth"},
     *      security={{"bearerAuth": {}}},
     *      summary="Logout",
     *      operationId="user.logout",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Get Data Success",
     *
     *          @OA\JsonContent(
     *
     *               @OA\Property(property="success", type="boolean", example=true),
     *               @OA\Property(property="message", type="string", example="Successfully logged out")
     *          )
     *     ),
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user('api')->token()->revoke();

        return $this->restSuccess([], 'Successfully logged out');
    }
}
