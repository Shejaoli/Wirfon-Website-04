import { Link } from "wouter";
import HeroSlider from "@/components/HeroSlider";
import VideoCarousel from "@/components/VideoCarousel";
import TwoColImage from "@/components/TwoColImage";
import { useSite } from "@/hooks/useSite";
import founderImg from "@assets/Photo_from_Mfoome_Bahti_-Ban(3)_1777412731019.jpg";

function MissionVisionApproach() {
  const site = useSite();
  const missionSection = site.about.sections.find((s) => s.id === "our-mission");
  const visionSection = site.about.sections.find((s) => s.id === "our-vision");

  const cards = [
    {
      icon: "fa-bullseye",
      title: "Our Mission",
      text: missionSection?.paragraphs[0] ??
        "To demystify the complexities of cloud technology and make it accessible to individuals and companies alike.",
      color: "#0199ef",
    },
    {
      icon: "fa-eye",
      title: "Our Vision",
      text: visionSection?.paragraphs[0] ??
        "To be the trusted partner for individuals and companies in their cloud journey, providing exceptional training, insightful consulting, and transformative coaching services.",
      color: "#005fa3",
    },
    {
      icon: "fa-route",
      title: "Our Approach",
      text: "We combine hands-on training, expert consulting, and community mentorship to guide every individual and organisation confidently into the cloud — step by step, skill by skill.",
      color: "#003d6b",
    },
  ];

  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="section-title">Who We Are &amp; What We Stand For</h2>
        <p className="section-subtitle">
          At WirfonCloud we believe cloud computing should be accessible to everyone.
          Here's what drives everything we do.
        </p>
        <div className="mvp-grid">
          {cards.map((card) => (
            <div key={card.title} className="mvp-card">
              <div className="mvp-icon" style={{ background: card.color }}>
                <i className={`fa-solid ${card.icon}`} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderMessage() {
  return (
    <section className="section founder-section">
      <div className="container founder-container">
        <div className="founder-image-wrap">
          <img src={founderImg} alt="WirfonCloud Founder" className="founder-photo" />
        </div>
        <div className="founder-content">
          <span className="founder-eyebrow">A Word from Our Founder</span>
          <blockquote className="founder-quote">
            "Cloud computing is not just a technology — it's an equaliser. Whether you're
            switching careers, scaling a business, or modernising your infrastructure, the
            cloud opens doors that were once closed. At WirfonCloud we exist to make sure
            those doors are open to everyone."
          </blockquote>
          <div className="founder-meta">
            <strong>Founder &amp; CEO, WirfonCloud</strong>
            <span>Wirfon Group Investments Ltd</span>
          </div>
          <Link href="/about" className="btn btn-outline btn-sm">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const site = useSite();
  return (
    <>
      <HeroSlider />

      {site.homeIntro.map((intro, i) => {
        const sectionClass = "section" + (i % 2 === 1 ? " section-alt" : "");
        return (
          <section key={i} className={sectionClass}>
            <div className={"container two-col" + (intro.reverse ? " reverse" : "")}>
              {intro.reverse ? (
                <>
                  <div className="col-image">
                    <TwoColImage src={intro.image} alt={intro.title} fallbackLabel={intro.fallbackLabel} />
                  </div>
                  <div className="col-text">
                    <h2>{intro.title}</h2>
                    <p>{intro.text}</p>
                    <Link href={intro.ctaHref} className="btn btn-primary">{intro.ctaLabel}</Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-text">
                    <h2>{intro.title}</h2>
                    <p>{intro.text}</p>
                    <Link href={intro.ctaHref} className="btn btn-primary">{intro.ctaLabel}</Link>
                  </div>
                  <div className="col-image">
                    <TwoColImage src={intro.image} alt={intro.title} fallbackLabel={intro.fallbackLabel} />
                  </div>
                </>
              )}
            </div>
          </section>
        );
      })}

      <MissionVisionApproach />

      <FounderMessage />

      {site.partners.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="section-title">Our Partners</h2>
            <div className="partners-row">
              {site.partners.map((p, i) => (
                <a
                  key={i}
                  href={p.href || "#"}
                  className="partner"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="partner-logo-image" />
                  ) : (
                    <div className="partner-logo">{p.name}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section cta-section">
        <div className="container text-center">
          <h2>{site.homeCta.title}</h2>
          <p>{site.homeCta.text}</p>
          <div className="cta-buttons">
            <a href={site.homeCta.primaryHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {site.homeCta.primaryLabel}
            </a>
            <a href={site.homeCta.secondaryHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {site.homeCta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      {site.homeTestimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">What Our Clients Say</h2>
            <VideoCarousel slides={site.homeTestimonials} />
          </div>
        </section>
      )}
    </>
  );
}
