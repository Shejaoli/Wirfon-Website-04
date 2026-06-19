import { type ReactNode, useRef, useEffect, useState, type DragEvent, type ChangeEvent } from "react";
import { STATIC_ALBUMS } from "@/lib/staticAlbums";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapLink from "@tiptap/extension-link";
import type {
  BlogPost,
  CoreValue,
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
import { adminUploadImage } from "@/lib/api";

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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapLink.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    const current = editor.getHTML();
    const isEmpty = (html: string) => !html || html === "<p></p>";
    if (isEmpty(incoming) && isEmpty(current)) return;
    if (incoming !== current) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  const setLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <div className="tiptap-wrap">
        <div className="rich-toolbar">
          <button type="button" className={`rich-btn${editor?.isActive("bold") ? " active" : ""}`} title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()}>
            <i className="fa-solid fa-bold" />
          </button>
          <button type="button" className={`rich-btn${editor?.isActive("italic") ? " active" : ""}`} title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <i className="fa-solid fa-italic" />
          </button>
          <button type="button" className={`rich-btn${editor?.isActive("heading", { level: 2 }) ? " active" : ""}`} title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
            <span>H2</span>
          </button>
          <button type="button" className={`rich-btn${editor?.isActive("heading", { level: 3 }) ? " active" : ""}`} title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
            <span>H3</span>
          </button>
          <button type="button" className={`rich-btn${editor?.isActive("bulletList") ? " active" : ""}`} title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <i className="fa-solid fa-list-ul" />
          </button>
          <button type="button" className={`rich-btn${editor?.isActive("orderedList") ? " active" : ""}`} title="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <i className="fa-solid fa-list-ol" />
          </button>
          <button type="button" className={`rich-btn${editor?.isActive("link") ? " active" : ""}`} title="Insert link" onClick={setLink}>
            <i className="fa-solid fa-link" />
          </button>
          <button type="button" className="rich-btn" title="Remove link" onClick={() => editor?.chain().focus().unsetLink().run()} disabled={!editor?.isActive("link")}>
            <i className="fa-solid fa-link-slash" />
          </button>
          <div className="rich-toolbar-sep" />
          <button type="button" className="rich-btn" title="Undo" onClick={() => editor?.chain().focus().undo().run()}>
            <i className="fa-solid fa-rotate-left" />
          </button>
          <button type="button" className="rich-btn" title="Redo" onClick={() => editor?.chain().focus().redo().run()}>
            <i className="fa-solid fa-rotate-right" />
          </button>
          {placeholder && <span className="rich-toolbar-hint">{placeholder}</span>}
        </div>
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
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

export function BookingLinkEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Section
      title="Booking link"
      description='The Google Calendar (or other scheduling) URL used by all "Book a call" buttons across the site. Paste the full URL here — it will open in a new tab when clicked.'
    >
      <Field
        label="Booking URL"
        value={value}
        onChange={onChange}
        placeholder="https://calendar.app.google/…"
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
/* Home Approach                                                               */
/* -------------------------------------------------------------------------- */

