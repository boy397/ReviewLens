import re
import httpx
from collections import Counter
from textblob import TextBlob
from typing import Optional
from config import settings


# ── Aspect keywords mapped to human-readable names ──────────
ASPECT_KEYWORDS = {
    "battery": ["battery", "charging", "charge", "power"],
    "performance": ["performance", "fast", "speed", "responsive", "lag", "slow"],
    "design": ["design", "lightweight", "heavy", "build", "look", "aesthetic"],
    "display": ["display", "screen", "beautiful", "resolution"],
    "sound": ["sound", "audio", "speaker", "noise"],
    "camera": ["camera", "photo", "picture", "video"],
    "value": ["value", "price", "money", "worth", "cheap", "expensive"],
    "software": ["software", "bugs", "update", "app", "interface"],
    "durability": ["quality", "durable", "sturdy", "scratches", "break"],
    "connectivity": ["connection", "wifi", "bluetooth", "drops"],
    "customer_support": ["support", "customer", "service", "warranty"],
}

# ── Positive / Negative phrase patterns ─────────────────────
POSITIVE_PHRASES = [
    "fast charging", "excellent battery life", "great sound quality",
    "beautiful display", "good value for money", "lightweight design",
    "very responsive interface", "easy to use", "great build quality",
    "fast performance",
]

NEGATIVE_PHRASES = [
    "battery drains quickly", "camera quality is average", "heats up sometimes",
    "slow customer support", "software bugs appear occasionally",
    "build feels cheap", "screen scratches easily", "heavy to carry",
    "connection drops sometimes", "limited features",
]


