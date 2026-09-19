# Nexora

Nexora is an AI-powered business projection and innovation evaluator designed to take raw ideas and turn them into fully execution-ready innovations. 

## Live Demo
Check out the live application here: [https://backend-gamma-one-75.vercel.app](https://backend-gamma-one-75.vercel.app)

## Objectives

- To help entrepreneurs, developers, and hackathon participants rapidly evaluate the viability of their concepts.
- To provide deep, AI-driven insights into market demand, potential risks, and execution complexity.
- To automatically generate high-level architectural blueprints for software solutions.
- To offer an intuitive, real-time brainstorming assistant to refine ideas before writing any code.

## Key Features

- **Idea Analyzer:** Get AI-scored assessments across innovation, feasibility, complexity, and market demand.
- **Innovation Detector:** Analyze market saturation, discover similar existing solutions, and identify key differentiation opportunities.
- **Algorithm Architect:** Generate an interactive, high-level system architecture flowchart.
- **Future Impact Simulator:** Predict success probabilities, adoption rates, risks, and growth trajectories.
- **Integrated Chatbot:** An AI-driven assistant available on every page to answer questions and brainstorm.

## Tools and Technologies

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **AI Engine:** Google Gemini API (`@google/genai`)

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
