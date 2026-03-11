"use client";

import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface SentimentChartProps {
  ratingDistribution: Record<number, number>;
  overallSentiment: { polarity: number; label: string };
}

export default function SentimentChart({ ratingDistribution, overallSentiment }: SentimentChartProps) {
  // Rating distribution bar chart
  const labels = ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"];
  const dataValues = [1, 2, 3, 4, 5].map((r) => ratingDistribution[r] || 0);
  const barColors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

  const barData = {
    labels,
    datasets: [
      {
        label: "Reviews",
        data: dataValues,
        backgroundColor: barColors.map((c) => c + "aa"),
        borderColor: barColors,
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17,17,24,0.95)",
        titleColor: "#f0f0f5",
        bodyColor: "#8b8b9e",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "#5a5a6e", font: { size: 12 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "#5a5a6e", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { display: false },
      },
    },
  };

  // Sentiment doughnut
  const sentimentColor =
    overallSentiment.label === "positive"
      ? "#22c55e"
      : overallSentiment.label === "negative"
      ? "#ef4444"
      : "#eab308";

  const normalizedPolarity = (overallSentiment.polarity + 1) / 2;

  const doughnutData = {
    labels: ["Sentiment", ""],
    datasets: [
      {
        data: [normalizedPolarity * 100, (1 - normalizedPolarity) * 100],
        backgroundColor: [sentimentColor + "cc", "rgba(255,255,255,0.05)"],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Rating Distribution */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>
          Rating Distribution
        </h3>
        <div style={{ height: 200 }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Sentiment Gauge */}
      <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16, alignSelf: "flex-start" }}>
          Overall Sentiment
        </h3>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: sentimentColor }}>
              {(overallSentiment.polarity * 100).toFixed(0)}%
            </div>
            <div
              style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              {overallSentiment.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
