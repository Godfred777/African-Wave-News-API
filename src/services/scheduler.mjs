import { parseRSSFeeds } from './parsers/rssParser.mjs';
import { feedCache } from './feedCache.mjs';
import { queueTranslation } from '../utils/translationQueue.mjs';
import cron from 'node-cron';

export function startFeedScheduler() {
    // Initial fetch
    updateFeeds();
    
    // Schedule updates every 30 minutes
    cron.schedule('*/30 * * * *', () => {
        console.log('Running scheduled feed update...');
        updateFeeds();
    });
}

const DEFAULT_LIMIT = 10;

// src/services/scheduler.mjs
async function updateFeeds() {
    try {
        const articles = await parseRSSFeeds();
        feedCache.updateCache(articles);

        const languages = ['fr', 'de', 'es'];
        for (const lang of languages) {
            const translations = [];
            for (const article of articles.slice(0, DEFAULT_LIMIT)) {
                try {
                    const translation = await queueTranslation(article, lang);
                    if (translation) translations.push(translation);
                } catch (error) {
                    console.error(`Translation failed for language ${lang}:`, error.message);
                }
            }
            feedCache.updateTranslations(lang, translations);
        }

        console.log(`Feeds and translations updated at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Failed to update feeds:', error);
    }
}