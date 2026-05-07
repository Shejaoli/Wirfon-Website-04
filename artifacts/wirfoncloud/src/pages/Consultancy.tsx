import { Link } from "wouter";
import VideoCarousel from "@/components/VideoCarousel";
import TwoColImage from "@/components/TwoColImage";
import { useSite } from "@/hooks/useSite";

export default function Consultancy() {
  const site = useSite();
  const c = site.consultancy;
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

      {c.services.length > 0 && (
        <section id="services" className="section section-alt anchor-section">
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
            {[
              { icon: "fa-magnifying-glass", step: "01", title: "Discovery", text: "We start by understanding your business, infrastructure, and goals through a free consultation." },
              { icon: "fa-map", step: "02", title: "Strategy", text: "Our experts design a tailored cloud roadmap aligned to your budget and timeline." },
              { icon: "fa-rocket", step: "03", title: "Delivery", text: "We implement solutions with minimal disruption, maintaining full transparency throughout." },
              { icon: "fa-headset", step: "04", title: "Support", text: "Post-project support and knowledge transfer to ensure your team is confident and independent." },
            ].map((item, i) => (
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
    </>
  );
}
