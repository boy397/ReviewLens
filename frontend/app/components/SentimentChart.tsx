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
  const labels = ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"];
  const dataValues = [1, 2, 3, 4, 5].map((r) => ratingDistribution[r] || 0);
  const barColors = ["#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399"];

  const barData = {
    labels,
    datasets: [
      {
        label: "Reviews",
        data: dataValues,
        backgroundColor: barColors.map((c) => c + "99"),
        borderColor: barColors,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(5,5,8,0.95)",
        titleColor: "#eeeef2",
        bodyColor: "#94949e",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "#4e4e5e", font: { size: 12, weight: 500 as const } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "#4e4e5e", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.03)" },
        border: { display: false },
      },
    },
  };

  const sentimentColor =
    overallSentiment.label === "positive" ? "#34d399"
    : overallSentiment.label === "negative" ? "#f87171"
    : "#fbbf24";

  const normalizedPolarity = (overallSentiment.polarity + 1) / 2;

  const doughnutData = {
    labels: ["Sentiment", ""],
    datasets: [
      {
        data: [normalizedPolarity * 100, (1 - normalizedPolarity) * 100],
        backgroundColor: [sentimentColor + "bb", "rgba(255,255,255,0.04)"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Rating Distribution */}
      <div className="glass-card-static" style={{ padding: 22 }}>
        <h3 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Rating Distribution
        </h3>
        <div style={{ height: 200 }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Sentiment Gauge */}
      <div className="glass-card-static" style={{ padding: 22, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 14, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Overall Sentiment
        </h3>
        <div style={{ position: "relative", width: 150, height: 150, margin: "auto 0" }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: sentimentColor }}>
              {(overallSentiment.polarity * 100).toFixed(0)}%
            </div>
            <div style={{
              fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase",
              color: "var(--text-muted)", letterSpacing: "0.06em",
            }}>
              {overallSentiment.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
