/**
 * Voice – Gästrecensioner
 * URL: /voice
 * Alla 8 förarrecensioner med 3-kategoriers 5-stjärniga betyg (Förare / Fordon / Operatör)
 */

import { Link } from "wouter";

// ─── Komponent för stjärnbetyg ─────────────────────────────────────────────────────
function StarRating({ score }: { score: number }) {
  return (
    <span style={{ color: "#c9a84c", fontSize: "1rem", letterSpacing: "1px" }}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (score >= i) return <span key={i} style={{ opacity: 1 }}>★</span>;
        if (score >= i - 0.5) return <span key={i} style={{ opacity: 0.6 }}>★</span>;
        return <span key={i} style={{ opacity: 0.2 }}>★</span>;
      })}
      <span style={{ color: "#6a6a6a", fontSize: "0.8rem", marginLeft: "4px" }}>
        {score.toFixed(1)}
      </span>
    </span>
  );
}

// ─── Visning av kategoribetyg ──────────────────────────────────────────────────
function RatingsBreakdown({ driver, vehicle, operator }: { driver: number; vehicle: number; operator: number }) {
  const total = Math.round(((driver + vehicle + operator) / 3) * 10) / 10;
  return (
    <div className="voice-ratings">
      <div className="voice-total-score">
        <span className="voice-total-label">Totalt</span>
        <span className="voice-total-num">{total.toFixed(1)}</span>
        <span className="voice-total-stars">
          {[1, 2, 3, 4, 5].map((i) => {
            if (total >= i) return <span key={i} style={{ color: "#c9a84c" }}>★</span>;
            if (total >= i - 0.5) return <span key={i} style={{ color: "#c9a84c", opacity: 0.6 }}>★</span>;
            return <span key={i} style={{ color: "#d1ccc4" }}>★</span>;
          })}
        </span>
      </div>
      <div className="voice-breakdown">
        {[
          { label: "Förare", score: driver },
          { label: "Fordon", score: vehicle },
          { label: "Operatör", score: operator },
        ].map(({ label, score }) => (
          <div key={label} className="voice-breakdown-row">
            <span className="voice-breakdown-label">{label}</span>
            <div className="voice-breakdown-bar-wrap">
              <div className="voice-breakdown-bar" style={{ width: `${(score / 5) * 100}%` }} />
            </div>
            <span className="voice-breakdown-score">{score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Review Data ────────────────────────────────────────────────────────────────────────────────
// Recensioner från hemsidan (avsnittet Vad våra gäster säger)
const HOME_REVIEWS = [
  {
    id: "eranga",
    photo: "/manus-storage/review1_r_family_eranga_a3545b4c.png",
    driver: "Eranga",
    name: "Familjen R",
    pax: "4 passagerare",
    period: "Augusti 2025",
    route: "Anuradhapura – Dambulla – Sigiriya – Polonnaruwa",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 5.0 },
    quote: "Professionell service från första förfrågan till slutlig avlämning – vi kände oss helt lugna hela tiden.",
    body: "Från förhandsbokning till resdagen svarade teamet snabbt och tydligt. Prissättning och reseplanering förklarades på ett sätt som inte lämnade utrymme för osäkerhet. På resdagen körde Eranga försiktigt och lugnt, och omdirigerade smidigt runt trafikstockningar för att hålla oss i tid. Hans djupa kunskap om Anuradhapura, Dambulla, Sigiriya och Polonnaruwa gav oss en rik historisk grund för att förstå detta anmärkningsvärda land. Vi anser oss lyckligt lottade att ha haft honom som både förare och guide.",
  },
  {
    id: "lasith-home",
    photo: "/manus-storage/review_lasith_family_ae2d2464.jpeg",
    driver: "Lasith",
    name: "Familjen W",
    pax: "3 passagerare",
    period: "Mars 2026",
    route: "Passikudah – Sigiriya – Colombo",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 5.0 },
    quote: "Lasith var oändligt tålmodig med våra barn och fick varje ögonblick av resan att kännas enkel.",
    body: "Att ha Lasith med oss var en verklig lyckträff. Hans varma sätt med barnen fick oss alla att känna oss lugna, och hans tydliga engelska innebar att inget någonsin gick förlorat i översättningen. Punktlig, full av tankeväckande förslag på sevärdheter och lokala restauranger, och konsekvent lugn bakom ratten – han var allt vi kunde ha önskat oss. (Vi kommer förmodligen att hoppa över den vägen mellan Passikudah och Sigiriya nästa gång, dock!) Vi rekommenderar honom utan tvekan: uppmärksam, kunnig och helt pålitlig. Om du någonsin är i Europa, Lasith – första omgången bjuder vi på.",
  },
  {
    id: "ranjana-home",
    photo: "/manus-storage/review_ranjana_new_2b654dea.png",
    driver: "Ranjana",
    name: "Paret H",
    pax: "2 passagerare",
    period: "November 2025",
    route: "Colombo – Kandy – Nuwara Eliya – Galle",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 4.5 },
    quote: "Ranjana förvandlade vår Sri Lanka-resa till något långt utöver vanlig sightseeing.",
    body: "Vi bokade en privat charter för två och blev ihopkopplade med Ranjana – ett beslut vi inte kunde vara gladare över. Han förde med sig ett lugnt självförtroende till varje körning, och navigerade bergsvägar och livliga stadskärnor med samma lätthet. Det som stack ut mest var hans äkta entusiasm: han föreslog en forsränningsupplevelse vi inte hade planerat, och det blev en av resans höjdpunkter. Hans lokala kunskap om dolda utsiktsplatser, autentiska matställen och kulturella seder berikade varje dag. Ranjana är den typ av guide som får dig att känna dig som en gäst i landet, inte bara en turist som passerar förbi.",
  },
  {
    id: "priyanth",
    photo: "/manus-storage/review_priyantha_couple_e0a47aaf.png",
    photoPosition: "center 40%",
    driver: "Priyanth",
    name: "Paret A&S",
    pax: "2 passagerare",
    period: "Augusti 2025",
    route: "Colombo – Sigiriya – Kandy – Nuwara Eliya – Galle",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 5.0 },
    quote: "Priyanth fick sex dagar att kännas som en resa med en betrodd vän snarare än en anställd förare.",
    body: "Från Colombo flygplats guidade Priyanth oss genom Sigiriya, Kandy, Nuwara Eliya och Galle under sex dagar. Han var punktlig och körde försiktigt hela tiden, och frågade alltid hur vi mådde – något vi verkligen uppskattade på längre sträckor. Hans glada sällskap gjorde varje transfer trevlig, och hans insikter i Sri Lankas historia och kultur gav ett verkligt djup åt det vi såg. Han tog oss också till en hisnande utsiktsplats som inte fanns med i vår ursprungliga plan, och introducerade oss för lokala restauranger som helt enkelt var enastående. Vi skulle gärna resa med honom igen vid vårt nästa besök på Sri Lanka.",
  },
  {
    id: "indika",
    photo: "/manus-storage/review5_t_couple_indika_519f1510.png",
    photoPosition: "center 35%",
    driver: "Indika",
    name: "Paret T",
    pax: "2 passagerare",
    period: "Oktober 2025",
    route: "Negombo – Sigiriya – Kandy – Nuwara Eliya – Mirissa",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 5.0 },
    quote: "Tack vare Indika blev vår resa inte bara sightseeing – det blev en riktigt färgstark, oförglömlig resa.",
    body: "Vi reste som ett par från Negombo genom Sigiriya, Kandy, Nuwara Eliya och Mirissa under fem dagar. Redan första morgonen – som råkade vara en födelsedag – dök en tårta upp vid frukosten, diskret ordnad av Indika via hotellet. Han gav oss också en liten elefantfigur som present. Vi blev genuint rörda. Under hela resan var han en stadig, lugnande närvaro: han informerade oss före varje plats, hanterade tidiga starter utan klagomål, rekommenderade restauranger han själv ofta besöker (alla var utmärkta), och åkte till och med tåg med oss för att hålla oss säkra i folkmassorna. När något verkade överprissatt sa han bara: 'Låt oss hoppa över det' – den ärligheten gjorde att vi litade helt på honom.",
  },
  {
    id: "chamil",
    photo: "/manus-storage/review_dfamily_chamil_9214e24c.png",
    driver: "Chamil",
    name: "Familjen D",
    pax: "5 passagerare",
    period: "December 2025",
    route: "Colombo – Sigiriya – Kandy – Yala – Galle",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 4.5 },
    quote: "Trots att vi var tvungna att helt omorganisera vår resplan efter en cyklon, gjorde Chamil det till en oförglömlig resa.",
    body: "Vi reste som tre generationer – morföräldrar, föräldrar och ett barn – strax efter att en cyklon hade stört ön. Chamil samlade ständigt in den senaste informationen om vägförhållanden och säkerhet, och föreslog alltid de bästa tillgängliga rutterna med våra preferenser i åtanke. När vi behövde avboka hotell och tågbokningar och ordna nya med kort varsel, var han där och hjälpte oss hela vägen. Han följde med oss på klättringen uppför Sigiriya Rock och på safarin, vilket gav oss en enorm trygghet. Hans uppmärksamhet på vårt barn var särskilt rörande. Chamils värme, snabba tänkande och naturliga omtänksamhet vann över varje medlem i vår familj. Vi ser redan fram emot vår nästa resa till Sri Lanka, och vi kommer absolut att be om Chamil igen.",
  },
];

