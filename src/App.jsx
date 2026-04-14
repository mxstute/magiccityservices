import { useState, useEffect } from "react";
import AddressAutocomplete from "./AddressAutocomplete";

/*
  MAGIC CITY SERVICES — HUB SITE v3
  Layout: Hero → Booking (section 2) → Pricing → Services → Areas → Footer
  Deposit model: $25 / $50 / $75 based on package tier
  Call is always free — deposits for online bookings only
*/

const SERVICE_DATA = {
  "Junk Removal": {
    icon: "🚛",
    packages: [
      { name: "Half Truck Load", price: "$299", deposit: 25, note: "Furniture, small cleanouts", tag: null },
      { name: "Full Truck Load", price: "$549", deposit: 50, note: "Garage, storage, large hauls", tag: "Most Popular" },
      { name: "Complete Cleanout", price: "$849+", deposit: 75, note: "Entire property cleanout", tag: null },
    ],
  },
  "Pressure Washing": {
    icon: "🏠",
    packages: [
      { name: "Driveway / Sidewalk", price: "$199", deposit: 25, note: "Standard residential driveway", tag: null },
      { name: "House Exterior", price: "$299+", deposit: 50, note: "Single or two-story", tag: "Most Popular" },
      { name: "Full Property Package", price: "$999+", deposit: 75, note: "Driveway + house + roof + deck", tag: "Best Value" },
    ],
  },
  "Mobile Detailing": {
    icon: "🚗",
    packages: [
      { name: "Interior Detail", price: "$249", deposit: 25, note: "Deep clean, condition, protect", tag: null },
      { name: "Full Detail", price: "$349", deposit: 50, note: "Interior + exterior", tag: "Most Popular" },
      { name: "Showroom Elite", price: "$599", deposit: 75, note: "The works — premium package", tag: null },
    ],
  },
};

const AREAS = [
  "Miami Beach", "Brickell", "Coral Gables", "Kendall", "Doral", "Hialeah",
  "Coconut Grove", "Aventura", "Hollywood", "Fort Lauderdale", "Pembroke Pines",
  "Weston", "Boca Raton", "West Palm Beach", "Homestead", "Miami Gardens",
];

