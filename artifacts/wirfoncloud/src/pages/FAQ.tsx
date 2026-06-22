import { useState } from "react";
import { useSite } from "@/hooks/useSite";
import CustomSections from "@/components/CustomSections";

export default function FAQ() {
  const site = useSite();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqPage = site.faqPage ?? {};
  const bannerTitle = faqPage.title || "Frequently Asked Questions";
  const bannerSubtitle = faqPage.subtitle || "Everything you need to know about WirfonCloud training and consulting.";

  return (
    <>
      <section
        className="page-banner"
        style={{ background: "linear-gradient(135deg, #0199ef 0%, #005fa3 100%)" }}
      >
        <div className="container">
          <h1>{bannerTitle}</h1>
          <p>{bannerSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <div className="accordion">
            {site.faqs.map((item, i) => {
              const open = openIndex === i;
              return (
                <div key={i} className={"accordion-item" + (open ? " open" : "")}>
                  <button
                    className="accordion-trigger"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span>{item.q}</span>
                    <i className="fa-solid fa-plus" />
                  </button>
                  <div className="accordion-content">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CustomSections sections={site.faqPage?.customSections ?? []} />
    </>
  );
}
