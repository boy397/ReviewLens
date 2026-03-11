import Link from "next/link";

export default function Home() {
  return (
    <div style={{ paddingTop: 0 }}>
      {/* ═══ Hero ═══ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Gradient Orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute", top: "-10%", left: "10%",
              width: 600, height: 600, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
              filter: "blur(80px)",
              animation: "orb-drift 20s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: "0%", right: "5%",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
              animation: "orb-drift 25s ease-in-out infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute", top: "30%", right: "30%",
              width: 300, height: 300, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244,114,182,0.04) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orb-drift 18s ease-in-out infinite",
            }}
          />
          {/* Grid lines */}
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `
                linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
            }}
          />
        </div>

        <div style={{ position: "relative", textAlign: "center", maxWidth: 760, padding: "0 24px" }}>
          {/* Chip */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 18px", borderRadius: 100,
              border: "1px solid var(--border-color)",
              background: "var(--bg-glass)",
              marginBottom: 28, fontSize: "0.78rem",
              color: "var(--text-secondary)",
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--green)", display: "inline-block",
              boxShadow: "0 0 8px var(--green)",
            }} />
            Powered by FAISS + Groq AI
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(2.8rem, 6.5vw, 4.8rem)",
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.04em", marginBottom: 22,
              opacity: 0,
            }}
          >
            Decode Every{" "}
            <span className="gradient-text-warm">Product Review</span>
            <br />
            with AI
          </h1>

          {/* Subtext */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "var(--text-secondary)", lineHeight: 1.8,
              marginBottom: 40, maxWidth: 540,
              margin: "0 auto 40px", opacity: 0,
            }}
          >
            Semantic search across thousands of reviews. Get instant pros, cons,
            sentiment insights, and AI-generated summaries — in seconds, not hours.
          </p>

          {/* CTA */}
          <div
            className="animate-fade-in-up delay-300"
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", opacity: 0 }}
          >
            <Link href="/dashboard" className="btn-primary" style={{ padding: "14px 36px", fontSize: "0.95rem" }}>
              Explore Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/dashboard#rag" className="btn-secondary" style={{ padding: "14px 36px", fontSize: "0.95rem" }}>
              Try RAG Search
            </Link>
          </div>

          {/* Trust */}
          <div
            className="animate-fade-in-up delay-400"
            style={{
              marginTop: 48, display: "flex", justifyContent: "center",
              gap: 32, opacity: 0,
              color: "var(--text-muted)", fontSize: "0.8rem",
            }}
          >
            <span>15,000+ Reviews Analyzed</span>
            <span style={{ color: "var(--border-color)" }}>|</span>
            <span>7,200+ Products</span>
            <span style={{ color: "var(--border-color)" }}>|</span>
            <span>Real-time AI</span>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="section">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            className="badge"
            style={{
              background: "var(--accent-glow)", color: "var(--accent)",
              border: "1px solid rgba(129,140,248,0.15)",
              marginBottom: 16, display: "inline-block",
            }}
          >
            How It Works
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            From Reviews to <span className="gradient-text">Insights</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { step: "01", title: "Collect", desc: "Aggregate reviews from a dataset or scrape live from product URLs.", color: "#818cf8" },
            { step: "02", title: "Analyze", desc: "FAISS-powered semantic indexing with sentence-transformers for deep retrieval.", color: "#a78bfa" },
            { step: "03", title: "Understand", desc: "AI extracts sentiment, aspects, pros & cons using Groq LLM summarization.", color: "#f472b6" },
            { step: "04", title: "Decide", desc: "Get purchase recommendations, fake review flags, and actionable insights.", color: "#60a5fa" },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in-up"
              style={{ padding: "32px 28px", opacity: 0, animationDelay: `${i * 0.12}s` }}
            >
              <div
                style={{
                  fontSize: "0.7rem", fontWeight: 700, color: feature.color,
                  letterSpacing: "0.1em", marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                Step {feature.step}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>
                {feature.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.75 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Tech Stack + CTA ═══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div
          className="glass-card-static"
          style={{
            padding: "56px 40px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(129,140,248,0.04) 0%, rgba(244,114,182,0.02) 100%)",
            borderColor: "rgba(129,140,248,0.08)",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Subtle glow */}
          <div style={{
            position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Built with Modern <span className="gradient-text">Technology</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 28 }}>
              Enterprise-grade stack powering every insight
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              {["FastAPI", "FAISS", "Groq LLM", "Next.js 14", "TypeScript", "Chart.js", "Sentence-Transformers"].map(
                (tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: "7px 18px", borderRadius: 100,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.78rem", fontWeight: 500,
                      color: "var(--text-secondary)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
            <Link href="/dashboard" className="btn-primary" style={{ padding: "13px 32px" }}>
              Start Analyzing →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "28px 24px", textAlign: "center",
          color: "var(--text-muted)", fontSize: "0.78rem",
          display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
        }}
      >
        <div
          style={{
            width: 18, height: 18, borderRadius: 4,
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, fontWeight: 900, color: "white",
          }}
        >
          R
        </div>
        ReviewLens — AI-Powered Review Analysis
      </footer>
    </div>
  );
}
