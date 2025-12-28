import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const verifyGemini = async () => {
    try {
        console.log('Checking Gemini API Key...');
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is missing in .env');
        }
        console.log('GEMINI_API_KEY exists.');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Use standard model for test

        console.log('Sending test prompt to Gemini...');
        const result = await model.generateContent('Say "Hello World" if you receive this.');
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Response:', text);
        console.log('Gemini API verification SUCCESS!');
    } catch (error) {
        console.error('Gemini API verification FAILED:', error.message);
    }
};

verifyGemini();
