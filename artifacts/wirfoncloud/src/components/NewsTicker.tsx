import { Link } from "wouter";
import { useSite } from "@/hooks/useSite";
import { toSlug } from "@/lib/site";

const socials = [
  { href: "https://www.youtube.com/@wirfoncloud",          icon: "fa-youtube",    label: "YouTube"   },
  { href: "https://www.linkedin.com/company/wirfoncloud/", icon: "fa-linkedin-in", label: "LinkedIn"  },
  { href: "https://twitter.com/JoinWirfonCloud",           icon: "fa-x-twitter",  label: "X/Twitter" },
  { href: "https://www.facebook.com/wirfoncloud",          icon: "fa-facebook-f", label: "Facebook"  },
];

export default function NewsTicker() {
  const site = useSite();
  const posts = site.blog.posts;
  if (!posts.length) return null;

  const repeated = [...posts, ...posts, ...posts];

  return (
    <div className="news-ticker" aria-label="Latest blog posts">
      <span className="ticker-label" aria-hidden="true">📢</span>

      <div className="ticker-viewport">
        <div className="ticker-track">
          {repeated.map((p, i) => (
            <Link
              key={i}
              href={`/blog/${p.slug || toSlug(p.title)}`}
              className="ticker-item"
            >
              {p.title}
              <span className="ticker-sep" aria-hidden="true">•</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="ticker-socials">
        {socials.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="ticker-social-btn"
          >
            <i className={`fa-brands ${s.icon}`} />
          </a>
        ))}
      </div>
    </div>
  );
}
