import React, { useContext, useEffect, useState } from "react";
import { TrackingContext } from "../Conetxt/TrackingContext";
import { ethers } from "ethers";

export default function ShipmentList() {
  const {
    shipments,
    startShipment,
    markDelivered,
    confirmDelivery,
    getAllShipments,
    currentAccount,
  } = useContext(TrackingContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getAllShipments();
      setLoading(false);
    };
    load();
  }, [getAllShipments]);

  const formatTime = (timestamp) => {
    if (!timestamp || timestamp === 0) return "-";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusColor = (status) => {
    const colors = {
      0: "#fbbf24",
      1: "#3b82f6",
      2: "#10b981",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusBg = (status) => {
    const colors = {
      0: "rgba(251, 191, 36, 0.1)",
      1: "rgba(59, 130, 246, 0.1)",
      2: "rgba(16, 185, 129, 0.1)",
    };
    return colors[status] || "rgba(107, 114, 128, 0.1)";
  };

  return (
    <div id="all-shipments" style={{ width: "100%" }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .shipment-row {
            transition: all 0.3s ease;
          }
          .shipment-row:hover {
            background: rgba(0, 242, 254, 0.05) !important;
            transform: scale(1.01);
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
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
            <span style={{ fontSize: "1.5rem" }}>📦</span>
            All Shipments
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.95rem" }}>
            {shipments.length} shipment{shipments.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            await getAllShipments();
            setLoading(false);
          }}
          disabled={loading}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: "none",
            background: loading
              ? "rgba(100, 100, 100, 0.3)"
              : "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            color: loading ? "rgba(255, 255, 255, 0.5)" : "#0a0a0a",
            fontSize: "0.95rem",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 4px 20px rgba(0, 242, 254, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 30px rgba(0, 242, 254, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 242, 254, 0.3)";
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
              Refreshing...
            </>
          ) : (
            <>🔄 Refresh</>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && shipments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "16px",
            border: "1px solid rgba(0, 242, 254, 0.1)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              width: "50px",
              height: "50px",
              border: "4px solid rgba(0, 242, 254, 0.2)",
              borderTop: "4px solid #00f2fe",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          />
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1.1rem" }}>
            Loading shipments...
          </p>
        </div>
      ) : shipments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "16px",
            border: "2px dashed rgba(0, 242, 254, 0.2)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "20px", opacity: 0.5 }}>
            📭
          </div>
          <h4 style={{ color: "#fff", marginBottom: "10px", fontSize: "1.3rem" }}>
            No Shipments Yet
          </h4>
          <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            Create your first shipment to get started
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", animation: "fadeIn 0.5s ease-out" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadRow}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Sender</th>
                <th style={thStyle}>Receiver</th>
                <th style={thStyle}>Courier</th>
                <th style={thStyle}>Scheduled</th>
                <th style={thStyle}>Pickup</th>
                <th style={thStyle}>Delivery</th>
                <th style={thStyle}>Distance</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Payment</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((s, i) => (
                <tr key={i} className="shipment-row" style={tbodyRow}>
                  <td style={tdStyle}>
                    <span style={idBadge}>{s.shipmentId ?? i}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <span style={addressStyle}>
                        {s.sender.slice(0, 6)}...{s.sender.slice(-4)}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(s.sender);
                          alert("Sender address copied!");
                        }}
                        style={copyBtn}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <span style={addressStyle}>
                        {s.receiver.slice(0, 6)}...{s.receiver.slice(-4)}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(s.receiver);
                          alert("Receiver address copied!");
                        }}
                        style={copyBtn}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <span style={addressStyle}>
                        {s.courier.slice(0, 6)}...{s.courier.slice(-4)}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(s.courier);
                          alert("Courier address copied!");
                        }}
                        style={copyBtn}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td style={tdStyle}>{formatTime(s.scheduledPickupTime)}</td>
                  <td style={tdStyle}>{formatTime(s.actualPickupTime)}</td>
                  <td style={tdStyle}>{formatTime(s.deliveryTime)}</td>
                  <td style={tdStyle}>
                    <span style={distanceBadge}>{s.distance} km</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={priceBadge}>
                      {s.price ? Number(s.price).toFixed(4) : "0"} ETH
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        background: getStatusBg(s.status),
                        color: getStatusColor(s.status),
                        border: `1px solid ${getStatusColor(s.status)}40`,
                      }}
                    >
                      {s.status === 0
                        ? "⏳ Pending"
                        : s.status === 1
                        ? "🚚 In Transit"
                        : s.status === 2
                        ? "✅ Delivered"
                        : "Unknown"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {s.isPaid ? (
                      <span style={paidBadge}>✅ Paid</span>
                    ) : (
                      <span style={unpaidBadge}>❌ Unpaid</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {s.status === 0 && (
                      <button
                        onClick={() => startShipment(s.shipmentId ?? i)}
                        style={{
                          ...actionBtn,
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 10px rgba(16, 185, 129, 0.2)";
                        }}
                      >
                        🚚 Start
                      </button>
                    )}
                    {s.status === 1 && (
                      <button
                        onClick={() => markDelivered(s.shipmentId ?? i)}
                        style={{
                          ...actionBtn,
                          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(251, 191, 36, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 10px rgba(251, 191, 36, 0.2)";
                        }}
                      >
                        📦 Mark Delivered
                      </button>
                    )}
                    {s.status === 2 && !s.isPaid && (
                      <button
                        onClick={() => confirmDelivery(s.shipmentId ?? i)}
                        style={{
                          ...actionBtn,
                          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 10px rgba(59, 130, 246, 0.2)";
                        }}
                      >
                        ✅ Confirm
                      </button>
                    )}
                    {s.isPaid && (
                      <span style={{ color: "#10b981", fontWeight: "700", fontSize: "0.9rem" }}>
                        ✔ Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles
const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 12px",
  fontSize: "0.9rem",
};

const theadRow = {
  background: "rgba(0, 242, 254, 0.05)",
  borderRadius: "12px",
};

const thStyle = {
  padding: "16px 12px",
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.9)",
  fontWeight: "700",
  fontSize: "0.85rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "2px solid rgba(0, 242, 254, 0.2)",
};

const tbodyRow = {
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "12px",
};

const tdStyle = {
  padding: "16px 12px",
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.8)",
  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  fontSize: "0.9rem",
};

const idBadge = {
  display: "inline-block",
  padding: "4px 12px",
  background: "rgba(0, 242, 254, 0.1)",
  color: "#00f2fe",
  borderRadius: "8px",
  fontWeight: "700",
  border: "1px solid rgba(0, 242, 254, 0.3)",
};

const addressStyle = {
  fontFamily: "monospace",
  fontSize: "0.85rem",
  color: "rgba(255, 255, 255, 0.7)",
};

const distanceBadge = {
  display: "inline-block",
  padding: "4px 10px",
  background: "rgba(100, 255, 218, 0.1)",
  color: "#64ffda",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "0.85rem",
};

const priceBadge = {
  display: "inline-block",
  padding: "4px 10px",
  background: "rgba(251, 191, 36, 0.1)",
  color: "#fbbf24",
  borderRadius: "6px",
  fontWeight: "700",
  fontSize: "0.85rem",
};

const paidBadge = {
  display: "inline-block",
  padding: "6px 12px",
  background: "rgba(16, 185, 129, 0.1)",
  color: "#10b981",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "0.85rem",
  border: "1px solid rgba(16, 185, 129, 0.3)",
};

const unpaidBadge = {
  display: "inline-block",
  padding: "6px 12px",
  background: "rgba(239, 68, 68, 0.1)",
  color: "#ef4444",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "0.85rem",
  border: "1px solid rgba(239, 68, 68, 0.3)",
};

const actionBtn = {
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  color: "#0a0a0a",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.85rem",
  margin: "2px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
};

const copyBtn = {
  background: "rgba(0, 242, 254, 0.1)",
  border: "1px solid rgba(0, 242, 254, 0.3)",
  borderRadius: "6px",
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: "0.85rem",
  transition: "all 0.2s ease",
};