export function HomeApproachEditor({
  approach,
  onChange,
}: {
  approach: SiteContent["homeApproach"];
  onChange: (next: SiteContent["homeApproach"]) => void;
}) {
  return (
    <Section
      title='"Our Approach" card'
      description='Appears on the homepage in the "Who We Are &amp; What We Stand For" section.'
    >
      <Field label="Title" value={approach.title} onChange={(v) => onChange({ ...approach, title: v })} />
      <Area label="Description" value={approach.text} onChange={(v) => onChange({ ...approach, text: v })} rows={4} />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Home Founder                                                                */
/* -------------------------------------------------------------------------- */

export function HomeFounderEditor({
  founder,
  onChange,
}: {
  founder: NonNullable<SiteContent["homeFounder"]>;
  onChange: (next: NonNullable<SiteContent["homeFounder"]>) => void;
}) {
  return (
    <Section
      title='"A Word from Our Founder" section'
      description="Appears on the homepage below the Mission / Vision / Approach cards."
    >
      <Area
        label="Quote text (no quotation marks needed)"
        value={founder.quote}
        onChange={(v) => onChange({ ...founder, quote: v })}
        rows={4}
      />
      <div className="admin-grid-2">
        <Field
          label="Founder name / role line 1"
          value={founder.founderName}
          onChange={(v) => onChange({ ...founder, founderName: v })}
          placeholder="Founder & CEO, WirfonCloud"
        />
        <Field
          label="Organisation / role line 2"
          value={founder.founderTitle}
          onChange={(v) => onChange({ ...founder, founderTitle: v })}
          placeholder="Wirfon Group Investments Ltd"
        />
      </div>
      <ImageUpload
        label="Founder photo (optional — falls back to default photo)"
        value={founder.founderPhoto ?? ""}
        onChange={(v) => onChange({ ...founder, founderPhoto: v })}
        hint="Portrait photo, ideally square or 4:3."
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Core Values                                                                 */
/* -------------------------------------------------------------------------- */

export function CoreValuesEditor({
  coreValues,
  onChange,
}: {
  coreValues: NonNullable<SiteContent["coreValues"]>;
  onChange: (next: NonNullable<SiteContent["coreValues"]>) => void;
}) {
  return (
    <Section
      title='"Our Core Values" section'
      description="Appears on the homepage between the Mission/Vision cards and the Founder quote. Each card has a bold number, a title and a description."
    >
      <Field
        label="Section heading"
        value={coreValues.heading}
        onChange={(v) => onChange({ ...coreValues, heading: v })}
        placeholder="Our Core Values"
      />
      <ListEditor
        items={coreValues.values}
        onChange={(values) => onChange({ ...coreValues, values })}
        addLabel="Add value"
        newItem={(): CoreValue => ({
          number: String((coreValues.values.length + 1)).padStart(2, "0"),
          title: "New Value",
          description: "",
        })}
        renderItem={(v, _i, update) => (
          <>
            <div className="admin-grid-2">
              <Field
                label="Number label (e.g. 01)"
                value={v.number}
                onChange={(val) => update({ ...v, number: val })}
                placeholder="01"
              />
              <Field
                label="Title"
                value={v.title}
                onChange={(val) => update({ ...v, title: val })}
              />
            </div>
            <Area
              label="Description"
              value={v.description}
              onChange={(val) => update({ ...v, description: val })}
              rows={3}
            />
          </>
        )}
      />
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

const DEFAULT_ACADEMY_HOW_WE_WORK_STEPS = [
  { icon: "fa-magnifying-glass", step: "01", title: "Assess Your Level", text: "We start with a free skills quiz and consultation to find exactly where you are and map the fastest path to your cloud career goal." },
  { icon: "fa-graduation-cap",   step: "02", title: "Structured Learning", text: "Follow a proven curriculum — from Linux and Networking foundations through to Cloud and AI — with live sessions, labs and real-world projects." },
  { icon: "fa-people-group",     step: "03", title: "Community & Mentorship", text: "Join our Discord community and get direct access to instructors and alumni who have walked the same path and made it." },
  { icon: "fa-briefcase",        step: "04", title: "Career Outcomes", text: "We stay with you through job applications, interview prep and onboarding — because our success is measured by the roles our graduates land." },
];

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
        <Field
          label="Section heading"
          value={academy.fundamentalsHeading ?? "Cloud Careers start here - not at AWS."}
          onChange={(v) => onChange({ ...academy, fundamentalsHeading: v })}
          placeholder="Cloud Careers start here - not at AWS."
        />
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
        title="Career paths"
        description="Multi-course tracks. The subject becomes the email subject when someone registers interest."
      >
        <ListEditor
          items={academy.learningPaths}
          onChange={(learningPaths) => onChange({ ...academy, learningPaths })}
          addLabel="Add career path"
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

      <Section
        title="How We Work steps (Academy)"
        description="The steps shown in the 'How We Work' section on the Academy page. Each step has a number label, a Font Awesome icon, a title and a description."
      >
        <ListEditor
          items={academy.howWeWork ?? DEFAULT_ACADEMY_HOW_WE_WORK_STEPS}
          onChange={(howWeWork) => onChange({ ...academy, howWeWork })}
          addLabel="Add step"
          newItem={() => ({
            icon: "fa-circle-check",
            step: String(((academy.howWeWork ?? DEFAULT_ACADEMY_HOW_WE_WORK_STEPS).length + 1)).padStart(2, "0"),
            title: "New step",
            text: "",
          })}
          renderItem={(s, _i, update) => (
            <>
              <div className="admin-grid-2">
                <Field
                  label="Step number label"
                  value={s.step}
                  onChange={(v) => update({ ...s, step: v })}
                  placeholder="01"
                />
                <Field
                  label="Font Awesome icon (without 'fa-solid')"
                  value={s.icon}
                  onChange={(v) => update({ ...s, icon: v })}
                  placeholder="fa-graduation-cap"
                />
              </div>
              <Field label="Title" value={s.title} onChange={(v) => update({ ...s, title: v })} />
              <Area label="Description" value={s.text} onChange={(v) => update({ ...s, text: v })} rows={2} />
            </>
          )}
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

const DEFAULT_HOW_WE_WORK_STEPS = [
  { icon: "fa-magnifying-glass", step: "01", title: "Discovery",  text: "We start by understanding your business, infrastructure, and goals through a free consultation." },
  { icon: "fa-map",              step: "02", title: "Strategy",   text: "Our experts design a tailored cloud roadmap aligned to your budget and timeline." },
  { icon: "fa-rocket",           step: "03", title: "Delivery",   text: "We implement solutions with minimal disruption, maintaining full transparency throughout." },
  { icon: "fa-headset",          step: "04", title: "Support",    text: "Post-project support and knowledge transfer to ensure your team is confident and independent." },
];

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

      <Section title="AI Consultancy section" description="The AI Consultancy block that appears just before 'Our Services'. Image and text are editable here.">
        <ImageUpload
          label="Image"
          value={consultancy.aiConsultancy?.image ?? ""}
          onChange={(v) => onChange({ ...consultancy, aiConsultancy: { ...consultancy.aiConsultancy!, image: v } })}
          hint="Upload a photo for the AI Consultancy section. A placeholder is shown if empty."
        />
        <Field
          label="Caption / alt text"
          value={consultancy.aiConsultancy?.fallbackLabel ?? ""}
          onChange={(v) => onChange({ ...consultancy, aiConsultancy: { ...consultancy.aiConsultancy!, fallbackLabel: v } })}
        />
        <Field
          label="Title"
          value={consultancy.aiConsultancy?.title ?? "AI Consultancy"}
          onChange={(v) => onChange({ ...consultancy, aiConsultancy: { ...consultancy.aiConsultancy!, title: v } })}
        />
        <Area
          label="Description"
          value={consultancy.aiConsultancy?.text ?? ""}
          onChange={(v) => onChange({ ...consultancy, aiConsultancy: { ...consultancy.aiConsultancy!, text: v } })}
          rows={4}
        />
        <div className="admin-grid-2">
          <Field
            label="Button URL"
            value={consultancy.aiConsultancy?.ctaHref ?? "/about#contact"}
            onChange={(v) => onChange({ ...consultancy, aiConsultancy: { ...consultancy.aiConsultancy!, ctaHref: v } })}
          />
          <Field
            label="Button label"
            value={consultancy.aiConsultancy?.ctaLabel ?? "Talk to an Expert"}
            onChange={(v) => onChange({ ...consultancy, aiConsultancy: { ...consultancy.aiConsultancy!, ctaLabel: v } })}
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

      <Section
        title="How We Work steps"
        description="The four steps shown in the 'How We Work' section. Each step has a number label (e.g. 01), a Font Awesome icon, a title and a description."
      >
        <ListEditor
          items={consultancy.howWeWork ?? DEFAULT_HOW_WE_WORK_STEPS}
          onChange={(howWeWork) => onChange({ ...consultancy, howWeWork })}
          addLabel="Add step"
          newItem={() => ({
            icon: "fa-circle-check",
            step: String(((consultancy.howWeWork ?? DEFAULT_HOW_WE_WORK_STEPS).length + 1)).padStart(2, "0"),
            title: "New step",
            text: "",
          })}
          renderItem={(s, _i, update) => (
            <>
              <div className="admin-grid-2">
                <Field
                  label="Step number label"
                  value={s.step}
                  onChange={(v) => update({ ...s, step: v })}
                  placeholder="01"
                />
                <Field
                  label="Font Awesome icon (without 'fa-solid')"
                  value={s.icon}
                  onChange={(v) => update({ ...s, icon: v })}
                  placeholder="fa-magnifying-glass"
                />
              </div>
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
/* Album photo manager (multi-file drag-and-drop)                             */
/* -------------------------------------------------------------------------- */

function AlbumPhotoManager({
  photos,
  onChange,
}: {
  photos: GalleryPhoto[];
  onChange: (photos: GalleryPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  async function uploadFiles(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: images.length });
    setUploadErrors([]);
    const newPhotos: GalleryPhoto[] = [];
    const errs: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const result = await adminUploadImage(images[i]);
      if (result.url) {
        newPhotos.push({ src: result.url, alt: "", caption: "" });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      } else {
        errs.push(`${images[i].name}: ${result.error ?? "Upload failed"}`);
      }
    }
    onChange([...photos, ...newPhotos]);
    setUploadErrors(errs);
    setUploading(false);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    void uploadFiles(Array.from(e.dataTransfer.files));
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    void uploadFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    onChange(photos.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
    else if (editIdx !== null && editIdx > idx) setEditIdx(editIdx - 1);
  }

  function movePhoto(from: number, to: number) {
    const next = photos.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  function updatePhoto(idx: number, updated: GalleryPhoto) {
    const next = photos.slice();
    next[idx] = updated;
    onChange(next);
  }

  return (
    <div className="album-photo-manager">
      <div
        className={"album-drop-zone" + (dragging ? " dragging" : "") + (uploading ? " busy" : "")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => { if (!uploading) inputRef.current?.click(); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !uploading) { e.preventDefault(); inputRef.current?.click(); } }}
      >
        {uploading ? (
          <div className="album-drop-zone-inner">
            <div className="admin-spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
            <p style={{ fontWeight: 600 }}>Uploading {progress.done} of {progress.total}…</p>
            <p className="muted" style={{ fontSize: "0.8rem" }}>Please wait</p>
          </div>
        ) : (
          <div className="album-drop-zone-inner">
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "1.75rem", color: "var(--brand)" }} />
            <p style={{ fontWeight: 600 }}>Drop photos here <span style={{ fontWeight: 400 }}>or click to select</span></p>
            <p className="muted" style={{ fontSize: "0.78rem" }}>PNG, JPG, WEBP · up to 10 MB each · select multiple files at once</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onPick} />

      {uploadErrors.length > 0 && (
        <div style={{ marginTop: "0.5rem" }}>
          {uploadErrors.map((e, i) => (
            <p key={i} style={{ fontSize: "0.8rem", color: "#dc2626", marginBottom: "0.2rem" }}>
              <i className="fa-solid fa-triangle-exclamation" /> {e}
            </p>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="album-photo-grid">
          {photos.map((photo, idx) => (
            <div key={idx} className={"album-photo-tile" + (editIdx === idx ? " editing" : "")}>
              <div className="album-photo-tile-img-wrap">
                <img src={photo.src} alt={photo.alt || ""} loading="lazy" />
                <div className="album-photo-tile-overlay">
                  <button type="button" title="Edit caption & alt text" className="album-tile-btn"
                    onClick={() => setEditIdx(editIdx === idx ? null : idx)}>
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button type="button" title="Move left" className="album-tile-btn"
                    disabled={idx === 0} onClick={() => movePhoto(idx, idx - 1)}>
                    <i className="fa-solid fa-arrow-left" />
                  </button>
                  <button type="button" title="Move right" className="album-tile-btn"
                    disabled={idx === photos.length - 1} onClick={() => movePhoto(idx, idx + 1)}>
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                  <button type="button" title="Remove photo" className="album-tile-btn danger"
                    onClick={() => { if (confirm("Remove this photo?")) removePhoto(idx); }}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
              <div className="album-photo-tile-caption">
                {editIdx === idx ? (
                  <div className="album-photo-tile-fields">
                    <Field label="Caption" value={photo.caption}
                      onChange={(v) => updatePhoto(idx, { ...photo, caption: v })}
                      placeholder="e.g. Hands-on workshop session" />
                    <Field label="Alt text (screen readers)" value={photo.alt}
                      onChange={(v) => updatePhoto(idx, { ...photo, alt: v })}
                      placeholder="e.g. Attendees working on laptops" />
                    <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: "0.25rem" }}
                      onClick={() => setEditIdx(null)}>
                      Done
                    </button>
                  </div>
                ) : (
                  <span className="album-photo-tile-caption-text">
                    {photo.caption || <em style={{ color: "var(--grey-400)" }}>No caption</em>}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <p className="muted" style={{ textAlign: "center", fontSize: "0.84rem", padding: "0.75rem 0 0" }}>
          No photos yet — drop some above or click to select.
        </p>
      )}
    </div>
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function addAlbum() {
    const newAlbum: GalleryAlbum = {
      id: `album-${Date.now()}`,
      title: "New Album",
      dateLabel: "",
      cover: "",
      photos: [],
    };
    onChange({ ...gallery, albums: [...gallery.albums, newAlbum] });
    setExpandedId(newAlbum.id);
  }

  function updateAlbum(idx: number, updated: GalleryAlbum) {
    const albums = gallery.albums.slice();
    albums[idx] = updated;
    onChange({ ...gallery, albums });
  }

  function deleteAlbum(idx: number, title: string) {
    if (!confirm(`Delete album "${title}"? This cannot be undone.`)) return;
    const albums = gallery.albums.filter((_, i) => i !== idx);
    onChange({ ...gallery, albums });
    setExpandedId(null);
  }

  function moveAlbum(from: number, to: number) {
    const albums = gallery.albums.slice();
    const [item] = albums.splice(from, 1);
    albums.splice(to, 0, item);
    onChange({ ...gallery, albums });
  }

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
        description="Each album groups photos. Add real albums here — once saved, they replace the placeholder photos shown on the public gallery page."
      >
        {gallery.albums.length === 0 && (
          <div className="gallery-import-notice">
            <div className="gallery-import-notice-header">
              <i className="fa-solid fa-circle-info" style={{ color: "var(--brand)", fontSize: "1.1rem", flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
                  Your gallery has {STATIC_ALBUMS.length} existing album{STATIC_ALBUMS.length !== 1 ? "s" : ""} visible on the public site
                </p>
                <p className="muted" style={{ fontSize: "0.85rem" }}>
                  These albums are currently hardcoded and cannot be edited or deleted from here. Click <strong>Import albums into database</strong> to bring them under your control — then you can edit titles, dates, photos, and delete them freely.
                </p>
              </div>
            </div>
            <div className="gallery-import-preview">
              {STATIC_ALBUMS.map((a) => (
                <div key={a.id} className="gallery-import-preview-card">
                  {a.cover && (
                    <div className="gallery-import-preview-thumb" style={{ backgroundImage: `url(${a.cover})` }} />
                  )}
                  <div className="gallery-import-preview-info">
                    <strong>{a.title}</strong>
                    <span className="muted" style={{ fontSize: "0.78rem" }}>
                      {a.dateLabel} · {a.photos.length} photo{a.photos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "0.75rem" }}
              onClick={() => {
                const seeded = STATIC_ALBUMS.map((a) => ({ ...a, id: a.id || `album-${Date.now()}-${Math.random()}` }));
                onChange({ ...gallery, albums: seeded });
              }}
            >
              <i className="fa-solid fa-file-import" /> Import albums into database
            </button>
          </div>
        )}

        <div className="gallery-album-list">
          {gallery.albums.map((album, idx) => {
            const isExpanded = expandedId === album.id;
            return (
              <div key={album.id} className={"gallery-album-card" + (isExpanded ? " expanded" : "")}>
                <div className="gallery-album-card-header">
                  {album.cover ? (
                    <div
                      className="gallery-album-thumb"
                      style={{ backgroundImage: `url(${album.cover})` }}
                    />
                  ) : (
                    <div className="gallery-album-thumb gallery-album-thumb--empty">
                      <i className="fa-solid fa-image" />
                    </div>
                  )}
                  <div className="gallery-album-info">
                    <strong>{album.title || "Untitled album"}</strong>
                    <span className="muted" style={{ fontSize: "0.8rem" }}>
                      {album.dateLabel || "No date"} &nbsp;·&nbsp; {album.photos.length} photo{album.photos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="gallery-album-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={idx === 0}
                      onClick={() => moveAlbum(idx, idx - 1)}
                      title="Move up"
                    >
                      <i className="fa-solid fa-arrow-up" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={idx === gallery.albums.length - 1}
                      onClick={() => moveAlbum(idx, idx + 1)}
                      title="Move down"
                    >
                      <i className="fa-solid fa-arrow-down" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setExpandedId(isExpanded ? null : album.id)}
                    >
                      <i className={`fa-solid ${isExpanded ? "fa-chevron-up" : "fa-pen-to-square"}`} />
                      {isExpanded ? " Collapse" : " Edit"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ background: "var(--error-100, #fef2f2)", color: "var(--error-600, #dc2626)", border: "1px solid var(--error-200, #fecaca)" }}
                      onClick={() => deleteAlbum(idx, album.title)}
                    >
                      <i className="fa-solid fa-trash" /> Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="gallery-album-edit">
                    <div className="admin-grid-2" style={{ marginBottom: "0.75rem" }}>
                      <Field
                        label="Album title"
                        value={album.title}
                        onChange={(v) => updateAlbum(idx, { ...album, title: v })}
                        placeholder="WirfonCloud Summit 2024"
                      />
                      <Field
                        label="Date label"
                        value={album.dateLabel}
                        onChange={(v) => updateAlbum(idx, { ...album, dateLabel: v })}
                        placeholder="June 2024"
                      />
                    </div>
                    <ImageUpload
                      label="Cover image (shown in album header)"
                      value={album.cover ?? ""}
                      onChange={(v) => updateAlbum(idx, { ...album, cover: v })}
                      hint="First photo is used as cover if none set."
                    />
                    <div style={{ marginTop: "1rem" }}>
                      <span className="admin-field-label" style={{ marginBottom: "0.6rem", display: "block" }}>
                        Photos ({album.photos.length})
                      </span>
                      <AlbumPhotoManager
                        photos={album.photos}
                        onChange={(photos) => updateAlbum(idx, { ...album, photos })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="button" className="admin-list-add" onClick={addAlbum} style={{ marginTop: gallery.albums.length > 0 ? "0.75rem" : "1rem" }}>
          <i className="fa-solid fa-plus" /> Add album
        </button>
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
