import { useSite } from "@/hooks/useSite";
import { Link } from "wouter";
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
      <section className="quiz-banner">
        <div className="container text-center">
          <p className="quiz-banner-icon">🎯</p>
          <h1 className="quiz-banner-heading">WirfonCloud Academy</h1>
          <p className="quiz-banner-text">
            Not sure where to start? Take our free 10-question Linux Career Readiness Quiz and
            discover your exact starting point in IT, Cloud and AI — takes just 5 minutes, no
            experience needed.
          </p>
          <Link href="/quiz" className="quiz-banner-btn">
            Take the Free Quiz →
          </Link>
        </div>
      </section>

      <section id="courses" className="section anchor-section">
        <div className="container">
          <h2 className="section-title">Courses</h2>
          {a.fundamentals.length > 0 && (
            <>
              <h3 className="group-title">
                {a.fundamentalsHeading ?? "Cloud Careers start here - not at AWS."}
              </h3>
              <div className="cards-grid">
                {a.fundamentals.map((c, i) => <CourseCard key={i} course={c} contactEmail={site.contact.email} />)}
              </div>
            </>
          )}
          {a.intermediate.length > 0 && (
            <>
              <h3 className="group-title">Intermediate to Advanced</h3>
              <div className="cards-grid">
                {a.intermediate.map((c, i) => <CourseCard key={i} course={c} contactEmail={site.contact.email} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {a.learningPaths.length > 0 && (
        <section id="career-paths" className="section section-alt anchor-section">
          <div className="container">
            <h2 className="section-title">Career Paths</h2>
            <div className="cards-grid">
              {a.learningPaths.map((p, i) => (
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
                {a.testimonialVideos.map((v, i) => (
                  <div key={`v-${i}`} className="video-card">
                    <div className="video-wrap">
                      <iframe src={v.src} title={v.title} allowFullScreen />
                    </div>
                    <p className="caption">{v.caption}</p>
                  </div>
                ))}
                {a.testimonialQuotes.map((q, i) => (
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
