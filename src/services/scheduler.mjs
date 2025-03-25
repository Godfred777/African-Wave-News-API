import { parseRSSFeeds } from './parsers/rssParser.mjs';
import { feedCache } from '../config/feedCache.mjs';
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
        const articles = await parseRSSFeeds();
        feedCache.updateCache(articles);

        const languages = ['fr', 'de', 'es'];
        for (const lang of languages) {
            const translations = [];
            // Process in smaller batches
            const batchSize = 3;
            for (let i = 0; i < Math.min(articles.length, DEFAULT_LIMIT); i += batchSize) {
                const batch = articles.slice(i, i + batchSize);
                const batchTranslations = await Promise.all(
                    batch.map(article => queueTranslation(article, lang))
                );
                translations.push(...batchTranslations.filter(t => t !== null));
                
                // Add delay between batches
                if (i + batchSize < Math.min(articles.length, DEFAULT_LIMIT)) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
            feedCache.updateTranslations(lang, translations);
        }

        console.log(`Feeds and translations updated at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Failed to update feeds:', error);
    }
}