class AIAnalysisService:
    """AI-powered review analysis: sentiment, aspects, clustering, summaries."""

    # ── Sentiment Analysis ───────────────────────────────────
    @staticmethod
    def analyze_sentiment(text: str) -> dict:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        if polarity > 0.1:
            label = "positive"
        elif polarity < -0.1:
            label = "negative"
        else:
            label = "neutral"
        return {
            "polarity": round(polarity, 4),
            "subjectivity": round(subjectivity, 4),
            "label": label,
        }

    # ── Aspect Extraction ────────────────────────────────────
    @staticmethod
    def extract_aspects(reviews: list[str]) -> list[dict]:
        aspect_sentiments: dict[str, list[float]] = {k: [] for k in ASPECT_KEYWORDS}

        for text in reviews:
            text_lower = text.lower()
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity

            for aspect, keywords in ASPECT_KEYWORDS.items():
                if any(kw in text_lower for kw in keywords):
                    aspect_sentiments[aspect].append(polarity)

        results = []
        for aspect, sentiments in aspect_sentiments.items():
            if sentiments:
                results.append({
                    "aspect": aspect,
                    "count": len(sentiments),
                    "avg_sentiment": round(sum(sentiments) / len(sentiments), 4),
                })
        results.sort(key=lambda x: x["count"], reverse=True)
        return results

    # ── Pros & Cons Extraction ───────────────────────────────
    @staticmethod
    def extract_pros_cons(reviews: list[str]) -> dict:
        pros_counter = Counter()
        cons_counter = Counter()

        for text in reviews:
            text_lower = text.lower()
            for phrase in POSITIVE_PHRASES:
                if phrase in text_lower:
                    pros_counter[phrase] += 1
            for phrase in NEGATIVE_PHRASES:
                if phrase in text_lower:
                    cons_counter[phrase] += 1

        pros = []
        for phrase, count in pros_counter.most_common(10):
            blob = TextBlob(phrase)
            pros.append({
                "text": phrase,
                "frequency": count,
                "sentiment_score": round(blob.sentiment.polarity, 4),
            })

        cons = []
        for phrase, count in cons_counter.most_common(10):
            blob = TextBlob(phrase)
            cons.append({
                "text": phrase,
                "frequency": count,
                "sentiment_score": round(blob.sentiment.polarity, 4),
            })

        return {"pros": pros, "cons": cons}

    # ── Fake Review Detection ────────────────────────────────
    @staticmethod
    def detect_fake_reviews(reviews: list[dict], avg_rating: float) -> list[dict]:
        flagged = []
        for review in reviews:
            flags = []
            score = 0.0
            text = review.get("review_text", "")

            # Flag 1: Very short reviews
            if len(text) < 50:
                flags.append("suspiciously_short")
                score += 0.3

            # Flag 2: Excessive keyword repetition
            words = text.lower().split()
            if words:
                word_counts = Counter(words)
                most_common_count = word_counts.most_common(1)[0][1]
                if most_common_count > len(words) * 0.15:
                    flags.append("keyword_stuffing")
                    score += 0.3

            # Flag 3: Rating deviation from average
            rating = review.get("rating", 3)
            if abs(rating - avg_rating) > 2.5:
                flags.append("rating_outlier")
                score += 0.2

            # Flag 4: Generic phrasing
            generic_starts = [
                "i have been using this product",
                "this product is great",
                "best product ever",
            ]
            if any(text.lower().startswith(g) for g in generic_starts):
                flags.append("generic_phrasing")
                score += 0.2

            if flags:
                flagged.append({
                    "review_id": review.get("review_id", 0),
                    "score": round(min(score, 1.0), 2),
                    "flags": flags,
                })

        # Return top flagged reviews
        flagged.sort(key=lambda x: x["score"], reverse=True)
        return flagged[:10]

    # ── LLM Summarization via Groq ───────────────────────────
    @staticmethod
    async def generate_llm_summary(reviews: list[str], product_id: str, category: str) -> str:
        """Generate a summary using Groq LLM. Falls back to heuristic if no API key."""
        if not settings.GROQ_API_KEY:
            return AIAnalysisService._heuristic_summary(reviews, product_id, category)

        # Build context from reviews (limit to avoid token overflow)
        sample_reviews = reviews[:30]
        review_context = "\n".join([f"- {r[:200]}" for r in sample_reviews])

        prompt = f"""Analyze these product reviews for {product_id} (category: {category}) and provide:
1. A concise 2-3 sentence summary of overall customer sentiment
2. Key strengths and weaknesses
3. A purchase recommendation

Reviews:
{review_context}

Provide a clear, helpful summary for a potential buyer."""

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": "You are a helpful product review analyst. Provide concise, actionable insights."},
                            {"role": "user", "content": prompt},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 500,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    print(f"  ⚠ Groq API error {response.status_code}: {response.text[:200]}")
                    return AIAnalysisService._heuristic_summary(reviews, product_id, category)
        except Exception as e:
            print(f"  ⚠ Groq API exception: {e}")
            return AIAnalysisService._heuristic_summary(reviews, product_id, category)

    @staticmethod
    def _heuristic_summary(reviews: list[str], product_id: str, category: str) -> str:
        """Fallback summary when no LLM API key is available."""
        sentiments = [TextBlob(r).sentiment.polarity for r in reviews]
        avg_pol = sum(sentiments) / len(sentiments) if sentiments else 0

        pos_count = sum(1 for s in sentiments if s > 0.1)
        neg_count = sum(1 for s in sentiments if s < -0.1)
        total = len(sentiments)

        if avg_pol > 0.1:
            tone = "generally positive"
        elif avg_pol < -0.1:
            tone = "generally negative"
        else:
            tone = "mixed"

        return (
            f"Based on {total} reviews, {product_id} ({category}) receives {tone} feedback. "
            f"{pos_count} reviews ({round(pos_count/total*100) if total else 0}%) are positive, "
            f"{neg_count} ({round(neg_count/total*100) if total else 0}%) are negative. "
            f"Average sentiment polarity: {round(avg_pol, 2)}."
        )

    # ── Recommendation ───────────────────────────────────────
    @staticmethod
    def generate_recommendation(avg_rating: float, sentiment_label: str, pros_count: int, cons_count: int) -> str:
        if avg_rating >= 4.0 and sentiment_label == "positive":
            return "Highly Recommended — This product has excellent ratings and overwhelmingly positive reviews."
        elif avg_rating >= 3.5:
            return "Recommended — Good overall product with some minor drawbacks noted by users."
        elif avg_rating >= 2.5:
            return "Consider Alternatives — Mixed reviews suggest this product may not meet all expectations."
        else:
            return "Not Recommended — Low ratings and negative feedback indicate significant product issues."

    # ── RAG-Powered Query Answering ──────────────────────────
    @staticmethod
    async def answer_rag_query(query: str, retrieved_reviews: list[str]) -> str:
        """Answer a user query using retrieved reviews as context (Groq LLM)."""
        if not settings.GROQ_API_KEY:
            return f"Found {len(retrieved_reviews)} relevant reviews for your query. Configure GROQ_API_KEY in .env for AI-generated answers."

        context = "\n".join([f"- {r[:250]}" for r in retrieved_reviews[:15]])
        prompt = f"""Based on these product reviews, answer the following question.

Question: {query}

Relevant Reviews:
{context}

Provide a concise, helpful answer based on the review data above."""

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": "You are a helpful product review analyst. Answer questions based only on the provided reviews."},
                            {"role": "user", "content": prompt},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 400,
                    },
                )
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                else:
                    return f"Found {len(retrieved_reviews)} relevant reviews. Groq API returned status {response.status_code}."
        except Exception as e:
            return f"Found {len(retrieved_reviews)} relevant reviews. Error calling Groq: {str(e)}"

    # ── URL-Based LLM Analysis (Fallback) ──────────────────────
    @staticmethod
    async def generate_url_analysis(
        url: str, product_title: str, platform: str,
        page_rating: float = 0, rating_count: str = "", price: str = ""
    ) -> dict:
        """
        Generate a full product analysis using Groq LLM when we can't scrape reviews.
        Uses the product title, platform, rating, price as context.
        """
        from config import settings
        import json as _json

        # Build context
        context_parts = [f"Product: {product_title}"]
        if platform:
            context_parts.append(f"Platform: {platform.capitalize()}")
        if price:
            context_parts.append(f"Price: {price}")
        if page_rating:
            context_parts.append(f"Rating: {page_rating}/5")
        if rating_count:
            context_parts.append(f"Reviews: {rating_count}")
        context_parts.append(f"URL: {url}")
        context = "\n".join(context_parts)

        prompt = f"""You are a product review analyst. Analyze this product based on its details and your knowledge.

{context}

Respond ONLY with a valid JSON object (no markdown, no code fences) with this exact structure:
{{
  "ai_summary": "A detailed 3-4 sentence analysis of this product based on typical user feedback.",
  "overall_sentiment": {{"polarity": 0.3, "subjectivity": 0.5, "label": "positive"}},
  "aspects": [
    {{"aspect": "battery", "count": 10, "avg_sentiment": 0.4}},
    {{"aspect": "performance", "count": 8, "avg_sentiment": 0.3}}
  ],
  "pros": [
    {{"text": "good battery life", "frequency": 5, "sentiment_score": 0.6}}
  ],
  "cons": [
    {{"text": "heats up sometimes", "frequency": 3, "sentiment_score": -0.4}}
  ],
  "recommendation": "A one-line purchase recommendation.",
  "avg_rating": {page_rating or 4.0},
  "rating_distribution": {{"5": 40, "4": 25, "3": 15, "2": 10, "1": 10}}
}}

Be realistic with sentiment scores (-1 to 1), provide 3-6 aspects, 3-5 pros, 2-4 cons.
Use the product name and category to give relevant, specific analysis."""

        if not settings.GROQ_API_KEY:
            return {
                "ai_summary": f"Analysis for {product_title}: Unable to generate AI analysis without API key. Please configure GROQ_API_KEY in .env.",
                "overall_sentiment": {"polarity": 0, "subjectivity": 0, "label": "neutral"},
                "aspects": [],
                "pros": [],
                "cons": [],
                "recommendation": "Configure GROQ_API_KEY for AI-powered analysis.",
                "avg_rating": page_rating,
                "rating_distribution": {},
            }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": "You are a product analysis AI. You must respond with ONLY valid JSON, no markdown formatting."},
                            {"role": "user", "content": prompt},
                        ],
                        "temperature": 0.4,
                        "max_tokens": 800,
                    },
                )

                if response.status_code == 200:
                    content = response.json()["choices"][0]["message"]["content"]
                    # Clean any markdown fences
                    content = content.strip()
                    if content.startswith("```"):
                        content = "\n".join(content.split("\n")[1:])
                    if content.endswith("```"):
                        content = "\n".join(content.split("\n")[:-1])
                    content = content.strip()

                    try:
                        data = _json.loads(content)
                        return data
                    except _json.JSONDecodeError:
                        print(f"  LLM returned invalid JSON, using raw text as summary")
                        return {
                            "ai_summary": content[:500],
                            "overall_sentiment": {"polarity": 0.2, "subjectivity": 0.5, "label": "positive" if page_rating >= 3.5 else "neutral"},
                            "aspects": [],
                            "pros": [],
                            "cons": [],
                            "recommendation": "See AI summary for details.",
                            "avg_rating": page_rating,
                            "rating_distribution": {},
                        }
                else:
                    print(f"  Groq API error {response.status_code}")
        except Exception as e:
            print(f"  Groq API exception: {e}")

        return {
            "ai_summary": f"Analysis for {product_title} on {platform.capitalize()}: This product has a {page_rating}/5 rating. For a detailed AI analysis, ensure GROQ_API_KEY is configured correctly.",
            "overall_sentiment": {"polarity": 0.2, "subjectivity": 0.5, "label": "positive" if page_rating >= 3.5 else "neutral"},
            "aspects": [],
            "pros": [],
            "cons": [],
            "recommendation": "Unable to generate full recommendation.",
            "avg_rating": page_rating,
            "rating_distribution": {},
        }


# Singleton
ai_analysis_service = AIAnalysisService()
