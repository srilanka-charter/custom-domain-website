import { useState, useEffect } from "react";

interface SiteNavbarProps {
  /** "home" uses smooth-scroll anchors; other pages use absolute links */
  mode?: "home" | "page";
}

export default function SiteNavbar({ mode = "page" }: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const LANGUAGES = [
    { label: "French",   url: "https://fr.srilanka-charter.com/" },
    { label: "Spanish",  url: "https://es.srilanka-charter.com/" },
    { label: "German",   url: "https://de.srilanka-charter.com/" },
    { label: "Dutch",    url: "https://nl.srilanka-charter.com/" },
    { label: "Russian",  url: "https://ru.srilanka-charter.com/" },
    { label: "Japanese", url: "https://sltcs.srilanka-charter.com/" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (mode === "home") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      <nav className={`sltcs-nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          SLTCS｜Hyr bil med privat förare på Sri Lanka
        </a>
        <ul className="nav-links">
          <li>
            <a href={mode === "home" ? "#plans" : "/#plans"}
              onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>
              PLANER
            </a>
          </li>
          <li className="nav-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button>MODELLRESPLAN</button>
            {dropdownOpen && (
              <div className="nav-dropdown-menu">
                <a href="/#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>4 nätter / 5 dagar</a>
                <a href="/#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 nätter / 6 dagar</a>
                <a href="/#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 nätter / 7 dagar</a>
                <a href="/#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 till 7 dagar – Kulturella triangeln</a>
                <a href="/#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 dagar till 2 veckor – Klassisk plan</a>
              </div>
            )}
          </li>
          <li><a href="/vehicles">FORDON</a></li>
          <li><a href="/price">PRIS</a></li>
          <li>
            <a href={mode === "home" ? "#contact" : "/#contact"}
              onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
              KONTAKT
            </a>
          </li>
          <li><a href="/faq">FAQ</a></li>
          <li className="nav-dropdown nav-lang-dropdown" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
            <button style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
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
          <a href="/#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>Planer</a>
          <a href="/#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>Modellresplan</a>
          <a href="/vehicles">Fordon</a>
          <a href="/price">Pris</a>
          <a href="/#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kontakt</a>
          <a href="/faq">FAQ</a>
          <a href="/#contact" className="btn-nav-mobile" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kostnadsfri förfrågan</a>
          <div style={{ borderTop: "1px solid rgba(201,168,76,0.3)", paddingTop: "8px", marginTop: "4px" }}>
            <div style={{ color: "#c9a84c", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "6px", paddingLeft: "4px" }}>ANDRA SPRÅK</div>
            {LANGUAGES.map((lang) => (
              <a key={lang.label} href={lang.url}>{lang.label}</a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
