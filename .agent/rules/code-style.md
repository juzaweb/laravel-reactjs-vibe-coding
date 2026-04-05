---
trigger: always_on
description: Core rules required for the project (always on)
---

1. PHP STANDARDS (PSR-2)
- **Database:** Always create a **Model** for any table update.
- **Validation:** Always create and use a **FormRequest** class.
- **Enum:** Use **PHP Enums** for status, type, and category columns.
- **Imports:** Always use `use` statements at the top. DO NOT use Fully Qualified Class Names (e.g., `\App\Models\User`) inline.
- **Safety:** Always check `method_exists()` or `function_exists()` before dynamic calls.

2. DATABASE & MIGRATIONS
- **Efficiency:** Only refresh/run specific modified migration files using `--path`. DO NOT run `migrate:refresh` or `migrate:fresh` on the entire folder.

3. COMMIT MESSAGE FORMAT
- Must be in **ENGLISH**.
- Use Conventional Commits style: `type(scope): description`.

4. MINIMAL DIFF & SCOPE CONTROL (CRITICAL)
- **No Unnecessary Cleanup:** DO NOT refactor or reformat existing code that is outside the scope of the current task.
- **Scope Locking:** Only modify lines that are directly related to the requested feature or bug fix.
- **Avoid Global Reformat:** Do not run automatic formatters (like phpcbf) on the entire file if it creates massive changes in the PR.
- **Preserve Legacy Style:** If the existing file doesn't follow PSR-2 perfectly, only apply PSR-2 to the NEW code you write. Do not "fix" the old code unless explicitly asked.
- **Preview Safety:** Prioritize "Clean Diffs" over "Perfect Codebase". If a change is not functional, omit it to keep the PR easy to review.

5. **CODE STYLE:**
   - Use English for variable names/comments.
   - Prefer functional patterns.
   - No "TODO" comments; implement full logic.
   - Use camelCase for variable names.
   - Use camelCase for method names.
   - Use snake_case for function names.
   - Use snake_case for table names.
   - Use snake_case for column names.
   - All PHP code MUST follow the Laravel style coding standard strictly.

6. Use the `HasMedia` trait for image fields (e.g., `thumbnail`, `banner`).
7. All main tables and their *_translations tables must have a `website_id` column for multi-website support.
8. Models using the `Translatable` trait must have a corresponding `ModelTranslation` class.
9. Use `scopeWhereFrontend` for theme and api queries. Use trait `Juzaweb\Modules\Admin\Traits\UsedInFrontend` to model if not exists.
11. The home page is always `index.blade.php` in the active theme folder.
12. SERVICE PATTERN (BUSINESS LOGIC LAYER)
- **Inheritance:** All new Service classes MUST extend `Juzaweb\Modules\Core\Services\BaseService`.
- **Database Safety:** Use `$this->transaction(fn() => ...)` for operations involving multiple database changes. This leverages Laravel's native `DB::transaction()` for safety and nesting support.
- **Return Consistency:** Service methods should return a consistent structure (e.g., using `$this->result($status, $data, $message)`).
- **Naming:** Service files must end with the suffix `Service.php`.
13. **CSRF TOKEN VERIFICATION (TESTING)**
- **Disable for Testing:** Set `VERIFY_TOKEN=false` in [.env](.env) to disable CSRF token verification