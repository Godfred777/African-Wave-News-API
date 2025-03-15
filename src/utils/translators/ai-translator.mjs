import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAvn_ycK0i1iAB_Aw1j6KAUZhpw4LIXz2w";
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

const RATE_LIMIT = {
    MAX_RETRIES: 3,
    DELAY_MS: 1000,
    BACKOFF_FACTOR:2
};

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function translateContent(text, targetLanguage) {
    let retries = 0


   while (retries < RATE_LIMIT.MAX_RETRIES) {
     try {
         if (!text || typeof text !== 'string') {
             console.warn('Invalid text input for translation:', text);
             return text;
         }
 
         // Format request according to Gemini API specs
         const parts = [{
             text: `Translate the following text to ${targetLanguage}:\n${text}`
         }];
 
         const result = await model.generateContent({
             contents: [{ parts }],
             generationConfig
         });
 
         return result.response.text();
     } catch (error) {
        retries++;
        if (error.message.includes('429') || error.message.includes('quota')) {
            console.warn(`Rate limit hit, attempt ${retries}/${RATE_LIMIT.MAX_RETRIES}`);
            if (retries < RATE_LIMIT.MAX_RETRIES) {
                // Exponential backoff
                const waitTime = RATE_LIMIT.DELAY_MS * Math.pow(RATE_LIMIT.BACKOFF_FACTOR, retries);
                await delay(waitTime);
                continue;
                }
        }
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
     }
   }
   return text; // Return original text if max retries reached


}
