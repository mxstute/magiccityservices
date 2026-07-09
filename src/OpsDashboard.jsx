import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// MAGIC CITY SERVICES — OPERATIONS DASHBOARD v2
// Updated April 15, 2026 — All pricing current
// ═══════════════════════════════════════════════════════

// ── PRICING DATA (Updated 4/14-4/15/2026) ───────────

const SERVICES_DATA = {
  "Pressure Washing": {
    icon: "🏠", phone: "(305) 783-3133", site: "magiccitypressurewashingmiami.com",
    items: [
      { name: "Driveway / Sidewalk", price: 250, range: null, deposit: 50 },
      { name: "House Exterior (1-Story)", price: 350, range: 400, deposit: 75 },
      { name: "House Exterior (2-Story)", price: 600, range: 650, deposit: 250 },
      { name: "Pool Deck / Patio", price: 200, range: null, deposit: 50 },
      { name: "Roof Soft Wash (Shingle)", price: 399, range: 499, deposit: 200 },
      { name: "Roof Soft Wash (Tile)", price: 499, range: 649, deposit: 250 },
      { name: "Roof Soft Wash (2-Story Tile)", price: 699, range: 849, deposit: 350 },
      { name: "Fence / Wall", price: 200, range: null, deposit: 40 },
      { name: "Full Property Package", price: 999, range: 1399, deposit: 500 },
      { name: "Gutter Cleaning (Add-On)", price: 75, range: 125, deposit: 0 },
    ],
  },
  "Junk Removal": {
    icon: "🚛", phone: "(786) 822-8281", site: "magiccityjunkremovalmiami.com",
    items: [
      { name: "Half Truck Load", price: 400, range: null, deposit: 75 },
      { name: "Full Truck Load", price: 750, range: null, deposit: 275 },
      { name: "Complete Cleanout", price: 1000, range: null, deposit: 425 },
    ],
  },
  "Mobile Detailing": {
    icon: "🚗", phone: "(305) 306-8078", site: "magiccitydetailingmiami.com",
    items: [
      { name: "Interior Detail", price: 249, range: null, deposit: 65 },
      { name: "Full Detail (Int + Ext)", price: 349, range: null, deposit: 90 },
      { name: "Showroom Elite", price: 599, range: null, deposit: 300 },
      { name: "Ceramic Coating", price: 999, range: null, deposit: 500 },
      { name: "Headlight Restoration", price: 79, range: 99, deposit: 0 },
      { name: "Paint Correction (Add-On)", price: 249, range: null, deposit: 0 },
      { name: "Pet Hair Removal", price: 59, range: null, deposit: 0 },
      { name: "Odor Elimination", price: 99, range: null, deposit: 0 },
      { name: "Engine Bay Detail", price: 89, range: null, deposit: 0 },
    ],
  },
  "Painting": {
    icon: "🎨", phone: "(305) 783-3133", site: "magiccitypressurewashingmiami.com",
    items: [
      { name: "Interior Room", price: 300, range: 800, deposit: 0, customSplit: { contractor: 75, company: 25 } },
      { name: "Exterior (1-Story)", price: 3000, range: 5000, deposit: 0, customSplit: { contractor: 75, company: 25 } },
      { name: "Exterior (2-Story)", price: 5000, range: 8000, deposit: 0, customSplit: { contractor: 75, company: 25 } },
      { name: "Per Sq Ft", price: 2, range: null, deposit: 0, customSplit: { contractor: 75, company: 25 }, isPerUnit: true, unit: "sq ft" },
      { name: "Cabinet Painting", price: 1500, range: 3500, deposit: 0, customSplit: { contractor: 75, company: 25 } },
      { name: "Accent Wall", price: 200, range: 400, deposit: 0, customSplit: { contractor: 75, company: 25 } },
    ],
  },
  "Steve's Services": {
    icon: "🪟", phone: "(305) 783-3133", site: "magiccitypressurewashingmiami.com",
    items: [
      { name: "Window Washing (per window)", price: 10, range: null, deposit: 0, customSplit: { contractor: 70, company: 30 } },
      { name: "Window Seals & Screens", price: 0, range: null, deposit: 0, customSplit: { contractor: 50, company: 50 }, isCustomQuote: true },
      { name: "Concrete Sealing (per sq ft)", price: 2.50, range: null, deposit: 0, customSplit: { contractor: 60, company: 40 }, isPerUnit: true, unit: "sq ft" },
      { name: "Roof Tile Sealing (per sq ft)", price: 2.85, range: null, deposit: 0, customSplit: { contractor: 60, company: 40 }, isPerUnit: true, unit: "sq ft" },
    ],
  },
};

const SPLITS = [
  { label: "50/50", contractor: 50, company: 50 },
  { label: "55/45", contractor: 55, company: 45 },
  { label: "60/40", contractor: 60, company: 40 },
  { label: "70/30", contractor: 70, company: 30 },
  { label: "75/25", contractor: 75, company: 25 },
];

const TIME_SLOTS = [
  { label: "Early Bird", range: "7:00–7:45 AM", fee: 25 },
  { label: "Standard", range: "8:00 AM–5:45 PM", fee: 0 },
  { label: "After Hours", range: "6:00–9:00 PM", fee: 25 },
];

const SERVICE_LIST = ["Junk Removal", "Pressure Washing", "Mobile Detailing", "Window Services", "Painting & Sealing"];
const JOB_STATUSES = ["New", "Dispatched", "In Progress", "Completed", "Paid"];
const STATUS_COLORS = { New: "#F472B6", Dispatched: "#7DD3FC", "In Progress": "#FBBF24", Completed: "#22C55E", Paid: "#A78BFA" };

const CONTRACTORS = [
  { name: "Steve (Esteban Santana)", services: ["Pressure Washing", "Window Services", "Painting & Sealing"], phone: "(786) 681-7782", email: "renovation.management.florida@gmail.com", status: "active", split: "50/50", notes: "Most valuable. Windows 70/30, painting 75/25, sealing 60/40." },
  { name: "Gerardo Prado", services: ["Pressure Washing"], phone: "(561) 360-0280", email: "laloprado19@gmail.com", status: "active", split: "55/45", notes: "Crew contractor. 55/45 split for crew overhead." },
  { name: "K1 Mobile Detailing (Kevin & Clayton)", services: ["Mobile Detailing"], phone: "(954) 549-8507", email: "k1mobiledetailing@gmail.com", status: "active", split: "30/70", notes: "347 Google reviews. Overflow/premium contractor. Plantation FL (Broward)." },
  { name: "Victor Gonzalez", services: ["Pressure Washing"], phone: "(786) 910-4134", email: "ProsPropertymaintenance@gmail.com", status: "pending", split: "50/50", notes: "PW 10+ yrs. Covers WPB to Keys. Contract sent." },
  { name: "Mason Hyatt", services: ["Junk Removal"], phone: "(954) 296-5802", email: "Masonhyatt787@gmail.com", status: "pending", split: "50/50", notes: "Two box trucks + trailer. Crew of 2-6. Contract sent." },
  { name: "Matthew Betancurt", services: ["Junk Removal"], phone: "(954) 853-1167", email: "Mbetancurt@gmail.com", status: "pending", split: "50/50", notes: "Sunrise/Broward. JR + demo. Contract sent." },
  { name: "Kevies McNichols", services: ["Junk Removal"], phone: "(786) 212-6016", email: "markmcnichols30@icloud.com", status: "pending", split: "50/50", notes: "2-man crew. DocuSign contract pending." },
  { name: "Camilo Perez", services: ["Pressure Washing", "Junk Removal"], phone: "(305) 303-7781", email: "pcamilo64@yahoo.com", status: "pending", split: "50/50", notes: "PW + JR + plumbing licensed. Future home services anchor." },
  {
    // Existing Marvin fields preserved — record kept for history, not deleted.
    name: "Marvin", services: ["Junk Removal"], phone: "(561) 545-2003", email: "", split: "50/50",
    notes: "26ft box truck. Crew of 3. Need full name + email for contract.",
    status: "blacklisted",
    blacklistedAt: "2026-06-17",
    blacklistReason: "No-showed a confirmed job scheduled 2 days in advance. Read all messages during scheduled window, ignored two phone calls, zero communication. Unrecoverable trust breach.",
    eligibleForFutureWork: false,
    onboardingPending: [],
  },
  {
    id: "armani-haedo",
    name: "Armani Haedo",
    business: null,
    services: ["Junk Removal"], // full service name — drives dispatch dropdown + team card
    serviceLines: ["JR"],
    phone: "(786) 486-6895",
    email: null, // TODO: collect from contractor
    coverage: ["Miami-Dade", "Broward", "Palm Beach"],
    crewSize: "1 (can scale up)",
    equipment: "F-150 flatbed truck; box trailer available on request",
    insurance: { status: "self-reported", coiOnFile: false, minGL: null, additionalInsured: false, signingBonusOffered: false },
    contract: { status: "unsigned", template: "v2", docusignSentAt: null },
    status: "active",
    split: "60/40", // existing UI field (getCompanySplit + card) — mirrors splitTier
    splitTier: "60/40", // advancement earned after 10+ completed jobs
    jobsCompleted: 12,
    rating: null, // TODO: implement rating capture
    notes: "Solo operator, flexible on last-minute jobs. Bonus payouts documented per-job.",
    onboardingPending: [
      "Collect email address",
      "Request COI: $500K min GL, MCS named as additional insured",
      "Send DocuSign v2 contract",
    ],
    createdAt: "2026-06-17",
  },
  {
    id: "jc-removal",
    name: "JC Removal", // display/dispatch name (business) — legal name TBD, see onboardingPending
    legalName: null, // TODO: collect legal name of primary contact
    business: "JC Removal",
    services: ["Junk Removal"],
    serviceLines: ["JR"],
    phone: "(786) 424-9556",
    email: null, // TODO: collect from contractor
    coverage: ["Miami-Dade", "Broward (up to Hollywood/Fort Lauderdale)"],
    crewSize: "4 (3-man crew + JC)",
    equipment: "U-Haul rental (per-job)",
    insurance: { status: "self-reported", coiOnFile: false, minGL: null, additionalInsured: false, signingBonusOffered: false },
    contract: { status: "unsigned", template: "v2", docusignSentAt: null },
    status: "active",
    split: "55/45", // existing UI field — mirrors splitTier
    splitTier: "55/45", // crew contractor rate per bible
    jobsCompleted: 5,
    rating: null,
    notes: "Larger crew for higher-volume jobs. Renting equipment per-job. No issues on payments so far.",
    onboardingPending: [
      "Collect legal name of primary contact",
      "Collect email address",
      "Request COI: $500K min GL, MCS named as additional insured",
      "Send DocuSign v2 contract",
    ],
    createdAt: "2026-06-17",
  },
  { name: "Cristian Vasquez", services: ["Pressure Washing"], phone: "(786) 626-3778", email: "", status: "pending", split: "50/50", notes: "4,400 PSI. Insurance pending." },
  { name: "Lariel", services: ["Mobile Detailing"], phone: "", email: "", status: "active", split: "55/45", notes: "Detailing crew (3-man). 55/45 crew split per bible." },
];

const CALL_SERVICES = {
  hub: { label: "Magic City Services", phone: "(305) 570-3041", greeting: "Thanks for calling Magic City Services, this is Myles. How can I help you today?", followUp: "Are you looking for junk removal, pressure washing, or mobile detailing?" },
  jr: { label: "Junk Removal", phone: "(786) 822-8281", greeting: "Thanks for calling Magic City Junk Removal, this is Myles. What can we help you get rid of today?", followUp: "Can you tell me a little about what you need hauled? Furniture, debris, full cleanout?" },
  pw: { label: "Pressure Washing", phone: "(305) 783-3133", greeting: "Thanks for calling Magic City Pressure Washing, this is Myles. How can I help you today?", followUp: "What surfaces are you looking to get cleaned — driveway, house exterior, roof, pool deck?" },
  dt: { label: "Detailing", phone: "(305) 306-8078", greeting: "Thanks for calling Magic City Detailing, this is Myles. What can we do for your vehicle today?", followUp: "Are you looking for an interior detail, full detail, or our premium showroom package?" },
};

const QUALIFYING = {
  jr: [
    { q: "What needs to be removed?", note: "Furniture, appliances, debris, full cleanout" },
    { q: "Where is the junk located?", note: "Garage, yard, inside home, storage unit" },
    { q: "How much stuff roughly?", note: "Few items → half truck, room full → full truck, property → cleanout" },
    { q: "Any heavy or specialty items?", note: "Piano, hot tub, concrete — affects pricing" },
    { q: "What's the service address?", note: "Confirm Miami-Dade / Broward / Palm Beach" },
    { q: "When do you need this done?", note: "Same-day available, push for this week" },
  ],
  pw: [
    { q: "What surfaces need cleaning?", note: "Driveway, house, roof, pool deck, fence, gutters" },
    { q: "Single or two-story home?", note: "Two-story = premium pricing" },
    { q: "What type of roof?", note: "Shingle, Tile, or Flat" },
    { q: "Approximately how many sq ft?", note: "Helps quote roof/exterior" },
    { q: "Any mold, algae, or heavy staining?", note: "May need soft wash + chemicals" },
    { q: "What's the service address?", note: "Confirm coverage area" },
    { q: "When would you like this done?", note: "Same-day available" },
  ],
  dt: [
    { q: "What type of vehicle?", note: "Sedan, SUV (+$25-50), truck (+$50-100)" },
    { q: "Interior, exterior, or both?", note: "Interior $249, Full $349, Showroom $599" },
    { q: "Any specific concerns?", note: "Pet hair (+$59), odor (+$99), paint correction (+$249)" },
    { q: "Where should we come to you?", note: "Home, office — we're mobile" },
    { q: "When works best?", note: "Flexible scheduling 7 days a week" },
  ],
};

const OBJECTIONS = [
  { obj: "That's too expensive", response: "I totally understand — let me break down what's included. You're getting a fully insured, professional crew with commercial-grade equipment. We guarantee the work — if you're not happy, we come back and make it right. Most customers tell us we're actually more affordable than other quotes. Would you like me to see if there's a package that fits your budget better?" },
  { obj: "I need to think about it", response: "Absolutely, take your time. Just so you know, we have same-day availability right now and our schedule fills up fast, especially weekends. Can I pencil you in tentatively? No commitment — you can cancel anytime before the appointment." },
  { obj: "I'm getting other quotes", response: "Smart move. When comparing, make sure they're fully insured and licensed — you'd be surprised how many aren't. We carry full liability insurance and our guys are vetted pros. Get your quotes and if you want to give us a shot, we'll match or beat any licensed competitor." },
  { obj: "Can you do it cheaper?", response: "Our pricing reflects the quality — insured crew, commercial equipment, guaranteed satisfaction. That said, if the full package is a stretch, I can look at a smaller scope. What's the most important part of the job for you?" },
  { obj: "I'll call you back", response: "No problem at all. Can I grab your name and number so I can follow up if we have openings or specials this week? That way you don't have to remember to call back." },
  { obj: "Do you have reviews?", response: "Great question — we've completed hundreds of jobs across Miami-Dade with excellent reviews. I can send you a link right after this call. Our reputation is everything, which is why we guarantee every job." },
  { obj: "I didn't expect to pay upfront", response: "Totally understand. We just take a deposit to secure your time slot — it reserves the crew and equipment. The rest is due after the job is complete and you're 100% satisfied. Sound fair?" },
];

