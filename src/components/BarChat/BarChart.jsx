import React, { useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BarChart = ({ filteredOrders = [], title = "Weekly Overview" }) => {
  const chartRef = useRef(null);

  // Normalize title to a safe renderable string (avoid passing objects)
  const safeTitle = useMemo(() => {
    if (title == null) return "Weekly Overview";
    if (typeof title === "string" || typeof title === "number")
      return String(title);
    // Attempt common field fallbacks
    if (title.header) return String(title.header);
    if (title.name) return String(title.name);
    if (title.storeName) return String(title.storeName);
    if (title.title) return String(title.title);
    // Last resort: do not JSON.stringify large objects; just generic label
    return "Weekly Overview";
  }, [title]);

  // Derive weekly counts from filteredOrders if provided
  const { labels, values } = useMemo(() => {
    if (!Array.isArray(filteredOrders) || filteredOrders.length === 0) {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [45, 25, 65, 50, 85, 95, 55],
      };
    }
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    filteredOrders.forEach((o) => {
      const d = o?.createdAt ? new Date(o.createdAt) : null;
      if (!d || isNaN(d)) return;
      const label = dayLabels[d.getDay()];
      counts[label] = (counts[label] || 0) + 1;
    });
    const ordered = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return { labels: ordered, values: ordered.map((k) => counts[k] || 0) };
  }, [filteredOrders]);

  const gradientBg = (context) => {
    const chart = context.chart || chartRef.current;
    const { ctx, chartArea } = chart || {};
    if (!ctx || !chartArea) return "rgba(99, 102, 241, 0.3)"; // fallback indigo-500/30
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.9)"); // indigo-500
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.2)");
    return gradient;
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: values,
        backgroundColor: (ctx) => gradientBg(ctx),
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.06)", drawBorder: false },
        ticks: { color: "#64748b", font: { size: 11 }, precision: 0 },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} orders`,
        },
      },
    },
    animation: { duration: 600, easing: "easeOutQuart" },
  };

  return (
    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
      <div className="font-semibold text-gray-900 mb-2">{safeTitle}</div>
      <div className="h-64">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
