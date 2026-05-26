import { useState, useEffect } from "react";
import SiteNavbar from "@/components/SiteNavbar";

// ─── Price Data ───────────────────────────────────────────────────────────────
type VehicleKey = "sedan" | "van" | "bigvan";
type TierKey = "bronze" | "silver" | "gold";
type CurrencyKey = "USD" | "GBP" | "EUR" | "AUD";

const CURRENCY_SYMBOLS: Record<CurrencyKey, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  AUD: "A$",
};

// price[currency][tier][vehicle][dayIndex] — days 2..20
const PRICES: Record<CurrencyKey, Record<TierKey, Record<VehicleKey, number[]>>> = {
  USD: {
    bronze: {
      sedan:  [270,340,410,480,520,560,600,680,750,830,900,980,1050,1130,1200,1280,1350,1430,1500],
      van:    [330,410,500,580,630,670,720,820,900,1000,1080,1180,1260,1360,1440,1540,1620,1720,1800],
      bigvan: [390,480,590,680,740,780,840,950,1050,1160,1260,1370,1470,1580,1680,1790,1890,2000,2100],
    },
    silver: {
      sedan:  [310,400,490,580,640,700,760,860,950,1050,1140,1240,1330,1430,1520,1620,1710,1810,1900],
      van:    [370,470,580,680,750,810,880,1000,1100,1220,1320,1440,1540,1660,1760,1880,1980,2100,2200],
      bigvan: [430,540,670,780,860,920,1000,1130,1250,1380,1500,1630,1750,1880,2000,2130,2250,2380,2500],
    },
    gold: {
      sedan:  [350,460,570,680,760,840,920,1040,1150,1270,1380,1500,1610,1730,1840,1960,2070,2190,2300],
      van:    [410,530,660,780,870,950,1040,1180,1300,1440,1560,1700,1820,1960,2080,2220,2340,2480,2600],
      bigvan: [470,600,750,880,980,1060,1160,1310,1450,1600,1740,1890,2030,2180,2320,2470,2610,2760,2900],
    },
  },
  GBP: {
    bronze: {
      sedan:  [200,240,290,340,370,400,420,480,530,590,640,690,740,800,850,910,950,1010,1060],
      van:    [250,290,360,420,450,480,510,570,640,710,770,830,890,960,1030,1090,1150,1210,1280],
      bigvan: [290,350,430,490,540,570,600,680,760,840,920,980,1060,1140,1220,1300,1360,1440,1520],
    },
    silver: {
      sedan:  [230,290,350,420,460,510,540,620,680,760,820,890,950,1030,1090,1170,1220,1300,1360],
      van:    [280,340,420,500,540,590,630,710,790,880,950,1030,1100,1190,1270,1350,1420,1500,1580],
      bigvan: [320,400,490,570,630,680,720,820,910,1010,1100,1180,1270,1370,1460,1560,1630,1730,1820],
    },
    gold: {
      sedan:  [260,340,410,500,550,620,660,760,830,930,1000,1090,1160,1260,1330,1430,1490,1590,1660],
      van:    [310,390,480,580,630,700,750,850,940,1050,1130,1230,1310,1420,1510,1610,1690,1790,1880],
      bigvan: [350,450,550,650,720,790,840,960,1060,1180,1280,1380,1480,1600,1700,1820,1900,2020,2120],
    },
  },
  EUR: {
    bronze: {
      sedan:  [230,280,350,400,440,460,500,560,620,680,740,810,870,930,990,1050,1120,1180,1240],
      van:    [280,340,420,480,530,560,600,680,750,830,900,980,1050,1130,1200,1280,1350,1430,1500],
      bigvan: [330,400,500,570,620,650,700,790,880,970,1060,1140,1230,1320,1410,1500,1580,1670,1760],
    },
    silver: {
      sedan:  [270,330,420,490,550,590,640,720,800,880,960,1040,1120,1200,1280,1360,1440,1520,1600],
      van:    [320,390,490,570,640,690,740,840,930,1030,1120,1210,1300,1400,1490,1590,1670,1770,1860],
      bigvan: [370,450,570,660,730,780,840,950,1060,1170,1280,1370,1480,1590,1700,1810,1900,2010,2120],
    },
    gold: {
      sedan:  [310,380,490,580,660,720,780,880,980,1080,1180,1270,1370,1470,1570,1670,1760,1860,1960],
      van:    [360,440,560,660,750,820,880,1000,1110,1230,1340,1440,1550,1670,1780,1900,1990,2110,2220],
      bigvan: [410,500,640,750,840,910,980,1110,1240,1370,1500,1600,1730,1860,1990,2120,2220,2350,2480],
    },
  },
  AUD: {
    bronze: {
      sedan:  [380,480,580,680,730,790,840,960,1050,1170,1260,1380,1470,1590,1680,1800,1890,2010,2100],
      van:    [470,580,700,820,890,940,1010,1150,1260,1400,1520,1660,1770,1910,2020,2160,2270,2410,2520],
      bigvan: [550,680,830,960,1040,1100,1180,1330,1470,1630,1770,1920,2060,2220,2360,2510,2650,2800,2940],
    },
    silver: {
      sedan:  [440,560,690,820,900,980,1070,1210,1330,1470,1600,1740,1870,2010,2130,2270,2400,2540,2660],
      van:    [520,660,820,960,1050,1140,1240,1400,1540,1710,1850,2020,2160,2330,2470,2640,2780,2940,3080],
      bigvan: [610,760,940,1100,1210,1290,1400,1590,1750,1940,2100,2290,2450,2640,2800,2990,3150,3340,3500],
    },
    gold: {
      sedan:  [490,650,800,960,1070,1180,1290,1460,1610,1780,1940,2100,2260,2430,2580,2750,2900,3070,3220],
      van:    [580,750,930,1100,1220,1330,1460,1640,1820,2020,2190,2380,2550,2750,2920,3110,3280,3480,3640],
      bigvan: [660,840,1050,1240,1380,1490,1630,1840,2030,2240,2440,2650,2850,3060,3250,3460,3660,3870,4060],
    },
  },
};

