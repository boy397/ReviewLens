import httpx
from bs4 import BeautifulSoup
from typing import Optional
import re
import json


class ScraperPipeline:
    """
    Scraper pipeline: URL -> Page Fetch -> HTML Parse -> Review Extract -> Clean.
    Supports Amazon and Flipkart product pages.
    """

    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }

    # ── Step 1: Validate and identify URL ────────────────────
    @staticmethod
    def identify_product_url(url: str) -> dict:
        """Identify platform and extract product ID from URL."""
        patterns = {
            "amazon": [
                r"amazon\.\w+/.*?/dp/([A-Z0-9]{10})",
                r"amazon\.\w+/dp/([A-Z0-9]{10})",
                r"amazon\.\w+/gp/product/([A-Z0-9]{10})",
                r"amzn\.\w+/\w+",  # shortened URLs
            ],
            "flipkart": [
                r"flipkart\.com/.*?/p/([a-zA-Z0-9]+)",
            ],
        }

        for platform, pattern_list in patterns.items():
            for pattern in pattern_list:
                match = re.search(pattern, url, re.IGNORECASE)
                if match:
                    product_id = match.group(1) if match.lastindex else None
                    return {
                        "platform": platform,
                        "product_id": product_id,
                        "valid": True,
                    }

        # If URL looks like a product page but doesn't match patterns
        if any(domain in url.lower() for domain in ["amazon.", "flipkart.", "amzn."]):
            platform = "amazon" if "amazon" in url.lower() or "amzn" in url.lower() else "flipkart"
            return {"platform": platform, "product_id": None, "valid": True}

        return {
            "platform": "unknown",
            "product_id": None,
            "valid": False,
            "message": "Unsupported URL. Currently supports Amazon and Flipkart product links.",
        }

    # ── Step 2: Fetch page HTML ──────────────────────────────
    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetch HTML content from a URL with robust headers."""
        try:
            async with httpx.AsyncClient(
                timeout=20.0,
                follow_redirects=True,
                headers=self.HEADERS,
            ) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    return response.text
                print(f"  Fetch returned status {response.status_code}")
                return None
        except Exception as e:
            print(f"  Fetch error: {e}")
            return None

    # ── Step 3: Parse HTML ───────────────────────────────────
    @staticmethod
    def parse_html(html: str) -> BeautifulSoup:
        return BeautifulSoup(html, "html.parser")

    # ── Step 4: Extract product info ─────────────────────────
    @staticmethod
    def extract_product_info(soup: BeautifulSoup, platform: str) -> dict:
        """Extract product title, price, rating from the page."""
        info = {"title": "", "price": "", "rating": "", "rating_count": "", "image_url": ""}

        if platform == "amazon":
            # Title
            title_el = soup.select_one("#productTitle")
            if title_el:
                info["title"] = title_el.get_text(strip=True)

            # Price
            price_el = soup.select_one(".a-price .a-offscreen")
            if not price_el:
                price_el = soup.select_one("#priceblock_ourprice, #priceblock_dealprice, .a-price-whole")
            if price_el:
                info["price"] = price_el.get_text(strip=True)

            # Rating
            rating_el = soup.select_one("#acrPopover .a-icon-alt, span[data-hook='rating-out-of-text']")
            if rating_el:
                rating_text = rating_el.get_text(strip=True)
                match = re.search(r"(\d+\.?\d*)", rating_text)
                if match:
                    info["rating"] = match.group(1)

            # Rating count
            count_el = soup.select_one("#acrCustomerReviewText")
            if count_el:
                info["rating_count"] = count_el.get_text(strip=True)

            # Image
            img_el = soup.select_one("#landingImage, #imgBlkFront")
            if img_el:
                info["image_url"] = img_el.get("src", "") or img_el.get("data-old-hires", "")

        elif platform == "flipkart":
            title_el = soup.select_one("span.VU-ZEz, h1.yhB1nd, span.B_NuCI")
            if title_el:
                info["title"] = title_el.get_text(strip=True)

            price_el = soup.select_one("div.Nx9bqj.CxhGGd, div._30jeq3._16Jk6d")
            if price_el:
                info["price"] = price_el.get_text(strip=True)

            rating_el = soup.select_one("div.XQDdHH, div._3LWZlK")
            if rating_el:
                info["rating"] = rating_el.get_text(strip=True)

        return info

    # ── Step 5: Extract reviews ──────────────────────────────
    @staticmethod
    def extract_reviews(soup: BeautifulSoup, platform: str) -> list[dict]:
        """Extract reviews from parsed HTML based on platform."""
        reviews = []

        if platform == "amazon":
            # Try multiple Amazon review selectors
            review_divs = soup.select("[data-hook='review']")
            if not review_divs:
                review_divs = soup.select(".review")

            for div in review_divs:
                title_el = div.select_one("[data-hook='review-title'] span:last-child, [data-hook='review-title']")
                body_el = div.select_one("[data-hook='review-body'] span, [data-hook='review-body']")
                rating_el = div.select_one("[data-hook='review-star-rating'] .a-icon-alt, .a-icon-alt")

                rating = 0
                if rating_el:
                    match = re.search(r"(\d+\.?\d*)", rating_el.get_text())
                    if match:
                        rating = int(float(match.group(1)))

                text = body_el.get_text(strip=True) if body_el else ""
                title = title_el.get_text(strip=True) if title_el else ""

                if text:
                    reviews.append({"title": title, "text": text, "rating": rating})

        elif platform == "flipkart":
            review_divs = soup.select("div.ZmyHeo, div._1AtVbE div.col._2wzgFH, div.cPHDOP")
            for div in review_divs:
                text_el = div.select_one("div.ZmyHeo p, div.t-ZTKy, div._6K-7Co")
                rating_el = div.select_one("div.XQDdHH, div._3LWZlK")

                rating = 0
                if rating_el:
                    try:
                        rating = int(float(rating_el.get_text(strip=True)))
                    except ValueError:
                        pass

                text = text_el.get_text(strip=True) if text_el else ""
                if text:
                    reviews.append({"title": "", "text": text, "rating": rating})

        return reviews

    # ── Step 6: Clean extracted data ─────────────────────────
    @staticmethod
    def clean_reviews(reviews: list[dict]) -> list[dict]:
        """Clean and normalize extracted reviews."""
        cleaned = []
        seen = set()
        for review in reviews:
            text = review.get("text", "").strip()
            if not text or len(text) < 10:
                continue
            text = re.sub(r"\s+", " ", text)
            # Dedup
            if text[:80] in seen:
                continue
            seen.add(text[:80])
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
            return {
                "success": False,
                "error": "Could not fetch the page. The site may be blocking automated requests.",
                "platform": url_info["platform"],
                "product_id": url_info.get("product_id"),
            }

        soup = self.parse_html(html)
        product_info = self.extract_product_info(soup, url_info["platform"])
        raw_reviews = self.extract_reviews(soup, url_info["platform"])
        cleaned = self.clean_reviews(raw_reviews)

        return {
            "success": True,
            "platform": url_info["platform"],
            "product_id": url_info.get("product_id") or "unknown",
            "product_info": product_info,
            "review_count": len(cleaned),
            "reviews": cleaned,
        }


# Singleton
scraper_pipeline = ScraperPipeline()