const VOICE_REVIEWS = [
  {
    id: "aruna",
    photo: "/manus-storage/review_aruna_78705121.jpeg",
    driver: "Aruna",
    name: "Paret M",
    pax: "2 passagerare",
    period: "Mars 2025",
    route: "Colombo – Ella – Nuwara Eliya – Kandy",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 4.5 },
    quote: "Aruna fick varje bergsväg att kännas som ett äventyr, inte en utmaning.",
    body: "Vi anlitade Aruna för en veckolång rundtur genom bergsområdet, och han överträffade alla förväntningar. Hans kunskap om de natursköna utsiktsplatserna – många av dem finns inte i guideböcker – var extraordinär. Han tajmade vår ankomst till Ella Rock perfekt för att fånga morgondimman, och hans förslag att stanna vid ett litet tekafé vid vägkanten blev ett av våra mest omhuldade minnen. Arunas körning är smidig och självsäker även på de smala bergspassen, och hans lugna uppträdande gjorde oss helt avslappnade under hela resan. Han var alltid punktlig, alltid leende och tänkte alltid ett steg framåt. En enastående professionell och en genuint varm människa.",
  },
  {
    id: "dhammika",
    photo: "/manus-storage/review_dhammika_f371cfdd.jpeg",
    photoPosition: "center 40%",
    driver: "Dhammika",
    name: "Paret R",
    pax: "2 passagerare",
    period: "Februari 2025",
    route: "Colombo – Sigiriya – Kandy – Mirissa",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 4.5 },
    quote: "Dhammikas lokala kunskap förvandlade vår resa från en semester till en genuin kulturell fördjupning.",
    body: "Från det ögonblick Dhammika mötte oss på Colombo flygplats visste vi att vi var i goda händer. Han har en encyklopedisk kunskap om Sri Lankas historia och kultur som han delar med verklig entusiasm – aldrig föreläsande, alltid konverserande. Vid Sigiriya visste han exakt vilken vinkel man skulle fotografera klippan från vid golden hour, och i Kandy tog han oss till en Kandyan-dansföreställning som de flesta turister aldrig hittar. Hans fordon var fläckfritt och luftkonditionerat, och han hade alltid kallt vatten väntande på oss. Dhammika är den typ av förare som verkligen bryr sig om du får bästa möjliga upplevelse. Vi har redan rekommenderat honom till tre uppsättningar vänner.",
  },
  {
    id: "kushan",
    photo: "/manus-storage/review_kushan_f9478373.jpeg",
    driver: "Kushan",
    name: "Gruppen B",
    pax: "4 passagerare",
    period: "Januari 2025",
    route: "Colombo – Dambulla – Polonnaruwa – Trincomalee",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 5.0 },
    quote: "Kushan hanterade fyra mycket olika personligheter med tålamod, gott humör och anmärkningsvärd skicklighet.",
    body: "Vår grupp på fyra hade mycket olika intressen – historia, vilda djur, stränder och mat – och Kushan lyckades väva in alla dessa i en sömlös resplan. Han var oändligt tålmodig när vi inte kunde komma överens om var vi skulle äta, hade alltid ett förslag redo och fick oss aldrig att känna oss stressade. Hans körning på kustvägarna var säker och trygg, och han kände till varje genväg för att undvika den värsta eftermiddagstrafiken. Fordonet var stort, bekvämt och oklanderligt rent under hela resan. Kushans lättsamma natur gjorde de långa kördagarna genuint njutbara. Vi lämnade Sri Lanka med känslan av att vi hade fått en vän.",
  },
  {
    id: "lasith",
    photo: "/manus-storage/review_lasith2_555d5b29.jpeg",
    driver: "Lasith",
    name: "Familjen W",
    pax: "3 passagerare",
    period: "April 2025",
    route: "Colombo – Sigiriya – Kandy – Galle",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 5.0 },
    quote: "Lasith var oändligt tålmodig med våra barn och fick varje ögonblick av resan att kännas enkel.",
    body: "Att ha Lasith med oss var en genuin lyckträff. Hans varma sätt med barnen fick oss alla att känna oss bekväma, och hans tydliga engelska innebar att inget någonsin gick förlorat i översättningen. Punktlig, full av genomtänkta förslag på sevärdheter och lokala restauranger, och konsekvent lugn bakom ratten – han var allt vi kunde ha önskat oss. Vi rekommenderar honom utan tvekan: uppmärksam, kunnig och helt pålitlig. Om du någonsin är i Europa, Lasith – första rundan bjuder vi på.",
  },
  {
    id: "malinga",
    photo: "/manus-storage/review_malinga_5636b125.jpeg",
    driver: "Malinga",
    name: "Paret S",
    pax: "2 passagerare",
    period: "Maj 2025",
    route: "Negombo – Wilpattu – Anuradhapura – Trincomalee",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 5.0 },
    quote: "Malingas entusiasm för Sri Lankas vilda djur var helt smittsam – han gjorde varje safari oförglömlig.",
    body: "Vi valde en resplan med fokus på vilda djur och Malinga var den perfekta guiden för det. Hans kunskap om Wilpattu nationalpark var extraordinär – han upptäckte en leopard som vilade i ett träd som vår officiella safaribil helt hade missat. Han ordnade också en båtsafari på Madu River som inte fanns med i vår ursprungliga plan, och det visade sig bli en av höjdpunkterna under hela resan. Malinga kör med verklig försiktighet på viltreservatets spår, och hans tålamod att vänta på den perfekta iakttagelsen är anmärkningsvärd. Hans glada kommentarer under hela resan gjorde varje kilometer mellan parkerna njutbar. En exceptionell förare för alla som älskar naturen.",
  },
  {
    id: "ravi",
    photo: "/manus-storage/review_ravi_b940edfb.jpeg",
    driver: "Ravi",
    name: "The Y Group",
    pax: "7 passagerare",
    period: "Mars 2025",
    route: "Colombo – Sigiriya – Dambulla – Kandy – Galle",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 4.5 },
    quote: "Ravi höll sju av oss glada, i tid och skrattande hela vägen – ingen liten bedrift.",
    body: "Som en stor grupp på sju unga vuxna var vi lite nervösa för om en privat charter skulle fungera för oss. Ravi lugnade alla våra farhågor inom den första timmen. Han har en naturlig förmåga att hantera gruppdynamik – han vet när man ska föreslå ett stopp, när man ska fortsätta och när man ska låta alla bara njuta av landskapet i tystnad. Hans skåpbil var rymlig och bekväm, och han höll den fläckfri under hela resan. Ravi har också ett utmärkt öga för fototillfällen och stannade alltid gärna för den perfekta bilden. Han introducerade oss för lokal gatumat som vi aldrig skulle ha hittat på egen hand, och varje rekommendation var enastående. Ravi gjorde vår gruppresa verkligen speciell.",
  },
  {
    id: "smith",
    photo: "/manus-storage/review_smith_3ba6750f.jpeg",
    driver: "Smith",
    name: "Familjen K",
    pax: "5 passagerare",
    period: "Februari 2025",
    route: "Colombo – Ella – Yala – Mirissa",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 5.0 },
    quote: "Smiths lugna professionalism och genuina värme gjorde vår familjesemester verkligen exceptionell.",
    body: "Vi reste som en familj på fem – inklusive två små barn och en mormor – och Smith hanterade varje logistisk utmaning med tyst effektivitet och ett konstant leende. Han var noggrann med säkerheten, såg alltid till att alla var bekväma innan avfärd, och hans körning på de slingrande vägarna till Ella var imponerande smidig. Smith ordnade en överraskande födelsedagstårta till vår mormor på en restaurang i Mirissa, vilket rörde hela familjen djupt. Hans kunskap om Yala nationalpark var enastående – vi såg leoparder, elefanter och krokodiler på en enda förmiddag. Smith är den typ av förare som verkligen investerar i din lycka. Vi kan inte rekommendera honom tillräckligt varmt.",
  },
  {
    id: "asanka",
    photo: "/manus-storage/review_asanka_couple_3ef4bb3c.png",
    photoPosition: "center 30%",
    driver: "Asanka",
    name: "P-paret",
    pax: "2 passagerare",
    period: "Januari 2025",
    route: "Colombo – Anuradhapura – Polonnaruwa – Sigiriya",
    ratings: { driver: 5.0, vehicle: 5.0, operator: 4.5 },
    quote: "Asanka fick de antika städerna att leva – hans kunskap och värme var helt enkelt enastående.",
    body: "Vi utforskade den kulturella triangeln med Asanka under tre dagar, och det var en upplevelse vi aldrig kommer att glömma. Hans djupa kunskap om Anuradhapura och Polonnaruwa förvandlade det som kunde ha varit en lång promenad genom ruiner till en genuint gripande resa genom historien. Han visste exakt vilka platser som skulle prioriteras, när man skulle dröja kvar och när man skulle gå vidare – alltid läsande vår energi perfekt. Vid Sigiriya guidade han oss uppför klippan med tålamod och uppmuntran, och hans timing gjorde att vi hade de bästa vyerna nästan för oss själva. Asanka är varm, professionell och oändligt entusiastisk över att dela med sig av sitt land. Vi lämnade Sri Lanka med känslan av att vi hade fått en sann vän.",
  },
  {
    id: "ranjana",
    photo: "/manus-storage/review_ranjana_50bce7fd.jpeg",
    driver: "Ranjana",
    name: "H-paret",
    pax: "2 passagerare",
    period: "November 2025",
    route: "Colombo – Kandy – Nuwara Eliya – Galle",
    ratings: { driver: 5.0, vehicle: 4.5, operator: 4.5 },
    quote: "Ranjana förvandlade vår Sri Lanka-resa till något långt utöver vanlig sightseeing.",
    body: "Vi bokade en privat charter för två och fick Ranjana – ett beslut vi inte kunde vara gladare över. Han förde med sig ett lugnt självförtroende till varje körning, navigerande bergsvägar och livliga stadskärnor med samma lätthet. Det som stack ut mest var hans genuina entusiasm: han föreslog en forsränningsupplevelse som vi inte hade planerat, och det blev en av resans höjdpunkter. Hans lokala kunskap om dolda utsiktsplatser, autentiska matställen och kulturella seder berikade varje dag. Ranjana är den typ av guide som får dig att känna dig som en gäst i landet, inte bara en turist som passerar förbi.",
  },
];
// ─── Voice Review Card ────────────────────────────────────────────────────────────────────────────────
type ReviewItem = (typeof VOICE_REVIEWS[0] | typeof HOME_REVIEWS[0]) & { photoPosition?: string };
function VoiceCard({ review }: { review: ReviewItem }) {
  const overall = Math.round(((review.ratings.driver + review.ratings.vehicle + review.ratings.operator) / 3) * 10) / 10;
  return (
    <article className="voice-card">
      <div className="voice-card-photo-wrap">
        <img src={review.photo} alt={`${review.driver} med gäster`} className="voice-card-photo" style={(review as ReviewItem).photoPosition ? { objectPosition: (review as ReviewItem).photoPosition } : undefined} />
        <div className="voice-card-overall-badge">
          <span className="voice-badge-star">★</span>
          <span className="voice-badge-num">{overall.toFixed(1)}</span>
        </div>
      </div>
      <div className="voice-card-content">
        <div className="voice-card-header">
          <div>
            <div className="voice-card-driver">Förare: {review.driver}</div>
            <div className="voice-card-meta">{review.name} · {review.pax} · {review.period}</div>
            <div className="voice-card-route">📍 {review.route}</div>
          </div>
        </div>
        <blockquote className="voice-card-quote">"{review.quote}"</blockquote>
        <p className="voice-card-body">{review.body}</p>
        <RatingsBreakdown
          driver={review.ratings.driver}
          vehicle={review.ratings.vehicle}
          operator={review.ratings.operator}
        />
      </div>
    </article>
  );
}

