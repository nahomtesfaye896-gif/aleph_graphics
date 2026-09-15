export const CONTACT = {
  phone: "+251 911 123 456",
  
  
  
  telegram: "nahom_t8",
  email: "info@alephgraphics.et",
  mapUrl: "https://www.google.com/maps/place/Tsega+event+and+communication/@9.0315052,38.7618636,914m/data=!3m2!1e3!4b1!4m6!3m5!1s0x164b85b5eea6ab89:0xb5fa874f5e18ec7f!8m2!3d9.0315052!4d38.7618636!16s%2Fg%2F11ydwh329v!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
  social: {
    facebook: "https://facebook.com/alephgraphicsacademy",
    instagram: "https://instagram.com/alephgraphicsacademy",
    tiktok: "https://tiktok.com/@alephgraphicsacademyy",
    telegram: "https://t.me/nahom_t8",
    youtube: "https://youtube.com/@alephgraphicsacademy",
    linkedin: "https://linkedin.com/company/alephgraphicsacademy",
  },
};

export const IMAGES = {
  hero: "https://images.pexels.com/photos/7675023/pexels-photo-7675023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  about: "https://images.pexels.com/photos/7675029/pexels-photo-7675029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  classroom: "https://images.pexels.com/photos/33920044/pexels-photo-33920044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  student: "https://images.pexels.com/photos/9159001/pexels-photo-9159001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  photoshop: "https://images.pexels.com/photos/7971537/pexels-photo-7971537.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  illustrator: "https://images.pexels.com/photos/16313509/pexels-photo-16313509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  graphic: "https://images.pexels.com/photos/8546649/pexels-photo-8546649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  video: "https://images.pexels.com/photos/8100067/pexels-photo-8100067.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
  projects: [
    "https://images.pexels.com/photos/8546649/pexels-photo-8546649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/3964758/pexels-photo-3964758.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/37471992/pexels-photo-37471992.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/5292240/pexels-photo-5292240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/9617887/pexels-photo-9617887.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/1188751/pexels-photo-1188751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/8545632/pexels-photo-8545632.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
    "https://images.pexels.com/photos/7971543/pexels-photo-7971543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600",
  ],
};

export type CourseKey = "photoshop" | "illustrator" | "graphic" | "video";

export interface CourseMeta {
  id?: string;
  key: string;
  nameEn: string;
  nameAm?: string;
  taglineEn?: string;
  taglineAm?: string;
  descEn?: string;
  descAm?: string;
  longEn?: string;
  longAm?: string;
  learnEn?: string[];
  learnAm?: string[];
  tools: string[];
  image: string;
  accent: string;
  feeEtb?: string;
  popular?: boolean;
  sortOrder?: number;
}

export const COURSES: CourseMeta[] = [
  {
    key: "photoshop",
    nameEn: "Adobe Photoshop",
    taglineEn: "Photo editing & digital design",
    descEn: "Master the industry-standard tool for photo retouching, poster design, social media graphics and digital art.",
    longEn: "From layers and masks to advanced compositing, our Photoshop course takes you from zero to confident. You will design real posters, banners, product ads and social media content for Ethiopian brands.",
    learnEn: [
      "Layers, masks, selections & retouching",
      "Color correction and photo manipulation",
      "Social media & poster design",
      "Print preparation and export for web",
    ],
    feeEtb: "6,500",
    tools: ["Photoshop", "Camera Raw", "Canva"],
    image: IMAGES.photoshop,
    accent: "from-sky-500 to-blue-700",
  },
  {
    key: "illustrator",
    nameEn: "Adobe Illustrator",
    taglineEn: "Logo design & vector illustration",
    descEn: "Create logos, icons, typography and scalable vector artwork used by brands everywhere.",
    longEn: "Learn the pen tool, shapes, gradients and typography to build professional logos and brand identities. You will finish with a complete branding project for a real local business.",
    learnEn: [
      "Pen tool, shapes & pathfinder mastery",
      "Logo design process & brand identity",
      "Vector illustration and iconography",
      "Typography, business cards & packaging",
    ],
    feeEtb: "6,500",
    tools: ["Illustrator", "Figma"],
    image: IMAGES.illustrator,
    accent: "from-amber-500 to-orange-600",
  },
  {
    key: "graphic",
    nameEn: "Graphic Design Diploma",
    taglineEn: "Complete professional program",
    descEn: "Our flagship program covering design theory, Photoshop, Illustrator, InDesign and portfolio building.",
    longEn: "The full journey: design principles, color theory, typography, layout, branding, print and digital design — with weekly critiques and a final portfolio presentation to hiring partners.",
    learnEn: [
      "Design principles, color & typography",
      "Photoshop + Illustrator + InDesign",
      "Branding, print & digital campaigns",
      "Portfolio, freelancing & client skills",
    ],
    feeEtb: "14,000",
    tools: ["Photoshop", "Illustrator", "InDesign", "Figma"],
    image: IMAGES.graphic,
    accent: "from-brand-600 to-indigo-700",
    popular: true,
  },
  {
    key: "video",
    nameEn: "Video Editing",
    taglineEn: "Premiere Pro & After Effects",
    descEn: "Edit cinematic videos, YouTube content, adverts and motion graphics for TV and social media.",
    longEn: "Learn professional editing workflow, color grading, sound design and motion graphics. Build a showreel with music videos, event highlights, promos and YouTube content.",
    learnEn: [
      "Premiere Pro editing workflow",
      "Color grading & audio mixing",
      "After Effects motion graphics & titles",
      "YouTube, TikTok & TV-ready exports",
    ],
    feeEtb: "9,000",
    tools: ["Premiere Pro", "After Effects", "CapCut", "DaVinci"],
    image: IMAGES.video,
    accent: "from-violet-600 to-fuchsia-600",
  },
];

export const PROJECT_AUTHORS = [
  "Hanna T.",
  "Dawit B.",
  "Selamawit G.",
  "Yonas A.",
  "Meron K.",
  "Biruk H.",
  "Rahel M.",
  "Natnael W.",
];
