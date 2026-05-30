import { useState } from "react";
import type { SiteContent } from "@/lib/site";

type Section =
  | "account" | "team" | "platform" | "courses"
  | "consulting" | "payments" | "email" | "seo"
  | "security" | "audit";

const NAV: { id: Section; label: string; icon: string; group: string }[] = [
  { id: "account",    label: "Account",         icon: "fa-user",              group: "Personal" },
  { id: "team",       label: "Team",            icon: "fa-users",             group: "Personal" },
  { id: "platform",   label: "Platform",        icon: "fa-building",          group: "Site" },
  { id: "courses",    label: "Courses",         icon: "fa-graduation-cap",    group: "Content" },
  { id: "consulting", label: "Consulting",      icon: "fa-handshake",         group: "Content" },
  { id: "payments",   label: "Payments",        icon: "fa-credit-card",       group: "Business" },
  { id: "email",      label: "Email",           icon: "fa-envelope",          group: "Business" },
  { id: "seo",        label: "SEO & Analytics", icon: "fa-chart-line",        group: "Growth" },
  { id: "security",   label: "Security",        icon: "fa-shield-halved",     group: "Admin" },
  { id: "audit",      label: "Audit Log",       icon: "fa-clock-rotate-left", group: "Admin" },
];

/* ── Tiny helpers ────────────────────────────────────────────────────────── */

function Card({ title, desc, icon, danger = false, children }: {
  title: string; desc?: string; icon?: string; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <section className={"admin-card st-card" + (danger ? " admin-danger" : "")}>
      <header className="admin-card-header">
        {icon && <i className={`fa-solid ${icon} st-card-icon`} />}
        <div>
          <h3>{title}</h3>
          {desc && <p className="muted">{desc}</p>}
        </div>
      </header>
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="st-row">
      <div className="st-row-label">
        <span>{label}</span>
        {desc && <span className="st-row-desc">{desc}</span>}
      </div>
      <div className="st-row-control">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={"st-toggle" + (checked ? " on" : "")}
      onClick={() => onChange(!checked)}
    >
      <span className="st-toggle-thumb" />
    </button>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {hint && <span className="admin-field-hint">{hint}</span>}
    </label>
  );
}

function Select({ label, value, onChange, options, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; hint?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <span className="admin-field-hint">{hint}</span>}
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4, hint }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
      {hint && <span className="admin-field-hint">{hint}</span>}
    </label>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false);
  const handle = () => { onSave(); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="st-save-bar">
      <button className="btn btn-primary btn-sm" onClick={handle}>
        {saved ? <><i className="fa-solid fa-check" /> Saved</> : "Save changes"}
      </button>
    </div>
  );
}

/* ── Section: Account ────────────────────────────────────────────────────── */

