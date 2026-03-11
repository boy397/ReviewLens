from pydantic import BaseModel
from typing import Optional
from datetime import date


# ─── Request Models ───────────────────────────────────────────

class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 10
    category: Optional[str] = None

class AnalyzeURLRequest(BaseModel):
    url: str

# ─── Response Models ──────────────────────────────────────────

class ReviewOut(BaseModel):
    review_id: int
    product_id: str
    category: str
    rating: int
    review_text: str
    review_date: str

class ProductOut(BaseModel):
    product_id: str
    category: str
    avg_rating: float
    review_count: int
    rating_distribution: dict[int, int]

class SentimentResult(BaseModel):
    polarity: float
    subjectivity: float
    label: str  # positive / negative / neutral

class AspectResult(BaseModel):
    aspect: str
    count: int
    avg_sentiment: float

class ProConItem(BaseModel):
    text: str
    frequency: int
    sentiment_score: float

class FakeReviewScore(BaseModel):
    review_id: int
    score: float
    flags: list[str]

class AnalysisResult(BaseModel):
    product_id: str
    category: str
    avg_rating: float
    review_count: int
    overall_sentiment: SentimentResult
    aspects: list[AspectResult]
    pros: list[ProConItem]
    cons: list[ProConItem]
    ai_summary: str
    recommendation: str
    fake_review_flags: list[FakeReviewScore]
    rating_distribution: dict[int, int]

class RAGResult(BaseModel):
    query: str
    answer: str
    source_reviews: list[ReviewOut]
    confidence: float

class CategoryOut(BaseModel):
    name: str
    count: int

class StatsOut(BaseModel):
    total_reviews: int
    total_products: int
    total_categories: int
    avg_rating: float
    categories: list[CategoryOut]
