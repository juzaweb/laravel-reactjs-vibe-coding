<?php

namespace Juzaweb\Modules\API\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\API\Http\Requests\LanguageRequest;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Translations\Models\Language;
use OpenApi\Annotations as OA;

class LanguageController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/languages",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Get list of languages",
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
     *              @OA\Property(property="data", type="array", @OA\Items(type="object")),
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

        $query = Language::query();

        $query->api($request->all());

        $languages = $query->paginate($limit);

        return $this->restSuccess($languages);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/languages",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Create a new language",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="code", type="string"),
     *              @OA\Property(property="name", type="string")
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", type="object"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(LanguageRequest $request): JsonResponse
    {
        $language = Language::create($request->validated());

        return $this->restSuccess($language);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/languages/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Get language details by id",
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
     *              @OA\Property(property="data", type="object"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Language not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        return $this->restSuccess($language);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/languages/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Update language info",
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
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="code", type="string"),
     *              @OA\Property(property="name", type="string")
     *          )
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", type="object"))
     *       ),
     *
     *      @OA\Response(response=404, description="Language not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(LanguageRequest $request, string $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        $language->update($request->validated());

        return $this->restSuccess($language);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/languages/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Delete a language",
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
     *      @OA\Response(response=404, description="Language not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $language = Language::findOrFail($id);
        $language->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Get(
     *      path="/api/v1/locales",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Get list of available locales",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *              @OA\Property(property="success", type="boolean", example=true),
     *          )
     *      ),
     * )
     */
    public function locales(Request $request): JsonResponse
    {
        $locales = collect(config('locales', []))->map(function ($item, $key) {
            return [
                'code' => $key,
                'name' => $item['name'] ?? $key,
            ];
        })->values()->toArray();

        return $this->restSuccess($locales);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/languages/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Languages"},
     *      summary="Bulk action on languages",
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
    public function bulk(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'action' => 'required|string|in:delete',
        ]);

        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            Language::whereIn('id', $ids)->delete();
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
