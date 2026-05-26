/**
 * SLTCS – Hyr bil med privat förare på Sri Lanka
 * Design: Mörk lyxig reseestetik
 * - Playfair Display (serif) för rubriker
 * - Inter för brödtext
 * - Guldfärgad (#c9a84c) accent på en djupt mörk bakgrund
 * - Fullbreddshjältebildspel, flikindelade resplaner, kontaktformulär
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

// ─── Anpassad datumväljare (svensk lokalisering, OS-oberoende) ──────────────────────
const MONTHS_EN = ["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];
const DAYS_EN = ["Sön","Mån","Tis","Ons","Tor","Fre","Lör"];

function DatePicker({ id, name, value, onChange, required }: {
  id: string; name: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split("-")[0]) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split("-")[1]) - 1 : new Date().getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayValue = value
    ? (() => { const [y,m,d] = value.split("-"); return `${d} ${MONTHS_EN[parseInt(m)-1]} ${y}`; })()
    : "DD / MMM / ÅÅÅÅ";

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const selectDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); };
  const selectedDay = value ? parseInt(value.split("-")[2]) : null;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : null;
  const selectedYear = value ? parseInt(value.split("-")[0]) : null;

  return (
    <div className="datepicker-wrap" ref={ref}>
      <input type="hidden" id={id} name={name} value={value} required={required} />
      <button type="button" className="datepicker-trigger" onClick={() => setOpen(o => !o)}>
        <span className="datepicker-icon">📅</span>
        <span className={value ? "datepicker-val" : "datepicker-placeholder"}>{displayValue}</span>
      </button>
      {open && (
        <div className="datepicker-popup">
          <div className="datepicker-header">
            <button type="button" className="datepicker-nav" onClick={prevMonth}>‹</button>
            <span className="datepicker-month-year">{MONTHS_EN[viewMonth]} {viewYear}</span>
            <button type="button" className="datepicker-nav" onClick={nextMonth}>›</button>
          </div>
          <div className="datepicker-grid">
            {DAYS_EN.map(d => <div key={d} className="datepicker-dayname">{d}</div>)}
            {Array.from({length: firstDay}).map((_,i) => <div key={`e${i}`} />)}
            {Array.from({length: daysInMonth}).map((_,i) => {
              const day = i + 1;
              const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
              const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();
              return (
                <button
                  key={day}
                  type="button"
                  className={`datepicker-day${isSelected ? " selected" : ""}${isToday && !isSelected ? " today" : ""}`}
                  onClick={() => selectDate(day)}
                >{day}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Image URLs (uploaded to manus-storage) ───────────────────────────────────
const IMAGES = {
  hero1: "/manus-storage/hero_van_srilanka_706f8966.jpg",
  hero2: "/manus-storage/slide2_sigiriya_b8468f12.jpg",
  hero3: "/manus-storage/slide3_tea_train_e100395a.jpg",
  hero4: "/manus-storage/slide4_kandy_19bf406f.jpg",
  hero5: "/manus-storage/slide5_galle_8aced38c.jpg",
  destYala: "/manus-storage/dest_yala_0e498c0a.jpg",
  destElla: "/manus-storage/dest_ella_bd8060fc.jpg",
  destNuwara: "/manus-storage/dest_nuwara_57f4e54f.jpg",
};

const SLIDES = [
  { src: IMAGES.hero1, alt: "Vit skåpbil kör längs en väg på Sri Lanka vid solnedgången" },
  { src: IMAGES.hero2, alt: "Flygfoto över Sigiriya Rock Fortress" },
  { src: IMAGES.hero3, alt: "Naturskön tågresa genom en teplantage på Sri Lanka" },
  { src: IMAGES.hero4, alt: "Kandy Temple of the Tooth Sri Lanka" },
  { src: IMAGES.hero5, alt: "Galle Fort holländska koloniala vallar" },
];
// Note: hero1 = van image (first slide), hero2 = Sigiriya (second slide)

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileItineraryOpen, setMobileItineraryOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const LANGUAGES = [
    { label: "French", url: "https://fr.srilanka-charter.com/" },
    { label: "Spanish", url: "https://es.srilanka-charter.com/" },
    { label: "German", url: "https://de.srilanka-charter.com/" },
    { label: "Dutch", url: "https://nl.srilanka-charter.com/" },
    { label: "Russian", url: "https://ru.srilanka-charter.com/" },
    { label: "Japanese", url: "https://sltcs.srilanka-charter.com/" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`sltcs-nav${scrolled ? " scrolled" : ""}`}>
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
          <span className="nav-logo-full">SLTCS｜Hyr bil med privat förare på Sri Lanka</span>
          <span className="nav-logo-short">SLTCS</span>
        </a>
        <ul className="nav-links">
          <li><a href="#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>PLANER</a></li>
          <li className="nav-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button>MODELLRESPLAN</button>
            {dropdownOpen && (
              <div className="nav-dropdown-menu">
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>4 nätter / 5 dagar</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 nätter / 6 dagar</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 nätter / 7 dagar</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 till 7 dagar – Kulturella triangeln</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 dagar till 2 veckor – Klassisk plan</a>
              </div>
            )}
          </li>
          <li><a href="/vehicles">FORDON</a></li>
          <li><a href="/voice">RÖST</a></li>
          <li><a href="/price">PRIS</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>KONTAKT</a></li>
          <li><a href="/faq">VANLIGA FRÅGOR</a></li>
          <li className="nav-dropdown nav-lang-dropdown" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
            <button style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              SV
            </button>
            {langOpen && (
              <div className="nav-dropdown-menu">
                {LANGUAGES.map((lang) => (
                  <a key={lang.label} href={lang.url}>{lang.label}</a>
                ))}
              </div>
            )}
          </li>
        </ul>
        <button className="hamburger" aria-label="Meny" onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>
      </nav>
      {mobileOpen && (
        <div className="mobile-menu open">
          <a href="#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>Planer</a>
          {/* Model Itinerary accordion */}
          <div className="mobile-accordion">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileItineraryOpen(o => !o)}
            >
              <span>Modellresplan</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: mobileItineraryOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              ><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {mobileItineraryOpen && (
              <div className="mobile-accordion-body">
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>4 nätter / 5 dagar</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 nätter / 6 dagar</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 nätter / 7 dagar</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5–7 dagar – Kulturella triangeln</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 dagar till 2 veckor – Klassisk</a>
              </div>
            )}
          </div>
          <a href="/vehicles">Fordon</a>
          <a href="/price">Pris</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kontakt</a>
          <a href="/faq">FAQ</a>
          <a href="/voice">Röst</a>
          {/* Language accordion */}
          <div className="mobile-accordion">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileLangOpen(o => !o)}
            >
              <span>Andra språk</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: mobileLangOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              ><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {mobileLangOpen && (
              <div className="mobile-accordion-body">
                {[{label:"French",url:"https://fr.srilanka-charter.com/"},{label:"Spanish",url:"https://es.srilanka-charter.com/"},{label:"German",url:"https://de.srilanka-charter.com/"},{label:"Dutch",url:"https://nl.srilanka-charter.com/"},{label:"Russian",url:"https://ru.srilanka-charter.com/"},{label:"Japanese",url:"https://sltcs.srilanka-charter.com/"}].map((lang) => (
                  <a key={lang.label} href={lang.url}>{lang.label}</a>
                ))}
              </div>
            )}
          </div>
          <a href="#contact" className="btn-nav-mobile" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kostnadsfri förfrågan</a>
        </div>
      )}
    </>
  );
}

