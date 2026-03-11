import os
import shutil
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from services.data_service import data_service
from services.rag_service import rag_service
from routes.products import router as products_router
from routes.analysis import router as analysis_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load data and build FAISS index."""
    print("\n🚀 ReviewLens Backend Starting...")

    # Copy CSV to data/ if not already there
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    csv_dest = os.path.join(data_dir, "synthetic_reviews_15k.csv")
    csv_source = os.path.join(os.path.dirname(__file__), "..", "synthetic_reviews_15k.csv")
    if not os.path.exists(csv_dest) and os.path.exists(csv_source):
        shutil.copy2(csv_source, csv_dest)
        print("  ✓ Copied dataset to backend/data/")

    # Load data
    print("\n📊 Loading dataset...")
    data_service.load()

    # Build RAG index
    print("\n🧠 Building RAG index (FAISS)...")
    review_texts = data_service.get_all_review_texts()
    rag_service.initialize(review_texts)

    print("\n✅ ReviewLens Backend Ready!")
    print(f"   API: http://{settings.HOST}:{settings.PORT}")
    print(f"   Docs: http://{settings.HOST}:{settings.PORT}/docs\n")

    yield

    print("\n👋 ReviewLens Backend Shutting Down...")


app = FastAPI(
    title="ReviewLens API",
    description="AI-powered product review analysis with RAG (FAISS + Groq)",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "chrome-extension://*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(products_router)
app.include_router(analysis_router)


@app.get("/")
async def root():
    return {
        "name": "ReviewLens API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "rag_ready": rag_service.is_ready,
    }
