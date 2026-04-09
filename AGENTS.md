# Project Architecture & Guidelines for AI Agents

This document provides AI coding assistants (Agents) with a comprehensive overview of the `laravel-reactjs-vibe-coding` project structure, architecture, and the primary technologies used. Always refer to this document before making systemic changes.

---

## 1. High-Level Architecture

The project is structured as a **Monolithic Repository with Headless Architecture**, leveraging Laravel as a robust backend CMS and two distinct React-based frontends for administration and public-facing content.

The primary directories are:
- `/modules/`: Contains backend business logic separated into isolated Laravel modules (e.g., Core, Api, Blog, Payment, Subscription).
- `/themes/admin/`: An isolated React Single Page Application (SPA) serving as the administration dashboard.
- `/themes/app/`: An isolated Next.js Application serving as the server-rendered, public-facing website.
- `/app/` & `/bootstrap/` & `/config/`: Core Laravel directories integrating the modular framework.

---

## 2. Key Technologies

### 2.1 Backend (Headless Laravel)
Located in the project root and `/modules`.
- **Framework**: Laravel 11.x (PHP 8.2+).
- **Authentication**: `laravel/passport` (OAuth2 API Authentication).
- **API Documentation**: Swagger/OpenAPI using `darkaonline/l5-swagger`. API documentation in path: storage/api-docs/api-docs.json
- **Key Packages**:
  - `astrotomic/laravel-translatable`: For multi-language model translations.
  - `spatie/laravel-activitylog`: For logging user activities and system events.
  - `pion/laravel-chunk-upload`: Manages chunked file uploads (e.g., media management).
  - `intervention/image` & `spatie/image-optimizer`: For image manipulation and optimization.

### 2.2 Admin Panel Frontend (`/themes/admin`)
A rich, client-side application for managing the CMS backend.
- **Build System**: Vite.
- **Framework**: React 18, React DOM.
- **Routing**: React Router DOM (v7).
- **State Management**: Redux Toolkit (GLobal State) & React Query (Server State / Caching).
- **UI & Styling**: Tailwind CSS (v4), `react-icons`.
- **Forms**: React Hook Form.
- **Internationalization**: `i18next` & `react-i18next`.
- **Rich Text Editor**: `@ckeditor/ckeditor5-react` and `ckeditor5`.

### 2.3 Public Web App Frontend (`/themes/app`)
An SEO-friendly frontend application for end-user interaction.
- **Framework**: Next.js 16 (Canary) with React 19.
- **State Management**: Redux Toolkit & React Query.
- **UI & Styling**: Tailwind CSS (v4).
- **Forms**: React Hook Form.
- **This version has breaking changes** — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `/themes/app/node_modules/next/dist/docs/` before writing any code.
- Frontend API calls should utilize the configured axiosClient found in themes/admin/src/utils/axiosClient.ts, which natively handles VITE_API_BASE_URL and injecting authentication tokens via interceptors.

**Take screenshots of the previews of the pages you create if possible.**

---

## 3. Structural Patterns & Guidelines

### 3.1 Modular Backend Context (`/modules`)
Instead of putting all business logic inside the generic `/app` directory, this project organizes functionality by **Feature Modules**:
- **`Core`**: Base models, traits, helpers, services.
- **`Api`**: Global API definitions, routes, controller logic.
- **`Blog`**: CMS-style post, category handling.
- **`Payment` / `Subscription`**: Domain-specific logic for transactions and plans.
*Rule for Agents*: Always ensure that new backend features are either integrated securely into an existing module or separated into a new one.

### 3.2 Service Pattern & Clean Code
- **Thin Controllers & Fat Services**: Controllers must only handle parsing Requests and returning HTTP Responses. All business logic, third-party integrations, and complex data querying must live within `Service` classes.
- **Database Safety**: Actions encompassing multiple DB writes must be enclosed in `$this->transaction(fn() => ...)` inside Services.

### 3.3 Frontend Communication
- Both `themes/admin` and `themes/app` connect to the backend exclusively via APIs.
- CSRF checks are managed in standard Laravel routing, but purely headless parts route via `api` endpoints authenticated by Passport.

## 4. Development Commands
- **Backend & Main Queues**: Run `php artisan serve` and `php artisan queue:listen`.
- **Frontend Admin**: `cd themes/admin && npm run dev`
- **Frontend App**: `cd themes/app && npm run dev`
- Or use the root command defined in composer: `composer run dev` (starts concurrently server, queue, logs, and frontend vite).
- Testing user: email: admin@gmail.com password: password. Run `php artisan user:make --name=Admin --email=admin@gmail.com --pass=password --super-admin` to create admin user if not exists.

