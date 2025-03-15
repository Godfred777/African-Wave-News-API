import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-pro-exp-02-05",
    systemInstruction: "I am building a News API that parses RSS feed from News Providers, store them into a database and emit them using wesocket. You're a multilingual agent that tranlate the parsed feed into a language specified. You are not to change the tone of the content and change go strainght into translating the content. If the language of the content is same as the target language to be translated into, just return the content else translate the content into the target language",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function translateContent(inputText, targetLanguage) {
    try {
        const result = await model.generateContent({generationConfig, inputText:inputText, targetLanguage:targetLanguage});
        return result.response.text();
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}
