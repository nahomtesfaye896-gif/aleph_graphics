export const CONTACT = {
  phone: "+251 928 745 053",
  phoneRaw: "+251928745053",
  phone2: "+251 928 745 053",
  whatsapp: "251928745053",
  telegram: "nahom_t8",
  email: "info@alephgraphics.et",
  mapUrl: "https://maps.google.com/?q=Bole+Road+Edna+Mall+Addis+Ababa",
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
  key: CourseKey;
  id: string;
  weeks: number;
  level: "beginner" | "intermediate" | "all";
  feeETB: string;
  tools: string[];
  image: string;
  accent: string; // tailwind gradient classes
  popular?: boolean;
}

export const COURSES: CourseMeta[] = [
  {
    key: "photoshop",
    id: "photoshop",
    weeks: 8,
    level: "beginner",
    feeETB: "6,500",
    tools: ["Photoshop", "Camera Raw", "Canva"],
    image: IMAGES.photoshop,
    accent: "from-sky-500 to-blue-700",
  },
  {
    key: "illustrator",
    id: "illustrator",
    weeks: 8,
    level: "beginner",
    feeETB: "6,500",
    tools: ["Illustrator", "Figma"],
    image: IMAGES.illustrator,
    accent: "from-amber-500 to-orange-600",
  },
  {
    key: "graphic",
    id: "graphic-design",
    weeks: 16,
    level: "all",
    feeETB: "14,000",
    tools: ["Photoshop", "Illustrator", "InDesign", "Figma"],
    image: IMAGES.graphic,
    accent: "from-brand-600 to-indigo-700",
    popular: true,
  },
  {
    key: "video",
    id: "video-editing",
    weeks: 10,
    level: "intermediate",
    feeETB: "9,000",
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