function AccountSection() {
  const [name, setName] = useState("WirfonCloud Admin");
  const [email, setEmail] = useState("admin@wirfon.com");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twofa, setTwofa] = useState(false);
  const sessions = [
    { device: "Chrome on Windows", location: "Douala, CM", last: "Just now",    current: true  },
    { device: "Firefox on macOS",  location: "Paris, FR",  last: "3 hours ago", current: false },
    { device: "Safari on iPhone",  location: "Douala, CM", last: "Yesterday",   current: false },
  ];
  const [activeSessions, setActiveSessions] = useState(sessions);

  return (
    <div className="st-sections">
      <Card title="Profile" desc="Your admin name and login email." icon="fa-id-card">
        <div className="admin-grid-2">
          <Field label="Display name" value={name} onChange={setName} />
          <Field label="Email address" type="email" value={email} onChange={setEmail} />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Change password" icon="fa-lock">
        <div className="admin-grid-2">
          <Field label="Current password" type="password" value={oldPw} onChange={setOldPw} placeholder="••••••••" />
          <span />
          <Field label="New password" type="password" value={newPw} onChange={setNewPw} placeholder="Min. 8 characters" />
          <Field label="Confirm new password" type="password" value={confirmPw} onChange={setConfirmPw} placeholder="Repeat new password" />
        </div>
        <SaveBar onSave={() => { setOldPw(""); setNewPw(""); setConfirmPw(""); }} />
      </Card>

      <Card title="Two-factor authentication" desc="Add an extra layer of security to your account." icon="fa-mobile-screen-button">
        <Row label="Enable 2FA" desc="Require a code from your authenticator app on every login.">
          <Toggle checked={twofa} onChange={setTwofa} />
        </Row>
        {twofa && (
          <div className="st-info-box" style={{ marginTop: "1rem" }}>
            <i className="fa-solid fa-circle-info" />
            <span>Open your authenticator app (Google Authenticator, Authy) and scan the QR code — integration coming soon.</span>
          </div>
        )}
      </Card>

      <Card title="Active sessions" desc="All devices currently signed in to your account." icon="fa-display">
        <table className="st-table">
          <thead>
            <tr><th>Device</th><th>Location</th><th>Last active</th><th /></tr>
          </thead>
          <tbody>
            {activeSessions.map((s, i) => (
              <tr key={i}>
                <td>
                  {s.device}
                  {s.current && <span className="st-badge green" style={{ marginLeft: "0.4rem" }}>current</span>}
                </td>
                <td>{s.location}</td>
                <td>{s.last}</td>
                <td>
                  {!s.current && (
                    <button className="btn btn-outline btn-xs"
                      onClick={() => setActiveSessions((ss) => ss.filter((_, j) => j !== i))}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Section: Team ───────────────────────────────────────────────────────── */

function TeamSection() {
  const [members, setMembers] = useState([
    { name: "WirfonCloud Admin", email: "admin@wirfon.com",    role: "super_admin", status: "active" },
    { name: "Content Editor",    email: "editor@wirfon.com",   role: "editor",      status: "active" },
    { name: "Support Agent",     email: "support@wirfon.com",  role: "support",     status: "inactive" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const roleLabels: Record<string, string> = { super_admin: "Super Admin", editor: "Editor", support: "Support" };

  return (
    <div className="st-sections">
      <Card title="Team members" desc="People who have access to this admin panel." icon="fa-users">
        <table className="st-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>
                  <select
                    className="st-inline-select"
                    value={m.role}
                    onChange={(e) => setMembers((ms) => ms.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                    disabled={m.role === "super_admin"}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="editor">Editor</option>
                    <option value="support">Support</option>
                  </select>
                </td>
                <td>
                  <span className={"st-badge " + (m.status === "active" ? "green" : "grey")}>
                    {m.status}
                  </span>
                </td>
                <td>
                  {m.role !== "super_admin" && (
                    <button className="btn btn-outline btn-xs danger"
                      onClick={() => setMembers((ms) => ms.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Invite team member" icon="fa-paper-plane">
        <div className="admin-grid-2">
          <Field label="Email address" type="email" value={inviteEmail} onChange={setInviteEmail} placeholder="colleague@example.com" />
          <Select label="Role" value={inviteRole} onChange={setInviteRole} options={[
            { value: "editor",  label: "Editor — can edit content" },
            { value: "support", label: "Support — read-only access" },
          ]} />
        </div>
        <div className="st-save-bar">
          <button className="btn btn-primary btn-sm" onClick={() => {
            if (!inviteEmail) return;
            setMembers((ms) => [...ms, { name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, status: "active" }]);
            setInviteEmail("");
          }}>
            <i className="fa-solid fa-paper-plane" /> Send invite
          </button>
        </div>
      </Card>

      <Card title="Role permissions" desc="What each role can do." icon="fa-key">
        <table className="st-table">
          <thead><tr><th>Permission</th><th>Super Admin</th><th>Editor</th><th>Support</th></tr></thead>
          <tbody>
            {[
              ["Edit site content",   true,  true,  false],
              ["Publish changes",     true,  true,  false],
              ["Manage team",         true,  false, false],
              ["View audit logs",     true,  true,  true ],
              ["Change settings",     true,  false, false],
            ].map(([perm, sa, ed, su], i) => (
              <tr key={i}>
                <td>{perm as string}</td>
                {[sa, ed, su].map((v, j) => (
                  <td key={j} style={{ textAlign: "center" }}>
                    <i className={`fa-solid ${v ? "fa-check st-perm-yes" : "fa-xmark st-perm-no"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Section: Platform ───────────────────────────────────────────────────── */

function PlatformSection({ data, onChange }: { data: SiteContent; onChange: (n: SiteContent) => void }) {
  const [siteName, setSiteName] = useState("WirfonCloud");
  const [tagline, setTagline] = useState("Let's rule the clouds");
  const [phone, setPhone] = useState("+237 000 000 000");
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="st-sections">
      <Card title="Site identity" icon="fa-building">
        <div className="admin-grid-2">
          <Field label="Site name" value={siteName} onChange={setSiteName} />
          <Field label="Tagline" value={tagline} onChange={setTagline} />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Branding" desc="Logo shown across the site." icon="fa-palette">
        <Field label="Logo URL" value={data.branding.logoUrl}
          onChange={(v) => onChange({ ...data, branding: { ...data.branding, logoUrl: v } })}
          hint="Paste a URL or upload via the Branding tab."
        />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Contact" icon="fa-address-card">
        <div className="admin-grid-2">
          <Field label="Contact email" type="email" value={data.contact.email}
            onChange={(v) => onChange({ ...data, contact: { ...data.contact, email: v } })} />
          <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+237 000 000 000" />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Social links" desc="Appear in the footer and across the site." icon="fa-share-nodes">
        <div className="admin-grid-2">
          <Field label="LinkedIn" value={data.social.linkedin} onChange={(v) => onChange({ ...data, social: { ...data.social, linkedin: v } })} placeholder="https://linkedin.com/company/…" />
          <Field label="Twitter / X" value={data.social.twitter} onChange={(v) => onChange({ ...data, social: { ...data.social, twitter: v } })} placeholder="https://x.com/…" />
          <Field label="Facebook" value={data.social.facebook} onChange={(v) => onChange({ ...data, social: { ...data.social, facebook: v } })} placeholder="https://facebook.com/…" />
          <Field label="YouTube" value={data.social.youtube} onChange={(v) => onChange({ ...data, social: { ...data.social, youtube: v } })} placeholder="https://youtube.com/…" />
          <Field label="WhatsApp" value={data.social.whatsapp} onChange={(v) => onChange({ ...data, social: { ...data.social, whatsapp: v } })} placeholder="https://wa.me/…" />
          <Field label="Discord" value={data.social.discord ?? ""} onChange={(v) => onChange({ ...data, social: { ...data.social, discord: v || undefined } })} placeholder="https://discord.gg/…" />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Maintenance mode" desc="Temporarily hide the site from visitors." icon="fa-triangle-exclamation" danger={maintenance}>
        <Row label="Enable maintenance mode" desc="Visitors will see a 'Coming soon' message. Admins can still log in.">
          <Toggle checked={maintenance} onChange={setMaintenance} />
        </Row>
        {maintenance && (
          <div className="st-info-box danger" style={{ marginTop: "1rem" }}>
            <i className="fa-solid fa-triangle-exclamation" />
            <span>Site is currently in maintenance mode. Visitors cannot access it.</span>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── Section: Courses ────────────────────────────────────────────────────── */

function CoursesSection() {
  const [defaultVisibility, setDefaultVisibility] = useState("draft");
  const [issuerName, setIssuerName] = useState("WirfonCloud");
  const [certExpiry, setCertExpiry] = useState("24");
  const [videoPlatform, setVideoPlatform] = useState("youtube");
  const [apiKey, setApiKey] = useState("");

  return (
    <div className="st-sections">
      <Card title="Default course settings" icon="fa-sliders">
        <Row label="New course default visibility" desc="Set whether new courses start as draft or immediately published.">
          <div className="st-radio-group">
            {["draft", "published"].map((v) => (
              <label key={v} className="st-radio">
                <input type="radio" name="visibility" value={v} checked={defaultVisibility === v} onChange={() => setDefaultVisibility(v)} />
                <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </label>
            ))}
          </div>
        </Row>
      </Card>

      <Card title="Certificate settings" desc="Configure certificates issued to students." icon="fa-certificate">
        <div className="admin-grid-2">
          <Field label="Issuing organisation" value={issuerName} onChange={setIssuerName} />
          <Field label="Certificate validity (months)" type="number" value={certExpiry} onChange={setCertExpiry} hint="Set to 0 for no expiry." />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Video hosting" desc="Connect your video hosting provider for course content." icon="fa-video">
        <Select label="Video platform" value={videoPlatform} onChange={setVideoPlatform} options={[
          { value: "youtube", label: "YouTube (public/unlisted)" },
          { value: "vimeo",   label: "Vimeo" },
          { value: "bunny",   label: "Bunny.net Stream" },
          { value: "custom",  label: "Custom CDN" },
        ]} />
        {videoPlatform !== "youtube" && (
          <Field label={`${videoPlatform === "vimeo" ? "Vimeo" : "Bunny.net"} API key`} type="password"
            value={apiKey} onChange={setApiKey} placeholder="Paste your API key here"
            hint="Stored encrypted. Never shared." />
        )}
        <SaveBar onSave={() => {}} />
      </Card>
    </div>
  );
}

/* ── Section: Consulting ─────────────────────────────────────────────────── */

function ConsultingSection() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [meetPlatform, setMeetPlatform] = useState("zoom");
  const [meetLink, setMeetLink] = useState("");
  const [bookFrom, setBookFrom] = useState("09:00");
  const [bookTo, setBookTo] = useState("17:00");

  return (
    <div className="st-sections">
      <Card title="Booking availability" desc="Hours during which clients can book consulting sessions." icon="fa-clock">
        <div className="admin-grid-2">
          <Field label="Available from" type="time" value={bookFrom} onChange={setBookFrom} />
          <Field label="Available to" type="time" value={bookTo} onChange={setBookTo} />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Booking confirmation" icon="fa-calendar-check">
        <Row label="Auto-confirmation" desc="Automatically confirm bookings. Disable to review each request manually.">
          <Toggle checked={autoApprove} onChange={setAutoApprove} />
        </Row>
        {!autoApprove && (
          <div className="st-info-box" style={{ marginTop: "1rem" }}>
            <i className="fa-solid fa-circle-info" />
            <span>You will receive an email for each new booking request and can approve or decline from the admin panel.</span>
          </div>
        )}
      </Card>

      <Card title="Meeting link" desc="Where confirmed bookings take place." icon="fa-video">
        <Select label="Meeting platform" value={meetPlatform} onChange={setMeetPlatform} options={[
          { value: "zoom",   label: "Zoom" },
          { value: "meet",   label: "Google Meet" },
          { value: "teams",  label: "Microsoft Teams" },
          { value: "custom", label: "Custom link" },
        ]} />
        <Field label="Meeting URL" value={meetLink} onChange={setMeetLink}
          placeholder={`https://${meetPlatform === "zoom" ? "zoom.us/j/…" : meetPlatform === "meet" ? "meet.google.com/…" : "teams.microsoft.com/…"}`} />
        <SaveBar onSave={() => {}} />
      </Card>
    </div>
  );
}

/* ── Section: Payments ───────────────────────────────────────────────────── */

function PaymentsSection() {
  const [currency, setCurrency] = useState("XAF");
  const [invoicePrefix, setInvoicePrefix] = useState("WFC-");
  const [invoiceFooter, setInvoiceFooter] = useState("Thank you for choosing WirfonCloud. Payment terms: 30 days.");
  const [refundDays, setRefundDays] = useState("14");

  return (
    <div className="st-sections">
      <Card title="Currency" icon="fa-coins">
        <Select label="Display currency" value={currency} onChange={setCurrency} options={[
          { value: "XAF", label: "XAF — CFA Franc BEAC" },
          { value: "USD", label: "USD — US Dollar" },
          { value: "EUR", label: "EUR — Euro" },
          { value: "GBP", label: "GBP — British Pound" },
          { value: "NGN", label: "NGN — Nigerian Naira" },
        ]} />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Invoice settings" icon="fa-file-invoice">
        <div className="admin-grid-2">
          <Field label="Invoice number prefix" value={invoicePrefix} onChange={setInvoicePrefix} hint='e.g. "WFC-" → WFC-0001' />
          <Field label="Refund window (days)" type="number" value={refundDays} onChange={setRefundDays} hint="Set to 0 to disable refunds." />
        </div>
        <Textarea label="Invoice footer text" value={invoiceFooter} onChange={setInvoiceFooter} rows={3} />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Refund policy" icon="fa-rotate-left">
        <Textarea label="Refund policy text" value={`Clients may request a full refund within ${refundDays} days of purchase, provided the course or session has not been accessed or attended. Refunds are processed within 5–7 business days.`}
          onChange={() => {}} rows={5}
          hint="This text appears on invoices and checkout pages." />
        <SaveBar onSave={() => {}} />
      </Card>
    </div>
  );
}

/* ── Section: Email ──────────────────────────────────────────────────────── */

function EmailSection() {
  const [smtpHost, setSmtpHost]   = useState("");
  const [smtpPort, setSmtpPort]   = useState("587");
  const [smtpUser, setSmtpUser]   = useState("");
  const [smtpPass, setSmtpPass]   = useState("");
  const [fromName, setFromName]   = useState("WirfonCloud");
  const [fromEmail, setFromEmail] = useState("no-reply@wirfon.com");
  const [notifs, setNotifs] = useState({
    welcome:     true,
    booking:     true,
    courseComplete: true,
    teamInvite:  true,
    weeklyDigest: false,
    newEnrolment: true,
  });
  const toggleNotif = (k: keyof typeof notifs) => setNotifs((n) => ({ ...n, [k]: !n[k] }));
  const notifLabels: Record<keyof typeof notifs, [string, string]> = {
    welcome:        ["Welcome email",            "Sent when a new user registers"],
    booking:        ["Booking confirmation",      "Sent when a session is confirmed"],
    courseComplete: ["Course completion",         "Sent when a student finishes a course"],
    teamInvite:     ["Team invite",               "Sent when you invite a team member"],
    weeklyDigest:   ["Weekly digest",             "Weekly summary of bookings & enrolments"],
    newEnrolment:   ["New enrolment alert",       "Alert you when someone enrols in a course"],
  };

  return (
    <div className="st-sections">
      <Card title="SMTP configuration" desc="Connect your email server to send transactional emails." icon="fa-server">
        <div className="admin-grid-2">
          <Field label="SMTP host" value={smtpHost} onChange={setSmtpHost} placeholder="smtp.example.com" />
          <Field label="Port" type="number" value={smtpPort} onChange={setSmtpPort} />
          <Field label="Username" value={smtpUser} onChange={setSmtpUser} placeholder="smtp-user" />
          <Field label="Password" type="password" value={smtpPass} onChange={setSmtpPass} placeholder="••••••••" />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Sender identity" icon="fa-at">
        <div className="admin-grid-2">
          <Field label="From name" value={fromName} onChange={setFromName} />
          <Field label="From email" type="email" value={fromEmail} onChange={setFromEmail} />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Notification toggles" desc="Choose which events trigger an email." icon="fa-bell">
        {(Object.keys(notifLabels) as (keyof typeof notifs)[]).map((k) => (
          <Row key={k} label={notifLabels[k][0]} desc={notifLabels[k][1]}>
            <Toggle checked={notifs[k]} onChange={() => toggleNotif(k)} />
          </Row>
        ))}
      </Card>
    </div>
  );
}

/* ── Section: SEO ────────────────────────────────────────────────────────── */

function SEOSection() {
  const [metaTitle, setMetaTitle]   = useState("%s — WirfonCloud");
  const [metaDesc, setMetaDesc]     = useState("WirfonCloud — Cloud training and consulting. Let's rule the clouds.");
  const [gaId, setGaId]             = useState("");
  const [gscId, setGscId]           = useState("");
  const [sitemap, setSitemap]       = useState(true);
  const [robotsIndex, setRobotsIndex] = useState(true);

  return (
    <div className="st-sections">
      <Card title="Meta defaults" desc="Used on pages that don't have their own SEO content." icon="fa-tags">
        <Field label="Page title template" value={metaTitle} onChange={setMetaTitle}
          hint='Use %s as a placeholder for the page name, e.g. "About — WirfonCloud"' />
        <Textarea label="Default meta description" value={metaDesc} onChange={setMetaDesc} rows={3}
          hint="Keep under 160 characters for best results." />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Analytics & Search Console" icon="fa-chart-bar">
        <div className="admin-grid-2">
          <Field label="Google Analytics 4 Measurement ID" value={gaId} onChange={setGaId}
            placeholder="G-XXXXXXXXXX" hint="Paste your GA4 measurement ID." />
          <Field label="Google Search Console verification ID" value={gscId} onChange={setGscId}
            placeholder="google-site-verification=…" />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Crawling & indexing" icon="fa-spider">
        <Row label="Generate sitemap" desc="Automatically generate /sitemap.xml for search engines.">
          <Toggle checked={sitemap} onChange={setSitemap} />
        </Row>
        <Row label="Allow search engine indexing" desc="If disabled, a noindex header is sent on all pages.">
          <Toggle checked={robotsIndex} onChange={setRobotsIndex} />
        </Row>
        {!robotsIndex && (
          <div className="st-info-box danger" style={{ marginTop: "1rem" }}>
            <i className="fa-solid fa-triangle-exclamation" />
            <span>Search engines are blocked from indexing your site.</span>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── Section: Security ───────────────────────────────────────────────────── */

function SecuritySection() {
  const [maxAttempts, setMaxAttempts] = useState("5");
  const [lockoutMins, setLockoutMins] = useState("15");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [ipBlacklist, setIpBlacklist] = useState("");
  const [privacy, setPrivacy]         = useState("Your privacy is important to us. WirfonCloud collects only necessary personal data to deliver our services and does not share data with third parties without your consent.");
  const [terms, setTerms]             = useState("By using WirfonCloud services, you agree to comply with these terms. All courses and consulting sessions are subject to availability.");

  return (
    <div className="st-sections">
      <Card title="Login protection" icon="fa-user-shield">
        <div className="admin-grid-2">
          <Field label="Max failed login attempts" type="number" value={maxAttempts} onChange={setMaxAttempts} hint="Account is locked after this many failures." />
          <Field label="Lockout duration (minutes)" type="number" value={lockoutMins} onChange={setLockoutMins} hint="How long a locked account stays locked." />
        </div>
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="IP access control" desc="Restrict which IPs can access the admin panel." icon="fa-network-wired">
        <Textarea label="IP whitelist (one per line)" value={ipWhitelist} onChange={setIpWhitelist} rows={4}
          hint="Leave blank to allow all IPs. Only listed IPs will be able to access /admin." />
        <Textarea label="IP blacklist (one per line)" value={ipBlacklist} onChange={setIpBlacklist} rows={3}
          hint="Listed IPs are always blocked from accessing the admin panel." />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Privacy policy" icon="fa-file-shield">
        <Textarea label="Privacy policy text" value={privacy} onChange={setPrivacy} rows={8} />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Terms of service" icon="fa-scale-balanced">
        <Textarea label="Terms of service text" value={terms} onChange={setTerms} rows={8} />
        <SaveBar onSave={() => {}} />
      </Card>

      <Card title="Data & GDPR" icon="fa-database">
        <Row label="Export all site data" desc="Download a full JSON export of all content and settings.">
          <button className="btn btn-outline btn-sm" onClick={() => {
            const blob = new Blob(["{}"], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "wirfoncloud-export.json"; a.click();
          }}>
            <i className="fa-solid fa-download" /> Export data
          </button>
        </Row>
        <Row label="Delete all user data" desc="Permanently remove all stored user data. This cannot be undone.">
          <button className="btn btn-outline btn-sm danger">
            <i className="fa-solid fa-trash" /> Delete data
          </button>
        </Row>
      </Card>
    </div>
  );
}

/* ── Section: Audit Log ──────────────────────────────────────────────────── */

function AuditSection() {
  const logs = [
    { time: "2026-05-30 16:42",  user: "admin@wirfon.com",   action: "Updated site content",   detail: "About page — sections" },
    { time: "2026-05-30 14:11",  user: "admin@wirfon.com",   action: "Uploaded image",          detail: "Gallery album 'Summit 2024'" },
    { time: "2026-05-29 09:03",  user: "editor@wirfon.com",  action: "Published blog post",     detail: '"Cloud Cost Optimization"' },
    { time: "2026-05-28 17:55",  user: "admin@wirfon.com",   action: "Changed settings",        detail: "Social links updated" },
    { time: "2026-05-27 11:30",  user: "admin@wirfon.com",   action: "Team member invited",     detail: "editor@wirfon.com (Editor)" },
    { time: "2026-05-26 08:15",  user: "editor@wirfon.com",  action: "Updated site content",    detail: "Academy — course list" },
    { time: "2026-05-25 19:48",  user: "admin@wirfon.com",   action: "Login",                   detail: "Chrome on Windows" },
    { time: "2026-05-24 13:22",  user: "admin@wirfon.com",   action: "Reset site content",      detail: "Restored to defaults" },
    { time: "2026-05-23 10:05",  user: "support@wirfon.com", action: "Viewed content",          detail: "Read-only session" },
    { time: "2026-05-22 16:33",  user: "admin@wirfon.com",   action: "Updated site content",    detail: "Hero slides" },
  ];
  const [filter, setFilter] = useState("");
  const filtered = logs.filter((l) =>
    !filter || l.user.includes(filter) || l.action.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="st-sections">
      <Card title="Audit log" desc="Read-only record of all admin actions." icon="fa-clock-rotate-left">
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            className="st-filter-input"
            placeholder="Filter by user or action…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <table className="st-table">
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Detail</th></tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={i}>
                <td className="st-mono">{l.time}</td>
                <td>{l.user}</td>
                <td>{l.action}</td>
                <td className="muted">{l.detail}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--grey-400)", padding: "2rem" }}>No matching entries</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */

const SECTION_CONTENT: Record<Section, { title: string; desc: string }> = {
  account:    { title: "Account & Profile",     desc: "Personal details, password and session management" },
  team:       { title: "User Management",       desc: "Team members, roles and permissions" },
  platform:   { title: "Platform",              desc: "Site identity, branding, contact and maintenance" },
  courses:    { title: "Courses & Content",     desc: "Default visibility, certificates and video hosting" },
  consulting: { title: "Consulting & Bookings", desc: "Availability, approval mode and meeting links" },
  payments:   { title: "Payments",              desc: "Currency, invoices and refund policy" },
  email:      { title: "Email & Notifications", desc: "SMTP configuration, sender identity and notification triggers" },
  seo:        { title: "SEO & Analytics",       desc: "Meta defaults, tracking IDs and crawl settings" },
  security:   { title: "Security & Compliance", desc: "Login protection, IP control, legal pages and GDPR" },
  audit:      { title: "Audit Log",             desc: "Read-only record of every admin action" },
};

export function SettingsPage({ data, onChange }: { data: SiteContent; onChange: (n: SiteContent) => void }) {
  const [active, setActive] = useState<Section>("account");
  const groups = [...new Set(NAV.map((n) => n.group))];
  const info = SECTION_CONTENT[active];

  return (
    <div className="st-layout">
      {/* ── Left nav ── */}
      <nav className="st-nav">
        {groups.map((g) => (
          <div key={g} className="st-nav-group">
            <span className="st-nav-group-label">{g}</span>
            {NAV.filter((n) => n.group === g).map((n) => (
              <button
                key={n.id}
                type="button"
                className={"st-nav-item" + (active === n.id ? " active" : "")}
                onClick={() => setActive(n.id)}
              >
                <i className={`fa-solid ${n.icon} st-nav-icon`} />
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Right content ── */}
      <div className="st-content">
        <div className="st-content-header">
          <h2>{info.title}</h2>
          <p>{info.desc}</p>
        </div>

        {active === "account"    && <AccountSection />}
        {active === "team"       && <TeamSection />}
        {active === "platform"   && <PlatformSection data={data} onChange={onChange} />}
        {active === "courses"    && <CoursesSection />}
        {active === "consulting" && <ConsultingSection />}
        {active === "payments"   && <PaymentsSection />}
        {active === "email"      && <EmailSection />}
        {active === "seo"        && <SEOSection />}
        {active === "security"   && <SecuritySection />}
        {active === "audit"      && <AuditSection />}
      </div>
    </div>
  );
}
