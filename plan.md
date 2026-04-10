1.  **Analyze the Request:** The user wants to show languages from the API in the top menu of the Next.js frontend (`themes/app`).
2.  **Analyze the Existing Code:**
    *   There is a `LanguageController` in the backend (`modules/API/Http/Controllers/LanguageController.php`) with a `/api/v1/locales` endpoint that returns available languages configured in `config/locales.php`.
    *   The frontend uses `react-i18next` for internationalization (`themes/app/src/i18n/index.ts`).
    *   The main layout is in `themes/app/app/layout.tsx`. It uses a `<Providers>` wrapper (`themes/app/app/providers.tsx`) that includes `<I18nProvider>`.
3.  **Implement the Solution:**
    *   Create a `Header` component (`themes/app/components/layout/Header.tsx`) that:
        *   Fetches the list of locales from `/v1/locales` using `axiosClient`.
        *   Displays the current language.
        *   Provides a dropdown menu to select a different language.
        *   Uses `useTranslation` from `react-i18next` to change the language (`i18n.changeLanguage(lng)`).
    *   Update `themes/app/app/layout.tsx` to include the `Header` component inside the `<Providers>` wrapper so it appears at the top of all pages.
4.  **Testing and Verification:**
    *   The `Header` component was created.
    *   `layout.tsx` was updated.
    *   The dev server was started and it was confirmed that the component renders and fetches from the API. The component has a dropdown to select languages.
5.  **Pre-commit steps:**
    *   Ensure proper testing, verification, review, and reflection are done.
