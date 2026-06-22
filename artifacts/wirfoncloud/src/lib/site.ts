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
export type GalleryPhoto = { src: string; alt: string; caption: string };
export type GalleryAlbum = { id: string; title: string; dateLabel: string; cover?: string; photos: GalleryPhoto[] };
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

export type CoreValue = { number: string; title: string; description: string };

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
    primaryLabel: string;
    bookingLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
  homeApproach: {
    title: string;
    text: string;
  };
  homeFounder?: {
    quote: string;
    founderName: string;
    founderTitle: string;
    founderPhoto?: string;
  };
  coreValues?: {
    heading: string;
    values: CoreValue[];
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
    fundamentalsHeading?: string;
    fundamentals: Course[];
    intermediate: Course[];
    learningPaths: LearningPath[];
    discordLink: string;
    testimonialVideos: VideoSlide[];
    testimonialQuotes: Quote[];
    howWeWork?: { icon: string; step: string; title: string; text: string }[];
  };
  consultancy: {
    image: string;
    fallbackLabel: string;
    title: string;
    text: string;
    ctaHref: string;
    ctaLabel: string;
    services: Service[];
    howWeWork?: { icon: string; step: string; title: string; text: string }[];
    testimonials: VideoSlide[];
    testimonialQuotes?: Quote[];
    aiConsultancy?: {
      image: string;
      fallbackLabel: string;
      title: string;
      text: string;
      ctaHref: string;
      ctaLabel: string;
    };
  };
  blog: {
    title: string;
    text: string;
    posts: BlogPost[];
  };
  faqs: Faq[];
  gallery: {
    bannerTitle: string;
    bannerSubtitle: string;
    albums: GalleryAlbum[];
  };
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    youtube: string;
    whatsapp: string;
    discord?: string;
  };
  bookingLink?: string;
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
    title: "Ready to Start Your Cloud Journey?",
    text: "Get your step-by-step beginner roadmap to start Cloud, Infrastructure, and AI engineering with WirfonCloud Academy.",
    primaryLabel: "Click to Get Your Free RoadMap",
    bookingLabel: "Book 20 min Meeting",
  },
  homeApproach: {
    title: "Our Approach",
    text: "We combine hands-on training, expert consulting, and community mentorship to guide every individual and organisation confidently into the cloud — step by step, skill by skill.",
  },
  homeFounder: {
    quote: "Cloud computing is not just a technology — it's an equaliser. Whether you're switching careers, scaling a business, or modernising your infrastructure, the cloud opens doors that were once closed. At WirfonCloud we exist to make sure those doors are open to everyone.",
    founderName: "Founder & CEO, WirfonCloud",
    founderTitle: "Wirfon Group Investments Ltd",
    founderPhoto: "",
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
    aiConsultancy: {
      image: "",
      fallbackLabel: "AI Consultancy",
      title: "AI Consultancy",
      text: "We help organisations understand, adopt and operationalise Artificial Intelligence — from strategy and readiness assessments to hands-on implementation. Whether you are exploring AI for the first time or scaling existing initiatives, our experts guide you every step of the way.",
      ctaHref: "/about#contact",
      ctaLabel: "Talk to an Expert",
    },
  },
  coreValues: {
    heading: "Our Core Values",
    values: [
      { number: "01", title: "Foundation First", description: "We never skip steps. Before Cloud, before AI — Linux, Networking, Python. The right order builds professionals who last." },
      { number: "02", title: "Respect for the Learner", description: "We treat every student as an intelligent, capable adult. Clear, honest teaching that respects where you are and where you are going." },
      { number: "03", title: "Cultural Relevance", description: "We teach through the world our learners already know — African markets, African infrastructure, African daily life. When a concept connects to your context, it sticks." },
      { number: "04", title: "Proven Outcomes", description: "We measure success by professionals who get hired, not by enrolment numbers. Our graduates are working in real roles at real organisations." },
      { number: "05", title: "Access and Inclusion", description: "Cloud and AI careers should not be reserved for people who grew up with a certain accent or postcode. We are building the bridge — from Kigali, across Africa, and into the diaspora." },
      { number: "06", title: "Integrity in Teaching", description: "We do not sell shortcuts. We tell the truth about what the work involves — and we stay with our students through it." },
    ],
  },
  blog: {
    title: "Stay in the Loop",
    text: "Subscribe to our newsletter for the latest cloud news, tutorials, and event invites.",
    posts: [],
  },
  faqs: [],
  gallery: {
    bannerTitle: "WirfonCloud in Pictures",
    bannerSubtitle: "Highlights from our Summits, community events and the moments that bring our cloud journey to life.",
    albums: [],
  },
  social: {
    linkedin: "https://www.linkedin.com/company/wirfoncloud/",
    twitter: "https://twitter.com/JoinWirfonCloud",
    facebook: "https://www.facebook.com/wirfoncloud",
    youtube: "https://www.youtube.com/@wirfoncloud",
    whatsapp: "https://wa.me/250791921156",
  },
  bookingLink: "https://calendar.app.google/6YG4yZQX2mXwo9qr5",
  contact: { email: "contact@wirfoncloud.com" },
  footer: { copyrightYear: 2026 },
};
