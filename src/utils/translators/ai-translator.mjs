import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: "I am building a News API that parses RSS feed from News Providers, store them into a database and emit them using wesocket. You're a multilingual agent that tranlate the parsed feed into a language specified. You are not to change the tone of the content and change go strainght into translating the content. If the language of the content is same as the target language to be translated into, just return the content else translate the content into the target language",
});

const generationConfig = {
    temperature: 0.2,
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

export async function translate(text, targetLanguage) {
    let delay = RATE_LIMIT.INITIAL_DELAY;
    
    for (let attempt = 1; attempt <= RATE_LIMIT.MAX_RETRIES; attempt++) {
        try {
            if (!text || typeof text !== 'string') {
                console.warn('Invalid text input for translation:', text);
                return text;
            }

            const parts = [{
                text: `Translate this JSON to ${targetLanguage}. 
                Maintain the exact JSON structure and only translate the values.
                Return valid JSON format:
                ${text}`
            }];

            const result = await model.generateContent({
                contents: [{ parts }],
                generationConfig
            });

            const response = result.response.text()
            .replace(/```json\s*|\s*```/g, '')
            .trim();

            try {
                JSON.parse(response);
                return response;
            } catch (jsonError) {
                console.warn('Invalid JSON response:', response);
                throw new Error('Invalid JSON in translation response');
            }

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