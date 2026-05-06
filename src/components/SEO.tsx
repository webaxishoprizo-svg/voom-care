import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonical,
  schema,
}: SEOProps) => {
  const baseTitle = "VOOM | Premium Car Care";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description || "VOOM by Frenzo Group — Premium car care products and professional-grade car detailing formulas. Crafted in India."
      );
    }

    // Update Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      if (keywords) {
        metaKeywords.setAttribute("content", keywords);
      }
    }

    // Update OG Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute(
        "content",
        description || "Professional-grade car wash, polish and detailing formulas."
      );
    }

    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute("content", ogImage);
    }

    const ogTypeTag = document.querySelector('meta[property="og:type"]');
    if (ogTypeTag) ogTypeTag.setAttribute("content", ogType);

    // Update Canonical
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (linkCanonical) {
        linkCanonical.setAttribute("href", canonical);
      } else {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        linkCanonical.setAttribute("href", canonical);
        document.head.appendChild(linkCanonical);
      }
    }

    // Update Schema
    if (schema) {
      const scriptId = "json-ld-schema";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    }
  }, [title, description, keywords, ogImage, ogType, canonical, fullTitle, schema]);

  return null;
};

export default SEO;