const UPSELLS = {
  jr: [
    { trigger: "Half truck load", upsell: "For just $350 more you get a full truck — most customers find more stuff once we start. Want the full just in case? If we don't fill it, I'll adjust down." },
    { trigger: "Single item", upsell: "While we're there, anything else to get rid of? We can take it all in one trip and save you a second appointment." },
    { trigger: "Garage cleanout", upsell: "A lot of garage cleanout customers also get the driveway pressure washed — want me to bundle that at a discount?" },
  ],
  pw: [
    { trigger: "Driveway only", upsell: "Most customers pair driveway with a house wash — both in one visit saves you money. Package deal runs $550-$600." },
    { trigger: "House wash", upsell: "Want to add driveway and pool deck while the crew is there? Full property package is our best value starting at $999." },
    { trigger: "Roof soft wash", upsell: "Since we'll be up there, gutters are a quick add-on for $75-$125. Prevents staining from coming back as fast." },
    { trigger: "Any PW job", upsell: "We also do window washing at $10/window — most homes are 15-25 windows. Want to add that for a spotless exterior?" },
  ],
  dt: [
    { trigger: "Interior detail", upsell: "For just $100 more you get the full detail — interior plus complete exterior wash and wax. Showroom-ready inside and out." },
    { trigger: "Full detail", upsell: "Consider our Showroom Elite? Everything in full detail plus paint decontamination, clay bar, machine polish, and premium sealant. $599." },
    { trigger: "Any detail", upsell: "Have pets? Our pet hair removal add-on is $59 — specialized tools get hair out of every crevice. Most popular add-on." },
    { trigger: "Showroom Elite", upsell: "Want to add ceramic coating for long-term protection? Keeps your car looking detailed for months. $999 and pays for itself." },
  ],
};

const CLOSE_SCRIPTS = [
  { label: "Book Now", script: "Let's get you on the schedule. I just need your name, service address, and preferred date and time. We have availability as early as tomorrow — what works best?" },
  { label: "Deposit Required", script: "To lock in your spot, we take a deposit to secure the crew and time slot. Remaining balance due after job is complete and you're satisfied. I can send a payment link right now — what's the best email or number?" },
  { label: "Follow Up", script: "I'll send you a text with our website and a summary of what we discussed. When you're ready, text back or call and we'll get you booked." },
  { label: "Same-Day Push", script: "Good news — we have a crew available today. If you want to knock this out, I can get someone to you within a couple hours. Want me to lock that in?" },
];

const FOLLOWUP_TEMPLATES = [
  { id: "thankyou", label: "Thank You + Review", emoji: "⭐", color: "#FBBF24", desc: "Send same day",
    fields: ["customerName", "reviewLink"],
    generate: (d) => `Hey ${d.firstName}, it's Myles from Magic City Services! Just wanted to say thanks for choosing us for your ${d.serviceName.toLowerCase()} today.\n\nI hope everything looks great. If you have a minute, we'd really appreciate a quick Google review — it helps small businesses like ours more than you know:\n\n${d.reviewLink || "[Google Review Link]"}\n\nAnd if you ever need anything in the future — pressure washing, junk removal, detailing — you've got my number.\n\nThanks again ${d.firstName}!\n\nMyles Stute\nMagic City Services LLC` },
  { id: "satisfaction", label: "Satisfaction Check", emoji: "✅", color: "#22C55E", desc: "Check in 24hrs after",
    fields: ["customerName", "reviewLink"],
    generate: (d) => `Hey ${d.firstName}, Myles here from Magic City Services. Just checking in on yesterday's ${d.serviceName.toLowerCase()} — is everything looking good?\n\nIf there's anything that wasn't 100% to your satisfaction, let me know and I'll personally make sure we get it right.\n\nIf everything looks great, we'd love a quick Google review:\n${d.reviewLink || "[Google Review Link]"}\n\nMyles Stute\nMagic City Services LLC` },
  { id: "receipt", label: "Job Receipt", emoji: "🧾", color: "#7DD3FC", desc: "Professional receipt",
    fields: ["customerName", "packageName", "address", "totalPaid"],
    generate: (d) => `Hey ${d.firstName}, here's your receipt from Magic City Services:\n\n────────────────\nSERVICE RECEIPT\n────────────────\nCustomer: ${d.customerName}\nDate: ${d.jobDate || "Today"}\nService: ${d.serviceName}${d.packageName ? " — " + d.packageName : ""}\nAddress: ${d.address || "On file"}\n\nTotal Paid: ${d.totalPaid || "$___"}\n────────────────\n\nYour satisfaction is guaranteed. If anything isn't right, reach out directly.\n\nMyles Stute\nMagic City Services LLC\nmagiccityservicesmiami.com` },
  { id: "rebook", label: "Rebooking Prompt", emoji: "🔄", color: "#F472B6", desc: "Send 30-90 days after",
    fields: ["customerName", "timeAgo"],
    generate: (d) => `Hey ${d.firstName}! It's Myles from Magic City Services — we took care of your ${d.serviceName.toLowerCase()} ${d.timeAgo || "a while back"} and wanted to check in.\n\nWant me to get you back on the schedule? Just reply here and I'll lock in a time.\n\nMyles Stute\nMagic City Services LLC` },
  { id: "referral", label: "Referral Ask", emoji: "🤝", color: "#A78BFA", desc: "Turn customers into leads",
    fields: ["customerName"],
    generate: (d) => `Hey ${d.firstName}! Myles from Magic City Services here. Hope you're still loving the results from your ${d.serviceName.toLowerCase()}.\n\nQuick ask — if you know anyone who could use junk removal, pressure washing, or detailing, we'd love the referral. Just have them mention your name.\n\nThanks for being a part of the Magic City family!\n\nMyles Stute\nMagic City Services LLC\nmagiccityservicesmiami.com` },
];

const LEAD_SOURCES = ["Website", "Google Ads", "Phone Call", "Text", "Instagram", "Facebook", "Nextdoor", "Referral", "Yelp", "Other"];

// ── HELPERS ──────────────────────────────────────────

const fmt = (n) => {
  if (n == null) return "";
  return n % 1 === 0 ? `$${n.toLocaleString()}` : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const genId = () => "MCS-" + Date.now().toString(36).toUpperCase();
const fmtDate = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

// ── STORAGE ─────────────────────────────────────────

const JOBS_KEY = "mcs-ops-jobs-v2";
const loadFromStorage = async (key) => {
  try { const result = await window.storage.get(key); return result ? JSON.parse(result.value) : null; } catch { return null; }
};
const saveToStorage = async (key, data) => {
  try { await window.storage.set(key, JSON.stringify(data)); } catch {}
};

// Helper: get contractor split for company share calculation
const getCompanySplit = (contractorName) => {
  const c = CONTRACTORS.find(x => x.name === contractorName);
  if (!c) return 50;
  const parts = c.split.split("/");
  return parseInt(parts[1]) || 50;
};

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════

function PinGate({ children }) {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("mcs-ops-auth") === "true") {
        setAuthenticated(true);
      }
    } catch {}
  }, []);

  const handleSubmit = () => {
    if (pin === "2506") {
      setAuthenticated(true);
      try { sessionStorage.setItem("mcs-ops-auth", "true"); } catch {}
    }
  };

  if (authenticated) return children;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: "320px", width: "100%" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, background: "linear-gradient(135deg, #F472B6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "4px" }}>Magic City Ops</div>
        <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "24px" }}>COMMAND CENTER</div>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Enter PIN"
          autoFocus
          style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid rgba(244,114,182,0.2)", background: "rgba(15,20,36,0.8)", color: "#F8FAFC", fontSize: "20px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", textAlign: "center", letterSpacing: "8px" }}
        />
        <button
          onClick={handleSubmit}
          style={{ width: "100%", marginTop: "12px", padding: "14px", borderRadius: "10px", border: "none", background: pin.length >= 4 ? "linear-gradient(135deg, #F472B6, #60a5fa)" : "rgba(148,163,184,0.15)", color: pin.length >= 4 ? "#0a0e1a" : "#64748B", fontSize: "14px", fontWeight: 700, cursor: pin.length >= 4 ? "pointer" : "default", fontFamily: "inherit" }}
        >
          Enter
        </button>
        <div style={{ fontSize: "11px", color: "#475569", marginTop: "16px" }}>Internal use only</div>
      </div>
    </div>
  );
}

export default function MagicCityOpsProtected() {
  return (
    <PinGate>
      <MagicCityOps />
    </PinGate>
  );
}

