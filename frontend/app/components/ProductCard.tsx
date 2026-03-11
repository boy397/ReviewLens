import Link from "next/link";
import { Product } from "../lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "star-filled" : "star-empty"} style={{ fontSize: "0.75rem" }}>
          ★
        </span>
      ))}
    </span>
  );
}

const categoryGradients: Record<string, string> = {
  smartphones: "linear-gradient(135deg, #818cf8, #60a5fa)",
  laptops: "linear-gradient(135deg, #a78bfa, #818cf8)",
  electronics: "linear-gradient(135deg, #34d399, #60a5fa)",
  headphones: "linear-gradient(135deg, #f472b6, #a78bfa)",
  gaming: "linear-gradient(135deg, #fb923c, #f472b6)",
  fitness: "linear-gradient(135deg, #34d399, #a7f3d0)",
  home_appliances: "linear-gradient(135deg, #60a5fa, #34d399)",
  kitchen: "linear-gradient(135deg, #fbbf24, #fb923c)",
};

export default function ProductCard({ product }: { product: Product }) {
  const gradient = categoryGradients[product.category] || "linear-gradient(135deg, var(--accent), var(--accent-2))";

  return (
    <Link href={`/product/${product.product_id}`} style={{ textDecoration: "none" }}>
      <div
        className="glass-card"
        style={{
          padding: 0,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Color Bar */}
        <div style={{ height: 3, background: gradient, borderRadius: "14px 14px 0 0" }} />

        <div style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="badge badge-category" style={{ textTransform: "capitalize" }}>
              {product.category.replace("_", " ")}
            </span>
            <span
              style={{
                fontSize: "0.9rem", fontWeight: 800,
                color: product.avg_rating >= 4 ? "var(--green)" : product.avg_rating >= 3 ? "var(--yellow)" : "var(--red)",
              }}
            >
              {product.avg_rating.toFixed(1)}
            </span>
          </div>

          {/* Product ID */}
          <h3
            style={{
              fontSize: "1rem", fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            {product.product_id}
          </h3>

          {/* Rating */}
          <StarRating rating={product.avg_rating} />

          {/* Footer */}
          <div
            style={{
              marginTop: "auto", display: "flex",
              alignItems: "center", justifyContent: "space-between",
              paddingTop: 14, borderTop: "1px solid var(--border-color)",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              {product.review_count} reviews
            </span>
            <span
              style={{
                color: "var(--accent)", fontSize: "0.78rem",
                fontWeight: 600, display: "inline-flex",
                alignItems: "center", gap: 4,
              }}
            >
              Analyze
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
