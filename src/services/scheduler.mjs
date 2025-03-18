import { parseRSSFeeds } from './parsers/rssParser.mjs';
import { feedCache } from './feedCache.mjs';
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

async function updateFeeds() {
    try {
        const articles = await parseRSSFeeds();
        feedCache.updateCache(articles);
        console.log(`Feeds updated at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Failed to update feeds:', error);
    }
}