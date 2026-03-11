import { ProConItem } from "../lib/types";

export default function ProsCons({ pros, cons }: { pros: ProConItem[]; cons: ProConItem[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Pros */}
      <div className="glass-card-static" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--green-muted)", border: "1px solid rgba(52,211,153,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>
            ✓
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--green)" }}>Pros</span>
          <span style={{
            marginLeft: "auto", fontSize: "0.7rem",
            color: "var(--text-muted)", fontWeight: 600,
          }}>
            {pros.length} found
          </span>
        </h3>
        {pros.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No strong pros detected</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pros.map((pro, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: "var(--radius-xs)",
                  background: "rgba(52, 211, 153, 0.04)",
                  border: "1px solid rgba(52, 211, 153, 0.08)",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{
                  color: "var(--text-primary)", fontSize: "0.84rem",
                  fontWeight: 500, textTransform: "capitalize",
                }}>
                  {pro.text}
                </span>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700,
                  color: "var(--green)", background: "var(--green-muted)",
                  padding: "2px 8px", borderRadius: 100,
                  minWidth: 32, textAlign: "center",
                }}>
                  {pro.frequency}×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cons */}
      <div className="glass-card-static" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--red-muted)", border: "1px solid rgba(248,113,113,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>
            ✗
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--red)" }}>Cons</span>
          <span style={{
            marginLeft: "auto", fontSize: "0.7rem",
            color: "var(--text-muted)", fontWeight: 600,
          }}>
            {cons.length} found
          </span>
        </h3>
        {cons.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No strong cons detected</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cons.map((con, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: "var(--radius-xs)",
                  background: "rgba(248, 113, 113, 0.04)",
                  border: "1px solid rgba(248, 113, 113, 0.08)",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{
                  color: "var(--text-primary)", fontSize: "0.84rem",
                  fontWeight: 500, textTransform: "capitalize",
                }}>
                  {con.text}
                </span>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700,
                  color: "var(--red)", background: "var(--red-muted)",
                  padding: "2px 8px", borderRadius: 100,
                  minWidth: 32, textAlign: "center",
                }}>
                  {con.frequency}×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
