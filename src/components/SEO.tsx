import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: object | object[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

const SITE_URL = "https://voomcare.com";
const DEFAULT_OG = "https://voomcare.com/og-image.jpg";

const upsertMeta = (
  attr: "name" | "property",
  key: string,
  value: string,
) => {
  if (!value) return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const upsertLink = (rel: string, href: string) => {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonical,
  schema,
  author,
  publishedTime,
  modifiedTime,
  noIndex,
}: SEOProps) => {
  const baseTitle = "VOOM® | Premium Car Care";
  const fullTitle = title ? (title.includes("VOOM") ? title : `${title} | VOOM® Official`) : baseTitle;
  const defaultKeywords = "voom, voomcare, car care, voom car products, car shampoo, tire polish, dash clean, car product, premium car detailing";
  const desc =
    description ||
    "VOOM® by Frenzo Group — India's premium car care brand. Discover professional-grade voom car products including car shampoo, tire polish, and dash clean. Shine Beyond Ordinary.";
  const image = ogImage || DEFAULT_OG;
  const url = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${SITE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`
    : typeof window !== "undefined"
      ? `${SITE_URL}${window.location.pathname}`
      : SITE_URL;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta("name", "description", desc);
    upsertMeta("name", "keywords", keywords || defaultKeywords);
    if (author) upsertMeta("name", "author", author);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Open Graph
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", title || "VOOM Care");
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", "VOOM Care");
    upsertMeta("property", "og:locale", "en_IN");

    if (publishedTime) upsertMeta("property", "article:published_time", publishedTime);
    if (modifiedTime) upsertMeta("property", "article:modified_time", modifiedTime);
    if (author && ogType === "article") upsertMeta("property", "article:author", author);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:site", "@voomcare");

    // Canonical
    upsertLink("canonical", url);

    // JSON-LD schema (array or single)
    const scriptId = "json-ld-schema";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    } else if (script) {
      script.remove();
    }
  }, [
    fullTitle,
    desc,
    keywords,
    image,
    ogType,
    url,
    author,
    publishedTime,
    modifiedTime,
    noIndex,
    schema,
  ]);

  return null;
};

export default SEO;
