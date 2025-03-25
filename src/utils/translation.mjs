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

        const combinedText = JSON.stringify({
            title: article.title,
            content: article.content
        });

        try {
            const translatedJSON = await TranslationProvider.translate(combinedText, targetLanguage);
    
            const {title, content} = JSON.parse(translatedJSON);
            return {
                ...article,
                title,
                content,
                language: targetLanguage
            }; 
        } catch (parseError) {
            console.error('Failed to parse translation JSON:', parseError);
            return article;
        } 

    } catch (error) {
        throw error;
    }

}