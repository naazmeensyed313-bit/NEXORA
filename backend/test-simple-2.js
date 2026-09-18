require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testSimple() {
  console.log("Testing API with GEMINI_API_KEY only...");
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: "Say hello",
    });
    console.log("✅ Got response:", response.text);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testSimple();

