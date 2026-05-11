 import { useState, useEffect, useCallback } from "react";

// ── ICONS (inline SVG to avoid import issues) ──────────────────────────────
const Icon = ({ d, size = 18, className = "", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const icons = {
  scale:       "M12 3v1m0 16v1M3 12h1m16 0h1M5.6 5.6l.7.7m11.4-.7-.7.7M5.6 18.4l.7-.7m11.4.7-.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  upload:      "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5-5 5 5m-5-5v12",
  dashboard:   "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  file:        "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  brain:       "M9.5 2a2.5 2.5 0 0 1 0 5H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10h-2.5a2.5 2.5 0 0 1 0-5",
  zap:         "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  check:       "M20 6 9 17l-5-5",
  x:           "M18 6 6 18M6 6l12 12",
  alert:       "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  clock:       "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  chevronDown: "M6 9l6 6 6-6",
  chevronUp:   "M18 15l-6-6-6 6",
  chevronRight:"M9 18l6-6-6-6",
  search:      "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  moon:        "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun:         "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  menu:        "M3 12h18M3 6h18M3 18h18",
  edit:        "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  save:        "M19 21H5a2 2 0 0 0-2-2V5a2 2 0 0 0 2-2h11l5 5v11a2 2 0 0 0-2 2zM17 21v-8H7v8M7 3v5h8",
  user:        "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  refresh:     "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  building:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  info:        "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01",
  trend:       "M23 6l-9.5 9.5-5-5L1 18",
  calendar:    "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
};
const I = ({ name, size = 18, className = "" }) =>
  <Icon d={icons[name]} size={size} className={className} />;

// ── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_EXTRACTED = {
  case_title: "M/s Greentech Industries Pvt. Ltd. vs State of Karnataka & KSPCB",
  case_number: "WP No. 18432/2024",
  court_name: "High Court of Karnataka at Bengaluru",
  bench: "Hon'ble Mr. Justice Krishna Murthy",
  date_of_order: "2024-05-22",
  parties: { petitioner: "M/s Greentech Industries Pvt. Ltd.", respondent: "State of Karnataka & Karnataka State Pollution Control Board" },
  subject_matter: "Challenge to closure order for alleged violation of environmental consents",
  key_directions: [
    "Interim stay on closure order dated 15.02.2024 granted, subject to conditions",
    "Petitioner to make ETP fully operational within 2 weeks (by 05.06.2024)",
    "Petitioner to file affidavit on ETP status within 10 days (by 01.06.2024)",
    "KSPCB to conduct site inspection within 15 days (by 06.06.2024)",
    "State Government to file objections within 4 weeks (by 19.06.2024)",
    "Petitioner to deposit Rs. 5,00,000 as Environmental Compensation within 1 week (by 29.05.2024)",
  ],
  deadlines: [
    { description: "Deposit Rs. 5 Lakhs Environmental Compensation with KSPCB", deadline_date: "2024-05-29", responsible_party: "M/s Greentech Industries Pvt. Ltd." },
    { description: "File affidavit on current ETP status and compliance steps", deadline_date: "2024-06-01", responsible_party: "M/s Greentech Industries Pvt. Ltd." },
    { description: "Make ETP fully operational", deadline_date: "2024-06-05", responsible_party: "M/s Greentech Industries Pvt. Ltd." },
    { description: "Conduct site inspection and file inspection report", deadline_date: "2024-06-06", responsible_party: "Karnataka State Pollution Control Board" },
    { description: "File statement of objections", deadline_date: "2024-06-19", responsible_party: "State of Karnataka" },
  ],
  outcome: "Partly Allowed (Interim Stay Granted)",
  relief_granted: "Interim stay on closure order subject to compliance conditions",
  next_hearing_date: "2024-07-24",
  cited_cases: ["Vellore Citizens Welfare Forum v. Union of India (1996) 5 SCC 647", "M.C. Mehta v. Kamal Nath (1997) 1 SCC 388"],
  acts_referred: ["Water (Prevention and Control of Pollution) Act, 1974", "Air (Prevention and Control of Pollution) Act, 1981", "Environment (Protection) Act, 1986", "Constitution of India – Article 226"],
  confidence_scores: { case_title: 0.96, case_number: 0.98, court_name: 0.97, date_of_order: 0.95, parties: 0.92, key_directions: 0.88, deadlines: 0.85, outcome: 0.94 },
};

const DEMO_ACTION_PLAN = {
  summary: "Court has granted interim stay on KSPCB closure order. IMMEDIATE action required: deposit Rs. 5L by 29 May, restore ETP by 5 June, file affidavit by 1 June. Non-compliance will automatically vacate the stay and resume closure.",
  overall_priority: "urgent",
  compliance_deadline: "2024-05-29",
  actions: [
    {
      action_id: "ACT-001", title: "Deposit Environmental Compensation", action_type: "payment",
      responsible_department: "Finance & Accounts Department", priority: "urgent", deadline: "2024-05-29",
      description: "Deposit Rs. 5,00,000 (Five Lakhs) with KSPCB as Environmental Compensation as directed by the Court.",
      steps: ["Step 1: Raise internal payment approval request immediately", "Step 2: Obtain DD/RTGS in favour of 'Karnataka State Pollution Control Board'", "Step 3: Deposit at KSPCB main office, Church Street, Bengaluru", "Step 4: Obtain acknowledgment receipt", "Step 5: Preserve receipt for court affidavit"],
      reasoning: "Court has made this a mandatory condition for the interim stay. Failure to pay by 29 May will result in automatic vacation of stay and restoration of closure order.",
      consequences_of_non_compliance: "Interim stay automatically vacated; factory closure resumes; possible contempt proceedings.",
    },
    {
      action_id: "ACT-002", title: "Restore ETP to Full Operation", action_type: "compliance",
      responsible_department: "Operations & Environment Department", priority: "urgent", deadline: "2024-06-05",
      description: "Repair, service, and make the Effluent Treatment Plant (ETP) with 50 KLD capacity fully operational.",
      steps: ["Step 1: Engage ETP maintenance vendor immediately", "Step 2: Identify and fix root cause of ETP failure", "Step 3: Run ETP trial for 48 hours, collect treated effluent samples", "Step 4: Get samples tested at NABL-accredited laboratory", "Step 5: Prepare ETP operational log and lab report"],
      reasoning: "Court has specifically conditioned the stay on ETP being functional. KSPCB inspection on 6 June will verify this.",
      consequences_of_non_compliance: "Stay vacated; KSPCB closure order reinstated; potential criminal liability under Water Act.",
    },
    {
      action_id: "ACT-003", title: "File Compliance Affidavit", action_type: "filing",
      responsible_department: "Legal Department", priority: "high", deadline: "2024-06-01",
      description: "Prepare and file a detailed affidavit before the High Court explaining ETP status, steps taken, and compliance measures.",
      steps: ["Step 1: Collect ETP operational data and lab reports", "Step 2: Brief senior advocate with all technical documents", "Step 3: Draft affidavit detailing timeline of ETP restoration", "Step 4: Deponent (MD/Director) to sign before Notary", "Step 5: File through Advocate-on-Record before 01.06.2024"],
      reasoning: "Mandatory court direction. Non-filing will result in ex-parte orders against Petitioner.",
      consequences_of_non_compliance: "Ex-parte orders; court may impose costs; stay may be vacated.",
    },
    {
      action_id: "ACT-004", title: "Prepare for KSPCB Inspection", action_type: "compliance",
      responsible_department: "Environment & Safety Team", priority: "high", deadline: "2024-06-06",
      description: "Prepare all documents, site, and team for KSPCB inspection and ensure ETP is running during inspection.",
      steps: ["Step 1: Prepare inspection readiness checklist", "Step 2: Ensure all consent documents are available", "Step 3: Station environment officer at plant on inspection day", "Step 4: Ensure ETP is running and treated effluent parameters within limits", "Step 5: Provide full cooperation to KSPCB inspection team"],
      reasoning: "KSPCB will file inspection report to court. A negative report will have severe consequences for the stay.",
      consequences_of_non_compliance: "Adverse KSPCB report; stay vacated; enhanced penalty.",
    },
  ],
  risk_assessment: { level: "high", factors: ["Tight deadlines within 1-2 weeks", "Any missed deadline auto-vacates stay", "KSPCB inspection outcome uncertain", "Financial impact of Rs. 5L deposit"] },
  recommended_team: ["Senior Advocate", "ETP Maintenance Vendor", "Environment Officer", "Finance Head", "Managing Director"],
  notes: "Do NOT approach KSPCB officials informally. All communications to be through legal counsel. Ensure factory operations conform strictly to approved production capacity during stay period.",
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
const priorityStyle = (p) => ({
  urgent: { badge: "bg-red-100 text-red-700 border border-red-200", dot: "bg-red-500", bar: "bg-red-500", left: "border-l-red-500" },
  high:   { badge: "bg-orange-100 text-orange-700 border border-orange-200", dot: "bg-orange-500", bar: "bg-orange-500", left: "border-l-orange-500" },
  medium: { badge: "bg-amber-100 text-amber-700 border border-amber-200", dot: "bg-amber-400", bar: "bg-amber-400", left: "border-l-amber-400" },
  low:    { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", bar: "bg-emerald-500", left: "border-l-emerald-500" },
}[p] || { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400", bar: "bg-slate-400", left: "border-l-slate-400" });

const statusStyle = (s) => ({
  pending:  "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  edited:   "bg-blue-50 text-blue-700 border border-blue-200",
}[s] || "bg-slate-100 text-slate-600");

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function ConfidenceBar({ label, score }) {
  const pct = Math.round((score || 0) * 100);
  const color = pct >= 85 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500 w-24 flex-shrink-0 capitalize">{label.replace(/_/g, " ")}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`w-7 text-right font-medium ${pct >= 85 ? "text-emerald-600" : pct >= 70 ? "text-amber-600" : "text-red-500"}`}>{pct}%</span>
    </div>
  );
}

function ActionCard({ action, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const ps = priorityStyle(action.priority);
  return (
    <div className={`border-l-4 ${ps.left} bg-white rounded-r-xl border border-slate-200 overflow-hidden shadow-sm`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="font-mono text-xs text-slate-400 flex-shrink-0">{action.action_id}</span>
          <span className="font-semibold text-slate-800 text-sm truncate">{action.title}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${ps.badge}`}>{action.priority}</span>
        </div>
        <div className="flex items-center gap-3 ml-2 flex-shrink-0">
          <span className="text-xs text-slate-400 hidden sm:block">📅 {action.deadline}</span>
          <I name={open ? "chevronUp" : "chevronDown"} size={15} className="text-slate-400" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 rounded-lg p-3">
            <div><p className="text-slate-400 mb-0.5">Department</p><p className="font-semibold text-slate-700">{action.responsible_department}</p></div>
            <div><p className="text-slate-400 mb-0.5">Deadline</p><p className="font-semibold text-slate-700">{action.deadline}</p></div>
            <div><p className="text-slate-400 mb-0.5">Type</p><p className="font-semibold text-slate-700 capitalize">{action.action_type}</p></div>
          </div>
          <p className="text-sm text-slate-700">{action.description}</p>
          {action.steps?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Steps to execute</p>
              <ol className="space-y-1.5">
                {action.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-600">
                    <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                    {s.replace(/^Step \d+: /, "")}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">💡 Why this action?</p>
            <p className="text-xs text-amber-800">{action.reasoning}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3">
            <p className="text-xs font-bold text-red-700 mb-1">⚠️ If not done:</p>
            <p className="text-xs text-red-700">{action.consequences_of_non_compliance}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGE: DASHBOARD ──────────────────────────────────────────────────────────
function Dashboard({ judgments, navigateTo }) {
  const [search, setSearch] = useState("");
  const total = judgments.length;
  const pending = judgments.filter(j => j.status === "pending").length;
  const approved = judgments.filter(j => j.status === "approved" || j.status === "edited").length;
  const urgent = judgments.filter(j => j.priority === "urgent").length;

  const filtered = judgments.filter(j =>
    !search ||
    j.case_title?.toLowerCase().includes(search.toLowerCase()) ||
    j.case_number?.toLowerCase().includes(search.toLowerCase()) ||
    j.court_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Cases", value: total, icon: "file", color: "text-slate-700", bg: "bg-slate-100" },
          { label: "Pending Review", value: pending, icon: "clock", color: "text-amber-700", bg: "bg-amber-100" },
          { label: "Approved", value: approved, icon: "check", color: "text-emerald-700", bg: "bg-emerald-100" },
          { label: "Urgent", value: urgent, icon: "alert", color: "text-red-700", bg: "bg-red-100" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
              <I name={s.icon} size={17} className={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <I name="search" size={15} className="text-slate-400" />
            <input placeholder="Search cases, case numbers, courts..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder-slate-400" />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <I name="scale" size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No judgments yet.</p>
            <button onClick={() => navigateTo("upload")} className="mt-3 text-sm text-amber-600 hover:underline font-medium">
              Upload your first judgment →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  {["Case", "Court", "Date", "Priority", "Status", "Confidence", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800 max-w-xs truncate">{j.case_title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{j.case_number}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs max-w-[140px] truncate">{j.court_name}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{j.date_of_order || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${priorityStyle(j.priority).badge}`}>
                        {j.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(j.status)}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((j.confidence || 0) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{Math.round((j.confidence || 0) * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigateTo("analysis", j.id)} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors">View</button>
                        {j.status === "pending" && (
                          <button onClick={() => navigateTo("verify", j.id)} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 font-medium transition-colors">Verify</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PAGE: UPLOAD ─────────────────────────────────────────────────────────────
function UploadPage({ onUpload }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(0); // 0 idle, 1-3 processing, 4 done
  const [error, setError] = useState(null);

  const processFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) { setError("Only PDF files supported."); return; }
    if (f.size > 50 * 1024 * 1024) { setError("Max file size is 50MB."); return; }
    setFile(f); setError(null);
  };

  const run = async () => {
    setStep(1);
    await new Promise(r => setTimeout(r, 1200)); // Upload
    setStep(2);
    await new Promise(r => setTimeout(r, 2000)); // Extract
    setStep(3);
    await new Promise(r => setTimeout(r, 1500)); // Plan
    setStep(4);
    onUpload({
      id: Date.now(),
      file_name: file.name,
      case_title: DEMO_EXTRACTED.case_title,
      case_number: DEMO_EXTRACTED.case_number,
      court_name: DEMO_EXTRACTED.court_name,
      date_of_order: DEMO_EXTRACTED.date_of_order,
      status: "pending",
      priority: DEMO_ACTION_PLAN.overall_priority,
      confidence: 0.93,
      extracted_data: DEMO_EXTRACTED,
      action_plan: DEMO_ACTION_PLAN,
    });
  };

  const stepLabels = ["Upload PDF", "Extract Data", "Generate Plan", "Complete"];
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Upload Court Judgment</h2>
        <p className="text-slate-400 mt-1 text-sm">Drop a PDF to automatically extract case details and generate an action plan</p>
      </div>

      {/* Progress steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                  ${step > i ? "bg-emerald-500 text-white" : step === i && step > 0 ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > i ? <I name="check" size={14} /> : i + 1}
                </div>
                <p className={`text-xs mt-1 font-medium hidden sm:block ${step >= i ? "text-slate-700" : "text-slate-400"}`}>{label}</p>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step > i ? "bg-emerald-400" : "bg-slate-100"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      {step === 0 && (
        <div onDrop={e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); }}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onClick={() => document.getElementById("pdf-input").click()}
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-200
            ${drag ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-amber-300 hover:bg-slate-50"}`}>
          <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={e => processFile(e.target.files[0])} />
          {file ? (
            <div className="space-y-2">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto">
                <I name="file" size={28} className="text-amber-600" />
              </div>
              <p className="font-bold text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                <I name="upload" size={28} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-700">Drop PDF here or click to browse</p>
              <p className="text-xs text-slate-400">Supports digital & scanned PDFs • Max 50MB</p>
            </div>
          )}
        </div>
      )}

      {/* Processing */}
      {step > 0 && step < 4 && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-800 text-lg">
            {["", "Uploading PDF...", "AI extracting case data...", "Generating action plan..."][step]}
          </p>
          <p className="text-slate-400 text-sm mt-2">
            {step === 2 && "Analyzing parties, directions, deadlines..."}
            {step === 3 && "Building compliance action items..."}
          </p>
        </div>
      )}

      {/* Success */}
      {step === 4 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <I name="check" size={28} className="text-emerald-600" />
          </div>
          <p className="font-black text-slate-800 text-xl">Analysis Complete!</p>
          <p className="text-slate-500 text-sm">Data extracted with 93% confidence. Review and verify below.</p>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={() => { setFile(null); setStep(0); }} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm hover:bg-slate-50 font-medium">Upload Another</button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <I name="alert" size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {step === 0 && file && !error && (
        <button onClick={run} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-200">
          <I name="zap" size={18} /> Analyze Judgment with AI
        </button>
      )}

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
        <p className="font-semibold text-slate-500">📋 What happens:</p>
        <p>• PDF text extracted via PyMuPDF + pdfplumber (OCR fallback for scanned docs)</p>
        <p>• AI extracts case number, parties, directions, deadlines, court name</p>
        <p>• Action plan generated with priority levels and responsible departments</p>
        <p>• You review, edit if needed, approve — only then saved permanently</p>
      </div>
    </div>
  );
}

// ── PAGE: ANALYSIS ───────────────────────────────────────────────────────────
function AnalysisPage({ judgment, navigateTo }) {
  const [tab, setTab] = useState("extraction");
  if (!judgment) return <div className="p-6 text-slate-400">No judgment selected. Upload one first.</div>;
  const ext = judgment.extracted_data || {};
  const plan = judgment.action_plan || {};

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-slate-800">{ext.case_title || judgment.file_name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{ext.case_number} • {ext.court_name} • {ext.date_of_order}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyle(judgment.status)}`}>{judgment.status}</span>
          {judgment.status === "pending" && (
            <button onClick={() => navigateTo("verify")} className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors">
              Verify <I name="chevronRight" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
        <I name="info" size={15} className="flex-shrink-0 mt-0.5" />
        <span><strong>Demo Mode:</strong> Showing realistic sample data. In production, connect a FastAPI backend with your OpenAI API key for real extraction.</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {[["extraction","📄 Extracted Data"],["actionplan","⚡ Action Plan"],["rawtext","📝 Raw Text"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all
              ${tab === id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* EXTRACTION TAB */}
      {tab === "extraction" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {/* Case Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><I name="file" size={17} className="text-amber-500" /> Case Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {[["Case Title", ext.case_title],["Case Number", ext.case_number],["Court", ext.court_name],["Bench", ext.bench],["Date of Order", ext.date_of_order],["Outcome", ext.outcome],["Next Hearing", ext.next_hearing_date],["Subject", ext.subject_matter]].map(([l,v]) => v && (
                  <div key={l}><p className="text-xs text-slate-400">{l}</p><p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p></div>
                ))}
              </div>
            </div>
            {/* Parties */}
            {ext.parties && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><I name="user" size={17} className="text-blue-500" /> Parties</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3"><p className="text-xs text-blue-500 font-bold mb-1">PETITIONER</p><p className="text-sm text-slate-800 font-medium">{ext.parties.petitioner}</p></div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3"><p className="text-xs text-slate-400 font-bold mb-1">RESPONDENT</p><p className="text-sm text-slate-800 font-medium">{ext.parties.respondent}</p></div>
                </div>
              </div>
            )}
            {/* Key Directions */}
            {ext.key_directions?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><I name="check" size={17} className="text-emerald-500" /> Key Directions</h3>
                <ul className="space-y-2">
                  {ext.key_directions.map((d, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Deadlines */}
            {ext.deadlines?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><I name="calendar" size={17} className="text-red-500" /> Deadlines</h3>
                <div className="space-y-2">
                  {ext.deadlines.map((d, i) => (
                    <div key={i} className="flex gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
                      <I name="alert" size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div><p className="text-sm font-semibold text-slate-800">{d.description}</p><p className="text-xs text-slate-400 mt-0.5">📅 {d.deadline_date} · 👤 {d.responsible_party}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Confidence + metadata */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><I name="brain" size={17} className="text-purple-500" /> AI Confidence</h3>
              <div className="space-y-3">
                {Object.entries(ext.confidence_scores || {}).map(([k, v]) => <ConfidenceBar key={k} label={k} score={v} />)}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-sm">
                <span className="text-slate-400">Overall</span>
                <span className="font-black text-slate-800">{Math.round(judgment.confidence * 100)}%</span>
              </div>
            </div>
            {ext.acts_referred?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Acts Referred</p>
                <ul className="space-y-1">{ext.acts_referred.map((a,i) => <li key={i} className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1">{a}</li>)}</ul>
              </div>
            )}
            {ext.cited_cases?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Cited Cases</p>
                <ul className="space-y-1">{ext.cited_cases.map((c,i) => <li key={i} className="text-xs text-slate-500 italic">{c}</li>)}</ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTION PLAN TAB */}
      {tab === "actionplan" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><I name="zap" size={17} className="text-amber-500" /> Executive Summary</h3>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${priorityStyle(plan.overall_priority).badge}`}>{plan.overall_priority} priority</span>
                {plan.compliance_deadline && <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">📅 {plan.compliance_deadline}</span>}
              </div>
            </div>
            <p className="text-sm text-slate-700">{plan.summary}</p>
            {plan.recommended_team?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {plan.recommended_team.map((t,i) => <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
            )}
          </div>
          {plan.risk_assessment && (
            <div className={`rounded-xl border p-4 ${plan.risk_assessment.level === "high" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <p className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <I name="alert" size={15} className="text-red-500" /> Risk: <span className="uppercase">{plan.risk_assessment.level}</span>
              </p>
              <ul className="mt-1 space-y-0.5">{plan.risk_assessment.factors?.map((f,i) => <li key={i} className="text-xs text-slate-600">• {f}</li>)}</ul>
            </div>
          )}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800">Action Items ({plan.actions?.length || 0})</h3>
            {(plan.actions || []).map((a, i) => <ActionCard key={a.action_id} action={a} defaultOpen={i === 0} />)}
          </div>
          {plan.notes && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 mb-1">📝 Legal Notes</p>
              <p className="text-sm text-slate-600">{plan.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* RAW TEXT TAB */}
      {tab === "rawtext" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <p className="font-semibold text-slate-700 text-sm">Extracted Text from PDF</p>
            <p className="text-xs text-slate-400">{judgment.file_name} · {judgment.page_count || 8} pages</p>
          </div>
          <pre className="p-5 text-xs text-slate-600 font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
{`IN THE HIGH COURT OF KARNATAKA AT BENGALURU

WRIT PETITION No. 18432 OF 2024

BETWEEN:
M/s Greentech Industries Pvt. Ltd.                    ... PETITIONER

AND
1. The State of Karnataka
2. The Karnataka State Pollution Control Board         ... RESPONDENTS

ORDER DATED: 22nd May, 2024
HON'BLE MR. JUSTICE KRISHNA MURTHY

1. This petition challenges the closure order issued by KSPCB dated 15.02.2024...

DIRECTIONS:
1. Interim STAY on closure order granted subject to conditions.
2. Petitioner to make ETP operational by 05.06.2024.
3. Petitioner to file compliance affidavit by 01.06.2024.
4. KSPCB to conduct inspection and file report by 06.06.2024.
5. Petitioner to deposit Rs. 5,00,000 by 29.05.2024.

Next Hearing: 24.07.2024
[Full text continues for 8 pages...]`}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── PAGE: VERIFY ─────────────────────────────────────────────────────────────
function VerifyPage({ judgment, onVerify, navigateTo }) {
  const [editMode, setEditMode] = useState(false);
  const [edited, setEdited] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState("Legal Officer");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (judgment) setEdited(JSON.parse(JSON.stringify(judgment.extracted_data || {})));
  }, [judgment]);

  if (!judgment) return <div className="p-6 text-slate-400">No judgment selected.</div>;
  if (done) return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-4 pt-20">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${done === "approved" ? "bg-emerald-100" : done === "rejected" ? "bg-red-100" : "bg-blue-100"}`}>
        <I name={done === "rejected" ? "x" : "check"} size={36} className={done === "approved" ? "text-emerald-600" : done === "rejected" ? "text-red-600" : "text-blue-600"} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 capitalize">Judgment {done}!</h2>
      <p className="text-slate-400">{done === "approved" ? "Data saved to dashboard." : done === "edited" ? "Edited data saved." : "Judgment rejected."}</p>
      <button onClick={() => navigateTo("dashboard")} className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors">Go to Dashboard</button>
    </div>
  );

  const ext = edited || {};
  const upd = (k, v) => setEdited(p => ({ ...p, [k]: v }));
  const updParty = (k, v) => setEdited(p => ({ ...p, parties: { ...p.parties, [k]: v } }));

  const handleVerify = (action) => {
    onVerify(judgment.id, action, action === "edit" ? edited : null, verifiedBy, notes);
    setDone(action);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-slate-800">Human Verification Panel</h2>
          <p className="text-slate-400 text-sm mt-0.5">Review AI-extracted data before approving</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyle(judgment.status)}`}>{judgment.status}</span>
      </div>

      <div className="flex gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700">
        <I name="alert" size={15} className="flex-shrink-0 mt-0.5" />
        <span>Review all AI-extracted fields carefully. You can edit any field before approving. Only approved judgments appear in the active dashboard.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Editable fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Extracted Data</h3>
              <button onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                  ${editMode ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                <I name="edit" size={13} /> {editMode ? "Editing..." : "Edit"}
              </button>
            </div>
            <div className="p-5">
              {editMode ? (
                <div className="grid grid-cols-2 gap-4">
                  {[["Case Title","case_title"],["Case Number","case_number"],["Court Name","court_name"],["Bench / Judge","bench"],["Date of Order","date_of_order"],["Outcome","outcome"],["Next Hearing","next_hearing_date"]].map(([label, key]) => (
                    <div key={key}>
                      <label className="text-xs text-slate-400 block mb-1">{label}</label>
                      <input value={ext[key] || ""} onChange={e => upd(key, e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-slate-800" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Petitioner</label>
                    <input value={ext.parties?.petitioner || ""} onChange={e => updParty("petitioner", e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-slate-800" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Respondent</label>
                    <input value={ext.parties?.respondent || ""} onChange={e => updParty("respondent", e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-slate-800" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[["Case Title",ext.case_title],["Case Number",ext.case_number],["Court",ext.court_name],["Bench",ext.bench],["Date of Order",ext.date_of_order],["Outcome",ext.outcome],["Next Hearing",ext.next_hearing_date],["Petitioner",ext.parties?.petitioner],["Respondent",ext.parties?.respondent]].map(([l,v]) => v && (
                    <div key={l}><p className="text-xs text-slate-400">{l}</p><p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Directions */}
          {ext.key_directions?.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="font-bold text-slate-800 mb-3">Key Directions</p>
              <ul className="space-y-2">
                {ext.key_directions.map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-amber-500 font-black flex-shrink-0">→</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deadlines */}
          {ext.deadlines?.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="font-bold text-slate-800 mb-3">Deadlines</p>
              <div className="space-y-2">
                {ext.deadlines.map((d, i) => (
                  <div key={i} className="flex gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
                    <I name="alert" size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-semibold text-slate-800">{d.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">📅 {d.deadline_date} · 👤 {d.responsible_party}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Verifier */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><I name="user" size={15} className="text-blue-500" /> Verification Details</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Verified By</label>
              <input value={verifiedBy} onChange={e => setVerifiedBy(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-slate-800" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add notes..."
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-slate-800 resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="font-bold text-slate-800">Take Action</h3>
            <button onClick={() => handleVerify("approved")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
              <I name="check" size={16} /> Approve as-is
            </button>
            {editMode && (
              <button onClick={() => handleVerify("edited")}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors">
                <I name="save" size={16} /> Save Edited Version
              </button>
            )}
            <button onClick={() => handleVerify("rejected")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
              <I name="x" size={16} /> Reject
            </button>
            <p className="text-xs text-slate-400 text-center">Only approved judgments appear in active dashboard</p>
          </div>

          {/* Confidence */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">AI Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round(judgment.confidence * 100)}%` }} />
              </div>
              <span className="text-xl font-black text-slate-800">{Math.round(judgment.confidence * 100)}%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {judgment.confidence >= 0.85 ? "✅ High confidence — safe to approve" : "⚠️ Review carefully before approving"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [judgments, setJudgments] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const activeJudgment = judgments.find(j => j.id === activeId) || null;

  const navigateTo = (p, id = null) => {
    setPage(p);
    if (id) setActiveId(id);
  };

  const onUpload = (j) => {
    setJudgments(prev => [j, ...prev]);
    setActiveId(j.id);
    setPage("analysis");
  };

  const onVerify = (id, action, editedData, verifiedBy, notes) => {
    setJudgments(prev => prev.map(j => j.id === id ? {
      ...j,
      status: action,
      verified_by: verifiedBy,
      notes,
      extracted_data: editedData || j.extracted_data
    } : j));
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "upload", label: "Upload Judgment", icon: "upload" },
    { id: "analysis", label: "Analysis", icon: "brain", disabled: !activeJudgment },
    { id: "verify", label: "Verify & Approve", icon: "scale", disabled: !activeJudgment },
  ];

  return (
    <div className={`min-h-screen flex ${dark ? "dark" : ""} font-sans`} style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        body { margin: 0; background: #f8fafc; }
      `}</style>

      {/* Sidebar */}
      <aside className={`${sidebar ? "w-60" : "w-14"} transition-all duration-300 bg-[#0f172a] flex flex-col flex-shrink-0 min-h-screen`}>
        {/* Logo */}
        <div className={`flex items-center ${sidebar ? "gap-3 px-4" : "justify-center px-2"} py-4 border-b border-slate-700`}>
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <I name="scale" size={19} className="text-white" />
          </div>
          {sidebar && <div><p className="text-white font-black text-sm leading-tight tracking-tight">CCMS AI</p><p className="text-slate-400 text-xs">Judgment Analyzer</p></div>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => !item.disabled && navigateTo(item.id)} disabled={item.disabled}
                title={!sidebar ? item.label : undefined}
                className={`w-full flex items-center ${sidebar ? "gap-3 px-3" : "justify-center px-0"} py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                  ${active ? "bg-amber-500 text-white shadow-lg" : item.disabled ? "text-slate-700 cursor-not-allowed" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                <I name={item.icon} size={17} className="flex-shrink-0" />
                {sidebar && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-slate-700 space-y-0.5">
          <button onClick={() => setDark(!dark)} className={`w-full flex items-center ${sidebar ? "gap-3 px-3" : "justify-center"} py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium`}>
            <I name={dark ? "sun" : "moon"} size={16} />
            {sidebar && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button onClick={() => setSidebar(!sidebar)} className={`w-full flex items-center ${sidebar ? "gap-3 px-3" : "justify-center"} py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium`}>
            <I name={sidebar ? "x" : "menu"} size={16} />
            {sidebar && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-slate-50">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-base font-black text-slate-800">{navItems.find(n => n.id === page)?.label || "Dashboard"}</h1>
            <p className="text-xs text-slate-400">Court Case Management System · AI Extension</p>
          </div>
          {activeJudgment && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs text-amber-700 font-semibold">{activeJudgment.case_number} Active</span>
            </div>
          )}
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto">
          {page === "dashboard" && <Dashboard judgments={judgments} navigateTo={navigateTo} />}
          {page === "upload" && <UploadPage onUpload={onUpload} />}
          {page === "analysis" && <AnalysisPage judgment={activeJudgment} navigateTo={navigateTo} />}
          {page === "verify" && <VerifyPage judgment={activeJudgment} onVerify={onVerify} navigateTo={navigateTo} />}
        </main>
      </div>
    </div>
  );
}
