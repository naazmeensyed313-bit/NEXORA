require("dotenv").config({ path: require('path').join(__dirname, '.env'), override: true });

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testSimple() {
  console.log("Testing simple API call with timeout...");
  
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API call timeout (10s)")), 10000)
    );

    const promise = ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: "Say hello in 5 words",
    });

    const response = await Promise.race([promise, timeoutPromise]);
    console.log("✅ Got response:", response.text.substring(0, 100));
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testSimple();
