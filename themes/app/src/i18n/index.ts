import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: `${apiBaseUrl}/v1/translations/{{lng}}.json`,
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
