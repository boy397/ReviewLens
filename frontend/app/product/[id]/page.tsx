"use client";

import { useState, useEffect, use } from "react";
import { api } from "../../lib/api";
import { AnalysisResult, Review } from "../../lib/types";
import SentimentChart from "../../components/SentimentChart";
import ProsCons from "../../components/ProsCons";
import ReviewList from "../../components/ReviewList";

const categoryIcons: Record<string, string> = {
  smartphones: "📱", laptops: "💻", electronics: "🔌", headphones: "🎧",
  gaming: "🎮", fitness: "💪", home_appliances: "🏠", kitchen: "🍳",
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalysis();
    loadReviews(1);
  }, [id]);

  async function loadAnalysis() {
    setLoading(true);
    try {
      const data = await api.getProductAnalysis(id);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analysis");
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews(page: number) {
    try {
      const data = await api.getProductReviews(id, page, 10);
      setReviews(data.reviews);
      setTotalReviews(data.total);
      setReviewPage(page);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 88, maxWidth: 1280, margin: "0 auto", padding: "88px 24px 60px" }}>
        <div className="skeleton" style={{ height: 60, marginBottom: 24, maxWidth: 400 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="skeleton" style={{ height: 280 }} />
          <div className="skeleton" style={{ height: 280 }} />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{ paddingTop: 88, maxWidth: 1280, margin: "0 auto", padding: "88px 24px 60px", textAlign: "center" }}>
        <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>❌</span>
        <h2 style={{ marginBottom: 8 }}>Analysis Failed</h2>
        <p style={{ color: "var(--text-muted)" }}>{error || "Product not found"}</p>
      </div>
    );
  }

  const icon = categoryIcons[analysis.category] || "📦";
  const sentimentBadge = analysis.overall_sentiment.label === "positive" ? "badge-positive" : analysis.overall_sentiment.label === "negative" ? "badge-negative" : "badge-neutral";
  const totalReviewPages = Math.ceil(totalReviews / 10);

  return (
    <div style={{ paddingTop: 88, maxWidth: 1280, margin: "0 auto", padding: "88px 24px 60px" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>{icon}</span>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {analysis.product_id}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <span className="badge badge-category" style={{ textTransform: "capitalize" }}>
                {analysis.category.replace("_", " ")}
              </span>
              <span className={`badge ${sentimentBadge}`}>
                {analysis.overall_sentiment.label}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                ⭐ {analysis.avg_rating.toFixed(1)} • {analysis.review_count} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div
        className="glass-card animate-fade-in-up delay-100"
        style={{
          padding: "20px 28px",
          marginBottom: 32,
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))",
          borderColor: "rgba(99,102,241,0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: 0,
        }}
      >
        <span style={{ fontSize: 24 }}>🎯</span>
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recommendation
          </span>
          <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.95rem", marginTop: 2 }}>
            {analysis.recommendation}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="animate-fade-in-up delay-200" style={{ marginBottom: 32, opacity: 0 }}>
        <SentimentChart
          ratingDistribution={analysis.rating_distribution}
          overallSentiment={analysis.overall_sentiment}
        />
      </div>

      {/* AI Summary */}
      <div className="glass-card animate-fade-in-up delay-300" style={{ padding: 28, marginBottom: 32, opacity: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>🧠</span>
          <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>AI Summary</h2>
        </div>
        <p className="prose-summary" style={{ whiteSpace: "pre-wrap" }}>{analysis.ai_summary}</p>
      </div>

      {/* Pros & Cons */}
      <div className="animate-fade-in-up delay-400" style={{ marginBottom: 32, opacity: 0 }}>
        <ProsCons pros={analysis.pros} cons={analysis.cons} />
      </div>

      {/* Aspects */}
      {analysis.aspects.length > 0 && (
        <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📊</span> Aspect Analysis
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {analysis.aspects.map((aspect) => {
              const sentColor = aspect.avg_sentiment > 0.05 ? "var(--green)" : aspect.avg_sentiment < -0.05 ? "var(--red)" : "var(--yellow)";
              const barWidth = Math.min(100, (aspect.count / analysis.review_count) * 100 * 3);
              return (
                <div
                  key={aspect.aspect}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize" }}>
                      {aspect.aspect.replace("_", " ")}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{aspect.count}×</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barWidth}%`, background: sentColor, borderRadius: 2, transition: "width 0.5s ease" }} />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: sentColor, marginTop: 4, display: "block" }}>
                    {aspect.avg_sentiment > 0 ? "+" : ""}{(aspect.avg_sentiment * 100).toFixed(0)}% sentiment
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fake Review Flags */}
      {analysis.fake_review_flags.length > 0 && (
        <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚩</span> Fake Review Detection
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {analysis.fake_review_flags.slice(0, 5).map((flag) => (
              <div
                key={flag.review_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.04)",
                  border: "1px solid rgba(239, 68, 68, 0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Review #{flag.review_id}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {flag.flags.map((f) => (
                      <span key={f} className="badge badge-negative" style={{ fontSize: "0.65rem" }}>
                        {f.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.85rem" }}>
                  {(flag.score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span>💬</span> Reviews ({totalReviews})
        </h2>
        <ReviewList reviews={reviews} />
        {totalReviewPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            <button
              className="btn-secondary"
              onClick={() => loadReviews(reviewPage - 1)}
              disabled={reviewPage === 1}
              style={{ opacity: reviewPage === 1 ? 0.4 : 1 }}
            >
              ← Prev
            </button>
            <span style={{ display: "flex", alignItems: "center", padding: "0 16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              {reviewPage} / {totalReviewPages}
            </span>
            <button
              className="btn-secondary"
              onClick={() => loadReviews(reviewPage + 1)}
              disabled={reviewPage === totalReviewPages}
              style={{ opacity: reviewPage === totalReviewPages ? 0.4 : 1 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
