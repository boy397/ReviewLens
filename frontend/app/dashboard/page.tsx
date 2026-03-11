"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { StatsData, Product, CategoryInfo } from "../lib/types";
import StatsCard from "../components/StatsCard";
import ProductCard from "../components/ProductCard";
import RagSearch from "../components/RagSearch";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "rag">("products");
  const limit = 12;

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, page]);

  async function loadStats() {
    try {
      const data = await api.getStats();
      setStats(data);
      setCategories(data.categories);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory || undefined,
        search: search || undefined,
        page,
        limit,
      });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadProducts();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ paddingTop: 88, maxWidth: 1280, margin: "0 auto", padding: "88px 24px 60px" }}>
      {/* Stats Row */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
          <StatsCard icon="📊" label="Total Reviews" value={stats.total_reviews.toLocaleString()} delay="0s" />
          <StatsCard icon="📦" label="Products" value={stats.total_products.toLocaleString()} delay="0.1s" />
          <StatsCard icon="🏷️" label="Categories" value={stats.total_categories} delay="0.2s" />
          <StatsCard icon="⭐" label="Avg Rating" value={stats.avg_rating.toFixed(1)} delay="0.3s" />
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", padding: 4, width: "fit-content", border: "1px solid var(--border-color)" }}>
        {(["products", "rag"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: activeTab === tab ? "var(--accent-primary)" : "transparent",
              color: activeTab === tab ? "white" : "var(--text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {tab === "products" ? "📦 Products" : "🧠 RAG Search"}
          </button>
        ))}
      </div>

      {activeTab === "products" ? (
        <>
          {/* Search & Filter */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, flex: 1, minWidth: 250 }}>
              <input
                className="input-glass"
                placeholder="Search products by ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn-primary" type="submit">Search</button>
            </form>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className={`btn-secondary`}
                onClick={() => { setSelectedCategory(""); setPage(1); }}
                style={{
                  background: !selectedCategory ? "var(--accent-glow)" : undefined,
                  borderColor: !selectedCategory ? "var(--accent-primary)" : undefined,
                  color: !selectedCategory ? "var(--accent-primary)" : undefined,
                }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className="btn-secondary"
                  onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
                  style={{
                    background: selectedCategory === cat.name ? "var(--accent-glow)" : undefined,
                    borderColor: selectedCategory === cat.name ? "var(--accent-primary)" : undefined,
                    color: selectedCategory === cat.name ? "var(--accent-primary)" : undefined,
                    textTransform: "capitalize",
                  }}
                >
                  {cat.name.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 200 }} />
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                  <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>🔍</span>
                  <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No products found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ opacity: page === 1 ? 0.4 : 1 }}
                  >
                    ← Prev
                  </button>
                  <span style={{ display: "flex", alignItems: "center", padding: "0 16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ opacity: page === totalPages ? 0.4 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div id="rag">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>
            🧠 <span className="gradient-text">RAG Semantic Search</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>
            Ask natural language questions about products — powered by FAISS vector search and Groq LLM.
          </p>
          <RagSearch />
        </div>
      )}
    </div>
  );
}
