import httpx
from bs4 import BeautifulSoup
from typing import Optional
import re


class ScraperPipeline:
    """
    Scraper pipeline: URL → Page Fetch → HTML Parse → Review Extract → Clean.
    Provides structure for future real scraping; currently works with internal data.
    """

    # ── Step 1: Validate and identify URL ────────────────────
    @staticmethod
    def identify_product_url(url: str) -> dict:
        """Identify platform and extract product ID from URL."""
        patterns = {
            "amazon": r"amazon\.\w+/.*?/dp/([A-Z0-9]+)",
            "flipkart": r"flipkart\.com/.*?/p/([a-z0-9]+)",
        }

        for platform, pattern in patterns.items():
            match = re.search(pattern, url, re.IGNORECASE)
            if match:
                return {
                    "platform": platform,
                    "product_id": match.group(1),
                    "valid": True,
                }

        return {
            "platform": "unknown",
            "product_id": None,
            "valid": False,
            "message": "Unsupported URL. Currently supports Amazon and Flipkart.",
        }

    # ── Step 2: Fetch page HTML ──────────────────────────────
    @staticmethod
    async def fetch_page(url: str) -> Optional[str]:
        """Fetch HTML content from a URL."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    return response.text
                return None
        except Exception as e:
            print(f"  ⚠ Fetch error: {e}")
            return None

    # ── Step 3: Parse HTML ───────────────────────────────────
    @staticmethod
    def parse_html(html: str) -> BeautifulSoup:
        return BeautifulSoup(html, "html.parser")

    # ── Step 4: Extract reviews from parsed HTML ─────────────
    @staticmethod
    def extract_reviews(soup: BeautifulSoup, platform: str) -> list[dict]:
        """Extract reviews from parsed HTML based on platform."""
        reviews = []

        if platform == "amazon":
            review_divs = soup.select("[data-hook='review']")
            for div in review_divs:
                title_el = div.select_one("[data-hook='review-title']")
                body_el = div.select_one("[data-hook='review-body']")
                rating_el = div.select_one("[data-hook='review-star-rating']")

                rating = 0
                if rating_el:
                    rating_text = rating_el.get_text()
                    match = re.search(r"(\d+\.?\d*)", rating_text)
                    if match:
                        rating = int(float(match.group(1)))

                reviews.append({
                    "title": title_el.get_text(strip=True) if title_el else "",
                    "text": body_el.get_text(strip=True) if body_el else "",
                    "rating": rating,
                })

        elif platform == "flipkart":
            review_divs = soup.select("div._1AtVbE div.col._2wzgFH")
            for div in review_divs:
                text_el = div.select_one("div.t-ZTKy")
                rating_el = div.select_one("div._3LWZlK")

                rating = 0
                if rating_el:
                    try:
                        rating = int(rating_el.get_text(strip=True))
                    except ValueError:
                        pass

                reviews.append({
                    "title": "",
                    "text": text_el.get_text(strip=True) if text_el else "",
                    "rating": rating,
                })

        return reviews

    # ── Step 5: Clean extracted data ─────────────────────────
    @staticmethod
    def clean_reviews(reviews: list[dict]) -> list[dict]:
        """Clean and normalize extracted reviews."""
        cleaned = []
        for review in reviews:
            text = review.get("text", "").strip()
            if not text or len(text) < 10:
                continue
            # Remove extra whitespace
            text = re.sub(r"\s+", " ", text)
            cleaned.append({
                "text": text,
                "rating": review.get("rating", 0),
                "title": review.get("title", "").strip(),
            })
        return cleaned

    # ── Full pipeline ────────────────────────────────────────
    async def run_pipeline(self, url: str) -> dict:
        """Run the full scraper pipeline."""
        url_info = self.identify_product_url(url)
        if not url_info["valid"]:
            return {"success": False, "error": url_info.get("message", "Invalid URL")}

        html = await self.fetch_page(url)
        if not html:
            return {"success": False, "error": "Failed to fetch page"}

        soup = self.parse_html(html)
        raw_reviews = self.extract_reviews(soup, url_info["platform"])
        cleaned = self.clean_reviews(raw_reviews)

        return {
            "success": True,
            "platform": url_info["platform"],
            "product_id": url_info["product_id"],
            "review_count": len(cleaned),
            "reviews": cleaned,
        }


# Singleton
scraper_pipeline = ScraperPipeline()
