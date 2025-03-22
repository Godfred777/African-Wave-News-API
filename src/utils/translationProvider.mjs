import { translate as geminiTranslate } from './translators/ai-translator.mjs';
import i18next from '../config/i18n.mjs';

export class TranslationProvider {
    static async translate(text, targetLanguage) {
        try {
            // Try Gemini first
            const geminiResult = await geminiTranslate(text, targetLanguage);
            if (geminiResult) return geminiResult;

            // Fallback to i18next if Gemini fails
            console.log('Falling back to i18next translation');
            return i18next.t(text, {
                lng: targetLanguage,
                defaultValue: text,
                fallbackLng: 'en'
            });
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Return original text if both methods fail
        }
    }
}