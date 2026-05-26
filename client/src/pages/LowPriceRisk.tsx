import { useEffect } from "react";
import { Link } from "wouter";
import SiteNavbar from "@/components/SiteNavbar";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const PAGE_TITLE =
  "Risker med billig biluthyrning på Sri Lanka | Varför billiga tjänster kostar mer | SLTCS";
const PAGE_DESC =
  "Upptäck de dolda riskerna med ultrabillig biluthyrning på Sri Lanka: körsträckebegränsningar, uppblåsta avstånd, förare som inte dyker upp, omvägar för provisioner och dålig support. Lär dig varför SLTCS prioriterar kvalitet framför pris.";

// ─── Risk Items ───────────────────────────────────────────────────────────────
const RISKS = [
  {
    id: "mileage-limits",
    icon: "📏",
    title: "Dolda körsträckebegränsningar och överpriser",
    body: [
      "Budgetprissatta tjänster inkluderar nästan alltid avståndsgränser dolda i det finstilta. Ett annonserat pris på 80 pund per dag kan se attraktivt ut — tills du märker den dagliga gränsen på 150 km. Sri Lankas främsta sevärdheter är spridda över ön, och en enda dags sightseeing kan lätt överstiga 250 km.",
      "En av våra teammedlemmar upplevde detta på egen hand som turist: en transfer Colombo–Sigiriya på ungefär 180 km fakturerades som 250 km. Tvisten som följde var stressig och tidskrävande — det sista du vill ha på en semester.",
      "SLTCS anger ett enda fast pris baserat på din fullständiga resplan. Det finns inga avgifter per kilometer, inga avståndsgränser och inga överraskande tillägg i slutet av varje dag.",
    ],
    highlight:
      "Med SLTCS avtalas ditt pris skriftligen före avresa. Det du ser är vad du betalar.",
  },
  {
    id: "old-vehicles",
    icon: "🚗",
    title: "Åldrande fordon i dåligt skick",
    body: [
      "Sri Lanka inför höga importtullar på fordon — en bil prissatt till 12 000 pund i Japan kan kosta 36 000 pund när den importerats. Förare som inte har råd med nyare modeller fortsätter att köra fordon som är 20 år gamla eller mer.",
      "En förare som investerar i en nyare bil måste betala ett betydande lån, vilket innebär att deras dagliga priser måste vara högre för att vara lönsamma. När ett pris verkar ovanligt lågt är fordonets kvalitet nästan alltid anledningen.",
      "SLTCS arbetar uteslutande med förare som underhåller moderna, välservade fordon. Varje bil i vårt nätverk är luftkonditionerad, ren och regelbundet inspekterad.",
    ],
    highlight: "Det finns alltid en anledning bakom ett lågt pris — och det påverkar oftast din komfort och säkerhet.",
  },
  {
    id: "no-show",
    icon: "⏰",
    title: "Förare som inte dyker upp",
    body: [
      "De första ögonblicken av en resa — att anlända till en flygplats eller ett hotell och leta efter din förare — är redan nervkittlande. Budgetoperatörer misslyckas ibland med att dyka upp helt, vilket lämnar resenärer strandsatta på en okänd plats utan lokal support.",
      "Även en betydande försening i början av dagen kan leda till missade inträdestider, stängda attraktioner och ett förstört schema.",
      "SLTCS anlitar förare med en beprövad meritlista av punktlighet. Alla förare som är sena utan god anledning får omedelbar feedback; upprepade problem leder till uppsägning av kontraktet. Skulle ett oförutsett problem uppstå, finns våra engelsktalande koordinatorer tillgängliga dygnet runt för att lösa det.",
    ],
    highlight:
      "Vårt dygnet runt-öppna engelsktalande supportteam säkerställer att du aldrig lämnas utan hjälp.",
  },
  {
    id: "limited-scope",
    icon: "🗺️",
    title: "Förare som endast täcker punkt-till-punkt-överföringar",
    body: [
      "En privat charter bör hantera all marktransport under hela din resa – inte bara de viktigaste sträckorna mellan städer. Vissa lågprisförare släpper av dig vid ditt hotell och anser att deras jobb är klart, vilket lämnar dig att ordna separat transport till varje attraktion.",
      "Till exempel kan en förare ta dig från Colombo till Sigiriya men vägra att köra den korta sträckan från ditt hotell till Sigiriya Rock eller Dambulla Cave Temple. Att förhandla priser med okända lokala förare vid varje stopp ökar kostnaden, stressen och oförutsägbarheten.",
      "SLTCS-förare följer dig dörr till dörr under hela din resplan. Om en förare någonsin inte uppfyller denna standard, kompenserar vi kunden för eventuella extra kostnader och säger upp förarens kontrakt.",
    ],
    highlight:
      "Din SLTCS-förare ansvarar för varje resa från det ögonblick du landar till det ögonblick du reser.",
  },
  {
    id: "kickbacks",
    icon: "🛍️",
    title: "Envis omvägar till butiker med provision",
    body: [
      "Detta är en välkänd frustration för resenärer i Syd- och Sydostasien. Förare som arbetar med små marginaler kompletterar sin inkomst genom att styra passagerare till restauranger, juvelerarbutiker och ayurvediska spa som betalar provisionsavgifter.",
      "De inblandade anläggningarna är sällan de bästa alternativen – priserna tenderar att vara uppblåsta och kvaliteten inkonsekvent. Värre är att dessa oplanerade stopp tar tid från din dag och kan hindra dig från att slutföra din ursprungliga resplan.",
      "SLTCS-förare får rättvist betalt, så de har inget ekonomiskt incitament att ta dig någonstans du inte har bett om att besöka. Om du vill ha rekommendationer för en ayurvedisk behandling, en jeepsafari eller en valskådningsutflykt kan din förare ordna pålitliga alternativ – men bara när du frågar.",
    ],
    highlight:
      "SLTCS-förare föreslår aktiviteter endast på begäran. Din resplan förblir helt under din kontroll.",
  },
  {
    id: "poor-support",
    icon: "💬",
    title: "Inget meningsfullt stöd före eller under din resa",
    body: [
      "Lågprisoperatörer saknar ofta infrastrukturen för att ge äkta hjälp före resan. Att planera en resplan för Sri Lanka involverar många rörliga delar – avstånd, vägförhållanden, öppettider, säsongsstängningar – och expertvägledning gör en betydande skillnad.",
      "Många budgettjänster blir tysta när en bokning är bekräftad, vilket lämnar kunder utan hjälp om något ändras eller går fel på plats.",
      "SLTCS erbjuder engelskspråkig support från din första förfrågan till din slutliga avlämning. Våra lokalt baserade koordinatorer – med över 20 års samlad erfarenhet – finns till hands för att hjälpa till med resplanering, sista-minuten-ändringar och eventuella problem som uppstår under din resa.",
    ],
    highlight:
      "Från första kontakt till sista avsked, SLTCS är med dig hela vägen.",
  },
];

