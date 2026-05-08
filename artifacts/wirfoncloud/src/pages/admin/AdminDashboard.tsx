import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  adminMe,
  adminLogout,
  adminSaveContent,
  adminResetContent,
  fetchContent,
} from "@/lib/api";
import { DEFAULT_SITE, type SiteContent } from "@/lib/site";
import { useSiteCtx } from "@/hooks/useSite";
import {
  BrandingEditor,
  HeroEditor,
  HomeIntroEditor,
  HomeTestimonialsEditor,
  PartnersEditor,
  HomeCtaEditor,
  AboutEditor,
  AcademyEditor,
  ConsultancyEditor,
  BlogEditor,
  FaqsEditor,
  GalleryEditor,
  SocialEditor,
  ContactEditor,
} from "./editors";

type Tab =
  | "dashboard"
  | "branding"
  | "hero"
  | "home"
  | "about"
  | "academy"
  | "consultancy"
  | "blog"
  | "faq"
  | "gallery"
  | "settings";

const TAB_GROUPS: { label: string; tabs: { id: Tab; label: string; icon: string; desc: string }[] }[] = [
  {
    label: "Overview",
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: "fa-gauge-high", desc: "Site overview & stats" },
    ],
  },
  {
    label: "Site Setup",
    tabs: [
      { id: "branding", label: "Branding", icon: "fa-palette", desc: "Logo and visual identity" },
      { id: "hero",     label: "Hero Slides", icon: "fa-images", desc: "Home page slideshow" },
    ],
  },
  {
    label: "Pages",
    tabs: [
      { id: "home",        label: "Home Page",    icon: "fa-house",           desc: "Intro, partners & CTA" },
      { id: "about",       label: "About",        icon: "fa-circle-info",     desc: "Story & team section" },
      { id: "academy",     label: "Academy",      icon: "fa-graduation-cap",  desc: "Courses & learning paths" },
      { id: "consultancy", label: "Consultancy",  icon: "fa-handshake",       desc: "Services & contact" },
      { id: "blog",        label: "Blog",         icon: "fa-newspaper",       desc: "Articles & announcements" },
      { id: "faq",         label: "FAQ",          icon: "fa-circle-question", desc: "Frequently asked questions" },
      { id: "gallery",     label: "Gallery",      icon: "fa-images",          desc: "Photo albums & gallery" },
    ],
  },
  {
    label: "Configuration",
    tabs: [
      { id: "settings", label: "Settings", icon: "fa-gear", desc: "Socials, contact & reset" },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs);

const TAB_COLORS: Record<Tab, string> = {
  dashboard:   "#0199ef",
  branding:    "#6366f1",
  hero:        "#0ea5e9",
  home:        "#10b981",
  about:       "#f59e0b",
  academy:     "#8b5cf6",
  consultancy: "#ec4899",
  blog:        "#14b8a6",
  faq:         "#f97316",
  gallery:     "#0891b2",
  settings:    "#64748b",
};

/* ─── Dashboard Overview ─────────────────────────── */
function StatCard({
  label, value, icon, color, bgColor, sub, delay, onClick,
}: {
  label: string; value: number; icon: string; color: string;
  bgColor: string; sub: string; delay: number; onClick: () => void;
}) {
  return (
    <motion.button
      className="adm-stat-card"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(10,22,40,0.13)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="adm-stat-icon" style={{ background: bgColor }}>
        <i className={`fa-solid ${icon}`} style={{ color }} />
      </div>
      <div className="adm-stat-info">
        <motion.span
          className="adm-stat-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.15 }}
        >
          {value}
        </motion.span>
        <span className="adm-stat-label">{label}</span>
        <span className="adm-stat-sub">{sub}</span>
      </div>
    </motion.button>
  );
}

function ContentBar({ label, count, maxCount, color, delay }: {
  label: string; count: number; maxCount: number; color: string; delay: number;
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="adm-bar-row">
      <span className="adm-bar-label">{label}</span>
      <div className="adm-bar-track">
        <motion.div
          className="adm-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="adm-bar-count" style={{ color }}>{count}</span>
    </div>
  );
}

function DashboardOverview({
  data, onNavigate,
}: {
  data: SiteContent;
  onNavigate: (tab: Tab) => void;
}) {
  const blogCount = data.blog.posts.length;
  const courseCount = data.academy.fundamentals.length + data.academy.intermediate.length;
  const faqCount = data.faqs.length;
  const partnerCount = data.partners.length;
  const heroCount = data.hero.length;
  const albumCount = data.gallery?.albums.length ?? 0;
  const serviceCount = data.consultancy.services.length;
  const testimonialCount = data.homeTestimonials.length;

  const primaryStats = [
    { label: "Blog Posts",  value: blogCount,   icon: "fa-newspaper",       color: "#0199ef", bgColor: "#eff6ff", sub: "articles",   tab: "blog" as Tab },
    { label: "Courses",     value: courseCount,  icon: "fa-graduation-cap",  color: "#8b5cf6", bgColor: "#f5f3ff", sub: "modules",    tab: "academy" as Tab },
    { label: "FAQs",        value: faqCount,     icon: "fa-circle-question", color: "#f97316", bgColor: "#fff7ed", sub: "questions",  tab: "faq" as Tab },
    { label: "Partners",    value: partnerCount, icon: "fa-handshake",       color: "#10b981", bgColor: "#f0fdf4", sub: "featured",   tab: "home" as Tab },
  ];

  const sideMetrics = [
    { label: "Hero Slides",   value: heroCount,        icon: "fa-images",      color: "#0ea5e9", tab: "hero" as Tab },
    { label: "Gallery Albums",value: albumCount,       icon: "fa-photo-film",  color: "#0891b2", tab: "gallery" as Tab },
    { label: "Services",      value: serviceCount,     icon: "fa-briefcase",   color: "#ec4899", tab: "consultancy" as Tab },
    { label: "Testimonials",  value: testimonialCount, icon: "fa-star",        color: "#f59e0b", tab: "home" as Tab },
  ];

  const barSections = [
    { label: "Blog Posts", count: blogCount,     color: "#0199ef" },
    { label: "Courses",    count: courseCount,   color: "#8b5cf6" },
    { label: "FAQs",       count: faqCount,      color: "#f97316" },
    { label: "Hero Slides",count: heroCount,     color: "#0ea5e9" },
    { label: "Services",   count: serviceCount,  color: "#ec4899" },
    { label: "Albums",     count: albumCount,    color: "#10b981" },
  ];
  const maxCount = Math.max(...barSections.map(s => s.count), 1);

  const recentPosts = [...data.blog.posts].reverse().slice(0, 5);

  return (
    <div className="adm-dashboard">
      {/* ── Banner ── */}
      <motion.div
        className="adm-banner"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="adm-banner-icon">
          <i className="fa-solid fa-cloud" />
        </div>
        <div className="adm-banner-text">
          <strong>Your WirfonCloud CMS is live.</strong>
          <span>Edit any section from the sidebar and hit "Publish changes" to update your site instantly.</span>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="adm-banner-btn">
          View Site <i className="fa-solid fa-arrow-up-right-from-square" />
        </a>
      </motion.div>

      {/* ── Stats row ── */}
      <div className="adm-stats-row">
        {primaryStats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            bgColor={s.bgColor}
            sub={s.sub}
            delay={0.08 * i}
            onClick={() => onNavigate(s.tab)}
          />
        ))}
      </div>

      {/* ── Middle row ── */}
      <div className="adm-mid-row">
        {/* Content chart */}
        <motion.div
          className="adm-chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="adm-chart-header">
            <div>
              <p className="adm-chart-title">Content Overview</p>
              <p className="adm-chart-sub">Sections by item count</p>
            </div>
            <span className="adm-chart-total">
              <i className="fa-solid fa-layer-group" />
              {barSections.reduce((a, b) => a + b.count, 0)} total items
            </span>
          </div>
          <div className="adm-bars">
            {barSections.map((s, i) => (
              <ContentBar key={s.label} {...s} maxCount={maxCount} delay={0.25 + i * 0.07} />
            ))}
          </div>
        </motion.div>

        {/* Side metrics */}
        <motion.div
          className="adm-side-metrics"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="adm-side-title">More sections</p>
          {sideMetrics.map((m, i) => (
            <motion.button
              key={m.label}
              className="adm-metric-item"
              onClick={() => onNavigate(m.tab)}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
              whileHover={{ x: 3 }}
            >
              <span className="adm-metric-icon" style={{ background: m.color + "1a", color: m.color }}>
                <i className={`fa-solid ${m.icon}`} />
              </span>
              <span className="adm-metric-label">{m.label}</span>
              <span className="adm-metric-value" style={{ color: m.color }}>{m.value}</span>
              <i className="fa-solid fa-chevron-right adm-metric-arrow" />
            </motion.button>
          ))}

          {/* Quick actions */}
          <div className="adm-quick-actions">
            <p className="adm-side-title" style={{ marginTop: "1rem" }}>Quick actions</p>
            <button className="adm-qa-btn" onClick={() => onNavigate("blog")}>
              <i className="fa-solid fa-plus" /> New blog post
            </button>
            <button className="adm-qa-btn" onClick={() => onNavigate("branding")}>
              <i className="fa-solid fa-palette" /> Update branding
            </button>
            <button className="adm-qa-btn" onClick={() => onNavigate("settings")}>
              <i className="fa-solid fa-gear" /> Site settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Recent posts table ── */}
      <motion.div
        className="adm-posts-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="adm-posts-header">
          <div>
            <p className="adm-chart-title">Recent Blog Posts</p>
            <p className="adm-chart-sub">{blogCount} post{blogCount !== 1 ? "s" : ""} total</p>
          </div>
          <button className="adm-posts-manage" onClick={() => onNavigate("blog")}>
            Manage posts <i className="fa-solid fa-arrow-right" />
          </button>
        </div>

        {recentPosts.length === 0 ? (
          <div className="adm-posts-empty">
            <i className="fa-solid fa-newspaper" />
            <p>No blog posts yet. <button onClick={() => onNavigate("blog")}>Add your first post →</button></p>
          </div>
        ) : (
          <div className="adm-posts-table">
            <div className="adm-posts-thead">
              <span>Title</span>
              <span>Date</span>
              <span>Status</span>
              <span></span>
            </div>
            {recentPosts.map((post, i) => (
              <motion.div
                key={i}
                className="adm-posts-row"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.06 }}
              >
                <span className="adm-posts-title">
                  {post.image && (
                    <span className="adm-post-thumb" style={{ backgroundImage: `url(${post.image})` }} />
                  )}
                  <span>{post.title}</span>
                </span>
                <span className="adm-posts-date">{post.date || "—"}</span>
                <span className="adm-posts-badge">Published</span>
                <button className="adm-posts-edit" onClick={() => onNavigate("blog")}>
                  <i className="fa-solid fa-pen" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Main dashboard component ───────────────────── */
export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { reload } = useSiteCtx();
  const [authChecked, setAuthChecked] = useState(false);
  const [data, setData] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Overview": true,
    "Site Setup": true,
    "Pages": true,
    "Configuration": true,
  });

  useEffect(() => {
    void (async () => {
      const ok = await adminMe();
      if (!ok) { navigate("/admin/login"); return; }
      const content = await fetchContent();
      setData(content || DEFAULT_SITE);
      setAuthChecked(true);
    })();
  }, [navigate]);

  function update(next: SiteContent) {
    setData(next);
    setDirty(true);
    setStatus(null);
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setStatus(null);
    const res = await adminSaveContent(data);
    setSaving(false);
    if (res.success) {
      setDirty(false);
      setStatus({ kind: "success", message: "Changes published." });
      void reload();
    } else {
      setStatus({ kind: "error", message: res.error || "Save failed" });
    }
  }

  async function handleReset() {
    if (!confirm("Reset all content to defaults? This cannot be undone.")) return;
    setSaving(true);
    setStatus(null);
    const res = await adminResetContent();
    setSaving(false);
    if (res.success && res.data) {
      setData(res.data);
      setDirty(false);
      setStatus({ kind: "success", message: "Content reset to defaults." });
      void reload();
    } else {
      setStatus({ kind: "error", message: res.error || "Reset failed" });
    }
  }

  async function handleLogout() {
    await adminLogout();
    navigate("/admin/login");
  }

  function toggleGroup(label: string) {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  }

  function selectTab(t: Tab) {
    setTab(t);
    setNavOpen(false);
  }

  if (!authChecked || !data) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading admin…</p>
      </div>
    );
  }

  const activeTabInfo = ALL_TABS.find((t) => t.id === tab)!;
  const isDashboard = tab === "dashboard";

  return (
    <div className="admin-shell">
      {/* ── Topbar ── */}
      <header className="admin-topbar">
        <button
          className="admin-nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setNavOpen((o) => !o)}
        >
          <i className="fa-solid fa-bars" />
        </button>
        <div className="admin-brand">
          <span className="admin-brand-logo">WC</span>
          <div>
            <span className="admin-brand-name">WirfonCloud</span>
            <span className="admin-brand-sub">Content Manager</span>
          </div>
        </div>

        {/* Page title — visible on desktop topbar */}
        <div className="admin-topbar-title">
          <h2>{activeTabInfo?.label ?? "Dashboard"}</h2>
        </div>

        <div className="admin-topbar-actions">
          {status && (
            <motion.span
              className={"admin-toast " + status.kind}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <i className={"fa-solid " + (status.kind === "success" ? "fa-circle-check" : "fa-circle-exclamation")} />
              {status.message}
            </motion.span>
          )}

          {/* Notification bell */}
          <button className="admin-icon-action" title="Notifications">
            <i className="fa-solid fa-bell" />
          </button>

          {/* Help */}
          <button className="admin-icon-action" title="Help">
            <i className="fa-solid fa-circle-question" />
          </button>

          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm adm-viewsite-btn">
            <i className="fa-solid fa-arrow-up-right-from-square" /> View Site
          </a>
          <button
            onClick={handleSave}
            className={"btn btn-sm admin-save-btn" + (dirty ? " is-dirty" : "")}
            disabled={!dirty || saving}
          >
            {saving
              ? <><i className="fa-solid fa-spinner fa-spin" /> Saving…</>
              : dirty
                ? <><i className="fa-solid fa-cloud-arrow-up" /> Publish changes</>
                : <><i className="fa-solid fa-check" /> Saved</>}
          </button>
          <button onClick={handleLogout} className="btn btn-outline btn-sm admin-logout-btn" title="Sign out">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </header>

      <div className="admin-body">
        {navOpen && <div className="admin-sidebar-overlay" onClick={() => setNavOpen(false)} />}

        {/* ── Sidebar ── */}
        <aside className={"admin-sidebar" + (navOpen ? " open" : "")}>
          {/* Brand header */}
          <div className="admin-sb-brand">
            <span className="admin-sb-logo">WC</span>
            <div className="admin-sb-brand-text">
              <span className="admin-sb-name">WirfonCloud</span>
              <span className="admin-sb-sub">Content Manager</span>
            </div>
          </div>

          {/* User profile row */}
          <div className="admin-sb-user">
            <div className="admin-sb-avatar">
              <i className="fa-solid fa-user" />
            </div>
            <div className="admin-sb-user-info">
              <span className="admin-sb-user-name">Administrator</span>
              <span className="admin-sb-user-role">Admin 1</span>
            </div>
            <i className="fa-solid fa-chevron-right admin-sb-user-arrow" />
          </div>

          <div className="admin-sb-divider" />

          {/* Nav */}
          <nav className="admin-sb-nav">
            {TAB_GROUPS.map((group) => (
              <div key={group.label} className="admin-sb-group">
                <button
                  className="admin-sb-group-toggle"
                  onClick={() => toggleGroup(group.label)}
                >
                  <p className="admin-sb-group-label">{group.label}</p>
                  <motion.i
                    className="fa-solid fa-chevron-down admin-sb-group-chevron"
                    animate={{ rotate: expandedGroups[group.label] ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
                <div
                  className="admin-sb-group-items"
                  style={{
                    maxHeight: expandedGroups[group.label] ? "600px" : "0px",
                    opacity: expandedGroups[group.label] ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.25s ease, opacity 0.2s ease",
                  }}
                >
                  <ul>
                    {group.tabs.map((t) => (
                      <li key={t.id}>
                        <button
                          className={"admin-sb-item" + (t.id === tab ? " active" : "")}
                          onClick={() => selectTab(t.id)}
                          style={t.id === tab ? { borderLeft: `3px solid ${TAB_COLORS[t.id]}` } : {}}
                        >
                          <i
                            className={`fa-solid ${t.icon} admin-sb-item-icon`}
                            style={t.id === tab ? { color: TAB_COLORS[t.id] } : {}}
                          />
                          <span className="admin-sb-item-label">{t.label}</span>
                          <i className="fa-solid fa-chevron-right admin-sb-item-chevron" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>

          {/* Sign-out footer */}
          <div className="admin-sb-footer">
            {dirty && (
              <div className="admin-sb-unsaved">
                <i className="fa-solid fa-circle-dot" /> Unsaved changes
              </div>
            )}
            <button className="admin-sb-signout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className={"admin-main" + (isDashboard ? " admin-main--wide" : "")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%", minHeight: 0 }}
            >
              {/* Dashboard overview */}
              {tab === "dashboard" && (
                <DashboardOverview data={data} onNavigate={selectTab} />
              )}

              {/* Editor pages — show page header + editor */}
              {tab !== "dashboard" && (
                <>
                  <div className="admin-page-header" style={{ borderLeftColor: TAB_COLORS[tab] }}>
                    <span className="admin-page-header-icon" style={{ background: TAB_COLORS[tab] }}>
                      <i className={`fa-solid ${activeTabInfo.icon}`} />
                    </span>
                    <div>
                      <h1 className="admin-page-title">{activeTabInfo.label}</h1>
                      <p className="admin-page-desc">{activeTabInfo.desc}</p>
                    </div>
                    {dirty && (
                      <span className="admin-dirty">
                        <i className="fa-solid fa-circle-dot" /> Unsaved changes
                      </span>
                    )}
                  </div>

                  {tab === "branding" && (
                    <BrandingEditor branding={data.branding} onChange={(branding) => update({ ...data, branding })} />
                  )}
                  {tab === "hero" && (
                    <HeroEditor hero={data.hero} onChange={(hero) => update({ ...data, hero })} />
                  )}
                  {tab === "home" && (
                    <>
                      <HomeIntroEditor items={data.homeIntro} onChange={(homeIntro) => update({ ...data, homeIntro })} />
                      <HomeTestimonialsEditor items={data.homeTestimonials} onChange={(homeTestimonials) => update({ ...data, homeTestimonials })} />
                      <PartnersEditor items={data.partners} onChange={(partners) => update({ ...data, partners })} />
                      <HomeCtaEditor cta={data.homeCta} onChange={(homeCta) => update({ ...data, homeCta })} />
                    </>
                  )}
                  {tab === "about" && (
                    <AboutEditor about={data.about} onChange={(about) => update({ ...data, about })} />
                  )}
                  {tab === "academy" && (
                    <AcademyEditor academy={data.academy} onChange={(academy) => update({ ...data, academy })} />
                  )}
                  {tab === "consultancy" && (
                    <ConsultancyEditor consultancy={data.consultancy} onChange={(consultancy) => update({ ...data, consultancy })} />
                  )}
                  {tab === "blog" && (
                    <BlogEditor blog={data.blog} onChange={(blog) => update({ ...data, blog })} />
                  )}
                  {tab === "faq" && (
                    <FaqsEditor items={data.faqs} onChange={(faqs) => update({ ...data, faqs })} />
                  )}
                  {tab === "gallery" && (
                    <GalleryEditor
                      gallery={data.gallery ?? { bannerTitle: "WirfonCloud in Pictures", bannerSubtitle: "", albums: [] }}
                      onChange={(gallery) => update({ ...data, gallery })}
                    />
                  )}
                  {tab === "settings" && (
                    <>
                      <SocialEditor social={data.social} onChange={(social) => update({ ...data, social })} />
                      <ContactEditor
                        contact={data.contact}
                        footer={data.footer}
                        onChange={(contact, footer) => update({ ...data, contact, footer })}
                      />
                      <section className="admin-card admin-danger">
                        <h3>Reset content</h3>
                        <p>Restore every section to the original defaults. Use with caution.</p>
                        <button onClick={handleReset} className="btn btn-outline btn-sm" disabled={saving}>
                          Reset to defaults
                        </button>
                      </section>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
