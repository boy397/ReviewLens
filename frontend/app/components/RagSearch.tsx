"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { RAGResult } from "../lib/types";
import ReviewList from "./ReviewList";

export default function RagSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RAGResult | null>(null);
  const [error, setError] = useState("");

  const suggestions = [
    "Which laptops have the best battery life?",
    "Are the headphones comfortable for long use?",
    "What do users say about smartphone cameras?",
    "Any issues with home appliance durability?",
  ];

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await api.ragQuery(query.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          className="input-glass"
          placeholder="Ask anything about products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" type="submit" disabled={loading} style={{ whiteSpace: "nowrap" }}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="skeleton" style={{ width: 14, height: 14, borderRadius: "50%" }} />
              Searching...
            </span>
          ) : (
            <>
              Search
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
      </form>

      {/* Suggestion Chips */}
      {!result && !loading && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); }}
              style={{
                padding: "6px 14px", borderRadius: 100,
                background: "var(--bg-glass)", border: "1px solid var(--border-color)",
                color: "var(--text-muted)", fontSize: "0.75rem",
                cursor: "pointer", transition: "all 0.3s ease",
                fontWeight: 500,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: 14, borderRadius: "var(--radius-sm)",
            background: "var(--red-muted)", border: "1px solid rgba(248,113,113,0.2)",
            color: "var(--red)", fontSize: "0.85rem", marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Answer */}
          <div className="glass-card-static animate-pulse-glow" style={{ padding: 24, borderColor: "rgba(129,140,248,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "white",
              }}>
                AI
              </div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                AI Answer
              </h3>
              <span
                style={{
                  marginLeft: "auto", fontSize: "0.72rem",
                  color: "var(--text-muted)", fontWeight: 500,
                  background: "var(--bg-glass)", padding: "3px 10px",
                  borderRadius: 100, border: "1px solid var(--border-color)",
                }}
              >
                {(result.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="prose-summary" style={{ whiteSpace: "pre-wrap" }}>{result.answer}</p>
          </div>

          {/* Source reviews */}
          {result.source_reviews.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)",
                  marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em",
                }}
              >
                Source Reviews ({result.source_reviews.length})
              </h3>
              <ReviewList reviews={result.source_reviews} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
