import { useState, useEffect } from "react";

const PINK = "#F472B6";
const BLUE = "#7DD3FC";
const DARK = "#0B1120";
const DARK2 = "#111827";
const DARK3 = "#1E293B";
const LIGHT = "#F8FAFC";
const GRAY = "#94A3B8";
const PHONE = "(305) 570-3041";

// REPLACE with your actual Formspree form ID from formspree.io
const FORMSPREE_BOOKING = "https://formspree.io/f/xqeyrgno";
const FORMSPREE_QUOTE = "https://formspree.io/f/xyknrbor";

const services = [
  {
    name: "Junk Removal",
    tag: "HAULING & CLEANOUTS",
    desc: "Garage cleanouts, construction debris, furniture removal, estate cleanups, and appliance disposal. We handle the heavy lifting so you don't have to.",
    items: ["Residential & commercial cleanouts", "Construction debris removal", "Furniture & appliance hauling", "Estate & foreclosure cleanups", "Same-day service available"],
    price: "Starting at $199",
    emoji: "🚛",
    accent: PINK,
    packages: [
      { name: "Half Truck Load", price: 299, desc: "Small cleanouts — furniture, debris, appliances" },
      { name: "Full Truck Load", price: 549, desc: "Full truck — garage & estate cleanouts" },
      { name: "Complete Cleanout", price: 849, desc: "Multi-room / whole property cleanouts" },
    ],
    quoteOnly: true,
  },
  {
    name: "Pressure Washing",
    tag: "EXTERIOR RESTORATION",
    desc: "Driveways, sidewalks, pool decks, building exteriors, and fences restored to like-new condition. South Florida's humidity doesn't stand a chance.",
    items: ["Driveway & sidewalk cleaning", "House & building exteriors", "Pool deck & patio restoration", "Roof soft washing", "Commercial property maintenance"],
    price: "Starting at $149",
    emoji: "💦",
    accent: BLUE,
    packages: [
      { name: "Driveway / Sidewalk", price: 199, desc: "Standard driveway or sidewalk cleaning" },
      { name: "House Exterior", price: 349, desc: "Full house exterior soft wash" },
      { name: "Full Property", price: 649, desc: "Driveway + house + patio + pool deck" },
    ],
    quoteOnly: true,
  },
  {
    name: "Mobile Detailing",
    tag: "PREMIUM AUTO CARE",
    desc: "Full interior and exterior detailing brought directly to your home or office. From daily drivers to exotics — we treat every vehicle like it's our own.",
    items: ["Full interior deep clean", "Exterior wash, clay bar & wax", "Paint correction & ceramic coating", "Engine bay detailing", "Fleet & dealership packages"],
    price: "Starting at $199",
    emoji: "✨",
    accent: PINK,
    packages: [
      { name: "Interior Detail", price: 199, desc: "Deep interior shampoo, extraction & conditioning", deposit: 50 },
      { name: "Full Detail", price: 299, desc: "Complete interior + exterior with clay bar & wax", deposit: 75 },
      { name: "Showroom Elite", price: 499, desc: "Paint correction + ceramic sealant + full interior", deposit: 125 },
    ],
    quoteOnly: false,
  },
];

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const areas = ["Miami", "Miami Beach", "Coral Gables", "Hialeah", "Doral", "Kendall", "Homestead", "Aventura", "North Miami", "Brickell", "Wynwood", "Little Havana", "Coconut Grove", "Key Biscayne", "Pinecrest", "Palmetto Bay"];

// ==================== SHARED COMPONENTS ====================

function PhoneButton({ variant = "pink", size = "lg", fullWidth = false }) {
  const isPink = variant === "pink";
  return (
    <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: size === "lg" ? "16px 36px" : "12px 24px",
      background: isPink ? PINK : "transparent",
      color: isPink ? "#fff" : PINK,
      border: isPink ? "none" : `1.5px solid ${PINK}`,
      borderRadius: 50, fontFamily: "'Outfit', sans-serif",
      fontSize: size === "lg" ? 17 : 15, fontWeight: 600,
      letterSpacing: 0.5, textDecoration: "none", cursor: "pointer",
      width: fullWidth ? "100%" : "auto", justifyContent: "center",
    }}>
      📞 {PHONE}
    </a>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
      <input {...props} style={{
        width: "100%", padding: "13px 16px", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
        color: LIGHT, fontFamily: "'Outfit',sans-serif", fontSize: 15,
        outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
        ...props.style,
      }} onFocus={e => e.target.style.borderColor = `${PINK}55`}
         onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
      <select {...props} style={{
        width: "100%", padding: "13px 16px", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)", background: DARK3,
        color: LIGHT, fontFamily: "'Outfit',sans-serif", fontSize: 15,
        outline: "none", boxSizing: "border-box", appearance: "none",
        ...props.style,
      }}>{children}</select>
    </div>
  );
}

