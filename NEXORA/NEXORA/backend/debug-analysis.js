require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testAnalysis() {
  const idea = "AI medical diagnostic tool for analyzing medical imaging using computer vision";
  
  console.log("=".repeat(60));
  console.log("TESTING GEMINI API ANALYSIS");
  console.log("=".repeat(60));
  
  try {
    const prompt = `
You are NEXORA, an expert innovation evaluator for hackathon ideas.

Analyze this exact idea:
"${idea}"

Score the idea based ONLY on the idea text. Do not reuse generic scores.

Scoring rubric:
- innovation: originality, technical novelty, differentiation from existing solutions.
- feasibility: how practical it is to build an MVP with common hackathon resources.
- demand: market/user need, urgency, audience size, adoption potential.
- complexity: implementation difficulty based on integrations, AI, hardware, regulations, data, security, and infrastructure.

Rules:
1. innovation, feasibility, and demand must be integers from 60 to 100.
2. Use meaningfully different scores for weak, average, and strong ideas.
3. Do not give all ideas the same score pattern.
4. complexity must be exactly "Low", "Medium", or "High".
5. summary must be maximum 40 words and specific to the idea.
6. suggestions must be 3 to 5 short, specific action items.
7. Return only valid JSON with this exact shape:
{
  "innovation": number,
  "feasibility": number,
  "demand": number,
  "complexity": "Low | Medium | High",
  "summary": string,
  "suggestions": string[]
}
`;

    console.log("Step 1: Sending request to Gemini...");
    console.log("Models to try: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash");
    
    const modelsToTry = [
      "models/gemini-2.5-flash",
      "models/gemini-2.5-pro",
      "models/gemini-2.0-flash",
    ];
    
    let response;
    for (const model of modelsToTry) {
      try {
        console.log(`\nTrying model: ${model}`);
        response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (err) {
        console.log(`❌ Model ${model} failed:`, err.message);
        continue;
      }
    }
    
    if (!response) {
      throw new Error("All models failed!");
    }
    
    console.log("\nStep 2: Got response from Gemini");
    console.log("Response type:", typeof response);
    console.log("Response has text:", !!response.text);
    
    let text = response.text;
    console.log("\nStep 3: Raw response (first 300 chars):");
    console.log(text.substring(0, 300));
    
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    console.log("\nStep 4: Cleaned response (first 300 chars):");
    console.log(text.substring(0, 300));
    
    console.log("\nStep 5: Attempting to parse JSON...");
    let parsedData = JSON.parse(text);
    console.log("✅ Successfully parsed JSON");
    console.log("Parsed data:", JSON.stringify(parsedData, null, 2));
    
    console.log("\nStep 6: Validating required fields...");
    const required = ["innovation", "feasibility", "demand", "complexity"];
    for (const field of required) {
      if (!parsedData[field]) {
        console.error(`❌ Missing field: ${field}`);
      } else {
        console.log(`✅ Field ${field}: ${parsedData[field]}`);
      }
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS PASSED!");
    console.log("=".repeat(60));
    
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ TEST FAILED!");
    console.error("=".repeat(60));
    console.error("Error Type:", error.name);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
    }
  }
}

testAnalysis();
