import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSite } from "@/hooks/useSite";

export default function HeroSlider() {
  const site = useSite();
  const slides = site.hero;
  const [index, setIndex] = useState(0);

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
          const backgroundImage = hasImage
            ? `linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30)), url('${slide.backgroundImage}'), ${gradient}`
            : gradient;
          return (
            <div
              key={i}
              className={"hero-layer" + (i === index ? " active" : "")}
              style={{
                backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          );
        })}

        <h1 className="hero-headline">{slides[index].title}</h1>

        <div className="hero-card">
          <p>{slides[index].text}</p>
          <Link href={slides[index].ctaHref} className="hero-card-btn">
            {slides[index].ctaLabel}
          </Link>
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
