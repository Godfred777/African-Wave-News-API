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

export async function queueTranslation(article, targetLanguage) {
    return queue.add(async () => {
        try {
            return await translateArticle(article, targetLanguage);
        } catch (error) {
            console.error(`Translation failed for article: ${article.title}`, error);
            return article;
        }
    });
}