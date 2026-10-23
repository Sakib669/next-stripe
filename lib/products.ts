import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "prod_aurora_headphones",
    name: "Aurora Wireless Studio Headphones",
    tagline: "Lossless acoustic fidelity engineered for pure focus",
    description:
      "Crafted from matte aerospace grade aluminum with breathable memory foam earcups. Features custom tuned 40mm beryllium drivers, active hybrid noise cancellation, and up to 45 hours of battery life on a single fast charge.",
    priceInCents: 29900,
    currency: "usd",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    category: "Audio",
    features: [
      "Custom 40mm Beryllium drivers",
      "Hybrid Active Noise Cancellation with Transparency mode",
      "45 hour playtime with 15 minute rapid USB-C charging",
      "Bluetooth 5.3 with multipoint pairing",
    ],
    inStock: true,
  },
  {
    id: "prod_chronos_watch",
    name: "Chronos Minimalist Chronometer",
    tagline: "Subtle mechanical precision in sapphire and surgical steel",
    description:
      "A tribute to brutalist Swiss minimalism. Boasting a scratch proof sapphire crystal face, Japanese automatic movement, a 5 ATM water resistance rating, and an interchangeable full grain vegetable tanned leather strap.",
    priceInCents: 18500,
    currency: "usd",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    category: "Accessories",
    features: [
      "Ultra thin 316L stainless steel case",
      "Anti reflective sapphire crystal lens",
      "50 meter water resistance rating",
      "Italian vegetable tanned calfskin band",
    ],
    inStock: true,
  },
  {
    id: "prod_lunar_keyboard",
    name: "Lunar Mechanical Keypad",
    tagline: "Tactile satisfying key response with CNC machined chassis",
    description:
      "Custom gasket mounted 75 percent mechanical keyboard with hot swappable pre lubed linear switches, sound dampening brass weight plate, double shot PBT keycaps, and programmable open source firmware.",
    priceInCents: 14900,
    currency: "usd",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    category: "Workspace",
    features: [
      "Full CNC anodized aluminum enclosure",
      "Gasket mounted plate with dual PORON acoustic foam",
      "Hot swappable Kailh switch sockets",
      "Custom dynamic per key backlighting",
    ],
    inStock: true,
  },
  {
    id: "prod_solis_sunglasses",
    name: "Solis Titanium Polarized Eyewear",
    tagline: "Featherweight Japanese titanium frames with UV400 clarity",
    description:
      "Engineered for daily resilience and absolute glare rejection. Weighing just 18 grams with hand polished acetate temple tips, corrosion proof titanium barrel hinges, and grade A polarized lenses.",
    priceInCents: 12000,
    currency: "usd",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80",
    category: "Accessories",
    features: [
      "Japanese beta titanium frame construction",
      "Category 3 polarized optical glass",
      "100 percent UVA UVB protection",
      "Custom hard shell magnetic travel case included",
    ],
    inStock: true,
  },
  {
    id: "prod_nomad_backpack",
    name: "Nomad Weatherproof Commuter Pack",
    tagline: "Organized waterproof utility designed for modern transit",
    description:
      "Constructed from recycled 840D Cordura ballistic nylon with YKK AquaGuard weather sealed zippers. Includes an elevated suspended 16 inch laptop compartment, hidden passport pocket, and magnetic sternum buckle.",
    priceInCents: 16500,
    currency: "usd",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    category: "Apparel",
    features: [
      "22 Liter capacity with modular internal dividers",
      "Weatherproof Cordura fabric with water repellent coating",
      "Suspended dedicated 16 inch laptop sleeve",
      "Ergonomic airflow back panel and luggage pass through",
    ],
    inStock: true,
  },
  {
    id: "prod_ember_desk_lamp",
    name: "Ember Ambient Architectural Lamp",
    tagline: "Warm circadian light with sculptural solid brass stem",
    description:
      "Cast soft glare free illumination across your creative workspace. Features continuous capacitive touch dimming, high 95+ Color Rendering Index LEDs for natural tones, and an integrated USB-C device charging base.",
    priceInCents: 9800,
    currency: "usd",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    category: "Workspace",
    features: [
      "95+ CRI warm white spectrum (2700K to 4000K)",
      "Stepless capacitive touch brightness control",
      "Solid spun aluminum head with brass counterweight",
      "Discreet 15W high speed USB-C charging port",
    ],
    inStock: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(priceInCents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceInCents / 100);
}
