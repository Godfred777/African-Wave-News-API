import { franc } from 'franc-min';

export function detectLanguage(text) {
    if (!text || typeof text !== 'string') {
        return 'en';
    }

    const supportedLanguages = {
        'eng': 'en',
        'fra': 'fr',
        'deu': 'de',
        'spa': 'es'
    };

    try {
        const detected = franc(text);
        return supportedLanguages[detected] || 'en';
    } catch (error) {
        console.error('Language detection error:', error);
        return 'en';
    }
}