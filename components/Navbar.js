import React, { useContext, useState, useEffect } from "react";
import { TrackingContext } from "../Conetxt/TrackingContext";

export default function Navbar() {
  const { currentAccount, connectWallet, disconnectWallet } = useContext(TrackingContext);
  const [activeSection, setActiveSection] = useState("create-shipment");

  useEffect(() => {
    // Observe sections to update active state
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    ['create-shipment', 'all-shipments', 'get-shipment'].forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { id: "create-shipment", label: "Create Shipment", icon: "🚀" },
    { id: "all-shipments", label: "All Shipments", icon: "📦" },
    { id: "get-shipment", label: "Track Shipment", icon: "🔍" }
  ];

  return (
    <nav
      style={{
        background: "linear-gradient(180deg, rgba(5, 8, 15, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        padding: "14px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        fontWeight: "600",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(0, 242, 254, 0.1) inset",
        borderBottom: "1px solid rgba(0, 242, 254, 0.2)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "70px",
      }}
    >
      <style>
        {`
          * {
            scroll-margin-top: 90px;
          }

          body {
            padding-top: 70px;
          }

          @keyframes glow-pulse {
            0%, 100% { 
              text-shadow: 0 0 15px rgba(0, 242, 254, 0.6), 
                           0 0 30px rgba(0, 242, 254, 0.3),
                           0 0 45px rgba(0, 242, 254, 0.2);
            }
            50% { 
              text-shadow: 0 0 25px rgba(0, 242, 254, 0.9), 
                           0 0 50px rgba(0, 242, 254, 0.5),
                           0 0 75px rgba(0, 242, 254, 0.3);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }

          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }

          .nav-item {
            position: relative;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }

          .nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(0, 242, 254, 0.3), 
              transparent
            );
            transition: left 0.5s;
          }

          .nav-item:hover::before {
            left: 100%;
          }

          .nav-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 242, 254, 0.3) !important;
          }

          .nav-item-active {
            background: linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(79, 172, 254, 0.15) 100%) !important;
            border-color: rgba(0, 242, 254, 0.6) !important;
            box-shadow: 0 4px 20px rgba(0, 242, 254, 0.4), 
                        0 0 30px rgba(0, 242, 254, 0.2) inset !important;
          }

          .wallet-address {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 100%);
            position: relative;
            overflow: hidden;
          }

          .wallet-address::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(0, 255, 136, 0.1) 50%,
              transparent 70%
            );
            animation: shimmer 3s infinite;
          }

          .logo-icon {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* 🚚 Logo / Brand */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "14px",
          cursor: "pointer"
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div
          className="logo-icon"
          style={{
            width: "44px",
            height: "44px",
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #00c6fb 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            boxShadow: "0 6px 20px rgba(0, 242, 254, 0.5), 0 0 40px rgba(0, 242, 254, 0.3)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          🚚
        </div>
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: "900",
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #00c6fb 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em",
            animation: "glow-pulse 2.5s infinite",
            textShadow: "0 0 20px rgba(0, 242, 254, 0.3)",
          }}
        >
          Shipment Tracker
        </span>
      </div>

      {/* Navigation Menu */}
      <div style={{ 
        display: "flex", 
        gap: "10px",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.02)",
        padding: "6px",
        borderRadius: "14px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`nav-item ${activeSection === item.id ? 'nav-item-active' : ''}`}
            style={{
              background: activeSection === item.id 
                ? "linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(79, 172, 254, 0.15) 100%)"
                : "rgba(255, 255, 255, 0.03)",
              border: activeSection === item.id
                ? "1px solid rgba(0, 242, 254, 0.6)"
                : "1px solid rgba(255, 255, 255, 0.08)",
              color: activeSection === item.id ? "#00f2fe" : "rgba(255, 255, 255, 0.8)",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeSection === item.id
                ? "0 4px 20px rgba(0, 242, 254, 0.4), 0 0 30px rgba(0, 242, 254, 0.2) inset"
                : "none",
              textShadow: activeSection === item.id 
                ? "0 0 10px rgba(0, 242, 254, 0.5)"
                : "none",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            <span style={{ 
              letterSpacing: "0.02em",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* 🔗 Wallet Connect / Disconnect */}
      {!currentAccount ? (
        <button
          onClick={connectWallet}
          style={{
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            color: "#0a0a0a",
            border: "none",
            padding: "11px 26px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "800",
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 6px 24px rgba(0, 242, 254, 0.4), 0 0 40px rgba(0, 242, 254, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 242, 254, 0.6), 0 0 60px rgba(0, 242, 254, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 242, 254, 0.4), 0 0 40px rgba(0, 242, 254, 0.2)";
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🔗</span>
          <span>Connect Wallet</span>
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            className="wallet-address"
            style={{
              background: "linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 100%)",
              border: "1px solid rgba(0, 255, 136, 0.4)",
              padding: "10px 16px",
              borderRadius: "12px",
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "0.88rem",
              fontWeight: "700",
              color: "#00ff88",
              boxShadow: "0 4px 20px rgba(0, 255, 136, 0.25), 0 0 30px rgba(0, 255, 136, 0.1) inset",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              background: "#00ff88",
              boxShadow: "0 0 10px #00ff88",
              animation: "glow-pulse 2s infinite"
            }}></span>
            {currentAccount}
          </div>

          <button
            onClick={disconnectWallet}
            style={{
              background: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "800",
              fontSize: "0.9rem",
              letterSpacing: "0.02em",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 6px 24px rgba(255, 75, 43, 0.4), 0 0 40px rgba(255, 75, 43, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 75, 43, 0.6), 0 0 60px rgba(255, 75, 43, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(255, 75, 43, 0.4), 0 0 40px rgba(255, 75, 43, 0.2)";
            }}
          >
            <span>🔌</span>
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </nav>
  );
}