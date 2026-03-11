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
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          className="input-glass"
          placeholder="Ask anything about products... e.g., 'Which laptops have the best battery life?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" type="submit" disabled={loading} style={{ whiteSpace: "nowrap" }}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="skeleton" style={{ width: 16, height: 16, borderRadius: "50%" }} />
              Searching...
            </span>
          ) : (
            "🧠 RAG Search"
          )}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: 16,
            borderRadius: "var(--radius-sm)",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "var(--red)",
            fontSize: "0.85rem",
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Answer */}
          <div className="glass-card animate-pulse-glow" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🧠</span>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--accent-tertiary)" }}>
                AI Answer
              </h3>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <p className="prose-summary" style={{ whiteSpace: "pre-wrap" }}>{result.answer}</p>
          </div>

          {/* Source reviews */}
          {result.source_reviews.length > 0 && (
            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
