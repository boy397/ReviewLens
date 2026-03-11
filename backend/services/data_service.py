import pandas as pd
import os
from typing import Optional
from config import settings


class DataService:
    """Loads and queries the synthetic reviews CSV dataset."""

    def __init__(self):
        self.df: Optional[pd.DataFrame] = None

    def load(self):
        csv_path = settings.CSV_PATH
        if not os.path.isabs(csv_path):
            csv_path = os.path.join(os.path.dirname(__file__), "..", csv_path)
        self.df = pd.read_csv(csv_path, encoding="utf-8", encoding_errors="replace")
        # Ensure types
        self.df["review_id"] = self.df["review_id"].astype(int)
        self.df["rating"] = self.df["rating"].astype(int)
        self.df["review_date"] = self.df["review_date"].astype(str)
        print(f"  - Loaded {len(self.df)} reviews across {self.df['product_id'].nunique()} products")

    # ── Product queries ──────────────────────────────────────
    def get_all_products(self, category: Optional[str] = None, search: Optional[str] = None,
                         page: int = 1, limit: int = 20) -> dict:
        df = self.df
        if category:
            df = df[df["category"] == category]
        if search:
            df = df[df["product_id"].str.contains(search, case=False, na=False)]

        product_groups = df.groupby("product_id").agg(
            category=("category", "first"),
            avg_rating=("rating", "mean"),
            review_count=("review_id", "count"),
        ).reset_index()
        product_groups["avg_rating"] = product_groups["avg_rating"].round(2)

        total = len(product_groups)
        start = (page - 1) * limit
        products = product_groups.iloc[start:start + limit].to_dict("records")
        return {"products": products, "total": total, "page": page, "limit": limit}

    def get_product(self, product_id: str) -> Optional[dict]:
        product_df = self.df[self.df["product_id"] == product_id]
        if product_df.empty:
            return None
        rating_dist = product_df["rating"].value_counts().to_dict()
        rating_dist = {int(k): int(v) for k, v in rating_dist.items()}
        return {
            "product_id": product_id,
            "category": product_df["category"].iloc[0],
            "avg_rating": round(product_df["rating"].mean(), 2),
            "review_count": len(product_df),
            "rating_distribution": rating_dist,
        }

    def get_product_reviews(self, product_id: str, page: int = 1, limit: int = 20) -> dict:
        product_df = self.df[self.df["product_id"] == product_id]
        total = len(product_df)
        start = (page - 1) * limit
        reviews = product_df.iloc[start:start + limit].to_dict("records")
        return {"reviews": reviews, "total": total, "page": page, "limit": limit}

    # ── Category / Stats ─────────────────────────────────────
    def get_categories(self) -> list[dict]:
        cats = self.df["category"].value_counts().reset_index()
        cats.columns = ["name", "count"]
        return cats.to_dict("records")

    def get_stats(self) -> dict:
        return {
            "total_reviews": len(self.df),
            "total_products": self.df["product_id"].nunique(),
            "total_categories": self.df["category"].nunique(),
            "avg_rating": round(self.df["rating"].mean(), 2),
            "categories": self.get_categories(),
        }

    # ── Raw access for other services ────────────────────────
    def get_reviews_for_product(self, product_id: str) -> pd.DataFrame:
        return self.df[self.df["product_id"] == product_id].copy()

    def get_all_review_texts(self) -> list[str]:
        return self.df["review_text"].tolist()

    def get_review_by_indices(self, indices: list[int]) -> list[dict]:
        valid = [i for i in indices if 0 <= i < len(self.df)]
        return self.df.iloc[valid].to_dict("records")


# Singleton
data_service = DataService()
