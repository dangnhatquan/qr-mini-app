import React, { useEffect, useState } from "react";
import { onLCP, onINP, onCLS, onFCP, onTTFB } from "web-vitals";

interface MetricState {
  LCP: string;
  INP: string;
  CLS: string;
  FCP: string;
  TTFB: string;
}

const PerformanceOverlay: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricState>({
    LCP: "-",
    INP: "-",
    CLS: "-",
    FCP: "-",
    TTFB: "-",
  });

  useEffect(() => {
    const updateMetric = (name: keyof MetricState, value: number) => {
      setMetrics((prev) => ({
        ...prev,
        [name]: name === "CLS" ? value.toFixed(3) : `${Math.round(value)}ms`,
      }));

      // Xác định ngưỡng đánh giá (Good / Needs Improvement / Poor) theo chuẩn Google
      let color = "#22c55e"; // Green (Good)
      let rating = "Good";

      if (name === "LCP") {
        if (value > 4000) {
          color = "#ef4444"; // Red (Poor)
          rating = "Poor";
        } else if (value > 2500) {
          color = "#f97316"; // Orange (Needs Improvement)
          rating = "Needs Imp.";
        }
      } else if (name === "INP") {
        if (value > 500) {
          color = "#ef4444";
          rating = "Poor";
        } else if (value > 200) {
          color = "#f97316";
          rating = "Needs Imp.";
        }
      } else if (name === "CLS") {
        if (value > 0.25) {
          color = "#ef4444";
          rating = "Poor";
        } else if (value > 0.1) {
          color = "#f97316";
          rating = "Needs Imp.";
        }
      }

      console.log(
        `%c[Web-Vitals] ${name}: ${
          name === "CLS" ? value.toFixed(3) : `${Math.round(value)}ms`
        } (${rating})`,
        `color: ${color}; font-weight: bold; font-size: 12px;`,
      );
    };

    // Lắng nghe các chỉ số từ web-vitals
    try {
      onLCP((m) => updateMetric("LCP", m.value));
      onINP((m) => updateMetric("INP", m.value));
      onCLS((m) => updateMetric("CLS", m.value));
      onFCP((m) => updateMetric("FCP", m.value));
      onTTFB((m) => updateMetric("TTFB", m.value));
    } catch (e) {
      console.warn("[PerformanceOverlay] Error registering web-vitals listeners:", e);
    }
  }, []);

  // Chỉ hiển thị trong môi trường development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const getMetricColor = (name: keyof MetricState, valueStr: string) => {
    const value = parseFloat(valueStr);
    if (isNaN(value)) return "#94a3b8"; // Slate-400

    if (name === "LCP") {
      if (value > 4000) return "#ef4444";
      if (value > 2500) return "#f97316";
      return "#22c55e";
    }
    if (name === "INP") {
      if (value > 500) return "#ef4444";
      if (value > 200) return "#f97316";
      return "#22c55e";
    }
    if (name === "CLS") {
      if (value > 0.25) return "#ef4444";
      if (value > 0.1) return "#f97316";
      return "#22c55e";
    }
    return "#22c55e";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px", // Để tránh đè lên Bottom Navigation của Zalo Mini App
        left: "16px",
        zIndex: 999999,
        background: "rgba(15, 23, 42, 0.9)", // Slate-900 đục
        color: "#f8fafc",
        padding: "10px 14px",
        borderRadius: "12px",
        fontSize: "12px",
        fontFamily: "monospace",
        pointerEvents: "none",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(4px)",
        width: "150px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "6px",
          paddingBottom: "4px",
          color: "#38bdf8", // Sky-400
        }}
      >
        Web Vitals
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
        <span>LCP:</span>
        <span style={{ fontWeight: "bold", color: getMetricColor("LCP", metrics.LCP) }}>
          {metrics.LCP}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
        <span>INP:</span>
        <span style={{ fontWeight: "bold", color: getMetricColor("INP", metrics.INP) }}>
          {metrics.INP}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
        <span>CLS:</span>
        <span style={{ fontWeight: "bold", color: getMetricColor("CLS", metrics.CLS) }}>
          {metrics.CLS}
        </span>
      </div>
      <div
        style={{
          fontSize: "9px",
          color: "#94a3b8",
          marginTop: "6px",
          textAlign: "center",
          borderTop: "1px dashed rgba(255, 255, 255, 0.1)",
          paddingTop: "4px",
        }}
      >
        Dev Mode Only
      </div>
    </div>
  );
};

export default PerformanceOverlay;
