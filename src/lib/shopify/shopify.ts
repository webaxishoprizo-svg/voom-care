import { type CollectionCard, type HeroSlide, type Product } from "@/data/products";
import defaultHeroImage from "@/assets/hero-mask.jpg";
import { shopifyQuery } from "./client";

type Nullable<T> = T | null;

interface ShopifyImageNode {
  url: string;
  altText: Nullable<string>;
}

interface ShopifyMoneyNode {
  amount: string;
  currencyCode: string;
}

interface ShopifyVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyNode;
  compareAtPrice: Nullable<ShopifyMoneyNode>;
}

interface ShopifyMetafieldReference {
  image?: ShopifyImageNode;
  sources?: Array<{ url: string; mimeType: string }>;
  url?: string;
  mimeType?: string;
}

interface ShopifyMetafieldNode {
  key: string;
  namespace: string;
  value: string;
  reference?: Nullable<ShopifyMetafieldReference>;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  images: {
    edges: Array<{ node: ShopifyImageNode }>;
  };
  priceRange: {
    minVariantPrice: ShopifyMoneyNode;
  };
  variants: {
    edges: Array<{ node: ShopifyVariantNode }>;
  };
  heroImage: Nullable<ShopifyMetafieldNode>;
  heroMobileImage: Nullable<ShopifyMetafieldNode>;
  heroMobileVideo: Nullable<ShopifyMetafieldNode>;
  heroDescription: Nullable<ShopifyMetafieldNode>;
  metafields: Array<Nullable<ShopifyMetafieldNode>>;
}

interface ShopifyCollectionNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: Nullable<ShopifyImageNode>;
  products: {
    edges: Array<{
      node: Pick<
        ShopifyProductNode,
        "id" | "title" | "handle" | "heroImage" | "heroMobileImage" | "heroMobileVideo" | "heroDescription"
      >;
    }>;
  };
  heroImage: Nullable<ShopifyMetafieldNode>;
  heroMobileImage: Nullable<ShopifyMetafieldNode>;
  heroMobileVideo: Nullable<ShopifyMetafieldNode>;
  heroDescription: Nullable<ShopifyMetafieldNode>;
  metafields: Array<Nullable<ShopifyMetafieldNode>>;
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProductNode }>;
  };
}

interface ShopifyCollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollectionNode }>;
  };
}

interface ShopifyProductByHandleResponse {
  product: Nullable<ShopifyProductNode>;
}

const PRODUCT_METAFIELDS = `
  metafields(
    identifiers: [
      { namespace: "custom", key: "composition" }
      { namespace: "custom", key: "how_to_use" }
      { namespace: "custom", key: "whats_in_the_box" }
    ]
  ) {
    key
    namespace
    value
  }
`;

const HERO_METAFIELDS = `
  heroImage: metafield(namespace: "custom", key: "hero_image") {
    value
    reference {
      ... on MediaImage {
        image {
          url
        }
      }
    }
  }
  heroMobileImage: metafield(namespace: "custom", key: "hero_mobile_image") {
    value
    reference {
      ... on MediaImage {
        image {
          url
        }
      }
    }
  }
  heroMobileVideo: metafield(namespace: "custom", key: "hero_mobile_video") {
    value
    reference {
      ... on Video {
        sources {
          url
          mimeType
        }
      }
      ... on GenericFile {
        url
        mimeType
      }
    }
  }
  heroDescription: metafield(namespace: "custom", key: "hero_description") {
    value
  }
`;

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  availableForSale
  tags
  images(first: 6) {
    edges {
      node {
        url(transform: { maxWidth: 800, preferredContentType: WEBP })
        altText
      }
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  ${PRODUCT_METAFIELDS}
  ${HERO_METAFIELDS}
`;

const COLLECTION_FIELDS = `
  id
  title
  handle
  description
  image {
    url(transform: { maxWidth: 1200, preferredContentType: WEBP })
    altText
  }
  products(first: 12) {
    edges {
      node {
        id
        title
        handle
        ${HERO_METAFIELDS}
      }
    }
  }
  ${HERO_METAFIELDS}
`;

const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
    }
  }
`;

const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ${COLLECTION_FIELDS}
        }
      }
    }
  }