## 5. Coding Rules (Important)
- **Database:** Always create a **Model** for any table update.
- **Validation:** Always create and use a **FormRequest** class.
- **Enum:** Use **PHP Enums** for status, type, and category columns.
- **Imports:** Always use `use` statements at the top. DO NOT use Fully Qualified Class Names (e.g., `\App\Models\User`) inline.
- **Safety:** Always check functions/methods exists before dynamic calls.
- **Efficiency:** Only refresh/run specific modified migration files using `--path`. DO NOT run `migrate:refresh` or `migrate:fresh` on the entire folder.
- Use English for variable names/comments.
- Prefer functional patterns.
- No "TODO" comments; implement full logic.
- Use camelCase for variable names.
- Use camelCase for method names.
- Use snake_case for function names.
- Use snake_case for table names.
- Use snake_case for column names.
- All PHP code MUST follow the Laravel style coding standard strictly.
- Use the `HasMedia` trait for image fields (e.g., `thumbnail`, `banner`).
- Models using the `Translatable` trait must have a corresponding `ModelTranslation` class.
- Use trait `HasApi` and scope `api` for all api routes.
- **Inheritance:** All new Service classes MUST extend `Juzaweb\Modules\Core\Services\BaseService`.
- **Database Safety:** Use `$this->transaction(fn() => ...)` for operations involving multiple database changes. This leverages Laravel's native `DB::transaction()` for safety and nesting support.
- **Return Consistency:** Service methods should return a consistent structure (e.g., using `$this->result($status, $data, $message)`).
- **Naming:** Service files must end with the suffix `Service.php`.
- Always define swagger for new API endpoints.
- The public API for app route prefix is `/app`.
- Always use `restSuccess` and `restFail` in trait `HasRestResponses` for API responses. Using `public static function getResource(): string` method in model (define in `HasResource` trait) to custom Resource for api response.
- To build, lint, or run the local development server for the themes/admin, themes/app frontend, use `npm run build`, `npm run lint`, and `npm run dev` respectively within the themes/admin, themes/app directory.
- Clean up irrelevant files before submitting.


## 6. AI Agent Guidelines (Memories)

### 6.1 Backend / API Rules
- Always create and use a FormRequest class for validation instead of using inline Validator::make() within controllers.
- Run `vendor/bin/pint` in backend before pushing.
- To prevent IDOR vulnerabilities, API endpoints for user-specific resources must explicitly scope queries to the authenticated user (e.g., `where('payer_id', $user->id)`). For administrative API endpoints, this scoping must be applied conditionally if the user lacks the specific permission to view all records (e.g., `if (!$user->hasPermissionTo(...))`).
- Module service providers that must run before the application database or module repository is fully booted (such as `InstallerServiceProvider`) should be manually registered in `bootstrap/providers.php`.
- To expose `$hidden` model attributes (e.g., `config` on `PaymentMethod`) to administrative APIs, avoid manually calling `$model->makeVisible()`. Instead, use Laravel API Resources by defining a custom resource class and binding it to the model via the `Juzaweb\Modules\Core\Traits\HasResource` trait and `getResource()` static method.
- To register API routes for a Juzaweb module, define them in `routes/api.php` and load them within the module's `RouteServiceProvider::boot()` method using `Route::middleware('api')->prefix('api/v1')->group(__DIR__ . '/../routes/api.php');`.
- Always write Swagger documentation for API routes.
- When returning PHP native Enums (`UnitEnum`) through Laravel API Resources, explicitly extract the scalar value (e.g., `$field instanceof \UnitEnum ? $field->value : $field`) to ensure the frontend receives a scalar value instead of an empty or malformed object structure.
- The `/api/v1/app/settings` endpoint is read-only and returns a limited set of public configuration values. For administrative operations fetching or updating all settings, use the `/api/v1/settings` endpoints.
- To regenerate API documentation after updating Swagger annotations (e.g., in API controllers), run `php artisan l5-swagger:generate`.
- When processing bulk settings updates from the frontend via API (e.g., `PUT /api/v1/settings`), use standard `Illuminate\Http\Request` and `$request->all()` rather than `SettingRequest`, as a strict FormRequest will filter out unregistered dynamic fields.
- When validating dynamic configuration arrays in FormRequests (such as payment method configs or generic settings) that might be missing or empty from the frontend, use the `nullable` rule instead of `required` to prevent validation failures when the frontend submits an empty object.
- The custom `Route::api` macro returns an APIResource instance that supports standard Laravel resource chaining methods (e.g., `->only(['index', 'store', 'update'])`), allowing exclusion of the default methods. Note that while it registers a `bulk` endpoint, the base `APIController` does not natively implement the `bulk` method; individual controllers must implement it.
- The `PUT /api/v1/settings` endpoint does not take an `{id}` parameter. It accepts a bulk key-value dictionary and updates multiple settings at once using `Setting::sets($data)`. The list API (`GET /api/v1/settings`) returns a flat key-value dictionary (`pluck('value', 'code')`), simplifying frontend form populations.
- The project uses `pingpong/shortcode` for shortcode rendering and compilation, replacing the abandoned `webwizo/shortcodes` package.
- In the backend, when handling media uploads from the frontend `MediaPlaceholder` (which provides a string file path), models using the `HasMedia` trait can attach or update the media by calling `$model->syncMedia($path, 'channel_name');` after the model is saved to the database.
- Always use `restSuccess` and `restFail` in trait `HasRestResponses` for API responses. Using `public static function getResource(): string` method in model (define in `HasResource` trait) to custom Resource for api response.
- In the backend, page templates can be retrieved globally using the `Juzaweb\Modules\Core\Facades\PageTemplate::all()` facade method.
- The user strictly prefers reusing and extending existing generic APIs (e.g., modifying `SettingController@index` format or `update` logic) over creating new custom endpoints for the admin panel.
- In the backend, models using the `Juzaweb\Modules\Core\Traits\HasDescription` trait automatically generate SEO-friendly descriptions from their content on saving. Consequently, the `description` field should not be accepted in backend API request validation or handled by frontend creation/update forms for these models.
- To complete the Payment module flow from the frontend, first call `POST /api/v1/payment/{module}` to generate an `order_id`, then submit a `POST /api/v1/payment/{module}/purchase` request with the `order_id` and `method` to receive the vendor redirect or embed URL.
- If a Swagger generation error occurs stating a `$ref` is not found (e.g., `#/components/schemas/ClassName`), ensure that the referenced class (such as an API Resource or FormRequest) has an `@OA\Schema` annotation block at the class level defining its schema and properties.
- When returning models that use the `Translatable` trait from backend API controllers, ensure the locale query parameter falls back to the application's default locale (e.g., `$request->input('locale', app()->getLocale())`). Without a specified locale, translatable fields (like `name` and `description`) will not be loaded or returned in the JSON payload.

