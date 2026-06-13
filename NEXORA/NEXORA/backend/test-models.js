require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
  try {
    console.log("Attempting to list available models...");
    
    // Try to get models list
    const response = await ai.models.list();
    console.log("Available models:", response);
    
  } catch (error) {
    console.error("Error listing models:", error.message);
    
    // Try alternative SDK
    console.log("\n--- Trying alternative SDK setup ---");
    try {
      const { GoogleGenerativeAI } = require("google-generative-ai");
      const aiAlt = new GoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      
      // Test a simple model
      const model = aiAlt.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("test");
      console.log("✅ Alternative SDK works! Model: gemini-1.5-flash");
      console.log("Response:", result.response.text().substring(0, 100));
    } catch (altError) {
      console.error("Alternative SDK also failed:", altError.message);
    }
  }
}

listModels();
