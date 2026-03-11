from fastapi import APIRouter, HTTPException
from services.result_generator import result_generator
from services.rag_service import rag_service
from services.ai_analysis import ai_analysis_service
from services.data_service import data_service
from services.scraper_pipeline import scraper_pipeline
from models.schemas import RAGQueryRequest, AnalyzeURLRequest

router = APIRouter(prefix="/api", tags=["Analysis"])


@router.get("/products/{product_id}/analysis")
async def get_product_analysis(product_id: str):
    """Get full AI analysis for a product (sentiment, pros/cons, summary, recommendations)."""
    result = await result_generator.generate_full_analysis(product_id)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found or no reviews available")
    return result


@router.post("/rag/query")
async def rag_query(request: RAGQueryRequest):
    """Semantic search across all reviews using RAG (FAISS)."""
    if not rag_service.is_ready:
        raise HTTPException(status_code=503, detail="RAG service is still initializing")

    # Search
    search_results = rag_service.search(request.query, top_k=request.top_k)

    # Get full review data for matched indices
    indices = [r["index"] for r in search_results]
    source_reviews = data_service.get_review_by_indices(indices)

    # Generate answer using Groq LLM
    retrieved_texts = [r["text"] for r in search_results]
    answer = await ai_analysis_service.answer_rag_query(request.query, retrieved_texts)

    # Compute confidence
    avg_score = sum(r["score"] for r in search_results) / len(search_results) if search_results else 0

    return {
        "query": request.query,
        "answer": answer,
        "source_reviews": source_reviews,
        "confidence": round(avg_score, 4),
    }


@router.post("/analyze-url")
async def analyze_url(request: AnalyzeURLRequest):
    """Analyze a product URL (for Chrome extension). Scrapes then analyzes."""
    # First try to match URL to an existing product in our dataset
    url_info = scraper_pipeline.identify_product_url(request.url)

    # If it's a known product ID in our dataset, use it
    if url_info.get("product_id"):
        product = data_service.get_product(url_info["product_id"])
        if product:
            result = await result_generator.generate_full_analysis(url_info["product_id"])
            if result:
                return result

    # Otherwise try scraping (will likely fail on real sites without proxies)
    scrape_result = await scraper_pipeline.run_pipeline(request.url)

    if not scrape_result["success"]:
        raise HTTPException(
            status_code=400,
            detail=f"Could not analyze URL: {scrape_result.get('error', 'Unknown error')}",
        )

    # Analyze scraped reviews
    scraped_texts = [r["text"] for r in scrape_result.get("reviews", [])]
    if not scraped_texts:
        raise HTTPException(status_code=404, detail="No reviews found at this URL")

    overall_sentiment = ai_analysis_service.analyze_sentiment(" ".join(scraped_texts[:50]))
    aspects = ai_analysis_service.extract_aspects(scraped_texts)
    pros_cons = ai_analysis_service.extract_pros_cons(scraped_texts)

    ratings = [r.get("rating", 0) for r in scrape_result["reviews"] if r.get("rating")]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0

    summary = await ai_analysis_service.generate_llm_summary(
        scraped_texts, scrape_result.get("product_id", "unknown"), "scraped"
    )
    recommendation = ai_analysis_service.generate_recommendation(
        avg_rating, overall_sentiment["label"], len(pros_cons["pros"]), len(pros_cons["cons"])
    )

    return {
        "product_id": scrape_result.get("product_id", "unknown"),
        "category": "scraped",
        "avg_rating": round(avg_rating, 2),
        "review_count": len(scraped_texts),
        "overall_sentiment": overall_sentiment,
        "aspects": aspects,
        "pros": pros_cons["pros"],
        "cons": pros_cons["cons"],
        "ai_summary": summary,
        "recommendation": recommendation,
        "fake_review_flags": [],
        "rating_distribution": {},
    }
