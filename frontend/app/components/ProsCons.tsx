import { ProConItem } from "../lib/types";

export default function ProsCons({ pros, cons }: { pros: ProConItem[]; cons: ProConItem[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Pros */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>👍</span>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--green)" }}>Pros</span>
        </h3>
        {pros.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No strong pros detected</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pros.map((pro, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(34, 197, 94, 0.06)",
                  border: "1px solid rgba(34, 197, 94, 0.1)",
                }}
              >
                <span style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 500, textTransform: "capitalize" }}>
                  ✓ {pro.text}
                </span>
                <span className="badge badge-positive">{pro.frequency}×</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cons */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>👎</span>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--red)" }}>Cons</span>
        </h3>
        {cons.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No strong cons detected</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cons.map((con, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.06)",
                  border: "1px solid rgba(239, 68, 68, 0.1)",
                }}
              >
                <span style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 500, textTransform: "capitalize" }}>
                  ✗ {con.text}
                </span>
                <span className="badge badge-negative">{con.frequency}×</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
