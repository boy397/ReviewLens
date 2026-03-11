export interface Product {
  product_id: string;
  category: string;
  avg_rating: number;
  review_count: number;
  rating_distribution?: Record<number, number>;
}

export interface Review {
  review_id: number;
  product_id: string;
  category: string;
  rating: number;
  review_text: string;
  review_date: string;
}

export interface SentimentResult {
  polarity: number;
  subjectivity: number;
  label: string;
}

export interface AspectResult {
  aspect: string;
  count: number;
  avg_sentiment: number;
}

export interface ProConItem {
  text: string;
  frequency: number;
  sentiment_score: number;
}

export interface FakeReviewScore {
  review_id: number;
  score: number;
  flags: string[];
}

export interface AnalysisResult {
  product_id: string;
  category: string;
  avg_rating: number;
  review_count: number;
  overall_sentiment: SentimentResult;
  aspects: AspectResult[];
  pros: ProConItem[];
  cons: ProConItem[];
  ai_summary: string;
  recommendation: string;
  fake_review_flags: FakeReviewScore[];
  rating_distribution: Record<number, number>;
}

export interface RAGResult {
  query: string;
  answer: string;
  source_reviews: Review[];
  confidence: number;
}

export interface CategoryInfo {
  name: string;
  count: number;
}

export interface StatsData {
  total_reviews: number;
  total_products: number;
  total_categories: number;
  avg_rating: number;
  categories: CategoryInfo[];
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}
