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
- **API Documentation**: Swagger/OpenAPI using `darkaonline/l5-swagger`.
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
- **Rich Text Editor**: `@tinymce/tinymce-react`.

### 2.3 Public Web App Frontend (`/themes/app`)
An SEO-friendly frontend application for end-user interaction.
- **Framework**: Next.js 16 (Canary) with React 19.
- **State Management**: Redux Toolkit & React Query.
- **UI & Styling**: Tailwind CSS (v4).
- **Forms**: React Hook Form.

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
- Use `scopeWhereFrontend` for theme and api queries. Use trait `Juzaweb\Modules\Admin\Traits\UsedInFrontend` to model if not exists.
- **Inheritance:** All new Service classes MUST extend `Juzaweb\Modules\Core\Services\BaseService`.
- **Database Safety:** Use `$this->transaction(fn() => ...)` for operations involving multiple database changes. This leverages Laravel's native `DB::transaction()` for safety and nesting support.
- **Return Consistency:** Service methods should return a consistent structure (e.g., using `$this->result($status, $data, $message)`).
- **Naming:** Service files must end with the suffix `Service.php`.
- Always define swagger for new API endpoints.
