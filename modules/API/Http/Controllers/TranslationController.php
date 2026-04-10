<?php

namespace Juzaweb\Modules\API\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\API\Http\Requests\TranslateModelRequest;
use Juzaweb\Modules\API\Http\Requests\TranslationRequest;
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
     *      path="/api/v1/translations/{locale}/texts",
     *      tags={"Translations"},
     *      summary="Get i18n translation strings",
     *      description="Returns all translation strings for the given locale.",
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
     *      @OA\Response(response=200, description="Successful operation"),
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function texts(string $locale): JsonResponse
    {
        $items = $this->buildTranslationCollection($locale);

        return response()->json($this->formatAsI18n($items, $locale));
    }

    /**
     * @OA\Get(
     *      path="/api/v1/translations/{locale}",
     *      tags={"Translations"},
     *      summary="Get translations collection",
     *      description="Returns an array of translation objects including namespace, group, key, and trans for a given locale. Used mainly for admin tables/lists.",
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
     *      @OA\Response(response=200, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthorized"),
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
                        return $theme && $key === $theme->lowerName();
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

        $items = $this->mapWithDbTranslations($collection, $locale);

        return $this->restSuccess(['data' => $items]);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/translations/{locale}",
     *      tags={"Translations"},
     *      summary="Update translation string",
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
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="group", type="string", example="app"),
     *              @OA\Property(property="namespace", type="string", example="core"),
     *              @OA\Property(property="key", type="string", example="save"),
     *              @OA\Property(property="value", type="string", example="Lưu")
     *          )
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthorized"),
     *      @OA\Response(response=422, description="Validation Error"),
     *      @OA\Response(response=500, description="Server error")
     * )
     */
    public function update(TranslationRequest $request, string $locale): JsonResponse
    {
        $group = $request->post('group');
        $value = $request->post('value');
        $namespace = $request->post('namespace');
        $key = $request->post('key');

        $model = LanguageLine::firstOrNew(
            [
                'namespace' => $namespace,
                'group' => $group,
                'key' => $key,
            ]
        );

        $model->setTranslation($locale, $value);
        $model->save();

        return $this->restSuccess([], __('core::translation.translation_updated_successfully'));
    }

    /**
     * @OA\Post(
     *      path="/api/v1/translations/translate",
     *      tags={"Translations"},
     *      summary="Translate Model using AI",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="model", type="string", description="Full class name of the model to translate"),
     *              @OA\Property(property="ids", type="array", @OA\Items(type="integer")),
     *              @OA\Property(property="locale", type="string"),
     *              @OA\Property(property="source", type="string")
     *          )
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthorized"),
     *      @OA\Response(response=422, description="Validation Error"),
     *      @OA\Response(response=500, description="Server error")
     * )
     */
    public function translateModel(TranslateModelRequest $request): JsonResponse
    {
        abort_if(! config('translator.enable'), 404, __('core::translation.translation_feature_is_not_enabled'));

        // Allow passing either unencrypted model class or an encrypted one.
        $modelString = $request->post('model');
        $model = class_exists($modelString) ? $modelString : decrypt($modelString);

        $ids = $request->post('ids');
        $locale = $request->post('locale');
        $source = $request->post('source', app()->getLocale());

        if ($locale === $source) {
            return $this->restFail(
                __('core::translation.source_and_target_language_must_be_different')
            );
        }

        if (! is_array($ids)) {
            $ids = [$ids];
        }

        $historyIds = [];

        DB::transaction(
            function () use ($model, $ids, $locale, $source, &$historyIds) {
                $query = $model::query();

                if (method_exists($model, 'translations')) {
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

        return $this->restSuccess(['history_ids' => $historyIds], __('core::translation.translation_for_model_has_been_created'));
    }

    /**
     * @OA\Post(
     *      path="/api/v1/translations/status",
     *      tags={"Translations"},
     *      summary="Get translation status",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="history_ids", type="array", @OA\Items(type="integer"))
     *          )
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation"),
     *      @OA\Response(response=401, description="Unauthorized"),
     *      @OA\Response(response=500, description="Server error")
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

    private function buildTranslationCollection(string $locale): Collection
    {
        $enabledModules = $this->getEnabledModuleAliases();
        $themeKey = $this->getCurrentThemeKey();

        $collection = $this->translationManager->modules()
            ->filter(
                function ($module, $key) use ($themeKey) {
                    if ($module['type'] === 'module') {
                        return false;
                    }

                    if ($module['type'] === 'theme') {
                        return $themeKey !== null && $key === $themeKey;
                    }

                    return true;
                }
            )
            ->map(
                function ($module, $key) use ($locale) {
                    return $this->translationManager->locale($key)
                        ->translationLines($locale)
                        ->map(function ($item) use ($module) {
                            $item['namespace'] = $module['namespace'] ?? '*';

                            return $item;
                        });
                }
            )
            ->filter(fn ($item) => $item->isNotEmpty())
            ->flatten(1);

        return $this->mapWithDbTranslations($collection, $locale);
    }

    private function mapWithDbTranslations(Collection $collection, string $locale): Collection
    {
        $langs = LanguageLine::get()
            ->keyBy(fn ($item) => "{$item->namespace}-{$item->group}-{$item->key}");

        return $collection->map(
            function ($item) use ($langs, $locale) {
                $dbLine = $langs->get("{$item['namespace']}-{$item['group']}-{$item['key']}");
                $item['trans'] = ($dbLine?->text[$locale] ?? null) ?? $item['trans'];

                return $item;
            }
        );
    }

    private function getEnabledModuleAliases(): array
    {
        try {
            return collect(Module::allEnabled())
                ->map(fn ($m) => method_exists($m, 'getAliasName') ? $m->getAliasName() : null)
                ->filter()
                ->values()
                ->toArray();
        } catch (\Throwable) {
            return [];
        }
    }

    private function getCurrentThemeKey(): ?string
    {
        try {
            $theme = Theme::current();

            return method_exists($theme, 'lowerName') ? $theme->lowerName() : null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Format the collection into a flat i18n key-value map.
     *
     * @return array<string, string>
     */
    private function formatAsI18n(Collection $items, string $locale): array
    {
        return $items
            ->mapWithKeys(function ($item) {
                $namespace = $item['namespace'] ?? '*';
                $group = $item['group'] ?? '*';
                $key = $item['key'] ?? '';
                $trans = $item['trans'] ?? '';

                // Build the group prefix (empty when group is the special wildcard '*')
                $groupPrefix = ($group !== '*') ? "{$group}." : '';

                $i18nKey = $namespace !== '*'
                    ? "{$namespace}::{$groupPrefix}{$key}"
                    : "{$groupPrefix}{$key}";

                return [$i18nKey => $trans];
            })
            ->toArray();
    }
}
