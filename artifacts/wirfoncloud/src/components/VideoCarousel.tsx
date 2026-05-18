import { useState } from "react";

interface VideoSlide {
  src: string;
  caption: string;
  title: string;
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&"']+)/);
  return m ? m[1] : null;
}

function YoutubeFacade({ src, title }: { src: string; title: string }) {
  const [active, setActive] = useState(false);
  const videoId = getYouTubeId(src);

  if (!videoId || active) {
    const embedSrc = active ? `${src.split("?")[0]}?autoplay=1&rel=0` : src;
    return (
      <iframe
        src={embedSrc}
        title={title}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    );
  }

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <button
      type="button"
      className="yt-facade"
      aria-label={`Play: ${title}`}
      onClick={() => setActive(true)}
    >
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        decoding="async"
        className="yt-facade-thumb"
      />
      <span className="yt-play-btn" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
          <path d="M45 24 27 14v20" fill="#fff"/>
        </svg>
      </span>
    </button>
  );
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
                  <YoutubeFacade src={s.src} title={s.title} />
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