### 6.2 Frontend (Admin) Rules
- Ensure all editable fields for frontend forms (such as `status` and `locale`) are explicitly mapped in their corresponding Laravel API Resources so that frontend `<form>` states initialize correctly during edit mode rather than falling back to default values.
- In the `themes/admin` frontend, standard forms should visually align with established conventions by wrapping the form content in a card container (`bg-[var(--bg-card)] rounded-xl border`), using `react-hook-form`'s `Controller` for inputs, and placing action buttons (Save/Cancel) in a distinct footer (`bg-slate-50 dark:bg-slate-800/50 border-t`).
- In the `themes/admin` frontend, when controlled components (e.g., `MediaPlaceholder`) display full URLs but emit relative paths on change, use a `useRef` to track the last emitted path value. This prevents `react-hook-form` from echoing the path back into the component's `value` prop and incorrectly overwriting the internal URL display state.
- The `themes/admin` frontend build process (`npm run build`) executes strict TypeScript checks (`tsc -b`) before building with Vite, which will fail the build if there are unused imports or variables.
- Custom CKEditor 5 plugins in the `themes/admin` frontend are typically implemented directly within `src/components/ui/form/Editor.tsx` by extending the `Plugin` class and interacting with `editor.ui.componentFactory` and `editor.execute` for commands like `insertImage` or `mediaEmbed`.
- In the `themes/admin` frontend, the `DataTable` component is located at `src/components/ui/table/DataTable`.
- In the `themes/admin` React frontend, `verbatimModuleSyntax` is enabled in TypeScript. Ensure that types and interfaces are imported using `import type { ... }` to avoid `TS1484` compilation errors.
- The Vite development server for the `themes/admin` frontend runs on port `5173` by default, rather than port `3000`.
- In the `themes/admin` React application, API calls typically use `axiosClient` located at `themes/admin/src/utils/axiosClient.ts`, and their results are managed using `@tanstack/react-query` hooks.
- When configuring CKEditor 5 (v44+) in the application, you must set `licenseKey: 'GPL'` in the editor configuration object to prevent a `license-key-missing` error, even when using the editor under the GPL license.
- When editing JSON configurations via a `Textarea` in `themes/admin` forms (e.g., with `react-hook-form`), maintain a local string state or handle parsing on `onBlur` rather than `onChange`. Parsing on every keystroke disrupts typing by rejecting intermediate invalid JSON strings.
- In the `themes/admin` frontend, the `Select` component (`src/components/ui/form/Select.tsx`) does not accept a `placeholder` prop. Loading or empty states should be handled by adding an object with an empty value to the `options` array (e.g., `{ value: '', label: 'Loading...' }`).
- When evaluating the type of a `MediaItem` object from the backend API in the frontend, note that `media.type` strictly denotes whether it is a 'file' or 'dir' (directory). To check for specific media formats, rely entirely on boolean flags like `is_image` and `is_video`, or evaluate `mime_type` instead of checking the `type` string.
- In the `themes/admin` frontend, shared TypeScript interfaces such as `ApiResponse` and `PaginatedData` are centralized in `themes/admin/src/types.ts`. Note that `PaginatedData<T>` exposes pagination metadata directly as properties (e.g., `current_page`, `last_page`), not inside a nested `meta` object.
- When using the `Select` component (`themes/admin/src/components/ui/form/Select.tsx`) for optional fields, include an explicit option with `value: ''` (e.g., `{ value: '', label: 'Default' }`) to ensure the empty state is explicitly selectable and submits an empty string.
- When configuring API endpoint URLs for `axiosClient` in the `themes/admin` frontend, ensure the path includes the correct version prefix (e.g., `/v1/`) to avoid 404 Not Found errors when communicating with the backend.
- In the `themes/admin` frontend, toast notifications are implemented using `react-hot-toast` (`import toast from 'react-hot-toast'`).
- The `themes/admin` frontend utilizes Tailwind CSS v4. Since v4's preflight no longer applies `cursor: pointer` to buttons by default, global base styles or element overrides are managed in the `@layer base` block within `themes/admin/src/index.css`.
- In the themes/admin frontend, client-side routing is centralized in themes/admin/src/App.tsx using react-router-dom. New admin pages and their routes should be registered in this file.
- In the `themes/admin` frontend, large media file uploads are chunked using `resumablejs`. The configuration, including `chunkSize` (in bytes), is handled in `src/pages/media/MediaUploadDropzone.tsx`.
- The `themes/admin` frontend uses CKEditor 5 (`@ckeditor/ckeditor5-react` and `ckeditor5`) as the standard rich text editor, replacing TinyMCE. The reusable component is located at `themes/admin/src/components/ui/form/Editor.tsx`.
- In the `themes/admin` frontend using `react-hook-form`, initialize nullable string fields (like optional templates) with an empty string `''` rather than fallback strings like `'default'`. Laravel's `ConvertEmptyStringsToNull` middleware will correctly handle the empty string as `null` to satisfy `nullable` validation rules.

