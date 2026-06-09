import { Link } from "wouter";
import HeroSlider from "@/components/HeroSlider";
import VideoCarousel from "@/components/VideoCarousel";
import TwoColImage from "@/components/TwoColImage";
import { useSite } from "@/hooks/useSite";
import founderImg from "@assets/Photo_from_Mfoome_Bahti_-Ban(3)_1777412731019.jpg";
import type { CoreValue } from "@/lib/site";

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
      title: site.homeApproach?.title ?? "Our Approach",
      text: site.homeApproach?.text ?? "We combine hands-on training, expert consulting, and community mentorship to guide every individual and organisation confidently into the cloud — step by step, skill by skill.",
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

const DEFAULT_CORE_VALUES: CoreValue[] = [
  { number: "01", title: "Foundation First", description: "We never skip steps. Before Cloud, before AI — Linux, Networking, Python. The right order builds professionals who last." },
  { number: "02", title: "Respect for the Learner", description: "We treat every student as an intelligent, capable adult. Clear, honest teaching that respects where you are and where you are going." },
  { number: "03", title: "Cultural Relevance", description: "We teach through the world our learners already know — African markets, African infrastructure, African daily life. When a concept connects to your context, it sticks." },
  { number: "04", title: "Proven Outcomes", description: "We measure success by professionals who get hired, not by enrolment numbers. Our graduates are working in real roles at real organisations." },
  { number: "05", title: "Access and Inclusion", description: "Cloud and AI careers should not be reserved for people who grew up with a certain accent or postcode. We are building the bridge — from Kigali, across Africa, and into the diaspora." },
  { number: "06", title: "Integrity in Teaching", description: "We do not sell shortcuts. We tell the truth about what the work involves — and we stay with our students through it." },
];

function CoreValuesSection() {
  const site = useSite();
  const cv = site.coreValues;
  const heading = cv?.heading ?? "Our Core Values";
  const values = cv?.values?.length ? cv.values : DEFAULT_CORE_VALUES;

  return (
    <section className="section core-values-section">
      <div className="container">
        <h2 className="section-title">{heading}</h2>
        <div className="core-values-grid">
          {values.map((v, i) => (
            <div key={i} className="core-value-card">
              <span className="core-value-number">{v.number}</span>
              <h3 className="core-value-title">{v.title}</h3>
              <p className="core-value-desc">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderMessage() {
  const site = useSite();
  const founder = site.homeFounder;
  const quote = founder?.quote ?? "Cloud computing is not just a technology — it's an equaliser. Whether you're switching careers, scaling a business, or modernising your infrastructure, the cloud opens doors that were once closed. At WirfonCloud we exist to make sure those doors are open to everyone.";
  const founderName = founder?.founderName ?? "Founder & CEO, WirfonCloud";
  const founderTitle = founder?.founderTitle ?? "Wirfon Group Investments Ltd";
  const photoSrc = founder?.founderPhoto || "";

  return (
    <section className="section founder-section">
      <div className="container founder-container">
        <div className="founder-image-wrap">
          <img
            src={photoSrc || founderImg}
            alt="WirfonCloud Founder"
            className="founder-photo"
          />
        </div>
        <div className="founder-content">
          <span className="founder-eyebrow">A Word from Our Founder</span>
          <blockquote className="founder-quote">"{quote}"</blockquote>
          <div className="founder-meta">
            <strong>{founderName}</strong>
            <span>{founderTitle}</span>
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
  const quotes = site.academy?.testimonialQuotes ?? [];

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

      <section className="quiz-cta-strip">
        <div className="container quiz-cta-strip-inner">
          <div className="quiz-cta-strip-text">
            <i className="fa-solid fa-terminal quiz-cta-strip-icon" />
            <div>
              <strong>Not sure where to start?</strong>
              <span>Take our free 5-minute Linux Career Readiness Quiz.</span>
            </div>
          </div>
          <Link href="/quiz" className="btn btn-primary quiz-cta-strip-btn">
            Test Your Linux Knowledge →
          </Link>
        </div>
      </section>

      <MissionVisionApproach />

      <CoreValuesSection />

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
            <button
              className="btn btn-primary ml-onclick-form"
              onClick={() => (window as any).ml?.('show', 'orZO2n', true)}
            >
              {site.homeCta.primaryLabel}
            </button>
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

      {quotes.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="section-title">Alumni Stories</h2>
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
