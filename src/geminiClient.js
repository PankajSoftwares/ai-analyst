const { GoogleGenerativeAI } = require('@google/generative-ai');
const { geminiApiKey } = require('./config');

const genAI = new GoogleGenerativeAI(geminiApiKey);

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response with Gemini:', error);
    throw error;
  }
}

module.exports = { generateResponse };
