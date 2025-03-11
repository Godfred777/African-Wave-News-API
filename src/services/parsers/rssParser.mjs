import Parser from "rss-parser";
import { createArticle } from "../articleServices.mjs";


const feedUrls = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://ir.thomsonreuters.com/rss/news-releases.xml?items=15',
    'https://ir.thomsonreuters.com/rss/events.xml?items=15',
    'https://rss.app/feeds/EYs0ADiO5vo7soom.xml',
    'https://rss.app/feeds/0UB6a3TrjPwAaIlg.xml',
    'https://www.cgtn.com/subscribe/rss/section/china.xml',
    'https://www.cgtn.com/subscribe/rss/section/world.xml',
   // 'https://www.senenews.com/rss/rss-all.xml',
];

const parser = new Parser({
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
});

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await parser.parseURL(url);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

export async function parseRSSFeeds() {
    try {
        const articles = [];
        for (const url of feedUrls) {
            const feed = await fetchWithRetry(url);
            feed.items.forEach(async (item) => {
                const article = {
                    title: item.title || '',
                    link: item.link || '',
                    pubDate: item.pubDate || new Date().toISOString(),
                    content: item.content || '',
                    language: item.language || 'en'
                };
                const id = await createArticle(article);
                articles.push({ ...article, id });
            });
        }
        return articles;
    } catch (error) {
        console.error(error);
        return null;
    }
}
