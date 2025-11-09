import React, { useState, useContext } from "react";
import { TrackingContext } from "../Conetxt/TrackingContext";
import { ethers } from "ethers";

export default function ShipmentDetails() {
  const { getShipmentDetails } = useContext(TrackingContext);
  const [shipmentId, setShipmentId] = useState("");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (e) => {
    e.preventDefault();
    setError("");
    setShipment(null);

    if (!shipmentId || isNaN(shipmentId)) {
      setError("Please enter a valid shipment ID.");
      return;
    }

    try {
      setLoading(true);
      const result = await getShipmentDetails(Number(shipmentId));
      if (!result) {
        setError("Shipment not found or access denied.");
        return;
      }
      setShipment(result);
    } catch (err) {
      console.error("getShipmentDetails error:", err);
      if (err.reason?.includes("Only sender"))
        setError("⚠️ You are not the sender of this shipment.");
      else setError("❌ Failed to fetch shipment details.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) =>
    timestamp && Number(timestamp) !== 0
      ? new Date(timestamp * 1000).toLocaleString()
      : "N/A";

  const getStatusColor = (status) => {
    const colors = {
      0: "#fbbf24", // Pending - Yellow
      1: "#3b82f6", // In Transit - Blue
      2: "#10b981", // Delivered - Green
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = ["⏳", "🚚", "✅"];
    return icons[status] || "📦";
  };

  return (
    <div id="get-shipment" style={{ width: "100%" }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🔍</span>
          Get Shipment Details
        </h3>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.95rem" }}>
          Enter a shipment ID to view its complete tracking information
        </p>
      </div>

      {/* Search Form */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          placeholder="Enter Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1px solid rgba(0, 242, 254, 0.2)",
            fontSize: "0.95rem",
            background: "rgba(255, 255, 255, 0.03)",
            color: "#fff",
            transition: "all 0.3s ease",
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.5)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.2)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          }}
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            border: "none",
            background: loading
              ? "rgba(100, 100, 100, 0.3)"
              : "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            color: loading ? "rgba(255, 255, 255, 0.5)" : "#0a0a0a",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: loading
              ? "none"
              : "0 4px 20px rgba(0, 242, 254, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 30px rgba(0, 242, 254, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(0, 242, 254, 0.3)";
            }
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Fetching...
            </>
          ) : (
            <>🔍 Fetch</>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "12px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            fontWeight: "500",
            marginBottom: "20px",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {error}
        </div>
      )}

      {/* Shipment Details */}
      {shipment && (
        <div
          style={{
            animation: "slideIn 0.5s ease-out",
          }}
        >
          {/* Status Card */}
          <div
            style={{
              background: `linear-gradient(135deg, ${getStatusColor(
                shipment.status
              )}15 0%, ${getStatusColor(shipment.status)}05 100%)`,
              border: `1px solid ${getStatusColor(shipment.status)}40`,
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
              {getStatusIcon(shipment.status)}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: getStatusColor(shipment.status),
                marginBottom: "8px",
              }}
            >
              {["Pending", "In Transit", "Delivered"][shipment.status]}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Current Status
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Sender Card */}
            <div style={detailCard}>
              <div style={cardIcon}>👤</div>
              <div style={cardLabel}>Sender</div>
              <div style={cardValue}>{shipment.sender}</div>
            </div>

            {/* Receiver Card */}
            <div style={detailCard}>
              <div style={cardIcon}>📥</div>
              <div style={cardLabel}>Receiver</div>
              <div style={cardValue}>{shipment.receiver}</div>
            </div>

            {/* Courier Card */}
            <div style={detailCard}>
              <div style={cardIcon}>🚚</div>
              <div style={cardLabel}>Courier</div>
              <div style={cardValue}>{shipment.courier}</div>
            </div>

            {/* Price Card */}
            <div style={detailCard}>
              <div style={cardIcon}>💰</div>
              <div style={cardLabel}>Price</div>
              <div style={cardValue}>{shipment.price} ETH</div>
            </div>

            {/* Distance Card */}
            <div style={detailCard}>
              <div style={cardIcon}>📏</div>
              <div style={cardLabel}>Distance</div>
              <div style={cardValue}>{shipment.distance} km</div>
            </div>

            {/* Payment Status Card */}
            <div style={detailCard}>
              <div style={cardIcon}>
                {shipment.isPaid ? "✅" : "❌"}
              </div>
              <div style={cardLabel}>Payment Status</div>
              <div
                style={{
                  ...cardValue,
                  color: shipment.isPaid ? "#10b981" : "#ef4444",
                  fontWeight: "700",
                }}
              >
                {shipment.isPaid ? "Paid" : "Not Paid"}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div
            style={{
              marginTop: "30px",
              padding: "24px",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "16px",
              border: "1px solid rgba(0, 242, 254, 0.1)",
            }}
          >
            <h4
              style={{
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: "700",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>⏱️</span>
              Timeline
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={timelineItem}>
                <div style={timelineIcon}>📅</div>
                <div>
                  <div style={timelineLabel}>Scheduled Pickup</div>
                  <div style={timelineValue}>
                    {formatTime(shipment.scheduledPickupTime)}
                  </div>
                </div>
              </div>
              <div style={timelineItem}>
                <div style={timelineIcon}>🚚</div>
                <div>
                  <div style={timelineLabel}>Actual Pickup</div>
                  <div style={timelineValue}>
                    {formatTime(shipment.actualPickupTime)}
                  </div>
                </div>
              </div>
              <div style={timelineItem}>
                <div style={timelineIcon}>📦</div>
                <div>
                  <div style={timelineLabel}>Delivery Time</div>
                  <div style={timelineValue}>
                    {formatTime(shipment.deliveryTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const detailCard = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(0, 242, 254, 0.1)",
  borderRadius: "12px",
  padding: "20px",
  transition: "all 0.3s ease",
};

const cardIcon = {
  fontSize: "2rem",
  marginBottom: "12px",
};

const cardLabel = {
  fontSize: "0.85rem",
  color: "rgba(255, 255, 255, 0.6)",
  marginBottom: "8px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const cardValue = {
  fontSize: "0.95rem",
  color: "#fff",
  fontWeight: "600",
  fontFamily: "monospace",
  wordBreak: "break-all",
};

const timelineItem = {
  display: "flex",
  gap: "16px",
  alignItems: "flex-start",
  padding: "12px 0",
  borderLeft: "2px solid rgba(0, 242, 254, 0.2)",
  paddingLeft: "20px",
};

const timelineIcon = {
  fontSize: "1.5rem",
  minWidth: "32px",
};

const timelineLabel = {
  fontSize: "0.85rem",
  color: "rgba(255, 255, 255, 0.6)",
  marginBottom: "4px",
  fontWeight: "600",
};

const timelineValue = {
  fontSize: "0.95rem",
  color: "#fff",
  fontWeight: "600",
};