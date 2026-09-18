require("dotenv").config({ path: require('path').join(__dirname, '.env'), override: true });

// Force the SDK to use the key from .env instead of a global Windows env variable
if (process.env.GEMINI_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
}

console.log("Starting server...");
console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  const startTime = Date.now();
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
      console.error("Invalid idea input:", idea);
      return res.status(400).json({
        error: "Invalid idea input. Please provide a non-empty string.",
      });
    }

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
    console.log("Calling Gemini API for idea:", idea.substring(0, 50) + "...");
    const apiStartTime = Date.now();

    // Use gemini-2.5-flash with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API timeout (30s)")), 30000)
    );

    const apiPromise = ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "models/gemini-2.5-flash",
      contents: prompt,
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    const apiTime = Date.now() - apiStartTime;
    console.log(`⏱️ Gemini API response time: ${apiTime}ms`);
    console.log(`✅ Successfully used model: models/gemini-2.5-flash`);

    if (!response || !response.text) {
      console.error("Empty response from Gemini API");
      return res.status(500).json({
        error: "Gemini API returned empty response",
      });
    }

    let text = response.text;
    console.log("Gemini raw response:", text.substring(0, 200));

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (jsonError) {
      console.error("Failed to parse Gemini response as JSON:", jsonError.message);
      console.error("Response text:", text);
      return res.status(500).json({
        error: "Failed to parse Gemini response. Invalid JSON format.",
        details: jsonError.message,
      });
    }

    // Validate required fields
    if (!parsedData.innovation || !parsedData.feasibility || !parsedData.demand || !parsedData.complexity) {
      console.error("Missing required fields in Gemini response:", parsedData);
      return res.status(500).json({
        error: "Gemini response missing required fields",
        received: Object.keys(parsedData),
      });
    }

    const data = normalizeAnalysis(parsedData, idea);
    const totalTime = Date.now() - startTime;
    console.log(`✅ Analysis completed successfully in ${totalTime}ms\n`);

    res.json(data);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error("\n❌ ERROR in /analyze endpoint after " + elapsed + "ms:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack.substring(0, 500));
    }

    res.status(500).json({
      error: "Analysis failed",
      details: error.message,
      type: error.name,
    });
  }
});

app.post("/innovation", async (req, res) => {
  const startTime = Date.now();
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
      return res.status(400).json({ error: "Invalid idea input." });
    }

    const prompt = `
You are NEXORA, an expert market analyst and innovation evaluator.

Analyze this exact idea:
"${idea}"

Evaluate its uniqueness, market saturation, and identify competitors.
Return ONLY valid JSON with this exact shape:
{
  "uniquenessScore": number (0 to 10.0, e.g. 7.5),
  "saturationPercent": number (0 to 100),
  "marketScore": number (0 to 100),
  "originalityScore": number (0 to 100),
  "techReadiness": number (0 to 100),
  "satLevel": "Low" | "Medium" | "High",
  "differentiationOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "competitors": [
    { "name": "CompetitorName", "icon": "fa-globe", "description": "short description", "similarity": number (0 to 100) }
  ],
  "uniquenessSummary": "A 40-word summary of the uniqueness and market opportunity.",
  "uniquenessFactors": ["factor 1", "factor 2", "factor 3"],
  "confidence": number (60 to 100)
}

Rules:
1. Provide 3-4 differentiationOpportunities.
2. Provide up to 4 competitors. Valid icons include: fa-globe, fa-robot, fa-credit-card, fa-heart-pulse, fa-graduation-cap, fa-cloud.
3. uniquenessSummary must be a detailed paragraph evaluating the idea's standing.
4. satLevel should be "Low" if saturationPercent < 35, "Medium" if < 65, else "High".
`;

    console.log("Calling Gemini API for /innovation:", idea.substring(0, 50) + "...");
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API timeout (30s)")), 30000)
    );

    const apiPromise = ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "models/gemini-2.5-flash",
      contents: prompt,
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini API");
    }

    let text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    console.log("Innovation analysis completed.");
    res.json(data);
  } catch (error) {
    console.error("ERROR in /innovation endpoint:", error.message);
    console.warn("⚠️ Using local mock data generator due to API failure");
    
    // Fallback data
    const mockData = {
      uniquenessScore: 7.2,
      saturationPercent: 45,
      marketScore: 68,
      originalityScore: 75,
      techReadiness: 60,
      satLevel: "Medium",
      differentiationOpportunities: [
        "Leverage a niche target audience to build initial traction.",
        "Implement gamification to increase user retention.",
        "Integrate with popular existing platforms for easier onboarding."
      ],
      competitors: [
        { name: "Existing Sol A", icon: "fa-globe", description: "Standard platform", similarity: 75 },
        { name: "Legacy System", icon: "fa-server", description: "Older enterprise tool", similarity: 50 }
      ],
      uniquenessSummary: "While the core concept shares similarities with existing platforms, there is a clear opportunity to differentiate through focused execution and specialized features.",
      uniquenessFactors: ["Focused use-case", "Modern UX/UI", "Community-driven"],
      confidence: 80
    };
    
    res.json(mockData);
  }
});

