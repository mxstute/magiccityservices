import { useState, useEffect } from "react";

const PINK = "#F472B6";
const BLUE = "#7DD3FC";
const DARK = "#0B1120";
const DARK2 = "#111827";
const DARK3 = "#1E293B";
const LIGHT = "#F8FAFC";
const GRAY = "#94A3B8";
const PHONE = "(305) 555-0199";

const services = [
  {
    name: "Junk Removal",
    tag: "HAULING & CLEANOUTS",
    desc: "Garage cleanouts, construction debris, furniture removal, estate cleanups, and appliance disposal. We handle the heavy lifting so you don't have to.",
    items: ["Residential & commercial cleanouts", "Construction debris removal", "Furniture & appliance hauling", "Estate & foreclosure cleanups", "Same-day service available"],
    price: "Starting at $149",
    emoji: "🚛",
    accent: PINK,
  },
  {
    name: "Pressure Washing",
    tag: "EXTERIOR RESTORATION",
    desc: "Driveways, sidewalks, pool decks, building exteriors, and fences restored to like-new condition. South Florida's humidity doesn't stand a chance.",
    items: ["Driveway & sidewalk cleaning", "House & building exteriors", "Pool deck & patio restoration", "Roof soft washing", "Commercial property maintenance"],
    price: "Starting at $129",
    emoji: "💦",
    accent: BLUE,
  },
  {
    name: "Mobile Detailing",
    tag: "PREMIUM AUTO CARE",
    desc: "Full interior and exterior detailing brought directly to your home or office. From daily drivers to exotics — we treat every vehicle like it's our own.",
    items: ["Full interior deep clean", "Exterior wash, clay bar & wax", "Paint correction & ceramic coating", "Engine bay detailing", "Fleet & dealership packages"],
    price: "Starting at $89",
    emoji: "✨",
    accent: PINK,
  },
];

const steps = [
  { num: "01", title: "Call or Request a Quote", desc: "Reach out by phone or fill out our quick form. We respond within minutes — not hours." },
  { num: "02", title: "Get Your Custom Quote", desc: "We'll assess the job scope and give you a transparent, fair price. No hidden fees, no surprises." },
  { num: "03", title: "We Handle Everything", desc: "Our vetted professionals arrive on time, complete the work to our standards, and leave your property better than they found it." },
  { num: "04", title: "Pay & Review", desc: "Flexible payment options including card, cash, and digital wallets. Leave us a review and help your neighbors find us too." },
];

const areas = ["Miami", "Miami Beach", "Coral Gables", "Hialeah", "Doral", "Kendall", "Homestead", "Aventura", "North Miami", "Brickell", "Wynwood", "Little Havana", "Coconut Grove", "Key Biscayne", "Pinecrest", "Palmetto Bay"];

function Icon({ children, size = 20 }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>{children}</span>;
}

