import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: "locales/{{lng}}/translation.json",
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "de", "es"],
    saveMissing: true,
    ns: ['common', 'articles', 'errors'],
    defaultNS: ['common'],
    detection: {
      order: ["header", "querystring"],
      caches: ["cookie"],
      lookupHeader:'accept-language',
    },
    interpolation: {
      escapeValue: false,
    },
    missingKeyHandler: (lng, ns, key) => {
      console.log(`Missing translation: ${key} for language: ${lng}`);
      return key;
    },
  }
);

export default i18next;