const TIMES = [];
for (let h = 7; h <= 21; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 21 && m > 0) break;
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    const label = `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
    let tag = "";
    if (h < 8) tag = " (Early Bird +$25)";
    else if (h >= 18) tag = " (After Hours +$25)";
    TIMES.push({ value: label, label: label + tag });
  }
}

const CROSS_LINKS = [
  { name: "Junk Removal", icon: "🚛", link: "magiccityjunkremovalmiami.com" },
  { name: "Pressure Washing", icon: "🏠", link: "magiccitypressurewashingmiami.com" },
  { name: "Mobile Detailing", icon: "🚗", link: "magiccitydetailingmiami.com" },
];

export default function HubSiteV3() {
  const [bookingTab, setBookingTab] = useState("book");
  const [selectedService, setSelectedService] = useState("Junk Removal");
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [activePriceTab, setActivePriceTab] = useState("Junk Removal");
  const [hoveredArea, setHoveredArea] = useState(null);

  const serviceKeys = Object.keys(SERVICE_DATA);
  const currentPkgs = SERVICE_DATA[selectedService].packages;
  const selectedPackage = selectedPkg !== null ? currentPkgs[selectedPkg] : null;
  const depositAmount = selectedPackage ? selectedPackage.deposit : 0;

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle Stripe redirect back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("booking") === "success") {
      // Submit to Formspree with saved data
      const saved = localStorage.getItem("pendingBooking");
      if (saved) {
        const data = JSON.parse(saved);
        fetch("https://formspree.io/f/xqeyrgno", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, deposit: "$" + data.deposit, payment: "Stripe deposit paid" }),
        }).catch(() => {});
        localStorage.removeItem("pendingBooking");
      }
      setSubmitted(true);
      // Fire Google Ads conversion
      if (typeof gtag === "function") gtag("event", "conversion", {"send_to": "AW-18078412608/S_40CIGMrZkcEMDeuqxD"});
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleBookingSubmit = async () => {
    if (!selectedPackage || !name || !phone || !email || !address || !bookingDate || !bookingTime) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      // Save form data to localStorage before Stripe redirect
      const bookingData = {
        name, phone, email, address,
        date: bookingDate, time: bookingTime,
        service: typeof selectedService === "string" ? selectedService : "N/A",
        package: selectedPackage.name,
        price: selectedPackage.price,
        deposit: depositAmount,
      };
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      // Create Stripe Checkout session
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          price: depositAmount,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          date: bookingDate,
          time: bookingTime,
          address,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      alert("Something went wrong creating your checkout. Please try again or call us.");
      setSubmitting(false);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/xyknrbor", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        alert("Quote request sent! We'll get back to you within 1 hour during business hours.");
        form.reset();
      } else {
        alert("Something went wrong. Please call us at (305) 570-3041.");
      }
    } catch (err) {
      alert("Something went wrong. Please call us at (305) 570-3041.");
    }
  };

  // Kill white body/html background on mobile Safari
  useEffect(() => {
    document.documentElement.style.background = "#0B1120";
    document.body.style.background = "#0B1120";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#F8FAFC", fontFamily: "'Outfit', sans-serif", overflowX: "hidden", margin: 0, padding: 0 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        html, body, #root { margin: 0; padding: 0; background: #0B1120; min-height: 100vh; }
        input, textarea, select, button { max-width: 100%; box-sizing: border-box; }
        section[id], footer[id] { scroll-margin-top: 60px; }
        /* Mobile nav fix */
        .nav-links { display: flex; gap: 20px; }
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
          nav { grid-template-columns: 1fr auto !important; padding: 12px 16px !important; }
          .nav-logo-text { font-size: 14px !important; }
          .nav-sub-text { font-size: 9px !important; letter-spacing: 2px !important; }
          .phone-btn { padding: 8px 12px !important; font-size: 11px !important; }
        }


        /* Package cards in booking form */
        .pkg-card { transition: all 0.25s ease !important; }
        .pkg-card:hover { 
          border-color: rgba(125,211,252,0.5) !important;
          box-shadow: 0 0 20px rgba(125,211,252,0.12), 0 4px 12px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }

        /* Pricing rows */
        .price-row { transition: all 0.25s ease !important; }
        .price-row:hover {
          border-color: rgba(244,114,182,0.3) !important;
          box-shadow: 0 0 16px rgba(244,114,182,0.1);
          transform: translateX(4px);
          background: rgba(30,41,59,0.6) !important;
        }

        /* Service cards */
        .svc-card { transition: all 0.3s ease !important; }
        .svc-card:hover {
          border-color: rgba(244,114,182,0.4) !important;
          box-shadow: 0 0 24px rgba(244,114,182,0.12), 0 8px 20px rgba(0,0,0,0.3);
          transform: translateY(-6px);
        }
        .svc-card:hover .svc-icon { transform: scale(1.2); }
        .svc-icon { transition: transform 0.3s ease; display: inline-block; }
        .svc-card:hover .svc-btn {
          background: rgba(244,114,182,0.2) !important;
          border-color: rgba(244,114,182,0.5) !important;
        }

        /* Booking tab buttons */
        .tab-btn { transition: all 0.2s ease !important; }
        .tab-btn:hover { opacity: 0.9; transform: scale(1.02); }

        /* CTA buttons */
        .cta-btn { transition: all 0.3s ease !important; position: relative; overflow: hidden; }
        .cta-btn:hover { transform: scale(1.02); box-shadow: 0 0 24px rgba(244,114,182,0.3); }
        .cta-btn:active { transform: scale(0.98); }

        /* Phone button in nav */
        .phone-btn { transition: all 0.25s ease !important; }
        .phone-btn:hover { box-shadow: 0 0 20px rgba(244,114,182,0.4); transform: scale(1.05); }

        /* Trust stats */
        .stat-item { transition: all 0.3s ease; }
        .stat-item:hover { transform: scale(1.08); }

        /* Service area badge */
        .area-badge { transition: all 0.3s ease; }
        .area-badge:hover { background: rgba(244,114,182,0.15) !important; border-color: rgba(244,114,182,0.5) !important; transform: scale(1.03); }

        /* Deposit summary glow */
        .deposit-box { transition: all 0.3s ease; }
        .deposit-box:hover { box-shadow: 0 0 20px rgba(34,197,94,0.15); }

        /* Input focus glow */
        input:focus, textarea:focus, select:focus {
          border-color: rgba(244,114,182,0.4) !important;
          box-shadow: 0 0 12px rgba(244,114,182,0.1);
        }

        /* Subtle entrance animation */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .fade-up-d2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .fade-up-d3 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* ========== NAV ========== */}
      <nav style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        padding: "14px 20px", borderBottom: "1px solid rgba(244,114,182,0.1)",
        background: "rgba(11,17,32,0.95)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0B1120", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,114,182,0.2)" }}>
            <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
              {[10, 16, 12, 18].map((h, i) => (
                <div key={i} style={{ width: "4px", height: `${h}px`, borderRadius: "1px", background: i % 2 === 0 ? "#F472B6" : "linear-gradient(180deg, #7DD3FC, #F472B6)" }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px" }} className="nav-logo-text">MAGIC CITY</div>
            <div style={{ fontSize: "8px", color: "#94A3B8", letterSpacing: "3px" }} className="nav-sub-text">SERVICES</div>
          </div>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: "24px", fontSize: "13px", fontWeight: 500 }}>
          {[
            { label: "SERVICES", target: "services" },
            { label: "BOOK NOW", target: "booking" },
            { label: "AREAS", target: "areas" },
            { label: "ABOUT", target: "footer" },
          ].map(l => (
            <span key={l.label} onClick={() => document.getElementById(l.target)?.scrollIntoView({ behavior: "smooth" })} style={{ color: "#94A3B8", cursor: "pointer", letterSpacing: "0.5px", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#F472B6"}
              onMouseLeave={e => e.target.style.color = "#94A3B8"}
            >{l.label}</span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="tel:3055703041" className="phone-btn" style={{
            padding: "8px 16px", borderRadius: "20px",
            background: "linear-gradient(135deg, #F472B6, #E04DA0)",
            color: "#fff", fontSize: "12px", fontWeight: 600, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "6px",
          }}>📞 (305) 570-3041</a>
        </div>
      </nav>

      {/* ========== SECTION 1: HERO ========== */}
      <section style={{ padding: "55px 20px 45px", textAlign: "center", background: "linear-gradient(180deg, #0B1120 0%, #131B2E 100%)" }}>
        <div className="area-badge" style={{
          display: "inline-block", padding: "6px 20px", borderRadius: "20px",
          border: "1px solid rgba(244,114,182,0.3)", background: "rgba(244,114,182,0.08)",
          fontSize: "11px", color: "#F472B6", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px",
        }}>
          Serving Miami-Dade, Broward & Palm Beach
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 6vw, 50px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 16px" }}>
          Miami's Premier{"\n"}
          <span style={{ background: "linear-gradient(135deg, #F472B6, #7DD3FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Home & Auto Services
          </span>
        </h1>

        <p style={{ fontSize: "16px", color: "#94A3B8", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.6 }}>
          Junk removal, pressure washing, and mobile detailing — all from one trusted team. Professional service, transparent pricing, guaranteed satisfaction.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "36px" }}>
          {[{ big: "Insured", sub: "PROFESSIONALS" }, { big: "Guaranteed", sub: "SATISFACTION" }, { big: "Same Day", sub: "SERVICE AVAILABLE" }].map((s, i) => (
            <div key={i} className="stat-item" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>{s.big}</div>
              <div style={{ fontSize: "9px", color: "#94A3B8", letterSpacing: "1px", marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 2: BOOKING (with deposits) ========== */}
      <section id="booking" style={{ padding: "40px 16px 50px", background: "linear-gradient(180deg, #131B2E 0%, #0B1120 100%)" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, margin: "0 0 6px" }}>Book Your Service</h2>
            <p style={{ fontSize: "13px", color: "#94A3B8" }}>Schedule online, get a free quote, or call us directly</p>
          </div>

          {/* 3-Tab Selector */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "rgba(30,41,59,0.5)", borderRadius: "12px", padding: "4px" }}>
            {[
              { id: "book", label: "Book Online" },
              { id: "quote", label: "Get a Quote" },
              { id: "call", label: "Call Now" },
            ].map(tab => (
              <button key={tab.id} className="tab-btn" onClick={() => setBookingTab(tab.id)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px", border: "none",
                  background: bookingTab === tab.id ? "linear-gradient(135deg, #F472B6, #7DD3FC)" : "transparent",
                  color: bookingTab === tab.id ? "#0B1120" : "#94A3B8",
                  fontSize: "13px", fontWeight: bookingTab === tab.id ? 700 : 500,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >{tab.label}</button>
            ))}
          </div>

          {/* ---- BOOK ONLINE TAB ---- */}
          {bookingTab === "book" && (
            <div style={{ padding: "24px 20px", borderRadius: "16px", background: "rgba(30,41,59,0.3)", border: "1px solid rgba(148,163,184,0.1)" }}>

              {/* Service Selector */}
              <label style={labelStyle}>Select Service</label>
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                {serviceKeys.map(s => (
                  <button key={s} onClick={() => { setSelectedService(s); setSelectedPkg(null); }}
                    style={{
                      flex: 1, padding: "10px 6px", borderRadius: "10px",
                      border: selectedService === s ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.15)",
                      background: selectedService === s ? "rgba(244,114,182,0.12)" : "transparent",
                      color: selectedService === s ? "#F472B6" : "#94A3B8",
                      fontSize: "11px", fontWeight: selectedService === s ? 600 : 400,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >{SERVICE_DATA[s].icon} {s}</button>
                ))}
              </div>

              {/* Package Selector with Deposit */}
              <label style={labelStyle}>Select Package</label>
              {currentPkgs.map((pkg, i) => (
                <button key={i} className="pkg-card" onClick={() => setSelectedPkg(i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px", marginBottom: "8px", borderRadius: "12px",
                    border: selectedPkg === i ? "1px solid rgba(125,211,252,0.4)" : "1px solid rgba(148,163,184,0.1)",
                    background: selectedPkg === i ? "rgba(125,211,252,0.08)" : "rgba(30,41,59,0.3)",
                    color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {pkg.tag && (
                    <div style={{
                      position: "absolute", top: "0", right: "0",
                      padding: "2px 10px", borderRadius: "0 10px 0 8px",
                      background: pkg.tag === "Best Value" ? "rgba(34,197,94,0.2)" : "rgba(244,114,182,0.2)",
                      fontSize: "9px", fontWeight: 700, letterSpacing: "0.5px",
                      color: pkg.tag === "Best Value" ? "#22C55E" : "#F472B6",
                    }}>{pkg.tag}</div>
                  )}
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: selectedPkg === i ? "#7DD3FC" : "#F8FAFC" }}>{pkg.name}</div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "3px" }}>{pkg.note}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#7DD3FC" }}>{pkg.price}</div>
                    <div style={{
                      fontSize: "10px", fontWeight: 600, marginTop: "2px",
                      color: "#22C55E", background: "rgba(34,197,94,0.1)",
                      padding: "2px 8px", borderRadius: "4px", display: "inline-block",
                    }}>${pkg.deposit} deposit</div>
                  </div>
                </button>
              ))}

              {/* Date & Time */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px", marginBottom: "14px" }}>
                <div style={{ flex: "1 1 0", minWidth: 0 }}>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                    style={{ ...inputStyle, height: "46px", WebkitAppearance: "none", lineHeight: "24px", padding: "10px 12px" }} />
                </div>
                <div style={{ flex: "1 1 0", minWidth: 0 }}>
                  <label style={labelStyle}>Time</label>
                  <select value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                    style={{ ...inputStyle, height: "46px", WebkitAppearance: "none", lineHeight: "24px", padding: "10px 12px", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394A3B8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                    <option value="">Select time</option>
                    {TIMES.filter(t => {
                      if (!bookingDate) return true;
                      const today = new Date().toISOString().split("T")[0];
                      if (bookingDate !== today) return true;
                      const now = new Date();
                      const [timePart, ampm] = t.value.split(" ");
                      const [hr, min] = timePart.split(":").map(Number);
                      let h24 = hr;
                      if (ampm === "PM" && hr !== 12) h24 = hr + 12;
                      if (ampm === "AM" && hr === 12) h24 = 0;
                      return h24 > now.getHours() || (h24 === now.getHours() && min > now.getMinutes());
                    }).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Contact Fields */}
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ ...inputStyle, marginBottom: "10px" }} />
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(305) 000-0000" style={{ ...inputStyle, marginBottom: "10px" }} />
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ ...inputStyle, marginBottom: "10px" }} />
              <label style={labelStyle}>Service Address</label>
              <AddressAutocomplete value={address} onChange={setAddress} placeholder="Street, City, State, Zip Code" inputStyle={{ ...inputStyle, marginBottom: "20px" }} />

              {/* Deposit Summary + CTA */}
              {selectedPackage && (
                <div style={{
                  padding: "14px", borderRadius: "12px", marginBottom: "14px",
                  background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(125,211,252,0.08))",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }} className="deposit-box">
                  <div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>Deposit to confirm booking</div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Remaining balance due after service</div>
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#22C55E" }}>${depositAmount}</div>
                </div>
              )}

              <button style={{
                width: "100%", padding: "15px", borderRadius: "12px", border: "none",
                background: selectedPackage ? "linear-gradient(135deg, #F472B6, #7DD3FC)" : "rgba(148,163,184,0.2)",
                color: selectedPackage ? "#0B1120" : "#94A3B8",
                fontSize: "15px", fontWeight: 700, cursor: selectedPackage ? "pointer" : "default",
                fontFamily: "inherit", opacity: selectedPackage ? 1 : 0.5,
              }} className="cta-btn" onClick={handleBookingSubmit} disabled={submitting || submitted || !selectedPackage}>
                {submitting ? "Submitting..." : submitted ? "Booking Submitted! ✅" : selectedPackage ? `Confirm Booking — $${depositAmount} Deposit` : "Select a package to continue"}
              </button>

              {submitted && (
                <div style={{ textAlign: "center", padding: "14px", marginTop: "12px", borderRadius: "12px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#22C55E", marginBottom: "4px" }}>Booking received! 🎉</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>Check your email for confirmation. A team member will reach out within 30 minutes.</div>
                </div>
              )}
              {!submitted && (
              <p style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginTop: "10px", lineHeight: 1.4 }}>
                Deposit secures your time slot. Remaining balance due after service is completed to your satisfaction.
                <br />Final price confirmed after on-site estimate.
              </p>
              )}
            </div>
          )}

          {/* ---- GET A QUOTE TAB (free, no deposit) ---- */}
          {bookingTab === "quote" && (
            <form style={{ padding: "24px 20px", borderRadius: "16px", background: "rgba(30,41,59,0.3)", border: "1px solid rgba(148,163,184,0.1)" }}>
              <div style={{
                padding: "10px 14px", borderRadius: "10px", marginBottom: "16px",
                background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
                fontSize: "12px", color: "#22C55E", textAlign: "center", fontWeight: 500,
              }}>Free quote — no deposit required</div>

              <label style={labelStyle}>What service do you need?</label>
              <select style={{ ...inputStyle, marginBottom: "12px" }}>
                <option>Junk Removal</option><option>Pressure Washing</option><option>Mobile Detailing</option>
              </select>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Your full name" name="name" style={{ ...inputStyle, marginBottom: "10px" }} />
              <label style={labelStyle}>Phone</label>
              <input type="tel" placeholder="(305) 000-0000" name="phone" style={{ ...inputStyle, marginBottom: "10px" }} />
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="your@email.com" name="email" style={{ ...inputStyle, marginBottom: "10px" }} />
              <label style={labelStyle}>Describe what you need</label>
              <textarea placeholder="Tell us about the job — what needs to be done, property type, any special access instructions..." rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5, marginBottom: "16px" }} />
              <button style={{
                width: "100%", padding: "15px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #F472B6, #7DD3FC)",
                color: "#0B1120", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }} className="cta-btn">Get My Free Quote</button>
            </form>
          )}

          {/* ---- CALL NOW TAB ---- */}
          {bookingTab === "call" && (
            <div style={{ padding: "30px 20px", borderRadius: "16px", textAlign: "center", background: "rgba(30,41,59,0.3)", border: "1px solid rgba(148,163,184,0.1)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📞</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", margin: "0 0 8px" }}>Call Us Directly</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "6px" }}>Speak with a team member right now</p>
              <div style={{
                display: "inline-block", padding: "6px 14px", borderRadius: "8px", marginBottom: "20px",
                background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
                fontSize: "12px", color: "#22C55E", fontWeight: 500,
              }}>No deposit required — book over the phone for free</div>
              <br />
              <a href="tel:3055703041" style={{
                display: "inline-block", padding: "14px 32px", borderRadius: "12px",
                background: "linear-gradient(135deg, #F472B6, #E04DA0)",
                color: "#fff", fontSize: "18px", fontWeight: 700, textDecoration: "none", fontFamily: "inherit",
              }}>(305) 570-3041</a>
              <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "16px" }}>Available 7 AM – 9 PM, 7 days a week</p>
            </div>
          )}
        </div>
      </section>

      {/* ========== SECTION 3: PRICING ========== */}
      <section style={{ padding: "50px 16px", background: "linear-gradient(180deg, #0B1120 0%, #131B2E 100%)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", textAlign: "center", marginBottom: "6px" }}>
            Transparent <span style={{ color: "#7DD3FC" }}>Pricing</span>
          </h2>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#94A3B8", marginBottom: "24px" }}>No hidden fees. No surprises. Just honest pricing.</p>

          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "rgba(30,41,59,0.5)", borderRadius: "12px", padding: "4px" }}>
            {serviceKeys.map(key => (
              <button key={key} onClick={() => setActivePriceTab(key)}
                style={{
                  flex: 1, padding: "8px", borderRadius: "10px", border: "none",
                  background: activePriceTab === key ? "rgba(244,114,182,0.15)" : "transparent",
                  color: activePriceTab === key ? "#F472B6" : "#94A3B8",
                  fontSize: "11px", fontWeight: activePriceTab === key ? 600 : 400,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >{key}</button>
            ))}
          </div>

          {SERVICE_DATA[activePriceTab].packages.map((pkg, i) => (
            <div key={i} className="price-row" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px", marginBottom: "8px", borderRadius: "12px",
              background: "rgba(30,41,59,0.4)", border: "1px solid rgba(148,163,184,0.08)",
            }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>{pkg.name}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{pkg.note}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#7DD3FC" }}>{pkg.price}</div>
                <div style={{ fontSize: "10px", color: "#22C55E", marginTop: "2px" }}>${pkg.deposit} deposit to book</div>
              </div>
            </div>
          ))}

          <p style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginTop: "12px" }}>
            Deposit secures your appointment. Remaining balance due after completed service. Call to book with no deposit.
          </p>
        </div>
      </section>

      {/* ========== SECTION 4: SERVICES ========== */}
      <section id="services" style={{ padding: "50px 16px", background: "linear-gradient(180deg, #131B2E 0%, #0B1120 100%)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", textAlign: "center", marginBottom: "24px" }}>
          Our <span style={{ color: "#F472B6" }}>Services</span>
        </h2>
        <div style={{ display: "flex", gap: "12px", maxWidth: "600px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
          {CROSS_LINKS.map((s, i) => (
            <a key={i} href={`https://${s.link}`} target="_blank" rel="noopener noreferrer" className="svc-card" style={{
              flex: "1 1 170px", padding: "24px 16px", borderRadius: "16px", textAlign: "center",
              background: "rgba(30,41,59,0.4)", border: "1px solid rgba(148,163,184,0.1)", cursor: "pointer",
              textDecoration: "none", color: "#F8FAFC", transition: "all 0.2s",
            }}>
              <div className="svc-icon" style={{ fontSize: "36px", marginBottom: "12px" }}>{s.icon}</div>
              <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{s.name}</div>
              <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.4, marginBottom: "14px" }}>
                {s.name === "Junk Removal" ? "Furniture, debris, full cleanouts" : s.name === "Pressure Washing" ? "Driveways, exteriors, roofs, decks" : "Interior, exterior, ceramic coating"}
              </div>
              <div style={{
                padding: "8px 16px", borderRadius: "8px",
                background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.2)",
                fontSize: "11px", color: "#F472B6", fontWeight: 600,
              }} className="svc-btn">View Details →</div>
            </a>
          ))}
        </div>
      </section>

      {/* ========== SECTION 5: AREAS ========== */}
      <section id="areas" style={{ padding: "50px 16px", background: "linear-gradient(180deg, #0B1120 0%, #131B2E 100%)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", textAlign: "center", marginBottom: "24px" }}>
          Areas We <span style={{ color: "#7DD3FC" }}>Serve</span>
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
          {AREAS.map((area, i) => (
            <span key={i}
              onMouseEnter={() => setHoveredArea(i)} onMouseLeave={() => setHoveredArea(null)}
              style={{
                padding: "8px 16px", borderRadius: "20px",
                border: hoveredArea === i ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.15)",
                background: hoveredArea === i ? "rgba(244,114,182,0.1)" : "rgba(30,41,59,0.3)",
                color: hoveredArea === i ? "#F472B6" : "#94A3B8",
                fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
              }}
            >{area}</span>
          ))}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer id="footer" style={{ padding: "30px 16px", textAlign: "center", borderTop: "1px solid rgba(148,163,184,0.1)", background: "#0B1120" }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700,
          background: "linear-gradient(135deg, #F472B6, #7DD3FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "8px",
        }}>Magic City Services</div>
        <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "12px" }}>Miami-Dade • Broward • Palm Beach</p>
        <p style={{ fontSize: "12px", color: "#F472B6", fontWeight: 600, letterSpacing: "1px", marginBottom: "8px" }}>Contact Us:</p>
        <a href="tel:3055703041" style={{ fontSize: "14px", color: "#7DD3FC", textDecoration: "none", fontWeight: 600 }}>(305) 570-3041</a>
        <br />
        <a href="mailto:info@magiccityservicesmiami.com" style={{ fontSize: "13px", color: "#F472B6", textDecoration: "none", fontWeight: 500, marginTop: "6px", display: "inline-block" }}>info@magiccityservicesmiami.com</a>
        <p style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)", marginTop: "16px" }}>© 2026 Magic City Services LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}

const labelStyle = {
  fontSize: "11px", color: "#94A3B8", display: "block", marginBottom: "6px",
  letterSpacing: "0.5px", textTransform: "uppercase",
};

const inputStyle = {
  width: "100%", padding: "11px 12px", borderRadius: "8px",
  border: "1px solid rgba(148,163,184,0.2)", background: "rgba(11,17,32,0.8)",
  color: "#F8FAFC", fontSize: "14px", fontFamily: "'Outfit', sans-serif",
  outline: "none", boxSizing: "border-box",
};
