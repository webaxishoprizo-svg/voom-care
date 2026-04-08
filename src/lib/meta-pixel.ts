/**
 * Meta Pixel Utility for NOR
 * This helps track conversions and user actions on Facebook/Instagram.
 */

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Pixel ID placeholder (User to update this)
export const PIXEL_ID = "827163549102837"; 

export const trackPageView = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

export const trackViewContent = (product: any) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_name: product.name,
      content_category: "Car Fragrance",
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: product.currencyCode || "INR",
    });
  }
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price * quantity,
      currency: product.currencyCode || "INR",
    });
  }
};

export const trackInitiateCheckout = (items: any[], total: number) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map(item => item.product.id),
      content_type: "product",
      value: total,
      currency: "INR",
      num_items: items.length
    });
  }
};

export const trackContact = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact");
  }
};
