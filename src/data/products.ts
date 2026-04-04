import productMask from "@/assets/product-mask.jpg";
import productAqua from "@/assets/product-aqua.jpg";
import productAura from "@/assets/product-aura.jpg";
import productAvora from "@/assets/product-avora.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  tags: string[];
  discount?: number;
}

export const products: Product[] = [
  {
    id: "mask",
    name: "Mask",
    price: 1399,
    originalPrice: 1499,
    image: productMask,
    description: "A masterwork of olfactory architecture, featuring a proprietary blend of sustainably sourced essential oils and rare botanicals, meticulously balanced for long-lasting projection.",
    tags: ["Handcrafted", "Pure Oils", "45 Days"],
    discount: 6,
  },
  {
    id: "aqua-nor",
    name: "AQUA NOR",
    price: 1200,
    originalPrice: 1800,
    image: productAqua,
    description: "A refreshing aquatic essence crafted with premium ingredients for a lasting oceanic experience in your luxury vehicle.",
    tags: ["Handcrafted", "Pure Oils", "45 Days"],
    discount: 33,
  },
  {
    id: "aura",
    name: "AURA",
    price: 799,
    originalPrice: 1299,
    image: productAura,
    description: "A masterwork of olfactory architecture, featuring a proprietary blend of sustainably sourced essential oils and rare botanicals.",
    tags: ["Handcrafted", "Pure Oils", "45 Days"],
    discount: 38,
  },
  {
    id: "avora",
    name: "AVORA",
    price: 399,
    originalPrice: 599,
    image: productAvora,
    description: "A masterwork of olfactory architecture, featuring sustainably sourced essential oils and rare botanicals.",
    tags: ["Handcrafted", "Pure Oils", "45 Days"],
    discount: 33,
  },
];
