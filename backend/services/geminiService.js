const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildTriagePrompt } = require("../prompts/triagePrompt");

const MODEL_NAME = "gemini-2.5-flash";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
};

const generateTriageText = async (symptoms) => {
  const client = getGeminiClient();
  if (!client) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  const model = client.getGenerativeModel({
    model: MODEL_NAME
  });

  const prompt = buildTriagePrompt(symptoms);
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    throw new Error(`Gemini request failed: ${error.message}`);
  }
};

module.exports = {
  generateTriageText
};