const DAYS = Array.from({ length: 19 }, (_, i) => i + 2); // 2..20

const TIERS: { key: TierKey; label: string; badge?: string; color: string; features: string[] }[] = [
  {
    key: "bronze",
    label: "Bronsplan",
    color: "#cd7f32",
    features: [
      "Traineeförare tilldelad",
      "Transfertjänst, inklusive hämtning/lämning på hotell och restaurang",
      "Engelsktalande lokal koordinator",
      "Ren luftkonditionerad bil",
      "Rekommenderad plan för dig som vill resa ekonomiskt",
    ],
  },
  {
    key: "silver",
    label: "Silverplan",
    badge: "Mest populär",
    color: "#c9a84c",
    features: [
      "Statligt certifierad turistförare eller högre",
      "Följeslagare & guidning vid sightseeingplatser",
      "Engelsktalande lokal koordinator",
      "Safari- & aktivitetsarrangemang",
      "Guidetjänst utan extra kostnad",
    ],
  },
  {
    key: "gold",
    label: "Guldplan",
    color: "#d4af37",
    features: [
      "Garanterat högt rankad chaufförsguide",
      "Fullständig resplan, följeslagare & guidning vid sightseeingplatser",
      "Engelsktalande lokal koordinator",
      "Dubbelt stödsystem",
      "Safari- & aktivitetsarrangemang",
    ],
  },
];

const VEHICLES: { key: VehicleKey; label: string; capacity: string }[] = [
  { key: "sedan", label: "Sedan", capacity: "1–3 personer" },
  { key: "van", label: "Van", capacity: "3–6 personer" },
  { key: "bigvan", label: "Stor Van", capacity: "6–9 personer" },
];

