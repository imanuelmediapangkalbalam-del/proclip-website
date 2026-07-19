export type Product = {
  id: string;
  name: string;
  category: "clippers" | "trimmers" | "accessories" | "combos";
  price: number;
  tagline: string;
  description: string;
  specs: string[];
  image: string;
  featured?: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: "fade" | "beard" | "classic" | "studio";
  image: string;
};

export const products: Product[] = [
  {
    id: "pc-x9",
    name: "ProClip X9 Torque",
    category: "clippers",
    price: 1890000,
    tagline: "Studio-grade motor. Zero lag.",
    description:
      "Brushless torque engine built for all-day fades. Dual-voltage, quiet chassis, and a blade that stays cool under continuous load.",
    specs: ["7200 RPM brushless", "Ceramic DLC blade", "3.5h runtime", "IPX4 body"],
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "pc-edge",
    name: "ProClip Edge Micro",
    category: "trimmers",
    price: 890000,
    tagline: "Line-ups without hesitation.",
    description:
      "Ultra-slim T-blade trimmer for crisp perimeters and beard architecture. Balanced grip for precision under pressure.",
    specs: ["T-blade steel", "USB-C fast charge", "OLED battery", "Magnetic guard"],
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "pc-forge",
    name: "Forge Blade Kit",
    category: "accessories",
    price: 420000,
    tagline: "Sharper every session.",
    description:
      "Precision guards, oil kit, and alignment tools calibrated for ProClip motors. Keep every cut consistent.",
    specs: ["8 magnetic guards", "Blade oil", "Cleaning brush", "Case"],
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "pc-studio",
    name: "Studio Dual Set",
    category: "combos",
    price: 2490000,
    tagline: "Clipper + trimmer. One system.",
    description:
      "Matched X9 and Edge Micro with shared charging dock. Built for chairs that never stop moving.",
    specs: ["X9 + Edge Micro", "Shared dock", "Spare blades", "Travel case"],
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "pc-air",
    name: "ProClip AirFade",
    category: "clippers",
    price: 1450000,
    tagline: "Lightweight. Relentless.",
    description:
      "Carbon-shell body at 215g. Ideal for mobile barbers who need full power without wrist fatigue.",
    specs: ["215g chassis", "Carbon shell", "2.8h runtime", "Quiet mode"],
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "pc-beard",
    name: "Beard Architect",
    category: "trimmers",
    price: 760000,
    tagline: "Shape with intent.",
    description:
      "Adjustable foil head for density mapping across cheeks, neckline, and mustache detail work.",
    specs: ["Foil + blade", "5 length modes", "Waterproof", "Travel lock"],
    image:
      "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?auto=format&fit=crop&w=1200&q=80",
  },
];

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Low Skin Fade",
    category: "fade",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "g2",
    title: "Beard Contour",
    category: "beard",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "g3",
    title: "Classic Part",
    category: "classic",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "g4",
    title: "Chair Session",
    category: "studio",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "g5",
    title: "Mid Taper",
    category: "fade",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "g6",
    title: "Studio Light",
    category: "studio",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80",
  },
];

export const services = [
  {
    name: "Signature Fade",
    duration: "45 min",
    price: 120000,
    detail: "Skin-to-blend with consultation and finish.",
  },
  {
    name: "Beard Architecture",
    duration: "30 min",
    price: 85000,
    detail: "Line, density, and balance for facial hair.",
  },
  {
    name: "Full Chair Ritual",
    duration: "75 min",
    price: 210000,
    detail: "Cut, beard, hot towel, and styling.",
  },
];

export const features = [
  {
    title: "Brushless Torque",
    body: "Consistent blade speed through dense hair — no drag, no heat spike mid-fade.",
  },
  {
    title: "Cool-Running Blades",
    body: "DLC ceramic coating keeps contact cool so clients stay still and sessions stay long.",
  },
  {
    title: "Chair-Ready Battery",
    body: "Swap-ready power for peak hours. Dock, charge, and return without breaking flow.",
  },
  {
    title: "Balanced Grip",
    body: "Weight distribution tuned with working barbers — less wrist strain, more control.",
  },
];

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
