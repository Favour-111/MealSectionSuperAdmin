import React, { useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppContext } from "../AppContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LineChart = ({ filteredOrders, title = "Total Revenue" }) => {
  // Fallback to context if prop not supplied
  const { allOrder } = useAppContext();
  const orders = Array.isArray(filteredOrders) ? filteredOrders : allOrder;
  const chartRef = useRef(null);

  // Helper: group orders by month and sum their total values
  const monthlyData = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);
    orders?.forEach((order) => {
      const created = order?.createdAt ? new Date(order.createdAt) : null;
      if (!created || isNaN(created)) return;
      const monthIndex = created.getMonth();
      const total =
        (order.subtotal || 0) +
        (order.deliveryFee || 0) +
        (order.serviceFee || 0);
      monthlyTotals[monthIndex] += total;
    });
    return monthlyTotals;
  }, [orders]);

  const gradientFill = (context) => {
    const chart = context.chart || chartRef.current;
    const { ctx, chartArea } = chart || {};
    if (!ctx || !chartArea) return "rgba(99, 102, 241, 0.15)";
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)"); // indigo-500
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.02)");
    return gradient;
  };

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: "Revenue (₦)",
        data: monthlyData,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: (ctx) => gradientFill(ctx),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(99, 102, 241, 1)",
        tension: 0.35,
        fill: true,
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
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (value) => `₦${Number(value).toLocaleString()}`,
        },
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
          label: (ctx) => `₦${Number(ctx.parsed.y).toLocaleString()}`,
        },
      },
    },
    animation: { duration: 600, easing: "easeOutQuart" },
  };

  return (
    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="font-semibold text-gray-900 mb-2">{title}</div>
      <div className="h-64">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
