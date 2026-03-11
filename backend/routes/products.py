from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.data_service import data_service

router = APIRouter(prefix="/api", tags=["Products"])


@router.get("/products")
async def list_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return data_service.get_all_products(category=category, search=search, page=page, limit=limit)


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = data_service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/products/{product_id}/reviews")
async def get_product_reviews(
    product_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    product = data_service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return data_service.get_product_reviews(product_id, page=page, limit=limit)


@router.get("/categories")
async def list_categories():
    return data_service.get_categories()


@router.get("/stats")
async def get_stats():
    return data_service.get_stats()
