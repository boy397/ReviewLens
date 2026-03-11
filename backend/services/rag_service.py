import numpy as np
import faiss
from typing import Optional
from sentence_transformers import SentenceTransformer
from config import settings


class RAGService:
    """
    Retrieval-Augmented Generation service using FAISS + sentence-transformers.
    Builds a vector index from review texts for semantic search.
    """

    def __init__(self):
        self.model: Optional[SentenceTransformer] = None
        self.index: Optional[faiss.IndexFlatIP] = None
        self.review_texts: list[str] = []
        self.embeddings: Optional[np.ndarray] = None
        self.is_ready = False

    def initialize(self, review_texts: list[str]):
        """Build FAISS index from review texts."""
        print("  - Loading embedding model...")
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.review_texts = review_texts

        print(f"  - Generating embeddings for {len(review_texts)} reviews...")
        self.embeddings = self.model.encode(
            review_texts,
            show_progress_bar=True,
            batch_size=256,
            normalize_embeddings=True,
        )

        # Build FAISS index (Inner Product = cosine similarity on normalized vectors)
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)
        self.index.add(self.embeddings.astype(np.float32))

        self.is_ready = True
        print(f"  - FAISS index built: {self.index.ntotal} vectors, dim={dimension}")

    def search(self, query: str, top_k: int = 10) -> list[dict]:
        """Search for reviews semantically similar to the query."""
        if not self.is_ready:
            return []

        query_embedding = self.model.encode(
            [query], normalize_embeddings=True
        ).astype(np.float32)

        scores, indices = self.index.search(query_embedding, top_k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.review_texts):
                continue
            results.append({
                "index": int(idx),
                "score": float(score),
                "text": self.review_texts[idx],
            })
        return results

    def search_within_indices(self, query: str, valid_indices: list[int], top_k: int = 10) -> list[dict]:
        """Search within a subset of reviews (e.g., for a specific product)."""
        if not self.is_ready or not valid_indices:
            return []

        query_embedding = self.model.encode(
            [query], normalize_embeddings=True
        ).astype(np.float32)

        # Get embeddings for valid indices only
        subset_embeddings = self.embeddings[valid_indices].astype(np.float32)

        # Build temporary sub-index
        sub_index = faiss.IndexFlatIP(subset_embeddings.shape[1])
        sub_index.add(subset_embeddings)

        k = min(top_k, len(valid_indices))
        scores, local_indices = sub_index.search(query_embedding, k)

        results = []
        for score, local_idx in zip(scores[0], local_indices[0]):
            if local_idx < 0:
                continue
            global_idx = valid_indices[local_idx]
            results.append({
                "index": global_idx,
                "score": float(score),
                "text": self.review_texts[global_idx],
            })
        return results


# Singleton
rag_service = RAGService()
