<?php

namespace Juzaweb\Modules\Subscription\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Subscription\Http\Requests\PlanBulkRequest;
use Juzaweb\Modules\Subscription\Http\Requests\PlanRequest;
use Juzaweb\Modules\Subscription\Models\Plan;
use OpenApi\Annotations as OA;

class PlanController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/subscription/plans",
     *      tags={"Subscription"},
     *      summary="Get active plans",
     *      description="Returns active plans.",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *              type="object",
     *
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/PlanResource"))
     *          )
     *      )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Plan::with(['features']);

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $plans = $query->paginate($this->getLimitRequest());

        return $this->restSuccess($plans);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/subscription/plans",
     *      tags={"Subscription"},
     *      summary="Create a new plan",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="name", type="string"),
     *              @OA\Property(property="is_free", type="boolean"),
     *              @OA\Property(property="price", type="number", nullable=true),
     *              @OA\Property(property="duration", type="integer", nullable=true),
     *              @OA\Property(property="duration_unit", type="string", enum={"day", "week", "month", "year"}, nullable=true),
     *              @OA\Property(property="active", type="boolean"),
     *              @OA\Property(property="module", type="string", nullable=true),
     *              @OA\Property(property="features", type="array", @OA\Items(
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(property="value", type="string", nullable=true)
     *              ))
     *          )
     *      ),
     *      @OA\Response(response=200, description="Successful operation",
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PlanResource"))
     *      )
     * )
     */
    public function store(PlanRequest $request): JsonResponse
    {
        $plan = DB::transaction(function () use ($request) {
            $data = $request->validated();
            $plan = Plan::create($data);

            if (!empty($data['features'])) {
                $plan->features()->createMany($data['features']);
            }

            return $plan;
        });

        return $this->restSuccess($plan);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/subscription/plans/{id}",
     *      tags={"Subscription"},
     *      summary="Get plan details",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *      @OA\Response(response=200, description="Successful operation",
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PlanResource"))
     *      ),
     *      @OA\Response(response=404, description="Plan not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $plan = Plan::with(['features'])->findOrFail($id);

        return $this->restSuccess($plan);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/subscription/plans/{id}",
     *      tags={"Subscription"},
     *      summary="Update a plan",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="name", type="string"),
     *              @OA\Property(property="is_free", type="boolean"),
     *              @OA\Property(property="price", type="number", nullable=true),
     *              @OA\Property(property="duration", type="integer", nullable=true),
     *              @OA\Property(property="duration_unit", type="string", enum={"day", "week", "month", "year"}, nullable=true),
     *              @OA\Property(property="active", type="boolean"),
     *              @OA\Property(property="module", type="string", nullable=true),
     *              @OA\Property(property="features", type="array", @OA\Items(
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(property="value", type="string", nullable=true)
     *              ))
     *          )
     *      ),
     *      @OA\Response(response=200, description="Successful operation",
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PlanResource"))
     *      ),
     *      @OA\Response(response=404, description="Plan not found")
     * )
     */
    public function update(PlanRequest $request, string $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);

        $plan = DB::transaction(function () use ($request, $plan) {
            $data = $request->validated();
            $plan->update($data);

            if (isset($data['features'])) {
                $plan->features()->delete();
                $plan->features()->createMany($data['features']);
            }

            return $plan;
        });

        return $this->restSuccess($plan);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/subscription/plans/{id}",
     *      tags={"Subscription"},
     *      summary="Delete a plan",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *      @OA\Response(response=200, description="Successful operation"),
     *      @OA\Response(response=404, description="Plan not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);
        $plan->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/subscription/plans/bulk",
     *      tags={"Subscription"},
     *      summary="Bulk action on plans",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="ids", type="array", @OA\Items(type="string")),
     *              @OA\Property(property="action", type="string")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function bulk(PlanBulkRequest $request): JsonResponse
    {
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            Plan::whereIn('id', $ids)->delete();
        } else {
            Plan::whereIn('id', $ids)->update(['active' => $action]);
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
