<?php

namespace Juzaweb\Modules\Api\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Juzaweb\Modules\Api\Http\Requests\UserBulkRequest;
use Juzaweb\Modules\Api\Http\Requests\UserRequest;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\User;
use OpenApi\Annotations as OA;

class UserController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/users",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Users"},
     *      summary="Get list of users",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/UserResource")),
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

        $query = User::query();

        $query->api($request->all());

        $users = $query->paginate($limit);

        return $this->restSuccess($users);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/users",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Users"},
     *      summary="Create a new user",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/UserRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/UserResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(UserRequest $request): JsonResponse
    {
        $user = DB::transaction(
            function () use ($request) {
                $data = $request->validated();
                if (isset($data['password'])) {
                    $data['password'] = Hash::make($data['password']);
                }

                $user = new User;
                $user->fill($data);
                $user->save();

                if (isset($data['roles'])) {
                    $user->syncRoles($data['roles']);
                }

                return $user;
            }
        );

        return $this->restSuccess($user);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/users/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Users"},
     *      summary="Get user details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/UserResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="User not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return $this->restSuccess($user);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/users/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Users"},
     *      summary="Update an existing user",
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
     *          @OA\JsonContent(ref="#/components/schemas/UserRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/UserResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="User not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(UserRequest $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user = DB::transaction(
            function () use ($user, $request) {
                $data = $request->validated();
                if (isset($data['password'])) {
                    $data['password'] = Hash::make($data['password']);
                } else {
                    unset($data['password']);
                }

                $user->update($data);

                if (isset($data['roles'])) {
                    $user->syncRoles($data['roles']);
                }

                return $user;
            }
        );

        return $this->restSuccess($user);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/users/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Users"},
     *      summary="Delete a user",
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
     *      @OA\Response(response=404, description="User not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/users/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Users"},
     *      summary="Bulk action on users",
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
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="message", type="string", example="Bulk action successfully")
     *          )
     *      )
     * )
     */
    public function bulk(UserBulkRequest $request): JsonResponse
    {
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            User::whereIn('id', $ids)->delete();
        } else {
            User::whereIn('id', $ids)->update(['status' => $action]);
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
