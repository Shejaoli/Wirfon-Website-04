import { Link } from "wouter";
import { useSite } from "@/hooks/useSite";
import { toSlug } from "@/lib/site";
import type { BlogPost } from "@/lib/site";
import { useState } from "react";

function BlogCard({ p }: { p: BlogPost }) {
  const [imgErr, setImgErr] = useState(false);
  const slug = p.slug || toSlug(p.title);
  const hasLink = !!p.link?.trim();
  const hasBody = !!p.body?.trim();
  const showThumb = !!p.image && !imgErr;

  return (
    <article className="card blog-card">
      <div className="blog-thumb-wrap">
        {showThumb ? (
          <img
            className="blog-thumb"
            src={p.image}
            alt={p.title}
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="blog-thumb-placeholder">
            <i className="fa-solid fa-newspaper" />
          </div>
        )}
      </div>
      <div className="blog-body">
        {p.date && <span className="blog-date">{p.date}</span>}
        <h4>{p.title}</h4>
        {p.text && <p>{p.text}</p>}
        <div className="blog-actions">
          {hasLink ? (
            <a
              href={p.link!}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Read more&nbsp;<i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          ) : (hasBody || true) && slug ? (
            <Link href={`/blog/${slug}`} className="btn btn-outline btn-sm">
              Read more&nbsp;<i className="fa-solid fa-book-open" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Blog() {
  const site = useSite();

  return (
    <>
      <section className="section newsletter-section">
        <div className="container narrow text-center">
          <h1>{site.blog.title}</h1>
          <p>{site.blog.text}</p>
          <div className="mailerlite-embed-wrap">
            <div className="ml-embedded" data-form="N8d2uP"></div>
          </div>
        </div>
      </section>

      {site.social.linkedin && (
        <section className="section section-alt">
          <div className="container">
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-banner"
            >
              <i className="fa-brands fa-linkedin" />
              <span>Follow us on LinkedIn for the latest updates</span>
              <i className="fa-solid fa-arrow-right" />
            </a>
          </div>
        </section>
      )}

      {site.blog.posts.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Latest Posts</h2>
            <div className="cards-grid">
              {site.blog.posts.map((p, i) => (
                <BlogCard key={i} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