function PhoneButton({ variant = "pink", size = "lg", fullWidth = false }) {
  const isPink = variant === "pink";
  return (
    <a
      href={`tel:${PHONE.replace(/[^0-9]/g, "")}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: size === "lg" ? "16px 36px" : "12px 24px",
        background: isPink ? PINK : "transparent",
        color: isPink ? "#fff" : PINK,
        border: isPink ? "none" : `1.5px solid ${PINK}`,
        borderRadius: 50,
        fontFamily: "'Outfit', sans-serif",
        fontSize: size === "lg" ? 17 : 15,
        fontWeight: 600,
        letterSpacing: 0.5,
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        width: fullWidth ? "100%" : "auto",
        justifyContent: "center",
      }}
    >
      <span>📞</span> {PHONE}
    </a>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const linkStyle = {
    color: LIGHT, fontFamily: "'Outfit', sans-serif", fontSize: 13,
    fontWeight: 500, letterSpacing: 1.5, textDecoration: "none",
    textTransform: "uppercase", transition: "color 0.2s",
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 max(24px, 4vw)",
      background: scrolled ? "rgba(11,17,32,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(244,114,182,0.1)` : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 20 }}>
              {[12, 18, 14, 20, 16].map((h, i) => (
                <div key={i} style={{ width: 4, height: h, borderRadius: 1, background: i % 2 === 0 ? "#fff" : BLUE }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: PINK, letterSpacing: 1, lineHeight: 1.1 }}>MAGIC CITY</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 400, color: BLUE, letterSpacing: 3, lineHeight: 1.1 }}>SERVICES</div>
          </div>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-links-desktop">
          {["Services", "How It Works", "Areas", "About"].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(/ /g, "-")}`} style={linkStyle}>{t}</a>
          ))}
          <PhoneButton size="sm" />
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{
          display: "none", background: "none", border: "none", color: LIGHT, fontSize: 28, cursor: "pointer", padding: 4,
        }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" style={{
          padding: "20px 0 30px", display: "flex", flexDirection: "column", gap: 20, alignItems: "center",
          background: "rgba(11,17,32,0.98)", borderTop: `1px solid rgba(244,114,182,0.1)`,
        }}>
          {["Services", "How It Works", "Areas", "About"].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} style={{ ...linkStyle, fontSize: 15 }}>{t}</a>
          ))}
          <PhoneButton size="sm" />
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(165deg, ${DARK} 0%, #0F1B2E 40%, #1A1035 100%)`,
      position: "relative", overflow: "hidden", padding: "100px max(24px, 4vw) 60px",
    }}>
      <div style={{
        position: "absolute", top: "10%", right: "-5%", width: "50vw", height: "50vw",
        background: `radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)`,
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "-10%", width: "40vw", height: "40vw",
        background: `radial-gradient(circle, rgba(125,211,252,0.06) 0%, transparent 70%)`,
        borderRadius: "50%",
      }} />

      <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-block", padding: "6px 20px", borderRadius: 50,
          border: `1px solid rgba(244,114,182,0.3)`, marginBottom: 28,
          fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500,
          color: PINK, letterSpacing: 2, textTransform: "uppercase",
        }}>
          Serving All of Miami-Dade County
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 68px)",
          fontWeight: 700, color: LIGHT, lineHeight: 1.1, margin: "0 0 10px",
        }}>
          Miami's Premier
        </h1>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 68px)",
          fontWeight: 700, lineHeight: 1.1, margin: "0 0 24px",
          background: `linear-gradient(135deg, ${PINK}, ${BLUE})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Home & Auto Services
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: "clamp(16px, 2vw, 20px)",
          color: GRAY, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px",
        }}>
          Junk removal, pressure washing, and mobile detailing — all from one trusted team. Professional service, transparent pricing, guaranteed satisfaction.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <PhoneButton variant="pink" size="lg" />
          <a href="#services" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 36px", background: "transparent", color: BLUE,
            border: `1.5px solid rgba(125,211,252,0.3)`, borderRadius: 50,
            fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600,
            textDecoration: "none", letterSpacing: 0.5,
          }}>
            View Services ↓
          </a>
        </div>

        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[
            { val: "500+", label: "Jobs Completed" },
            { val: "4.9★", label: "Average Rating" },
            { val: "Same Day", label: "Service Available" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: LIGHT }}>{s.val}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: GRAY, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" style={{ background: DARK2, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: PINK, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>What We Do</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: LIGHT, margin: 0 }}>Three Services, One Call</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {services.map(s => (
            <div key={s.name} style={{
              background: DARK3, borderRadius: 20, padding: 36, position: "relative", overflow: "hidden",
              border: `1px solid rgba(255,255,255,0.04)`, transition: "transform 0.3s, box-shadow 0.3s",
            }}>
              <div style={{
                position: "absolute", top: -30, right: -30, width: 120, height: 120,
                background: `radial-gradient(circle, ${s.accent}11 0%, transparent 70%)`, borderRadius: "50%",
              }} />

              <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: s.accent, letterSpacing: 3, marginBottom: 8 }}>{s.tag}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: LIGHT, margin: "0 0 12px" }}>{s.name}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {s.items.map(item => (
                  <li key={item} style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#CBD5E1",
                    padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ color: s.accent, fontSize: 10 }}>●</span> {item}
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: LIGHT }}>{s.price}</span>
                <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} style={{
                  padding: "10px 22px", borderRadius: 50, background: `${s.accent}18`,
                  border: `1px solid ${s.accent}44`, color: s.accent,
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                  textDecoration: "none", letterSpacing: 0.5,
                }}>
                  Get a Quote →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      background: `linear-gradient(180deg, ${DARK} 0%, ${DARK2} 100%)`,
      padding: "100px max(24px, 4vw)",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: LIGHT, margin: 0 }}>How It Works</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ textAlign: "center", position: "relative" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: i === 0 ? PINK : `rgba(125,211,252,0.08)`,
                border: i === 0 ? "none" : `1px solid rgba(125,211,252,0.15)`,
              }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700,
                  color: i === 0 ? "#fff" : BLUE,
                }}>{s.num}</span>
              </div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: LIGHT, margin: "0 0 8px" }}>{s.title}</h4>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <PhoneButton variant="pink" size="lg" />
        </div>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section id="areas" style={{ background: DARK2, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: PINK, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Coverage</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: LIGHT, margin: "0 0 16px" }}>Service Areas</h2>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, color: GRAY, marginBottom: 40 }}>
          We proudly serve all of Miami-Dade County and surrounding areas.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {areas.map(a => (
            <span key={a} style={{
              padding: "8px 18px", borderRadius: 50,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: "#CBD5E1",
            }}>{a}</span>
          ))}
        </div>

        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, marginTop: 32 }}>
          Don't see your area? <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} style={{ color: PINK, textDecoration: "none", fontWeight: 600 }}>Call us</a> — we likely cover it.
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{
      background: `linear-gradient(180deg, ${DARK} 0%, ${DARK2} 100%)`,
      padding: "100px max(24px, 4vw)",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: LIGHT, margin: "0 0 20px" }}>Built for Miami</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: GRAY, lineHeight: 1.8, maxWidth: 620, margin: "0 auto" }}>
            Magic City Services was founded with one mission: make it effortless for Miami homeowners and businesses to get quality service without the runaround. We connect you with vetted, insured professionals who show up on time and deliver results — every single time.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: "🛡️", title: "Licensed & Insured", desc: "Every job is backed by our general liability coverage. Your property is protected." },
            { icon: "⚡", title: "Fast Response", desc: "We respond to every inquiry within minutes. Same-day service available for most jobs." },
            { icon: "💯", title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right. Our reputation is built on every single job we complete." },
            { icon: "💳", title: "Flexible Payment", desc: "We accept all major cards, cash, Zelle, and CashApp. Pay however works best for you." },
          ].map(f => (
            <div key={f.title} style={{
              background: DARK3, borderRadius: 16, padding: 28,
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: LIGHT, margin: "0 0 6px" }}>{f.title}</h4>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="quote" style={{ background: DARK2, padding: "100px max(24px, 4vw)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: PINK, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Get Started</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: LIGHT, margin: "0 0 12px" }}>Request a Free Quote</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: GRAY }}>We'll get back to you within the hour — usually much faster.</p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: 60, background: DARK3, borderRadius: 20, border: "1px solid rgba(244,114,182,0.15)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 600, color: LIGHT, margin: "0 0 8px" }}>Quote Request Received!</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: GRAY }}>We'll be in touch shortly. Need immediate help?</p>
            <div style={{ marginTop: 20 }}><PhoneButton size="sm" /></div>
          </div>
        ) : (
          <div style={{ background: DARK3, borderRadius: 20, padding: "40px 36px", border: "1px solid rgba(255,255,255,0.04)" }}>
            {[
              { label: "Name", type: "text", placeholder: "Your full name" },
              { label: "Phone", type: "tel", placeholder: "(305) 000-0000" },
              { label: "Email", type: "email", placeholder: "your@email.com" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} style={{
                  width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)", color: LIGHT, fontFamily: "'Outfit', sans-serif", fontSize: 15,
                  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                }} onFocus={e => e.target.style.borderColor = `${PINK}55`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Service Needed</label>
              <select style={{
                width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                background: DARK3, color: LIGHT, fontFamily: "'Outfit', sans-serif", fontSize: 15,
                outline: "none", boxSizing: "border-box", appearance: "none",
              }}>
                <option>Junk Removal</option>
                <option>Pressure Washing</option>
                <option>Mobile Detailing</option>
                <option>Multiple Services</option>
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: GRAY, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Job Details</label>
              <textarea placeholder="Tell us about the job..." rows={4} style={{
                width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)", color: LIGHT, fontFamily: "'Outfit', sans-serif", fontSize: 15,
                outline: "none", boxSizing: "border-box", resize: "vertical",
              }} onFocus={e => e.target.style.borderColor = `${PINK}55`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            </div>

            <button onClick={() => setSubmitted(true)} style={{
              width: "100%", padding: "16px", borderRadius: 50, border: "none",
              background: `linear-gradient(135deg, ${PINK}, #E04DA0)`, color: "#fff",
              fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700,
              letterSpacing: 0.5, cursor: "pointer",
            }}>
              Submit Quote Request
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: DARK, padding: "60px max(24px, 4vw) 30px",
      borderTop: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
                  {[10, 14, 12, 16, 13].map((h, i) => (
                    <div key={i} style={{ width: 3, height: h, borderRadius: 1, background: i % 2 === 0 ? "#fff" : BLUE }} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: PINK, letterSpacing: 1, lineHeight: 1.1 }}>MAGIC CITY</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8, fontWeight: 400, color: BLUE, letterSpacing: 3, lineHeight: 1.1 }}>SERVICES</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: GRAY, lineHeight: 1.7, maxWidth: 260 }}>
              Miami-Dade County's trusted source for junk removal, pressure washing, and mobile detailing.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: LIGHT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Services</h4>
            {["Junk Removal", "Pressure Washing", "Mobile Detailing"].map(s => (
              <div key={s} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>{s}</div>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: LIGHT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Contact</h4>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>{PHONE}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>info@magiccityservices.com</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY }}>Miami-Dade County, FL</div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: LIGHT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Hours</h4>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>Mon – Sat: 7am – 7pm</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: GRAY, marginBottom: 10 }}>Sunday: 9am – 5pm</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: PINK, fontWeight: 600, marginTop: 8 }}>Emergency? Call anytime.</div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#475569" }}>
            © 2026 Magic City Services LLC. All rights reserved.
          </span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#475569" }}>
            Licensed & Insured — Miami-Dade County, FL
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function MagicCityServices() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${DARK}; }
        ::selection { background: ${PINK}44; color: #fff; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
        input:focus, textarea:focus, select:focus { border-color: ${PINK}55 !important; }
      `}</style>
      <Nav />
      <Hero />
      <Services />
      <HowItWorks />
      <Areas />
      <About />
      <QuoteForm />
      <Footer />
    </>
  );
}
