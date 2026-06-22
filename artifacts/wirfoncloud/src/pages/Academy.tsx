import { useSite } from "@/hooks/useSite";
import type { Course } from "@/lib/site";
import CustomSections from "@/components/CustomSections";

const LINUX_QUIZ_URL = "https://wirfoncloud.github.io/linux-quiz-assessment/";

const DEFAULT_ACADEMY_HOW_WE_WORK = [
  { icon: "fa-magnifying-glass", step: "01", title: "Assess Your Level", text: "We start with a free skills quiz and consultation to find exactly where you are and map the fastest path to your cloud career goal." },
  { icon: "fa-graduation-cap",   step: "02", title: "Structured Learning", text: "Follow a proven curriculum — from Linux and Networking foundations through to Cloud and AI — with live sessions, labs and real-world projects." },
  { icon: "fa-people-group",     step: "03", title: "Community & Mentorship", text: "Join our Discord community and get direct access to instructors and alumni who have walked the same path and made it." },
  { icon: "fa-briefcase",        step: "04", title: "Career Outcomes", text: "We stay with you through job applications, interview prep and onboarding — because our success is measured by the roles our graduates land." },
];

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
          <a
            href={LINUX_QUIZ_URL}
            className="quiz-banner-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Take the Free Quiz →
          </a>
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

      <section id="linux-quiz" className="section anchor-section">
        <div className="container text-center">
          <h2 className="section-title">Linux Career Readiness Quiz</h2>
          <p className="section-subtitle" style={{ maxWidth: 600, margin: "0 auto 2rem" }}>
            The foundation of Cloud and AI engineering is Linux. Test your knowledge and find out exactly where you stand — free, no sign-up needed.
          </p>
          <a
            href={LINUX_QUIZ_URL}
            className="btn btn-primary btn-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-terminal" /> Take the Linux Quiz
          </a>
        </div>
      </section>

      <section id="more" className="section section-alt anchor-section">
        <div className="container">
          <h2 className="section-title">Workshops &amp; Community</h2>
          <div className="text-center">
            <a href={a.discordLink} className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
              Join WirfonCloud Community
            </a>
          </div>
        </div>
      </section>

      <section id="how-we-work" className="section anchor-section">
        <div className="container">
          <h2 className="section-title">How We Work</h2>
          <div className="cards-grid">
            {(a.howWeWork ?? DEFAULT_ACADEMY_HOW_WE_WORK).map((item, i) => (
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

      <CustomSections sections={a.customSections} baseIndex={0} />

      {(a.testimonialVideos.length > 0 || a.testimonialQuotes.length > 0) && (
        <section id="testimonials" className="section section-alt anchor-section">
          <div className="container">
            <h2 className="section-title">What Our Students Say</h2>
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
          </div>
        </section>
      )}
    </>
  );
}
