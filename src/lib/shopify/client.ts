const DEFAULT_SHOPIFY_CONFIG = {
  domain: "shop.voomcare.com",
  apiVersion: "2024-04",
  accessToken: "59591aa3cb16515b8e0f371e63cc676c",
  publicClientId: "5d7f5bc8-8c63-40d0-b0ff-c373903ee7e1",
  shopId: "80446095593",
};

export const SHOPIFY_CONFIG = {
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || DEFAULT_SHOPIFY_CONFIG.domain,
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_CONFIG.apiVersion,
  accessToken: import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || DEFAULT_SHOPIFY_CONFIG.accessToken,
  publicClientId: import.meta.env.VITE_SHOPIFY_PUBLIC_CLIENT_ID || DEFAULT_SHOPIFY_CONFIG.publicClientId,
  shopId: import.meta.env.VITE_SHOPIFY_SHOP_ID || DEFAULT_SHOPIFY_CONFIG.shopId,
};

export const SHOPIFY_STORE_URL = `https://${SHOPIFY_CONFIG.domain}`;
export const SHOPIFY_ENDPOINT = `${SHOPIFY_STORE_URL}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
export const SHOPIFY_ACCOUNT_URL = `${SHOPIFY_STORE_URL}/account`;
export const SHOPIFY_ORDERS_URL = `${SHOPIFY_STORE_URL}/account/orders`;
export const SHOPIFY_LOGIN_URL = `${SHOPIFY_STORE_URL}/account/login`;


interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function shopifyQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
) {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as ShopifyGraphQLResponse<T>;
  if (payload.errors) throw new Error(payload.errors[0].message);
  return payload.data!;
}

/**
 * 🔐 SHOPIFY CUSTOMER ACCOUNT API QUERY
 * Note: Prefer the more robust customerQuery from customer-account.ts
 */
export async function shopifyCustomerQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  accessToken: string,
) {
  // Customer Account API uses its own versioning, typically ahead of Storefront API
  const CUSTOMER_API_VERSION = "2024-10";
  const url = `https://shopify.com/${SHOPIFY_CONFIG.shopId}/account/customer/api/${CUSTOMER_API_VERSION}/graphql`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Shopify Customer Account API requires the raw token (no "Bearer " prefix)
      "Authorization": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("customer_token");
      window.location.replace("/login");
    }
    throw new Error(`System API Error: ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<T>;
  if (payload.errors) throw new Error(payload.errors[0].message);
  return payload.data!;
}
