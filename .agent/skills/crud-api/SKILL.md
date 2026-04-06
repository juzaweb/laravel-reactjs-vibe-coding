---
name: crud-api
description: "Guidelines and conventions for writing a CRUD API in Juzaweb modules. Trigger: When creating or modifying API controllers, resources, or requests."
license: "Apache 2.0"
metadata:
  version: "1.0"
  type: conventions
  skills:
    - php
    - laravel
    - juzaweb
    - openapi
    - swagger
---

# Create Juzaweb CRUD API

This skill guides you through creating a RESTful CRUD API entity within an existing Juzaweb Module, fully documented with Swagger (OpenAPI) annotations, using thin controllers and the service pattern.

## When to Use

Use when:
- Creating a new CRUD API for a module entity.
- Refactoring an existing API Controller to adhere to the project's coding standards.
- Adding or updating OpenAPI (Swagger) annotations for API routes.

## Critical Patterns

### ✅ REQUIRED: API Controller Conventions

- Extend `Juzaweb\Modules\Core\Http\Controllers\APIController`.
- Return responses using `$this->restSuccess()`.
- Inject a Service class for all business logic (Thin Controller Pattern).
- Wrap `store` and `update` logic inside a `DB::transaction`.
- ALWAYS document API routes using Swagger/OpenAPI annotations.

```php
<?php

namespace Juzaweb\Modules\[Module]\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\[Module]\Http\Requests\[Entity]Request;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\[Module]\Models\[Entity];
use Juzaweb\Modules\[Module]\Services\[Entity]Service;
use OpenApi\Annotations as OA;

class [Entity]Controller extends APIController
{
    public function __construct(protected [Entity]Service $service)
    {
    }

    /**
     * @OA\Get(
     *      path="/api/v1/[kebab-case-entities]",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"[EntityPluralName]"},
     *      summary="Get list of [entities]",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/[Entity]Resource")),
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

        // Example query building. Use $request->input('locale') if translatable.
        $query = [Entity]::query()->api($request->all());
        $entities = $query->paginate($limit);

        return $this->restSuccess($entities);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/[kebab-case-entities]",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"[EntityPluralName]"},
     *      summary="Create a new [entity]",
     *
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/[Entity]Request")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/[Entity]Resource"))
     *      ),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store([Entity]Request $request): JsonResponse
    {
        $entity = DB::transaction(function () use ($request) {
            // Provide default fallback logic if necessary
            return $this->service->create($request->validated());
        });

        return $this->restSuccess($entity);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/[kebab-case-entities]/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"[EntityPluralName]"},
     *      summary="Get [entity] details by id",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(property="data", ref="#/components/schemas/[Entity]Resource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *      @OA\Response(response=404, description="[Entity] not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $entity = [Entity]::findOrFail($id);

        return $this->restSuccess($entity);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/[kebab-case-entities]/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"[EntityPluralName]"},
     *      summary="Update an existing [entity]",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/[Entity]Request")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/[Entity]Resource"))
     *       ),
     *      @OA\Response(response=404, description="[Entity] not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update([Entity]Request $request, string $id): JsonResponse
    {
        $entity = DB::transaction(function () use ($request, $id) {
            return $this->service->update($request->validated(), $id);
        });

        return $this->restSuccess($entity);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/[kebab-case-entities]/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"[EntityPluralName]"},
     *      summary="Delete a [entity]",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Deleted successfully"),
     *          )
     *      ),
     *      @OA\Response(response=404, description="[Entity] not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $entity = [Entity]::findOrFail($id);
        $entity->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }
}
```

### ✅ REQUIRED: Swagger in FormRequests and Resources

Swagger documentation using OpenAPI annotations (`@OA\Schema`, `@OA\Property`) MUST be included in `FormRequest` and `JsonResource` classes.

**FormRequest Example:**

```php
<?php

namespace Juzaweb\Modules\[Module]\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="[Entity]Request",
 *      description="[Entity] request body data",
 *      type="object",
 *      required={"name"}
 * )
 */
class [Entity]Request extends FormRequest
{
    /**
     * @OA\Property(
     *      title="name",
     *      description="Name of the [entity]",
     *      example="Example Name"
     * )
     *
     * @var string
     */
    public $name;

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
```

**JsonResource Example:**

```php
<?php

namespace Juzaweb\Modules\[Module]\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="[Entity]Resource",
 *     description="[Entity] resource",
 *     @OA\Xml(name="[Entity]Resource")
 * )
 */
class [Entity]Resource extends JsonResource
{
    /**
     * @OA\Property(
     *     title="id",
     *     description="ID",
     *     format="int64",
     *     example=1
     * )
     *
     * @var int
     */
    public $id;

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
```

### ✅ REQUIRED: Routing

Register API routes in `modules/Api/routes/api.php` or your module's specific API routing file.

```php
use Juzaweb\Modules\[Module]\Http\Controllers\API\[Entity]Controller;

Route::middleware('auth:api')->group(function () {
    Route::apiResource('[kebab-case-entities]', [Entity]Controller::class);
});
```

### ✅ REQUIRED: Feature Testing

Always create feature tests for routes/APIs and unit tests for jobs, services, commands, repositories. Use `php artisan test` to execute them.

## Edge Cases

**Translations:** If the model leverages `Juzaweb\Modules\Core\Traits\Translatable`, be sure to pull the `locale` from the request (e.g., `$request->input('locale')`) and pass it to scopes like `withTranslation($locale)` during queries and `setDefaultLocale($locale)` before saving. Look at `PageController` as an example.

## Checklist

- [ ] Controller extends `Juzaweb\Modules\Core\Http\Controllers\APIController`
- [ ] Returns using `$this->restSuccess()`
- [ ] Uses Service class for business logic
- [ ] Wraps create/update within `DB::transaction`
- [ ] Swagger annotations added to Controller, FormRequest, and JsonResource
- [ ] Tests created for feature routes
