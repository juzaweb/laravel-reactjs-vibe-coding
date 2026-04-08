The user requested "Viết api crud cho Settings, auth:api (tạo controller khác, ko phải SettingController hiện tại)".

We have `Juzaweb\Modules\Api\Http\Controllers\App\SettingController`, which is an open endpoint (auth not required). The user wants another `SettingController` under `auth:api` group, implementing standard API CRUD for settings.

The existing `App\SettingController` returns key-value pairs of some basic site settings.
Wait, "api crud cho Settings" typically means a complete CRUD API (Index, Store, Show, Update, Delete) to manage the settings table, or maybe saving settings (which is basically an update or bulk store).

If I look at `SettingRequest`, it has validation rules based on `app(Setting::class)->settings()`. Wait, does it validate `code` and `value` or key-value format directly? Let's check `modules/Api/Http/Requests/SettingRequest.php`.
