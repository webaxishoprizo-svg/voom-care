const DEFAULT_SHOPIFY_CONFIG = {
  domain: "nor-perfume-2.myshopify.com",
  apiVersion: "2024-04",
  accessToken: "597e532f7345926a95b019ced728a002",
  publicClientId: "d9d84aeb-8c67-483e-9cfe-a9bf59a8731f",
  shopId: "77660979223",
};

export const SHOPIFY_CONFIG = {
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || DEFAULT_SHOPIFY_CONFIG.domain,
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_CONFIG.apiVersion,
  accessToken: import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || DEFAULT_SHOPIFY_CONFIG.accessToken,
  publicClientId: DEFAULT_SHOPIFY_CONFIG.publicClientId,
  shopId: DEFAULT_SHOPIFY_CONFIG.shopId,
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
 */
export async function shopifyCustomerQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  accessToken: string,
) {
  // Use the standard high-performance endpoint
  const url = `https://shopify.com/${SHOPIFY_CONFIG.shopId}/account/customer/api/${SHOPIFY_CONFIG.apiVersion}/graphql`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("customer_token");
      window.location.replace("/login");
    }
    throw new Error(`Shopify API Error: ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<T>;
  if (payload.errors) throw new Error(payload.errors[0].message);
  return payload.data!;
}
