interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  delay?: string;
}

export default function StatsCard({ icon, label, value, subtext, delay }: StatsCardProps) {
  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animationDelay: delay || "0s",
        opacity: 0,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span
        className="gradient-text"
        style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}
      >
        {value}
      </span>
      {subtext && (
        <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
          {subtext}
        </span>
      )}
    </div>
  );
}