app.post("/api/future-simulator", async (req, res) => {
  const startTime = Date.now();
  try {
    const { idea, industry, stage } = req.body;

    if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
      return res.status(400).json({ error: "Invalid idea input." });
    }

    const prompt = `
You are NEXORA, a business projection and future impact simulator.

Analyze this project idea:
Idea: "${idea}"
Industry: "${industry || 'Unknown'}"
Current Stage: "${stage || 'Unknown'}"

Project its future trajectory.
Return ONLY valid JSON with this exact shape:
{
  "successProb": number (0 to 100, representing percentage chance of success),
  "mvp": "estimated time e.g. 4 Months",
  "earlyUsers": "estimated user range e.g. 1,000–2,500",
  "ttm": "time to market e.g. 7 Months",
  "roi": "estimated ROI e.g. 220%",
  "risks": [
    { "name": "Technical Risk", "level": "low"|"medium"|"high", "icon": "⚙️", "desc": "description", "mitigation": "mitigation plan" },
    { "name": "Market Risk", "level": "low"|"medium"|"high", "icon": "📊", "desc": "...", "mitigation": "..." },
    { "name": "Financial Risk", "level": "low"|"medium"|"high", "icon": "💰", "desc": "...", "mitigation": "..." },
    { "name": "Adoption Risk", "level": "low"|"medium"|"high", "icon": "👥", "desc": "...", "mitigation": "..." }
  ],
  "timeline": [
    { "icon": "🔬", "label": "Research", "duration": "2–3 Weeks", "desc": "description" },
    { "icon": "🏗️", "label": "MVP Dev", "duration": "...", "desc": "..." },
    { "icon": "🧪", "label": "Testing", "duration": "...", "desc": "..." },
    { "icon": "🚀", "label": "Beta Launch", "duration": "...", "desc": "..." },
    { "icon": "🌐", "label": "Public Launch", "duration": "...", "desc": "..." },
    { "icon": "📈", "label": "Scaling", "duration": "...", "desc": "..." }
  ],
  "insights": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "scenarios": {
    "optimistic": { "title": "🟢 Optimistic Scenario", "color": "#00ff88", "outcomes": ["o1","o2","o3"], "risks": ["r1","r2"], "opportunities": ["op1","op2"] },
    "realistic": { "title": "🟡 Realistic Scenario", "color": "#ffbe00", "outcomes": ["o1","o2","o3"], "risks": ["r1","r2"], "opportunities": ["op1","op2"] },
    "pessimistic": { "title": "🔴 Pessimistic Scenario", "color": "#ff3b5c", "outcomes": ["o1","o2","o3"], "risks": ["r1","r2"], "opportunities": ["op1","op2"] }
  }
}

Rules:
1. Tailor ALL risks, timelines, insights, and scenarios specifically to the given Idea and Industry.
2. successProb should reflect realistic odds given the industry and stage.
`;

    console.log("Calling Gemini API for /api/future-simulator:", idea.substring(0, 50) + "...");
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API timeout (25s)")), 25000)
    );

    const apiPromise = ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "models/gemini-2.5-flash",
      contents: prompt,
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini API");
    }

    let text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);
    
    data.failProb = 100 - (data.successProb || 70);

    // Generate chartData based on successProb
    const successProb = data.successProb || 70;
    const months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
    const userGrowth = months.map((_, i) => Math.round((i * i * 18 + i * 50) * (successProb / 80)));
    const revGrowth  = months.map((_, i) => Math.round((i * i * 2.5 + i * 8) * (successProb / 80)));
    const adoptOpt   = months.map((_, i) => Math.min(100, Math.round(i * 9.5)));
    const adoptReal  = months.map((_, i) => Math.min(80,  Math.round(i * 6.8)));
    const adoptPess  = months.map((_, i) => Math.min(55,  Math.round(i * 4.5)));
    
    data.chartData = { months, userGrowth, revGrowth, adoptOpt, adoptReal, adoptPess };

    console.log("Future Simulation completed.");
    res.json(data);
  } catch (error) {
    console.error("ERROR in /api/future-simulator endpoint:", error.message);
    res.status(500).json({ error: "Simulation failed", details: error.message });
  }
});

