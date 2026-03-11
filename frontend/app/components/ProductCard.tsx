import Link from "next/link";
import { Product } from "../lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "star-filled" : "star-empty"}>
          ★
        </span>
      ))}
    </span>
  );
}

const categoryIcons: Record<string, string> = {
  smartphones: "📱",
  laptops: "💻",
  electronics: "🔌",
  headphones: "🎧",
  gaming: "🎮",
  fitness: "💪",
  home_appliances: "🏠",
  kitchen: "🍳",
};

export default function ProductCard({ product }: { product: Product }) {
  const icon = categoryIcons[product.category] || "📦";

  return (
    <Link href={`/product/${product.product_id}`} style={{ textDecoration: "none" }}>
      <div
        className="glass-card"
        style={{
          padding: 24,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 32 }}>{icon}</span>
          <span className="badge badge-category">{product.category}</span>
        </div>

        {/* Product ID */}
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {product.product_id}
        </h3>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarRating rating={product.avg_rating} />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {product.avg_rating.toFixed(1)}
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            {product.review_count} reviews
          </span>
          <span
            style={{
              color: "var(--accent-primary)",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            View Analysis →
          </span>
        </div>
      </div>
    </Link>
  );
}