// ==================== NAV ====================

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const linkStyle = { color: LIGHT, fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: 1.5, textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" };
  const links = [
    { label: "Services", href: "#services" },
    { label: "Book Now", href: "#book-now" },
    { label: "Areas", href: "#areas" },
    { label: "About", href: "#about" },
  ];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 max(16px,4vw)", background: scrolled ? "rgba(11,17,32,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(244,114,182,0.1)" : "none", transition: "all 0.4s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: 72 }}>
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, justifySelf: "start" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 20 }}>
              {[12, 18, 14, 20, 16].map((h, i) => (<div key={i} style={{ width: 4, height: h, borderRadius: 1, background: i % 2 === 0 ? "#fff" : BLUE }} />))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, color: PINK, letterSpacing: 1, lineHeight: 1.1 }}>MAGIC CITY</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, fontWeight: 400, color: BLUE, letterSpacing: 3, lineHeight: 1.1 }}>SERVICES</div>
          </div>
        </a>
        <div className="nav-center-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={linkStyle}
              onMouseEnter={e => e.target.style.color = PINK}
              onMouseLeave={e => e.target.style.color = LIGHT}>{l.label}</a>
          ))}
        </div>
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 16 }}>
          <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} className="nav-phone-btn" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px",
            background: PINK, color: "#fff", border: "none", borderRadius: 50,
            fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>📞 {PHONE}</a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{
            display: "none", background: "none", border: "none", color: LIGHT, fontSize: 28, cursor: "pointer", padding: 4,
          }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu" style={{ padding: "20px 0 30px", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", background: "rgba(11,17,32,0.98)", borderTop: "1px solid rgba(244,114,182,0.1)" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ ...linkStyle, fontSize: 15 }}>{l.label}</a>
          ))}
          <PhoneButton size="sm" />
        </div>
      )}
    </nav>
  );
}

// ==================== HERO ====================