`;

function parseMoney(value?: Nullable<ShopifyMoneyNode>) {
  if (!value?.amount) return undefined;
  const amount = Number(value.amount);
  return Number.isFinite(amount) ? amount : undefined;
}

function calculateDiscount(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function flattenRichText(node: unknown): string[] {
  if (!node || typeof node !== "object") return [];

  if (Array.isArray(node)) {
    return node.flatMap(flattenRichText);
  }

  const value =
    "value" in node && typeof node.value === "string" ? node.value : undefined;
  const children =
    "children" in node && Array.isArray(node.children) ? flattenRichText(node.children) : [];
  const type = "type" in node && typeof node.type === "string" ? node.type : "";

  const lines = [...children];

  if (value) {
    lines.unshift(value);
  }

  if ((type === "paragraph" || type === "list-item") && lines.length) {
    lines.push("\n");
  }

  return lines;
}

function parseMetafieldText(raw?: string) {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    const text = flattenRichText(parsed)
      .join("")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return text || undefined;
  } catch {
    return raw.trim() || undefined;
  }
}

function getMetafieldMap(metafields: Array<Nullable<ShopifyMetafieldNode>>) {
  return metafields.reduce<Record<string, ShopifyMetafieldNode>>((acc, metafield) => {
    if (metafield) {
      acc[metafield.key] = metafield;
    }
    return acc;
  }, {});
}

function mapProduct(node: ShopifyProductNode): Product {
  const variant =
    node.variants.edges.find((edge) => edge.node.availableForSale)?.node ??
    node.variants.edges[0]?.node;
  const metafields = getMetafieldMap(node.metafields);
  const price = parseMoney(variant?.price) ?? parseMoney(node.priceRange.minVariantPrice) ?? 0;
  const originalPrice = parseMoney(variant?.compareAtPrice);
  const images = node.images.edges
    .map((edge) => edge.node.url)
    .filter((image): image is string => Boolean(image));

  return {
    id: node.handle,
    shopifyHandle: node.handle,
    shopifyId: node.id,
    variantId: variant?.id,
    name: node.title || node.handle,
    price,
    originalPrice,
    currencyCode:
      variant?.price.currencyCode ?? node.priceRange.minVariantPrice.currencyCode ?? "INR",
    image: images[0] || "",
    images,
    description: node.description || "",
    tags: node.tags,
    discount: calculateDiscount(price, originalPrice),
    availableForSale: node.availableForSale ?? variant?.availableForSale ?? true,
    details: {
      composition: parseMetafieldText(metafields.composition?.value),
      howToUse: parseMetafieldText(metafields.how_to_use?.value),
      whatsInTheBox: parseMetafieldText(metafields.whats_in_the_box?.value),
    },
    heroImage: node.heroImage?.reference?.image?.url || undefined,
    heroMobileImage:
      node.heroMobileImage?.reference?.image?.url || undefined,
    heroDescription: parseMetafieldText(node.heroDescription?.value),
    heroMobileVideo:
      node.heroMobileVideo?.reference?.sources?.[0]?.url || undefined,
    source: "shopify",
  };
}

function mapCollection(node: ShopifyCollectionNode): CollectionCard {
  const heroImage = node.heroImage;
  const heroMobileImage = node.heroMobileImage;
  const heroMobileVideo = node.heroMobileVideo;
  const heroDescription = node.heroDescription;

  return {
    id: node.id,
    title: node.title || node.handle,
    handle: node.handle,
    image:
      node.image?.url ||
      heroImage?.reference?.image?.url ||
      heroMobileImage?.reference?.image?.url ||
      "",
    description: node.description || parseMetafieldText(heroDescription?.value),
    products: node.products.edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      heroImage:
        edge.node.heroImage?.reference?.image?.url || undefined,
      heroMobileImage:
        edge.node.heroMobileImage?.reference?.image?.url || undefined,
      heroDescription: parseMetafieldText(edge.node.heroDescription?.value),
      heroMobileVideo:
        edge.node.heroMobileVideo?.reference?.sources?.[0]?.url || undefined,
    })),
    productHandles: node.products.edges.map((edge) => edge.node.handle),
    heroImage: heroImage?.reference?.image?.url || undefined,
    heroMobileImage:
      heroMobileImage?.reference?.image?.url || undefined,
    heroDescription: parseMetafieldText(heroDescription?.value),
    heroMobileVideo:
      heroMobileVideo?.reference?.sources?.[0]?.url || undefined,
  };
}

export async function fetchHybridProducts(limit = 20) {
  const data = await shopifyQuery<ShopifyProductsResponse>(GET_PRODUCTS_QUERY, { first: limit });
  return data.products.edges.map(({ node }) => mapProduct(node));
}

export async function fetchHybridCollections(limit = 20) {
  const data = await shopifyQuery<ShopifyCollectionsResponse>(GET_COLLECTIONS_QUERY, {
    first: limit,
  });

  return data.collections.edges.map(({ node }) => mapCollection(node));
}

export async function fetchHybridProduct(idOrHandle: string) {
  if (!idOrHandle) {
    return undefined;
  }

  const data = await shopifyQuery<ShopifyProductByHandleResponse>(GET_PRODUCT_BY_HANDLE_QUERY, {
    handle: idOrHandle,
  });

  if (!data.product) {
    return undefined;
  }

  return mapProduct(data.product);
}

export function buildHeroSlides(_products: Product[], collections: CollectionCard[]): HeroSlide[] {
  const heroCollection =
    collections.find((collection) => collection.handle === "hero-slider") ??
    collections.find((collection) => collection.title.toLowerCase() === "hero slider");

  if (!heroCollection) {
    return [];
  }

  const heroSlidesSource = heroCollection.products?.length
    ? heroCollection.products
    : [
      {
        id: heroCollection.id,
        title: heroCollection.title,
        handle: heroCollection.handle,
      },
    ];

  return heroSlidesSource
    .map((product) => {
      return {
        id: product.handle,
        title: product.title,
        subtitle: heroCollection.title,
        image:
          product.heroImage || heroCollection.heroImage || defaultHeroImage,
        mobileImage:
          product.heroMobileImage ||
          heroCollection.heroMobileImage ||
          product.heroImage ||
          heroCollection.heroImage ||
          defaultHeroImage,
        mobileVideo: product.heroMobileVideo || heroCollection.heroMobileVideo,
        description: product.heroDescription || heroCollection.heroDescription,
        ctaHref:
          product.handle && product.handle !== heroCollection.handle
            ? `/product/${product.handle}`
            : "/products",
      } satisfies HeroSlide;
    })
    .filter((slide) => Boolean(slide.image));
}
