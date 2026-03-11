import { Review } from "../lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "star-filled" : "star-empty"} style={{ fontSize: "0.8rem" }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>No reviews found</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {reviews.map((review) => (
        <div
          key={review.review_id}
          className="glass-card"
          style={{
            padding: 20,
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <StarRating rating={review.rating} />
              <span className="badge badge-category" style={{ fontSize: "0.7rem" }}>
                {review.category}
              </span>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              {review.review_date}
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.7 }}>
            {review.review_text.length > 300 ? review.review_text.slice(0, 300) + "..." : review.review_text}
          </p>
        </div>
      ))}
    </div>
  );
}
