<?php

namespace Juzaweb\Modules\Payment\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Payment\Http\Requests\API\CreateOrderRequest;
use Juzaweb\Modules\Payment\Http\Requests\API\UpdateOrderRequest;
use Juzaweb\Modules\Payment\Models\Order;
use OpenApi\Annotations as OA;

class OrderController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/orders",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Orders"},
     *      summary="Get list of orders",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/OrderResource")),
     *              @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *              @OA\Property(property="links", ref="#/components/schemas/PaginationLinks"),
     *              @OA\Property(property="success", type="boolean", example=true),
     *          )
     *      ),
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $this->getLimitRequest();

        $query = Order::query()
            ->where('created_by', $request->user()->id)
            ->where('created_type', get_class($request->user()));

        $query->api($request->all());

        $orders = $query->paginate($limit);

        return $this->restSuccess($orders);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/orders",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Orders"},
     *      summary="Create a new order",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/CreateOrderRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/OrderResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $order = new Order;
        $order->fill($request->validated());

        // Ensure required fields for database are present even if not in request
        $order->total_price = 0;
        $order->total = 0;
        $order->payment_method_name = 'default';

        // Scope the order to the currently authenticated user
        $order->created_by = $request->user()->id;
        $order->created_type = get_class($request->user());

        $order->save();

        return $this->restSuccess($order);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/orders/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Orders"},
     *      summary="Get order details by id",
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
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", ref="#/components/schemas/OrderResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Order not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::query()
            ->where('created_by', $request->user()->id)
            ->where('created_type', get_class($request->user()))
            ->findOrFail($id);

        return $this->restSuccess($order);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/orders/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Orders"},
     *      summary="Update an existing order",
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
     *          @OA\JsonContent(ref="#/components/schemas/UpdateOrderRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/OrderResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Order not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(UpdateOrderRequest $request, string $id): JsonResponse
    {
        $order = Order::query()
            ->where('created_by', $request->user()->id)
            ->where('created_type', get_class($request->user()))
            ->findOrFail($id);
        $order->update($request->validated());

        return $this->restSuccess($order);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/orders/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Orders"},
     *      summary="Delete an order",
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
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="message", type="string", example="Deleted successfully"),
     *
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Order not found")
     * )
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $order = Order::query()
            ->where('created_by', $request->user()->id)
            ->where('created_type', get_class($request->user()))
            ->findOrFail($id);
        $order->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }
}
