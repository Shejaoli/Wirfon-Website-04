import { useState, useEffect } from "react";
import { useSite } from "@/hooks/useSite";
import { SmartLink } from "@/components/SmartLink";

export default function HeroSlider() {
  const site = useSite();
  const slides = site.hero;
  const [index, setIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  if (slides.length === 0) return null;

  return (
    <section className="hero-frame">
      <div className="hero-stage">
        {slides.map((slide, i) => {
          const gradient = `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)`;
          const hasImage = Boolean(slide.backgroundImage);
          const isFirst = i === 0;

          return (
            <div
              key={i}
              className={"hero-layer" + (i === index ? " active" : "")}
              style={{
                backgroundImage: gradient,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {hasImage && (
                <>
                  <img
                    src={slide.backgroundImage}
                    alt=""
                    fetchPriority={isFirst ? "high" : "low"}
                    loading={isFirst ? "eager" : "lazy"}
                    decoding={isFirst ? "sync" : "async"}
                    className="hero-bg-img"
                    style={{
                      opacity: imgLoaded[i] ? 1 : 0,
                      transition: "opacity 0.6s ease",
                    }}
                    onLoad={() => setImgLoaded((prev) => ({ ...prev, [i]: true }))}
                  />
                  <div
                    className="hero-bg-overlay"
                    style={{
                      background: `linear-gradient(135deg, ${slide.bgFrom}55 0%, ${slide.bgTo}55 100%)`,
                    }}
                  />
                </>
              )}
            </div>
          );
        })}

        <h1 className="hero-headline">{slides[index].title}</h1>

        <div className="hero-card">
          <p>{slides[index].text}</p>
          <SmartLink href={slides[index].ctaHref} className="hero-card-btn">
            {slides[index].ctaLabel}
          </SmartLink>
        </div>

        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={"dot" + (i === index ? " active" : "")}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
