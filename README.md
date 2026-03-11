<div align="center">

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Magnifying%20Glass%20Tilted%20Right.png" alt="Magnifying Glass" width="90" height="90" />

# ✨ ReviewLens ✨

**AI-Powered Product Review Analysis & RAG Engine**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-4285F4?style=for-the-badge)](https://github.com/facebookresearch/faiss)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*Turn thousands of noisy reviews into instant, actionable insights with Semantic Search and AI Summarization.*

[Features](#-key-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture)

</div>

---

## 🌟 Why ReviewLens?

Shopping online is overwhelming. Digging through thousands of reviews to figure out if a product's battery actually lasts or if the seller is legitimate takes hours. 

**ReviewLens** solves this. With an elegant Next.js dashboard, a FastAPI AI brain, and a seamless Chrome Extension, ReviewLens reads the reviews for you. It extracts pros and cons, detects fake reviews, analyzes sentiment by feature, and even lets you chat with the reviews using our **RAG** (Retrieval-Augmented Generation) engine.

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png" alt="Star Struck" width="40" height="40" />
</div>

---

## ✨ Key Features

### 🧠 Semantic RAG Search
Stop guessing keywords. Ask natural questions like *"How is the battery life after a year?"* or *"Is the screen good for gaming?"* Our FAISS-powered vector search finds the exact context across thousands of reviews and generates a precise answer using Groq LLM.

### 🔗 "Analyze By URL" Intelligence
Just paste any **Amazon** or **Flipkart** URL. ReviewLens seamlessly scrapes the product page, analyzes the extracted reviews, and generates a beautiful dashboard of insights. If a site uses heavy JavaScript blocking, the backend fails over gracefully to smart LLM-based product heuristics.

### 📊 Aspect-Based Sentiment Analysis
Don't just look at the average rating. ReviewLens automatically identifies key product features (e.g., *Battery, Performance, Display*) and rates the sentiment specifically for those features.

### 🚩 Fake Review Detection
Shop safely. Our heuristic engine flags suspicious review patterns, generic phrasing, and massive sentiment outliers.

### 🔌 1-Click Chrome Extension
A companion tool that detects product pages on eCommerce sites. Click the floating magic button to instantly jump to a deep-dive analysis of that exact product.

---

## 🛠️ Tech Stack

<div align="center">

| Section | Technologies |
| :---: | :--- |
| **Backend (The Brain)** | 🐍 FastAPI, 🔍 FAISS, 🧠 Groq LLM, 📊 Sentence-Transformers, 📝 TextBlob, 🐼 Pandas |
| **Frontend (The UI)** | ⚡ Next.js 14, 📘 TypeScript, 🎨 Tailwind CSS, 📈 Chart.js |
| **Extension (The Bridge)** | 🧩 Manifest V3, 📜 Vanilla JS (Service Workers & Content Scripts) |

</div>

---

## 🚀 Quick Start

Get ReviewLens running locally in minutes.

### 1️⃣ Clone & Backend Setup
```bash
git clone https://github.com/yourusername/ReviewLens.git
cd ReviewLens

# Install Python dependencies in the root environment
pip install -r backend/requirements.txt

# Create your .env file
echo "GROQ_API_KEY=your_api_key_here" > backend/.env

# Start the AI Backend
cd backend
python -m uvicorn main:app --reload --port 8000
```
*The API will be live at `http://localhost:8000`*

### 2️⃣ Frontend Setup
```bash
# Open a new terminal
cd ReviewLens/frontend

# Install dependencies
npm install

# Start the stunning Next.js UI
npm run dev
```
*The Dashboard will be live at `http://localhost:3000`*

### 3️⃣ Chrome Extension Install
1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle on **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `/chrome-extension` directory from the cloned repo.
4. Open an Amazon/Flipkart product page to see the magic widget!

---

## 📂 Project Architecture

```text
ReviewLens/
├── 🧠 backend/ 
│   ├── routes/          # Fast API endpoints (/analyze-url, /rag)
│   ├── services/        # AI, FAISS, Scraping, LLM orchestrators
│   └── models/          # Pydantic validation schemas
│
├── 💻 frontend/ 
│   ├── app/             # Next.js 14 App Router (Dashboard, Analyze)
│   ├── components/      # Sleek, glassmorphism UI parts
│   └── lib/             # API clients & TypeScript definition types
│
├── 🧩 chrome-extension/ # MV3 Service Workers & Content injection
│
└── 📄 README.md         # You are here!
```

---

<div align="center">

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png" alt="Waving Hand" width="45" height="45" />

### Built with 💜 by the ReviewLens Team

*Transforming eCommerce, one review at a time.*

</div>
