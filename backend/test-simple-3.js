const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI(); // Let it use the global env var

async function testSimple() {
  console.log("Testing API with no explicit key...");
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

