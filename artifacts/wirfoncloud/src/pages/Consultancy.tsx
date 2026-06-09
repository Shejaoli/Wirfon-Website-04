import { Link } from "wouter";
import VideoCarousel from "@/components/VideoCarousel";
import TwoColImage from "@/components/TwoColImage";
import { useSite } from "@/hooks/useSite";
import placeholderImg from "@assets/001wirfoncloud_kleppen2_1778163190666.png";

const DEFAULT_HOW_WE_WORK = [
  { icon: "fa-magnifying-glass", step: "01", title: "Discovery",  text: "We start by understanding your business, infrastructure, and goals through a free consultation." },
  { icon: "fa-map",              step: "02", title: "Strategy",   text: "Our experts design a tailored cloud roadmap aligned to your budget and timeline." },
  { icon: "fa-rocket",           step: "03", title: "Delivery",   text: "We implement solutions with minimal disruption, maintaining full transparency throughout." },
  { icon: "fa-headset",          step: "04", title: "Support",    text: "Post-project support and knowledge transfer to ensure your team is confident and independent." },
];

const DEFAULT_AI_CONSULTANCY = {
  image: "",
  fallbackLabel: "AI Consultancy",
  title: "AI Consultancy",
  text: "We help organisations understand, adopt and operationalise Artificial Intelligence — from strategy and readiness assessments to hands-on implementation. Whether you are exploring AI for the first time or scaling existing initiatives, our experts guide you every step of the way.",
  ctaHref: "/about#contact",
  ctaLabel: "Talk to an Expert",
};

export default function Consultancy() {
  const site = useSite();
  const c = site.consultancy;
  const quotes = site.academy?.testimonialQuotes ?? [];

  return (
    <>
      <section className="section">
        <div className="container two-col">
          <div className="col-image">
            <TwoColImage src={c.image} alt={c.title} fallbackLabel={c.fallbackLabel} />
          </div>
          <div className="col-text">
            <h1>{c.title}</h1>
            <p>{c.text}</p>
            <Link href={c.ctaHref} className="btn btn-primary">{c.ctaLabel}</Link>
          </div>
        </div>
      </section>

      {(() => {
        const ai = c.aiConsultancy ?? DEFAULT_AI_CONSULTANCY;
        return (
          <section className="section section-alt">
            <div className="container two-col reverse">
              <div className="col-image">
                <TwoColImage
                  src={ai.image || placeholderImg}
                  alt={ai.title}
                  fallbackLabel={ai.fallbackLabel}
                />
              </div>
              <div className="col-text">
                <h2>{ai.title}</h2>
                <p>{ai.text}</p>
                <Link href={ai.ctaHref} className="btn btn-primary">{ai.ctaLabel}</Link>
              </div>
            </div>
          </section>
        );
      })()}

      {c.services.length > 0 && (
        <section id="services" className="section anchor-section">
          <div className="container">
            <h2 className="section-title">Our Services</h2>
            <p className="section-intro-text">
              From cloud migration to AI adoption, our certified consultants deliver
              practical solutions tailored to your organisation's goals and budget.
            </p>
            <div className="cards-grid services-grid">
              {c.services.slice(0, 4).map((s, i) => (
                <div key={i} id={s.title.toLowerCase().replace(/\s+/g, "-")} className="card service-card anchor-section">
                  <div className="service-icon"><i className={`fa-solid ${s.icon}`} /></div>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                  <Link href="/about#contact" className="btn btn-primary btn-sm">
                    Get in Touch
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section-title">How We Work</h2>
          <div className="cards-grid">
            {(c.howWeWork ?? DEFAULT_HOW_WE_WORK).map((item, i) => (
              <div key={i} className="card how-card">
                <span className="how-step">{item.step}</span>
                <div className="service-icon">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {c.testimonials.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="section-title">What Our Clients Say</h2>
            <VideoCarousel slides={c.testimonials} />
          </div>
        </section>
      )}

      {quotes.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Client Stories</h2>
            <div className="testimonials-grid">
              {quotes.map((q, i) => (
                <div key={i} className="quote-card">
                  <i className="fa-solid fa-quote-left" />
                  <p>"{q.text}"</p>
                  <div className="quote-author">
                    {q.photo ? (
                      <img className="quote-avatar" src={q.photo} alt={q.author} />
                    ) : (
                      <div className="avatar-placeholder" />
                    )}
                    <span>{q.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
