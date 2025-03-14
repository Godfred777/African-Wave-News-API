import { parseRSSFeeds } from "./parsers/rssParser.mjs";
import { translatedFeed } from "./articleServices.mjs";

export async function emitFeed(socket) {
    try {
        const articles = await parseRSSFeeds();
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