// ─── Why Prices Are What They Are ────────────────────────────────────────────
const COST_FACTORS = [
  {
    label: "Importtullar för fordon",
    desc: "Sri Lanka tar ut höga importtullar på bilar. En bil värd 12 000 pund i Japan kostar cirka 36 000 pund efter import. Förare måste prissätta sina tjänster därefter för att kunna betala fordonslån.",
  },
  {
    label: "Statligt certifierade förare",
    desc: "SLTCS arbetar endast med förare som innehar officiella licenser från Sri Lanka Tourism Development Authority (SLTDA). Kvalificerade förare kräver högre priser – och levererar en märkbart bättre upplevelse.",
  },
  {
    label: "Noggrant urval av förare",
    desc: "Våra lokala chefer, med över 20 års erfarenhet, granskar personligen varje förare gällande attityd, språkkunskaper, punktlighet och fordonets skick. Endast de bästa kandidaterna accepteras.",
  },
  {
    label: "Löpande kvalitetsledning",
    desc: "Kundfeedback granskas efter varje resa. Förare som får klagomål får omedelbar rådgivning; de som inte förbättrar sig tas bort från nätverket.",
  },
];

export default function LowPriceRisk() {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Title
    document.title = PAGE_TITLE;

    // Meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.content;
    metaDesc.content = PAGE_DESC;

    // JSON-LD: Article schema
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "Risker med billig biluthyrning på Sri Lanka: Varför billiga tjänster ofta kostar mer",
      description: PAGE_DESC,
      url: "https://sv.srilanka-charter.com/low-price-risk",
      author: {
        "@type": "Organization",
        name: "SLTCS – Hyr bil med privat förare på Sri Lanka",
        url: "https://sv.srilanka-charter.com",
      },
      publisher: {
        "@type": "Organization",
        name: "SLTCS – Hyr bil med privat förare på Sri Lanka",
        url: "https://sv.srilanka-charter.com",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://sv.srilanka-charter.com/low-price-risk",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "low-price-risk-jsonld";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.title = "SLTCS｜Hyr bil med privat förare på Sri Lanka";
      metaDesc!.content = prevDesc;
      document.getElementById("low-price-risk-jsonld")?.remove();
    };
  }, []);

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

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "60px",
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)",
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
          SERVICEKVALITET
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            margin: "0 auto 20px",
            maxWidth: "760px",
          }}
        >
          Varför{" "}
          <em style={{ color: "#c9a84c", fontStyle: "italic" }}>
            lågpris
          </em>{" "}
          biluthyrning på Sri Lanka innebär verkliga risker
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "1.05rem",
            maxWidth: "640px",
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          Ett rubrikpris som verkar för bra för att vara sant är det oftast. Den
          här sidan förklarar de sex vanligaste fallgroparna med
          ultrabudget-biluthyrningstjänster på Sri Lanka – och hur SLTCS
          hanterar var och en.
        </p>
      </section>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── Intro ── */}
        <section style={{ padding: "56px 0 0" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.85,
              fontSize: "0.97rem",
            }}
          >
            SLTCS grundades på en enkel övertygelse: en semester på Sri Lanka
            ska inte förstöras av just den förare som anlitats för att göra den
            minnesvärd. I företagets tidiga dagar experimenterade vi med
            billigare förararrangemang för att hålla priserna konkurrenskraftiga.
            De kundklagomål som följde lärde oss en viktig läxa – under en viss
            gräns kan kvaliteten inte upprätthållas.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.85,
              fontSize: "0.97rem",
              marginTop: "16px",
            }}
          >
            Idag arbetar SLTCS uteslutande med statligt licensierade förare som
            uppfyller våra egna strikta interna standarder. Våra priser är satta
            på den lägsta nivå som gör att vi kan upprätthålla det åtagandet. Denna sida
            förklarar vad som händer när tjänster understiger den nivån.
          </p>
        </section>

        {/* ── Risk Cards ── */}
        <section style={{ marginTop: "56px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.6rem",
              color: "#fff",
              marginBottom: "36px",
              textAlign: "center",
            }}
          >
            Sex risker med att välja en ultralågpristjänst
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {RISKS.map((risk, idx) => (
              <div
                key={risk.id}
                id={risk.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  borderRadius: "14px",
                  padding: "32px",
                }}
              >
                {/* Number + Title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(201,168,76,0.12)",
                      border: "1px solid rgba(201,168,76,0.3)",
                      color: "#c9a84c",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.15rem",
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.35,
                      paddingTop: "8px",
                    }}
                  >
                    <span style={{ marginRight: "8px" }}>{risk.icon}</span>
                    {risk.title}
                  </h3>
                </div>

                {/* Body paragraphs */}
                {risk.body.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    style={{
                      color: "rgba(255,255,255,0.72)",
                      lineHeight: 1.8,
                      fontSize: "0.93rem",
                      marginBottom: pIdx < risk.body.length - 1 ? "14px" : "20px",
                      marginTop: 0,
                    }}
                  >
                    {para}
                  </p>
                ))}

                {/* Highlight callout */}
                <div
                  style={{
                    background: "rgba(201,168,76,0.07)",
                    borderLeft: "3px solid #c9a84c",
                    borderRadius: "0 8px 8px 0",
                    padding: "12px 16px",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                  }}
                >
                  {risk.highlight}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Prices Are What They Are ── */}
        <section style={{ marginTop: "64px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            Varför SLTCS-priser är som de är
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.93rem",
              lineHeight: 1.8,
              marginBottom: "28px",
            }}
          >
            Biluthyrningsmarknaden i Sri Lanka kan verka billig jämfört med Europa,
            men flera strukturella faktorer driver upp kostnaderna högre än många
            resenärer förväntar sig. Att förstå dessa faktorer hjälper till att förklara varför
            ansvarsfulla operatörer inte bara kan matcha de lägsta annonserade priserna.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {COST_FACTORS.map((factor) => (
              <div
                key={factor.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  padding: "22px 24px",
                }}
              >
                <div
                  style={{
                    color: "#c9a84c",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  {factor.label}
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    fontSize: "0.88rem",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {factor.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Gold Plan callout ── */}
        <section
          style={{
            marginTop: "64px",
            background: "rgba(201,168,76,0.06)",
            border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: "14px",
            padding: "36px 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#c9a84c",
              color: "#000",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: "4px 14px",
              borderRadius: "20px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            GULDPRENUMERATION
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.45rem",
              color: "#fff",
              margin: "0 0 16px",
              lineHeight: 1.3,
            }}
          >
            Guldplanen: Guidad tur-kvalitet till ett privat charterpris
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.93rem",
              lineHeight: 1.8,
              maxWidth: "640px",
              margin: "0 auto 24px",
            }}
          >
            Vår Guldplan tilldelar förare som innehar Chaufförguide-körkortet – den högsta kvalifikationen som utfärdats av den lankesiska regeringen. Till skillnad från vanliga turistförarkort tillåter denna behörighet föraren att följa med dig in på turistplatser och ge expertkommentarer om historien och kulturen för varje plats.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.93rem",
              lineHeight: 1.8,
              maxWidth: "640px",
              margin: "0 auto 28px",
            }}
          >
            Oavsett om du bestiger Sigiriya Rock, utforskar de antika
            ruinerna av Anuradhapura, eller besöker Tandens Tempel i
            Kandy, är din Gold Plan-förare vid din sida – förklarar, guidar,
            och förhöjer varje ögonblick. Pålitliga rekommendationer för
            safarijeep-turer och valskådningsutflykter finns tillgängliga på begäran.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/price"
              style={{
                display: "inline-block",
                background: "#c9a84c",
                color: "#000",
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "13px 32px",
                borderRadius: "6px",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              Se priser
            </Link>
            <a
              href="/#contact"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#c9a84c",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "13px 32px",
                borderRadius: "6px",
                textDecoration: "none",
                border: "1px solid rgba(201,168,76,0.5)",
                letterSpacing: "0.04em",
              }}
            >
              Kostnadsfri förfrågan
            </a>
          </div>
        </section>

        {/* ── Summary ── */}
        <section style={{ marginTop: "56px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            Den sanna kostnaden för en billig tjänst
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.85,
              fontSize: "0.95rem",
              marginBottom: "16px",
            }}
          >
            Ett lågt annonserat pris återspeglar sällan den fulla kostnaden för en resa. När överskriden körsträcka, omvägar, sista-minuten-arrangemang för lokal transport och stressen med dålig kommunikation räknas in, blir en budgettjänst ofta dyrare – i pengar, tid och sinnesro – än ett korrekt prissatt alternativ.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.85,
              fontSize: "0.95rem",
            }}
          >
            SLTCS sätter sina priser på den miniminivå som gör att vi kan leverera en tjänst vi verkligen är stolta över. Vi inbjuder dig att jämföra våra fasta priser och bedöma själv.
          </p>
        </section>

        {/* ── Back to Pricing ── */}
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <Link
            href="/price"
            style={{
              color: "#c9a84c",
              fontSize: "0.9rem",
              textDecoration: "none",
              borderBottom: "1px solid rgba(201,168,76,0.4)",
              paddingBottom: "2px",
            }}
          >
            ← Tillbaka till prissättning
          </Link>
        </div>

      </div>
      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "32px 24px",
          textAlign: "center",
          color: "rgba(255,255,255,0.35)",
          fontSize: "0.8rem",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          © {new Date().getFullYear()} Sri Lanka Taxi Charter Service
          International Limited. Alla rättigheter förbehålls.
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Hem</a>
          <a href="/price" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Priser</a>
          <a href="/vehicles" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Fordon</a>
          <a href="/faq" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>FAQ</a>
          <a href="/#contact" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Kontakt</a>
        </div>
      </footer>
    </div>
  );
}
