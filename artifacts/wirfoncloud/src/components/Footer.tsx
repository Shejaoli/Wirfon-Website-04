import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useSite } from "@/hooks/useSite";
import wirfonLogo from "@assets/001wirfoncloud_kleppen2_1778163190666.png";

export default function Footer() {
  const site = useSite();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [, navigate] = useLocation();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      navigate("/admin");
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 600);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const logoUrl = site.branding?.logoUrl || "";

  return (
    <footer className="site-footer">
      <div className="footer-subscribe">
        <div className="container footer-subscribe-row">
          <div className="footer-subscribe-copy">
            <h3>Subscribe</h3>
            <p>
              Get cloud insights, training updates and event invitations from WirfonCloud
              delivered straight to your inbox.
            </p>
          </div>
          <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Write Email"
              aria-label="Your email address"
            />
            <button type="submit" aria-label="Subscribe" disabled={status === "loading"}>
              <i className="fa-solid fa-arrow-right" />
            </button>
          </form>
          <div className="footer-subscribe-logo-wrap">
            <img
              src={wirfonLogo}
              alt="WirfonCloud"
              className="footer-subscribe-logo"
              onClick={handleLogoClick}
              style={{ cursor: "default", userSelect: "none" }}
              draggable={false}
            />
          </div>
        </div>
        {status === "ok" && (
          <p className="container footer-subscribe-msg success">Thanks for subscribing!</p>
        )}
        {status === "error" && (
          <p className="container footer-subscribe-msg error">
            Something went wrong. Please try again or email{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
          </p>
        )}
      </div>

      <div className="footer-main">
        <div className="container footer-main-grid">
          <div className="footer-brand-col">
            {logoUrl ? (
              <img src={logoUrl} alt="WirfonCloud" className="footer-brand-logo" />
            ) : (
              <span className="footer-brand-name">WirfonCloud</span>
            )}
            <p className="footer-slogan">Let's rule the clouds</p>
            <span className="footer-divider" />
            <p className="footer-brand-text">
              Cloud training, certification and consulting for teams and individuals
              ready to grow their careers in the cloud.
            </p>
            <ul className="footer-socials">
              {site.social.facebook && (
                <li>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                </li>
              )}
              {site.social.twitter && (
                <li>
                  <a href={site.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                </li>
              )}
              {site.social.linkedin && (
                <li>
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                </li>
              )}
              {site.social.youtube && (
                <li>
                  <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <i className="fa-brands fa-youtube" />
                  </a>
                </li>
              )}
              {site.social.discord && (
                <li>
                  <a href={site.social.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord">
                    <i className="fa-brands fa-discord" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Academy</h4>
            <ul>
              <li><Link href="/academy#courses">Courses</Link></li>
              <li><Link href="/academy#learning-paths">Learning Paths</Link></li>
              <li><Link href="/academy#mastery">Mastery</Link></li>
              <li><Link href="/academy#more">Workshops</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/consultancy#services">Consultancy</Link></li>
              <li><Link href="/academy">Training</Link></li>
              <li><Link href="/about#our-mission">Mentoring</Link></li>
              <li><Link href="/about#contact">Get in Touch</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-contact-col">
            <h4>Contact</h4>
            <p className="footer-contact-line">
              <span className="footer-contact-label">Email:</span>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </p>
            {site.social.whatsapp && (
              <p className="footer-contact-line">
                <span className="footer-contact-label">WhatsApp:</span>
                <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer">
                  Chat with us
                </a>
              </p>
            )}
          </div>

          <div className="footer-map">
            <iframe
              title="WirfonCloud location"
              src="https://www.google.com/maps?q=Chigariranda%2C+Mount+Bruso&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="container">
          <div className="footer-thanks">
            <p>Thank you for visiting WirfonCloud — let's rule the clouds together.</p>
            <p className="footer-powered">Powered by Wirfon Group Investments Ltd</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-row">
          <ul className="footer-legal">
            <li><Link href="/about">Privacy Policy</Link></li>
            <li><Link href="/about#our-mission">Our History</Link></li>
            <li><Link href="/consultancy">What We Do</Link></li>
          </ul>
          <span>
            &copy; {site.footer.copyrightYear} WirfonCloud. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