// ─── Hero Slideshow ───────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((n: number) => {
    setCurrent(n);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-slider">
        {SLIDES.map((slide, i) => (
          <div key={i} className={`hero-slide${i === current ? " active" : ""}`}>
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="container" style={{ paddingLeft: "0" }}>
          <div style={{ maxWidth: "680px" }}>
          <div className="hero-eyebrow">PRIVAT CHARTERSERVICE PÅ SRI LANKA</div>
          <div className="hero-badge">HYR BIL MED FÖRARE</div>
          <h1>Hyr bil med <em>privat förare</em> på Sri Lanka</h1>
          <p className="hero-sub">
            Utforska Sri Lanka i din egen takt med en dedikerad privat förare.
            Fullt flexibelt, helt privat – det bästa sättet att upptäcka Indiska oceanens pärla.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">Engelsktalande support</span>
            <span className="hero-tag">Helt privat charter</span>
            <span className="hero-tag">Regeringscertifierad förare</span>
          </div>
          <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
            Kostnadsfri förfrågan
          </a>
          </div>
        </div>
      </div>
      <div className="hero-location">
        <div className="hero-location-label">Plats</div>
        <div className="hero-location-value">Hela Sri Lanka</div>
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot${i === current ? " active" : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>
      <div className="hero-scroll">
        <span>Scrolla</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

// ─── Stats Counter ────────────────────────────────────────────────────────────
function Stats() {
  const [counts, setCounts] = useState({ charters: 0, satisfaction: 0, drivers: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts({
              charters: Math.floor(400 * eased),
              satisfaction: parseFloat((4.9 * eased).toFixed(1)),
              drivers: Math.floor(30 * eased),
            });
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats" ref={ref}>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{counts.charters}+</div>
          <div className="stat-label">Totala charterresor</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{counts.satisfaction.toFixed(1)}</div>
          <div className="stat-label">Genomsnittlig nöjdhet</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{counts.drivers}+</div>
          <div className="stat-label">Certifierade förare</div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact + Why SLTCS (2-column layout) ──────────────────────────────────
function ContactAndWhy() {
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [, setLocation] = useLocation();

  const submitMutation = trpc.enquiry.submit.useMutation({
    onSuccess: () => { setLocation("/thanks"); },
    onError: (err) => {
      setSubmitError(err.message || "Det gick inte att skicka förfrågan. Försök igen.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    submitMutation.mutate({
      name: (data.get("name") as string) || "",
      country: (data.get("country") as string) || "",
      countryOther: (data.get("countryOther") as string) || undefined,
      email: (data.get("email") as string) || "",
      phone: (data.get("phone") as string) || undefined,
      startDate: startDate,
      endDate: endDate,
      pickup: (data.get("pickup") as string) || "",
      adults: (data.get("adults") as string) || "",
      children: (data.get("children") as string) || "0",
      vehicle: (data.get("vehicle") as string) || "",
      currency: (data.get("currency") as string) || undefined,
      notes: (data.get("notes") as string) || undefined,
    });
  };

  const reasons = [
    {
      num: "01",
      title: "Statligt certifierade förare",
      desc: "Alla våra förare har officiella Sri Lanka Tourist Driver- eller Chauffeur Guide Driver-licenser. Professionellt utbildade, säkerhetsfokuserade och högt rankade av tidigare kunder.",
      svgPath: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2zm0 4l6 3.27V12c0 3.79-2.58 7.33-6 8.93-3.42-1.6-6-5.14-6-8.93V9.27L12 6z",
    },
    {
      num: "02",
      title: "Fullt stöd på engelska",
      desc: "Från första förfrågan till sista avlämningen finns vårt engelsktalande team till hands för att hjälpa till. Inga språkbarriärer – bara smidig kommunikation under hela din resa.",
      svgPath: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
    },
    {
      num: "03",
      title: "Helt privat charter",
      desc: "Till skillnad från gruppresor är ditt fordon och din förare exklusivt dina. Bestäm ditt eget schema, välj dina stopp och res helt på dina egna villkor.",
      svgPath: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    },
    {
      num: "04",
      title: "Expert på lokal kunskap",
      desc: "Våra chaufförsguider brinner för Sri Lankas historia, kultur och kök. De tar dig bortom guideboken till dolda pärlor och autentiska upplevelser.",
      svgPath: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z",
    },
    {
      num: "05",
      title: "Rätt fordon för varje grupp",
      desc: "Från par till stora familjegrupper på 10 personer, vi matchar det perfekta fordonet till din gruppstorlek – vilket garanterar komfort även på långresor över ön.",
      svgPath: "M17 5H3c-1.1 0-2 .9-2 2v9h2c0 1.65 1.34 3 3 3s3-1.35 3-3h5.5c0 1.65 1.34 3 3 3s3-1.35 3-3H23v-5l-6-6zM3 11V7h4v4H3zm3 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7-6.5H9V7h4v4zm4.5 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM15 11V7h1l4 4h-5z",
    },
    {
      num: "06",
      title: "Betrodd av europeiska resenärer",
      desc: "Med över 400 genomförda charterresor och ett genomsnittligt nöjdhetsbetyg på 4,9 är SLTCS det föredragna valet för brittiska och europeiska besökare som utforskar Sri Lanka.",
      svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    },
  ];

  return (
    <section id="contact" style={{ background: "#faf7f2", padding: "100px 0" }}>
      <div className="container">
        {/* 2-column grid: left = form, right = why cards */}
        <div className="contact-why-grid">
          {/* ── LEFT: Contact Form ─────────────────────────────────────────── */}
          <div>
            <div className="section-eyebrow">KONTAKT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, margin: "0 0 16px" }}>
              Börja planera<br />ditt äventyr på<br />Sri Lanka
            </h2>
            <p style={{ color: "#4a4a4a", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "8px" }}>
              Berätta om dina resdatum, gruppstorlek och preferenser – vi svarar med en skräddarsydd resplan och offert inom 24 timmar.
            </p>
            <p style={{ color: "#4a4a4a", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "24px" }}>
              Fyll i formuläret och skicka in. Vi svarar vanligtvis inom 24 timmar.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="name">FULLSTÄNDIGT NAMN *</label>
                  <input type="text" id="name" name="name" placeholder="t.ex. James Smith" required />
                </div>
                <div className="form-group full">
                  <label htmlFor="country">LAND *</label>
                  <select id="country" name="country" required value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="">— Välj ditt land —</option>
                    <option value="United Kingdom">Storbritannien</option>
                    <option value="United States">USA</option>
                    <option value="France">Frankrike</option>
                    <option value="Germany">Tyskland</option>
                    <option value="Netherlands">Nederländerna</option>
                    <option value="Spain">Spanien</option>
                    <option value="Italy">Italien</option>
                    <option value="Australia">Australien</option>
                    <option value="China">Kina</option>
                    <option value="India">Indien</option>
                    <option value="Other">Annat</option>
                  </select>
                </div>
                {country === "Other" && (
                  <div className="form-group full">
                    <label htmlFor="countryOther">ANGE DITT LAND *</label>
                    <input type="text" id="countryOther" name="countryOther" placeholder="Ange ditt land" required />
                  </div>
                )}
                <div className="form-group full">
                  <label htmlFor="email">E-POSTADRESS *</label>
                  <input type="email" id="email" name="email" placeholder="din@email.com" required />
                </div>
                <div className="form-group full">
                  <label htmlFor="phone">TELEFONNUMMER</label>
                  <input type="tel" id="phone" name="phone" placeholder="+44 7700 000000" />
                </div>
                <div className="form-group">
                  <label htmlFor="startDate">STARTDATUM *</label>
                  <DatePicker id="startDate" name="startDate" value={startDate} onChange={setStartDate} required />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">SLUTDATUM *</label>
                  <DatePicker id="endDate" name="endDate" value={endDate} onChange={setEndDate} required />
                </div>
                <div className="form-group full">
                  <label htmlFor="pickup">CHARTER STARTPLATS *</label>
                  <select id="pickup" name="pickup" required>
                    <option value="">— Välj plats —</option>
                    <option value="Colombo Airport (BIA)">Colombo Airport (BIA)</option>
                    <option value="Colombo City">Colombo City</option>
                    <option value="Negombo">Negombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Sigiriya">Sigiriya</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Galle">Galle</option>
                    <option value="Other (please specify in notes)">Annat (vänligen specificera i anteckningar)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="adults">ANTAL VUXNA *</label>
                  <select id="adults" name="adults" required>
                    <option value="">Välj</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="7+">7 eller fler</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="children">ANTAL BARN</label>
                  <select id="children" name="children">
                    <option value="0">0</option>
                    {[1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="4+">4 eller fler</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="vehicle">FORDONSTYP *</label>
                  <select id="vehicle" name="vehicle" required>
                    <option value="">— Välj fordon —</option>
                    <option value="Sedan (up to 3 pax)">Sedan (upp till 3 passagerare)</option>
                    <option value="Van (up to 6 pax)">Van (upp till 6 passagerare)</option>
                    <option value="Large Van (up to 10 pax)">Stor Van (upp till 10 passagerare)</option>
                    <option value="Let us recommend">Låt oss rekommendera</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="currency">ÖNSKAD VALUTA</label>
                  <select id="currency" name="currency">
                    <option value="">— Välj valuta —</option>
                    <option value="GBP">GBP (£ Brittiskt pund)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="USD">USD ($ Amerikansk dollar)</option>
                    <option value="AUD">AUD (A$ Australisk dollar)</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="notes">DESTINATIONER / RESPLANSMEMORANDUM</label>
                  <textarea id="notes" name="notes" placeholder="Vänligen lista eventuella destinationer, attraktioner eller särskilda önskemål du har i åtanke." />
                </div>
              </div>
              {submitError && (
                <div className="form-error" style={{ color: "#e55", marginBottom: "12px", padding: "10px 14px", background: "rgba(220,50,50,0.1)", borderRadius: "6px", border: "1px solid rgba(220,50,50,0.3)" }}>
                  {submitError}
                </div>
              )}
              
              <div style={{ 
                marginBottom: "16px", 
                padding: "12px 16px", 
                background: "rgba(201, 168, 76, 0.85)", 
                borderRadius: "6px", 
                borderLeft: "4px solid #9e7e2d",
                fontSize: "0.88rem",
                color: "#000000",
                lineHeight: "1.5",
                fontWeight: "500"
              }}>
                <strong>Observera:</strong> Efter att du har skickat din förfrågan kommer vår ansvariga personal att kontakta och svara dig på <strong>engelska</strong>.
              </div>

              <button
                type="submit"
                className={`form-submit-btn${isSubmitting ? " loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Skickar…" : "Skicka förfrågan"}
              </button>
              <p className="form-note">
                Genom att skicka in detta formulär godkänner du vår{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Integritetspolicy</a>.
                Inget åtagande krävs.
              </p>
            </form>
          </div>

          {/* ── RIGHT: Why SLTCS ──────────────────────────────────────────── */}
          <div id="why">
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "1px", background: "#c9a84c" }} />
                <span style={{ color: "#c9a84c", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>VARFÖR SLTCS</span>
                <div style={{ width: "40px", height: "1px", background: "#c9a84c" }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#c9a84c"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
                6 anledningar varför resenärer<br />väljer <span style={{ color: "#c9a84c" }}>SLTCS</span>
              </h2>
            </div>
            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reasons.map((r) => (
                <div
                  key={r.num}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    background: "#f9f5ee",
                    border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(201,168,76,0.15)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.25)"; }}
                >
                  {/* Icon + number */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", padding: "18px 16px", minWidth: "76px", borderRight: "1px solid rgba(201,168,76,0.15)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f0e8d0", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a3a1a"><path d={r.svgPath} /></svg>
                    </div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>{r.num}</span>
                  </div>
                  {/* Title + desc */}
                  <div style={{ padding: "18px 20px", flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.3 }}>{r.title}</h3>
                    <p style={{ fontSize: "0.8rem", color: "#4a4a4a", lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Concerns ────────// ─── Concerns ─────────────────────────────────────────────
function Concerns() {
  const concerns = [
    { label: "Språkbarriärer", svgPath: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" },
    { label: "Att ta sig runt på egen hand", svgPath: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" },
    { label: "Att bli överdebiterad", svgPath: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" },
    { label: "Säkerhetsbekymmer med taxi", svgPath: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2zm0 4l6 3.27V12c0 3.79-2.58 7.33-6 8.93-3.42-1.6-6-5.14-6-8.93V9.27L12 6z" },
    { label: "Att hitta rätt platser", svgPath: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
    { label: "Att hålla tidsschemat", svgPath: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" },
  ];
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="concerns" style={{ background: "#0d0f13", padding: "100px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#c9a84c" }} />
            <span style={{ color: "#c9a84c", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>DINA BEKYMMER</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0 }}>
            Orolig för att resa<br />på <span style={{ color: "#c9a84c" }}>Sri Lanka?</span>
          </h2>
        </div>

        {/* Concern tiles */}
        <div className="concerns-inline-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
          {concerns.map((c) => (
            <div
              key={c.label}
              style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", padding: "18px 20px", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.3)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(201,168,76,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#c9a84c" style={{ flexShrink: 0, opacity: 0.8 }}><path d={c.svgPath} /></svg>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* CTA bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.04) 100%)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", padding: "36px 48px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{ flexShrink: 0, width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#c9a84c"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2zm0 4l6 3.27V12c0 3.79-2.58 7.33-6 8.93-3.42-1.6-6-5.14-6-8.93V9.27L12 6z" /></svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>SLTCS löser alla dessa bekymmer</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: "560px" }}>Din dedikerade privata förare hanterar allt – navigering, kommunikation, schemaläggning och lokal expertis. Allt du behöver göra är att luta dig tillbaka och njuta av resan.</p>
            </div>
          </div>
          <button
            onClick={() => scrollTo("contact")}
            style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "10px", background: "#c9a84c", border: "none", color: "#0a0c0f", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 36px", borderRadius: "3px", cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            Fråga nu — Det är gratis
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Planss ─────────────────────────────────────────────
function Plans() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="plans">
      <div className="container">
        <div className="section-eyebrow">VÅRA PLANER</div>
        <h2 className="section-title">Välj den plan<br />som passar dig bäst</h2>
        <p className="section-sub">Oavsett om du reser med en budget eller söker en premiumupplevelse, har vi en plan skräddarsydd för dina behov.</p>
        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-tier">BRONS</div>
            <h3>Bronsplan</h3>
            <p>För budgetmedvetna resenärer som behöver pålitlig transport.</p>
            <ul className="plan-features">
              <li>Arrangemang med praktikantförare</li>
              <li>Flygplatstransfer &amp; punkt-till-punkt-transfer</li>
              <li>Engelsktalande lokal koordinator</li>
              <li>Ren, luftkonditionerad bil</li>
            </ul>
            <a href="#contact" className="plan-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Visa detaljer</a>
          </div>
          <div className="plan-card featured">
            <div className="plan-badge-popular">Mest populär</div>
            <div className="plan-tier">SILVER</div>
            <h3>Silverplan</h3>
            <p>Den bästa balansen mellan värde och kvalitet – vårt mest populära val.</p>
            <ul className="plan-features">
              <li>Regeringscertifierad turistförare eller högre</li>
              <li>Sällskap &amp; kommentarer vid sevärdheter</li>
              <li>Engelsktalande lokal koordinator</li>
              <li>Safari- &amp; aktivitetsbokningar arrangeras</li>
              <li>Guidetjänster ingår utan extra kostnad</li>
            </ul>
            <a href="#contact" className="plan-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Visa detaljer</a>
          </div>
          <div className="plan-card">
            <div className="plan-tier">GULD</div>
            <h3>Guldplan</h3>
            <p>För resenärer som kräver den allra bästa Sri Lanka-upplevelsen.</p>
            <ul className="plan-features">
              <li>Garanterad topprankad chaufförsguide</li>
              <li>Heldagssällskap &amp; expertkommentarer</li>
              <li>Engelsktalande lokal koordinator</li>
              <li>Dubbel supportstruktur för fullständig trygghet</li>
              <li>Premium concierge-service</li>
            </ul>
            <a href="#contact" className="plan-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Visa detaljer</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Preview ─────────────────────────────────────────────────────────
type VehicleKeyHP = "sedan" | "van" | "bigvan";
type TierKeyHP = "bronze" | "silver" | "gold";
type CurrencyKeyHP = "USD" | "GBP" | "EUR" | "AUD";

const CURRENCY_SYMBOLS_HP: Record<CurrencyKeyHP, string> = { USD: "$", GBP: "£", EUR: "€", AUD: "A$" };

const PRICES_HP: Record<CurrencyKeyHP, Record<TierKeyHP, Record<VehicleKeyHP, number[]>>> = {
  USD: {
    bronze: { sedan: [270,340,410,480,520,560,600,680,750,830,900,980,1050,1130,1200,1280,1350,1430,1500], van: [330,410,500,580,630,670,720,820,900,1000,1080,1180,1260,1360,1440,1540,1620,1720,1800], bigvan: [390,480,590,680,740,780,840,950,1050,1160,1260,1370,1470,1580,1680,1790,1890,2000,2100] },
    silver: { sedan: [310,400,490,580,640,700,760,860,950,1050,1140,1240,1330,1430,1520,1620,1710,1810,1900], van: [370,470,580,680,750,810,880,1000,1100,1220,1320,1440,1540,1660,1760,1880,1980,2100,2200], bigvan: [430,540,670,780,860,920,1000,1130,1250,1380,1500,1630,1750,1880,2000,2130,2250,2380,2500] },
    gold:   { sedan: [350,460,570,680,760,840,920,1040,1150,1270,1380,1500,1610,1730,1840,1960,2070,2190,2300], van: [410,530,660,780,870,950,1040,1180,1300,1440,1560,1700,1820,1960,2080,2220,2340,2480,2600], bigvan: [470,600,750,880,980,1060,1160,1310,1450,1600,1740,1890,2030,2180,2320,2470,2610,2760,2900] },
  },
  GBP: {
    bronze: { sedan: [200,240,290,340,370,400,420,480,530,590,640,690,740,800,850,910,950,1010,1060], van: [250,290,360,420,450,480,510,570,640,710,770,830,890,960,1030,1090,1150,1210,1280], bigvan: [290,350,430,490,540,570,600,680,760,840,920,980,1060,1140,1220,1300,1360,1440,1520] },
    silver: { sedan: [230,290,350,420,460,510,540,620,680,760,820,890,950,1030,1090,1170,1220,1300,1360], van: [280,340,420,500,540,590,630,710,790,880,950,1030,1100,1190,1270,1350,1420,1500,1580], bigvan: [320,400,490,570,630,680,720,820,910,1010,1100,1180,1270,1370,1460,1560,1630,1730,1820] },
    gold:   { sedan: [260,340,410,500,550,620,660,760,830,930,1000,1090,1160,1260,1330,1430,1490,1590,1660], van: [310,390,480,580,630,700,750,850,940,1050,1130,1230,1310,1420,1510,1610,1690,1790,1880], bigvan: [350,450,550,650,720,790,840,960,1060,1180,1280,1380,1480,1600,1700,1820,1900,2020,2120] },
  },
  EUR: {
    bronze: { sedan: [230,280,350,400,440,460,500,560,620,680,740,810,870,930,990,1050,1120,1180,1240], van: [280,340,420,480,530,560,600,680,750,830,900,980,1050,1130,1200,1280,1350,1430,1500], bigvan: [330,400,500,570,620,650,700,790,880,970,1060,1140,1230,1320,1410,1500,1580,1670,1760] },
    silver: { sedan: [270,330,420,490,550,590,640,720,800,880,960,1040,1120,1200,1280,1360,1440,1520,1600], van: [320,390,490,570,640,690,740,840,930,1030,1120,1210,1300,1400,1490,1590,1670,1770,1860], bigvan: [370,450,570,660,730,780,840,950,1060,1170,1280,1370,1480,1590,1700,1810,1900,2010,2120] },
    gold:   { sedan: [310,380,490,580,660,720,780,880,980,1080,1180,1270,1370,1470,1570,1670,1760,1860,1960], van: [360,440,560,660,750,820,880,1000,1110,1230,1340,1440,1550,1670,1780,1900,1990,2110,2220], bigvan: [410,500,640,750,840,910,980,1110,1240,1370,1500,1600,1730,1860,1990,2120,2220,2350,2480] },
  },
  AUD: {
    bronze: { sedan: [380,480,580,680,730,790,840,960,1050,1170,1260,1380,1470,1590,1680,1800,1890,2010,2100], van: [470,580,700,820,890,940,1010,1150,1260,1400,1520,1660,1770,1910,2020,2160,2270,2410,2520], bigvan: [550,680,830,960,1040,1100,1180,1330,1470,1630,1770,1920,2060,2220,2360,2510,2650,2800,2940] },
    silver: { sedan: [440,560,690,820,900,980,1070,1210,1330,1470,1600,1740,1870,2010,2130,2270,2400,2540,2660], van: [520,660,820,960,1050,1140,1240,1400,1540,1710,1850,2020,2160,2330,2470,2640,2780,2940,3080], bigvan: [610,760,940,1100,1210,1290,1400,1590,1750,1940,2100,2290,2450,2640,2800,2990,3150,3340,3500] },
    gold:   { sedan: [490,650,800,960,1070,1180,1290,1460,1610,1780,1940,2100,2260,2430,2580,2750,2900,3070,3220], van: [580,750,930,1100,1220,1330,1460,1640,1820,2020,2190,2380,2550,2750,2920,3110,3280,3480,3640], bigvan: [660,840,1050,1240,1380,1490,1630,1840,2030,2240,2440,2650,2850,3060,3250,3460,3660,3870,4060] },
  },
};

const DAYS_HP = Array.from({ length: 19 }, (_, i) => i + 2);

const TIERS_HP: { key: TierKeyHP; label: string; badge?: string; color: string }[] = [
  { key: "bronze", label: "Bronsplan", color: "#cd7f32" },
  { key: "silver", label: "Silverplan", badge: "Mest populär", color: "#c9a84c" },
  { key: "gold",   label: "Guldplan",   color: "#d4af37" },
];

const VEHICLES_HP: { key: VehicleKeyHP; label: string; capacity: string }[] = [
  { key: "sedan",  label: "Sedan",   capacity: "1–3 personer" },
  { key: "van",    label: "Van",     capacity: "3–6 personer" },
  { key: "bigvan", label: "Stor Van", capacity: "6–9 personer" },
];

function PriceCard({ tier, currency }: { tier: (typeof TIERS_HP)[number]; currency: CurrencyKeyHP }) {
  const [vehicle, setVehicle] = useState<VehicleKeyHP>("sedan");
  const sym = CURRENCY_SYMBOLS_HP[currency];
  const prices = PRICES_HP[currency][tier.key][vehicle];
  return (
    <div style={{ background: "#ffffff", border: `1.5px solid ${tier.color}50`, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}08)`, borderBottom: `1px solid ${tier.color}30`, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ background: tier.color, color: "#000", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase" }}>{tier.key.toUpperCase()}</span>
          {tier.badge && <span style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", fontSize: "0.6rem", fontWeight: 600, padding: "2px 7px", borderRadius: "20px", textTransform: "uppercase" }}>{tier.badge}</span>}
        </div>
        <h3 style={{ color: "#1a1a1a", fontSize: "1rem", fontWeight: 700, margin: 0 }}>{tier.label}</h3>
      </div>
      {/* Vehicle Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e8e2d8", background: "#f9f5ee" }}>
        {VEHICLES_HP.map((v) => (
          <button key={v.key} onClick={() => setVehicle(v.key)} style={{ flex: 1, padding: "8px 4px", background: "none", border: "none", borderBottom: vehicle === v.key ? `2px solid ${tier.color}` : "2px solid transparent", color: vehicle === v.key ? tier.color : "#888", fontSize: "0.7rem", fontWeight: vehicle === v.key ? 600 : 400, cursor: "pointer", transition: "all 0.2s", textAlign: "center", lineHeight: 1.3 }}>
            <div>{v.label}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>{v.capacity}</div>
          </button>
        ))}
      </div>
      {/* Price Table */}
      <div style={{ flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 14px", textAlign: "left", color: "#888", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: "#f4f0e8" }}>Dagar</th>
              <th style={{ padding: "8px 14px", textAlign: "right", color: "#888", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: "#f4f0e8" }}>Pris (inkl. moms)</th>
            </tr>
          </thead>
          <tbody>
            {DAYS_HP.map((day, idx) => (
              <tr key={day} style={{ borderBottom: "1px solid #ede8e0", background: idx % 2 === 0 ? "transparent" : "#faf7f2" }}>
                <td style={{ padding: "8px 14px", color: "#4a4a4a", fontSize: "0.82rem" }}>{day} dagar</td>
                <td style={{ padding: "8px 14px", textAlign: "right", color: "#1a1a1a", fontSize: "0.9rem", fontWeight: 600 }}>{sym}{prices[idx].toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PricingPreview() {
  const [currency, setCurrency] = useState<CurrencyKeyHP>("USD");
  return (
    <section id="pricing" style={{ background: "#faf7f2", padding: "80px 0" }}>
      <div className="container">
        <div className="section-eyebrow">TRANSPARENT PRISSÄTTNING</div>
        <h2 className="section-title">Fast prislista</h2>
        <p className="section-sub" style={{ marginBottom: "32px" }}>Alla priser är inklusive moms och gäller engelsktalande förare. Välj önskad valuta och fordonstyp.</p>

        {/* Currency Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {(["USD", "GBP", "EUR", "AUD"] as CurrencyKeyHP[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)} style={{ padding: "8px 20px", background: currency === c ? "rgba(201,168,76,0.15)" : "#ffffff", border: currency === c ? "1.5px solid rgba(201,168,76,0.6)" : "1.5px solid #d1ccc4", borderRadius: "6px", color: currency === c ? "#c9a84c" : "#4a4a4a", fontSize: "0.85rem", fontWeight: currency === c ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              {CURRENCY_SYMBOLS_HP[c]} {c}
            </button>
          ))}
        </div>

        {/* Note */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", padding: "12px 18px", marginBottom: "28px" }}>
          <p style={{ color: "#4a4a4a", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#c9a84c" }}>Obs:</strong> Ytterligare avgifter kan tillkomma om den totala sträckan överskrider den standardiserade uppskattningen, eller om upphämtnings-/avlämningsplatsen ligger utanför flygplatsområdet.
          </p>
        </div>

        {/* Plan Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {TIERS_HP.map((tier) => <PriceCard key={tier.key} tier={tier} currency={currency} />)}
        </div>

        {/* Link to full price page */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/price" className="btn-outline" style={{ display: "inline-block" }}>Visa hela prislistan →</a>
        </div>
      </div>
    </section>
  );
}

// ─── Itineraries ──────────────────────────────────────────────────────────────
type DayItem = { day: string; title: string; desc: string };
type Itinerary = {
  id: string;
  label: string;
  title: string;
  duration: string;
  focus: string;
  highlights: string;
  idealFor: string;
  days: DayItem[];
};

const ITINERARIES: Itinerary[] = [
  {
    id: "4n5d",
    label: "4N/5D",
    title: "4 nätter / 5 dagar",
    duration: "5 dagar",
    focus: "Kulturella höjdpunkter",
    highlights: "Sigiriya, Kandy, Nuwara Eliya, Galle",
    idealFor: "Förstagångsbesökare med ett pressat schema",
    days: [
      { day: "Dag 1", title: "Ankomst → Sigiriya", desc: "Ankomst till Colombo flygplats. Kör till Sigiriya via Dambulla grottempel (UNESCO). Checka in på ditt hotell i Sigiriya-området." },
      { day: "Dag 2", title: "Sigiriya Lejonklippan", desc: "Tidig morgonbestigning av Sigiriya Lejonklippan (UNESCO). Eftermiddagen fri eller valfri jeepsafari i Minneriya nationalpark." },
      { day: "Dag 3", title: "Kandy — Tandens tempel", desc: "Kör till Kandy via en kryddträdgård i Matale. Besök Sri Dalada Maligawa (Tandens tempel) (UNESCO). Kvällsföreställning med Kandyan-dans." },
      { day: "Dag 4", title: "Nuwara Eliya → Galle", desc: "Naturskön körning genom böljande teplantager. Upplev teplockning. Fortsätt till Galle Fort (UNESCO) på sydkusten." },
      { day: "Dag 5", title: "Galle Fort → Avresa", desc: "Morgonutforskning av Galle Forts holländska koloniala vallar, butiker och havsutsikt. Transfer till Colombo flygplats." },
    ],
  },
  {
    id: "5n6d",
    label: "5N/6D",
    title: "5 nätter / 6 dagar",
    duration: "6 dagar",
    focus: "Kultur + Natur",
    highlights: "Sigiriya, Kandy, Ella, Galle",
    idealFor: "Par och små grupper",
    days: [
      { day: "Dag 1", title: "Ankomst → Sigiriya", desc: "Ankomst till Colombo flygplats. Kör till Sigiriya via Dambulla grottempel. Övernattning i Sigiriya-området." },
      { day: "Dag 2", title: "Sigiriya Lejonklippan & Safari", desc: "Bestig Sigiriya Lejonklippan på morgonen. Eftermiddagssafari i Minneriya eller Kaudulla nationalpark." },
      { day: "Dag 3", title: "Kandy sightseeing", desc: "Res till Kandy via Matale kryddträdgård. Besök Sri Dalada Maligawa (Tandens tempel) och Peradeniya botaniska trädgårdar." },
      { day: "Dag 4", title: "Nuwara Eliya & Ella", desc: "Kör genom fantastiska tehögland. Besök en tefabrik, fortsätt sedan till Ella för den berömda Nine Arches Bridge." },
      { day: "Dag 5", title: "Yala nationalpark safari", desc: "Heldagsjeepsafari i Yala nationalpark — hem för leoparder, elefanter och exotiskt fågelliv." },
      { day: "Dag 6", title: "Galle Fort → Avresa", desc: "Morgonbesök vid Galle Fort (UNESCO). Transfer till Colombo flygplats för avresa." },
    ],
  },
  {
    id: "6n7d",
    label: "6N/7D",
    title: "6 nätter / 7 dagar",
    duration: "7 dagar",
    focus: "Hel ö-upplevelse",
    highlights: "Sigiriya, Kandy, Te-tåg, Yala, Galle",
    idealFor: "Familjer och grundliga upptäcktsresande",
    days: [
      { day: "Dag 1", title: "Ankomst → Kulturella triangeln", desc: "Ankomst till BIA. Kör norrut via Dambulla grottempel till Sigiriya / Kandalama-området." },
      { day: "Dag 2", title: "Sigiriya & Polonnaruwa", desc: "Bestig Sigiriya Lejonklippan. Eftermiddagsbesök i den antika staden Polonnaruwa (UNESCO världsarv)." },
      { day: "Dag 3", title: "Kandy", desc: "Kör till Kandy via en kryddträdgård. Besök Sri Dalada Maligawa (Tandens tempel) och njut av en traditionell Kandyan-dansshow." },
      { day: "Dag 4", title: "Nuwara Eliya – Tehögländerna", desc: "Naturskön körning genom telandskapet. Upplev teplockning och afternoon tea på ett plantagehotell från kolonialtiden." },
      { day: "Dag 5", title: "Ella & Nine Arches Bridge", desc: "Åk med det ikoniska tetåget. Besök Nine Arches Bridge och Little Adam's Peak i Ella." },
      { day: "Dag 6", title: "Yala Nationalpark", desc: "Heldags jeepsafari i Yala – Sri Lankas främsta viltreservat. Leoparder, elefanter, krokodiler och mer." },
      { day: "Dag 7", title: "Galle Fort → Avresa", desc: "Förmiddag vid Galle Fort (UNESCO). Transfer till Colombo flygplats via Mirissa strand (valfritt stopp)." },
    ],
  },
  {
    id: "5to7d",
    label: "5–7 Dagar Kultur",
    title: "5 till 7 Dagar\nFokus på Kulturtriangeln",
    duration: "5–7 Dagar",
    focus: "UNESCO världsarv & Safari",
    highlights: "Sigiriya, Anuradhapura, Polonnaruwa, Kandy",
    idealFor: "Historie- & kulturintresserade",
    days: [
      { day: "Dag 1", title: "Flygplats → Dambulla grottempel → Sigiriya-området", desc: "Avresa från Colombo flygplats (ca 3–4 timmars körning). På vägen, besök Dambulla grottempel – en fantastisk UNESCO världsarvsplats uthuggen i en klippvägg. Checka in på Heritance Kandalama, ett arkitektoniskt mästerverk designat av Geoffrey Bawa." },
      { day: "Dag 2", title: "Sigiriya klippfästning & Minneriya Safari", desc: "Tidig morgonklättring av Sigiriya-klippan (UNESCO) – räkna med 2,5–3 timmar för tur och retur. Eftermiddags jeepsafari i Minneriya nationalpark, känd för sina elefantsamlingar. Återvänd till hotellet." },
      { day: "Dag 3", title: "Anuradhapura, forntida huvudstad", desc: "Utforska de vidsträckta UNESCO-listade ruinerna av Anuradhapura – Sri Lankas första forntida huvudstad. Besök det heliga Bodhiträdet, Ruwanwelisaya Stupa och andra anmärkningsvärda monument. Räkna med en hel dag för denna utspridda plats." },
      { day: "Dag 4", title: "Polonnaruwa & Pidurangala-klippan", desc: "Valfri morgonklättring av Pidurangala-klippan för spektakulära vyer över Sigiriya. Utforska sedan medeltidsstaden Polonnaruwa (UNESCO) – välbevarade tempel, palats och kolossala Buddha-statyer." },
      { day: "Dag 5", title: "Kandy via kryddträdgård", desc: "Kör till Kandy via en traditionell kryddträdgård i Matale. Besök Temple of the Sacred Tooth Relic (UNESCO). Njut av en Kandyan kulturell dansföreställning på kvällen." },
      { day: "Dag 6", title: "Colombo sightseeing & Ayurveda (valfritt)", desc: "Utforska Colombos koloniala arkitektur, livliga marknader och vattnet. Valfritt: checka in på ett Ayurveda-hotell i Negombo för att varva ner före avresa." },
      { day: "Dag 7", title: "Transfer till flygplatsen", desc: "Sista morgonen på egen hand. Transfer till Colombo flygplats (BIA) för ditt flyg hem." },
    ],
  },
  {
    id: "10to14d",
    label: "10 Dagar–2 Veckor",
    title: "10 Dagar till 2 Veckor\nKlassisk Förstagångsresa",
    duration: "10–14 Dagar",
    focus: "Komplett öupplevelse",
    highlights: "Sigiriya, Kandy, Tetåg, Yala, Galle, Strand",
    idealFor: "Förstagångsresenärer som vill ha den fullständiga Sri Lanka-upplevelsen",
    days: [
      { day: "Dag 1", title: "Flygplats → Dambulla grottempel → Sigiriya", desc: "Avresa från Colombo flygplats eller Negombo. Kör till Kulturtriangeln (ca 3 timmar). Stanna vid Dambulla grottempel för lunch och sightseeing. Checka in på Heritance Kandalama – ett hyllat Geoffrey Bawa-hotell beläget mitt i skog och sjö." },
      { day: "Dag 2", title: "Sigiriya-klippan & Anuradhapura", desc: "Morgonklättring av Sigiriya klippfästning (UNESCO). Transfer till den forntida huvudstaden Anuradhapura (1,5–2 timmar). Utforska det heliga Bodhiträdet, stupor och antika ruiner. Återvänd till hotellet." },
      { day: "Dag 3", title: "Kandy – Kryddträdgård & Tempel", desc: "Kör till Kandy via en kryddträdgård i Matale (ca 3 timmar). Besök Geragama tefabrik och Temple of the Sacred Tooth Relic (UNESCO). Kvällsföreställning med Kandyan-dans." },
      { day: "Dag 4", title: "Nuwara Eliya – Tehögländerna", desc: "Naturskön bergskörning till Nuwara Eliya genom böljande teplantager. Upplev teplockning och afternoon tea på ett kolonialt plantagehotell. Utforska den charmiga staden 'Lilla England'." },
      { day: "Dag 5", title: "Naturskönt tetåg – Nine Arches Bridge", desc: "Gå ombord på det ikoniska tetåget för en hisnande resa genom dimmiga berg. Fotografera den berömda Nine Arches Bridge. Ankomst till Ella." },
      { day: "Dag 6", title: "Ella sightseeing → Yala", desc: "Morgonvandring till Little Adam's Peak och Ella Rock för panoramautsikt. Eftermiddagstransfer till Yala-området (ca 2 timmar). Checka in på en safarilodge." },
      { day: "Dag 7", title: "Yala Nationalpark Safari → Mirissa Beach", desc: "Tidig morgon jeepsafari i Yala – Sri Lankas mest kända viltpark, hem till världens högsta täthet av leoparder. Eftermiddagstransfer till strandorten Mirissa." },
      { day: "Dag 8", title: "Galle Fort & Stranddag", desc: "Morgonbesök vid det UNESCO-listade Galle Fort – holländska koloniala vallar, butiker och havsutsikt. Eftermiddagen på egen hand på Mirissa strand. Valfri valskådning (säsongsbetonat)." },
      { day: "Dag 9", title: "Negombo – Ayurveda & Vila", desc: "Transfer till Negombo på västkusten (ca 3–4 timmar). Checka in på ett Ayurveda-hotell för traditionella behandlingar och avkoppling före avresa." },
      { day: "Dag 10", title: "Colombo sightseeing → Flygplats", desc: "Morgonutforskning av Colombo – Gangaramaya-templet, Pettah-marknaden och den livliga Galle Face Green. Transfer till Colombo flygplats (BIA) för ditt avresaflyg." },
    ],
  },
];

function Itineraries() {
  const [activeTab, setActiveTab] = useState("4n5d");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const active = ITINERARIES.find((it) => it.id === activeTab)!;

  return (
    <section id="courses">
      <div className="container">
        <div className="section-eyebrow">MODELLRESPLANER</div>
        <h2 className="section-title">Föreslagna resplaner</h2>
        <p className="section-sub">Osäker på var du ska börja? Bläddra bland våra utvalda exempelresplaner och använd dem som inspiration för din perfekta resa till Sri Lanka.</p>
        <div className="course-tabs">
          {ITINERARIES.map((it) => (
            <button key={it.id} className={`course-tab${activeTab === it.id ? " active" : ""}`} onClick={() => setActiveTab(it.id)}>
              {it.label}
            </button>
          ))}
        </div>
        <div className="course-panel active">
          <div className="course-overview">
            <div className="course-meta">
              <h3 style={{ whiteSpace: "pre-line" }}>{active.title}</h3>
              <div className="course-meta-item"><span className="course-meta-label">Varaktighet</span><span className="course-meta-value">{active.duration}</span></div>
              <div className="course-meta-item"><span className="course-meta-label">Fokus</span><span className="course-meta-value">{active.focus}</span></div>
              <div className="course-meta-item"><span className="course-meta-label">Höjdpunkter</span><span className="course-meta-value">{active.highlights}</span></div>
              <div className="course-meta-item"><span className="course-meta-label">Idealisk för</span><span className="course-meta-value">{active.idealFor}</span></div>
            </div>
            <div className="course-timeline">
              <h4>Dag-för-dag översikt</h4>
              {active.days.map((d, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-left">
                    <div className="timeline-day">{d.day}</div>
                    {i < active.days.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <h5>{d.title}</h5>
                    <p>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="courses-cta">
          <a href="#contact" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
            Visa alla planer &amp; få en offert
          </a>
        </div>
      </div>
    </section>
  );
}
// ─── Destinations ─────────────────────────────────────────────────────────────
function Destinations() {
  const dests = [
    { img: IMAGES.hero2, badge: "UNESCO världsarv", title: "Sigiriya Lejonklippan", desc: "Ett antikt himmelspalats beläget på en 200m vulkanisk klippa — Sri Lankas mest ikoniska landmärke." },
    { img: IMAGES.hero4, badge: "UNESCO världsarv", title: "Kandy — Tandens tempel", desc: "Det heliga templet som hyser reliken av Buddhas tand, beläget vid en lugn sjö." },
    { img: IMAGES.destNuwara, badge: "Te-land", title: "Nuwara Eliya — Tehögländerna", desc: "Rullande smaragdgröna teplantager på hög höjd. Upplev teplockning, fabriksvisningar och plantagehotell från kolonialtiden." },
    { img: IMAGES.hero5, badge: "UNESCO världsarv", title: "Galle Fort", desc: "En perfekt bevarad holländsk kolonial befäst stad på sydkusten, full av butiker och kaféer." },
    { img: IMAGES.destYala, badge: "Vildmarkssafari", title: "Yala nationalpark", desc: "Hem till världens högsta täthet av leoparder. Se även elefanter, krokodiler och hundratals fågelarter." },
    { img: IMAGES.destElla, badge: "Naturskön järnväg", title: "Ella — Nine Arches Bridge", desc: "Den ikoniska järnvägsviadukten från kolonialtiden omgiven av frodig djungel och teplantager. Ett måste att fotografera." },
  ];
  return (
    <section id="destinations">
      <div className="container">
        <div className="section-eyebrow">DESTINATIONER</div>
        <h2 className="section-title">Sri Lankas mest<br />ikoniska destinationer</h2>
        <p className="section-sub">Från UNESCO:s världsarv till orörda stränder, Sri Lanka rymmer en extraordinär variation av upplevelser på en kompakt ö.</p>
        <div className="destinations-grid">
          {dests.map((d, i) => (
            <div key={i} className="dest-card">
              <img src={d.img} alt={d.title} />
              <div className="dest-card-overlay">
                <div className="dest-card-badge">{d.badge}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Reviews ────────────────────────────────────────────────────────────────────────────────
function HomeRatingsMini({ driver, vehicle, operator }: { driver: number; vehicle: number; operator: number }) {
  const overall = Math.round(((driver + vehicle + operator) / 3) * 10) / 10;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "12px 16px", marginTop: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "0.72rem", color: "#888", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Totalt</span>
        <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#c9a84c", fontFamily: "'Playfair Display', serif" }}>{overall.toFixed(1)}</span>
        <span style={{ color: "#c9a84c", fontSize: "0.85rem", letterSpacing: "1px" }}>
          {[1,2,3,4,5].map(i => {
            if (overall >= i) return <span key={i} style={{ opacity: 1 }}>&#9733;</span>;
            if (overall >= i - 0.5) return <span key={i} style={{ opacity: 0.6 }}>&#9733;</span>;
            return <span key={i} style={{ opacity: 0.2 }}>&#9733;</span>;
          })}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {([{ label: "Förare", score: driver }, { label: "Fordon", score: vehicle }, { label: "Operatör", score: operator }] as { label: string; score: number }[]).map(({ label, score }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.72rem", color: "#888", width: "56px", flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: "5px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(score / 5) * 100}%`, background: "linear-gradient(90deg, #c9a84c, #e8c96a)", borderRadius: "3px" }} />
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#c9a84c", width: "24px", textAlign: "right" }}>{score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reviews() {
  const [slide, setSlide] = useState(0);
  const reviews = [
    {
      photo: "/manus-storage/review1_r_family_eranga_a3545b4c.png",
      photoPosition: "center center",
      name: "Familjen R",
      pax: "4 passagerare",
      period: "Augusti 2025",
      driver: "Eranga",
      ratings: { driver: 5.0, vehicle: 5.0, operator: 5.0 },
      quote: "Professionell service från första förfrågan till sista avlämningen – vi kände oss helt trygga hela tiden.",
      body: "Från förbokning till resdagen svarade teamet snabbt och tydligt. Prissättning och resplanering förklarades på ett sätt som inte lämnade utrymme för osäkerhet. På dagen körde Eranga med omsorg och lugn, och dirigerade om smidigt runt trafikstockningar för att hålla oss i tid. Hans djupa kunskap om Anuradhapura, Dambulla, Sigiriya och Polonnaruwa gav oss en rik historisk grund för att förstå detta anmärkningsvärda land. Vi anser oss lyckligt lottade att ha haft honom som både förare och guide.",
    },
    {
      photo: "/manus-storage/review_lasith_family_ae2d2464.jpeg",
      name: "Familjen R",
      pax: "3 passagerare",
      period: "Mars 2026",
      driver: "Lasith",
      ratings: { driver: 5.0, vehicle: 4.5, operator: 5.0 },
      quote: "Lasith var oändligt tålmodig med våra barn och fick varje ögonblick av resan att kännas enkel.",
      body: "Att ha Lasith med oss var en genuin lyckträff. Hans varma sätt med barnen fick oss alla att känna oss bekväma, och hans tydliga engelska gjorde att inget någonsin gick förlorat i översättningen. Punktlig, full av tankeväckande förslag på sevärdheter och lokala restauranger, och konsekvent lugn bakom ratten – han var allt vi kunde ha önskat oss. (Vi kommer förmodligen att hoppa över den vägen mellan Passikudah och Sigiriya nästa gång, dock!) Vi rekommenderar honom utan tvekan: uppmärksam, kunnig och helt pålitlig. Om du någonsin är i Europa, Lasith – första omgången bjuder vi på.",
    },
    {
      photo: "/manus-storage/review_ranjana_new_2b654dea.png",
      name: "Paret H",
      pax: "2 passagerare",
      period: "November 2025",
      driver: "Ranjana",
      ratings: { driver: 5.0, vehicle: 4.5, operator: 4.5 },
      quote: "Ranjana förvandlade vår Sri Lanka-resa till något långt bortom vanlig sightseeing.",
      body: "Vi bokade en privat charter för två och fick Ranjana – ett beslut vi inte kunde vara gladare över. Han körde med ett tyst självförtroende, navigerade bergsvägar och livliga stadskärnor med samma lätthet. Det som stod ut mest var hans genuina entusiasm: han föreslog en forsränningsupplevelse som vi inte hade planerat, och det blev en av resans höjdpunkter. Hans lokala kunskap om dolda utsiktsplatser, autentiska matställen och kulturella seder berikade varje dag. Ranjana är den typ av guide som får dig att känna dig som en gäst i landet, inte bara en turist som passerar igenom.",
    },
    {
      photo: "/manus-storage/review_priyantha_couple_e0a47aaf.png",
      name: "Paret A&S",
      pax: "2 passagerare",
      period: "Augusti 2025",
      driver: "Priyanth",
      ratings: { driver: 5.0, vehicle: 4.5, operator: 5.0 },
      quote: "Priyanth fick sex dagar att kännas som en resa med en betrodd vän snarare än en anställd chaufför.",
      body: "Med start från Colombo flygplats guidade Priyanth oss genom Sigiriya, Kandy, Nuwara Eliya och Galle under sex dagar. Han var punktlig och körde försiktigt hela tiden, och frågade alltid hur vi mådde – något vi verkligen uppskattade på längre sträckor. Hans glada sällskap gjorde varje transfer trevlig, och hans insikter i Sri Lankas historia och kultur gav ett verkligt djup till det vi såg. Han tog oss också till en hisnande utsiktsplats som inte fanns med i vår ursprungliga plan, och introducerade oss för lokala restauranger som helt enkelt var enastående. Vi skulle gärna resa med honom igen vid vårt nästa besök på Sri Lanka.",
    },
    {
      photo: "/manus-storage/review5_t_couple_indika_519f1510.png",
      name: "Paret T",
      pax: "2 passagerare",
      period: "Oktober 2025",
      driver: "Indika",
      ratings: { driver: 5.0, vehicle: 5.0, operator: 5.0 },
      quote: "Tack vare Indika blev vår resa inte bara sightseeing – den blev en riktigt färgstark, oförglömlig resa.",
      body: "Vi reste som ett par från Negombo genom Sigiriya, Kandy, Nuwara Eliya och Mirissa under fem dagar. Redan första morgonen – som råkade vara en födelsedag – dök en tårta upp vid frukosten, diskret ordnad av Indika via hotellet. Han gav oss också en liten elefantfigur som present. Vi blev genuint rörda. Under hela resan var han en stadig, lugnande närvaro: han informerade oss före varje plats, hanterade tidiga starter utan klagomål, rekommenderade restauranger han personligen besöker (alla var utmärkta), och åkte till och med tåg med oss för att hålla oss säkra i folkmassorna. När något verkade för dyrt sa han helt enkelt: 'Låt oss hoppa över det' – den ärligheten gjorde att vi litade på honom fullständigt. Att träffa Indika var utan tvekan en del av det som gjorde denna resa perfekt.",
    },
    {
      photo: "/manus-storage/review_dfamily_chamil_9214e24c.png",
      name: "Familjen D",
      pax: "5 passagerare",
      period: "December 2025",
      driver: "Chamil",
      ratings: { driver: 5.0, vehicle: 5.0, operator: 4.5 },
      quote: "Trots att vi var tvungna att helt omorganisera vår resplan efter en cyklon, gjorde Chamil det till en oförglömlig resa.",
      body: "Vi reste som tre generationer – mor- och farföräldrar, föräldrar och ett barn – strax efter att en cyklon hade stört ön. Chamil samlade ständigt den senaste informationen om vägförhållanden och säkerhet, och föreslog alltid de bästa tillgängliga rutterna med våra preferenser i åtanke. När vi behövde avboka hotell och tågbokningar och ordna nya med kort varsel, var han där och hjälpte oss varje steg på vägen. Han följde med oss på Sigiriya Rock-klättringen och safarin, vilket gav oss en enorm trygghet. Hans uppmärksamhet på vårt barn var särskilt rörande – när tröttheten slog till vid ett olämpligt tillfälle, kände vi oss helt bekväma med att lämna vårt barn i hans vård. Han tog oss också till lokala restauranger som bara lokalbefolkningen skulle känna till, och varje måltid var en uppenbarelse. Chamils värme, snabba tänkande och naturliga omtänksamhet vann över varje medlem i vår familj – både barn och vuxna. Vi ser redan fram emot vår nästa resa till Sri Lanka, och vi kommer absolut att be om Chamil igen.",
    },
  ];

  // Group reviews into pairs for 2-per-slide display
  const totalSlides = Math.ceil(reviews.length / 2);
  const prevSlide = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setSlide((s) => (s + 1) % totalSlides);

  const visibleReviews = reviews.slice(slide * 2, slide * 2 + 2);

  return (
    <section id="reviews" style={{ background: "var(--dark2)" }}>
      <div className="container">
        <div className="section-eyebrow">KUNDRÖSTER</div>
        <h2 className="section-title">Vad våra gäster säger</h2>
        <p className="section-sub">Verkliga recensioner från resenärer som har utforskat Sri Lanka med SLTCS.</p>
        <div className="reviews-slider">
          <div className="reviews-slide-row">
            {visibleReviews.map((r, i) => (
              <div key={slide * 2 + i} className="review-card-v2">
                <div className="review-photo-wrap">
                  <img src={r.photo} alt={r.name} className="review-photo" style={r.photoPosition ? { objectPosition: r.photoPosition } : undefined} />
                </div>
                <div className="review-card-body">
                  <div className="review-quote-v2">"{r.quote}"</div>
                  <div className="review-body-v2">{r.body}</div>
                  {r.ratings && <HomeRatingsMini driver={r.ratings.driver} vehicle={r.ratings.vehicle} operator={r.ratings.operator} />}
                  <div className="review-meta-row" style={{ marginTop: "12px" }}>
                    <div className="review-name-v2">{r.name}</div>
                    <div className="review-tags">
                      <span className="review-tag-item">{r.pax}</span>
                      <span className="review-tag-item">{r.period}</span>
                      <span className="review-tag-item">Förare: {r.driver}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="reviews-controls">
            <button className="reviews-nav" onClick={prevSlide} aria-label="Föregående">‹</button>
            <div className="reviews-dots">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  className={`reviews-dot${i === slide ? " active" : ""}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Bild ${i + 1}`}
                />
              ))}
            </div>
            <button className="reviews-nav" onClick={nextSlide} aria-label="Nästa">›</button>
          </div>
          {/* More Voice button */}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <a
              href="/voice"
              style={{
                display: "inline-block",
                border: "1.5px solid rgba(201,168,76,0.6)",
                color: "#c9a84c",
                padding: "12px 36px",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,168,76,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              Mer röster
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: "💬", title: "1. Skicka förfrågan", desc: "Fyll i kontaktformuläret med dina resdatum, gruppstorlek och önskemål." },
    { icon: "📋", title: "2. Få förslag", desc: "Vi skickar en skräddarsydd resplan och offert inom 24 timmar." },
    { icon: "💳", title: "3. Bekräfta", desc: "Nöjd med planen? Bekräfta bara din bokning. Ingen förskottsbetalning krävs – du betalar först vid ankomst till Sri Lanka." },
    { icon: "🕐", title: "4. Briefing inför resan", desc: "Före avresan bekräftar vi förarens uppgifter, mötesplats och slutgiltig resplan." },
    { icon: "🏝️", title: "5. Njut av Sri Lanka!", desc: "Din privata förare är med dig varje steg på vägen. Koppla av och utforska." },
  ];
  return (
    <section id="how">
      <div className="container">
        <div className="section-eyebrow">SÅ HÄR FUNGERAR DET</div>
        <h2 className="section-title">Boka din privata förare<br />på Sri Lanka i 5 steg</h2>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div key={i} className="how-step">
              <div className="how-step-num">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────
function Vehicles() {
  return (
    <section id="vehicles" style={{ background: "var(--dark3)" }}>
      <div className="container">
        <div className="section-eyebrow">FORDON</div>
        <h2 className="section-title">Vår fordonsflotta</h2>
        <p className="section-sub">Alla fordon har luftkonditionering, är rena och regelbundet underhållna för din komfort och säkerhet.</p>
        <div className="vehicles-grid">
          <div className="vehicle-card">
            <div className="vehicle-img-wrap">
              <img src="/manus-storage/vehicle_sedan_b6b21042.png" alt="Sedan" className="vehicle-img" />
            </div>
            <h3>Sedan</h3>
            <div className="vehicle-capacity">Upp till 3 passagerare</div>
            <p>Idealisk för ensamresenärer och par. Bekväm och ekonomisk för att resa runt i Sri Lanka.</p>
          </div>
          <div className="vehicle-card featured">
            <div className="vehicle-img-wrap">
              <img src="/manus-storage/vehicle_van_70a807f8.png" alt="Van" className="vehicle-img" />
            </div>
            <h3>Van</h3>
            <div className="vehicle-capacity">Upp till 6 passagerare</div>
            <p>Vårt mest populära val. Rymlig och bekväm för familjer och små grupper.</p>
          </div>
          <div className="vehicle-card">
            <div className="vehicle-img-wrap">
              <img src="/manus-storage/vehicle_large_van_61632670.png" alt="Large Van" className="vehicle-img" />
            </div>
            <h3>Stor Van</h3>
            <div className="vehicle-capacity">Upp till 10 passagerare</div>
            <p>Perfekt för stora grupper och familjer. Maximal komfort för långväga resor över ön.</p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── Company ──────────────────────────────────────────────────────────────────
function Company() {
  return (
    <section id="company" style={{ background: "var(--dark2)" }}>
      <div className="container">
        <div className="section-eyebrow">FÖRETAG</div>
        <h2 className="section-title">Om SLTCS</h2>
        <table className="company-table">
          <tbody>
            <tr><th>Tjänstens namn</th><td>SLTCS｜Hyr bil med privat förare på Sri Lanka</td></tr>
            <tr><th>Fullständigt namn</th><td>Sri Lanka Taxi Charter Service (SLTCS)<br /><small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Registrerat varumärke nr 7034996</small></td></tr>
            <tr><th>Verksamhet</th><td>Mellanhandstjänst för marktransport online</td></tr>
            <tr><th>Täckningsområde</th><td>Hela Sri Lanka — Colombo, Negombo, Kandy, Sigiriya, Nuwara Eliya, Galle, Yala, och bortom</td></tr>
            <tr><th>Språk</th><td>Svenska</td></tr>
            <tr><th>Öppettider</th><td>24/7 — Förfrågningar accepteras när som helst</td></tr>
            <tr><th>Kontakt</th><td>Vänligen använd förfrågningsformuläret på denna sida</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">SLTCS</div>
            <p>Hyr bil med privat förare på Sri Lanka. Helt privat, helt flexibel chartertjänst som täcker hela Sri Lanka – betrodd av europeiska och brittiska resenärer.</p>
          </div>
          <div className="footer-col">
            <h4>Navigering</h4>
            <ul>
              <li><a href="#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>Planer</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>Modellresvägar</a></li>
              <li><a href="#vehicles" onClick={(e) => { e.preventDefault(); scrollTo("vehicles"); }}>Fordon</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>FAQ</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kontakt</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resvägar</h4>
            <ul>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>4 nätter / 5 dagar</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 nätter / 6 dagar</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 nätter / 7 dagar</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5–7 dagar kultur</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 dagar – 2 veckor</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Juridiskt</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Integritetspolicy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Allmänna villkor</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © SLTCS｜Hyr bil med privat förare på Sri Lanka. Alla rättigheter förbehållna.</p>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Integritetspolicy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Allmänna villkor</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating CTA ─────────────────────────────────────────────────────────────
function FloatingCTA() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="floating-cta">
      <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
        <span>💬</span> Kostnadsfri förfrågan
      </a>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <Hero />
      <Stats />
      <ContactAndWhy />
      <Concerns />
      <Plans />
      <PricingPreview />
      <Itineraries />
      <Destinations />
      <Reviews />
      <HowItWorks />
      <Vehicles />
      <Company />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