const CURRENCIES: CurrencyKey[] = ["USD", "GBP", "EUR", "AUD"];

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({
  tier,
  currency,
}: {
  tier: (typeof TIERS)[number];
  currency: CurrencyKey;
}) {
  const [vehicle, setVehicle] = useState<VehicleKey>("sedan");
  const sym = CURRENCY_SYMBOLS[currency];
  const prices = PRICES[currency][tier.key][vehicle];

  return (
    <div
      style={{
        background: "var(--dark2, #1a1a1a)",
        border: `1px solid ${tier.color}40`,
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}08)`,
          borderBottom: `1px solid ${tier.color}30`,
          padding: "24px 28px 20px",
          minHeight: "240px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span
            style={{
              background: tier.color,
              color: "#000",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 10px",
              borderRadius: "20px",
              textTransform: "uppercase",
            }}
          >
            {tier.key.toUpperCase()}
          </span>
          {tier.badge && (
            <span
              style={{
                background: "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.4)",
                color: "#c9a84c",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                padding: "2px 8px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              {tier.badge}
            </span>
          )}
        </div>
        <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px" }}>
          {tier.label}
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tier.features.map((f) => (
            <li
              key={f}
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.82rem",
                padding: "3px 0",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              {f.trim() && <span style={{ color: tier.color, flexShrink: 0, marginTop: "1px" }}>✓</span>}
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Vehicle Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        {VEHICLES.map((v) => (
          <button
            key={v.key}
            onClick={() => setVehicle(v.key)}
            style={{
              flex: 1,
              padding: "10px 4px",
              background: "none",
              border: "none",
              borderBottom: vehicle === v.key ? `2px solid ${tier.color}` : "2px solid transparent",
              color: vehicle === v.key ? tier.color : "rgba(255,255,255,0.5)",
              fontSize: "0.75rem",
              fontWeight: vehicle === v.key ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            <div>{v.label}</div>
            <div style={{ fontSize: "0.65rem", opacity: 0.7 }}>{v.capacity}</div>
          </button>
        ))}
      </div>

      {/* Price Table */}
      <div style={{ flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.3)" }}>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  position: "sticky",
                  top: 0,
                  background: "rgba(20,20,20,0.95)",
                }}
              >
                Dagar
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "right",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  position: "sticky",
                  top: 0,
                  background: "rgba(20,20,20,0.95)",
                }}
              >
                Pris (inkl. moms)
              </th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, idx) => (
              <tr
                key={day}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                }}
              >
                <td
                  style={{
                    padding: "10px 16px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.85rem",
                  }}
                >
                  {day} dagar
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    textAlign: "right",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                  }}
                >
                  {sym}
                  {prices[idx].toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [currency, setCurrency] = useState<CurrencyKey>("USD");

  // ─── SEO: title, meta description, JSON-LD ──────────────────────────────────
  useEffect(() => {
    // Title
    document.title = "Priser för biluthyrning på Sri Lanka | Fastprisplaner | SLTCS";

    // Meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.content;
    metaDesc.content =
      "Se fasta priser för att hyra bil med privat förare på Sri Lanka. Brons-, Silver- & Guldplaner från $270. Sedan, Van & Big Van. USD, GBP, EUR, AUD.";

    // JSON-LD: PriceSpecification (USD, Bronze/Silver/Gold, Sedan 2-day as representative)
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Hyr bil med privat förare på Sri Lanka",
      description:
        "Helt privat biluthyrningstjänst på Sri Lanka med en engelsktalande förare. Tre planer: Brons, Silver, Guld.",
      url: "https://sv.srilanka-charter.com/price",
      brand: {
        "@type": "Brand",
        name: "SLTCS – Hyr bil med privat förare på Sri Lanka",
      },
      offers: [
        // Bronze
        {
          "@type": "Offer",
          name: "Bronsplan – Sedan (2 dagar)",
          price: "270",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "270",
            priceCurrency: "USD",
            unitText: "2 days",
          },
          availability: "https://schema.org/InStock",
          url: "https://sv.srilanka-charter.com/price",
        },
        {
          "@type": "Offer",
          name: "Silverplan – Sedan (2 dagar)",
          price: "310",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "310",
            priceCurrency: "USD",
            unitText: "2 days",
          },
          availability: "https://schema.org/InStock",
          url: "https://sv.srilanka-charter.com/price",
        },
        {
          "@type": "Offer",
          name: "Guldplan – Sedan (2 dagar)",
          price: "350",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "350",
            priceCurrency: "USD",
            unitText: "2 dagar",
          },
          availability: "https://schema.org/InStock",
          url: "https://sv.srilanka-charter.com/price",
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "price-jsonld";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.title = "SLTCS｜Hyr bil med privat förare på Sri Lanka";
      metaDesc!.content = prevDesc;
      document.getElementById("price-jsonld")?.remove();
    };
  }, []);

  const scrollToContact = () => {
    window.location.href = "/#contact";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--dark, #0d1117)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <SiteNavbar mode="page" />
      {/* Hero */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "60px",
          textAlign: "center",
          background: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#c9a84c",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            padding: "6px 18px",
            borderRadius: "20px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          PRISSÄTTNING
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            margin: "0 auto 20px",
            maxWidth: "700px",
          }}
        >
          Hyr bil med privat förare på Sri Lanka{" "}
          <em style={{ color: "#c9a84c", fontStyle: "italic" }}>Prissättning</em>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "1.05rem",
            maxWidth: "600px",
            margin: "0 auto 0",
            lineHeight: 1.7,
          }}
        >
          Transparenta fasta priser till branschledande låga taxor – för en säker och bekymmersfri resa genom Sri Lanka.
        </p>
      </section>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 32px" }}>

        {/* Intro */}
        <section style={{ padding: "56px 0 0" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem", maxWidth: "820px" }}>
            På Sri Lanka Taxi Charter Service (SLTCS) håller vi våra priser så låga som möjligt samtidigt som vi upprätthåller högsta kvalitet på servicen. Vi anser att om vi skulle gå lägre skulle det kompromissa med den upplevelse vi åtar oss att leverera.
          </p>
        </section>

        {/* Risks section */}
        <section
          style={{
            margin: "40px 0",
            background: "rgba(255,180,0,0.05)",
            border: "1px solid rgba(255,180,0,0.2)",
            borderRadius: "12px",
            padding: "28px 32px",
          }}
        >
          <h2
            style={{
              color: "#c9a84c",
              fontSize: "1.05rem",
              fontWeight: 700,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚠ Risker med att välja ultralåga tjänster
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "14px" }}>
            Tjänster som enbart konkurrerar på pris kan utsätta dig för följande problem:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "En stor skillnad mellan det angivna priset och det slutliga beloppet som debiteras",
              "Inget engelsktalande stöd från den första förfrågningsfasen",
              "Tilldelade gamla eller dåligt underhållna fordon",
              "Ständiga omvägar till butiker med kickbacks, vilket stör din resplan",
            ].map((item) => (
              <li
                key={item}
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.88rem",
                  padding: "5px 0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#c9a84c", flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", lineHeight: 1.7, marginTop: "16px" }}>
            I synnerhet kan vissa till synes billiga tjänster införa körsträcke-begränsningar och ta betalt för överskridanden. Det har förekommit fall där förare rapporterade uppblåsta avstånd, vilket resulterade i räkningar långt över förväntningarna.
          </p>
          <p style={{ marginTop: "10px" }}>
            <a
              href="/low-price-risk"
              style={{
                color: "#c9a84c",
                fontSize: "0.82rem",
                textDecoration: "none",
                borderBottom: "1px solid rgba(201,168,76,0.4)",
                paddingBottom: "1px",
                letterSpacing: "0.02em",
              }}
            >
              → detaljer
            </a>
          </p>
        </section>

        {/* Transparent pricing */}
        <section style={{ marginBottom: "8px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            SLTCS:s transparenta fasta prissättning
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem", maxWidth: "820px" }}>
            SLTCS tillhandahåller en fast offert baserad på din resplan, diskuterad på engelska från första förfrågan. Även om din resplan ännu inte är fastställd, dela bara de platser du vill besöka så föreslår vi den bästa rutten med en detaljerad uppskattning.
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem", maxWidth: "820px", marginTop: "12px" }}>
            Alla priser nedan är <strong style={{ color: "#fff" }}>inklusive moms</strong> och gäller för <strong style={{ color: "#fff" }}>engelsktalande förare</strong>. Vi erbjuder tre planer för att matcha din resstil.
          </p>
        </section>

        {/* Plan Overview */}
        <section style={{ marginBottom: "20px", paddingTop: "0" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              color: "#fff",
              marginBottom: "24px",
              marginTop: "0",
              textAlign: "center",
            }}
          >
            Planöversikt
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {TIERS.map((tier) => (
              <div
                key={tier.key}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${tier.color}30`,
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span
                    style={{
                      background: tier.color,
                      color: "#000",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                    }}
                  >
                    {tier.key.toUpperCase()}
                  </span>
                  {tier.badge && (
                    <span
                      style={{
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.4)",
                        color: "#c9a84c",
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        textTransform: "uppercase",
                      }}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>
                <h3 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, margin: "0 0 12px" }}>
                  {tier.label}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1 }}>
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.82rem",
                        padding: "4px 0",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: tier.color, flexShrink: 0, marginTop: "1px" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Currency Tabs */}
        <section style={{ marginTop: "0", paddingTop: "0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem",
                color: "#fff",
                margin: 0,
              }}
            >
              Prislista
            </h2>
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    padding: "8px 20px",
                    background: currency === c ? "rgba(201,168,76,0.2)" : "none",
                    border: "none",
                    borderRight: c !== "EUR" ? "1px solid rgba(255,255,255,0.1)" : "none",
                    color: currency === c ? "#c9a84c" : "rgba(255,255,255,0.55)",
                    fontSize: "0.85rem",
                    fontWeight: currency === c ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {CURRENCY_SYMBOLS[c]} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "8px",
              padding: "14px 20px",
              marginBottom: "32px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#c9a84c" }}>Obs:</strong> Priserna nedan gäller för standardresplaner. Ytterligare avgifter kan tillkomma om den totala sträckan överskrider den beräknade standarden, eller om upphämtnings- eller avlämningsplatsen ligger utanför flygplatsområdet (inklusive Colombo och Negombo).
            </p>
          </div>

          {/* Plan Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {TIERS.map((tier) => (
              <PlanCard key={tier.key} tier={tier} currency={currency} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", marginTop: "0" }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", marginBottom: "24px" }}>
            Är du osäker på vilken plan som passar dig? Kontakta oss gärna för en kostnadsfri, personlig offert.
          </p>
          <button
            onClick={scrollToContact}
            style={{
              background: "#c9a84c",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              padding: "14px 36px",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            💬 Kostnadsfri förfrågan
          </button>
        </section>
      </div>
    </div>
  );
}
