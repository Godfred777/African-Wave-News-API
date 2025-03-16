import { franc } from 'franc-min';
import i18next from '../../config/i18n.mjs';
//import { translateContent } from './ai-translator.mjs';

export async function translateArticle(article, targetLanguage = 'en') {
    try {
        // Ensure we have valid string content to analyze
        const textToAnalyze = (article.content || article.title || '').toString();
        
        if (!textToAnalyze) {
            console.warn('No content to analyze for language detection');
            return article;
        }

        // Detect language only if we have minimum content length
        const sourceLanguage = textToAnalyze.length >= 10 ? 
            franc(textToAnalyze) : article.language || 'en';

        // Map franc language codes to i18next codes
        const languageMap = {
            'eng': 'en',
            'fra': 'fr',
            'deu': 'de',
            'spa': 'es'
        };

        const mappedSourceLang = languageMap[sourceLanguage] || sourceLanguage;

        // Skip translation if already in target language
        if (mappedSourceLang === targetLanguage) {
            return { ...article, language: targetLanguage };
        }

        const translatedArticle = {
            ...article,
            title: i18next.t(article.title, {
                lng: targetLanguage,
                defaultValue: article.title
            }),
            content: i18next.t(article.content, {
                lng: targetLanguage,
                defaultValue: article.content
            }),
            language: targetLanguage
        };
        return translatedArticle;
    } catch (error) {
        console.error('Translation error:', error);
        return article;
    }
}