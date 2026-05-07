import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useSite } from "@/hooks/useSite";

const links: { href: string; label: string; key: string; dropdown?: { href: string; label: string }[] }[] = [
  {
    href: "/academy",
    label: "Academy",
    key: "academy",
    dropdown: [
      { href: "/academy#courses", label: "Courses" },
      { href: "/academy#learning-paths", label: "Learning Path" },
      { href: "/academy#mastery", label: "Mastery" },
      { href: "/academy#more", label: "Workshops" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    href: "/consultancy",
    label: "Consultancy",
    key: "consultancy",
    dropdown: [
      { href: "/consultancy#services", label: "Our Services" },
      { href: "/consultancy#cloud-migration", label: "Cloud Migration" },
      { href: "/consultancy#team-upskilling", label: "Team Upskilling" },
      { href: "/consultancy#ai", label: "AI & Innovation" },
      { href: "/consultancy#security", label: "Security" },
    ],
  },
  { href: "/blog", label: "Blog", key: "blog" },
  { href: "/gallery", label: "Gallery", key: "gallery" },
  {
    href: "/about",
    label: "About",
    key: "about",
    dropdown: [
      { href: "/about#who-we-are", label: "Who We Are" },
      { href: "/about#our-mission", label: "Our Mission" },
      { href: "/about#our-vision", label: "Our Vision" },
      { href: "/about#contact", label: "Contact" },
    ],
  },
  { href: "/faq", label: "FAQ", key: "faq" },
];

function activeKey(location: string): string {
  if (location === "/" || location === "") return "home";
  const seg = location.split("/")[1] ?? "";
  return seg;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const active = activeKey(location);
  const site = useSite();
  const logoUrl = site.branding?.logoUrl || "";

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header className="site-header">
      <div className="container nav-container">
        <Link href="/" className="brand">
          {logoUrl ? (
            <img src={logoUrl} alt="WirfonCloud" className="brand-logo" />
          ) : (
            <>
              <span className="brand-name">WirfonCloud</span>
              <span className="brand-tagline">Let's rule the clouds</span>
            </>
          )}
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={"main-nav" + (open ? " open" : "")}>
          <ul className="nav-list">
            {links.map((link) =>
              link.dropdown ? (
                <li key={link.key} className="has-dropdown">
                  <Link href={link.href} className={active === link.key ? "active" : ""}>
                    {link.label} <i className="fa-solid fa-chevron-down" />
                  </Link>
                  <ul className="dropdown">
                    {link.dropdown.map((d) => (
                      <li key={d.href}>
                        <Link href={d.href}>{d.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.key}>
                  <Link href={link.href} className={active === link.key ? "active" : ""}>
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <Link href="/about#contact" className="nav-cta">
          Contact us
        </Link>
      </div>
    </header>
  );
}
