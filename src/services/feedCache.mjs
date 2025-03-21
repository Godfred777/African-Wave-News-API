class FeedCache {
    constructor() {
        this.articles = [];
        this.translations = {
            fr: [],
            de: [],
            es: [],
        };
        this.lastUpdated = null;
    }

    updateCache(articles) {
        this.articles = articles;
        this.lastUpdated = new Date();
    }

    updateTranslations(language, articles) {
        if (!this.translations[language]) {
            this.translations[language] = [];
        }
        this.translations[language] = articles;
    }

    getTranslation(language) {
        return this.translations[language] || [];
    }

    getArticles() {
        return this.articles;
    }

    getLastUpdated() {
        return this.lastUpdated;
    }
}

export const feedCache = new FeedCache();