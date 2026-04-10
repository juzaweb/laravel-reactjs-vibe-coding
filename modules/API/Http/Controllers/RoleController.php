<?php

namespace Juzaweb\Modules\API\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\API\Http\Requests\RoleRequest;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Permissions\Models\Permission;
use Juzaweb\Modules\Core\Permissions\Models\Role;
use OpenApi\Annotations as OA;

class RoleController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/roles",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Roles"},
     *      summary="Get list of roles",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/RoleResource")),
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

        $query = Role::query()->api($request->all());

        $roles = $query->paginate($limit);

        return $this->restSuccess($roles);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/roles/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Roles"},
     *      summary="Get role details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/RoleResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Role not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        return $this->restSuccess($role);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/roles",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Roles"},
     *      summary="Create a new role",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/RoleRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/RoleResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(RoleRequest $request): JsonResponse
    {
        $role = DB::transaction(
            function () use ($request) {
                $role = Role::create($request->safe()->except('permissions'));

                if ($request->has('permissions')) {
                    $permissions = Permission::whereIn('name', $request->input('permissions'))->get();
                    $role->syncPermissions($permissions);
                }

                return $role;
            }
        );

        return $this->restSuccess($role);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/roles/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Roles"},
     *      summary="Update an existing role",
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
     *          @OA\JsonContent(ref="#/components/schemas/RoleRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/RoleResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Role not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(RoleRequest $request, string $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        $role = DB::transaction(
            function () use ($role, $request) {
                $role->update($request->safe()->except('permissions'));

                if ($request->has('permissions')) {
                    $permissions = Permission::whereIn('name', $request->input('permissions'))->get();
                    $role->syncPermissions($permissions);
                }

                return $role;
            }
        );

        return $this->restSuccess($role);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/roles/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Roles"},
     *      summary="Delete a role",
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
     *      @OA\Response(response=404, description="Role not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }
}
