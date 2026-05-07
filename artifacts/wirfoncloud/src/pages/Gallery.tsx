import { useEffect, useState } from "react";
import { useSite } from "@/hooks/useSite";
import type { GalleryPhoto } from "@/lib/site";

import img1 from "@assets/IMG_20230625_132855_776_1777412731016.jpg";
import img2 from "@assets/IMG_20230625_133031_342_1777412731017.jpg";
import img3 from "@assets/letsrule2021-09-01_14-54-16_1777412731017.jpg";
import img4 from "@assets/Members29_00-08-33_1777412731018.jpg";
import img5 from "@assets/Photo_from_Mfoome_Bahti_-Ban(1)_1777412731018.jpg";
import img6 from "@assets/Photo_from_Mfoome_Bahti_-Ban(2)_1777412731019.jpg";
import img7 from "@assets/Photo_from_Mfoome_Bahti_-Ban(3)_1777412731019.jpg";
import img8 from "@assets/Photo_from_Mfoome_Bahti_-Ban(4)_1777412731020.jpg";
import img9 from "@assets/Photo_from_Mfoome_Bahti_-Ban(5)_1777412731021.jpg";
import img10 from "@assets/Photo_from_Mfoome_Bahti_-Ban(6)_1777412731021.jpg";
import img11 from "@assets/Photo_from_Mfoome_Bahti_-Ban(7)_1777412731022.jpg";
import img12 from "@assets/Photo_from_Mfoome_Bahti_-Ban(8)_1777412731022.jpg";
import img13 from "@assets/Photo_from_Mfoome_Bahti_-Ban(9)_1777412731023.jpg";
import img14 from "@assets/Photo_from_Mfoome_Bahti_-Ban(10)_1777412731023.jpg";
import img15 from "@assets/Photo_from_Mfoome_Bahti_-Ban_1777412731024.jpg";

type AlbumData = {
  id: string;
  title: string;
  dateLabel: string;
  cover?: string;
  photos: GalleryPhoto[];
};

const STATIC_ALBUMS: AlbumData[] = [
  {
    id: "summit-2023",
    title: "WirfonCloud Summit — Brussels 2023",
    dateLabel: "June 2023",
    cover: img1,
    photos: [
      { src: img1, alt: "Group photo of WirfonCloud Summit attendees", caption: "Brussels Summit — Group Photo" },
      { src: img2, alt: "WirfonCloud branded session", caption: "Hands-on with the cloud" },
    ],
  },
  {
    id: "summit-2021",
    title: "Wirfon Cloud Summit — Brussels 2021",
    dateLabel: "September 2021",
    cover: img3,
    photos: [
      { src: img3, alt: "WirfonCloud — Let's rule the clouds banner", caption: "Let's rule the clouds" },
      { src: img4, alt: "WirfonCloud Summit attendees", caption: "Community in person" },
      { src: img5, alt: "Speaker addressing attendees", caption: "Keynote moments" },
      { src: img6, alt: "Attendees in a working session", caption: "Hands-on workshop" },
      { src: img7, alt: "Speaker pointing at WirfonCloud banner", caption: "The future is bright" },
      { src: img8, alt: "Summit room before sessions", caption: "Ready for the Summit" },
      { src: img9, alt: "Interactive session with whiteboard", caption: "Interactive learning" },
      { src: img10, alt: "Classroom view of the Summit", caption: "Full house in Brussels" },
      { src: img11, alt: "Attendee at Wirfon Cloud Summit Brussels 2021", caption: "Wirfon Cloud Summit — Brussels 2021" },
      { src: img12, alt: "Attendee taking notes", caption: "Sharing knowledge" },
      { src: img13, alt: "Working session at the Summit", caption: "Collaborating in person" },
      { src: img14, alt: "Attendees networking", caption: "Networking & community" },
      { src: img15, alt: "Conversations between sessions", caption: "Building lasting connections" },
    ],
  },
];

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
