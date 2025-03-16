import { db } from "../config/firebaseConfig.mjs";
import { translateArticle } from "../utils/translators/translation.mjs";
import { parseRSSFeeds } from "../services/parsers/rssParser.mjs";


const DEFAULT_LIMIT = 20;

export async function createArticle(article) {
    try {
        const docRef = await db.collection('articles').add(article);
        await docRef.set({
            title: article.title,
            link: article.link,
            pubDate: article.pubDate,
            content: article.content,
            language: article.language,
            id: docRef.id
        }, { merge: true });
        return docRef.id;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllArticles(limit = DEFAULT_LIMIT) {
    try {
        const snapshot = await db.collection('articles').limit(limit).get();
        const articles = [];
        snapshot.forEach((doc) => {
            articles.push(doc.data());
        });
        return articles;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function translatedFeed(targetLanguage, limit = DEFAULT_LIMIT) {
    try {
        const articles = await parseRSSFeeds();
        const translatedArticles = [];
        for (const article of articles.slice(0, limit)) {
            const translatedArticle = await translateArticle(article, targetLanguage);
            translatedArticles.push(translatedArticle);
        }
        return translatedArticles;
    } catch (error) {
        console.error(error);
    }

}

export async function tranlateArticleInFrench(limit = DEFAULT_LIMIT) {
    try {
        const snapshot = await db.collection('articles').limit(limit).get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'fr') {
                articles.push(doc.data());
            } else {
                promises.push(translateArticle(doc.data(), 'fr'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}