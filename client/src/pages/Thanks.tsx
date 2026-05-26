/**
 * Thanks page — shown after a successful enquiry submission
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Thanks() {
  const [, setLocation] = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--dark1, #0d0d0d)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          fontSize: "1rem",
          letterSpacing: "0.12em",
          color: "#c9a84c",
          fontWeight: 700,
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        SLTCS｜Hyr bil med privat förare på Sri Lanka
      </div>

      {/* Checkmark icon */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(201, 168, 76, 0.15)",
          border: "2px solid #c9a84c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.2rem",
          marginBottom: "32px",
        }}
      >
        ✓
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "16px",
          color: "#fff",
          lineHeight: 1.25,
        }}
      >
        Tack för din förfrågan!
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontSize: "1.05rem",
          color: "#c8c8c8",
          textAlign: "center",
          maxWidth: "480px",
          lineHeight: 1.7,
          marginBottom: "12px",
        }}
      >
        Vårt team kommer att granska din förfrågan och återkomma till dig inom{" "}
        <strong style={{ color: "#c9a84c" }}>24 timmar</strong> med en skräddarsydd
        resplan och offert.
      </p>

      <p
        style={{
          fontSize: "0.9rem",
          color: "#888",
          textAlign: "center",
          maxWidth: "420px",
          lineHeight: 1.6,
          marginBottom: "40px",
        }}
      >
        Vänligen kontrollera din inkorg (och skräppostmapp) för en bekräftelse. Om du
        har några brådskande frågor, skicka oss gärna ett nytt meddelande.
      </p>

      {/* Divider */}
      <div
        style={{
          width: "60px",
          height: "2px",
          background: "#c9a84c",
          marginBottom: "40px",
          borderRadius: "2px",
        }}
      />

      {/* Back to Home button */}
      <button
        onClick={() => setLocation("/")}
        style={{
          padding: "14px 36px",
          background: "#c9a84c",
          color: "#0d0d0d",
          border: "none",
          borderRadius: "4px",
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: "pointer",
          textTransform: "uppercase",
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        ← Tillbaka till startsidan
      </button>

      {/* Footer note */}
      <p
        style={{
          marginTop: "48px",
          fontSize: "0.78rem",
          color: "#555",
          textAlign: "center",
        }}
      >
        © SLTCS｜Hyr bil med privat förare på Sri Lanka. Alla rättigheter förbehållna.
      </p>
    </div>
  );
}