function Hero() {
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(165deg, ${DARK} 0%, #0F1B2E 40%, #1A1035 100%)`, position: "relative", overflow: "hidden", padding: "100px 24px 60px" }}>
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: "50vw", height: "50vw", background: `radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-10%", width: "40vw", height: "40vw", background: `radial-gradient(circle, rgba(125,211,252,0.06) 0%, transparent 70%)`, borderRadius: "50%" }} />
      <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: 50, border: "1px solid rgba(244,114,182,0.3)", marginBottom: 28, fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 500, color: PINK, letterSpacing: 2, textTransform: "uppercase" }}>
          Serving All of Miami-Dade County
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 700, color: LIGHT, lineHeight: 1.1, margin: "0 0 10px" }}>Miami's Premier</h1>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 24px", background: `linear-gradient(135deg, ${PINK}, ${BLUE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Home & Auto Services</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(16px,2vw,20px)", color: GRAY, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
          Junk removal, pressure washing, and mobile detailing — all from one trusted team. Professional service, transparent pricing, guaranteed satisfaction.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#book-now" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", background: PINK, color: "#fff", borderRadius: 50, fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5 }}>Book Online →</a>
          <PhoneButton variant="outline" size="lg" />
        </div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[{ val: "500+", label: "Jobs Completed" }, { val: "4.9★", label: "Average Rating" }, { val: "Same Day", label: "Service Available" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 700, color: LIGHT }}>{s.val}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: GRAY, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== SERVICES ====================

function Services() {
  return (
    <section id="services" style={{ background: DARK2, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: PINK, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>What We Do</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: LIGHT, margin: 0 }}>Three Services, One Call</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {services.map(s => (
            <div key={s.name} style={{ background: DARK3, borderRadius: 20, padding: 36, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: `radial-gradient(circle, ${s.accent}11 0%, transparent 70%)`, borderRadius: "50%" }} />
              <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 600, color: s.accent, letterSpacing: 3, marginBottom: 8 }}>{s.tag}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: LIGHT, margin: "0 0 12px" }}>{s.name}</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {s.items.map(item => (
                  <li key={item} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#CBD5E1", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: s.accent, fontSize: 10 }}>●</span> {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: LIGHT }}>{s.price}</span>
                <a href="#book-now" style={{ padding: "10px 22px", borderRadius: 50, background: `${s.accent}18`, border: `1px solid ${s.accent}44`, color: s.accent, fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  Book Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== BOOKING SYSTEM ====================

function BookingSystem() {
  const [tab, setTab] = useState("book");
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", date: "", time: "", vehicle: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleBookingSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        _subject: `New Booking: ${selectedService.name} — ${selectedPackage.name}`,
        service: selectedService.name,
        package: selectedPackage.name,
        packagePrice: `$${selectedPackage.price}`,
        ...formData,
      };
      await fetch(FORMSPREE_BOOKING, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (e) {
      alert("Something went wrong. Please call us directly at " + PHONE);
    }
    setSubmitting(false);
  };

  const handleStripeDeposit = async () => {
    setSubmitting(true);
    try {
      // First submit booking to Formspree
      await fetch(FORMSPREE_BOOKING, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `Deposit Booking: ${selectedService.name} — ${selectedPackage.name}`,
          service: selectedService.name,
          package: selectedPackage.name,
          depositAmount: `$${selectedPackage.deposit}`,
          totalPrice: `$${selectedPackage.price}`,
          ...formData,
        }),
      });
      // Then redirect to Stripe
      const res = await fetch("/api/create-checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          price: selectedPackage.deposit,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          vehicleInfo: formData.vehicle,
          date: formData.date,
          time: formData.time,
          address: formData.address,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not configured yet — fall back to confirmation
        setSubmitted(true);
      }
    } catch (e) {
      // Stripe not set up yet — booking still went to Formspree
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.target);
    try {
      await fetch(FORMSPREE_QUOTE, { method: "POST", body: form });
      setQuoteSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please call us directly at " + PHONE);
    }
    setSubmitting(false);
  };

  const tabBtn = (id, label, icon) => (
    <button onClick={() => { setTab(id); setStep(1); setSelectedService(null); setSelectedPackage(null); setSubmitted(false); setQuoteSubmitted(false); }}
      style={{
        flex: 1, padding: "14px 12px", borderRadius: 12, border: "none", cursor: "pointer",
        background: tab === id ? PINK : "rgba(255,255,255,0.04)",
        color: tab === id ? "#fff" : GRAY,
        fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s",
      }}>
      <span style={{ fontSize: 18 }}>{icon}</span> {label}
    </button>
  );

  // ---- Success State ----
  if (submitted) {
    return (
      <section id="book-now" style={{ background: DARK2, padding: "100px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", background: DARK3, borderRadius: 24, padding: "44px 28px", border: "1px solid rgba(244,114,182,0.15)" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: LIGHT, margin: "0 0 12px" }}>Booking Confirmed!</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: GRAY, lineHeight: 1.7, marginBottom: 8 }}>
            We've received your booking for <strong style={{ color: PINK }}>{selectedPackage?.name}</strong>.
          </p>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: GRAY, lineHeight: 1.7, marginBottom: 32 }}>
            You'll receive a confirmation call within 30 minutes during business hours. If you need immediate assistance:
          </p>
          <PhoneButton size="lg" />
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY, marginTop: 24, cursor: "pointer" }} onClick={() => { setSubmitted(false); setStep(1); setSelectedService(null); setSelectedPackage(null); }}>
            ← Book another service
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="book-now" style={{ background: `linear-gradient(180deg, ${DARK} 0%, ${DARK2} 100%)`, padding: "100px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: PINK, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Get Started</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: LIGHT, margin: "0 0 12px" }}>Book Your Service</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: GRAY }}>Book online, request a custom quote, or call us directly.</p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, padding: "8px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
          {tabBtn("book", "Book Online", "📅")}
          {tabBtn("quote", "Get a Quote", "📝")}
          {tabBtn("call", "Call Now", "📞")}
        </div>

        {/* ==================== BOOK ONLINE TAB ==================== */}
        {tab === "book" && (
          <div style={{ background: DARK3, borderRadius: 24, padding: "28px 28px", border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>

            {/* Progress indicator */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
              {["Service", "Package", "Date & Time", "Your Info"].map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 2, background: step > i ? PINK : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: step > i ? PINK : GRAY, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Step 1: Choose Service */}
            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 600, color: LIGHT, margin: "0 0 20px" }}>Which service do you need?</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {services.map(s => (
                    <button key={s.name} onClick={() => { setSelectedService(s); setStep(2); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 14, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.accent}44`; e.currentTarget.style.background = `${s.accent}08`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                      <span style={{ fontSize: 32 }}>{s.emoji}</span>
                      <div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: LIGHT }}>{s.name}</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY }}>{s.price}</div>
                      </div>
                      <span style={{ marginLeft: "auto", color: GRAY, fontSize: 18 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Package */}
            {step === 2 && selectedService && (
              <div>
                <button onClick={() => { setStep(1); setSelectedService(null); }} style={{ background: "none", border: "none", color: GRAY, fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to services</button>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 600, color: LIGHT, margin: "0 0 6px" }}>{selectedService.emoji} {selectedService.name}</h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 20 }}>Select a package:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedService.packages.map(p => (
                    <button key={p.name} onClick={() => { setSelectedPackage(p); setStep(3); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px",
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 14, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${PINK}44`; e.currentTarget.style.background = `${PINK}08`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                      <div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: LIGHT }}>{p.name}</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY }}>{p.desc}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: PINK }}>${p.price}</div>
                        {p.deposit && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: BLUE }}>${p.deposit} deposit</div>}
                        {!p.deposit && selectedService.quoteOnly && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: BLUE }}>Free estimate</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: GRAY, fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to packages</button>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 600, color: LIGHT, margin: "0 0 20px" }}>When works best for you?</h3>
                <Input label="Preferred Date" type="date" min={minDate} value={formData.date} onChange={e => updateForm("date", e.target.value)} />
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Preferred Time</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {timeSlots.map(t => (
                      <button key={t} onClick={() => updateForm("time", t)}
                        style={{
                          padding: "10px 16px", borderRadius: 10, cursor: "pointer",
                          background: formData.time === t ? PINK : "rgba(255,255,255,0.03)",
                          border: formData.time === t ? "none" : "1px solid rgba(255,255,255,0.06)",
                          color: formData.time === t ? "#fff" : GRAY,
                          fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
                          transition: "all 0.15s",
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { if (formData.date && formData.time) setStep(4); else alert("Please select a date and time."); }}
                  style={{ width: "100%", padding: "15px", borderRadius: 50, border: "none", background: (formData.date && formData.time) ? PINK : GRAY, color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 4: Contact Info */}
            {step === 4 && (
              <div>
                <button onClick={() => setStep(3)} style={{ background: "none", border: "none", color: GRAY, fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to scheduling</button>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 600, color: LIGHT, margin: "0 0 6px" }}>Almost done!</h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 20 }}>
                  {selectedPackage?.name} — {formData.date} at {formData.time}
                </p>

                {/* Booking summary card */}
                <div style={{ background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.12)", borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: LIGHT }}>{selectedService?.emoji} {selectedService?.name}</div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY }}>{selectedPackage?.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: PINK }}>${selectedPackage?.price}</div>
                      {selectedPackage?.deposit && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: BLUE }}>Pay ${selectedPackage.deposit} deposit now</div>}
                      {selectedService?.quoteOnly && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: BLUE }}>Final price after on-site estimate</div>}
                    </div>
                  </div>
                </div>

                <Input label="Full Name" type="text" placeholder="Your full name" value={formData.name} onChange={e => updateForm("name", e.target.value)} />
                <Input label="Phone" type="tel" placeholder="(305) 000-0000" value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
                <Input label="Email" type="email" placeholder="your@email.com" value={formData.email} onChange={e => updateForm("email", e.target.value)} />
                <Input label="Service Address" type="text" placeholder="Where should we come?" value={formData.address} onChange={e => updateForm("address", e.target.value)} />
                {selectedService?.name === "Mobile Detailing" && (
                  <Input label="Vehicle Info" type="text" placeholder="Year, make, model, color" value={formData.vehicle} onChange={e => updateForm("vehicle", e.target.value)} />
                )}

                {/* Submit buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {selectedPackage?.deposit ? (
                    <>
                      <button onClick={handleStripeDeposit} disabled={submitting || !formData.name || !formData.phone || !formData.email || !formData.address}
                        style={{ width: "100%", padding: "16px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${PINK}, #E04DA0)`, color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? "Processing..." : `Pay $${selectedPackage.deposit} Deposit & Confirm`}
                      </button>
                      <button onClick={handleBookingSubmit} disabled={submitting || !formData.name || !formData.phone || !formData.email || !formData.address}
                        style={{ width: "100%", padding: "14px", borderRadius: 50, border: `1px solid ${BLUE}44`, background: "transparent", color: BLUE, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                        Book Without Deposit (Pay On-Site)
                      </button>
                    </>
                  ) : (
                    <button onClick={handleBookingSubmit} disabled={submitting || !formData.name || !formData.phone || !formData.email || !formData.address}
                      style={{ width: "100%", padding: "16px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${PINK}, #E04DA0)`, color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
                      {submitting ? "Submitting..." : "Confirm Booking — Free On-Site Estimate"}
                    </button>
                  )}
                </div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: GRAY, textAlign: "center", marginTop: 16 }}>
                  We'll confirm your appointment within 30 minutes during business hours.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== QUOTE TAB ==================== */}
        {tab === "quote" && (
          <div style={{ background: DARK3, borderRadius: 24, padding: "28px 28px", border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
            {quoteSubmitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 600, color: LIGHT, margin: "0 0 8px" }}>Quote Request Received!</h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: GRAY, marginBottom: 20 }}>We'll get back to you within the hour. Need it faster?</p>
                <PhoneButton size="sm" />
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 600, color: LIGHT, margin: "0 0 6px" }}>Request a Free Quote</h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 24 }}>Describe your project and we'll get back to you with a custom price — usually within the hour.</p>
                <input type="hidden" name="_subject" value="New Quote Request — Magic City Services" />
                <Select label="Service Needed" name="service">
                  <option value="Junk Removal">Junk Removal</option>
                  <option value="Pressure Washing">Pressure Washing</option>
                  <option value="Mobile Detailing">Mobile Detailing</option>
                  <option value="Multiple Services">Multiple Services / Bundle</option>
                </Select>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Describe Your Project</label>
                  <textarea name="description" rows={4} required placeholder="Tell us about the job — size, scope, any special requirements..."
                    style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: LIGHT, fontFamily: "'Outfit',sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box", resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = `${PINK}55`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="Full Name" name="name" type="text" placeholder="Your name" required />
                  <Input label="Phone" name="phone" type="tel" placeholder="(305) 000-0000" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="Email" name="email" type="email" placeholder="your@email.com" required />
                  <Input label="Service Address / Zip" name="address" type="text" placeholder="Miami, FL 33101" />
                </div>
                <button type="submit" disabled={submitting}
                  style={{ width: "100%", padding: "16px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${PINK}, #E04DA0)`, color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? "Sending..." : "Submit Quote Request"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==================== CALL TAB ==================== */}
        {tab === "call" && (
          <div style={{ background: DARK3, borderRadius: 24, padding: "36px 28px", border: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📞</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: LIGHT, margin: "0 0 12px" }}>Talk to Us Now</h3>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: GRAY, lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
              Our team is available 7 days a week. Call for immediate quotes, same-day service, or any questions about our services.
            </p>
            <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} style={{
              display: "inline-flex", alignItems: "center", gap: 12, padding: "20px 48px",
              background: `linear-gradient(135deg, ${PINK}, #E04DA0)`, color: "#fff",
              borderRadius: 50, fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 700,
              textDecoration: "none", letterSpacing: 0.5,
            }}>
              {PHONE}
            </a>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36 }}>
              {[{ label: "Mon – Sat", value: "7am – 7pm" }, { label: "Sunday", value: "9am – 5pm" }, { label: "Emergency", value: "Call anytime" }].map(h => (
                <div key={h.label}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: LIGHT }}>{h.value}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: GRAY }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ==================== HOW IT WORKS ====================

function HowItWorks() {
  const steps = [
    { num: "01", title: "Book or Call", desc: "Choose your service online or give us a call. We respond within minutes." },
    { num: "02", title: "Get Your Price", desc: "Detailing is quoted instantly. For junk removal and pressure washing, we provide a free on-site estimate." },
    { num: "03", title: "We Handle It", desc: "Our vetted professionals arrive on time and deliver results to our high standards." },
    { num: "04", title: "Pay & Review", desc: "Flexible payment: card, cash, Zelle, CashApp. Leave us a review to help your neighbors find us." },
  ];
  return (
    <section id="how-it-works" style={{ background: DARK2, padding: "100px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: LIGHT, margin: 0 }}>How It Works</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 32 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? PINK : "rgba(125,211,252,0.08)", border: i === 0 ? "none" : "1px solid rgba(125,211,252,0.15)" }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: i === 0 ? "#fff" : BLUE }}>{s.num}</span>
              </div>
              <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: LIGHT, margin: "0 0 8px" }}>{s.title}</h4>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== AREAS ====================

function AreasSection() {
  return (
    <section id="areas" style={{ background: `linear-gradient(180deg, ${DARK} 0%, ${DARK2} 100%)`, padding: "100px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: PINK, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Coverage</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: LIGHT, margin: "0 0 16px" }}>Service Areas</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: GRAY, marginBottom: 40 }}>We proudly serve all of Miami-Dade County and surrounding areas.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {areas.map(a => (
            <span key={a} style={{ padding: "8px 18px", borderRadius: 50, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, color: "#CBD5E1" }}>{a}</span>
          ))}
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginTop: 32 }}>
          Don't see your area? <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} style={{ color: PINK, textDecoration: "none", fontWeight: 600 }}>Call us</a> — we likely cover it.
        </p>
      </div>
    </section>
  );
}

