import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from './en.json';
import ko from './ko.json';

const fallbackLng = ["en"];
const resources = {
    en: {
        translation: en
    },
    ko : {
        translation: ko
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng,
        debug: true,
        lng: "en",
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
            addPath: "/locales/add/{{lng}}/{{ns}}"
        },
        interpolation: {
            escapeValue: false
        },
    });

export default i18n;