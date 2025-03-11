import { parseRSSFeeds } from "./parsers/rssParser.mjs";

export async function emitFeed(socket) {
    try {
        const articles = await parseRSSFeeds();
        socket.emit('feed', articles);
    } catch (error) {
        console.error(error);
    }
}