// ==================== ABOUT ====================

function About() {
  return (
    <section id="about" style={{ background: DARK2, padding: "100px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: LIGHT, margin: "0 0 20px" }}>Built for Miami</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, color: GRAY, lineHeight: 1.8, maxWidth: 620, margin: "0 auto" }}>
            Magic City Services was founded with one mission: make it effortless for Miami homeowners and businesses to get quality service without the runaround. We connect you with vetted, insured professionals who show up on time and deliver results — every single time.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
          {[
            { icon: "🛡️", title: "Licensed & Insured", desc: "Every job is backed by our general liability coverage. Your property is protected." },
            { icon: "⚡", title: "Fast Response", desc: "We respond to every inquiry within minutes. Same-day service available for most jobs." },
            { icon: "💯", title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right. Our reputation is built on every single job." },
            { icon: "💳", title: "Flexible Payment", desc: "We accept cards, cash, Zelle, and CashApp. Pay online or on-site — your choice." },
          ].map(f => (
            <div key={f.title} style={{ background: DARK3, borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: LIGHT, margin: "0 0 6px" }}>{f.title}</h4>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== FOOTER ====================

function Footer() {
  return (
    <footer style={{ background: DARK, padding: "60px 24px 30px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
                  {[10, 14, 12, 16, 13].map((h, i) => (<div key={i} style={{ width: 3, height: h, borderRadius: 1, background: i % 2 === 0 ? "#fff" : BLUE }} />))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: PINK, letterSpacing: 1, lineHeight: 1.1 }}>MAGIC CITY</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 8, fontWeight: 400, color: BLUE, letterSpacing: 3, lineHeight: 1.1 }}>SERVICES</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: GRAY, lineHeight: 1.7, maxWidth: 260 }}>Miami-Dade County's trusted source for junk removal, pressure washing, and mobile detailing.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: LIGHT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Services</h4>
            {["Junk Removal", "Pressure Washing", "Mobile Detailing"].map(s => (<div key={s} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>{s}</div>))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: LIGHT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Contact</h4>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>{PHONE}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>info@magiccityservicesmiami.com</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY }}>Miami-Dade County, FL</div>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: LIGHT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Hours</h4>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>Mon – Sat: 7am – 7pm</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>Sunday: 9am – 5pm</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: PINK, fontWeight: 600, marginTop: 8 }}>Emergency? Call anytime.</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#475569" }}>© 2026 Magic City Services LLC. All rights reserved.</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#475569" }}>Licensed & Insured — Miami-Dade County, FL</span>
        </div>
      </div>
    </footer>
  );
}

// ==================== APP ====================

export default function MagicCityServices() {
  // Check URL params for Stripe callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("booking") === "success") {
      window.scrollTo(0, 0);
      // Could show a success toast here
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${DARK}; }
        ::selection { background: ${PINK}44; color: #fff; }
        @media (max-width: 768px) {
          .nav-center-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .nav-phone-btn { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        input, textarea, select, button { max-width: 100%; box-sizing: border-box; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Services />
      <BookingSystem />
      <HowItWorks />
      <AreasSection />
      <About />
      <Footer />
    </>
  );
}
