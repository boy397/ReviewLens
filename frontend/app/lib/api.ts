const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getStats: () => fetchAPI<import("./types").StatsData>("/stats"),

  getProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return fetchAPI<import("./types").PaginatedProducts>(`/products?${q.toString()}`);
  },

  getProduct: (id: string) => fetchAPI<import("./types").Product>(`/products/${id}`),

  getProductReviews: (id: string, page = 1, limit = 20) =>
    fetchAPI<import("./types").PaginatedReviews>(`/products/${id}/reviews?page=${page}&limit=${limit}`),

  getProductAnalysis: (id: string) =>
    fetchAPI<import("./types").AnalysisResult>(`/products/${id}/analysis`),

  getCategories: () => fetchAPI<import("./types").CategoryInfo[]>("/categories"),

  ragQuery: (query: string, topK = 10) =>
    fetchAPI<import("./types").RAGResult>("/rag/query", {
      method: "POST",
      body: JSON.stringify({ query, top_k: topK }),
    }),

  analyzeUrl: (url: string) =>
    fetchAPI<import("./types").AnalysisResult>("/analyze-url", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
};
