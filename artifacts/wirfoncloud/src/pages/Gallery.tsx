import { useEffect, useState } from "react";
import { useSite } from "@/hooks/useSite";
import type { GalleryPhoto } from "@/lib/site";
import { STATIC_ALBUMS } from "@/lib/staticAlbums";

type AlbumData = {
  id: string;
  title: string;
  dateLabel: string;
  cover?: string;
  photos: GalleryPhoto[];
};

const PREVIEW_COUNT = 4;

export default function Gallery() {
  const site = useSite();
  const [lightbox, setLightbox] = useState<{ photos: GalleryPhoto[]; index: number } | null>(null);
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());

  const dynamicAlbums: AlbumData[] = (site.gallery?.albums ?? []).filter(
    (a) => a.photos && a.photos.length > 0,
  );
  const albums: AlbumData[] = dynamicAlbums.length > 0 ? dynamicAlbums : STATIC_ALBUMS;

  const bannerTitle = site.gallery?.bannerTitle || "WirfonCloud in Pictures";
  const bannerSubtitle =
    site.gallery?.bannerSubtitle ||
    "Highlights from our Summits in Brussels, community events and the moments that bring our cloud journey to life.";

  const toggleAlbum = (id: string) => {
    setExpandedAlbums((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((lb) =>
          lb ? { ...lb, index: (lb.index + 1) % lb.photos.length } : null,
        );
      if (e.key === "ArrowLeft")
        setLightbox((lb) =>
          lb ? { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length } : null,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const current = lightbox ? lightbox.photos[lightbox.index] : null;

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
        <div className="container">
          {albums.length === 0 ? (
            <p style={{ color: "var(--grey-500)", textAlign: "center", padding: "3rem 0" }}>
              No albums yet — add some from the admin gallery manager.
            </p>
          ) : (
            albums.map((album) => {
              const isExpanded = expandedAlbums.has(album.id);
              const visiblePhotos = isExpanded ? album.photos : album.photos.slice(0, PREVIEW_COUNT);
              const remaining = album.photos.length - PREVIEW_COUNT;
              const coverSrc = album.cover || album.photos[0]?.src;

              return (
                <div key={album.id} className="gallery-album">
                  <div className="gallery-album-header">
                    <div className="gallery-album-meta">
                      {coverSrc && (
                        <div className="gallery-album-cover">
                          <img src={coverSrc} alt={album.title} />
                        </div>
                      )}
                      <div>
                        <h2 className="gallery-album-title">{album.title}</h2>
                        {album.dateLabel && (
                          <span className="gallery-album-date">
                            <i className="fa-regular fa-calendar" /> {album.dateLabel}
                          </span>
                        )}
                        <span className="gallery-album-count">
                          <i className="fa-regular fa-image" /> {album.photos.length} photo{album.photos.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="gallery-grid">
                    {visiblePhotos.map((p, i) => (
                      <button
                        key={`${p.src}-${i}`}
                        type="button"
                        className="gallery-tile"
                        onClick={() => setLightbox({ photos: album.photos, index: album.photos.indexOf(p) })}
                        aria-label={`Open image: ${p.caption}`}
                      >
                        <img src={p.src} alt={p.alt} loading="lazy" />
                        <span className="gallery-caption">{p.caption}</span>
                      </button>
                    ))}
                  </div>

                  {album.photos.length > PREVIEW_COUNT && (
                    <div className="gallery-album-footer">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => toggleAlbum(album.id)}
                      >
                        {isExpanded ? (
                          <><i className="fa-solid fa-chevron-up" /> Show Less</>
                        ) : (
                          <><i className="fa-solid fa-images" /> View all {remaining} more photo{remaining !== 1 ? "s" : ""}</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {current && lightbox && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length } : null);
            }}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>
              {current.caption}
              {lightbox.photos.length > 1 && (
                <span className="lightbox-counter"> · {lightbox.index + 1} / {lightbox.photos.length}</span>
              )}
            </figcaption>
          </figure>
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.photos.length } : null);
            }}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </>
  );
}
