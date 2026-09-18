# NEXORA — From Idea to Impact 🚀

NEXORA is an AI-powered business projection and innovation evaluator designed to take raw ideas and turn them into fully execution-ready innovations. Built for hackathons, entrepreneurs, and developers, it helps you determine if an idea is worth building, how unique it is, what the architecture should look like, and how it will perform in the market.

## ✨ Features

- **🧠 Idea Analyzer**: Get AI-scored assessments across innovation, feasibility, complexity, and market demand, plus concrete next steps tailored to your idea.
- **🎯 Innovation Detector**: Analyze market saturation, discover similar existing solutions, and identify key differentiation opportunities.
- **🏗️ Algorithm Architect**: Generate an interactive, high-level system architecture flowchart showing exactly how your idea connects (from UI to AI engine).
- **📈 Future Impact Simulator**: Predict success probabilities, adoption rates, risks, and growth trajectories using an AI-powered simulation deck.
- **🤖 Integrated Chatbot**: A futuristic, AI-driven assistant available on every page to answer questions and brainstorm.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Custom Glassmorphism UI), Vanilla JavaScript
- **Backend**: Node.js, Express.js, CORS
- **AI Integration**: Google Gemini API (`@google/genai`)

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v14.0 or higher)
- **NPM** (Node Package Manager)
- A **Google Gemini API Key** (must start with `AIzaSy` or `AQ.`) from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 🚀 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naazmeensyed313-bit/NEXORA.git
   cd NEXORA
   ```

2. **Install dependencies:**
   This will install all necessary packages for both the root runner and the backend.
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Configure the Environment:**
   In the `backend/` folder, create a `.env` file (if it doesn't already exist) and add your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=models/gemini-2.5-flash
   ```

## ▶️ How to Run Locally

You can easily start both the frontend and backend servers at the same time using a single command from the root directory:

```bash
npm run dev
```

- The **Backend server** will start on `http://localhost:5000`
- The **Frontend website** will start on `http://localhost:3000` (Open this link in your browser to view the app).

## 🌐 Deployment Notes
If you plan to deploy this app to the public internet:
1. **Backend:** Deploy the `backend/` folder to a Node.js hosting service (like Render, Railway, or Heroku).
2. **Frontend:** Update all the API `fetch()` URLs in your frontend JavaScript files from `http://localhost:5000` to your new live backend URL.
3. Once updated, you can host the `frontend/` folder on GitHub Pages, Vercel, or Netlify.
