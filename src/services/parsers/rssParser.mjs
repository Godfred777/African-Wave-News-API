import Parser from "rss-parser";
import { createArticle } from "../articleServices.mjs";
import https from "https";
import { detectLanguage } from "../../utils/languageDetection.mjs";


const feedUrls = [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://ir.thomsonreuters.com/rss/news-releases.xml?items=15',
    'https://ir.thomsonreuters.com/rss/events.xml?items=15',
    //'https://rss.app/feeds/EYs0ADiO5vo7soom.xml',
    //'https://rss.app/feeds/0UB6a3TrjPwAaIlg.xml',
    'https://www.cgtn.com/subscribe/rss/section/china.xml',
    'https://www.cgtn.com/subscribe/rss/section/world.xml',
   // 'https://www.senenews.com/rss/rss-all.xml',
];

const parser = new Parser({
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    },
    customFields: {
        item: ['content', 'contentSnippet', 'language']
    },
    requestOptions: {
        agent: new https.Agent({
            rejectUnauthorized: false,
            keepAlive: true,
            timeout: 60000
        })
    }

});

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await parser.parseURL(url);
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed for ${url}: ${error.message}`);
            if (i === retries - 1) throw error;
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, i)));
        }
    }
}

export async function parseRSSFeeds() {
    try {
        const articles = [];
        for (const url of feedUrls) {
            try {
                const feed = await fetchWithRetry(url);
                for (const item of feed.items) {

                    const language = await detectLanguage(item.content || item.contentSnippet || '');

                    const article = {
                        title: item.title || '',
                        link: item.link || '',
                        pubDate: item.pubDate || new Date().toISOString(),
                        content: item.content || item.contentSnippet || '',
                        language: item.language || language || 'en'
                    };
                    const id = await createArticle(article);
                    articles.push({ ...article, id });
                }
            } catch (error) {
                console.error(`Failed to fetch feed from ${url}:`, error.message);
                continue;
            }
        }
        return articles;
    } catch (error) {
        console.error('Failed to parse RSS feeds:', error);
        return [];
    }
}
