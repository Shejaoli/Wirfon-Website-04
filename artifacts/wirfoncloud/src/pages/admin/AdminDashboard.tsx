import { useEffect, useState } from "react";
import { useLocation } from "wouter";
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

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { reload } = useSiteCtx();
  const [authChecked, setAuthChecked] = useState(false);
  const [data, setData] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("branding");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      const ok = await adminMe();
      if (!ok) {
        navigate("/admin/login");
        return;
      }
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
      setStatus({ kind: "success", message: "Changes saved." });
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

  if (!authChecked || !data) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading admin…</p>
      </div>
    );
  }

  const activeTabInfo = ALL_TABS.find((t) => t.id === tab)!;

  return (
    <div className="admin-shell">
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
        <div className="admin-topbar-actions">
          {status && (
            <span className={"admin-toast " + status.kind}>
              <i className={"fa-solid " + (status.kind === "success" ? "fa-circle-check" : "fa-circle-exclamation")} />
              {status.message}
            </span>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <i className="fa-solid fa-arrow-up-right-from-square" /> View site
          </a>
          <button
            onClick={handleSave}
            className={"btn btn-sm admin-save-btn" + (dirty ? " is-dirty" : "")}
            disabled={!dirty || saving}
          >
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving…</> : dirty ? <><i className="fa-solid fa-cloud-arrow-up" /> Publish changes</> : <><i className="fa-solid fa-check" /> Saved</>}
          </button>
          <button onClick={handleLogout} className="btn btn-outline btn-sm admin-logout-btn" title="Sign out">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </header>

      <div className="admin-body">
        {navOpen && <div className="admin-sidebar-overlay" onClick={() => setNavOpen(false)} />}
        <aside className={"admin-sidebar" + (navOpen ? " open" : "")}>
          <div className="admin-sidebar-inner">
            {TAB_GROUPS.map((group) => (
              <div key={group.label} className="admin-nav-group">
                <p className="admin-nav-group-label">{group.label}</p>
                <ul>
                  {group.tabs.map((t) => (
                    <li key={t.id}>
                      <button
                        className={t.id === tab ? "active" : ""}
                        onClick={() => { setTab(t.id); setNavOpen(false); }}
                        title={t.desc}
                      >
                        <span className="admin-nav-icon" style={{ background: TAB_COLORS[t.id] }}>
                          <i className={`fa-solid ${t.icon}`} />
                        </span>
                        <span className="admin-nav-text">
                          <span className="admin-nav-label">{t.label}</span>
                          <span className="admin-nav-desc">{t.desc}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-user">
              <div className="admin-sidebar-avatar">
                <i className="fa-solid fa-user" />
              </div>
              <div className="admin-sidebar-user-info">
                <span className="admin-sidebar-user-name">Administrator</span>
                <span className="admin-sidebar-user-role">WirfonCloud Admin</span>
              </div>
              <button
                className="admin-sidebar-signout"
                onClick={handleLogout}
                title="Sign out"
              >
                <i className="fa-solid fa-right-from-bracket" />
              </button>
            </div>
          </div>
        </aside>

        <main className="admin-main">
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
            <BrandingEditor
              branding={data.branding}
              onChange={(branding) => update({ ...data, branding })}
            />
          )}
          {tab === "hero" && (
            <HeroEditor
              hero={data.hero}
              onChange={(hero) => update({ ...data, hero })}
            />
          )}
          {tab === "home" && (
            <>
              <HomeIntroEditor
                items={data.homeIntro}
                onChange={(homeIntro) => update({ ...data, homeIntro })}
              />
              <HomeTestimonialsEditor
                items={data.homeTestimonials}
                onChange={(homeTestimonials) => update({ ...data, homeTestimonials })}
              />
              <PartnersEditor
                items={data.partners}
                onChange={(partners) => update({ ...data, partners })}
              />
              <HomeCtaEditor
                cta={data.homeCta}
                onChange={(homeCta) => update({ ...data, homeCta })}
              />
            </>
          )}
          {tab === "about" && (
            <AboutEditor
              about={data.about}
              onChange={(about) => update({ ...data, about })}
            />
          )}
          {tab === "academy" && (
            <AcademyEditor
              academy={data.academy}
              onChange={(academy) => update({ ...data, academy })}
            />
          )}
          {tab === "consultancy" && (
            <ConsultancyEditor
              consultancy={data.consultancy}
              onChange={(consultancy) => update({ ...data, consultancy })}
            />
          )}
          {tab === "blog" && (
            <BlogEditor
              blog={data.blog}
              onChange={(blog) => update({ ...data, blog })}
            />
          )}
          {tab === "faq" && (
            <FaqsEditor
              items={data.faqs}
              onChange={(faqs) => update({ ...data, faqs })}
            />
          )}
          {tab === "gallery" && (
            <GalleryEditor
              gallery={data.gallery ?? { bannerTitle: "WirfonCloud in Pictures", bannerSubtitle: "", albums: [] }}
              onChange={(gallery) => update({ ...data, gallery })}
            />
          )}
          {tab === "settings" && (
            <>
              <SocialEditor
                social={data.social}
                onChange={(social) => update({ ...data, social })}
              />
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
        </main>
      </div>
    </div>
  );
}
