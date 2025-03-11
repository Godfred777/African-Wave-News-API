import { db } from "../config/firebaseConfig.mjs";

export async function createArticle(article) {
    try {
        const docRef = await db.collection('articles').add(article);
        await docRef.set({
            title: article.title,
            link: article.link,
            pubDate: article.pubDate,
            content: article.content,
            language: article.language,
            source: article.source,
            translations: article.translations,
            id: docRef.id
        });
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