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

async function updateFeeds() {
    try {
        // Fetch and cache original articles
        const articles = await parseRSSFeeds();
        feedCache.updateCache(articles);

        // Update translations for each language
        const languages = ['fr', 'de', 'es'];
        await Promise.all(languages.map(async (lang) => {
            const translations = await Promise.all(
                articles
                .slice(0, DEFAULT_LIMIT)
                .map(article => queueTranslation(article, lang))
            );
            feedCache.updateTranslations(lang, translations);
        }));

        console.log(`Feeds and translations updated at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Failed to update feeds:', error);
    }
}