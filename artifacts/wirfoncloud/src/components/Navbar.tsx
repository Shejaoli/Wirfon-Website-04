import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useSite } from "@/hooks/useSite";

function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const links: { href: string; label: string; key: string; dropdown?: { href: string; label: string }[] }[] = [
  {
    href: "/academy",
    label: "Academy",
    key: "academy",
    dropdown: [
      { href: "/academy#courses", label: "Courses" },
      { href: "/academy#career-paths", label: "Career Paths" },
      { href: "/academy#more", label: "Workshops" },
      { href: "/academy#testimonials", label: "Testimonials" },
      { href: "/quiz", label: "Linux Quiz 🎯" },
    ],
  },
  {
    href: "/consultancy",
    label: "Consultancy",
    key: "consultancy",
    dropdown: [
      { href: "/consultancy", label: "Cloud Consultancy" },
      { href: "/consultancy#ai-adoption", label: "AI Consultancy" },
      { href: "/consultancy#services", label: "Our Services" },
      { href: "/consultancy#testimonials", label: "What Our Clients Say" },
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
      { href: "/about#our-core-values", label: "Our Core Values" },
      { href: "/about#our-approach", label: "Our Approach" },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const active = activeKey(location);
  const site = useSite();
  const logoUrl = site.branding?.logoUrl || "";

  const closeMenu = useCallback(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location, closeMenu]);

  function handleDropdownLinkClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    const hashIdx = href.indexOf("#");
    if (hashIdx !== -1) {
      const path = href.slice(0, hashIdx) || "/";
      const hash = href.slice(hashIdx);
      const currentPath = location === "" ? "/" : location;
      if (currentPath === path) {
        e.preventDefault();
        scrollToHash(hash);
      }
    }
    closeMenu();
  }

  function toggleDropdown(key: string) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  return (
    <header className="site-header">
      <div className="container nav-container">
        <Link href="/" className="brand" onClick={closeMenu}>
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
                <li
                  key={link.key}
                  className={"has-dropdown" + (openDropdown === link.key ? " dropdown-open" : "")}
                  onMouseEnter={() => setOpenDropdown(link.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={active === link.key ? "active" : ""}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                  <button
                    className="dropdown-toggle"
                    aria-label={`Toggle ${link.label} submenu`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown(link.key);
                    }}
                  >
                    <i className="fa-solid fa-chevron-down" />
                  </button>
                  <ul className="dropdown">
                    {link.dropdown.map((d) => (
                      <li key={d.href}>
                        <Link
                          href={d.href}
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                            handleDropdownLinkClick(e, d.href)
                          }
                        >
                          {d.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className={active === link.key ? "active" : ""}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <Link href="/about#contact" className="nav-cta" onClick={closeMenu}>
          Contact us
        </Link>
      </div>
    </header>
  );
}
