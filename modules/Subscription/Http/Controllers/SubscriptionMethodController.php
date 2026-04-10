<?php

namespace Juzaweb\Modules\Subscription\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Subscription\Facades\Subscription;
use Juzaweb\Modules\Subscription\Http\Requests\API\SubscriptionMethodRequest;
use Juzaweb\Modules\Subscription\Models\SubscriptionMethod;
use OpenApi\Annotations as OA;

class SubscriptionMethodController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/subscription/methods/drivers",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Get list of subscription drivers",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     * )
     */
    public function drivers(): JsonResponse
    {
        $drivers = Subscription::drivers();
        $data = [];

        foreach ($drivers as $name => $driverClass) {
            $driver = Subscription::driver($name);
            $data[] = [
                'name' => $name,
                'label' => title_from_key($name),
                'configs' => $driver->getConfigs(),
            ];
        }

        return $this->restSuccess($data);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/subscription/methods",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Get list of subscription methods",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $this->getLimitRequest();
        $locale = $request->input('locale');

        $query = SubscriptionMethod::query();
        if ($locale) {
            $query->withTranslation($locale);
        }

        $query->api($request->all());

        $methods = $query->paginate($limit);

        return $this->restSuccess($methods);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/subscription/methods",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Create a new subscription method",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/SubscriptionMethodRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(SubscriptionMethodRequest $request): JsonResponse
    {
        $method = DB::transaction(
            function () use ($request) {
                $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
                $data = $request->validated();

                $method = new SubscriptionMethod;
                $method->setDefaultLocale($locale);
                $method->fill($data);
                $method->save();

                return $method;
            }
        );

        return $this->restSuccess($method);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/subscription/methods/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Get subscription method details by id",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(response=404, description="Subscription method not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $locale = $request->input('locale');
        $query = SubscriptionMethod::query();
        if ($locale) {
            $query->withTranslation($locale);
        }
        $method = $query->findOrFail($id);

        return $this->restSuccess($method);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/subscription/methods/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Update an existing subscription method",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/SubscriptionMethodRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *       ),
     *      @OA\Response(response=404, description="Subscription method not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(SubscriptionMethodRequest $request, string $id): JsonResponse
    {
        $method = SubscriptionMethod::findOrFail($id);
        $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
        $method->setDefaultLocale($locale);

        $method = DB::transaction(
            function () use ($method, $request) {
                $method->update($request->validated());

                return $method;
            }
        );

        return $this->restSuccess($method);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/subscription/methods/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Delete a subscription method",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(response=404, description="Subscription method not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $method = SubscriptionMethod::findOrFail($id);
        $method->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/subscription/methods/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Subscription Methods"},
     *      summary="Bulk action on subscription methods",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="ids", type="array", @OA\Items(type="string")),
     *              @OA\Property(property="action", type="string")
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      )
     * )
     */
    public function bulk(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'action' => 'required|string|in:delete',
        ]);

        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            SubscriptionMethod::whereIn('id', $ids)->delete();
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
