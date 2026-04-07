<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
     * @OA\Post(
     *      path="/api/v1/notifications",
     *      tags={"Notification"},
     *      summary="Create a new notification",
     *      description="Creates a new notification for the authenticated user.",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"title"},
     *              @OA\Property(property="title", type="string", example="New Notification"),
     *              @OA\Property(property="type", type="string", example="system"),
     *              @OA\Property(property="data", type="object", example={"message": "This is a notification"})
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="data", ref="#/components/schemas/NotificationResource")
     *          )
     *      )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'nullable|string|max:50',
            'data' => 'nullable|array',
        ]);

        $notification = $request->user()->notifications()->create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'type' => $validated['type'] ?? 'system',
            'data' => array_merge(['title' => $validated['title']], $validated['data'] ?? []),
            'read_at' => null,
        ]);

        return $this->restSuccess($notification, 'Notification created successfully.', 201);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/notifications/{id}",
     *      tags={"Notification"},
     *      summary="Update a notification",
     *      description="Updates a specific notification (e.g., mark as read).",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *      @OA\RequestBody(
     *          required=false,
     *          @OA\JsonContent(
     *              @OA\Property(property="read", type="boolean", example=true)
     *          )
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
    public function update(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'read' => 'nullable|boolean',
        ]);

        if (isset($validated['read'])) {
            if ($validated['read']) {
                $notification->markAsRead();
            } else {
                $notification->markAsUnread();
            }
        }

        return $this->restSuccess($notification, 'Notification updated successfully.');
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
     *          @OA\JsonContent(
     *              required={"ids", "action"},
     *              @OA\Property(property="ids", type="array", @OA\Items(type="string")),
     *              @OA\Property(property="action", type="string", enum={"delete", "mark_as_read", "mark_as_unread"})
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     * )
     */
    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string',
            'action' => 'required|string|in:delete,mark_as_read,mark_as_unread',
        ]);

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
