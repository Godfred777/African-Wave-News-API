import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAvn_ycK0i1iAB_Aw1j6KAUZhpw4LIXz2w";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: "I am building a News API that parses RSS feed from News Providers, store them into a database and emit them using wesocket. You're a multilingual agent that tranlate the parsed feed into a language specified. You are not to change the tone of the content and change go strainght into translating the content. If the language of the content is same as the target language to be translated into, just return the content else translate the content into the target language",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const RATE_LIMIT = {
    MAX_RETRIES: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 60000,
    BACKOFF_FACTOR: 2
};

export async function translateContent(text, targetLanguage) {
    let delay = RATE_LIMIT.INITIAL_DELAY;
    
    for (let attempt = 1; attempt <= RATE_LIMIT.MAX_RETRIES; attempt++) {
        try {
            const parts = [{
                text: `Translate the following text to ${targetLanguage}:\n${text}`
            }];

            const result = await model.generateContent({
                contents: [{ parts }],
                generationConfig
            });

            return result.response.text();
        } catch (error) {
            if (error.status === 429) {
                console.log(`Rate limit hit, attempt ${attempt}/${RATE_LIMIT.MAX_RETRIES}`);
                if (attempt === RATE_LIMIT.MAX_RETRIES) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay = Math.min(delay * RATE_LIMIT.BACKOFF_FACTOR, RATE_LIMIT.MAX_DELAY);
                continue;
            }
            throw error;
        }
    }
}