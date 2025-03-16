import { db } from "../config/firebaseConfig.mjs";
import { translateArticle } from "../utils/translators/translation.mjs";
import { parseRSSFeeds } from "../services/parsers/rssParser.mjs";


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

export async function translatedFeed(targetLanguage) {
    try {
        const articles = await parseRSSFeeds();
        const translatedArticles = [];
        for (const article of articles) {
            const translatedArticle = await translateArticle(article, targetLanguage);
            translatedArticles.push(translatedArticle);
        }
        return translatedArticles;
    } catch (error) {
        console.error(error);
    }

}