//import { parseRSSFeeds } from "./parsers/rssParser.mjs";
import { queueTranslation } from "../utils/translationQueue.mjs";
import { feedCache } from "./feedCache.mjs";

const DEFAULT_LIMIT = 10;

export async function translatedFeed(targetLanguage, limit = DEFAULT_LIMIT) {
    try {
        const articles = feedCache.getArticles();
        const transtationPromises = articles
        .slice(0, limit)
        .map(article => queueTranslation(article, targetLanguage));
        return await Promise.all(transtationPromises);
    } catch (error) {
        console.error(error);
        return [];
    }

}

export async function emitFeed(socket) {
    try {
        const articles = feedCache.getArticles();
        socket.emit('feed', articles);
    } catch (error) {
        console.error(error);
    }
}

export async function emitTranslatedFeedInSpanish(socket) {
    try {
        const articles = await translatedFeed('es');
        socket.emit('spanishFeed', articles);
    } catch (error) {
        console.error(error);
    }
}

export async function emitTranslatedFeedInFrench(socket) {
    try {
        const articles = await translatedFeed('fr');
        socket.emit('frenchFeed', articles);
    } catch (error) {
        console.error(error);
    }
}

export async function emitTranslatedFeedInGerman(socket) {
    try {
        const articles = await translatedFeed('de');
        socket.emit('germanFeed', articles);
    } catch (error) {
        console.error(error);
    }
}