app.post("/architecture", async (req, res) => {
  const startTime = Date.now();
  try {
    const { idea } = req.body;

    if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
      return res.status(400).json({ error: "Invalid idea input." });
    }

    const prompt = `
You are NEXORA, an expert software architect.

Analyze this project idea:
"${idea}"

Design a high-level system architecture flowchart.
Return ONLY valid JSON with this exact shape:
{
  "tiers": [
    {
      "name": "Presentation Layer",
      "nodes": [
        { "name": "Web App", "icon": "fa-desktop", "desc": "User interface", "tech": ["React", "Tailwind"] }
      ]
    },
    {
      "name": "Application Layer",
      "nodes": [
        { "name": "Core API", "icon": "fa-server", "desc": "Business logic", "tech": ["Node.js", "Express"] }
      ]
    },
    {
      "name": "Data Layer",
      "nodes": [
        { "name": "Database", "icon": "fa-database", "desc": "Storage", "tech": ["PostgreSQL"] }
      ]
    }
  ]
}

Rules:
1. You must have 3 or 4 tiers (e.g. Presentation, Application, AI/Processing, Data).
2. Each tier should have 1 to 3 nodes.
3. Tailor the tech stack and descriptions specifically to the idea.
4. Use valid font-awesome icons (e.g. fa-mobile, fa-desktop, fa-server, fa-database, fa-brain, fa-cloud, fa-microchip).
`;

    console.log("Calling Gemini API for /architecture:", idea.substring(0, 50) + "...");
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API timeout (25s)")), 25000)
    );

    const apiPromise = ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "models/gemini-2.5-flash",
      contents: prompt,
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini API");
    }

    let text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    console.log("Architecture analysis completed.");
    res.json(data);
  } catch (error) {
    console.error("ERROR in /architecture endpoint:", error.message);
    console.warn("⚠️ Using local mock data generator due to API failure");

    // Fallback data
    const mockData = {
      tiers: [
        {
          name: "Presentation Layer",
          nodes: [
            { name: "Web App", icon: "fa-desktop", desc: "User interface", tech: ["React", "CSS"] },
            { name: "Mobile App", icon: "fa-mobile", desc: "Native application", tech: ["React Native"] }
          ]
        },
        {
          name: "Application Layer",
          nodes: [
            { name: "API Gateway", icon: "fa-server", desc: "Routing and auth", tech: ["Node.js", "Express"] },
            { name: "AI Engine", icon: "fa-brain", desc: "Processing logic", tech: ["Python", "TensorFlow"] }
          ]
        },
        {
          name: "Data Layer",
          nodes: [
            { name: "Main DB", icon: "fa-database", desc: "User storage", tech: ["PostgreSQL"] },
            { name: "Cache", icon: "fa-bolt", desc: "Fast data retrieval", tech: ["Redis"] }
          ]
        }
      ]
    };

    res.json(mockData);
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { message, ideaContext } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Invalid message input." });
    }

    const systemPrompt = `You are the AI mentor of NEXORA.

NEXORA is an AI-powered platform that transforms raw ideas into structured, validated, and actionable project blueprints.

Your role is not to act as a generic chatbot. You must behave like a startup consultant, innovation strategist, technical architect, and future planning advisor.

Capabilities:

1. Understand the user's startup/project idea.
2. Guide users through Idea Analysis by evaluating strengths, weaknesses, feasibility, innovation, and market potential.
3. Assist in Innovation Detection by discussing competitors, uniqueness, differentiation, and USP suggestions.
4. Recommend suitable technologies, architectures, APIs, databases, and deployment approaches.
5. Act as a Future Simulator by generating optimistic, realistic, and pessimistic future scenarios.
6. Identify business, technical, financial, adoption, and execution risks and provide mitigation strategies.
7. Suggest MVP features and prioritization.
8. Recommend next actionable steps after each response.
9. Maintain a professional, encouraging, and mentor-like tone.
10. Never provide random answers unrelated to the user's idea. Always connect the response back to the user's project context.

At the end of every response, include:
• Key Insight
• Recommended Action
• Next Question the user should consider.

User's Project Idea Context: "${ideaContext || 'No specific idea provided yet. Ask them about their idea.'}"
`;

    const apiPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nUser Message: " + message }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    const response = await apiPromise;
    const responseText = response.text;

    res.json({ reply: responseText });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

