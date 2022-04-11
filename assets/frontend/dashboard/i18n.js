
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const fallbackLng = ["en"];
const availableLanguages = ["en", "ko"];


const backendOptions = {
  loadPath: "./assets/translations/{{ns}}",
  crossDomain: true
};

i18n
  // load translation using http
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    backend: backendOptions,
    fallbackLng,
    detection: {
      checkWhitelist: true,
    },
    whitelist: availableLanguages,
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react:{useSuspense:false},
    ns: [
      "en",
      "ko"
    ],
    defaultNS: "en",
  });

export default i18n;