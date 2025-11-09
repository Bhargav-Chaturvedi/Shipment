import React, { useState, useContext } from "react";
import { TrackingContext } from "../Conetxt/TrackingContext";

export default function CreateShipment() {
  const { createShipment, currentAccount, connectWallet } =
    useContext(TrackingContext);

  const [form, setForm] = useState({
    receiver: "",
    courier: "",
    pickupTime: "",
    distance: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentAccount) {
      showToast("Please connect your wallet first!", "warning");
      await connectWallet();
      return;
    }

    const { receiver, courier, pickupTime, distance, price } = form;

    if (
      !receiver ||
      !courier ||
      !pickupTime ||
      !distance ||
      !price ||
      Number(price) <= 0
    ) {
      showToast("Please fill all fields correctly!", "warning");
      return;
    }

    try {
      setLoading(true);

      const pickupTimestamp = Math.floor(
        new Date(pickupTime).getTime() / 1000
      );

      await createShipment(
        receiver,
        courier,
        pickupTimestamp,
        Number(distance),
        price
      );

      setForm({
        receiver: "",
        courier: "",
        pickupTime: "",
        distance: "",
        price: "",
      });
      
      showToast("Shipment created successfully!", "success");
    } catch (err) {
      console.error("Error creating shipment:", err);
      showToast("Transaction failed. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="create-shipment" style={{ width: "100%", position: "relative" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0, 242, 254, 0.3); }
          50% { border-color: rgba(0, 242, 254, 0.6); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}} />

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            right: "20px",
            background: toast.type === "success" 
              ? "#10b981" 
              : toast.type === "warning" 
              ? "#f59e0b" 
              : "#ef4444",
            color: "white",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "400px",
            animation: "slide-in 0.3s ease-out",
            fontWeight: "600",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>
            {toast.type === "success" ? "✅" : toast.type === "warning" ? "⚠️" : "❌"}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1",
              opacity: 0.8,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
          >
            ×
          </button>
        </div>
      )}

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
          <span style={{ fontSize: "1.5rem" }}>📦</span>
          Create New Shipment
        </h3>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.95rem" }}>
          Fill in the details below to create a new blockchain shipment
        </p>
      </div>

      {!currentAccount ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "rgba(0, 242, 254, 0.03)",
            borderRadius: "16px",
            border: "2px dashed rgba(0, 242, 254, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "20px",
              opacity: 0.7,
            }}
          >
            🔐
          </div>
          <h4
            style={{
              color: "#fff",
              marginBottom: "15px",
              fontSize: "1.3rem",
            }}
          >
            Wallet Not Connected
          </h4>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "25px",
              maxWidth: "400px",
              margin: "0 auto 25px",
            }}
          >
            Connect your Web3 wallet to start creating shipments on the
            blockchain
          </p>
          <button
            onClick={connectWallet}
            style={{
              background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "12px",
              padding: "14px 32px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(0, 242, 254, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 30px rgba(0, 242, 254, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(0, 242, 254, 0.3)";
            }}
          >
            🔗 Connect Wallet
          </button>
        </div>
      ) : (
        <div onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Receiver Address */}
            <div style={inputGroup}>
              <label style={labelStyle}>
                <span style={{ marginRight: "8px" }}>👤</span>
                Receiver Address
              </label>
              <input
                type="text"
                name="receiver"
                value={form.receiver}
                onChange={handleChange}
                placeholder="0xReceiverAddress"
                style={inputStyle}
              />
            </div>

            {/* Courier Address */}
            <div style={inputGroup}>
              <label style={labelStyle}>
                <span style={{ marginRight: "8px" }}>🚚</span>
                Courier Address
              </label>
              <input
                type="text"
                name="courier"
                value={form.courier}
                onChange={handleChange}
                placeholder="0xCourierAddress"
                style={inputStyle}
              />
            </div>

            {/* Pickup Time */}
            <div style={inputGroup}>
              <label style={labelStyle}>
                <span style={{ marginRight: "8px" }}>📅</span>
                Pickup Time
              </label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={form.pickupTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Distance */}
            <div style={inputGroup}>
              <label style={labelStyle}>
                <span style={{ marginRight: "8px" }}>📏</span>
                Distance (km)
              </label>
              <input
                type="number"
                name="distance"
                value={form.distance}
                onChange={handleChange}
                placeholder="e.g. 120"
                style={inputStyle}
                min="1"
              />
            </div>

            {/* Price */}
            <div style={inputGroup}>
              <label style={labelStyle}>
                <span style={{ marginRight: "8px" }}>💰</span>
                Price (in ETH)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 0.001"
                style={inputStyle}
                min="0.0001"
                step="0.0001"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(100, 100, 100, 0.3)"
                : "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
              color: loading ? "rgba(255, 255, 255, 0.5)" : "#0a0a0a",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "700",
              fontSize: "1.1rem",
              marginTop: "10px",
              boxShadow: loading
                ? "none"
                : "0 4px 20px rgba(0, 242, 254, 0.3)",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
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
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ 
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}>
                </span>
                Creating Shipment...
              </span>
            ) : (
              "🚀 Create Shipment"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Inline Styles ---
const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "0.95rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(0, 242, 254, 0.2)",
  fontSize: "0.95rem",
  background: "rgba(255, 255, 255, 0.03)",
  color: "#fff",
  transition: "all 0.3s ease",
  outline: "none",
  fontFamily: "inherit",
};