import PQueue from 'p-queue';
import { translateArticle } from '../utils/translation.mjs';

const queue = new PQueue({
    concurrency: 2, // Number of concurrent translations
    interval: 1000, // Time in ms
    intervalCap: 2  // Number of translations per interval
});

// Add event listeners for queue monitoring
queue.on('active', () => {
    console.log(`Working on translation. Queue size: ${queue.size}`);
});

queue.on('error', error => {
    console.error('Queue error:', error);
});

const COOLDOWN_PERIOD = 60000; // 1 minute
let lastRateLimitHit = 0;

export async function queueTranslation(article, targetLanguage) {
    return queue.add(async () => {
        try {
            if (Date.now() - lastRateLimitHit < COOLDOWN_PERIOD) {
                console.warn('Rate limit hit. Waiting for cooldown...');
                return null;
            }

            return await translateArticle(article, targetLanguage);
        } catch (error) {
            if (error.status === 429) {
                console.warn('Rate limit hit. Waiting for cooldown...');
                lastRateLimitHit = Date.now();
                return null;
            }
            console.error('Translation error:', error);
            return null;
        }
    });
}