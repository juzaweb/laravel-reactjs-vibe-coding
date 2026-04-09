<?php

namespace Juzaweb\Modules\Api\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Api\Http\Requests\TranslateModelRequest;
use Juzaweb\Modules\Api\Http\Requests\TranslationRequest;
use Juzaweb\Modules\Core\Facades\Module;
use Juzaweb\Modules\Core\Facades\Theme;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Translations\Contracts\Translation as TranslationContract;
use Juzaweb\Modules\Core\Translations\Models\LanguageLine;
use Juzaweb\Modules\Core\Translations\Models\TranslateHistory;
use OpenApi\Annotations as OA;

class TranslationController extends APIController
{
    public function __construct(protected TranslationContract $translationManager) {}

    /**
     * @OA\Get(
     *      path="/api/v1/translations/{locale}",
     *      tags={"Translations"},
     *      summary="Get paginated/collection of translation strings",
     *      description="Returns an array of translation items with namespace, group, key, and trans values.",
     *      security={{"bearerAuth":{}}},
     *
     *      @OA\Parameter(
     *          name="locale",
     *          in="path",
     *          required=true,
     *          description="Locale code, e.g. en, vi, ja",
     *
     *          @OA\Schema(type="string", example="en")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="success", type="boolean", example=true),
     *              @OA\Property(property="data", type="array", @OA\Items(
     *                  @OA\Property(property="namespace", type="string", example="core"),
     *                  @OA\Property(property="group", type="string", example="app"),
     *                  @OA\Property(property="key", type="string", example="save"),
     *                  @OA\Property(property="trans", type="string", example="Save")
     *              ))
     *          )
     *      ),
     *
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function index(string $locale): JsonResponse
    {
        $modules = collect(Module::allEnabled())->map(fn ($item) => $item->getAliasName())->toArray();
        $theme = Theme::current();

        $collection = $this->translationManager->modules()
            ->filter(
                function ($module, $key) use ($modules, $theme) {
                    if ($module['type'] == 'module') {
                        return $key == 'admin' || in_array($key, $modules);
                    }

                    if ($module['type'] === 'theme') {
                        return $key === $theme?->lowerName();
                    }

                    return true;
                }
            )
            ->map(
                function ($module, $key) {
                    return $this->translationManager->locale($key)
                        ->translationLines('en')
                        ->map(
                            function ($item) use ($module) {
                                $item['namespace'] = $module['namespace'] ?? '*';

                                return $item;
                            }
                        );
                }
            )
            ->filter(fn ($item) => ! empty($item))
            ->flatten(1);

        $langs = LanguageLine::get()
            ->keyBy(fn ($item) => "{$item->namespace}-{$item->group}-{$item->key}");

        $items = $collection->map(
            function ($item) use ($langs, $locale) {
                $item['trans'] = $langs->get("{$item['namespace']}-{$item['group']}-{$item['key']}")
                    ->text[$locale] ?? $item['trans'];

                return $item;
            }
        );

        return $this->restSuccess($items->values());
    }

    /**
     * @OA\Put(
     *      path="/api/v1/translations/{locale}",
     *      tags={"Translations"},
     *      summary="Update a translation line",
     *      description="Update or create a language line for a specific locale.",
     *      security={{"bearerAuth":{}}},
     *
     *      @OA\Parameter(
     *          name="locale",
     *          in="path",
     *          required=true,
     *          description="Locale code, e.g. en, vi, ja",
     *
     *          @OA\Schema(type="string", example="en")
     *      ),
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/TranslationRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function update(TranslationRequest $request, string $locale): JsonResponse
    {
        $model = LanguageLine::firstOrNew(
            [
                'namespace' => $request->post('namespace'),
                'group' => $request->post('group'),
                'key' => $request->post('key'),
            ]
        );

        $model->setTranslation($locale, $request->post('value'));
        $model->save();

        return $this->restSuccess([], __('core::translation.translation_updated_successfully'));
    }

    /**
     * @OA\Post(
     *      path="/api/v1/translations/translate-model",
     *      tags={"Translations"},
     *      summary="Translate models",
     *      description="Create translation tasks for a specific model.",
     *      security={{"bearerAuth":{}}},
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/TranslateModelRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function translateModel(TranslateModelRequest $request): JsonResponse
    {
        abort_if(! config('translator.enable'), 404, __('core::translation.translation_feature_is_not_enabled'));

        $modelClass = decrypt($request->post('model'));
        $ids = $request->post('ids');
        $locale = $request->post('locale');
        $source = $request->post('source', app()->getLocale());

        if ($locale === $source) {
            return $this->restFail(__('core::translation.source_and_target_language_must_be_different'));
        }

        if (! is_array($ids)) {
            $ids = [$ids];
        }

        $historyIds = [];

        DB::transaction(
            function () use ($modelClass, $ids, $locale, $source, &$historyIds) {
                $query = $modelClass::query();
                if (method_exists($modelClass, 'translations')) {
                    $query->with(
                        [
                            'translations' => fn ($q) => $q->whereIn('locale', [$locale, $source]),
                        ]
                    );
                }

                $posts = $query->whereIn('id', $ids)->get();

                foreach ($posts as $post) {
                    $history = model_translate($post, $source, $locale);
                    $historyIds[] = $history->id;
                }
            }
        );

        return $this->restSuccess(
            [
                'history_ids' => $historyIds,
            ],
            __('core::translation.translation_for_model_has_been_created')
        );
    }

    /**
     * @OA\Post(
     *      path="/api/v1/translations/translate-status",
     *      tags={"Translations"},
     *      summary="Get translation status",
     *      description="Get the status of multiple translation history tasks.",
     *      security={{"bearerAuth":{}}},
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="history_ids", type="array", @OA\Items(type="integer"), example={1, 2, 3})
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="completed", type="boolean", example=true),
     *              @OA\Property(property="total", type="integer", example=3)
     *          )
     *      ),
     *
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function translateStatus(Request $request): JsonResponse
    {
        $historyIds = $request->post('history_ids', []);

        if (empty($historyIds)) {
            return $this->restFail('No history IDs provided', 400);
        }

        $histories = TranslateHistory::whereIn('id', $historyIds)
            ->get(['id', 'status', 'error']);

        $pending = $histories->filter(fn ($h) => $h->status->isPending())->count();
        $success = $histories->filter(fn ($h) => $h->status->isSuccess())->count();
        $failed = $histories->filter(fn ($h) => $h->status->isFailed())->count();

        $allCompleted = $pending === 0;

        return $this->restSuccess([
            'completed' => $allCompleted,
            'total' => $histories->count(),
            'pending' => $pending,
            'success' => $success,
            'failed' => $failed,
            'status' => $allCompleted ? 'completed' : 'processing',
        ]);
    }
}