// ═══════════════════════════════════════════════════════
// SEED / PLACEHOLDER JOBS  (batch 2026-06-17-placeholder)
// Clearly-flagged demo data pending Stripe reconciliation.
// Remove all with: jobs.filter(j => j.seedBatchId !== '2026-06-17-placeholder')
const SEED_JOBS = [
  { id: "seed_001", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Yvonne MacDonald", phone: "(786) 555-0264", address: "9028 SW 87th Ave, Key Biscayne, FL 33149", gross: 825, price: 825, deposit: 400, mcsShare: 330, contractor: "Armani Haedo", contractorPay: 495, status: "Completed", date: "2026-05-04", completedAt: "2026-05-04T15:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_002", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Vincent Bautista", phone: "(786) 555-0287", address: "6520 SW 87th Ave, Miami, FL 33131", gross: 1100, price: 1100, deposit: 550, mcsShare: 550, contractor: "Kevies McNichols", contractorPay: 550, status: "Completed", date: "2026-05-15", completedAt: "2026-05-15T13:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_003", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Anna Marcelin", phone: "(786) 555-0240", address: "9390 SW 3rd St, Miami, FL 33127", gross: 1075, price: 1075, deposit: 550, mcsShare: 538, contractor: "Mason Hyatt", contractorPay: 537, status: "Completed", date: "2026-06-28", completedAt: "2026-06-28T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_004", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Sofia Kimura", phone: "(305) 555-0177", address: "18286 SW 137th Ave, Coral Gables, FL 33134", gross: 700, price: 700, deposit: 0, mcsShare: 350, contractor: "Mason Hyatt", contractorPay: 350, status: "Completed", date: "2026-05-06", completedAt: "2026-05-06T07:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_005", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Trevor Washington", phone: "(954) 555-0211", address: "8052 SW 72nd St, Hollywood, FL 33019", gross: 700, price: 700, deposit: 350, mcsShare: 350, contractor: "Kevies McNichols", contractorPay: 350, status: "Completed", date: "2026-05-24", completedAt: "2026-05-24T14:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_006", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Beatriz Miller", phone: "(786) 555-0131", address: "622 NW 22nd Ave, Coral Gables, FL 33134", gross: 875, price: 875, deposit: 450, mcsShare: 438, contractor: "Matthew Betancurt", contractorPay: 437, status: "Completed", date: "2026-07-09", completedAt: "2026-07-09T09:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_007", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Marco Whitley", phone: "(954) 555-0167", address: "15421 SW 62nd Ave, Fort Lauderdale, FL 33301", gross: 825, price: 825, deposit: 400, mcsShare: 412, contractor: "Matthew Betancurt", contractorPay: 413, status: "Completed", date: "2026-06-05", completedAt: "2026-06-05T09:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_008", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Marco Johnson", phone: "(561) 555-0179", address: "14280 NE 12th Ter, Delray Beach, FL 33444", gross: 950, price: 950, deposit: 475, mcsShare: 475, contractor: "Kevies McNichols", contractorPay: 475, status: "Completed", date: "2026-04-11", completedAt: "2026-04-11T16:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_009", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Lucia Rivera", phone: "(954) 555-0184", address: "11233 SW 3rd St, Fort Lauderdale, FL 33308", gross: 750, price: 750, deposit: 0, mcsShare: 300, contractor: "Armani Haedo", contractorPay: 450, status: "Completed", date: "2026-06-16", completedAt: "2026-06-16T08:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_010", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Grace Rosen", phone: "(786) 555-0237", address: "1989 SE 17th St, Miami Beach, FL 33139", gross: 1350, price: 1350, deposit: 0, mcsShare: 675, contractor: "Matthew Betancurt", contractorPay: 675, status: "Completed", date: "2026-06-14", completedAt: "2026-06-14T09:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_011", serviceLine: "JR", type: "Full Cleanout + Pressure Wash (combo)", service: "Junk Removal", customerName: "Sean Aguilar", phone: "(786) 555-0259", address: "19832 SW 137th Ave, Miami, FL 33127", gross: 2525, price: 2525, deposit: 1250, mcsShare: 1262, contractor: "Camilo Perez", contractorPay: 1263, status: "Completed", date: "2026-05-11", completedAt: "2026-05-11T10:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_012", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Yvonne Aguilar", phone: "(305) 555-0247", address: "15482 SW 24th St, Miami Beach, FL 33139", gross: 500, price: 500, deposit: 250, mcsShare: 250, contractor: "Kevies McNichols", contractorPay: 250, status: "Completed", date: "2026-06-29", completedAt: "2026-06-29T16:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_013", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Elizabeth Cohen", phone: "(561) 555-0257", address: "4039 SW 62nd Ave, Delray Beach, FL 33444", gross: 925, price: 925, deposit: 0, mcsShare: 462, contractor: "Kevies McNichols", contractorPay: 463, status: "Completed", date: "2026-05-26", completedAt: "2026-05-26T13:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_014", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Jasmine Charleston", phone: "(786) 555-0107", address: "16559 SW 137th Ave, Key Biscayne, FL 33149", gross: 825, price: 825, deposit: 400, mcsShare: 330, contractor: "Armani Haedo", contractorPay: 495, status: "Completed", date: "2026-04-30", completedAt: "2026-04-30T16:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_015", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Danielle Washington", phone: "(305) 555-0203", address: "946 SW 3rd St, Miami Beach, FL 33139", gross: 750, price: 750, deposit: 0, mcsShare: 375, contractor: "Matthew Betancurt", contractorPay: 375, status: "Completed", date: "2026-05-07", completedAt: "2026-05-07T16:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_016", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Julian Ashworth", phone: "(954) 555-0189", address: "15222 SW 40th St, Fort Lauderdale, FL 33308", gross: 1200, price: 1200, deposit: 0, mcsShare: 480, contractor: "Armani Haedo", contractorPay: 720, status: "Completed", date: "2026-06-08", completedAt: "2026-06-08T14:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_017", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Olivia Washington", phone: "(786) 555-0179", address: "6107 SE 3rd Ave, Miami Beach, FL 33139", gross: 425, price: 425, deposit: 0, mcsShare: 170, contractor: "Armani Haedo", contractorPay: 255, status: "Completed", date: "2026-05-11", completedAt: "2026-05-11T11:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_018", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Amir Johnson", phone: "(305) 555-0251", address: "2629 N Andrews Ave, Miami Beach, FL 33139", gross: 575, price: 575, deposit: 300, mcsShare: 288, contractor: "Matthew Betancurt", contractorPay: 287, status: "Completed", date: "2026-06-04", completedAt: "2026-06-04T14:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_019", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Roberto Kapoor", phone: "(954) 555-0125", address: "4635 W Ave, Fort Lauderdale, FL 33308", gross: 700, price: 700, deposit: 350, mcsShare: 350, contractor: "Kevies McNichols", contractorPay: 350, status: "Completed", date: "2026-06-04", completedAt: "2026-06-04T15:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_020", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Margaret Nakamura", phone: "(786) 555-0143", address: "9610 SE 3rd Ave, Miami, FL 33127", gross: 450, price: 450, deposit: 225, mcsShare: 225, contractor: "Mason Hyatt", contractorPay: 225, status: "Completed", date: "2026-06-09", completedAt: "2026-06-09T14:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_021", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Priya Molina", phone: "(954) 555-0251", address: "19521 SW 62nd Ave, Hollywood, FL 33019", gross: 1050, price: 1050, deposit: 525, mcsShare: 472, contractor: "JC Removal", contractorPay: 578, status: "Completed", date: "2026-06-29", completedAt: "2026-06-29T09:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_022", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Elizabeth Delgado", phone: "(305) 555-0298", address: "6863 NE 6th St, Miami Beach, FL 33139", gross: 825, price: 825, deposit: 400, mcsShare: 412, contractor: "Matthew Betancurt", contractorPay: 413, status: "Completed", date: "2026-06-14", completedAt: "2026-06-14T07:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_023", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Jonathan Johnson", phone: "(954) 555-0283", address: "4624 SW 152nd St, Hollywood, FL 33019", gross: 625, price: 625, deposit: 300, mcsShare: 312, contractor: "Matthew Betancurt", contractorPay: 313, status: "Completed", date: "2026-06-04", completedAt: "2026-06-04T10:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_024", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Tamara Beaumont", phone: "(561) 555-0149", address: "3987 SW 27th Ave, Delray Beach, FL 33444", gross: 1225, price: 1225, deposit: 0, mcsShare: 551, contractor: "JC Removal", contractorPay: 674, status: "Completed", date: "2026-04-24", completedAt: "2026-04-24T13:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_025", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Ricardo Feinstein", phone: "(786) 555-0250", address: "2975 SW 27th Ave, Pinecrest, FL 33156", gross: 1125, price: 1125, deposit: 550, mcsShare: 506, contractor: "JC Removal", contractorPay: 619, status: "Completed", date: "2026-04-27", completedAt: "2026-04-27T08:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_026", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Patrick Jean-Baptiste", phone: "(561) 555-0120", address: "4553 NE 6th St, Delray Beach, FL 33444", gross: 950, price: 950, deposit: 475, mcsShare: 475, contractor: "Kevies McNichols", contractorPay: 475, status: "Completed", date: "2026-05-26", completedAt: "2026-05-26T15:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_027", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Felicia Molina", phone: "(954) 555-0155", address: "8934 SW 27th Ave, Fort Lauderdale, FL 33301", gross: 625, price: 625, deposit: 300, mcsShare: 250, contractor: "Armani Haedo", contractorPay: 375, status: "Completed", date: "2026-06-04", completedAt: "2026-06-04T08:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_028", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Jonathan Al-Rashid", phone: "(786) 555-0160", address: "19479 NE 2nd Ave, Key Biscayne, FL 33149", gross: 1025, price: 1025, deposit: 500, mcsShare: 512, contractor: "Kevies McNichols", contractorPay: 513, status: "Completed", date: "2026-06-13", completedAt: "2026-06-13T15:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_029", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Ethan Kimura", phone: "(954) 555-0115", address: "15521 SW 137th Ave, Fort Lauderdale, FL 33301", gross: 400, price: 400, deposit: 0, mcsShare: 160, contractor: "Armani Haedo", contractorPay: 240, status: "Completed", date: "2026-06-08", completedAt: "2026-06-08T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_030", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Priya Dubois", phone: "(305) 555-0262", address: "15158 SW 152nd St, Miami, FL 33131", gross: 650, price: 650, deposit: 325, mcsShare: 325, contractor: "Mason Hyatt", contractorPay: 325, status: "Completed", date: "2026-06-01", completedAt: "2026-06-01T09:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_031", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Nia Beaumont", phone: "(954) 555-0276", address: "12193 SW 8th St, Hollywood, FL 33019", gross: 425, price: 425, deposit: 200, mcsShare: 170, contractor: "Armani Haedo", contractorPay: 255, status: "Completed", date: "2026-07-08", completedAt: "2026-07-08T14:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_032", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Emmanuelle Charleston", phone: "(786) 555-0126", address: "14605 S Dixie Hwy, Doral, FL 33172", gross: 650, price: 650, deposit: 325, mcsShare: 325, contractor: "Matthew Betancurt", contractorPay: 325, status: "Completed", date: "2026-04-20", completedAt: "2026-04-20T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_033", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Omar Nakamura", phone: "(561) 555-0251", address: "11289 NW 22nd Ave, Delray Beach, FL 33444", gross: 650, price: 650, deposit: 0, mcsShare: 325, contractor: "Mason Hyatt", contractorPay: 325, status: "Completed", date: "2026-06-14", completedAt: "2026-06-14T11:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_034", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Marco Rivera", phone: "(786) 555-0245", address: "15192 N Federal Hwy, Miami Beach, FL 33140", gross: 925, price: 925, deposit: 450, mcsShare: 462, contractor: "Matthew Betancurt", contractorPay: 463, status: "Completed", date: "2026-06-18", completedAt: "2026-06-18T08:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_035", serviceLine: "JR", type: "Full Cleanout + Pressure Wash (combo)", service: "Junk Removal", customerName: "Simone Charleston", phone: "(305) 555-0170", address: "8678 SW 24th St, Miami, FL 33127", gross: 2575, price: 2575, deposit: 1300, mcsShare: 1159, contractor: "JC Removal", contractorPay: 1416, status: "Completed", date: "2026-06-04", completedAt: "2026-06-04T07:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_036", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Elizabeth Washington", phone: "(305) 555-0119", address: "4135 SW 27th Ave, Coral Gables, FL 33146", gross: 1075, price: 1075, deposit: 550, mcsShare: 538, contractor: "Matthew Betancurt", contractorPay: 537, status: "Completed", date: "2026-06-11", completedAt: "2026-06-11T12:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_037", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Nathalie Adebayo", phone: "(786) 555-0167", address: "19997 SW 40th St, Miami Beach, FL 33139", gross: 1150, price: 1150, deposit: 0, mcsShare: 575, contractor: "Kevies McNichols", contractorPay: 575, status: "Completed", date: "2026-06-30", completedAt: "2026-06-30T11:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_038", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Meredith Sinclair", phone: "(786) 555-0200", address: "16312 SW 40th St, Miami, FL 33133", gross: 875, price: 875, deposit: 0, mcsShare: 438, contractor: "Matthew Betancurt", contractorPay: 437, status: "Completed", date: "2026-05-23", completedAt: "2026-05-23T08:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_039", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Melissa Foster", phone: "(786) 555-0158", address: "18745 NW 7th St, Miami, FL 33133", gross: 1200, price: 1200, deposit: 600, mcsShare: 600, contractor: "Matthew Betancurt", contractorPay: 600, status: "Completed", date: "2026-06-06", completedAt: "2026-06-06T07:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_040", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Ivan DiMarco", phone: "(561) 555-0106", address: "13372 SW 152nd St, Delray Beach, FL 33444", gross: 775, price: 775, deposit: 400, mcsShare: 388, contractor: "Mason Hyatt", contractorPay: 387, status: "Completed", date: "2026-05-30", completedAt: "2026-05-30T15:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_041", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Isabella Charleston", phone: "(305) 555-0120", address: "4684 SW 112th Ave, Coral Gables, FL 33134", gross: 575, price: 575, deposit: 300, mcsShare: 288, contractor: "Kevies McNichols", contractorPay: 287, status: "Completed", date: "2026-06-19", completedAt: "2026-06-19T15:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_042", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Sunil Thompson", phone: "(954) 555-0174", address: "16742 NE 12th Ter, Hollywood, FL 33020", gross: 775, price: 775, deposit: 400, mcsShare: 349, contractor: "JC Removal", contractorPay: 426, status: "Completed", date: "2026-05-28", completedAt: "2026-05-28T16:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_043", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Luis Rodriguez", phone: "(786) 555-0241", address: "6051 W Ave, Miami Beach, FL 33139", gross: 925, price: 925, deposit: 0, mcsShare: 462, contractor: "Kevies McNichols", contractorPay: 463, status: "Completed", date: "2026-05-26", completedAt: "2026-05-26T16:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_044", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Elizabeth Beaumont", phone: "(786) 555-0214", address: "10661 SW 112th Ave, Aventura, FL 33180", gross: 350, price: 350, deposit: 0, mcsShare: 175, contractor: "Mason Hyatt", contractorPay: 175, status: "Completed", date: "2026-04-30", completedAt: "2026-04-30T15:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_045", serviceLine: "JR", type: "Full Cleanout + Pressure Wash (combo)", service: "Junk Removal", customerName: "Nathalie Sharma", phone: "(786) 555-0103", address: "13454 NW 7th St, Miami Beach, FL 33141", gross: 2550, price: 2550, deposit: 0, mcsShare: 1275, contractor: "Kevies McNichols", contractorPay: 1275, status: "Completed", date: "2026-06-19", completedAt: "2026-06-19T10:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_046", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Meredith Beaumont", phone: "(954) 555-0295", address: "5543 SW 8th St, Fort Lauderdale, FL 33301", gross: 750, price: 750, deposit: 375, mcsShare: 375, contractor: "Kevies McNichols", contractorPay: 375, status: "Completed", date: "2026-06-03", completedAt: "2026-06-03T14:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_047", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Bernard Kapoor", phone: "(954) 555-0157", address: "4092 N Federal Hwy, Hollywood, FL 33019", gross: 975, price: 975, deposit: 0, mcsShare: 390, contractor: "Armani Haedo", contractorPay: 585, status: "Completed", date: "2026-06-28", completedAt: "2026-06-28T08:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_048", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Emmanuelle DiMarco", phone: "(786) 555-0104", address: "9975 NW 22nd Ave, Miami, FL 33127", gross: 975, price: 975, deposit: 500, mcsShare: 488, contractor: "Kevies McNichols", contractorPay: 487, status: "Completed", date: "2026-06-23", completedAt: "2026-06-23T14:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_049", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Bernard Molina", phone: "(305) 555-0269", address: "4106 SE 17th St, Miami Beach, FL 33141", gross: 825, price: 825, deposit: 0, mcsShare: 371, contractor: "JC Removal", contractorPay: 454, status: "Completed", date: "2026-06-26", completedAt: "2026-06-26T10:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_050", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Meredith Goldberg", phone: "(954) 555-0136", address: "9006 SW 112th Ave, Weston, FL 33326", gross: 1100, price: 1100, deposit: 550, mcsShare: 550, contractor: "Kevies McNichols", contractorPay: 550, status: "Completed", date: "2026-06-28", completedAt: "2026-06-28T08:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_051", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Deshawn Bautista", phone: "(305) 555-0154", address: "15844 SW 62nd Ave, Miami Beach, FL 33140", gross: 1025, price: 1025, deposit: 500, mcsShare: 512, contractor: "Mason Hyatt", contractorPay: 513, status: "Completed", date: "2026-05-19", completedAt: "2026-05-19T12:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_052", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Luis Braithwaite", phone: "(954) 555-0137", address: "11595 S Dixie Hwy, Fort Lauderdale, FL 33301", gross: 975, price: 975, deposit: 0, mcsShare: 488, contractor: "Kevies McNichols", contractorPay: 487, status: "Completed", date: "2026-04-23", completedAt: "2026-04-23T13:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_053", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Simone Hoffman", phone: "(954) 555-0280", address: "11019 S Dixie Hwy, Hollywood, FL 33020", gross: 825, price: 825, deposit: 400, mcsShare: 412, contractor: "Mason Hyatt", contractorPay: 413, status: "Completed", date: "2026-05-31", completedAt: "2026-05-31T14:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_054", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Ingrid Mendez", phone: "(305) 555-0205", address: "5471 SW 72nd St, Miami Beach, FL 33139", gross: 1000, price: 1000, deposit: 0, mcsShare: 500, contractor: "Kevies McNichols", contractorPay: 500, status: "Completed", date: "2026-05-22", completedAt: "2026-05-22T12:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_055", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Yvette Foster", phone: "(786) 555-0247", address: "10743 NW 22nd Ave, Miami Beach, FL 33141", gross: 875, price: 875, deposit: 450, mcsShare: 438, contractor: "Matthew Betancurt", contractorPay: 437, status: "Completed", date: "2026-06-24", completedAt: "2026-06-24T16:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_056", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Yvette Perry", phone: "(786) 555-0106", address: "8821 SW 87th Ave, Aventura, FL 33180", gross: 675, price: 675, deposit: 350, mcsShare: 338, contractor: "Kevies McNichols", contractorPay: 337, status: "Completed", date: "2026-05-04", completedAt: "2026-05-04T07:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_057", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Aventura Plaza Mgmt LLC", phone: "(786) 555-0114", address: "9732 SW 24th St, Miami Beach, FL 33141", gross: 1425, price: 1425, deposit: 700, mcsShare: 712, contractor: "Steve (Esteban Santana)", contractorPay: 713, status: "Completed", date: "2026-06-02", completedAt: "2026-06-02T08:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_058", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Aventura Plaza Mgmt LLC", phone: "(954) 555-0225", address: "14598 NW 22nd Ave, Hollywood, FL 33020", gross: 1550, price: 1550, deposit: 775, mcsShare: 775, contractor: "Steve (Esteban Santana)", contractorPay: 775, status: "Completed", date: "2026-06-24", completedAt: "2026-06-24T12:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_059", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Design District Retail LLC", phone: "(786) 555-0278", address: "15831 S Dixie Hwy, Doral, FL 33172", gross: 1275, price: 1275, deposit: 0, mcsShare: 638, contractor: "Victor Gonzalez", contractorPay: 637, status: "Completed", date: "2026-07-07", completedAt: "2026-07-07T10:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_060", serviceLine: "PW", type: "House 2-Story + Driveway", service: "Pressure Washing", customerName: "Andre Ashford", phone: "(954) 555-0119", address: "3184 NW 22nd Ave, Hollywood, FL 33019", gross: 925, price: 925, deposit: 450, mcsShare: 462, contractor: "Steve (Esteban Santana)", contractorPay: 463, status: "Completed", date: "2026-06-18", completedAt: "2026-06-18T07:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_061", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Design District Retail LLC", phone: "(954) 555-0253", address: "1559 SW 72nd St, Weston, FL 33326", gross: 1475, price: 1475, deposit: 750, mcsShare: 738, contractor: "Victor Gonzalez", contractorPay: 737, status: "Completed", date: "2026-05-02", completedAt: "2026-05-02T10:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_062", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Gables Retail Group LLC", phone: "(954) 555-0164", address: "557 SW 137th Ave, Hollywood, FL 33019", gross: 1050, price: 1050, deposit: 0, mcsShare: 525, contractor: "Steve (Esteban Santana)", contractorPay: 525, status: "Completed", date: "2026-05-22", completedAt: "2026-05-22T15:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_063", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Gables Retail Group LLC", phone: "(305) 555-0232", address: "14935 SW 8th St, Key Biscayne, FL 33149", gross: 1225, price: 1225, deposit: 600, mcsShare: 612, contractor: "Victor Gonzalez", contractorPay: 613, status: "Completed", date: "2026-05-29", completedAt: "2026-05-29T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_064", serviceLine: "PW", type: "Full Property + Pressure Wash (estate)", service: "Pressure Washing", customerName: "Yolanda Hernandez", phone: "(305) 555-0152", address: "5515 Pine Tree Dr, Miami Beach, FL 33140", gross: 2775, price: 2775, deposit: 1400, mcsShare: 1388, contractor: "Victor Gonzalez", contractorPay: 1387, status: "Completed", date: "2026-05-29", completedAt: "2026-05-29T12:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_065", serviceLine: "PW", type: "House 2-Story + Driveway", service: "Pressure Washing", customerName: "Darius DiMarco", phone: "(786) 555-0182", address: "6319 SW 87th Ave, Pinecrest, FL 33156", gross: 800, price: 800, deposit: 400, mcsShare: 400, contractor: "Victor Gonzalez", contractorPay: 400, status: "Completed", date: "2026-04-26", completedAt: "2026-04-26T12:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_066", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Aventura Plaza Mgmt LLC", phone: "(786) 555-0270", address: "3468 SW 152nd St, Key Biscayne, FL 33149", gross: 1450, price: 1450, deposit: 725, mcsShare: 725, contractor: "Steve (Esteban Santana)", contractorPay: 725, status: "Completed", date: "2026-06-09", completedAt: "2026-06-09T08:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_067", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Aventura Plaza Mgmt LLC", phone: "(786) 555-0217", address: "14037 NE 2nd Ave, Coral Gables, FL 33134", gross: 1225, price: 1225, deposit: 0, mcsShare: 612, contractor: "Victor Gonzalez", contractorPay: 613, status: "Completed", date: "2026-06-08", completedAt: "2026-06-08T07:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_068", serviceLine: "PW", type: "House 2-Story + Driveway", service: "Pressure Washing", customerName: "Christopher Charleston", phone: "(561) 555-0203", address: "14950 NE 6th St, Delray Beach, FL 33444", gross: 950, price: 950, deposit: 475, mcsShare: 475, contractor: "Steve (Esteban Santana)", contractorPay: 475, status: "Completed", date: "2026-05-27", completedAt: "2026-05-27T12:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_069", serviceLine: "PW", type: "House 2-Story + Driveway", service: "Pressure Washing", customerName: "Tamara Cohen", phone: "(786) 555-0136", address: "19634 NE 2nd Ave, Doral, FL 33172", gross: 900, price: 900, deposit: 450, mcsShare: 450, contractor: "Victor Gonzalez", contractorPay: 450, status: "Completed", date: "2026-05-02", completedAt: "2026-05-02T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_070", serviceLine: "PW", type: "House 2-Story", service: "Pressure Washing", customerName: "Gustavo Nakamura", phone: "(305) 555-0113", address: "771 SW 112th Ave, Miami Beach, FL 33139", gross: 725, price: 725, deposit: 350, mcsShare: 362, contractor: "Steve (Esteban Santana)", contractorPay: 363, status: "Completed", date: "2026-05-09", completedAt: "2026-05-09T14:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_071", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Design District Retail LLC", phone: "(786) 555-0283", address: "9105 SW 62nd Ave, Miami, FL 33127", gross: 1225, price: 1225, deposit: 600, mcsShare: 612, contractor: "Victor Gonzalez", contractorPay: 613, status: "Completed", date: "2026-06-18", completedAt: "2026-06-18T12:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_072", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Wynwood Lofts LLC", phone: "(561) 555-0235", address: "14237 SW 62nd Ave, Delray Beach, FL 33444", gross: 1525, price: 1525, deposit: 750, mcsShare: 762, contractor: "Victor Gonzalez", contractorPay: 763, status: "Completed", date: "2026-04-13", completedAt: "2026-04-13T12:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_073", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Gables Retail Group LLC", phone: "(954) 555-0175", address: "13540 SW 137th Ave, Hollywood, FL 33020", gross: 1425, price: 1425, deposit: 700, mcsShare: 712, contractor: "Camilo Perez", contractorPay: 713, status: "Completed", date: "2026-07-05", completedAt: "2026-07-05T12:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_074", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Brickell Bay Offices LLC", phone: "(305) 555-0131", address: "2362 SW 87th Ave, Miami Beach, FL 33139", gross: 1475, price: 1475, deposit: 0, mcsShare: 738, contractor: "Victor Gonzalez", contractorPay: 737, status: "Completed", date: "2026-06-13", completedAt: "2026-06-13T10:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_075", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Brickell Bay Offices LLC", phone: "(786) 555-0244", address: "19148 N Andrews Ave, Aventura, FL 33180", gross: 1075, price: 1075, deposit: 0, mcsShare: 538, contractor: "Victor Gonzalez", contractorPay: 537, status: "Completed", date: "2026-06-02", completedAt: "2026-06-02T11:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_076", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Wynwood Lofts LLC", phone: "(954) 555-0133", address: "13605 SW 62nd Ave, Weston, FL 33326", gross: 1200, price: 1200, deposit: 600, mcsShare: 600, contractor: "Victor Gonzalez", contractorPay: 600, status: "Completed", date: "2026-06-02", completedAt: "2026-06-02T07:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_077", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Biscayne Commercial Partners LLC", phone: "(305) 555-0106", address: "10316 SW 112th Ave, Coral Gables, FL 33146", gross: 1350, price: 1350, deposit: 675, mcsShare: 608, contractor: "Gerardo Prado", contractorPay: 742, status: "Completed", date: "2026-04-29", completedAt: "2026-04-29T14:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_078", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Brickell Bay Offices LLC", phone: "(954) 555-0146", address: "14008 W Ave, Hollywood, FL 33019", gross: 1375, price: 1375, deposit: 700, mcsShare: 619, contractor: "Gerardo Prado", contractorPay: 756, status: "Completed", date: "2026-06-05", completedAt: "2026-06-05T08:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_079", serviceLine: "PW", type: "House 2-Story", service: "Pressure Washing", customerName: "David Fernandez", phone: "(786) 555-0117", address: "12556 SW 137th Ave, Miami, FL 33133", gross: 750, price: 750, deposit: 375, mcsShare: 338, contractor: "Gerardo Prado", contractorPay: 412, status: "Completed", date: "2026-04-29", completedAt: "2026-04-29T13:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_080", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Brickell Bay Offices LLC", phone: "(305) 555-0183", address: "9057 S Dixie Hwy, Pinecrest, FL 33156", gross: 1025, price: 1025, deposit: 0, mcsShare: 461, contractor: "Gerardo Prado", contractorPay: 564, status: "Completed", date: "2026-05-29", completedAt: "2026-05-29T15:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_081", serviceLine: "PW", type: "House 2-Story", service: "Pressure Washing", customerName: "Claudia Cabrera", phone: "(954) 555-0151", address: "9909 SE 17th St, Weston, FL 33326", gross: 650, price: 650, deposit: 325, mcsShare: 292, contractor: "Gerardo Prado", contractorPay: 358, status: "Completed", date: "2026-05-22", completedAt: "2026-05-22T09:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_082", serviceLine: "PW", type: "House 2-Story + Driveway", service: "Pressure Washing", customerName: "Sunil Beauchamp", phone: "(954) 555-0120", address: "4402 NE 2nd Ave, Hollywood, FL 33020", gross: 900, price: 900, deposit: 450, mcsShare: 450, contractor: "Steve (Esteban Santana)", contractorPay: 450, status: "Completed", date: "2026-06-19", completedAt: "2026-06-19T12:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_083", serviceLine: "PW", type: "Commercial PW", service: "Pressure Washing", customerName: "Biscayne Commercial Partners LLC", phone: "(954) 555-0230", address: "14948 SE 3rd Ave, Fort Lauderdale, FL 33308", gross: 1150, price: 1150, deposit: 575, mcsShare: 518, contractor: "Gerardo Prado", contractorPay: 632, status: "Completed", date: "2026-05-23", completedAt: "2026-05-23T16:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_084", serviceLine: "PW", type: "House 2-Story + Driveway", service: "Pressure Washing", customerName: "Andre Whitfield", phone: "(561) 555-0128", address: "15875 N Andrews Ave, Boca Raton, FL 33432", gross: 925, price: 925, deposit: 450, mcsShare: 462, contractor: "Steve (Esteban Santana)", contractorPay: 463, status: "Completed", date: "2026-06-04", completedAt: "2026-06-04T08:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_085", serviceLine: "DT", type: "Interior Detail SUV", service: "Mobile Detailing", customerName: "Margaret Weinstein", phone: "(954) 555-0111", address: "285 SW 24th St, Weston, FL 33326", gross: 299, price: 299, deposit: 75, mcsShare: 135, contractor: "Lariel", contractorPay: 164, status: "Completed", date: "2026-06-16", completedAt: "2026-06-16T07:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_086", serviceLine: "DT", type: "Interior Detail", service: "Mobile Detailing", customerName: "Reuben Molina", phone: "(786) 555-0293", address: "18486 NE 2nd Ave, Miami, FL 33133", gross: 249, price: 249, deposit: 0, mcsShare: 75, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 174, status: "Completed", date: "2026-04-18", completedAt: "2026-04-18T15:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_087", serviceLine: "DT", type: "Ceramic Coating", service: "Mobile Detailing", customerName: "Malik Mendez", phone: "(954) 555-0208", address: "15987 SW 40th St, Weston, FL 33326", gross: 999, price: 999, deposit: 500, mcsShare: 450, contractor: "Lariel", contractorPay: 549, status: "Completed", date: "2026-06-18", completedAt: "2026-06-18T11:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_088", serviceLine: "DT", type: "Full Detail", service: "Mobile Detailing", customerName: "Vincent Chen", phone: "(786) 555-0134", address: "4039 W Ave, Miami, FL 33133", gross: 349, price: 349, deposit: 0, mcsShare: 105, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 244, status: "Completed", date: "2026-06-17", completedAt: "2026-06-17T10:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_089", serviceLine: "DT", type: "Interior Detail SUV", service: "Mobile Detailing", customerName: "Nadia Okafor", phone: "(786) 555-0263", address: "4612 SE 17th St, Doral, FL 33172", gross: 299, price: 299, deposit: 75, mcsShare: 135, contractor: "Lariel", contractorPay: 164, status: "Completed", date: "2026-07-04", completedAt: "2026-07-04T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_090", serviceLine: "DT", type: "Interior Detail SUV", service: "Mobile Detailing", customerName: "Ingrid Boateng", phone: "(305) 555-0100", address: "5269 SW 3rd St, Miami Beach, FL 33139", gross: 299, price: 299, deposit: 75, mcsShare: 90, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 209, status: "Completed", date: "2026-06-05", completedAt: "2026-06-05T11:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_091", serviceLine: "DT", type: "Full Detail SUV", service: "Mobile Detailing", customerName: "Jonathan Delgado", phone: "(786) 555-0195", address: "4374 SW 3rd St, Miami Beach, FL 33140", gross: 449, price: 449, deposit: 225, mcsShare: 135, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 314, status: "Completed", date: "2026-05-21", completedAt: "2026-05-21T13:00:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_092", serviceLine: "DT", type: "Full Detail SUV", service: "Mobile Detailing", customerName: "Claudia Charleston", phone: "(786) 555-0128", address: "17444 NE 12th Ter, Miami, FL 33127", gross: 449, price: 449, deposit: 0, mcsShare: 135, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 314, status: "Completed", date: "2026-06-23", completedAt: "2026-06-23T15:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_093", serviceLine: "DT", type: "Full Detail", service: "Mobile Detailing", customerName: "Nathalie Lange", phone: "(786) 555-0164", address: "4539 NE 6th St, Coral Gables, FL 33134", gross: 349, price: 349, deposit: 75, mcsShare: 105, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 244, status: "Completed", date: "2026-05-13", completedAt: "2026-05-13T08:30:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_094", serviceLine: "DT", type: "Full Detail", service: "Mobile Detailing", customerName: "Cyrus Beaumont", phone: "(954) 555-0139", address: "7819 SW 152nd St, Fort Lauderdale, FL 33301", gross: 349, price: 349, deposit: 75, mcsShare: 105, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 244, status: "Completed", date: "2026-05-23", completedAt: "2026-05-23T08:15:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_095", serviceLine: "DT", type: "Interior Detail", service: "Mobile Detailing", customerName: "Ingrid Whitfield", phone: "(954) 555-0124", address: "11394 SW 3rd St, Fort Lauderdale, FL 33301", gross: 249, price: 249, deposit: 50, mcsShare: 75, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 174, status: "Completed", date: "2026-06-30", completedAt: "2026-06-30T14:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_096", serviceLine: "DT", type: "Showroom Elite Truck", service: "Mobile Detailing", customerName: "Sofia Chen", phone: "(305) 555-0287", address: "17402 SW 3rd St, Miami, FL 33127", gross: 649, price: 649, deposit: 0, mcsShare: 292, contractor: "Lariel", contractorPay: 357, status: "Completed", date: "2026-07-02", completedAt: "2026-07-02T15:20:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_097", serviceLine: "DT", type: "Full Detail (custom)", service: "Mobile Detailing", customerName: "Elizabeth Kowalski", phone: "(786) 555-0254", address: "246 SE 3rd Ave, Coral Gables, FL 33134", gross: 492, price: 492, deposit: 0, mcsShare: 221, contractor: "Lariel", contractorPay: 271, status: "Completed", date: "2026-05-25", completedAt: "2026-05-25T15:45:00Z", seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_098", serviceLine: "JR", type: "Full Truck", service: "Junk Removal", customerName: "Gabriel Fontaine", phone: "(305) 555-0231", address: "845 SW 8th St, Miami, FL 33130", gross: 800, price: 800, deposit: 0, mcsShare: 400, contractor: "Kevies McNichols", contractorPay: 400, status: "Dispatched", date: "2026-07-11", completedAt: null, seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_099", serviceLine: "PW", type: "House 2-Story", service: "Pressure Washing", customerName: "Denise Kowalczyk", phone: "(786) 555-0244", address: "1290 NE 2nd Ave, Miami, FL 33132", gross: 675, price: 675, deposit: 0, mcsShare: 338, contractor: "Victor Gonzalez", contractorPay: 337, status: "New", date: "2026-07-14", completedAt: null, seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_100", serviceLine: "DT", type: "Full Detail", service: "Mobile Detailing", customerName: "Andre Beaumont", phone: "(954) 555-0207", address: "3100 N Andrews Ave, Fort Lauderdale, FL 33308", gross: 349, price: 349, deposit: 0, mcsShare: 105, contractor: "K1 Mobile Detailing (Kevin & Clayton)", contractorPay: 244, status: "Dispatched", date: "2026-07-16", completedAt: null, seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_101", serviceLine: "JR", type: "Complete Cleanout", service: "Junk Removal", customerName: "Sylvia Toussaint", phone: "(305) 555-0216", address: "9820 SW 40th St, Miami, FL 33165", gross: 1200, price: 1200, deposit: 0, mcsShare: 600, contractor: "Mason Hyatt", contractorPay: 600, status: "In Progress", date: "2026-07-19", completedAt: null, seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_102", serviceLine: "PW", type: "Driveway + Walkway", service: "Pressure Washing", customerName: "Marcus Reyes", phone: "(786) 555-0259", address: "560 SW 27th Ave, Miami, FL 33135", gross: 300, price: 300, deposit: 0, mcsShare: 135, contractor: "Gerardo Prado", contractorPay: 165, status: "New", date: "2026-07-22", completedAt: null, seed: true, seedBatchId: "2026-06-17-placeholder" },
  { id: "seed_103", serviceLine: "JR", type: "Half Truck", service: "Junk Removal", customerName: "Hannah Weiss", phone: "(561) 555-0238", address: "4200 N Federal Hwy, Boca Raton, FL 33431", gross: 450, price: 450, deposit: 0, mcsShare: 180, contractor: "Armani Haedo", contractorPay: 270, status: "Dispatched", date: "2026-07-25", completedAt: null, seed: true, seedBatchId: "2026-06-17-placeholder" },
];

// ═══════════════════════════════════════════════════════
// JOB CALENDAR  (blue glow = completed/past, pink glow = scheduled/future)
// ═══════════════════════════════════════════════════════
function JobCalendar({ jobs, compact = false }) {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(null);
  const pad = (n) => String(n).padStart(2, "0");

  const byDate = {};
  (jobs || []).forEach(j => {
    if (!j.date) return;
    const done = j.status === "Completed" || j.status === "Paid";
    if (!byDate[j.date]) byDate[j.date] = { completed: [], scheduled: [] };
    byDate[j.date][done ? "completed" : "scheduled"].push(j);
  });

  const first = new Date(ym.y, ym.m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${ym.y}-${pad(ym.m + 1)}-${pad(d)}`;
    cells.push({ d, ds, ...(byDate[ds] || { completed: [], scheduled: [] }) });
  }
  const prev = () => setYm(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 });
  const next = () => setYm(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 });

  const cellH = compact ? 34 : 46;
  const nav = { background: "rgba(148,163,184,0.1)", border: "1px solid rgba(148,163,184,0.15)", color: "#94A3B8", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px" };
  const selJobs = selected && byDate[selected] ? [...byDate[selected].completed, ...byDate[selected].scheduled] : [];

  return (
    <div style={{ background: "rgba(15,20,36,0.6)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: "12px", padding: compact ? "12px" : "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <button onClick={prev} style={nav}>‹</button>
        <div style={{ fontSize: compact ? "13px" : "15px", fontWeight: 700 }}>{label}</div>
        <button onClick={next} style={nav}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px", marginBottom: "3px" }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: "9px", color: "#64748B", fontWeight: 600 }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px" }}>
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const hasC = c.completed.length, hasS = c.scheduled.length;
          const isToday = c.ds === todayStr;
          let bg = "rgba(15,20,36,0.4)", border = "1px solid rgba(148,163,184,0.06)", glow = "none", numColor = "#64748B";
          if (hasC && hasS) { bg = "rgba(167,139,250,0.14)"; border = "1px solid rgba(167,139,250,0.55)"; glow = "0 0 10px rgba(167,139,250,0.45)"; numColor = "#F8FAFC"; }
          else if (hasC) { bg = "rgba(96,165,250,0.14)"; border = "1px solid rgba(96,165,250,0.55)"; glow = "0 0 10px rgba(96,165,250,0.45)"; numColor = "#F8FAFC"; }
          else if (hasS) { bg = "rgba(244,114,182,0.14)"; border = "1px solid rgba(244,114,182,0.55)"; glow = "0 0 10px rgba(244,114,182,0.45)"; numColor = "#F8FAFC"; }
          const count = hasC + hasS;
          const title = [...c.completed, ...c.scheduled].map(j => `${j.customerName} — ${j.service} ${fmt(Number(j.price))} (${j.status})`).join("\n");
          return (
            <button key={i} onClick={() => (hasC || hasS) && setSelected(selected === c.ds ? null : c.ds)} title={title || undefined}
              style={{ height: cellH + "px", background: bg, border: isToday ? "1px solid #F8FAFC" : border, boxShadow: glow, borderRadius: "8px", cursor: (hasC || hasS) ? "pointer" : "default", fontFamily: "inherit", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1px" }}>
              <span style={{ fontSize: compact ? "11px" : "13px", color: numColor, fontWeight: isToday ? 700 : 500 }}>{c.d}</span>
              {count > 0 && <span style={{ fontSize: "8px", fontWeight: 700, color: hasS && !hasC ? "#F472B6" : (hasC && hasS ? "#A78BFA" : "#60a5fa") }}>{count}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "10px", color: "#94A3B8" }}>
        <span><span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "3px", background: "#60a5fa", boxShadow: "0 0 6px rgba(96,165,250,0.7)", marginRight: "6px", verticalAlign: "middle" }} />Completed</span>
        <span><span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "3px", background: "#F472B6", boxShadow: "0 0 6px rgba(244,114,182,0.7)", marginRight: "6px", verticalAlign: "middle" }} />Scheduled</span>
      </div>
      {selected && selJobs.length > 0 && (
        <div style={{ marginTop: "12px", borderTop: "1px solid rgba(148,163,184,0.1)", paddingTop: "10px" }}>
          <div style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, marginBottom: "6px" }}>{new Date(selected + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          {selJobs.map(j => (
            <div key={j.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "6px", background: "rgba(10,14,26,0.5)", marginBottom: "3px" }}>
              <div><div style={{ fontSize: "12px", fontWeight: 600 }}>{j.customerName}</div><div style={{ fontSize: "10px", color: "#64748B" }}>{j.service} • {j.contractor}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: "12px", fontWeight: 600, color: "#22C55E" }}>{fmt(Number(j.price))}</div><span style={{ fontSize: "9px", color: STATUS_COLORS[j.status] || "#64748B" }}>{j.status}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CalendarPage({ jobs }) {
  const completed = jobs.filter(j => j.status === "Completed" || j.status === "Paid").length;
  const scheduled = jobs.filter(j => !["Completed", "Paid"].includes(j.status)).length;
  return (
    <div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Job Calendar</div>
      <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>{completed} completed • {scheduled} scheduled — tap a highlighted day to see its jobs</div>
      <JobCalendar jobs={jobs} />
    </div>
  );
}

function MagicCityOps() {
  const [page, setPage] = useState("home");
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    loadFromStorage(JOBS_KEY).then(data => {
      // Seed jobs live in source; real jobs live in storage. Strip any previously
      // persisted seeds so we never double-count, then merge fresh SEED_JOBS.
      const stored = (data && Array.isArray(data)) ? data.filter(j => !j.seed) : [];
      setJobs([...SEED_JOBS, ...stored]);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    // Persist only real jobs; seeds are re-merged from source on load.
    if (loaded) saveToStorage(JOBS_KEY, jobs.filter(j => !j.seed));
  }, [jobs, loaded]);

  const addJob = (job) => setJobs(prev => [{ ...job, id: genId(), createdAt: new Date().toISOString() }, ...prev]);
  const updateJob = (id, updates) => setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  const deleteJob = (id) => setJobs(prev => prev.filter(j => j.id !== id));

  const NAV_ITEMS = [
    { id: "home", label: "Dashboard", icon: "📊" },
    { id: "dispatch", label: "Jobs", icon: "📋" },
    { id: "pricing", label: "Pricing", icon: "💰" },
    { id: "quote", label: "Quotes", icon: "📝" },
    { id: "call", label: "Calls", icon: "📞" },
    { id: "followup", label: "Follow-Up", icon: "📲" },
    { id: "team", label: "Team", icon: "👥" },
    { id: "calendar", label: "Calendar", icon: "📅" },
  ];

  const pageProps = { jobs, addJob, updateJob, deleteJob, setPage };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(244,114,182,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setMobileNav(!mobileNav)} style={{ background: "none", border: "none", color: "#F8FAFC", fontSize: "20px", cursor: "pointer", padding: "4px" }}>☰</button>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, background: "linear-gradient(135deg, #F472B6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Magic City Ops</div>
              <div style={{ fontSize: "9px", color: "#64748B", letterSpacing: "1.5px" }}>COMMAND CENTER v2</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#94A3B8", textAlign: "right" }}>
            <div style={{ color: "#22C55E", fontWeight: 600 }}>{jobs.filter(j => j.status === "Completed" || j.status === "Paid").length} completed</div>
            <div>{jobs.filter(j => !["Completed","Paid"].includes(j.status)).length} active</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2px", padding: "0 8px 8px", overflowX: "auto", scrollbarWidth: "none" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setMobileNav(false); }}
              style={{ flexShrink: 0, padding: "6px 12px", borderRadius: "8px", border: "none", background: page === item.id ? "rgba(244,114,182,0.15)" : "transparent", color: page === item.id ? "#F472B6" : "#64748B", fontSize: "11px", fontWeight: page === item.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              <span style={{ marginRight: "4px" }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </div>

      {mobileNav && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div onClick={() => setMobileNav(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          <div style={{ position: "relative", width: "260px", background: "#0f1424", borderRight: "1px solid rgba(244,114,182,0.15)", padding: "20px 0", zIndex: 1 }}>
            <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, background: "linear-gradient(135deg, #F472B6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Magic City Ops</div>
            </div>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileNav(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", background: page === item.id ? "rgba(244,114,182,0.1)" : "transparent", border: "none", borderLeft: page === item.id ? "3px solid #F472B6" : "3px solid transparent", color: page === item.id ? "#F472B6" : "#94A3B8", fontSize: "14px", fontWeight: page === item.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <span style={{ fontSize: "18px" }}>{item.icon}</span>{item.label}
              </button>
            ))}
            <div style={{ padding: "16px 20px", marginTop: "20px", borderTop: "1px solid rgba(148,163,184,0.08)" }}>
              <div style={{ fontSize: "10px", color: "#475569", letterSpacing: "1px" }}>QUICK CONTACTS</div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px", lineHeight: 1.8 }}>
                Hub: (305) 570-3041<br/>JR: (786) 822-8281<br/>PW: (305) 783-3133<br/>Detail: (305) 306-8078
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "12px", maxWidth: "800px", margin: "0 auto" }}>
        {page === "home" && <HomePage {...pageProps} />}
        {page === "dispatch" && <DispatchPage {...pageProps} />}
        {page === "pricing" && <PricingPage />}
        {page === "quote" && <QuotePage />}
        {page === "call" && <CallPage />}
        {page === "followup" && <FollowUpPage />}
        {page === "team" && <TeamPage />}
        {page === "calendar" && <CalendarPage {...pageProps} />}
      </div>

      <div style={{ padding: "20px 16px", textAlign: "center", fontSize: "9px", color: "rgba(100,116,139,0.4)", letterSpacing: "1.5px" }}>
        MAGIC CITY SERVICES LLC — OPS v2 — PRICES UPDATED 4/15/2026
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HOME / DASHBOARD
// ═══════════════════════════════════════════════════════

function HomePage({ jobs, setPage }) {
  const completedJobs = jobs.filter(j => j.status === "Completed" || j.status === "Paid");
  const totalRevenue = completedJobs.reduce((s, j) => s + (Number(j.price) || 0), 0);
  const companyShare = completedJobs.reduce((s, j) => {
    if (j.mcsShare != null) return s + Number(j.mcsShare);
    const pct = getCompanySplit(j.contractor) / 100;
    return s + Math.round((Number(j.price) || 0) * pct);
  }, 0);
  const activeJobs = jobs.filter(j => !["Completed", "Paid"].includes(j.status));
  const todayStr = new Date().toISOString().split("T")[0];
  const todayJobs = jobs.filter(j => j.date === todayStr);
  const newJobs = jobs.filter(j => j.status === "New");
  const depositsCollected = jobs.reduce((s, j) => s + (Number(j.deposit) || 0), 0);

  const SPRINT_START = new Date("2026-04-03");
  const SPRINT_END = new Date("2026-08-28");
  const daysElapsed = Math.floor((new Date() - SPRINT_START) / 86400000);
  const totalSprintDays = Math.round((SPRINT_END - SPRINT_START) / 86400000);
  const daysLeft = Math.max(Math.ceil((SPRINT_END - new Date()) / 86400000), 0);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700 }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, Myles</div>
        <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} — Day {daysElapsed} of {totalSprintDays}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "Total Revenue", value: fmt(totalRevenue), sub: `${fmt(companyShare)} your cut`, color: "#22C55E" },
          { label: "Active Jobs", value: activeJobs.length, sub: `${newJobs.length} need dispatch`, color: "#F472B6" },
          { label: "Deposits In", value: fmt(depositsCollected), sub: "collected to date", color: "#FBBF24" },
          { label: "Today", value: todayJobs.length, sub: todayJobs.length > 0 ? "jobs scheduled" : "clear schedule", color: "#60a5fa" },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(15,20,36,0.8)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: s.color, marginTop: "4px" }}>{s.value}</div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 600 }}>QUICK ACTIONS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "20px" }}>
        {[
          { label: "New Job", icon: "➕", pg: "dispatch" },
          { label: "Get Price", icon: "💰", pg: "pricing" },
          { label: "Send Quote", icon: "📝", pg: "quote" },
          { label: "Live Call", icon: "📞", pg: "call" },
          { label: "Follow Up", icon: "📲", pg: "followup" },
          { label: "Team", icon: "👥", pg: "team" },
        ].map((a, i) => (
          <button key={i} onClick={() => setPage(a.pg)}
            style={{ padding: "14px 8px", borderRadius: "10px", border: "1px solid rgba(148,163,184,0.08)", background: "rgba(15,20,36,0.6)", color: "#94A3B8", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{a.icon}</div>{a.label}
          </button>
        ))}
      </div>

      {jobs.length > 0 && (
        <>
          <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 600 }}>RECENT JOBS</div>
          {[...jobs].filter(j => ["Completed", "Paid"].includes(j.status)).sort((a, b) => (b.completedAt || b.date || "").localeCompare(a.completedAt || a.date || "")).slice(0, 5).map(job => (
            <div key={job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(15,20,36,0.6)", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.06)", marginBottom: "4px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{job.customerName}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>{job.service} • {fmtDate(job.date)} • <span style={{ color: job.contractor === "Unassigned" ? "#F472B6" : "#60a5fa" }}>{job.contractor || "Unassigned"}</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#22C55E" }}>{job.price ? fmt(Number(job.price)) : "—"}</div>
                <span style={{ fontSize: "9px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", background: `${STATUS_COLORS[job.status]}15`, color: STATUS_COLORS[job.status] }}>{job.status}</span>
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", margin: "20px 0 8px", fontWeight: 600 }}>THIS MONTH</div>
      <JobCalendar jobs={jobs} compact />

      <div style={{ marginTop: "20px", padding: "16px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(244,114,182,0.06), rgba(96,165,250,0.06))", border: "1px solid rgba(244,114,182,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: "10px", color: "#F472B6", letterSpacing: "1.5px", fontWeight: 600 }}>$250K TARGET</div>
          <div style={{ fontSize: "11px", color: "#64748B" }}>{daysLeft} days left — August 28, 2026</div>
        </div>
        <div style={{ marginTop: "8px", height: "8px", borderRadius: "4px", background: "rgba(148,163,184,0.1)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(90deg, #F472B6, #60a5fa)", width: `${Math.min((companyShare / 250000) * 100, 100)}%`, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ fontSize: "12px", color: "#94A3B8" }}>{fmt(companyShare)} earned (your share)</span>
          <span style={{ fontSize: "12px", color: "#64748B" }}>{fmt(250000 - companyShare)} to go</span>
        </div>
        <div style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>
          Need {fmt(Math.round((250000 - companyShare) / Math.max(daysLeft, 1)))}/day to hit target
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// DISPATCH / JOBS
// ═══════════════════════════════════════════════════════

function DispatchPage({ jobs, addJob, updateJob, deleteJob }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [dispatchText, setDispatchText] = useState(null);
  const [copiedDispatch, setCopiedDispatch] = useState(false);
  const emptyForm = { customerName: "", phone: "", email: "", address: "", service: "Junk Removal", package: "", date: "", time: "", price: "", deposit: "", contractor: "Unassigned", status: "New", notes: "", source: "Website" };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (job) => { setForm({ customerName: job.customerName, phone: job.phone || "", email: job.email || "", address: job.address || "", service: job.service, package: job.package || "", date: job.date || "", time: job.time || "", price: job.price || "", deposit: job.deposit || "", contractor: job.contractor || "Unassigned", status: job.status, notes: job.notes || "", source: job.source || "Website" }); setEditingId(job.id); setShowForm(true); };

  const handleSubmit = () => {
    if (!form.customerName) return;
    if (editingId) { updateJob(editingId, form); } else { addJob(form); }
    setShowForm(false); setEditingId(null); setForm(emptyForm);
  };

  // Generate dispatch text for contractor
  const generateDispatch = (job) => {
    const c = CONTRACTORS.find(x => x.name === job.contractor);
    const text = `New job from Magic City Services:\n\nCustomer: ${job.customerName}\nPhone: ${job.phone || "N/A"}\nAddress: ${job.address || "TBD"}\nService: ${job.service}${job.package ? " — " + job.package : ""}\nDate: ${job.date ? fmtDate(job.date) : "TBD"}${job.time ? " at " + job.time : ""}\nPrice: ${job.price ? fmt(Number(job.price)) : "TBD"}\n${job.notes ? "\nNotes: " + job.notes : ""}\n\nPlease confirm you can take this job. Reply YES to accept.`;
    setDispatchText(text);
    setCopiedDispatch(false);
  };

  const copyDispatch = () => { navigator.clipboard.writeText(dispatchText).then(() => { setCopiedDispatch(true); setTimeout(() => setCopiedDispatch(false), 2000); }); };

  // Generate booking confirmation text for customer
  const generateConfirmation = (job) => {
    const svcPhone = { "Junk Removal": "(786) 822-8281", "Pressure Washing": "(305) 783-3133", "Mobile Detailing": "(305) 306-8078" };
    const text = `Hey ${job.customerName.split(" ")[0]}, it's Myles from Magic City Services — just confirming your ${job.service}${job.package ? " (" + job.package + ")" : ""} ${job.date ? "on " + fmtDate(job.date) : ""}${job.time ? " at " + job.time : ""} at your location${job.address ? " on " + job.address.split(",")[0] : ""}.\n\n${job.deposit ? "Your " + fmt(Number(job.deposit)) + " deposit has been received. " : ""}${job.price ? "Remaining balance of " + fmt(Number(job.price) - Number(job.deposit || 0)) + " is due upon completion." : ""}\n\nOur crew will reach out before your appointment to confirm details. If you have any questions, text or call me directly.\n\nMyles Stute\nMagic City Services LLC\n(305) 570-3041\nmagiccityservicesmiami.com`;
    setDispatchText(text);
    setCopiedDispatch(false);
  };

  const filtered = jobs.filter(j => {
    if (filterStatus !== "All" && j.status !== filterStatus) return false;
    if (search && !j.customerName?.toLowerCase().includes(search.toLowerCase()) && !j.address?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const availableContractors = [{name:"Unassigned"}, ...CONTRACTORS.filter(c => c.services.includes(form.service) && c.status !== "blacklisted")];
  const inp = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "rgba(10,14,26,0.9)", color: "#F8FAFC", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px", letterSpacing: "0.5px", textTransform: "uppercase" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>Jobs & Dispatch</div>
        <button onClick={openNew} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #F472B6, #60a5fa)", color: "#0a0e1a", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Job</button>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {["All", ...JOB_STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ flexShrink: 0, padding: "5px 12px", borderRadius: "6px", border: "none", background: filterStatus === s ? (s === "All" ? "rgba(244,114,182,0.15)" : `${STATUS_COLORS[s]}18`) : "rgba(15,20,36,0.6)", color: filterStatus === s ? (s === "All" ? "#F472B6" : STATUS_COLORS[s]) : "#64748B", fontSize: "11px", fontWeight: filterStatus === s ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
            {s} {s !== "All" && <span style={{ opacity: 0.7 }}>({jobs.filter(j => j.status === s).length})</span>}
          </button>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." style={{ ...inp, marginBottom: "12px" }} />

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#475569", fontSize: "13px" }}>No jobs yet. Click + New Job to start.</div>}

      {filtered.map(job => {
        const compPct = getCompanySplit(job.contractor);
        const yourCut = job.price ? Math.round(Number(job.price) * compPct / 100) : 0;
        return (
        <div key={job.id} style={{ background: "rgba(15,20,36,0.7)", borderRadius: "10px", border: "1px solid rgba(148,163,184,0.06)", padding: "12px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>{job.customerName}</div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>{job.service}{job.package ? ` — ${job.package}` : ""}</div>
              {job.address && <div style={{ fontSize: "11px", color: "#475569" }}>{job.address}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              {job.price && <div style={{ fontSize: "15px", fontWeight: 700, color: "#22C55E" }}>{fmt(Number(job.price))}</div>}
              {yourCut > 0 && <div style={{ fontSize: "10px", color: "#F472B6" }}>You keep {fmt(yourCut)}</div>}
              <span style={{ fontSize: "9px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", background: `${STATUS_COLORS[job.status]}15`, color: STATUS_COLORS[job.status] }}>{job.status}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748B", marginBottom: "8px" }}>
            <span>{job.date ? fmtDate(job.date) : "No date"}{job.time ? ` • ${job.time}` : ""}</span>
            <span style={{ color: job.contractor === "Unassigned" ? "#F472B6" : "#60a5fa", fontWeight: 600 }}>{job.contractor || "Unassigned"}</span>
          </div>
          {job.deposit && <div style={{ fontSize: "10px", color: "#FBBF24", marginBottom: "4px" }}>Deposit: {fmt(Number(job.deposit))} collected</div>}
          {job.notes && <div style={{ fontSize: "11px", color: "#475569", fontStyle: "italic", marginBottom: "6px" }}>{job.notes}</div>}
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {JOB_STATUSES.filter(s => s !== job.status).map(s => (
              <button key={s} onClick={() => updateJob(job.id, { status: s })}
                style={{ padding: "4px 10px", borderRadius: "5px", border: `1px solid ${STATUS_COLORS[s]}30`, background: "transparent", color: STATUS_COLORS[s], fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                → {s}
              </button>
            ))}
            <button onClick={() => generateDispatch(job)} style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid rgba(34,197,94,0.3)", background: "transparent", color: "#22C55E", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📤 Dispatch</button>
            <button onClick={() => generateConfirmation(job)} style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid rgba(96,165,250,0.3)", background: "transparent", color: "#60a5fa", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✅ Confirm</button>
            <button onClick={() => openEdit(job)} style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid rgba(148,163,184,0.15)", background: "transparent", color: "#94A3B8", fontSize: "10px", cursor: "pointer", fontFamily: "inherit" }}>✏️</button>
            <button onClick={() => { if (confirm("Delete this job?")) deleteJob(job.id); }} style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#EF4444", fontSize: "10px", cursor: "pointer", fontFamily: "inherit" }}>🗑️</button>
          </div>
        </div>
        );
      })}

      {/* Dispatch / Confirmation Text Modal */}
      {dispatchText && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ maxWidth: "500px", width: "100%", background: "#0f1424", borderRadius: "14px", border: "1px solid rgba(244,114,182,0.15)", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#22C55E" }}>Ready to Send</div>
              <button onClick={() => setDispatchText(null)} style={{ background: "none", border: "none", color: "#64748B", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(15,20,36,0.6)", border: "1px solid rgba(148,163,184,0.08)", fontSize: "12px", lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: "300px", overflowY: "auto", marginBottom: "12px" }}>{dispatchText}</div>
            <button onClick={copyDispatch} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: copiedDispatch ? "linear-gradient(135deg, #22C55E, #16A34A)" : "linear-gradient(135deg, #F472B6, #60a5fa)", color: "#0a0e1a", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {copiedDispatch ? "✓ Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}

      {/* New/Edit Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 300, overflowY: "auto", padding: "16px" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", background: "#0f1424", borderRadius: "14px", border: "1px solid rgba(244,114,182,0.15)", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#F472B6" }}>{editingId ? "Edit Job" : "New Job"}</div>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#64748B", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: "9px", color: "#F472B6", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 600 }}>CUSTOMER</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
              <div><label style={lbl}>Name *</label><input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} placeholder="First Last" style={inp} /></div>
              <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(305) 000-0000" style={inp} /></div>
            </div>
            <div style={{ marginBottom: "6px" }}><label style={lbl}>Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" style={inp} /></div>
            <div style={{ marginBottom: "12px" }}><label style={lbl}>Address</label><input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Street, City FL Zip" style={inp} /></div>

            <div style={{ fontSize: "9px", color: "#60a5fa", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 600 }}>JOB DETAILS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
              <div><label style={lbl}>Service *</label>
                <select value={form.service} onChange={e => setForm({...form, service: e.target.value, contractor: "Unassigned"})} style={inp}>
                  {SERVICE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
              <div><label style={lbl}>Package</label><input value={form.package} onChange={e => setForm({...form, package: e.target.value})} placeholder="Full Detail" style={inp} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
              <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp} /></div>
              <div><label style={lbl}>Time</label><input value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="9:00 AM" style={inp} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "12px" }}>
              <div><label style={lbl}>Total Price</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="299" style={inp} /></div>
              <div><label style={lbl}>Deposit</label><input type="number" value={form.deposit} onChange={e => setForm({...form, deposit: e.target.value})} placeholder="50" style={inp} /></div>
            </div>

            <div style={{ fontSize: "9px", color: "#22C55E", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 600 }}>DISPATCH</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
              <div><label style={lbl}>Contractor</label>
                <select value={form.contractor} onChange={e => setForm({...form, contractor: e.target.value})} style={inp}>
                  {availableContractors.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select></div>
              <div><label style={lbl}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={inp}>
                  {JOB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
            </div>
            <div style={{ marginBottom: "6px" }}><label style={lbl}>Lead Source</label>
              <select value={form.source} onChange={e => setForm({...form, source: e.target.value})} style={inp}>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div style={{ marginBottom: "14px" }}><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Job details..." rows={2} style={{...inp, resize: "vertical", lineHeight: 1.4}} /></div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "transparent", color: "#94A3B8", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handleSubmit} style={{ flex: 2, padding: "12px", borderRadius: "8px", border: "none", background: form.customerName ? "linear-gradient(135deg, #F472B6, #60a5fa)" : "rgba(148,163,184,0.15)", color: form.customerName ? "#0a0e1a" : "#64748B", fontSize: "13px", fontWeight: 700, cursor: form.customerName ? "pointer" : "default", fontFamily: "inherit" }}>
                {editingId ? "Update Job" : "Log Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// PRICING CALCULATOR (identical structure, updated prices are in SERVICES_DATA above)
// ═══════════════════════════════════════════════════════

function PricingPage() {
  const [cat, setCat] = useState("Pressure Washing");
  const [item, setItem] = useState(null);
  const [splitIdx, setSplitIdx] = useState(0);
  const [timeSlot, setTimeSlot] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [unitCount, setUnitCount] = useState("");

  const category = SERVICES_DATA[cat];
  const slot = TIME_SLOTS[timeSlot];

  const selectItem = (it) => { setItem(it); setCustomPrice(""); setUnitCount(""); if (it.customSplit) { const idx = SPLITS.findIndex(s => s.contractor === it.customSplit.contractor); if (idx !== -1) setSplitIdx(idx); } };
  const getPrice = () => { if (!item) return 0; if (item.isCustomQuote) return parseFloat(customPrice) || 0; if (item.isPerUnit) return item.price * (parseFloat(unitCount) || 0); return customPrice ? parseFloat(customPrice) : item.price; };
  const getRangePrice = () => (!item?.range || customPrice) ? null : item.range;

  const price = getPrice();
  const rangePrice = getRangePrice();
  const fee = slot.fee;
  const activeSplit = item?.customSplit || SPLITS[splitIdx];

  return (
    <div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Pricing Calculator</div>
      <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "12px" }}>Updated 4/15/2026 — all prices current</div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "10px", overflowX: "auto", scrollbarWidth: "none" }}>
        {Object.keys(SERVICES_DATA).map(c => (
          <button key={c} onClick={() => { setCat(c); setItem(null); }}
            style={{ flexShrink: 0, padding: "6px 12px", borderRadius: "8px", border: cat === c ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.1)", background: cat === c ? "rgba(244,114,182,0.12)" : "rgba(15,20,36,0.6)", color: cat === c ? "#F472B6" : "#64748B", fontSize: "11px", fontWeight: cat === c ? 600 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            {SERVICES_DATA[c].icon} {c}
          </button>
        ))}
      </div>

      <div style={{ fontSize: "11px", color: "#475569", marginBottom: "10px" }}>{category.phone}</div>

      {!item ? (
        category.items.map((it, i) => (
          <button key={i} onClick={() => selectItem(it)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.06)", background: "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left" }}>
            <span style={{ fontSize: "13px" }}>{it.name}</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#22C55E" }}>
                {it.isCustomQuote ? "Custom" : it.isPerUnit ? `${fmt(it.price)}/${it.unit}` : it.range ? `${fmt(it.price)}–${fmt(it.range)}` : fmt(it.price)}
              </span>
              {it.deposit > 0 && <div style={{ fontSize: "9px", color: "#FBBF24" }}>{fmt(it.deposit)} deposit</div>}
            </div>
          </button>
        ))
      ) : (
        <div>
          <button onClick={() => setItem(null)} style={{ background: "none", border: "none", color: "#F472B6", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", marginBottom: "10px", padding: 0 }}>← Back to list</button>
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>{item.name}</div>

          {(item.isCustomQuote || item.isPerUnit) && (
            <div style={{ background: "rgba(15,20,36,0.6)", borderRadius: "10px", padding: "12px", border: "1px solid rgba(148,163,184,0.08)", marginBottom: "10px" }}>
              <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px" }}>{item.isPerUnit ? `Number of ${item.unit}` : "Enter Price"}</label>
              <input type="number" value={item.isPerUnit ? unitCount : customPrice} onChange={e => item.isPerUnit ? setUnitCount(e.target.value) : setCustomPrice(e.target.value)} placeholder={item.isPerUnit ? "e.g. 1500" : "0"} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "rgba(10,14,26,0.9)", color: "#F8FAFC", fontSize: "18px", fontWeight: 600, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          )}

          {!item.isCustomQuote && !item.isPerUnit && (
            <div style={{ background: "rgba(15,20,36,0.6)", borderRadius: "10px", padding: "12px", border: "1px solid rgba(148,163,184,0.08)", marginBottom: "10px" }}>
              <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px" }}>Price Override (optional)</label>
              <input type="number" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder={`Default: ${fmt(item.price)}`} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "rgba(10,14,26,0.9)", color: "#F8FAFC", fontSize: "16px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          )}

          <div style={{ background: "rgba(15,20,36,0.6)", borderRadius: "10px", padding: "12px", border: "1px solid rgba(148,163,184,0.08)", marginBottom: "10px" }}>
            <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "6px" }}>Time Slot</label>
            <div style={{ display: "flex", gap: "4px" }}>
              {TIME_SLOTS.map((s, i) => (
                <button key={i} onClick={() => setTimeSlot(i)} style={{ flex: 1, padding: "8px 4px", borderRadius: "6px", border: timeSlot === i ? (s.fee ? "1px solid #FBBF24" : "1px solid #60a5fa") : "1px solid rgba(148,163,184,0.1)", background: timeSlot === i ? (s.fee ? "rgba(251,191,36,0.08)" : "rgba(96,165,250,0.08)") : "transparent", color: timeSlot === i ? (s.fee ? "#FBBF24" : "#60a5fa") : "#64748B", fontSize: "10px", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                  <div style={{ fontWeight: 600 }}>{s.label}</div><div style={{ fontSize: "9px", opacity: 0.8 }}>{s.range}</div>
                  {s.fee > 0 && <div style={{ fontWeight: 700 }}>+${s.fee}</div>}
                </button>
              ))}
            </div>
          </div>

          {!item.customSplit ? (
            <div style={{ background: "rgba(15,20,36,0.6)", borderRadius: "10px", padding: "12px", border: "1px solid rgba(148,163,184,0.08)", marginBottom: "10px" }}>
              <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "6px" }}>Split (Contractor / Company)</label>
              <div style={{ display: "flex", gap: "4px" }}>
                {SPLITS.map((s, i) => (
                  <button key={i} onClick={() => setSplitIdx(i)} style={{ flex: 1, padding: "8px 4px", borderRadius: "6px", border: splitIdx === i ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.1)", background: splitIdx === i ? "rgba(244,114,182,0.1)" : "transparent", color: splitIdx === i ? "#F472B6" : "#64748B", fontSize: "11px", fontWeight: splitIdx === i ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.15)", fontSize: "12px", color: "#F472B6", textAlign: "center", fontWeight: 500, marginBottom: "10px" }}>Fixed Split: {item.customSplit.contractor}/{item.customSplit.company}</div>
          )}

          {price > 0 && (
            <div style={{ background: "linear-gradient(135deg, rgba(244,114,182,0.06), rgba(96,165,250,0.06))", borderRadius: "12px", border: "1px solid rgba(244,114,182,0.15)", padding: "16px" }}>
              <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "12px", textAlign: "center" }}>REVENUE BREAKDOWN</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>Customer Pays</span>
                <span style={{ fontSize: "22px", fontWeight: 700 }}>{rangePrice ? `${fmt(price)}–${fmt(rangePrice)}` : fmt(price)}</span>
              </div>
              {item.deposit > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
                  <span style={{ color: "#64748B" }}>Deposit</span>
                  <span style={{ color: "#FBBF24", fontWeight: 600 }}>{fmt(item.deposit)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#60a5fa" }}>Contractor ({activeSplit.contractor}%)</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#60a5fa" }}>
                  {rangePrice ? `${fmt(Math.round(price * activeSplit.contractor / 100))}–${fmt(Math.round(rangePrice * activeSplit.contractor / 100))}` : fmt(Math.round(price * activeSplit.contractor / 100))}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "13px", color: "#F472B6" }}>Magic City ({activeSplit.company}%)</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#F472B6" }}>
                  {rangePrice ? `${fmt(Math.round(price * activeSplit.company / 100))}–${fmt(Math.round(rangePrice * activeSplit.company / 100))}` : fmt(Math.round(price * activeSplit.company / 100))}
                </span>
              </div>
              {fee > 0 && (
                <div style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#FBBF24" }}>{slot.label} premium → Contractor</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#FBBF24" }}>+${fee}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// QUOTE GENERATOR
// ═══════════════════════════════════════════════════════

function QuotePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [serviceKey, setServiceKey] = useState(null);
  const [pkg, setPkg] = useState("");
  const [price, setPrice] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [template, setTemplate] = useState("standard");
  const [copied, setCopied] = useState(false);

  const svcOptions = [
    { key: "pw", label: "Pressure Washing", phone: "(305) 783-3133", site: "magiccitypressurewashingmiami.com" },
    { key: "jr", label: "Junk Removal", phone: "(786) 822-8281", site: "magiccityjunkremovalmiami.com" },
    { key: "dt", label: "Detailing", phone: "(305) 306-8078", site: "magiccitydetailingmiami.com" },
    { key: "paint", label: "Painting", phone: "(305) 783-3133", site: "magiccitypressurewashingmiami.com" },
  ];

  const svc = svcOptions.find(s => s.key === serviceKey);
  const firstName = name.split(" ")[0] || "there";
  const priceNum = parseFloat(price) || 0;

  const templates = {
    standard: `Hey ${firstName}, thanks for reaching out to Magic City Services! Here's your quote:\n\nService: ${svc?.label || ""} — ${pkg}\nTotal: ${fmt(priceNum)}${dateTime ? `\nScheduled: ${dateTime}` : ""}\n\nThis includes a fully insured, professional crew with commercial-grade equipment. We guarantee every job — if you're not happy, we make it right.\n\nReady to book? Reply here or call ${svc?.phone || ""}.\n\nMyles Stute\nMagic City Services LLC\n${svc?.site || "magiccityservicesmiami.com"}`,
    followup: `Hey ${firstName}, it's Myles from Magic City Services following up on our conversation.\n\nService: ${svc?.label || ""} — ${pkg}\nTotal: ${fmt(priceNum)}\n\nWe've got availability this week. Just reply here or call ${svc?.phone || ""} and we'll lock it in.\n\nMyles Stute\nMagic City Services LLC`,
    urgency: `Hey ${firstName}, Myles from Magic City Services — our schedule is filling up fast this week.\n\nService: ${svc?.label || ""} — ${pkg}\nTotal: ${fmt(priceNum)}\n\nIf you want to lock this in, just reply and I'll reserve the crew. Once the schedule is full, next opening won't be for another week.\n\nMyles Stute\nMagic City Services LLC`,
  };

  const quoteText = templates[template] || "";
  const handleCopy = () => { navigator.clipboard.writeText(quoteText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const inp = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "rgba(10,14,26,0.9)", color: "#F8FAFC", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Quote Generator</div>
      {step === 1 && (
        <div>
          <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 600 }}>STEP 1 — CUSTOMER & SERVICE</div>
          <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px" }}>Customer Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="First Last" style={{ ...inp, marginBottom: "10px" }} />
          <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "6px" }}>Service</label>
          {svcOptions.map(s => (
            <button key={s.key} onClick={() => setServiceKey(s.key)} style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: serviceKey === s.key ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.06)", background: serviceKey === s.key ? "rgba(244,114,182,0.08)" : "rgba(15,20,36,0.6)", color: serviceKey === s.key ? "#F472B6" : "#F8FAFC", fontSize: "13px", fontWeight: serviceKey === s.key ? 600 : 400, cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left" }}>{s.label}</button>
          ))}
          <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px", marginTop: "10px" }}>Package</label>
          <input value={pkg} onChange={e => setPkg(e.target.value)} placeholder="e.g. Full Detail, Half Truck" style={{ ...inp, marginBottom: "10px" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px" }}>Price</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="349" style={inp} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "4px" }}>Date/Time</label>
              <input value={dateTime} onChange={e => setDateTime(e.target.value)} placeholder="Sat 4/18, 9 AM" style={inp} /></div>
          </div>
          <button onClick={() => { if (name && serviceKey && pkg && price) setStep(2); }} style={{ width: "100%", marginTop: "14px", padding: "12px", borderRadius: "8px", border: "none", background: (name && serviceKey && pkg && price) ? "linear-gradient(135deg, #F472B6, #60a5fa)" : "rgba(148,163,184,0.15)", color: (name && serviceKey) ? "#0a0e1a" : "#64748B", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 600 }}>STEP 2 — TEMPLATE</div>
          {[{ id: "standard", label: "Standard Quote", emoji: "📋" }, { id: "followup", label: "Follow-Up", emoji: "📲" }, { id: "urgency", label: "Urgency Close", emoji: "⚡" }].map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)} style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: template === t.id ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.06)", background: template === t.id ? "rgba(244,114,182,0.08)" : "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "6px", textAlign: "left", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "20px" }}>{t.emoji}</span><span style={{ fontSize: "13px", fontWeight: 600, color: template === t.id ? "#F472B6" : "#F8FAFC" }}>{t.label}</span>
            </button>
          ))}
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "transparent", color: "#94A3B8", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: "12px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #F472B6, #60a5fa)", color: "#0a0e1a", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Generate →</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", marginBottom: "10px" }}>
            <div><div style={{ fontSize: "14px", fontWeight: 600 }}>{name}</div><div style={{ fontSize: "11px", color: "#64748B" }}>{svc?.label} — {pkg}</div></div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#22C55E" }}>{fmt(priceNum)}</div>
          </div>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(15,20,36,0.6)", border: "1px solid rgba(148,163,184,0.08)", fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: "280px", overflowY: "auto", marginBottom: "12px" }}>{quoteText}</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "transparent", color: "#94A3B8", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>← Edit</button>
            <button onClick={handleCopy} style={{ flex: 2, padding: "12px", borderRadius: "8px", border: "none", background: copied ? "linear-gradient(135deg, #22C55E, #16A34A)" : "linear-gradient(135deg, #F472B6, #60a5fa)", color: "#0a0e1a", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "✓ Copied!" : "Copy Quote"}</button>
          </div>
          <button onClick={() => { setStep(1); setName(""); setServiceKey(null); setPkg(""); setPrice(""); setDateTime(""); setCopied(false); }} style={{ width: "100%", marginTop: "8px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.1)", background: "transparent", color: "#64748B", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Start New Quote</button>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// CALL COMPANION
// ═══════════════════════════════════════════════════════

function CallPage() {
  const [line, setLine] = useState(null);
  const [tab, setTab] = useState("greet");
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [checkedQs, setCheckedQs] = useState({});
  const [callNotes, setCallNotes] = useState({ name: "", phone: "", address: "", notes: "" });

  if (!line) {
    return (
      <div>
        <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Call Companion</div>
        <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>Which line is ringing?</div>
        {Object.entries(CALL_SERVICES).map(([key, svc]) => (
          <button key={key} onClick={() => { setLine(key); setTab("greet"); setCheckedQs({}); setCallNotes({ name: "", phone: "", address: "", notes: "" }); setExpandedIdx(null); }}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "10px", border: "1px solid rgba(148,163,184,0.08)", background: "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "6px" }}>
            <div><div style={{ fontSize: "14px", fontWeight: 600 }}>{svc.label}</div><div style={{ fontSize: "12px", color: "#60a5fa", marginTop: "2px" }}>{svc.phone}</div></div>
            <span style={{ color: "#64748B" }}>→</span>
          </button>
        ))}
      </div>
    );
  }

  const svc = CALL_SERVICES[line];
  const svcKey = line === "hub" ? "jr" : line;
  const qs = QUALIFYING[svcKey] || [];
  const ups = UPSELLS[svcKey] || [];
  const TABS = [{ id: "greet", label: "Greet" }, { id: "qualify", label: "Qualify" }, { id: "object", label: "Objections" }, { id: "upsell", label: "Upsell" }, { id: "close", label: "Close" }, { id: "notes", label: "Notes" }];
  const inp = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "rgba(10,14,26,0.9)", color: "#F8FAFC", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setLine(null)} style={{ background: "none", border: "none", color: "#F472B6", fontSize: "14px", cursor: "pointer", padding: 0 }}>←</button>
        <div><div style={{ fontSize: "16px", fontWeight: 700 }}>{svc.label}</div><div style={{ fontSize: "11px", color: "#60a5fa" }}>{svc.phone}</div></div>
      </div>
      <div style={{ display: "flex", gap: "2px", marginBottom: "12px", overflowX: "auto", scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setExpandedIdx(null); }} style={{ flexShrink: 0, padding: "6px 10px", borderRadius: "6px", border: "none", background: tab === t.id ? "rgba(244,114,182,0.15)" : "transparent", color: tab === t.id ? "#F472B6" : "#64748B", fontSize: "11px", fontWeight: tab === t.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
        ))}
      </div>

      {tab === "greet" && (
        <div>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", fontSize: "14px", lineHeight: 1.6, color: "#22C55E", marginBottom: "10px" }}>"{svc.greeting}"</div>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", fontSize: "13px", lineHeight: 1.6, color: "#60a5fa" }}>Then: "{svc.followUp}"</div>
        </div>
      )}
      {tab === "qualify" && qs.map((q, i) => (
        <button key={i} onClick={() => setCheckedQs(p => ({...p, [i]: !p[i]}))} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: checkedQs[i] ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(148,163,184,0.06)", background: checkedQs[i] ? "rgba(34,197,94,0.06)" : "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left" }}>
          <div style={{ fontSize: "13px", fontWeight: 500 }}>{checkedQs[i] ? "✅" : "○"} {q.q}</div>
          <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{q.note}</div>
        </button>
      ))}
      {tab === "object" && OBJECTIONS.map((o, i) => (
        <button key={i} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.06)", background: "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "13px", fontWeight: 600, color: "#FBBF24" }}>"{o.obj}"</span><span style={{ color: "#64748B", transform: expandedIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span></div>
          {expandedIdx === i && <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(148,163,184,0.08)", fontSize: "12px", lineHeight: 1.6, color: "#22C55E" }}>{o.response}</div>}
        </button>
      ))}
      {tab === "upsell" && ups.map((u, i) => (
        <button key={i} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.06)", background: "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "13px", fontWeight: 600, color: "#A78BFA" }}>{u.trigger}</span><span style={{ color: "#64748B", transform: expandedIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span></div>
          {expandedIdx === i && <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(148,163,184,0.08)", fontSize: "12px", lineHeight: 1.6, color: "#60a5fa" }}>{u.upsell}</div>}
        </button>
      ))}
      {tab === "close" && CLOSE_SCRIPTS.map((c, i) => (
        <button key={i} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.06)", background: "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "13px", fontWeight: 600, color: "#22C55E" }}>{c.label}</span><span style={{ color: "#64748B", transform: expandedIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span></div>
          {expandedIdx === i && <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(148,163,184,0.08)", fontSize: "12px", lineHeight: 1.6, color: "#22C55E" }}>"{c.script}"</div>}
        </button>
      ))}
      {tab === "notes" && (
        <div>
          {[{ key: "name", label: "Customer Name", ph: "John Smith" }, { key: "phone", label: "Phone", ph: "(305) 555-0000" }, { key: "address", label: "Address", ph: "123 Main St, Miami FL" }].map(f => (
            <div key={f.key} style={{ marginBottom: "8px" }}>
              <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "3px" }}>{f.label}</label>
              <input value={callNotes[f.key]} onChange={e => setCallNotes({...callNotes, [f.key]: e.target.value})} placeholder={f.ph} style={inp} />
            </div>
          ))}
          <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "3px" }}>Notes</label>
          <textarea value={callNotes.notes} onChange={e => setCallNotes({...callNotes, notes: e.target.value})} placeholder="2-story house, heavy mold..." rows={3} style={{...inp, resize: "vertical"}} />
          {(callNotes.name || callNotes.notes) && (
            <div style={{ marginTop: "12px", padding: "12px", borderRadius: "10px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)" }}>
              <div style={{ fontSize: "10px", color: "#60a5fa", fontWeight: 600, letterSpacing: "1px", marginBottom: "6px" }}>COPY TO CONTRACTOR</div>
              <div style={{ fontSize: "12px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {callNotes.name && `Customer: ${callNotes.name}\n`}{callNotes.phone && `Phone: ${callNotes.phone}\n`}{callNotes.address && `Address: ${callNotes.address}\n`}Service: {svc.label}{callNotes.notes && `\nNotes: ${callNotes.notes}`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// FOLLOW-UP
// ═══════════════════════════════════════════════════════

function FollowUpPage() {
  const [serviceIdx, setServiceIdx] = useState(null);
  const [templateIdx, setTemplateIdx] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState({ customerName: "", packageName: "", address: "", totalPaid: "", timeAgo: "", reviewLink: "" });

  const svcOptions = [{ label: "Junk Removal" }, { label: "Pressure Washing" }, { label: "Detailing" }, { label: "Painting" }];
  const svc = serviceIdx !== null ? svcOptions[serviceIdx] : null;
  const tpl = templateIdx !== null ? FOLLOWUP_TEMPLATES[templateIdx] : null;
  const firstName = fields.customerName.split(" ")[0] || "there";
  const genText = tpl && svc ? tpl.generate({ firstName, customerName: fields.customerName || "Customer", serviceName: svc.label, packageName: fields.packageName, address: fields.address, totalPaid: fields.totalPaid, timeAgo: fields.timeAgo, reviewLink: fields.reviewLink, jobDate: "Today", site: "magiccityservicesmiami.com", satisfied: false }) : "";
  const handleCopy = () => { navigator.clipboard.writeText(genText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  return (
    <div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Post-Job Follow-Up</div>
      <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "6px", fontWeight: 600 }}>SERVICE</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
        {svcOptions.map((s, i) => (
          <button key={i} onClick={() => setServiceIdx(i)} style={{ padding: "6px 12px", borderRadius: "6px", border: serviceIdx === i ? "1px solid #F472B6" : "1px solid rgba(148,163,184,0.1)", background: serviceIdx === i ? "rgba(244,114,182,0.1)" : "rgba(15,20,36,0.6)", color: serviceIdx === i ? "#F472B6" : "#64748B", fontSize: "11px", fontWeight: serviceIdx === i ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>{s.label}</button>
        ))}
      </div>
      {svc && (
        <>
          <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "6px", fontWeight: 600 }}>MESSAGE TYPE</div>
          {FOLLOWUP_TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => { setTemplateIdx(i); setCopied(false); }} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: templateIdx === i ? `1px solid ${t.color}40` : "1px solid rgba(148,163,184,0.06)", background: templateIdx === i ? `${t.color}0a` : "rgba(15,20,36,0.6)", color: "#F8FAFC", cursor: "pointer", fontFamily: "inherit", marginBottom: "4px", textAlign: "left", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>{t.emoji}</span>
              <div><div style={{ fontSize: "12px", fontWeight: 600, color: templateIdx === i ? t.color : "#F8FAFC" }}>{t.label}</div><div style={{ fontSize: "10px", color: "#64748B" }}>{t.desc}</div></div>
            </button>
          ))}
        </>
      )}
      {tpl && (
        <>
          <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginTop: "14px", marginBottom: "6px", fontWeight: 600 }}>DETAILS</div>
          {tpl.fields.map(key => (
            <div key={key} style={{ marginBottom: "6px" }}>
              <label style={{ fontSize: "10px", color: "#64748B", display: "block", marginBottom: "3px" }}>{key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</label>
              <input value={fields[key] || ""} onChange={e => setFields({...fields, [key]: e.target.value})} placeholder={key === "customerName" ? "Mary Johnson" : key === "reviewLink" ? "https://g.page/r/..." : ""} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "rgba(10,14,26,0.9)", color: "#F8FAFC", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
        </>
      )}
      {tpl && fields.customerName && (
        <>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(15,20,36,0.6)", border: `1px solid ${tpl.color}20`, fontSize: "12px", lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: "240px", overflowY: "auto", marginTop: "14px", marginBottom: "10px" }}>{genText}</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleCopy} style={{ flex: 2, padding: "12px", borderRadius: "8px", border: "none", background: copied ? "linear-gradient(135deg, #22C55E, #16A34A)" : `linear-gradient(135deg, ${tpl.color}, ${tpl.color}cc)`, color: "#0a0e1a", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "✓ Copied!" : "Copy to Clipboard"}</button>
            <button onClick={() => { setTemplateIdx(null); setFields({ customerName: "", packageName: "", address: "", totalPaid: "", timeAgo: "", reviewLink: "" }); setCopied(false); }} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.15)", background: "transparent", color: "#94A3B8", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>New</button>
          </div>
        </>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// TEAM / CONTRACTORS
// ═══════════════════════════════════════════════════════

function ContractorCard({ c }) {
  const [expanded, setExpanded] = useState(false);
  const isBlacklisted = c.status === "blacklisted";
  const pending = c.onboardingPending || [];
  const statusColors = { active: "#22C55E", pending: "#FBBF24", inactive: "#64748B", blacklisted: "#EF4444" };
  const sc = statusColors[c.status] || "#64748B";
  return (
    <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(15,20,36,0.6)", border: "1px solid rgba(148,163,184,0.06)", borderLeft: isBlacklisted ? "3px solid #EF4444" : "1px solid rgba(148,163,184,0.06)", marginBottom: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600 }}>{c.name || c.business}</div>
          <div style={{ fontSize: "11px", color: "#64748B" }}>{(c.services || []).join(" • ")}</div>
          {c.phone && <div style={{ fontSize: "11px", color: "#60a5fa", marginTop: "2px" }}>{c.phone}</div>}
          {c.email && <div style={{ fontSize: "10px", color: "#475569" }}>{c.email}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "9px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", background: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>{c.status}</span>
          {c.split && <div style={{ fontSize: "10px", color: "#F472B6", fontWeight: 600, marginTop: "4px" }}>{c.split}</div>}
        </div>
      </div>
      {c.notes && <div style={{ fontSize: "10px", color: "#475569", marginTop: "4px", fontStyle: "italic" }}>{c.notes}</div>}
      {isBlacklisted && c.blacklistReason && (
        <div style={{ fontSize: "10px", color: "#FCA5A5", marginTop: "6px", padding: "6px 8px", borderRadius: "6px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", lineHeight: 1.5 }}>
          <span style={{ fontWeight: 700, color: "#EF4444" }}>⛔ BLACKLISTED{c.blacklistedAt ? " · " + c.blacklistedAt : ""}:</span> {c.blacklistReason}
        </div>
      )}
      {pending.length > 0 && (
        <div style={{ marginTop: "6px" }}>
          <button onClick={() => setExpanded(v => !v)} style={{ cursor: "pointer", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.3)", fontFamily: "inherit" }}>
            ⚠ {pending.length} pending onboarding task{pending.length !== 1 ? "s" : ""} {expanded ? "▲" : "▼"}
          </button>
          {expanded && (
            <ul style={{ margin: "6px 0 0", padding: "0 0 0 18px", fontSize: "10px", color: "#94A3B8", lineHeight: 1.7 }}>
              {pending.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function TeamPage() {
  const active = CONTRACTORS.filter(c => c.status === "active");
  const pending = CONTRACTORS.filter(c => c.status === "pending");
  const blacklisted = CONTRACTORS.filter(c => c.status === "blacklisted");
  const [showBlacklist, setShowBlacklist] = useState(false);

  const renderGroup = (label, list) => list.length > 0 && (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1.5px", marginBottom: "6px", fontWeight: 600 }}>{label} ({list.length})</div>
      {list.map((c, i) => <ContractorCard key={c.id || c.name || i} c={c} />)}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Team & Contractors</div>
      <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>
        {active.length} dispatch-ready • {pending.length} pending
      </div>
      {renderGroup("DISPATCH-READY", active)}
      {renderGroup("CONTRACTS PENDING", pending)}

      {blacklisted.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <button onClick={() => setShowBlacklist(v => !v)} style={{ cursor: "pointer", width: "100%", textAlign: "left", fontSize: "10px", color: "#EF4444", letterSpacing: "1.5px", marginBottom: "6px", fontWeight: 600, background: "transparent", border: "none", padding: 0, fontFamily: "inherit" }}>
            INACTIVE / BLACKLISTED ({blacklisted.length}) {showBlacklist ? "▲" : "▼"}
          </button>
          {showBlacklist && blacklisted.map((c, i) => <ContractorCard key={c.id || c.name || i} c={c} />)}
        </div>
      )}

      <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(244,114,182,0.04)", border: "1px solid rgba(244,114,182,0.1)", marginTop: "12px" }}>
        <div style={{ fontSize: "10px", color: "#F472B6", letterSpacing: "1px", fontWeight: 600, marginBottom: "6px" }}>CALLRAIL NUMBERS</div>
        <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.8 }}>Hub: (305) 570-3041<br/>Junk Removal: (786) 822-8281<br/>Pressure Washing: (305) 783-3133<br/>Detailing: (305) 306-8078</div>
      </div>
      <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.1)", marginTop: "8px" }}>
        <div style={{ fontSize: "10px", color: "#60a5fa", letterSpacing: "1px", fontWeight: 600, marginBottom: "6px" }}>SPLIT STRUCTURE</div>
        <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.8 }}>
          Standard: 50/50 → 60/40 after 10 jobs + 4.5★<br/>Crew contractors: 55/45<br/>K1 Detailing: 30/70 (overflow/premium)<br/>Steve windows: 70/30<br/>Steve painting: 75/25<br/>Steve sealing: 60/40
        </div>
      </div>
      <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.1)", marginTop: "8px" }}>
        <div style={{ fontSize: "10px", color: "#FBBF24", letterSpacing: "1px", fontWeight: 600, marginBottom: "6px" }}>DEPOSIT RULE</div>
        <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.8 }}>
          Jobs under $400: 25% deposit<br/>Jobs $400+: 50% deposit<br/>Calls always free — no deposit to get a quote
        </div>
      </div>
    </div>
  );
}
