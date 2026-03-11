# 🔍 ReviewLens

### AI-Powered Product Review Analysis & RAG Engine

ReviewLens is a next-generation SaaS platform and Chrome extension designed to transform how users perceive product feedback. By utilizing **RAG (Retrieval-Augmented Generation)** with **FAISS**, ReviewLens allows you to semantically search through thousands of reviews and get instant, AI-generated summaries of pros, cons, and overall sentiment.

---

## ✨ Key Features

- **🧠 Semantic RAG Search**: Ask natural language questions like *"How is the battery life after a year?"* or *"Is the screen good for gaming?"* and get contextual answers extracted from thousands of reviews using **FAISS** and **sentence-transformers**.
- **📊 AI-Powered Sentiment Analysis**: Real-time polarity and subjectivity scoring for every product and category.
- **🚀 Dynamic Aspect Extraction**: Automatically identifies key product features (Battery, Performance, Design) and analyzes sentiment for each.
- **🚩 Fake Review Detection**: Heuristic-based flags for suspicious review patterns, generic phrasing, and rating outliers.
- **🔌 Chrome Extension**: A companion tool that detects product pages on Amazon/Flipkart and provides instant AI summaries without leaving the page.
- **💎 Premium Dashboard**: A stunning, high-performance Next.js dashboard featuring glassmorphism, dark mode, and interactive data visualizations.

---

## 🛠️ Tech Stack

### Backend (The Brain)
- **FastAPI**: High-performance Python web framework.
- **FAISS**: Meta's industry-leading library for efficient similarity search.
- **Groq LLM**: Lightning-fast inference for review summarization and RAG query answering.
- **Sentence-Transformers**: Used for generating high-quality vector embeddings.
- **Pandas & TextBlob**: Core data processing and NLP sentiment analysis.

### Frontend (The Interface)
- **Next.js 14**: Modern React framework with App Router.
- **TypeScript**: Type-safe development for robust UI logic.
- **Tailwind CSS**: Utility-first styling with custom glassmorphism design system.
- **Chart.js**: Dynamic and interactive data visualizations.

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Add your GROQ_API_KEY to .env
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Extension Setup
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer Mode**.
3. Click **Load Unpacked** and select the `chrome-extension` folder.

---

## 📂 Project Structure

```text
├── backend/            # FastAPI + FAISS + Groq integration
├── frontend/           # Next.js + TypeScript dashboard
├── chrome-extension/   # MV3 Extension with Content Scripts
└── synthetic_reviews_15k.csv # Core product review dataset
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
