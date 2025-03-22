import { TranslationProvider } from './translationProvider.mjs';
import { detectLanguage } from './languageDetection.mjs'; 

export async function translateArticle(article, targetLanguage = 'en') {
    try {
        // Ensure we have valid string content to analyze
        const textToAnalyze = (article.content || article.title || '').toString();
        
        if (!textToAnalyze) {
            console.warn('No content to analyze for language detection');
            return article;
        }

        // Use detectLanguage function to determine source language
        const sourceLanguage = await detectLanguage(textToAnalyze);

        // Skip translation if already in target language
        if (sourceLanguage === targetLanguage) {
            return { ...article, language: targetLanguage };
        }

        // Translate article content and title
        const translatedArticle = {
            ...article,
            title: await TranslationProvider.translate(article.title, targetLanguage),
            content: await TranslationProvider.translate(article.content, targetLanguage),
            language: targetLanguage
        };
        return translatedArticle;
    } catch (error) {
        //console.error('Translation error:', error);
        throw error;
    }
}