function normalizeAnalysis(data, idea = "") {
  const complexity = normalizeComplexity(data.complexity);
  const fallback = estimateScoresFromIdea(idea);

  const normalized = {
    innovation: normalizeScore(data.innovation, fallback.innovation),
    feasibility: normalizeScore(data.feasibility, fallback.feasibility),
    demand: normalizeScore(data.demand, fallback.demand),
    complexity,
    complexityNote: getComplexityNote(complexity),
    summary:
      typeof data.summary === "string" && data.summary.trim()
        ? data.summary.trim()
        : "This idea has promising innovation potential with practical scope for validation.",
    suggestions:
      Array.isArray(data.suggestions) && data.suggestions.length
        ? data.suggestions.map(String).filter(Boolean).slice(0, 5)
        : ["Validate user demand", "Improve scalability", "Refine launch and scaling plan"],
  };

  return calibrateScores(normalized, idea);
}

function normalizeScore(value, fallback) {
  const score = Number.parseInt(String(value).replace("%", ""), 10);

  if (Number.isNaN(score)) {
    return fallback;
  }

  return Math.min(Math.max(score, 60), 100);
}

function normalizeComplexity(value) {
  const complexity = String(value || "").trim().toLowerCase();

  if (complexity === "low") {
    return "Low";
  }

  if (complexity === "high") {
    return "High";
  }

  return "Medium";
}

function getComplexityNote(complexity) {
  const notes = {
    Low: "Quick prototype",
    Medium: "Balanced build",
    High: "Advanced build",
  };

  return notes[complexity];
}

function estimateScoresFromIdea(idea) {
  const text = String(idea || "").toLowerCase();
  const lengthBoost = Math.min(Math.floor(text.length / 90), 5);
  const hasAdvancedTech = hasAny(text, [
    "ai",
    "machine learning",
    "predictive",
    "blockchain",
    "iot",
    "robot",
    "ar",
    "vr",
    "computer vision",
    "automation",
  ]);
  const hasMarketSignal = hasAny(text, [
    "students",
    "patients",
    "farmers",
    "business",
    "users",
    "customers",
    "healthcare",
    "education",
    "finance",
    "sustainability",
  ]);
  const hasHardBuildSignal = hasAny(text, [
    "hardware",
    "medical",
    "drone",
    "robot",
    "real-time",
    "blockchain",
    "iot",
    "compliance",
  ]);

  return {
    innovation: clampScore(72 + lengthBoost + (hasAdvancedTech ? 10 : 0) + (hasMarketSignal ? 4 : 0)),
    feasibility: clampScore(86 + lengthBoost - (hasHardBuildSignal ? 14 : 0)),
    demand: clampScore(70 + lengthBoost + (hasMarketSignal ? 13 : 0) + (hasAdvancedTech ? 3 : 0)),
    complexity: estimateComplexityFromIdea(text),
  };
}

function calibrateScores(data, idea) {
  const estimated = estimateScoresFromIdea(idea);
  const complexity =
    data.complexity === "Medium" && estimated.complexity !== "Medium"
      ? estimated.complexity
      : data.complexity;

  const calibrated = {
    ...data,
    innovation: blendScore(data.innovation, estimated.innovation),
    feasibility: blendScore(data.feasibility, estimated.feasibility),
    demand: blendScore(data.demand, estimated.demand),
    complexity,
  };

  return {
    ...calibrated,
    complexityNote: getComplexityNote(calibrated.complexity),
  };
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function clampScore(score) {
  return Math.min(Math.max(score, 60), 100);
}

function blendScore(geminiScore, estimatedScore) {
  return clampScore(Math.round(geminiScore * 0.65 + estimatedScore * 0.35));
}

function estimateComplexityFromIdea(text) {
  const hardSignals = [
    "hardware",
    "medical",
    "drone",
    "robot",
    "real-time",
    "blockchain",
    "iot",
    "compliance",
    "payment",
    "computer vision",
    "ar",
    "vr",
  ];
  const easySignals = ["landing page", "todo", "notes", "blog", "directory", "portfolio"];

  if (hasAny(text, hardSignals)) {
    return "High";
  }

  if (hasAny(text, easySignals)) {
    return "Low";
  }

  return "Medium";
}
