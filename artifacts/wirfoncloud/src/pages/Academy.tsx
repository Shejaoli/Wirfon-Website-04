import { useSite } from "@/hooks/useSite";
import type { Course } from "@/lib/site";

function CourseCard({ course, contactEmail }: { course: Course; contactEmail: string }) {
  const previewHref = course.previewUrl && course.previewUrl.trim() !== "" ? course.previewUrl : "#";
  const signupHref =
    course.signupUrl && course.signupUrl.trim() !== ""
      ? course.signupUrl
      : `mailto:${contactEmail}?subject=Sign%20up%20for%20${encodeURIComponent(course.title)}`;
  return (
    <div className="card">
      <h4>{course.title}</h4>
      <p>{course.description}</p>
      <div className="card-actions">
        <a
          href={previewHref}
          className="btn btn-outline btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Preview
        </a>
        <a
          href={signupHref}
          className="btn btn-primary btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default function Academy() {
  const site = useSite();
  const a = site.academy;
  return (
    <>
      <section
        className="page-banner"
        style={{
          backgroundImage:
            `linear-gradient(rgba(1,153,239,0.7), rgba(0,95,163,0.85)), url('${a.bannerImage}'), linear-gradient(135deg, #0199ef 0%, #003d6b 100%)`,
        }}
      >
        <div className="container">
          <h1>{a.bannerTitle}</h1>
          <p>{a.bannerSubtitle}</p>
        </div>
      </section>

      <section id="courses" className="section anchor-section">
        <div className="container">
          <h2 className="section-title">Courses</h2>
          {a.fundamentals.length > 0 && (
            <>
              <h3 className="group-title">Fundamentals of IT</h3>
              <div className="cards-grid">
                {a.fundamentals.slice(0, 4).map((c, i) => <CourseCard key={i} course={c} contactEmail={site.contact.email} />)}
              </div>
            </>
          )}
          {a.intermediate.length > 0 && (
            <>
              <h3 className="group-title">Intermediate to Advanced</h3>
              <div className="cards-grid">
                {a.intermediate.slice(0, 4).map((c, i) => <CourseCard key={i} course={c} contactEmail={site.contact.email} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {a.learningPaths.length > 0 && (
        <section id="learning-paths" className="section section-alt anchor-section">
          <div className="container">
            <h2 className="section-title">Learning Paths</h2>
            <div className="cards-grid">
              {a.learningPaths.slice(0, 4).map((p, i) => (
                <div key={i} className="card">
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                  <a
                    href={`mailto:${site.contact.email}?subject=${encodeURIComponent(p.subject)}`}
                    className="btn btn-primary btn-sm"
                  >
                    Register Your Interest
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="mastery" className="section anchor-section">
        <div className="container">
          <h2 className="section-title">Mastery</h2>
          <p className="section-intro-text">
            Mastery-level programmes are designed for cloud practitioners ready to deepen expertise,
            achieve advanced certifications, and lead in their organisations. Reach out to our team
            to design a tailored mastery programme for you or your team.
          </p>
          <div className="cards-grid">
            {[
              {
                icon: "fa-cloud",
                title: "AWS Solutions Architect — Professional",
                text: "Advanced architecture design for complex, multi-account AWS environments.",
              },
              {
                icon: "fa-infinity",
                title: "DevOps Mastery",
                text: "CI/CD pipelines, Kubernetes, Terraform IaC, and SRE practices at scale.",
              },
              {
                icon: "fa-shield-halved",
                title: "Cloud Security Specialist",
                text: "Advanced identity, compliance, threat detection, and incident response on AWS.",
              },
              {
                icon: "fa-brain",
                title: "AI & ML on the Cloud",
                text: "Build, train, and deploy machine learning models using AWS SageMaker and cloud-native AI tools.",
              },
            ].map((item, i) => (
              <div key={i} className="card service-card">
                <div className="service-icon">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
                <a
                  href={`mailto:${site.contact.email}?subject=Mastery%20Programme%20Enquiry`}
                  className="btn btn-primary btn-sm"
                >
                  Enquire Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="more" className="section section-alt anchor-section">
        <div className="container">
          <h2 className="section-title">Workshops &amp; Community</h2>
          <div className="text-center">
            <a href={a.discordLink} className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-discord" /> Join WirfonCloud Community on Discord
            </a>
          </div>

          {(a.testimonialVideos.length > 0 || a.testimonialQuotes.length > 0) && (
            <>
              <h3 className="group-title">Testimonials</h3>
              <div className="testimonials-grid">
                {a.testimonialVideos.slice(0, 4).map((v, i) => (
                  <div key={`v-${i}`} className="video-card">
                    <div className="video-wrap">
                      <iframe src={v.src} title={v.title} allowFullScreen />
                    </div>
                    <p className="caption">{v.caption}</p>
                  </div>
                ))}
                {a.testimonialQuotes.slice(0, 4).map((q, i) => (
                  <div key={`q-${i}`} className="quote-card">
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
            </>
          )}
        </div>
      </section>
    </>
  );
}
