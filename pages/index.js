import React, { useContext, useEffect } from "react";
import { TrackingContext } from "../Conetxt/TrackingContext";
import Navbar from "../components/Navbar";
import CreateShipment from "../components/CreateShipment";
import ShipmentList from "../components/ShipmentList";
import ShipmentDetails from "../components/ShipmentDetails";

export default function IndexPage() {
  const { currentAccount, getAllShipments } = useContext(TrackingContext);

  useEffect(() => {
    if (currentAccount) getAllShipments();
  }, [currentAccount]);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(0, 150, 255, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          animation: "float 15s ease-in-out infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />

      {/* Moving Grid Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(0, 242, 254, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 254, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
          opacity: 0.3,
        }}
      />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(30px, -30px); }
            66% { transform: translate(-20px, 20px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.15); }
          }
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 25px rgba(0, 242, 254, 0.3), 0 0 50px rgba(0, 242, 254, 0.15); }
            50% { box-shadow: 0 0 40px rgba(0, 150, 255, 0.4), 0 0 80px rgba(0, 150, 255, 0.2); }
          }
        `}
      </style>

      {/* Navbar */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
      </div>

      <main
        style={{
          maxWidth: "95%",
          margin: "auto",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero Section with Connected Account */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
            padding: "40px 20px",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
              textShadow: "0 0 60px rgba(0, 242, 254, 0.4)",
            }}
          >
            🚀 Shipment Tracker
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "30px",
              maxWidth: "600px",
              margin: "0 auto 30px",
              lineHeight: "1.6",
            }}
          >
            Track your shipments on the blockchain with transparency and security
          </p>

          {/* Connection Status Card */}
          <div
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "16px 32px",
              animation: "glow 3s ease-in-out infinite",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "600",
              }}
            >
              {currentAccount ? "🟢 Connected" : "🔴 Not Connected"}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                color: "#fff",
                fontWeight: "600",
                fontFamily: "monospace",
                letterSpacing: "0.02em",
              }}
            >
              {currentAccount
                ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
                : "Connect your wallet to continue"}
            </div>
          </div>
        </div>

        {/* Create Shipment Section */}
        <section
          style={{
            marginBottom: "40px",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 242, 254, 0.1)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 48px rgba(0, 242, 254, 0.15)";
            e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
            e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.1)";
          }}
        >
          <CreateShipment />
        </section>

        {/* Shipment List Section */}
        <section
          style={{
            marginBottom: "40px",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 150, 255, 0.1)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 48px rgba(0, 150, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(0, 150, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
            e.currentTarget.style.borderColor = "rgba(0, 150, 255, 0.1)";
          }}
        >
          <ShipmentList />
        </section>

        {/* Shipment Details Section */}
        <section
          style={{
            marginBottom: "40px",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(100, 255, 218, 0.1)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 48px rgba(100, 255, 218, 0.15)";
            e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
            e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)";
          }}
        >
          <ShipmentDetails />
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px 20px",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "0.9rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p>Powered by Blockchain Technology ⛓️</p>
      </footer>
    </div>
  );
}