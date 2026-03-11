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

    search_results = rag_service.search(request.query, top_k=request.top_k)
    indices = [r["index"] for r in search_results]
    source_reviews = data_service.get_review_by_indices(indices)
    retrieved_texts = [r["text"] for r in search_results]
    answer = await ai_analysis_service.answer_rag_query(request.query, retrieved_texts)
    avg_score = sum(r["score"] for r in search_results) / len(search_results) if search_results else 0

    return {
        "query": request.query,
        "answer": answer,
        "source_reviews": source_reviews,
        "confidence": round(avg_score, 4),
    }


@router.post("/analyze-url")
async def analyze_url(request: AnalyzeURLRequest):
    """
    Analyze a real-world product from its URL.
    1. Scrape the product page for title, ratings, and reviews
    2. If reviews found, analyze them locally
    3. If no reviews scraped (JS-heavy site), use LLM to generate analysis from product info
    """
    url = request.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    # Run scraper pipeline
    scrape_result = await scraper_pipeline.run_pipeline(url)

    product_info = scrape_result.get("product_info", {})
    product_title = product_info.get("title", "") or scrape_result.get("product_id", "Unknown Product")
    scraped_reviews = scrape_result.get("reviews", [])
    platform = scrape_result.get("platform", "unknown")

    # If we got reviews, analyze them locally
    if scraped_reviews and len(scraped_reviews) >= 2:
        scraped_texts = [r["text"] for r in scraped_reviews]
        overall_sentiment = ai_analysis_service.analyze_sentiment(" ".join(scraped_texts[:50]))
        aspects = ai_analysis_service.extract_aspects(scraped_texts)
        pros_cons = ai_analysis_service.extract_pros_cons(scraped_texts)

        ratings = [r.get("rating", 0) for r in scraped_reviews if r.get("rating")]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0

        summary = await ai_analysis_service.generate_llm_summary(
            scraped_texts, product_title, platform
        )
        recommendation = ai_analysis_service.generate_recommendation(
            avg_rating, overall_sentiment["label"], len(pros_cons["pros"]), len(pros_cons["cons"])
        )

        rating_dist = {}
        for r in scraped_reviews:
            rat = r.get("rating", 0)
            if rat > 0:
                rating_dist[rat] = rating_dist.get(rat, 0) + 1

        return {
            "product_id": product_title,
            "category": platform,
            "platform": platform,
            "avg_rating": round(avg_rating, 2),
            "review_count": len(scraped_texts),
            "overall_sentiment": overall_sentiment,
            "aspects": aspects,
            "pros": pros_cons["pros"],
            "cons": pros_cons["cons"],
            "ai_summary": summary,
            "recommendation": recommendation,
            "fake_review_flags": [],
            "rating_distribution": rating_dist,
            "product_info": product_info,
            "source": "scraped_reviews",
        }

    # If no reviews found (JS-heavy page), use LLM to analyze based on product info + URL
    print(f"  No reviews scraped from {platform}. Using LLM-based analysis...")

    # Build whatever we have
    page_rating = 0.0
    if product_info.get("rating"):
        try:
            page_rating = float(product_info["rating"])
        except (ValueError, TypeError):
            pass

    # Use Groq LLM to generate a full analysis
    llm_analysis = await ai_analysis_service.generate_url_analysis(
        url=url,
        product_title=product_title,
        platform=platform,
        page_rating=page_rating,
        rating_count=product_info.get("rating_count", ""),
        price=product_info.get("price", ""),
    )

    return {
        "product_id": product_title or "Product",
        "category": platform,
        "platform": platform,
        "avg_rating": page_rating or llm_analysis.get("avg_rating", 0),
        "review_count": 0,
        "overall_sentiment": llm_analysis.get("overall_sentiment", {"polarity": 0, "subjectivity": 0, "label": "neutral"}),
        "aspects": llm_analysis.get("aspects", []),
        "pros": llm_analysis.get("pros", []),
        "cons": llm_analysis.get("cons", []),
        "ai_summary": llm_analysis.get("ai_summary", "Could not analyze this product. Please try a different URL."),
        "recommendation": llm_analysis.get("recommendation", "Unable to determine"),
        "fake_review_flags": [],
        "rating_distribution": llm_analysis.get("rating_distribution", {}),
        "product_info": product_info,
        "source": "llm_analysis",
    }
