import { useState, FormEvent } from "react";
import { useSite } from "@/hooks/useSite";
import { renderInline } from "@/lib/format";

export default function About() {
  const site = useSite();
  const [status, setStatus] = useState<{ kind: "idle" | "submitting" | "success" | "error"; message?: string }>({ kind: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus({ kind: "success", message: "Thanks! We'll be in touch soon." });
      form.reset();
    } catch {
      setStatus({
        kind: "error",
        message: `We couldn't send your message. Please email ${site.contact.email} directly.`,
      });
    }
  }

  const sections = site.about.sections;

  return (
    <>
      <section
        className="page-banner"
        style={{
          backgroundImage:
            `linear-gradient(rgba(10,22,40,0.55), rgba(10,22,40,0.55)), url('${site.about.bannerImage}'), linear-gradient(135deg, #0199ef 0%, #003d6b 100%)`,
        }}
      >
        <div className="container">
          <h1>{site.about.bannerTitle}</h1>
          <p>{site.about.bannerSubtitle}</p>
        </div>
      </section>

      {sections.map((s, i) => {
        const cls = "section anchor-section" + (i % 2 === 1 ? " section-alt" : "");
        return (
          <section key={s.id} id={s.id} className={cls}>
            <div className="container narrow">
              <h2>{s.title}</h2>
              {s.paragraphs.map((p, j) => {
                const isEmphasis = /^_[^_]+_$/.test(p.trim());
                return (
                  <p key={j} className={isEmphasis ? "emphasis" : undefined}>
                    {renderInline(p)}
                  </p>
                );
              })}
            </div>
          </section>
        );
      })}

      <section
        id="contact"
        className={"section anchor-section" + (sections.length % 2 === 1 ? " section-alt" : "")}
      >
        <div className="container narrow">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-row">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-row">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status.kind === "submitting"}>
              {status.kind === "submitting" ? "Sending..." : "Send Message"}
            </button>
            {status.kind === "success" && <div className="form-status success">{status.message}</div>}
            {status.kind === "error" && <div className="form-status error">{status.message}</div>}
          </form>
          <p className="contact-email">
            Or email us directly: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
