import { db } from "../config/firebaseConfig.mjs";
import { feedCache } from "../config/feedCache.mjs";
//import { queueTranslation } from "../utils/translationQueue.mjs";

//const DEFAULT_LIMIT = 10;

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

export async function getAllArticles() {
    try {
        const snapshot = await db.collection('articles').get();
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

export async function tranlateArticleInFrench() {
    try {
        const snapshot = await db.collection('articles').get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'fr') {
                articles.push(doc.data());
            } else {
                promises.push(feedCache.getTranslation('fr'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function tranlateArticleInGerman() {
    try {
        const snapshot = await db.collection('articles').get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'de') {
                articles.push(doc.data());
            } else {
                promises.push(feedCache.getTranslation('de'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function tranlateArticleInSpanish() {
    try {
        const snapshot = await db.collection('articles').get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'es') {
                articles.push(doc.data());
            } else {
                promises.push(feedCache.getTranslation('es'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function tranlateArticleInEnglish() {
    try {
        const snapshot = await db.collection('articles').get();
        const articles = [];
        const promises = [];
        
        snapshot.forEach((doc) => {
            if (doc.data().language === 'en') {
                articles.push(doc.data());
            } else {
                promises.push(feedCache.getTranslation('en'));
            }
        });
        
        const translatedArticles = await Promise.all(promises);
        return [...articles, ...translatedArticles];
    } catch (error) {
        console.error(error);
        return [];
    }
}