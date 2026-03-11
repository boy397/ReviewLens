import { Review } from "../lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "star-filled" : "star-empty"} style={{ fontSize: "0.72rem" }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="glass-card-static" style={{ padding: 48, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No reviews found</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {reviews.map((review) => {
        const ratingColor = review.rating >= 4 ? "var(--green)" : review.rating >= 3 ? "var(--yellow)" : "var(--red)";
        return (
          <div
            key={review.review_id}
            className="glass-card"
            style={{ padding: "18px 20px", cursor: "default" }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `linear-gradient(135deg, ${ratingColor}33, ${ratingColor}11)`,
                  border: `1px solid ${ratingColor}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 800, color: ratingColor,
                }}>
                  {review.rating}
                </div>
                <StarRating rating={review.rating} />
                <span className="badge badge-category" style={{ fontSize: "0.65rem" }}>
                  {review.category}
                </span>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                {review.review_date}
              </span>
            </div>
            <p style={{
              color: "var(--text-secondary)", fontSize: "0.84rem",
              lineHeight: 1.75, margin: 0,
            }}>
              {review.review_text.length > 280 ? review.review_text.slice(0, 280) + "..." : review.review_text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
