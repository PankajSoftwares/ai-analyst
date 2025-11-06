// Configuration file
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  googleCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY
};
