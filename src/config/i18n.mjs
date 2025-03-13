import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { franc } from "franc-min";

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
  }
);


export function detectLanguageFromContent(content) {
    const language = franc(content, { minLength: 1 });
    const supportedLngs = i18next.options.supportedLngs;

    if (supportedLngs.includes(language)) {
        if (language === "fra") return "fr";
        if (language === "deu") return "de";
        if (language === "spa") return "es";
        return "en";
    } else {
        return console.error(`Language not supported: ${language}`);
    }
    
}

export default i18next;