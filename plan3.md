Wait, if it's "api crud cho Settings (tạo controller khác, ko phải SettingController hiện tại)", this implies making a standard `Route::api('settings', \Juzaweb\Modules\Api\Http\Controllers\SettingController::class)` which handles standard API actions for `Setting` model.

Wait! A `SettingRequest` already exists in `modules/Api/Http/Requests/SettingRequest.php`. Let's look at its content:
```php
    public function rules(): array
    {
        $settings = app(Setting::class)->settings();

        return $this->collect()
            ->only($settings->keys())
            ...
```
This implies the request is meant for saving multiple key-values simultaneously, e.g. `{"title": "New Title", "logo": "new_logo.png"}`.
If we use this `SettingRequest`, `SettingController` would typically just have a single `update` or `store` method that takes this dictionary and loops through to update settings:
```php
foreach($request->validated() as $key => $value) {
    Setting::updateOrCreate(['code' => $key], ['value' => $value]); // Or whatever setting API they have.
}
```

Let's check how Settings are saved in other modules or in core admin:
