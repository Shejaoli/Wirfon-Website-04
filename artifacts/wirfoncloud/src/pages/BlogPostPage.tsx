import { useState } from "react";
import { useParams, Link } from "wouter";
import { useSite } from "@/hooks/useSite";
import { toSlug } from "@/lib/site";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const site = useSite();
  const [imgErr, setImgErr] = useState(false);

  const post = site.blog.posts.find(
    (p) => (p.slug && p.slug === slug) || toSlug(p.title) === slug,
  );

  if (!post) {
    return (
      <section className="section">
        <div className="container narrow text-center">
          <i
            className="fa-solid fa-file-circle-question"
            style={{ fontSize: "3rem", color: "var(--grey-300)", marginBottom: "1rem" }}
          />
          <h1 style={{ fontSize: "1.75rem" }}>Post not found</h1>
          <p style={{ color: "var(--grey-500)", marginBottom: "1.5rem" }}>
            This post may have been removed or its URL may have changed.
          </p>
          <Link href="/blog" className="btn btn-primary">
            <i className="fa-solid fa-arrow-left" /> Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const showThumb = !!post.image && !imgErr;

  return (
    <>
      <section className="section blog-post-hero-section">
        <div className="container narrow">
          <Link href="/blog" className="blog-back-link">
            <i className="fa-solid fa-arrow-left" /> All posts
          </Link>

          <header className="blog-post-header">
            {post.date && <span className="blog-date">{post.date}</span>}
            <h1 className="blog-post-title">{post.title}</h1>
            {post.text && <p className="blog-post-excerpt">{post.text}</p>}
          </header>

          {showThumb && (
            <div className="blog-post-thumb-wrap">
              <img
                src={post.image}
                alt={post.title}
                className="blog-post-thumb"
                onError={() => setImgErr(true)}
              />
            </div>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container narrow">
          {post.body?.trim() ? (
            <div
              className="blog-post-body"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : post.link?.trim() ? (
            <div className="blog-post-no-body">
              <i className="fa-solid fa-external-link" />
              <p>This post is published externally.</p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Read on external site&nbsp;
                <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            </div>
          ) : (
            <div className="blog-post-no-body">
              <i className="fa-solid fa-pen-to-square" style={{ color: "var(--grey-300)", fontSize: "2rem" }} />
              <p style={{ color: "var(--grey-500)" }}>
                No article body yet. Add content in the admin panel.
              </p>
            </div>
          )}

          <div className="blog-post-footer">
            <Link href="/blog" className="btn btn-outline">
              <i className="fa-solid fa-arrow-left" /> Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
