import Link from "next/link";

export default function Home() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero Section */}
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
        {/* Background Gradient Orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 800, padding: "0 24px" }}>
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 100,
              border: "1px solid var(--border-color)",
              background: "var(--bg-glass)",
              marginBottom: 32,
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            <span style={{ fontSize: 14 }}>🧠</span>
            Powered by RAG + FAISS AI Engine
          </div>

          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 24,
              opacity: 0,
            }}
          >
            Unlock the Truth Behind{" "}
            <span className="gradient-text">Product Reviews</span>
          </h1>

          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: 48,
              maxWidth: 600,
              margin: "0 auto 48px",
              opacity: 0,
            }}
          >
            AI-powered sentiment analysis, aspect extraction, and smart recommendations.
            Get instant pros &amp; cons from thousands of reviews in seconds.
          </p>

          <div
            className="animate-fade-in-up delay-300"
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", opacity: 0 }}
          >
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: "1.05rem", padding: "14px 36px" }}>
              🚀 Explore Dashboard
            </Link>
            <Link href="/dashboard#rag" className="btn-secondary" style={{ fontSize: "1.05rem", padding: "14px 36px" }}>
              🔍 Try RAG Search
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          How It <span className="gradient-text">Works</span>
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: 60,
            maxWidth: 500,
            margin: "0 auto 60px",
            fontSize: "0.95rem",
          }}
        >
          From raw reviews to actionable insights in milliseconds
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
          {[
            { icon: "📥", title: "Collect Reviews", desc: "Aggregate reviews from the dataset or scrape from product URLs in real-time." },
            { icon: "🧠", title: "RAG Analysis", desc: "FAISS-powered semantic search with sentence-transformers for intelligent retrieval." },
            { icon: "💡", title: "AI Insights", desc: "Sentiment analysis, aspect extraction, and Groq LLM-powered summarization." },
            { icon: "🎯", title: "Smart Results", desc: "Pros, cons, fake review detection, and purchase recommendations." },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in-up"
              style={{ padding: 32, opacity: 0, animationDelay: `${i * 0.1}s` }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{feature.icon}</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.7 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div
          className="glass-card"
          style={{
            padding: "48px 40px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 24 }}>
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {["FastAPI", "FAISS", "Sentence-Transformers", "Groq LLM", "Next.js", "TypeScript", "Chart.js", "TextBlob"].map(
              (tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 100,
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-color)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
        }}
      >
        Built with 💜 by ReviewLens — AI-Powered Review Analysis
      </footer>
    </div>
  );
}
