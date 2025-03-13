import i18next from "i18next";
import { detectLanguageFromContent } from "../config/i18n.mjs";

export async function translateArticle(content) {
    const sourceLanguage = detectLanguageFromContent(content)
}