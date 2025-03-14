import i18next from "i18next";
import { detectLanguageFromContent } from "../config/i18n.mjs";

export async function translateArticle(article, targetLanguage) {
    try {
        const sourceLanguage = detectLanguageFromContent(article)
    
        if (sourceLanguage === targetLanguage) {
            return article;
        }
    
        const translation = {
            ...article,
            title: await i18next.t(article.title, { lng: targetLanguage, defaultValue: article.title }),
            content: await i18next.t(article.content, { lng: targetLanguage, defaultValue: article.content }),
            language: targetLanguage,
        }
    
        return translation;
    } catch (error) {
        console.error("Translation error:", error);
        return article;
    }
}