It is clear that `Route::api` creates `index`, `show`, `store`, `update`, `destroy`, `bulk`.
So I should create `SettingController` at `modules/Api/Http/Controllers/SettingController.php`.
And `SettingRequest` at `modules/Api/Http/Requests/SettingResourceRequest.php` (Wait, maybe just `SettingRequest`? No, `SettingRequest` already exists for bulk settings. I will create `SettingResourceRequest` or `SettingModelRequest`). I'll create `modules/Api/Http/Requests/Setting/SettingResourceRequest.php` or `SettingModelRequest.php`. Wait, I can just use inline validation or create `modules/Api/Http/Requests/SettingResourceRequest.php`. I should create `modules/Api/Http/Requests/SettingResourceRequest.php`.
```php
<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingResourceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'code' => 'required|string|max:250',
            'value' => 'nullable',
        ];
    }
}
```

Wait, `Setting::create()` might need `translatable` boolean as well if translatable setting. Let's make it simple.

Let's look at `modules/Api/Http/Requests/SettingRequest.php`. It is for validating standard `app(Setting::class)->settings()` which is an array of options registered in the system. The requirement is just "api crud cho Settings". So maybe it's just basic CRUD.

Wait! A `bulk` method uses a BulkRequest. Let's check `modules/Api/Http/Requests/SettingBulkRequest.php`.

```php
<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingBulkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'action' => 'required|string|in:delete',
        ];
    }
}
```

Let's request a plan review.

Plan:
1. Create `modules/Api/Http/Controllers/SettingController.php` implementing standard CRUD operations (index, show, store, update, destroy, bulk) for the `Setting` model (`Juzaweb\Modules\Core\Models\Setting`).
2. Create `modules/Api/Http/Requests/SettingResourceRequest.php` for validating `store` and `update` methods.
3. Create `modules/Api/Http/Requests/SettingBulkRequest.php` for validating `bulk` method.
4. Add `Route::api('settings', SettingController::class);` to `modules/Api/routes/api.php` under the `auth:api` middleware group.
5. Add Swagger annotations for each endpoint in `SettingController`.
6. Include a pre-commit step to run tests, pint, and `php artisan l5-swagger:generate`.
