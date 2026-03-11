"use client";

import { useState, useEffect, use } from "react";
import { api } from "../../lib/api";
import { AnalysisResult, Review } from "../../lib/types";
import SentimentChart from "../../components/SentimentChart";
import ProsCons from "../../components/ProsCons";
import ReviewList from "../../components/ReviewList";
import Link from "next/link";

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
      <div style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px" }}>
        <div className="skeleton" style={{ height: 48, marginBottom: 24, maxWidth: 350 }} />
        <div className="skeleton" style={{ height: 80, marginBottom: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 260 }} />
          <div className="skeleton" style={{ height: 260 }} />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "var(--red-muted)", border: "1px solid rgba(248,113,113,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 24,
        }}>
          !
        </div>
        <h2 style={{ marginBottom: 8, fontSize: "1.3rem", fontWeight: 700 }}>Analysis Failed</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error || "Product not found"}</p>
        <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  const sentimentBadge = analysis.overall_sentiment.label === "positive" ? "badge-positive" : analysis.overall_sentiment.label === "negative" ? "badge-negative" : "badge-neutral";
  const totalReviewPages = Math.ceil(totalReviews / 10);

  return (
    <div style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px" }}>
      {/* Breadcrumb */}
      <div className="animate-fade-in" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <Link href="/dashboard" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>
          Dashboard
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>/</span>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 500 }}>
          {analysis.product_id}
        </span>
      </div>

      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(129, 140, 248, 0.25)",
          }}>
            {analysis.product_id.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
              {analysis.product_id}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="badge badge-category" style={{ textTransform: "capitalize" }}>
                {analysis.category.replace("_", " ")}
              </span>
              <span className={`badge ${sentimentBadge}`}>
                {analysis.overall_sentiment.label}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                ⭐ {analysis.avg_rating.toFixed(1)} · {analysis.review_count} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div
        className="glass-card-static animate-fade-in-up delay-100"
        style={{
          padding: "18px 24px", marginBottom: 28,
          background: "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(167,139,250,0.03))",
          borderColor: "rgba(129,140,248,0.12)",
          display: "flex", alignItems: "center", gap: 14, opacity: 0,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "var(--accent-glow)", border: "1px solid rgba(129,140,248,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>
          🎯
        </div>
        <div>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Recommendation
          </span>
          <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem", marginTop: 2 }}>
            {analysis.recommendation}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="animate-fade-in-up delay-200" style={{ marginBottom: 28, opacity: 0 }}>
        <SentimentChart
          ratingDistribution={analysis.rating_distribution}
          overallSentiment={analysis.overall_sentiment}
        />
      </div>

      {/* AI Summary */}
      <div className="glass-card-static animate-fade-in-up delay-300" style={{ padding: 24, marginBottom: 28, opacity: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color: "white", fontWeight: 800,
          }}>
            AI
          </div>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700 }}>AI Summary</h2>
        </div>
        <p className="prose-summary" style={{ whiteSpace: "pre-wrap" }}>{analysis.ai_summary}</p>
      </div>

      {/* Pros & Cons */}
      <div className="animate-fade-in-up delay-400" style={{ marginBottom: 28, opacity: 0 }}>
        <ProsCons pros={analysis.pros} cons={analysis.cons} />
      </div>

      {/* Aspects */}
      {analysis.aspects.length > 0 && (
        <div className="glass-card-static" style={{ padding: 24, marginBottom: 28 }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            Aspect Analysis
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {analysis.aspects.map((aspect) => {
              const sentColor = aspect.avg_sentiment > 0.05 ? "var(--green)" : aspect.avg_sentiment < -0.05 ? "var(--red)" : "var(--yellow)";
              const barWidth = Math.min(100, (aspect.count / analysis.review_count) * 100 * 3);
              return (
                <div
                  key={aspect.aspect}
                  style={{
                    padding: "13px 16px", borderRadius: "var(--radius-xs)",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, textTransform: "capitalize" }}>
                      {aspect.aspect.replace("_", " ")}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{aspect.count}×</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barWidth}%`, background: sentColor, borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: "0.68rem", color: sentColor, marginTop: 4, display: "block" }}>
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
        <div className="glass-card-static" style={{ padding: 24, marginBottom: 28 }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: "var(--red-muted)", border: "1px solid rgba(248,113,113,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10,
            }}>
              !
            </div>
            Suspicious Reviews
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {analysis.fake_review_flags.slice(0, 5).map((flag) => (
              <div
                key={flag.review_id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 16px", borderRadius: "var(--radius-xs)",
                  background: "rgba(248, 113, 113, 0.03)",
                  border: "1px solid rgba(248, 113, 113, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>Review #{flag.review_id}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {flag.flags.map((f) => (
                      <span key={f} className="badge badge-negative" style={{ fontSize: "0.6rem" }}>
                        {f.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.82rem" }}>
                  {(flag.score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18 }}>
          Reviews ({totalReviews})
        </h2>
        <ReviewList reviews={reviews} />
        {totalReviewPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            <button
              className="btn-secondary"
              onClick={() => loadReviews(reviewPage - 1)}
              disabled={reviewPage === 1}
              style={{ opacity: reviewPage === 1 ? 0.35 : 1 }}
            >
              ← Prev
            </button>
            <span style={{
              display: "flex", alignItems: "center", padding: "0 16px",
              color: "var(--text-muted)", fontSize: "0.82rem",
              background: "var(--bg-glass)", borderRadius: 8,
              border: "1px solid var(--border-color)",
            }}>
              {reviewPage} / {totalReviewPages}
            </span>
            <button
              className="btn-secondary"
              onClick={() => loadReviews(reviewPage + 1)}
              disabled={reviewPage === totalReviewPages}
              style={{ opacity: reviewPage === totalReviewPages ? 0.35 : 1 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
