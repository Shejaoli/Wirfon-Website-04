import type { CustomSection } from "@/lib/site";
import { SmartLink } from "@/components/SmartLink";

function CustomSectionBlock({ s, index }: { s: CustomSection; index: number }) {
  const hasImage = !!s.imageUrl?.trim();
  const hasBtn = !!(s.buttonLabel?.trim() && s.buttonUrl?.trim());
  const altBg = index % 2 !== 0;
  const reverse = s.imagePosition === "right";

  if (hasImage) {
    return (
      <section className={`section${altBg ? " section-alt" : ""} anchor-section`}>
        <div className={`container two-col${reverse ? " reverse" : ""}`}>
          <div className="col-image">
            <img
              src={s.imageUrl!}
              alt={s.title}
              style={{ borderRadius: 12, width: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="col-text">
            <h2>{s.title}</h2>
            {s.body && (
              <div
                className="custom-section-body"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            )}
            {hasBtn && (
              <SmartLink href={s.buttonUrl!} className="btn btn-primary custom-section-btn">
                {s.buttonLabel}
              </SmartLink>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section${altBg ? " section-alt" : ""} anchor-section`}>
      <div className="container narrow">
        <h2>{s.title}</h2>
        {s.body && (
          <div
            className="custom-section-body"
            dangerouslySetInnerHTML={{ __html: s.body }}
          />
        )}
        {hasBtn && (
          <SmartLink href={s.buttonUrl!} className="btn btn-primary custom-section-btn">
            {s.buttonLabel}
          </SmartLink>
        )}
      </div>
    </section>
  );
}

export default function CustomSections({
  sections,
  baseIndex = 0,
}: {
  sections?: CustomSection[];
  baseIndex?: number;
}) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((s, i) => (
        <CustomSectionBlock key={s.id || i} s={s} index={baseIndex + i} />
      ))}
    </>
  );
}
