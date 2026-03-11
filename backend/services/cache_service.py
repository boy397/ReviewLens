import time
from typing import Any, Optional


class CacheService:
    """Simple in-memory TTL cache."""

    def __init__(self, default_ttl: int = 600):
        self._cache: dict[str, dict] = {}
        self.default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry is None:
            return None
        if time.time() > entry["expires"]:
            del self._cache[key]
            return None
        return entry["value"]

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        self._cache[key] = {
            "value": value,
            "expires": time.time() + (ttl or self.default_ttl),
        }

    def invalidate(self, key: str):
        self._cache.pop(key, None)

    def clear(self):
        self._cache.clear()


# Singleton
cache_service = CacheService()
