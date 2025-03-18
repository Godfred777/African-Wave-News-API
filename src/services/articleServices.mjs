import { db } from "../config/firebaseConfig.mjs";
import { queueTranslation } from "../utils/translationQueue.mjs";
import { parseRSSFeeds } from "../services/parsers/rssParser.mjs";


const DEFAULT_LIMIT = 10;

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
        const transtationPromises = articles
        .slice(0, limit)
        .map(article => queueTranslation(article, targetLanguage));
        return await Promise.all(transtationPromises);
    } catch (error) {
        console.error(error);
        return [];
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
                promises.push(queueTranslation(doc.data(), 'fr'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function tranlateArticleInGerman(limit = DEFAULT_LIMIT) {
    try {
        const snapshot = await db.collection('articles').limit(limit).get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'de') {
                articles.push(doc.data());
            } else {
                promises.push(queueTranslation(doc.data(), 'de'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function tranlateArticleInSpanish(limit = DEFAULT_LIMIT) {
    try {
        const snapshot = await db.collection('articles').limit(limit).get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'es') {
                articles.push(doc.data());
            } else {
                promises.push(queueTranslation(doc.data(), 'es'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function tranlateArticleInEnglish(limit = DEFAULT_LIMIT) {
    try {
        const snapshot = await db.collection('articles').limit(limit).get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'en') {
                articles.push(doc.data());
            } else {
                promises.push(queueTranslation(doc.data(), 'en'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}