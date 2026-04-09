1. **Create Language API Controller (Backend)**
    - Add `modules/Api/Http/Controllers/LanguageController.php` extending `APIController`.
    - Implement `index`, `store`, `show`, `update`, `destroy`, and `bulk` using the `Language` model and standard traits like `HasRestResponses`.
    - Write swagger documentation for each method.
    - Validate with a `LanguageRequest` extending `FormRequest`.

2. **Create LanguageRequest (Backend)**
    - Add `modules/Api/Http/Requests/LanguageRequest.php`.
    - Validate `code` (required, unique for creation, string) and `name` (required, string).

3. **Register Language API Route (Backend)**
    - Add `Route::api('languages', LanguageController::class)` inside the authenticated group in `modules/Api/routes/api.php`.

4. **Create Languages Page UI (Frontend - Admin)**
    - Add `themes/admin/src/pages/languages/LanguagesList.tsx`.
    - Add `themes/admin/src/pages/languages/LanguageForm.tsx`.
    - Add `themes/admin/src/pages/languages/hooks.ts` with React Query hooks.
    - Add `themes/admin/src/pages/languages/types.ts` for type definitions.

5. **Register Routes and Update Sidebar (Frontend - Admin)**
    - Update `themes/admin/src/App.tsx` to include `admin/languages` routes.
    - Update `themes/admin/src/components/layout/Sidebar.tsx` to add 'Languages' under the 'Settings' group (or standalone). Let's put it as standalone 'Languages' menu item like pages.

6. **Pre-commit Steps**
    - Run the pre-commit instructions, run `pint`, check types, tests, etc.
