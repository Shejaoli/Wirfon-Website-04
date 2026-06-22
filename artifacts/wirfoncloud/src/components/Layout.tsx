import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import NewsTicker from "./NewsTicker";
import { useSite } from "@/hooks/useSite";

function BookingBar() {
  const site = useSite();
  const bar = site.bookingBar;
  if (!bar?.visible) return null;
  return (
    <div className="booking-sticky-bar">
      <a
        href={bar.url}
        className="booking-sticky-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        {bar.label || "📅 Book a Free 20 min Meeting"}
      </a>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const site = useSite();
  const barVisible = site.bookingBar?.visible ?? false;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        const id = hash.slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location]);

  return (
    <>
      <NewsTicker />
      <Navbar />
      <main style={barVisible ? { paddingBottom: "64px" } : undefined}>{children}</main>
      <Footer />
      <BookingBar />
      <WhatsAppFloat />
    </>
  );
}
