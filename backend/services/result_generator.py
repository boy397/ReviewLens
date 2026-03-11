from services.data_service import data_service
from services.ai_analysis import ai_analysis_service
from services.rag_service import rag_service
from services.cache_service import cache_service


class ResultGenerator:
    """Orchestrates all services to produce a complete analysis result for a product."""

    async def generate_full_analysis(self, product_id: str) -> dict | None:
        # Check cache first
        cache_key = f"analysis:{product_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached

        # Get product info
        product = data_service.get_product(product_id)
        if not product:
            return None

        # Get reviews
        reviews_df = data_service.get_reviews_for_product(product_id)
        review_texts = reviews_df["review_text"].tolist()
        review_dicts = reviews_df.to_dict("records")

        if not review_texts:
            return None

        # Sentiment analysis (overall)
        all_text = " ".join(review_texts[:100])  # Limit for performance
        overall_sentiment = ai_analysis_service.analyze_sentiment(all_text)

        # Aspect extraction
        aspects = ai_analysis_service.extract_aspects(review_texts)

        # Pros & Cons
        pros_cons = ai_analysis_service.extract_pros_cons(review_texts)

        # Fake review detection
        fake_flags = ai_analysis_service.detect_fake_reviews(review_dicts, product["avg_rating"])

        # LLM Summary (Groq)
        ai_summary = await ai_analysis_service.generate_llm_summary(
            review_texts, product_id, product["category"]
        )

        # Recommendation
        recommendation = ai_analysis_service.generate_recommendation(
            product["avg_rating"],
            overall_sentiment["label"],
            len(pros_cons["pros"]),
            len(pros_cons["cons"]),
        )

        result = {
            "product_id": product_id,
            "category": product["category"],
            "avg_rating": product["avg_rating"],
            "review_count": product["review_count"],
            "overall_sentiment": overall_sentiment,
            "aspects": aspects,
            "pros": pros_cons["pros"],
            "cons": pros_cons["cons"],
            "ai_summary": ai_summary,
            "recommendation": recommendation,
            "fake_review_flags": fake_flags,
            "rating_distribution": product["rating_distribution"],
        }

        # Cache result
        cache_service.set(cache_key, result, ttl=900)
        return result


# Singleton
result_generator = ResultGenerator()
