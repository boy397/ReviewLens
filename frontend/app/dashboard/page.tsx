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

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadProducts(); }, [selectedCategory, page]);

  async function loadStats() {
    try {
      const data = await api.getStats();
      setStats(data);
      setCategories(data.categories);
    } catch (err) { console.error("Failed to load stats:", err); }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory || undefined,
        search: search || undefined,
        page, limit,
      });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) { console.error("Failed to load products:", err); }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadProducts();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px" }}>
      {/* Page Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Explore products, analyze reviews, and search with AI
        </p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          <StatsCard icon="📊" label="Total Reviews" value={stats.total_reviews.toLocaleString()} delay="0s" />
          <StatsCard icon="📦" label="Products" value={stats.total_products.toLocaleString()} delay="0.1s" />
          <StatsCard icon="🏷️" label="Categories" value={stats.total_categories} delay="0.2s" />
          <StatsCard icon="⭐" label="Avg Rating" value={stats.avg_rating.toFixed(1)} delay="0.3s" />
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{
        display: "flex", gap: 2, marginBottom: 28,
        background: "var(--bg-glass)", borderRadius: "var(--radius-sm)",
        padding: 3, width: "fit-content", border: "1px solid var(--border-color)",
      }}>
        {(["products", "rag"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "9px 22px", borderRadius: 8, border: "none",
              background: activeTab === tab
                ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
                : "transparent",
              color: activeTab === tab ? "white" : "var(--text-muted)",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {tab === "products" ? "Products" : "AI Search"}
          </button>
        ))}
      </div>

      {activeTab === "products" ? (
        <>
          {/* Search & Filter */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, flex: 1, minWidth: 250 }}>
              <input
                className="input-glass"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn-primary" type="submit">Search</button>
            </form>
          </div>

          {/* Category Chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            <button
              className="btn-secondary"
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              style={{
                background: !selectedCategory ? "var(--accent-glow)" : undefined,
                borderColor: !selectedCategory ? "var(--accent)" : undefined,
                color: !selectedCategory ? "var(--accent)" : undefined,
                padding: "7px 16px", fontSize: "0.8rem",
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
                  borderColor: selectedCategory === cat.name ? "var(--accent)" : undefined,
                  color: selectedCategory === cat.name ? "var(--accent)" : undefined,
                  textTransform: "capitalize",
                  padding: "7px 16px", fontSize: "0.8rem",
                }}
              >
                {cat.name.replace("_", " ")}
                <span style={{ fontSize: "0.68rem", opacity: 0.6, marginLeft: 4 }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 200, borderRadius: "var(--radius)" }} />
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="glass-card-static" style={{ padding: 64, textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No products found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ opacity: page === 1 ? 0.35 : 1, padding: "8px 18px" }}
                  >
                    ← Prev
                  </button>
                  <span style={{
                    display: "flex", alignItems: "center", padding: "0 18px",
                    color: "var(--text-muted)", fontSize: "0.82rem",
                    background: "var(--bg-glass)", borderRadius: 8,
                    border: "1px solid var(--border-color)",
                  }}>
                    {page} / {totalPages}
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ opacity: page === totalPages ? 0.35 : 1, padding: "8px 18px" }}
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
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>
              AI Semantic <span className="gradient-text">Search</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Ask natural language questions — powered by FAISS vector search and Groq LLM
            </p>
          </div>
          <RagSearch />
        </div>
      )}
    </div>
  );
}
