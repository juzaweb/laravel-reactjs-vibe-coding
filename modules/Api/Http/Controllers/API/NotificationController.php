<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Api\Http\Requests\Notification\BulkNotificationRequest;
use Juzaweb\Modules\Api\Http\Resources\NotificationResource;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class NotificationController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/notifications",
     *      tags={"Notification"},
     *      summary="Get user notifications",
     *      description="Returns the authenticated user's notifications.",
     *      security={{"bearerAuth":{}}},
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *              type="object",
     *
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/NotificationResource"))
     *          )
     *      ),
     *
     *      @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = $user->notifications()->paginate($this->getLimitRequest());

        return $this->restSuccess($notifications);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/notifications/{id}",
     *      tags={"Notification"},
     *      summary="Get a specific notification",
     *      description="Returns a specific notification by ID.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="data", ref="#/components/schemas/NotificationResource")
     *          )
     *      ),
     *      @OA\Response(response=404, description="Not Found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        return $this->restSuccess($notification);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/notifications/{id}/read",
     *      tags={"Notification"},
     *      summary="Mark a specific notification as read",
     *      description="Marks a specific notification as read by ID.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="data", ref="#/components/schemas/NotificationResource")
     *          )
     *      ),
     *      @OA\Response(response=404, description="Not Found")
     * )
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if (is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        return $this->restSuccess($notification);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/notifications/{id}",
     *      tags={"Notification"},
     *      summary="Delete a notification",
     *      description="Deletes a specific notification.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *      @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $notification->delete();

        return $this->restSuccess(null, 'Notification deleted successfully.');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/notifications/bulk",
     *      tags={"Notification"},
     *      summary="Bulk actions for notifications",
     *      description="Perform bulk actions on notifications.",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/BulkNotificationRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     * )
     */
    public function bulk(BulkNotificationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $query = $request->user()->notifications()->whereIn('id', $validated['ids']);

        switch ($validated['action']) {
            case 'delete':
                $query->delete();
                break;
            case 'mark_as_read':
                $query->update(['read_at' => now()]);
                break;
            case 'mark_as_unread':
                $query->update(['read_at' => null]);
                break;
        }

        return $this->restSuccess(null, 'Bulk action performed successfully.');
    }
}
