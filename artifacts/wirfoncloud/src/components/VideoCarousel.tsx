import { useState } from "react";

interface VideoSlide {
  src: string;
  caption: string;
  title: string;
}

export default function VideoCarousel({ slides }: { slides: VideoSlide[] }) {
  const [index, setIndex] = useState(0);
  if (slides.length === 0) return null;
  const safeIndex = ((index % slides.length) + slides.length) % slides.length;
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="video-carousel">
      <div className="video-carousel-stage">
        <button
          className="carousel-arrow prev"
          aria-label="Previous testimonial"
          onClick={prev}
          disabled={slides.length < 2}
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
        <div className="video-carousel-viewport">
          <div
            className="video-carousel-track"
            style={{ transform: `translateX(-${safeIndex * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div key={i} className="video-carousel-slide">
                <div className="video-wrap">
                  <iframe src={s.src} title={s.title} allowFullScreen />
                </div>
                <p className="caption">{s.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          className="carousel-arrow next"
          aria-label="Next testimonial"
          onClick={next}
          disabled={slides.length < 2}
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
      {slides.length > 1 && (
        <div className="video-carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={"dot" + (i === safeIndex ? " active" : "")}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
