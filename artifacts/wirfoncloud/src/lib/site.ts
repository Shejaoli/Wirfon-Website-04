export type Course = {
  title: string;
  description: string;
  previewUrl?: string;
  signupUrl?: string;
};
export type LearningPath = { title: string; description: string; subject: string };
export type VideoSlide = { src: string; title: string; caption: string };
export type Quote = { text: string; author: string; photo?: string };
export type BlogPost = { date: string; title: string; text: string; image: string; body?: string; link?: string; slug?: string };

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export type Faq = { q: string; a: string };
export type Service = { icon: string; title: string; text: string };
export type Partner = { name: string; href: string; logo?: string };
export type HeroSlide = {
  title: string;
  text: string;
  ctaHref: string;
  ctaLabel: string;
  bgFrom: string;
  bgTo: string;
  backgroundImage?: string;
};
export type HomeIntro = {
  title: string;
  text: string;
  image: string;
  fallbackLabel: string;
  ctaHref: string;
  ctaLabel: string;
  reverse: boolean;
};
export type AboutSection = { id: string; title: string; paragraphs: string[] };

export interface SiteContent {
  branding: {
    logoUrl: string;
  };
  hero: HeroSlide[];
  homeIntro: HomeIntro[];
  homeTestimonials: VideoSlide[];
  partners: Partner[];
  homeCta: {
    title: string;
    text: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
  about: {
    bannerImage: string;
    bannerTitle: string;
    bannerSubtitle: string;
    sections: AboutSection[];
  };
  academy: {
    bannerImage: string;
    bannerTitle: string;
    bannerSubtitle: string;
    fundamentals: Course[];
    intermediate: Course[];
    learningPaths: LearningPath[];
    discordLink: string;
    testimonialVideos: VideoSlide[];
    testimonialQuotes: Quote[];
  };
  consultancy: {
    image: string;
    fallbackLabel: string;
    title: string;
    text: string;
    ctaHref: string;
    ctaLabel: string;
    services: Service[];
    testimonials: VideoSlide[];
  };
  blog: {
    title: string;
    text: string;
    posts: BlogPost[];
  };
  faqs: Faq[];
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    youtube: string;
    whatsapp: string;
    discord?: string;
  };
  contact: { email: string };
  footer: { copyrightYear: number };
}

export const DEFAULT_SITE: SiteContent = {
  branding: {
    logoUrl: "/images/logo.png",
  },
  hero: [
    {
      title: "Master the Cloud with WirfonCloud",
      text: "Hands-on training programs designed to launch and advance your cloud career.",
      ctaHref: "/academy",
      ctaLabel: "Explore Academy",
      bgFrom: "#0199ef",
      bgTo: "#005fa3",
      backgroundImage: "/images/IMG_20230625_133031_342.jpg",
    },
    {
      title: "Your Trusted Cloud Consulting Partner",
      text: "From infrastructure design to security and cost optimization — we guide your cloud journey.",
      ctaHref: "/consultancy",
      ctaLabel: "Our Services",
      bgFrom: "#005fa3",
      bgTo: "#003d6b",
      backgroundImage: "/images/professional-night.jpg",
    },
  ],
  homeIntro: [
    {
      title: "Transform Your Career with Cloud Skills",
      text: "At WirfonCloud, our comprehensive training programs equip you with the knowledge and skills needed to thrive in the cloud.",
      image: "/images/phoneshutterstock_133514576.jpg",
      fallbackLabel: "Cloud training in your pocket",
      ctaHref: "/academy",
      ctaLabel: "Learn More",
      reverse: false,
    },
    {
      title: "Strategic Cloud Consulting Tailored for You",
      text: "Our certified and experienced consultants provide strategic guidance and practical solutions.",
      image: "/images/shutterstock_1405194650.jpg",
      fallbackLabel: "Strategic cloud consulting",
      ctaHref: "/consultancy",
      ctaLabel: "Learn More",
      reverse: true,
    },
  ],
  homeTestimonials: [
    { src: "https://www.youtube.com/embed/aByknzTTOaY", title: "AWS Deep Dive on Amazon S3", caption: "AWS Deep Dive on Amazon S3" },
    { src: "https://www.youtube.com/embed/n4qHUXrRcds", title: "AWS re:Invent Recap", caption: "AWS re:Invent Recap at WirfonCloud" },
    { src: "https://www.youtube.com/embed/aByknzTTOaY", title: "WirfonCloud Testimonial", caption: "WirfonCloud Client Story" },
  ],
  partners: [],
  homeCta: {
    title: "Ready to Get Started?",
    text: "Book a free appointment with our team via Google Calendar or connect with us on LinkedIn.",
    primaryHref: "https://calendar.google.com",
    primaryLabel: "Book Appointment",
    secondaryHref: "https://www.linkedin.com/company/wirfoncloud/",
    secondaryLabel: "Connect on LinkedIn",
  },
  about: {
    bannerImage: "/images/002_blk_girl_shutterstock_2030694452.jpg",
    bannerTitle: "About WirfonCloud",
    bannerSubtitle: "Your trusted partner in cloud computing.",
    sections: [],
  },
  academy: {
    bannerImage: "/images/IMG_20230625_133031_342.jpg",
    bannerTitle: "WirfonCloud Academy",
    bannerSubtitle: "Your gateway to a cloud computing career.",
    fundamentals: [],
    intermediate: [],
    learningPaths: [],
    discordLink: "#",
    testimonialVideos: [],
    testimonialQuotes: [],
  },
  consultancy: {
    image: "/images/shutterstock_1405194650.jpg",
    fallbackLabel: "Strategic cloud consulting",
    title: "WirfonCloud Consultancy",
    text: "Our certified and experienced consultants provide strategic guidance and practical solutions to help you navigate your cloud journey.",
    ctaHref: "/about#contact",
    ctaLabel: "Get in Touch",
    services: [],
    testimonials: [],
  },
  blog: {
    title: "Stay in the Loop",
    text: "Subscribe to our newsletter for the latest cloud news, tutorials, and event invites.",
    posts: [],
  },
  faqs: [],
  social: {
    linkedin: "https://www.linkedin.com/company/wirfoncloud/",
    twitter: "https://twitter.com/JoinWirfonCloud",
    facebook: "https://www.facebook.com/wirfoncloud",
    youtube: "https://www.youtube.com/@wirfoncloud",
    whatsapp: "https://wa.me/250791921156",
  },
  contact: { email: "contact@wirfoncloud.com" },
  footer: { copyrightYear: 2026 },
};