### 6.3 Frontend (App) Rules
- In the `themes/app` Next.js frontend, internationalization (i18n) translations are fetched dynamically from the `/api/v1/translations/{locale}` API endpoint using `i18next-http-backend` and configured via `NEXT_PUBLIC_API_BASE_URL`. The translation provider is wrapped in a `<Suspense>` boundary within `app/providers.tsx`.
- In the `themes/app` Next.js application, client-side API calls should use the pre-configured Axios client located at `themes/app/utils/axiosClient.ts`, which automatically prepends the `NEXT_PUBLIC_API_BASE_URL` (defaulting to `/api`).
- In the `themes/app` Next.js frontend, components utilizing the `useSearchParams` hook must be wrapped in a `<Suspense>` boundary to ensure proper static/dynamic rendering in the App Router.
- In the `themes/app` Next.js frontend, global state is managed using Redux Toolkit inside the `themes/app/store` directory, complete with typed hooks (`hooks.ts`). Global initialization actions, such as fetching global application settings via a `settingSlice` from `/v1/app/settings`, should be dispatched within a wrapper component inside `themes/app/app/providers.tsx` when the store's state is 'idle'.

### 6.4 Testing Rules
- Ensure `phpunit.xml` configures `DB_CONNECTION` to `sqlite` and `DB_DATABASE` to `:memory:` so that Orchestra Testbench correctly uses an in-memory database during tests.
- In backend feature tests using Orchestra Testbench, when registering singletons or modifying the container in `getEnvironmentSetUp($app)`, interact directly with the passed `$app` parameter instead of `$this->app` to prevent null reference errors.
- In backend feature tests utilizing Orchestra Testbench, constructors type-hinted specifically with `Juzaweb\Modules\Core\Application` may encounter a `TypeError` due to Testbench injecting the default `Illuminate\Foundation\Application`. This is a known consequence of the test environment setup.
- When backend module tests fail due to missing helper functions, explicitly require the module's `Helpers/functions.php` file inside the `setUp()` method of the module's `TestCase.php`.
- To bypass the `ProtectedRoute` redirect when visually testing the `themes/admin` frontend UI with Playwright, inject authentication state directly into `localStorage` (e.g., setting the `accessToken` and a `user` object including `has_all_permissions: true`) and mock the `/api/v1/profile` endpoint, as `AdminLayout` automatically fetches the user profile if authenticated.
- When running backend feature tests for modules, the 'Unable to resolve migration path for type [laravel]' error in orchestra/testbench-core is resolved by ensuring a `migrations` directory exists at the project root (e.g., creating `migrations/.gitkeep`).
- Always create unit tests for jobs, services, commands, repositories, etc., and feature tests for routes/APIs.
