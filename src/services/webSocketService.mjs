import { feedCache } from "../config/feedCache.mjs";


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
        const articles = feedCache.getTranslation('es');
        socket.emit('spanishFeed', articles);
    } catch (error) {
        console.error(error);
    }
}

export async function emitTranslatedFeedInFrench(socket) {
    try {
        const articles = feedCache.getTranslation('fr');
        socket.emit('frenchFeed', articles);
    } catch (error) {
        console.error(error);
    }
}

export async function emitTranslatedFeedInGerman(socket) {
    try {
        const articles = feedCache.getTranslation('de');
        socket.emit('germanFeed', articles);
    } catch (error) {
        console.error(error);
    }
}