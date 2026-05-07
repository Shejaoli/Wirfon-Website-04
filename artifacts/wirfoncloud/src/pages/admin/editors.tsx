import { type ReactNode, useRef } from "react";
import type {
  BlogPost,
  Course,
  Faq,
  GalleryAlbum,
  GalleryPhoto,
  HeroSlide,
  HomeIntro,
  LearningPath,
  Partner,
  Quote,
  Service,
  SiteContent,
  VideoSlide,
} from "@/lib/site";
import type { AboutSection } from "@/lib/site";
import { toSlug } from "@/lib/site";
import { ImageUpload } from "@/components/admin/ImageUpload";

/* -------------------------------------------------------------------------- */
/* Generic helpers                                                             */
/* -------------------------------------------------------------------------- */

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="admin-card">
      <header className="admin-card-header">
        <div>
          <h3>{title}</h3>
          {description && <p className="muted">{description}</p>}
        </div>
      </header>
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    </label>
  );
}

function RichArea({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(open: string, close: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = el.value.slice(s, e) || "text";
    const next = el.value.slice(0, s) + open + sel + close + el.value.slice(e);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(s + open.length, s + open.length + sel.length);
    }, 0);
  }

  function insertLink() {
    const url = prompt("Enter URL:", "https://");
    if (!url) return;
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = el.value.slice(s, e) || "link text";
    const tag = `<a href="${url}" target="_blank" rel="noopener noreferrer">${sel}</a>`;
    const next = el.value.slice(0, s) + tag + el.value.slice(e);
    onChange(next);
  }

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <div className="rich-toolbar">
        <button type="button" className="rich-btn" title="Bold" onClick={() => wrap("<strong>", "</strong>")}>
          <i className="fa-solid fa-bold" />
        </button>
        <button type="button" className="rich-btn" title="Italic" onClick={() => wrap("<em>", "</em>")}>
          <i className="fa-solid fa-italic" />
        </button>
        <button type="button" className="rich-btn" title="Insert link" onClick={insertLink}>
          <i className="fa-solid fa-link" />
        </button>
        <button type="button" className="rich-btn" title="List item" onClick={() => wrap("<li>", "</li>")}>
          <i className="fa-solid fa-list-ul" />
        </button>
        <span className="rich-toolbar-hint">Select text then click a button</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safe = /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : "#0199ef";
  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <div className="color-field-row">
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="color-swatch-input"
          title="Pick a colour"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0199ef"
          className="color-text-input"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function ListEditor<T>({
  items,
  onChange,
  newItem,
  renderItem,
  addLabel = "Add item",
}: {
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, idx: number, update: (next: T) => void) => ReactNode;
  addLabel?: string;
}) {
  function update(i: number, next: T) {
    const copy = items.slice();
    copy[i] = next;
    onChange(copy);
  }
  function remove(i: number) {
    if (!confirm("Delete this item?")) return;
    onChange(items.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }
  return (
    <div className="admin-list">
      {items.map((item, i) => (
        <div key={i} className="admin-list-item">
          <div className="admin-list-item-header">
            <span className="admin-list-index">#{i + 1}</span>
            <div className="admin-list-controls">
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                <i className="fa-solid fa-arrow-up" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                <i className="fa-solid fa-arrow-down" />
              </button>
              <button onClick={() => remove(i)} aria-label="Delete" className="danger">
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </div>
          <div className="admin-list-item-body">{renderItem(item, i, (next) => update(i, next))}</div>
        </div>
      ))}
      <button className="btn btn-outline btn-sm admin-add" onClick={() => onChange([...items, newItem()])}>
        <i className="fa-solid fa-plus" /> {addLabel}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Branding                                                                    */
/* -------------------------------------------------------------------------- */

export function BrandingEditor({
  branding,
  onChange,
}: {
  branding: SiteContent["branding"];
  onChange: (next: SiteContent["branding"]) => void;
}) {
  return (
    <Section
      title="Branding"
      description="Upload a logo to replace the WirfonCloud text logo in the navbar and footer. Leave empty to fall back to the text logo."
    >
      <ImageUpload
        label="Site logo"
        value={branding.logoUrl}
        onChange={(v) => onChange({ ...branding, logoUrl: v })}
        hint="Recommended: transparent PNG, around 400x100px."
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export function HeroEditor({
  hero,
  onChange,
}: {
  hero: HeroSlide[];
  onChange: (next: HeroSlide[]) => void;
}) {
  return (
    <Section title="Hero Slides" description="The rotating banner at the top of the home page. Auto-transitions every 5 seconds.">
      <ListEditor
        items={hero}
        onChange={onChange}
        addLabel="Add slide"
        newItem={() => ({
          title: "New slide",
          text: "",
          ctaHref: "/",
          ctaLabel: "Learn more",
          bgFrom: "#0199ef",
          bgTo: "#005fa3",
          backgroundImage: "",
        })}
        renderItem={(slide, _i, update) => (
          <>
            <Field label="Title" value={slide.title} onChange={(v) => update({ ...slide, title: v })} />
            <Area label="Text" value={slide.text} onChange={(v) => update({ ...slide, text: v })} rows={2} />
            <div className="admin-grid-2">
              <Field
                label="Button URL"
                value={slide.ctaHref}
                onChange={(v) => update({ ...slide, ctaHref: v })}
              />
              <Field
                label="Button label"
                value={slide.ctaLabel}
                onChange={(v) => update({ ...slide, ctaLabel: v })}
              />
            </div>
            <ImageUpload
              label="Background image (optional)"
              value={slide.backgroundImage || ""}
              onChange={(v) => update({ ...slide, backgroundImage: v })}
              hint="If set, overlaid with a dark tint so the text stays readable. Leave empty to use the gradient colors."
            />
            <div className="admin-grid-2">
              <ColorField
                label="Gradient color — from"
                value={slide.bgFrom}
                onChange={(v) => update({ ...slide, bgFrom: v })}
              />
              <ColorField
                label="Gradient color — to"
                value={slide.bgTo}
                onChange={(v) => update({ ...slide, bgTo: v })}
              />
            </div>
          </>
        )}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Home intro                                                                  */
/* -------------------------------------------------------------------------- */

export function HomeIntroEditor({
  items,
  onChange,
}: {
  items: HomeIntro[];
  onChange: (next: HomeIntro[]) => void;
}) {
  return (
    <Section title="Home intro sections" description="Two-column intro blocks below the hero slider.">
      <ListEditor
        items={items}
        onChange={onChange}
        addLabel="Add intro section"
        newItem={() => ({
          title: "",
          text: "",
          image: "",
          fallbackLabel: "",
          ctaHref: "/",
          ctaLabel: "Learn more",
          reverse: false,
        })}
        renderItem={(item, _i, update) => (
          <>
            <Field label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
            <Area label="Text" value={item.text} onChange={(v) => update({ ...item, text: v })} rows={3} />
            <ImageUpload
              label="Image"
              value={item.image}
              onChange={(v) => update({ ...item, image: v })}
            />
            <Field
              label="Caption / alt text"
              value={item.fallbackLabel}
              onChange={(v) => update({ ...item, fallbackLabel: v })}
            />
            <div className="admin-grid-2">
              <Field
                label="Button URL"
                value={item.ctaHref}
                onChange={(v) => update({ ...item, ctaHref: v })}
              />
              <Field
                label="Button label"
                value={item.ctaLabel}
                onChange={(v) => update({ ...item, ctaLabel: v })}
              />
            </div>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={item.reverse}
                onChange={(e) => update({ ...item, reverse: e.target.checked })}
              />
              <span>Image on the left (reverse order)</span>
            </label>
          </>
        )}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Home testimonials & partners                                                */
/* -------------------------------------------------------------------------- */

function VideoSlideFields({ slide, update }: { slide: VideoSlide; update: (s: VideoSlide) => void }) {
  return (
    <>
      <Field
        label="YouTube embed URL"
        value={slide.src}
        onChange={(v) => update({ ...slide, src: v })}
        placeholder="https://www.youtube.com/embed/VIDEO_ID"
      />
      <Field label="Iframe title" value={slide.title} onChange={(v) => update({ ...slide, title: v })} />
      <Field label="Caption" value={slide.caption} onChange={(v) => update({ ...slide, caption: v })} />
    </>
  );
}

export function HomeTestimonialsEditor({
  items,
  onChange,
}: {
  items: VideoSlide[];
  onChange: (next: VideoSlide[]) => void;
}) {
  return (
    <Section title="Home testimonials carousel" description="Video testimonials shown on the home page.">
      <ListEditor
        items={items}
        onChange={onChange}
        addLabel="Add video"
        newItem={() => ({ src: "", title: "Testimonial", caption: "" })}
        renderItem={(slide, _i, update) => <VideoSlideFields slide={slide} update={update} />}
      />
    </Section>
  );
}

export function PartnersEditor({
  items,
  onChange,
}: {
  items: Partner[];
  onChange: (next: Partner[]) => void;
}) {
  return (
    <Section
      title="Partners"
      description="Logos shown in the partners row on the home page. Up to 6 partners. Each partner link opens in a new tab."
    >
      <ListEditor
        items={items}
        onChange={(next) => onChange(next.slice(0, 6))}
        addLabel={items.length >= 6 ? "Maximum 6 partners reached" : "Add partner"}
        newItem={() => ({ name: "Partner", href: "#", logo: "" })}
        renderItem={(p, _i, update) => (
          <>
            <div className="admin-grid-2">
              <Field label="Name / label" value={p.name} onChange={(v) => update({ ...p, name: v })} />
              <Field label="Website URL" value={p.href} onChange={(v) => update({ ...p, href: v })} placeholder="https://example.com" />
            </div>
            <ImageUpload
              label="Logo (optional)"
              value={p.logo || ""}
              onChange={(v) => update({ ...p, logo: v })}
              hint="If empty, the dashed placeholder with the partner name is shown."
            />
          </>
        )}
      />
    </Section>
  );
}

export function HomeCtaEditor({
  cta,
  onChange,
}: {
  cta: SiteContent["homeCta"];
  onChange: (next: SiteContent["homeCta"]) => void;
}) {
  return (
    <Section title='"Ready to get started?" block' description="The bottom CTA block on the home page.">
      <Field label="Title" value={cta.title} onChange={(v) => onChange({ ...cta, title: v })} />
      <Area label="Text" value={cta.text} onChange={(v) => onChange({ ...cta, text: v })} rows={2} />
      <div className="admin-grid-2">
        <Field
          label="Primary button URL"
          value={cta.primaryHref}
          onChange={(v) => onChange({ ...cta, primaryHref: v })}
        />
        <Field
          label="Primary button label"
          value={cta.primaryLabel}
          onChange={(v) => onChange({ ...cta, primaryLabel: v })}
        />
      </div>
      <div className="admin-grid-2">
        <Field
          label="Secondary button URL"
          value={cta.secondaryHref}
          onChange={(v) => onChange({ ...cta, secondaryHref: v })}
        />
        <Field
          label="Secondary button label"
          value={cta.secondaryLabel}
          onChange={(v) => onChange({ ...cta, secondaryLabel: v })}
        />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export function AboutEditor({
  about,
  onChange,
}: {
  about: SiteContent["about"];
  onChange: (next: SiteContent["about"]) => void;
}) {
  return (
    <>
      <Section title="About page banner" description="The hero block at the top of the About page.">
        <ImageUpload
          label="Banner image"
          value={about.bannerImage}
          onChange={(v) => onChange({ ...about, bannerImage: v })}
        />
        <Field
          label="Banner title"
          value={about.bannerTitle}
          onChange={(v) => onChange({ ...about, bannerTitle: v })}
        />
        <Field
          label="Banner subtitle"
          value={about.bannerSubtitle}
          onChange={(v) => onChange({ ...about, bannerSubtitle: v })}
        />
      </Section>

      <Section
        title="About sections"
        description="Each section becomes an anchor on the page (uses the ID as the in-page anchor, e.g. /about#our-mission). Use **bold** and _italic_ in paragraphs."
      >
        <ListEditor
          items={about.sections}
          onChange={(sections) => onChange({ ...about, sections })}
          addLabel="Add section"
          newItem={() => ({ id: "new-section", title: "New section", paragraphs: [""] })}
          renderItem={(s, _i, update) => (
            <>
              <div className="admin-grid-2">
                <Field
                  label="Anchor ID"
                  value={s.id}
                  onChange={(v) => update({ ...s, id: v.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="our-mission"
                />
                <Field label="Title" value={s.title} onChange={(v) => update({ ...s, title: v })} />
              </div>
              <div className="admin-subgroup">
                <span className="admin-field-label">Paragraphs</span>
                {s.paragraphs.map((p, pi) => (
                  <div key={pi} className="admin-paragraph-row">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const copy = s.paragraphs.slice();
                        copy[pi] = e.target.value;
                        update({ ...s, paragraphs: copy });
                      }}
                    />
                    <button
                      className="admin-icon-btn danger"
                      onClick={() => {
                        if (!confirm("Delete this paragraph?")) return;
                        update({ ...s, paragraphs: s.paragraphs.filter((_, j) => j !== pi) });
                      }}
                      aria-label="Delete paragraph"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => update({ ...s, paragraphs: [...s.paragraphs, ""] })}
                >
                  <i className="fa-solid fa-plus" /> Add paragraph
                </button>
              </div>
            </>
          )}
        />
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Academy                                                                     */
/* -------------------------------------------------------------------------- */

function CourseFields({ course, update }: { course: Course; update: (c: Course) => void }) {
  return (
    <>
      <Field label="Title" value={course.title} onChange={(v) => update({ ...course, title: v })} />
      <Area
        label="Description"
        value={course.description}
        onChange={(v) => update({ ...course, description: v })}
        rows={3}
      />
      <div className="admin-grid-2">
        <Field
          label="Preview URL"
          value={course.previewUrl || ""}
          onChange={(v) => update({ ...course, previewUrl: v })}
          placeholder="https://example.com/preview"
        />
        <Field
          label="Sign Up URL"
          value={course.signupUrl || ""}
          onChange={(v) => update({ ...course, signupUrl: v })}
          placeholder="https://example.com/signup (or leave empty to email contact)"
        />
      </div>
    </>
  );
}

export function AcademyEditor({
  academy,
  onChange,
}: {
  academy: SiteContent["academy"];
  onChange: (next: SiteContent["academy"]) => void;
}) {
  return (
    <>
      <Section title="Academy banner">
        <ImageUpload
          label="Banner image"
          value={academy.bannerImage}
          onChange={(v) => onChange({ ...academy, bannerImage: v })}
        />
        <Field
          label="Banner title"
          value={academy.bannerTitle}
          onChange={(v) => onChange({ ...academy, bannerTitle: v })}
        />
        <Field
          label="Banner subtitle"
          value={academy.bannerSubtitle}
          onChange={(v) => onChange({ ...academy, bannerSubtitle: v })}
        />
      </Section>

      <Section title="Fundamentals of IT courses">
        <ListEditor
          items={academy.fundamentals}
          onChange={(fundamentals) => onChange({ ...academy, fundamentals })}
          addLabel="Add fundamentals course"
          newItem={() => ({ title: "New course", description: "" })}
          renderItem={(c, _i, update) => <CourseFields course={c} update={update} />}
        />
      </Section>

      <Section title="Intermediate to Advanced courses">
        <ListEditor
          items={academy.intermediate}
          onChange={(intermediate) => onChange({ ...academy, intermediate })}
          addLabel="Add advanced course"
          newItem={() => ({ title: "New course", description: "" })}
          renderItem={(c, _i, update) => <CourseFields course={c} update={update} />}
        />
      </Section>

      <Section
        title="Learning paths"
        description="Multi-course tracks. The subject becomes the email subject when someone registers interest."
      >
        <ListEditor
          items={academy.learningPaths}
          onChange={(learningPaths) => onChange({ ...academy, learningPaths })}
          addLabel="Add learning path"
          newItem={() => ({
            title: "New path",
            description: "",
            subject: "Interest in New Path",
          })}
          renderItem={(p, _i, update) => (
            <>
              <Field label="Title" value={p.title} onChange={(v) => update({ ...p, title: v })} />
              <Area
                label="Description"
                value={p.description}
                onChange={(v) => update({ ...p, description: v })}
                rows={3}
              />
              <Field
                label="Email subject (when registering interest)"
                value={p.subject}
                onChange={(v) => update({ ...p, subject: v })}
              />
            </>
          )}
        />
      </Section>

      <Section title="Discord community">
        <Field
          label="Discord invite URL"
          value={academy.discordLink}
          onChange={(v) => onChange({ ...academy, discordLink: v })}
        />
      </Section>

      <Section title="Academy testimonial videos">
        <ListEditor
          items={academy.testimonialVideos}
          onChange={(testimonialVideos) => onChange({ ...academy, testimonialVideos })}
          addLabel="Add video"
          newItem={() => ({ src: "", title: "Testimonial", caption: "" })}
          renderItem={(v, _i, update) => <VideoSlideFields slide={v} update={update} />}
        />
      </Section>

      <Section title="Academy testimonial quotes">
        <ListEditor
          items={academy.testimonialQuotes}
          onChange={(testimonialQuotes) => onChange({ ...academy, testimonialQuotes })}
          addLabel="Add quote"
          newItem={() => ({ text: "", author: "Alumni Name", photo: "" })}
          renderItem={(q, _i, update) => (
            <>
              <Area
                label="Quote text (no quote marks needed)"
                value={q.text}
                onChange={(v) => update({ ...q, text: v })}
                rows={3}
              />
              <div className="admin-grid-2">
                <Field label="Author name" value={q.author} onChange={(v) => update({ ...q, author: v })} />
              </div>
              <ImageUpload
                label="Author photo (optional — shows as avatar)"
                value={q.photo ?? ""}
                onChange={(v) => update({ ...q, photo: v })}
              />
            </>
          )}
        />
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Consultancy                                                                 */
/* -------------------------------------------------------------------------- */

export function ConsultancyEditor({
  consultancy,
  onChange,
}: {
  consultancy: SiteContent["consultancy"];
  onChange: (next: SiteContent["consultancy"]) => void;
}) {
  return (
    <>
      <Section title="Consultancy intro">
        <ImageUpload
          label="Image"
          value={consultancy.image}
          onChange={(v) => onChange({ ...consultancy, image: v })}
        />
        <Field
          label="Caption / alt text"
          value={consultancy.fallbackLabel}
          onChange={(v) => onChange({ ...consultancy, fallbackLabel: v })}
        />
        <Field label="Title" value={consultancy.title} onChange={(v) => onChange({ ...consultancy, title: v })} />
        <Area
          label="Description"
          value={consultancy.text}
          onChange={(v) => onChange({ ...consultancy, text: v })}
          rows={4}
        />
        <div className="admin-grid-2">
          <Field
            label="Button URL"
            value={consultancy.ctaHref}
            onChange={(v) => onChange({ ...consultancy, ctaHref: v })}
          />
          <Field
            label="Button label"
            value={consultancy.ctaLabel}
            onChange={(v) => onChange({ ...consultancy, ctaLabel: v })}
          />
        </div>
      </Section>

      <Section
        title="Consultancy services"
        description="Icon names use Font Awesome, e.g. fa-cloud-arrow-up, fa-shield-halved."
      >
        <ListEditor
          items={consultancy.services}
          onChange={(services) => onChange({ ...consultancy, services })}
          addLabel="Add service"
          newItem={() => ({ icon: "fa-cloud", title: "New service", text: "" })}
          renderItem={(s, _i, update) => (
            <>
              <Field
                label="Font Awesome icon (without 'fa-solid')"
                value={s.icon}
                onChange={(v) => update({ ...s, icon: v })}
                placeholder="fa-cloud-arrow-up"
              />
              <Field label="Title" value={s.title} onChange={(v) => update({ ...s, title: v })} />
              <Area label="Description" value={s.text} onChange={(v) => update({ ...s, text: v })} rows={2} />
            </>
          )}
        />
      </Section>

      <Section title="Consultancy testimonial videos">
        <ListEditor
          items={consultancy.testimonials}
          onChange={(testimonials) => onChange({ ...consultancy, testimonials })}
          addLabel="Add video"
          newItem={() => ({ src: "", title: "Testimonial", caption: "" })}
          renderItem={(v, _i, update) => <VideoSlideFields slide={v} update={update} />}
        />
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Blog                                                                        */
/* -------------------------------------------------------------------------- */

export function BlogEditor({
  blog,
  onChange,
}: {
  blog: SiteContent["blog"];
  onChange: (next: SiteContent["blog"]) => void;
}) {
  return (
    <>
      <Section title="Newsletter section">
        <Field label="Title" value={blog.title} onChange={(v) => onChange({ ...blog, title: v })} />
        <Area label="Text" value={blog.text} onChange={(v) => onChange({ ...blog, text: v })} rows={2} />
      </Section>

      <Section title="Blog posts">
        <ListEditor
          items={blog.posts}
          onChange={(posts) => onChange({ ...blog, posts })}
          addLabel="Add post"
          newItem={() => ({
            date: "",
            title: "New post",
            text: "",
            image: "https://picsum.photos/seed/new/600/300",
          })}
          renderItem={(p, _i, update) => {
            const autoSlug = toSlug(p.title);
            return (
              <>
                <div className="admin-grid-2">
                  <Field
                    label="Date label"
                    value={p.date}
                    onChange={(v) => update({ ...p, date: v })}
                    placeholder="August 12, 2025"
                  />
                  <Field
                    label="Title"
                    value={p.title}
                    onChange={(v) => {
                      const newSlug = !p.slug || p.slug === toSlug(p.title) ? toSlug(v) : p.slug;
                      update({ ...p, title: v, slug: newSlug });
                    }}
                  />
                </div>
                <label className="admin-field">
                  <span className="admin-field-label">URL slug (auto-generated — edit only if needed)</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--grey-500)", fontSize: "0.88rem", whiteSpace: "nowrap" }}>/blog/</span>
                    <input
                      type="text"
                      value={p.slug ?? autoSlug}
                      onChange={(v) => update({ ...p, slug: v.target.value })}
                      placeholder={autoSlug}
                      style={{ flex: 1 }}
                    />
                  </div>
                </label>
                <Area
                  label="Excerpt (shown on the card)"
                  value={p.text}
                  onChange={(v) => update({ ...p, text: v })}
                  rows={2}
                  placeholder="One or two sentences summarising the post…"
                />
                <RichArea
                  label="Full article body"
                  value={p.body ?? ""}
                  onChange={(v) => update({ ...p, body: v })}
                  rows={10}
                  placeholder="Write the full post here. Use the toolbar to format text — bold, italic, links and list items are supported."
                />
                <Field
                  label="External link (optional — if set, 'Read more' links here instead of the body)"
                  value={p.link ?? ""}
                  onChange={(v) => update({ ...p, link: v })}
                  placeholder="https://linkedin.com/posts/…"
                />
                <ImageUpload
                  label="Thumbnail"
                  value={p.image}
                  onChange={(v) => update({ ...p, image: v })}
                />
              </>
            );
          }}
        />
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export function FaqsEditor({
  items,
  onChange,
}: {
  items: Faq[];
  onChange: (next: Faq[]) => void;
}) {
  return (
    <Section title="Frequently asked questions">
      <ListEditor
        items={items}
        onChange={onChange}
        addLabel="Add question"
        newItem={() => ({ q: "New question?", a: "" })}
        renderItem={(f, _i, update) => (
          <>
            <Field label="Question" value={f.q} onChange={(v) => update({ ...f, q: v })} />
            <Area label="Answer" value={f.a} onChange={(v) => update({ ...f, a: v })} rows={4} />
          </>
        )}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                    */
/* -------------------------------------------------------------------------- */

export function SocialEditor({
  social,
  onChange,
}: {
  social: SiteContent["social"];
  onChange: (next: SiteContent["social"]) => void;
}) {
  return (
    <Section title="Social links" description="All social links appear in the site footer and are used across the site.">
      <Field label="LinkedIn URL" value={social.linkedin} onChange={(v) => onChange({ ...social, linkedin: v })} />
      <Field label="Twitter / X URL" value={social.twitter} onChange={(v) => onChange({ ...social, twitter: v })} />
      <Field label="Facebook URL" value={social.facebook} onChange={(v) => onChange({ ...social, facebook: v })} />
      <Field label="YouTube URL" value={social.youtube} onChange={(v) => onChange({ ...social, youtube: v })} />
      <Field
        label="WhatsApp link (chat float button)"
        value={social.whatsapp}
        onChange={(v) => onChange({ ...social, whatsapp: v })}
        placeholder="https://wa.me/1234567890"
      />
      <Field
        label="Discord invite link (shows in footer + Academy page)"
        value={social.discord ?? ""}
        onChange={(v) => onChange({ ...social, discord: v || undefined })}
        placeholder="https://discord.gg/your-invite-code"
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery                                                                     */
/* -------------------------------------------------------------------------- */

export function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: SiteContent["gallery"];
  onChange: (next: SiteContent["gallery"]) => void;
}) {
  return (
    <>
      <Section title="Gallery page banner">
        <Field
          label="Banner title"
          value={gallery.bannerTitle}
          onChange={(v) => onChange({ ...gallery, bannerTitle: v })}
        />
        <Area
          label="Banner subtitle"
          value={gallery.bannerSubtitle}
          onChange={(v) => onChange({ ...gallery, bannerSubtitle: v })}
          rows={2}
        />
      </Section>

      <Section
        title="Albums"
        description="Each album groups photos together. Upload a cover image and add photos with captions."
      >
        <ListEditor
          items={gallery.albums}
          onChange={(albums) => onChange({ ...gallery, albums })}
          addLabel="Add album"
          newItem={(): GalleryAlbum => ({
            id: `album-${Date.now()}`,
            title: "New Album",
            dateLabel: "",
            cover: "",
            photos: [],
          })}
          renderItem={(album, _i, updateAlbum) => (
            <>
              <div className="admin-grid-2">
                <Field
                  label="Album title"
                  value={album.title}
                  onChange={(v) => updateAlbum({ ...album, title: v })}
                  placeholder="WirfonCloud Summit 2024"
                />
                <Field
                  label="Date label"
                  value={album.dateLabel}
                  onChange={(v) => updateAlbum({ ...album, dateLabel: v })}
                  placeholder="June 2024"
                />
              </div>
              <ImageUpload
                label="Cover image (shown in album header)"
                value={album.cover ?? ""}
                onChange={(v) => updateAlbum({ ...album, cover: v })}
                hint="First photo is used as cover if none set."
              />
              <div className="admin-subgroup">
                <span className="admin-field-label" style={{ marginBottom: "0.5rem", display: "block" }}>
                  Photos ({album.photos.length})
                </span>
                <ListEditor
                  items={album.photos}
                  onChange={(photos) => updateAlbum({ ...album, photos })}
                  addLabel="Add photo"
                  newItem={(): GalleryPhoto => ({ src: "", alt: "", caption: "" })}
                  renderItem={(photo, _pi, updatePhoto) => (
                    <>
                      <ImageUpload
                        label="Photo"
                        value={photo.src}
                        onChange={(v) => updatePhoto({ ...photo, src: v })}
                      />
                      <div className="admin-grid-2">
                        <Field
                          label="Caption"
                          value={photo.caption}
                          onChange={(v) => updatePhoto({ ...photo, caption: v })}
                          placeholder="Hands-on cloud workshop"
                        />
                        <Field
                          label="Alt text (accessibility)"
                          value={photo.alt}
                          onChange={(v) => updatePhoto({ ...photo, alt: v })}
                          placeholder="Attendees at the summit"
                        />
                      </div>
                    </>
                  )}
                />
              </div>
            </>
          )}
        />
      </Section>
    </>
  );
}

export function ContactEditor({
  contact,
  footer,
  onChange,
}: {
  contact: SiteContent["contact"];
  footer: SiteContent["footer"];
  onChange: (contact: SiteContent["contact"], footer: SiteContent["footer"]) => void;
}) {
  return (
    <Section title="Contact & footer">
      <Field
        label="Contact email"
        type="email"
        value={contact.email}
        onChange={(v) => onChange({ ...contact, email: v }, footer)}
      />
      <NumField
        label="Footer copyright year"
        value={footer.copyrightYear}
        onChange={(v) => onChange(contact, { ...footer, copyrightYear: v })}
      />
    </Section>
  );
}
