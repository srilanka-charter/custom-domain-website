import { useState, useEffect } from "react";
import { Link } from "wouter";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const PAGE_TITLE = "FAQ – Vanliga frågor | SLTCS Hyr bil med privat förare på Sri Lanka";
const PAGE_DESC =
  "Svar på vanliga frågor om SLTCS (Hyr bil med privat förare på Sri Lanka): tips, aktiviteter, betalning, avbokningsregler, förarintroduktion och mer.";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
interface FaqItem {
  q: string;
  a: React.ReactNode;
  plainText: string; // plain text version for JSON-LD
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Vilken typ av tjänst är SLTCS (Hyr bil med privat förare på Sri Lanka)?",
    plainText: "SLTCS (Hyr bil med privat förare på Sri Lanka) är en onlinetjänst för matchning av marktransporter som drivs av Sri Lanka Taxi Charter Service International Limited, ett Hongkong-registrerat företag. Den kopplar samman resenärer med turistförare registrerade hos Sri Lanka Tourism Development Authority (SLTDA). Transportavtalet ingås direkt mellan kunden och föraren. SLTCS fungerar som en introduktions- och kommunikationsförmedlare och tillhandahåller inte själv transporter.",
    a: (
      <>
        <p>
          SLTCS (Hyr bil med privat förare på Sri Lanka) är en onlinetjänst för
          matchning av marktransporter som drivs av Sri Lanka Taxi Charter
          Service International Limited, ett Hongkong-registrerat företag. Den
          kopplar samman resenärer med turistförare registrerade hos Sri Lanka
          Tourism Development Authority (SLTDA).
        </p>
        <p className="mt-2">
          Transportavtalet ingås direkt mellan kunden och föraren. SLTCS
          fungerar som en introduktions- och kommunikationsförmedlare och
          tillhandahåller inte själv transporter.
        </p>
        <p className="mt-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2 text-xs">
          ※ Viktigt: Vi hanterar inte bokningar, försäljning eller arrangemang
          för boende, turistattraktioner, aktiviteter, järnvägar etc. All
          information som tillhandahålls i denna FAQ är endast för
          referens. Alla avtal för sådana tjänster ingås direkt mellan kunden
          och respektive leverantör.
        </p>
      </>
    ),
  },
  {
    q: "Hur mycket dricks ska jag ge, och när?",
    plainText: "En riktlinje för dricks är LKR 2 000–4 000 per dag (ca USD 6–12). Det är brukligt att lämna den i slutet av varje dags resplan. Att lägga till ett tack hjälper till att säkerställa ännu bättre service de följande dagarna. Dricks är helt frivilligt.",
    a: (
      <>
        <p>
          En riktlinje för dricks är{" "}
          <strong>2 000–4 000 LKR per dag (ca 6–12 USD)</strong>. Det är
          brukligt att lämna den i slutet av varje dags resplan. Att lägga till
          ett tack hjälper till att säkerställa ännu bättre service de
          följande dagarna.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Dricks är helt frivilligt.
        </p>
      </>
    ),
  },
  {
    q: "Kan jag rådfråga på engelska om min resplan eller få förslag på rutter?",
    plainText: "Ja. Om du delar din önskade resplan och destinationer med oss kan vi ge förslag på resvägar och beräknade restider baserat på lokal kännedom (endast för referensändamål). De slutgiltiga besluten om resplanen ligger hos dig.",
    a: (
      <p>
        Ja. Om du delar din önskade resplan och destinationer med oss kan vi
        ge{" "}
        <strong>förslag på resvägar och beräknade restider</strong>{" "}
        baserat på lokal kännedom (endast för referensändamål). De slutgiltiga
        besluten om resplanen ligger hos dig.
      </p>
    ),
  },
  {
    q: "Kan ni ordna aktiviteter som safari eller valskådning?",
    plainText: "Om du har Silverplanen eller högre kan du be din chaufför ordna safari (jeepsafari) och valskådning (kostnader betalas lokalt). För andra aktiviteter som Ayurveda är du välkommen att rådfråga din chaufför efter ankomsten, men SLTCS hanterar inte bokningar eller försäljning å dina vägnar.",
    a: (
      <>
        <p>
          Om du har <strong>Silverplanen eller högre</strong>, kan du
          be din chaufför ordna safari (jeepsafari) och valskådning
          (kostnader betalas lokalt). Observera att alla bokningar,
          betalningar och avtal görs direkt mellan dig och chauffören.
        </p>
        <p className="mt-2">
          För andra aktiviteter som Ayurveda är du välkommen att rådfråga
          din chaufför efter ankomsten, men SLTCS hanterar inte bokningar eller
          försäljning å dina vägnar. Om du är orolig rekommenderar vi att du
          bokar online i förväg.
        </p>
      </>
    ),
  },
  {
    q: "Kan jag lita på chaufförens körförmåga och punktlighet?",
    plainText: "Vi väljer chaufförer baserat på kvalifikationer och meritlista, och vi informerar i förväg om de punkter som våra gäster värdesätter mest – punktlighet, säker körning och renlighet. Transport tillhandahålls av chauffören; SLTCS garanterar inte transportkvaliteten.",
    a: (
      <>
        <p>
          Vi väljer chaufförer baserat på kvalifikationer och meritlista, och vi
          i förväg de punkter som våra gäster värdesätter mest – punktlighet,
          säker körning och renlighet.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Transport tillhandahålls av föraren; SLTCS garanterar inte
          transportkvaliteten.
        </p>
      </>
    ),
  },
  {
    q: "Kan en babysits eller barnstol tillhandahållas?",
    plainText: "Vi kan hjälpa till i mån av tillgänglig kapacitet (beroende på lager och region). Om du behöver en, vänligen kontakta oss i förväg så att vi kan göra nödvändiga arrangemang.",
    a: (
      <p>
        Vi kan hjälpa till i mån av tillgänglig kapacitet (beroende på lager och region).
        Om du behöver en, vänligen{" "}
        <strong>kontakta oss i förväg</strong> så att vi kan göra nödvändiga
        arrangemang.
      </p>
    ),
  },
  {
    q: "Kommer mötet med föraren att gå smidigt?",
    plainText: "Vi kommer att tillhandahålla förarens kontaktuppgifter före din avresa så att du kan ta kontakt i förväg. Skulle några problem uppstå, stöder vi dig också via e-post och våra kontaktkanaler. Vi kan inte garantera resultatet av mötesplatsarrangemanget.",
    a: (
      <>
        <p>
          Vi kommer att tillhandahålla förarens kontaktuppgifter före din avresa så
          att du kan ta kontakt i förväg. Skulle några problem uppstå, stöder vi dig också
          via e-post och våra kontaktkanaler.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Vi kan inte garantera resultatet av mötesplatsarrangemanget.
        </p>
      </>
    ),
  },
  {
    q: "Kan föraren ge kommentarer och vägledning vid turistattraktioner?",
    plainText: "På Sri Lanka finns det två förarkategorier: en turistförare som hanterar persontransport, och en högre kvalificerad chaufförsguide som också kan ge kommentarer och vägledning på plats. Silverplanen och högre betjänas av en turistförare eller högre; Guldplanen betjänas av en chaufförsguide. Under högsäsong på Silverplanen kommer en lokal guide att ordnas vid vissa platser utan extra kostnad.",
    a: (
      <>
        <p>
          På Sri Lanka finns det två förarkategorier: en "turistförare" som
          hanterar persontransport, och en högre kvalificerad "chaufförsguide"
          som också kan ge kommentarer och vägledning på plats.
        </p>
        <p className="mt-2">
          <strong>Silverplanen och högre</strong> betjänas av en turistförare
          eller högre; <strong>Guldpaketet</strong> hanteras av en
          chaufförsguide. Förare med Silverpaket och högre kan följa med
          dig till turistattraktioner och ge förklaringar.
        </p>
        <p className="mt-2">
          Under högsäsong med Silverpaketet och en turistförare, kan föraren
          dock inte följa med dig in i Sigiriya Rock, Anuradhapura eller
          Polonnaruwa. I sådana fall kommer en lokal guide att ordnas
          på plats utan extra kostnad.
        </p>
        <p className="mt-2">
          Observera att förare inte är specialistguider. För mer detaljerade
          kommentarer rekommenderar vi att du själv ordnar en professionell guide.
        </p>
      </>
    ),
  },
  {
    q: "Vilka betalningsmetoder accepteras?",
    plainText: "Ingen förskottsbetalning krävs. När du träffar din förare i Sri Lanka betalar du serviceavgiften med kreditkort. Förarens transportavgift betalas direkt till föraren i din valda valuta – hälften första dagen och resterande hälft sista dagen.",
    a: (
      <>
        <p>
          <strong>Ingen förskottsbetalning krävs.</strong> När du träffar din
          förare i Sri Lanka betalar du serviceavgiften med{" "}
          <strong>kreditkort</strong>. Förarens transportavgift betalas
          direkt till föraren i din valda valuta —{" "}
          <strong>hälften första dagen</strong> och den{" "}
          <strong>resterande hälften sista dagen</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Kontakta oss gärna angående betalningsmetoder.
        </p>
      </>
    ),
  },
  {
    q: "Vad ingår i priset, och vad ingår inte?",
    plainText: "Ingår: Fordonskostnad (japansktillverkat fordon), förarens löner, måltider och boende, fordonsförsäkring, motorvägsavgifter och parkeringsavgifter. Ingår ej: Dricks (frivilligt), inträdesavgifter till turistattraktioner, safari, valskådning och andra aktivitetsavgifter.",
    a: (
      <>
        <p className="font-semibold">Ingår:</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
          <li>Fordonskostnad (japansktillverkat fordon)</li>
          <li>Förarens löner, måltider och boende</li>
          <li>Fordonsförsäkring</li>
          <li>Motorvägsavgifter och parkeringsavgifter</li>
        </ul>
        <p className="font-semibold mt-3">Ingår ej:</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
-----END CHUNK-----
          <li>Dricks (frivilligt)</li>
          <li>Inträdesavgifter till turistattraktioner</li>
          <li>Avgifter för safari, valskådning och andra aktiviteter</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          ※ Transportvillkoren kan ändras på grund av ändringar i resplanen samma dag, ytterligare önskemål eller överskriden tid (diskuteras mellan dig och föraren).
        </p>
      </>
    ),
  },
  {
    q: "Vad händer om jag inte kan boka tåget till teplantagen – kan ni ordna det?",
    plainText: "Vi ber dig att själv ordna tågbokningar online. Vi rekommenderar att du använder 12Go.Asia för reservationer. Om du inte kan säkra en reservation kan vi fortfarande ge referensinformation ur ett transportperspektiv. SLTCS hanterar inte tåg- eller andra transportbokningar eller försäljningar.",
    a: (
      <>
        <p>
          Vi ber dig att själv ordna tågbokningar online. Vi
          rekommenderar att du använder <strong>12Go.Asia</strong> för reservationer.
        </p>
        <p className="mt-2">
          Om du inte kan säkra en reservation kan vi fortfarande ge
          referensinformation ur ett transportperspektiv – till exempel sektioner
          där det är trevligt att stå.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ SLTCS hanterar inte tåg- eller andra transportbokningar eller försäljningar.
        </p>
      </>
    ),
  },
  {
    q: "Vad händer om min resplan eller mina planer ändras i sista minuten?",
    plainText: "Ingen förskottsbetalning krävs före din ankomst till Sri Lanka. Upp till 7 dagar före resans start: Ingen avbokningsavgift. Eventuell serviceavgift som redan betalats återbetalas (minus faktiska kostnader som betalningshanteringsavgifter). 2–6 dagar före resans start: Ingen förskottsbetalning krävs före din ankomst till Sri Lanka. Avbokning accepteras upp till 7 dagar före din resa. Även efter det, om ditt flyg ställs in på grund av krig, väder eller andra omständigheter utanför din kontroll, accepterar vi också din avbokning. Dagen före eller på resdagen: Ingen återbetalning oavsett anledning.",
    a: (
      <>
        <ul className="text-sm text-white space-y-2">
          <li>
            <strong>Upp till 7 dagar före resans start:</strong> Ingen avboknings-
            avgift. Eventuell serviceavgift som redan betalats återbetalas (minus faktiska
            kostnader som betalningshanteringsavgifter).
          </li>
          <li>
            <strong>2–6 dagar före resans start:</strong> Ingen förskottsbetalning
            krävs före din ankomst till Sri Lanka. Avbokning är
            accepteras upp till 7 dagar före din resa. Även efter det, om ditt
            flyg ställs in på grund av krig, väder eller andra omständigheter
            utanför din kontroll, kommer vi också att acceptera din avbokning.
          </li>
          <li>
            <strong>Dagen före eller på resdagen:</strong> Ingen återbetalning
            av någon anledning.
          </li>
        </ul>
        <p className="mt-2 text-xs text-white/60">
          ※ Förarens transportavgifter regleras direkt på plats och ligger
          därför utanför SLTCS återbetalningsansvar.
        </p>
      </>
    ),
  },
  {
    q: "Kan jag resa även om jag anländer sent på kvällen den första dagen?",
    plainText: "I princip, ja – men beroende på förarens tillgänglighet, säkerhetsöverväganden och vägförhållanden är det inte alltid möjligt. Om du behöver en transfer sent på kvällen, vänligen kontakta oss i förväg. Vi kommer att göra vårt bästa för att tillgodose dina behov flexibelt.",
    a: (
      <p>
        I princip, ja – men beroende på förarens tillgänglighet, säkerhets-
        överväganden och vägförhållanden är det inte alltid möjligt. Om
        du behöver en transfer sent på kvällen,{" "}
        <strong>vänligen kontakta oss i förväg</strong>. Vi kommer att göra vårt bästa för
        att tillgodose dina behov flexibelt.
      </p>
    ),
  },
  {
    q: "Berätta om presentationen av föraren.",
    plainText: "För Silverplanen och högre presenterar vi SLTDA (Sri Lanka Tourism Development Authority)-registrerade turismförare. Vi kommer att göra vårt bästa för att tillgodose önskemål om engelsktalande förare, men vi kan inte garantera tillgänglighet på grund av utbudsförhållanden.",
    a: (
      <p>
        För <strong>Silverplanen och högre</strong> presenterar vi SLTDA
        (Sri Lanka Tourism Development Authority)-registrerade turismförare.
        Vi kommer att göra vårt bästa för att tillgodose önskemål om engelsktalande
        förare, men vi kan inte garantera tillgänglighet på grund av utbudsförhållanden.
      </p>
    ),
  },
  {
    q: "Är reseförsäkring nödvändigt?",
    plainText: "Vi rekommenderar starkt att teckna en reseförsäkring. Även om lankesisk lag kräver att alla fordon har försäkring, är täckningsnivåerna låga – även vid en dödsolycka uppgår ersättningen till cirka 1 000 USD. Att teckna en egen reseförsäkring är det mest pålitliga alternativet.",
    a: (
      <>
        <p>
          <strong>Vi rekommenderar starkt att teckna en reseförsäkring.</strong>{" "}
          Även om lankesisk lag kräver att alla fordon har försäkring, är
          täckningsnivåerna låga – även vid en dödsolycka uppgår ersättningen
          till cirka 1 000 USD.
        </p>
        <p className="mt-2">
          För att täcka medicinska utgifter, egendomsskador och ansvar under din
          resa är det mest pålitliga alternativet att teckna en egen reseförsäkring.
          Vissa kreditkort inkluderar reseförsäkring som en förmån – kontrollera
          ditt korts villkor.
        </p>
      </>
    ),
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="faq-accordion-item">
      <button
        className="faq-accordion-btn"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq-q-badge">F</span>
        <span className="faq-q-text">{item.q}</span>
        <span className={`faq-chevron${isOpen ? " open" : ""}`}>›</span>
      </button>
      {isOpen && (
        <div className="faq-accordion-body">
          <span className="faq-a-badge">S</span>
          <div className="faq-a-content">{item.a}</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      (meta as HTMLMetaElement).name = "description";
      document.head.appendChild(meta);
    }
    (meta as HTMLMetaElement).content = PAGE_DESC;

    // JSON-LD: FAQPage schema for Google rich results
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.plainText,
        },
      })),
    };
    const existingScript = document.querySelector('script[data-id="faq-jsonld"]');
    if (existingScript) existingScript.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-id", "faq-jsonld");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.querySelector('script[data-id="faq-jsonld"]')?.remove();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="faq-page">
      {/* ── Navbar ── */}
      <nav className={`sltcs-nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          SLTCS｜Hyr bil med privat förare på Sri Lanka
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/#plans" onClick={(e) => { e.preventDefault(); window.location.href = "/#plans"; }}>PLANER</Link>
          </li>
          <li
            className="nav-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button>EXEMPELRESPLAN</button>
            {dropdownOpen && (
              <div className="nav-dropdown-menu">
                <Link href="/#courses" onClick={(e) => { e.preventDefault(); window.location.href = "/#courses"; }}>4 nätter / 5 dagar</Link>
                <Link href="/#courses" onClick={(e) => { e.preventDefault(); window.location.href = "/#courses"; }}>5 nätter / 6 dagar</Link>
                <Link href="/#courses" onClick={(e) => { e.preventDefault(); window.location.href = "/#courses"; }}>6 nätter / 7 dagar</Link>
                <Link href="/#courses" onClick={(e) => { e.preventDefault(); window.location.href = "/#courses"; }}>5 till 7 dagar – Kulturella triangeln</Link>
                <Link href="/#courses" onClick={(e) => { e.preventDefault(); window.location.href = "/#courses"; }}>10 dagar till 2 veckor – Klassisk plan</Link>
              </div>
            )}
          </li>
          <li>
            <Link href="/vehicles">FORDON</Link>
          </li>
          <li>
            <Link href="/price">PRIS</Link>
          </li>
          <li>
            <Link href="/#contact" onClick={(e) => { e.preventDefault(); window.location.href = "/#contact"; }}>KONTAKT</Link>
          </li>
          <li>
            <Link href="/faq" className="active">FAQ</Link>
          </li>
        </ul>
        <button
          className="hamburger"
          aria-label="Meny"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      {mobileOpen && (
        <div className="mobile-menu open">
          <Link href="/#plans" onClick={() => setMobileOpen(false)}>Planer</Link>
          <Link href="/#courses" onClick={() => setMobileOpen(false)}>Exempelresplan</Link>
          <Link href="/vehicles" onClick={() => setMobileOpen(false)}>Fordon</Link>
          <Link href="/price" onClick={() => setMobileOpen(false)}>Pris</Link>
          <Link href="/#contact" onClick={() => setMobileOpen(false)}>Kontakt</Link>
          <Link href="/faq" onClick={() => setMobileOpen(false)}>FAQ</Link>
          <Link href="/#contact" className="btn-nav-mobile" onClick={() => setMobileOpen(false)}>
            Kostnadsfri förfrågan
          </Link>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="faq-hero">
        <div className="faq-hero-content">
          <div className="section-eyebrow">SLTCS – HYR BIL MED PRIVAT FÖRARE PÅ SRI LANKA</div>
          <h1>FAQ</h1>
          <p className="faq-hero-sub">
            Vanliga frågor om SLTCS (Hyr bil med privat förare på Sri Lanka)
          </p>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Hem</Link>
            <span> / </span>
            <span>FAQ</span>
          </nav>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="faq-intro">
        <div className="faq-intro-inner">
          <p>
            Nedan hittar du svar på vanliga frågor från kunder som
            överväger eller använder SLTCS (Hyr bil med privat förare på Sri Lanka).
            Om du har ytterligare frågor är du välkommen att kontakta oss.
          </p>
        </div>
      </section>

      {/* ── Table of Contents ── */}
      <section className="faq-toc-section">
        <div className="faq-toc-inner">
          <h2 className="faq-toc-title">Innehållsförteckning</h2>
          <ol className="faq-toc-list">
            {FAQ_ITEMS.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    setOpenIndex(i);
                    setTimeout(() => {
                      document
                        .getElementById(`faq-item-${i}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                >
                  {item.q}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Accordion ── */}
      <section className="faq-accordion-section">
        <div className="faq-accordion-inner">
          {FAQ_ITEMS.map((item, i) => (
            <div id={`faq-item-${i}`} key={i}>
              <AccordionItem
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="faq-cta">
        <div className="faq-cta-inner">
          <p className="faq-cta-sub">Om din fråga inte besvaras här</p>
          <h2 className="faq-cta-title">Kontakta oss gärna</h2>
          <a href="/#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); window.location.href = "/#contact"; }}>
            <span>💬</span> Kostnadsfri förfrågan
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="sltcs-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              Hyr bil med privat förare på Sri Lanka
              <span className="footer-logo-sub">SLTCS</span>
            </div>
            <p className="footer-tagline">
              En helt privat chartertjänst som utforskar hela Sri Lanka med en
              dedikerad engelsktalande förare.
            </p>
          </div>
          <div className="footer-nav">
            <div className="footer-nav-col">
              <div className="footer-nav-title">Navigering</div>
              <Link href="/#plans">Planer</Link>
              <Link href="/#courses">4 nätter / 5 dagar</Link>
              <Link href="/#courses">5 nätter / 6 dagar</Link>
              <Link href="/#courses">6 nätter / 7 dagar</Link>
              <Link href="/#courses">Modellresplan</Link>
            </div>
            <div className="footer-nav-col">
              <Link href="/vehicles">Fordon</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/#contact">Kontakt</Link>
            </div>
          </div>
          <div className="footer-contact">
            <div className="footer-nav-title">Kontakt</div>
            <a href="/#contact" className="btn-footer-cta">
              Kostnadsfri förfrågan
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © Hyr bil med privat förare på Sri Lanka Alla rättigheter förbehållna.</p>
        </div>
      </footer>
    </div>
  );
}