// ─── Voice Page ────────────────────────────────────────────────────────────────
export default function Voice() {
  const ALL_REVIEWS = [...VOICE_REVIEWS, ...HOME_REVIEWS];
  const avgOverall = (
    ALL_REVIEWS.reduce((sum, r) => sum + (r.ratings.driver + r.ratings.vehicle + r.ratings.operator) / 3, 0) /
    ALL_REVIEWS.length
  ).toFixed(1);

  return (
    <div className="voice-page">
      {/* Navbar placeholder – reuse site nav via layout */}
      <header className="voice-header">
        <div className="voice-header-inner">
          <Link href="/" className="voice-back-link">← Tillbaka till Hem</Link>
          <a href="/" className="voice-site-title">SLTCS｜Hyr bil med privat förare på Sri Lanka</a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="voice-hero">
          <div className="voice-hero-eyebrow">— RÖSTER —</div>
          <h1 className="voice-hero-title">Vad våra gäster säger</h1>
          <p className="voice-hero-sub">
            Verkliga recensioner från resenärer som har utforskat Sri Lanka med SLTCS privata förare.
          </p>
          <div className="voice-summary-bar">
            <div className="voice-summary-item">
              <span className="voice-summary-num">{ALL_REVIEWS.length}</span>
              <span className="voice-summary-label">Recensioner</span>
            </div>
            <div className="voice-summary-divider" />
            <div className="voice-summary-item">
              <span className="voice-summary-num">{avgOverall}</span>
              <span className="voice-summary-label">Totalbetyg</span>
            </div>
            <div className="voice-summary-divider" />
            <div className="voice-summary-item">
              <span className="voice-summary-num">14</span>
              <span className="voice-summary-label">Förare</span>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="voice-reviews-section">
          <div className="voice-reviews-grid">
            {ALL_REVIEWS.map((r) => (
              <VoiceCard key={r.id} review={r} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="voice-cta-section">
          <h2 className="voice-cta-title">Redo att skapa din egen berättelse?</h2>
          <p className="voice-cta-sub">Gå med hundratals resenärer som har utforskat Sri Lanka med våra privata förare.</p>
          <a href="/#contact" className="voice-cta-btn">Kostnadsfri förfrågan</a>
        </section>
      </main>

      <footer className="voice-footer">
        <p>© 2025 SLTCS – Hyr bil med privat förare på Sri Lanka · <a href="/">sv.srilanka-charter.com</a></p>
      </footer>
    </div>
  );
}
