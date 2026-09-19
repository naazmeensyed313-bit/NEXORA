# Nexora

Nexora is an AI-powered business projection and innovation evaluator designed to take raw ideas and turn them into fully execution-ready innovations. It helps you determine if an idea is worth building, how unique it is, what the architecture should look like, and how it will perform in the market.

## Key Features

- **Idea Analyzer:** Get AI-scored assessments across innovation, feasibility, complexity, and market demand, plus concrete next steps tailored to your idea.
- **Innovation Detector:** Analyze market saturation, discover similar existing solutions, and identify key differentiation opportunities.
- **Algorithm Architect:** Generate an interactive, high-level system architecture flowchart showing exactly how your idea connects.
- **Future Impact Simulator:** Predict success probabilities, adoption rates, risks, and growth trajectories using an AI-powered simulation deck.
- **Integrated Chatbot:** An AI-driven assistant available on every page to answer questions and brainstorm.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **AI Integration:** Google Gemini API (`@google/genai`)

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.0 or higher)
- A valid Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naazmeensyed313-bit/NEXORA.git
   cd NEXORA
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory and add your AI credentials:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=models/gemini-2.5-flash
   ```

## Running Locally

You can start both the frontend and backend servers simultaneously from the root directory:

```bash
npm run dev
```

- **Backend API:** `http://localhost:5000`
- **Frontend UI:** `http://localhost:3000`

## Deployment

If you plan to deploy this application to production:

1. **Backend:** Deploy the `backend/` directory to a Node.js hosting service (e.g., Render, Railway).
2. **Frontend Configuration:** Update all API `fetch()` URLs in your frontend JavaScript files from `http://localhost:5000` to your new live backend URL.
3. **Frontend:** Host the `frontend/` directory on a static hosting provider (e.g., GitHub Pages, Vercel, Netlify).
