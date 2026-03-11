"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { AnalysisResult } from "../lib/types";
import SentimentChart from "../components/SentimentChart";
import ProsCons from "../components/ProsCons";

interface URLAnalysisResult extends AnalysisResult {
  platform?: string;
  product_info?: {
    title?: string;
    price?: string;
    rating?: string;
    rating_count?: string;
    image_url?: string;
  };
  source?: string;
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState("");

  const exampleUrls = [
    { label: "Amazon iPhone Case", url: "https://www.amazon.in/dp/B0DQM4QC5R" },
    { label: "Flipkart Headphones", url: "https://www.flipkart.com/boat-rockerz-255-pro/p/itm1234" },
  ];

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      setStep("Fetching product page...");
      await new Promise((r) => setTimeout(r, 500));
      setStep("Extracting reviews & product info...");
      await new Promise((r) => setTimeout(r, 300));
      setStep("Running AI analysis...");

      const data = await api.analyzeUrl(url.trim()) as URLAnalysisResult;
      setResult(data);
      setStep("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please check the URL and try again.");
      setStep("");
    } finally {
      setLoading(false);
    }
  }

  const sentimentBadge = result?.overall_sentiment?.label === "positive"
    ? "badge-positive"
    : result?.overall_sentiment?.label === "negative"
    ? "badge-negative"
    : "badge-neutral";

  return (
    <div style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 22, color: "white",
          boxShadow: "0 8px 32px rgba(129, 140, 248, 0.25)",
        }}>
          🔗
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Analyze Any <span className="gradient-text">Product</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 500, margin: "0 auto" }}>
          Paste an Amazon or Flipkart product URL and get instant AI-powered analysis
        </p>
      </div>

      {/* URL Input */}
      <div style={{ maxWidth: 700, margin: "0 auto 40px" }}>
        <form onSubmit={handleAnalyze} style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              className="input-glass"
              placeholder="https://www.amazon.in/dp/B0DQM4QC5R"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                paddingLeft: 44, fontSize: "0.9rem",
                height: 48, borderRadius: 12,
              }}
            />
            <svg
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <button
            className="btn-primary"
            type="submit"
            disabled={loading || !url.trim()}
            style={{
              padding: "0 28px", height: 48, borderRadius: 12,
              fontSize: "0.9rem", whiteSpace: "nowrap",
              opacity: loading || !url.trim() ? 0.6 : 1,
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {/* Example URLs */}
        {!result && !loading && (
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>Try:</span>
            {exampleUrls.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setUrl(ex.url)}
                style={{
                  padding: "5px 12px", borderRadius: 100,
                  background: "var(--bg-glass)", border: "1px solid var(--border-color)",
                  color: "var(--text-muted)", fontSize: "0.72rem",
                  cursor: "pointer", transition: "all 0.3s ease",
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
                {ex.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="animate-fade-in" style={{ textAlign: "center", padding: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "var(--accent-glow)", border: "1px solid rgba(129,140,248,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", animation: "pulse-glow 2s ease-in-out infinite",
          }}>
            <div className="skeleton" style={{ width: 20, height: 20, borderRadius: "50%" }} />
          </div>
          <p style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>{step}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 6 }}>
            This may take 10-20 seconds for AI analysis
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          maxWidth: 700, margin: "0 auto",
          padding: 16, borderRadius: "var(--radius-sm)",
          background: "var(--red-muted)", border: "1px solid rgba(248,113,113,0.2)",
          color: "var(--red)", fontSize: "0.85rem", textAlign: "center",
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Product Header */}
          <div className="glass-card-static" style={{ padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "white", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(129, 140, 248, 0.25)",
            }}>
              {result.product_id?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em",
                marginBottom: 8, lineHeight: 1.3,
                overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {result.product_id}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {result.platform && (
                  <span className="badge badge-category" style={{ textTransform: "capitalize" }}>
                    {result.platform}
                  </span>
                )}
                <span className={`badge ${sentimentBadge}`}>
                  {result.overall_sentiment?.label || "N/A"}
                </span>
                {result.avg_rating > 0 && (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    ⭐ {result.avg_rating.toFixed(1)}
                    {result.review_count > 0 && ` · ${result.review_count} reviews analyzed`}
                  </span>
                )}
                {result.product_info?.price && (
                  <span style={{
                    fontSize: "0.82rem", fontWeight: 700, color: "var(--green)",
                  }}>
                    {result.product_info.price}
                  </span>
                )}
              </div>
              {result.source && (
                <span style={{
                  display: "inline-block", marginTop: 8,
                  fontSize: "0.68rem", color: "var(--text-muted)",
                  background: "var(--bg-glass)", padding: "3px 10px",
                  borderRadius: 100, border: "1px solid var(--border-color)",
                }}>
                  {result.source === "scraped_reviews" ? "Analysis from scraped reviews" : "AI-powered analysis"}
                </span>
              )}
            </div>
          </div>

          {/* Recommendation */}
          {result.recommendation && (
            <div
              className="glass-card-static"
              style={{
                padding: "16px 24px",
                background: "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(167,139,250,0.03))",
                borderColor: "rgba(129,140,248,0.12)",
                display: "flex", alignItems: "center", gap: 14,
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
                <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.88rem", marginTop: 2 }}>
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Charts */}
          {result.rating_distribution && Object.keys(result.rating_distribution).length > 0 && (
            <SentimentChart
              ratingDistribution={result.rating_distribution}
              overallSentiment={result.overall_sentiment}
            />
          )}

          {/* AI Summary */}
          {result.ai_summary && (
            <div className="glass-card-static" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "white", fontWeight: 800,
                }}>
                  AI
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>AI Summary</h3>
              </div>
              <p className="prose-summary" style={{ whiteSpace: "pre-wrap" }}>{result.ai_summary}</p>
            </div>
          )}

          {/* Pros & Cons */}
          {(result.pros?.length > 0 || result.cons?.length > 0) && (
            <ProsCons pros={result.pros || []} cons={result.cons || []} />
          )}

          {/* Aspects */}
          {result.aspects && result.aspects.length > 0 && (
            <div className="glass-card-static" style={{ padding: 24 }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18 }}>
                Aspect Analysis
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {result.aspects.map((aspect) => {
                  const sentColor = aspect.avg_sentiment > 0.05 ? "var(--green)" : aspect.avg_sentiment < -0.05 ? "var(--red)" : "var(--yellow)";
                  const maxCount = Math.max(...result.aspects.map(a => a.count));
                  const barWidth = maxCount > 0 ? (aspect.count / maxCount) * 100 : 0;
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
        </div>
      )}
    </div>
  );
}
