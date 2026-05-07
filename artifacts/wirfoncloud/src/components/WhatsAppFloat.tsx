import { useSite } from "@/hooks/useSite";

export default function WhatsAppFloat() {
  const site = useSite();
  if (!site.social.whatsapp) return null;
  return (
    <a
      href={site.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with us on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp" />
      <span>Chat with us</span>
    </a>
  );
}
