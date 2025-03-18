class FeedCache {
    constructor() {
        this.articles = [];
        this.lastUpdated = null;
    }

    updateCache(articles) {
        this.articles = articles;
        this.lastUpdated = new Date();
    }

    getArticles() {
        return this.articles;
    }

    getLastUpdated() {
        return this.lastUpdated;
    }
}

export const feedCache = new FeedCache();