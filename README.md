<div align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini-Powered-blue?style=for-the-badge&logo=google" alt="Powered by Gemini" />
  <img src="https://img.shields.io/badge/Node.js-Backend-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Backend" />
  <img src="https://img.shields.io/badge/Vanilla-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS Frontend" />

  <br />
  <br />

  <h1>🚀 NEXORA</h1>
  <p><em>From Raw Idea to Market-Ready Innovation.</em></p>
</div>

---

> **NEXORA** is a next-generation, AI-powered business projection and innovation evaluator. Built for hackathons, visionary entrepreneurs, and developers, it transforms raw concepts into execution-ready innovations by analyzing feasibility, market demand, and architectural complexity.

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **🧠 AI Idea Analyzer** | Get deep, AI-scored assessments across innovation, feasibility, complexity, and market demand, complete with actionable next steps. |
| **🎯 Innovation Detector** | Analyze market saturation, discover existing solutions, and pinpoint exactly how you can differentiate your product. |
| **🏗️ Algorithm Architect** | Instantly generate interactive, high-level system architecture flowcharts showing how your UI, backend, and AI engine connect. |
| **📈 Future Simulator** | Predict success probabilities, user adoption rates, risks, and growth trajectories using advanced AI simulations. |
| **🤖 Contextual Chatbot** | A futuristic assistant available on every page to brainstorm, troubleshoot, and refine your ideas in real-time. |

---

## 🛠️ Tech Stack & Architecture

Nexora is designed to be lightweight, incredibly fast, and easy to deploy:

- **Frontend:** Beautiful Glassmorphism UI built with Vanilla HTML5, CSS3, and JavaScript.
- **Backend:** High-performance REST API powered by **Node.js** & **Express.js**.
- **AI Engine:** Integrated with the cutting-edge **Google Gemini API** (`@google/genai`).

---

## 🚀 Getting Started

Follow these instructions to get a copy of Nexora up and running on your local machine.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0 or higher)
- **Google Gemini API Key** (Get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### 💻 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naazmeensyed313-bit/NEXORA.git
   cd NEXORA
   ```

2. **Install dependencies:**
   This command will magically install everything needed for both the root runner and the backend server.
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `backend/` directory and add your AI credentials:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=models/gemini-2.5-flash
   ```

### ⚡ Run the Application

Start both the frontend and backend simultaneously with a single, elegant command:

```bash
npm run dev
```

- ⚙️ **Backend API** running at `http://localhost:5000`
- 🖥️ **Frontend UI** available at `http://localhost:3000`

*Open [http://localhost:3000](http://localhost:3000) in your favorite browser to experience Nexora!*

---

## 🌍 Ready for Production?

If you are ready to share your innovation with the world, follow these deployment steps:

1. **Host the Backend:** Deploy the `backend/` directory to a cloud provider like [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com).
2. **Update the Frontend:** In your frontend JavaScript files, change all `fetch('http://localhost:5000/...')` calls to point to your new live backend URL.
3. **Host the Frontend:** Deploy the `frontend/` directory to [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/), or [Netlify](https://www.netlify.com/).

---
<div align="center">
  <i>Built with passion to empower the next generation of innovators.</i>
</div>
