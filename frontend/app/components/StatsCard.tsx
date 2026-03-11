interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  delay?: string;
}

export default function StatsCard({ icon, label, value, trend, delay }: StatsCardProps) {
  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        animationDelay: delay || "0s",
        opacity: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle accent glow */}
      <div
        style={{
          position: "absolute", top: -20, right: -20,
          width: 80, height: 80, borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        {trend && (
          <span style={{
            fontSize: "0.7rem", fontWeight: 600,
            color: "var(--green)", background: "var(--green-muted)",
            padding: "2px 8px", borderRadius: 100,
          }}>
            {trend}
          </span>
        )}
      </div>

      <span
        style={{
          color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>

      <span
        className="animate-count"
        style={{
          fontSize: "1.8rem", fontWeight: 800,
          letterSpacing: "-0.03em", lineHeight: 1,
          color: "var(--text-primary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
