const DEFAULT_SHOPIFY_CONFIG = {
  domain: "nor-perfume-2.myshopify.com",
  apiVersion: "2024-01",
  accessToken: "597e532f7345926a95b019ced728a002",
};

function normalizeDomain(domain: string) {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

export const SHOPIFY_CONFIG = {
  domain: normalizeDomain(
    import.meta.env.VITE_SHOPIFY_DOMAIN || DEFAULT_SHOPIFY_CONFIG.domain,
  ),
  apiVersion:
    import.meta.env.VITE_SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_CONFIG.apiVersion,
  accessToken:
    import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || DEFAULT_SHOPIFY_CONFIG.accessToken,
};

// Ensure domain always ends with .myshopify.com if it's a shopify domain
const getFullDomain = (domain: string) => {
  if (!domain.includes(".") || (!domain.includes("myshopify.com") && !domain.includes("shopify.com") && domain.split(".").length === 1)) {
    return `${domain}.myshopify.com`;
  }
  return domain;
};

const normalizedDomain = getFullDomain(SHOPIFY_CONFIG.domain);
export const SHOPIFY_STORE_URL = `https://${normalizedDomain}`;
export const SHOPIFY_ENDPOINT = `${SHOPIFY_STORE_URL}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
export const SHOPIFY_ACCOUNT_URL = `${SHOPIFY_STORE_URL}/account`;
export const SHOPIFY_ORDERS_URL = `${SHOPIFY_STORE_URL}/account?view=orders`; // Shopify default orders view
export const SHOPIFY_LOGIN_URL = `${SHOPIFY_STORE_URL}/account/login`;
export const SHOPIFY_REGISTER_URL = `${SHOPIFY_STORE_URL}/account/register`;
export const SHOPIFY_LOGOUT_URL = `${SHOPIFY_STORE_URL}/account/logout`;

interface ShopifyGraphQLError {
  message: string;
}

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: ShopifyGraphQLError[];
}

export async function shopifyQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
) {
  try {
    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Shopify Error (${response.status}):`, errorText);
      throw new Error(`Shopify request failed with status ${response.status}. Check your Storefront Access Token and Domain.`);
    }

    const payload = (await response.json()) as ShopifyGraphQLResponse<T>;

    if (payload.errors?.length) {
      const errorMessages = payload.errors.map((error) => error.message).join("\n");
      console.error("Shopify GraphQL Errors:", errorMessages);
      throw new Error(errorMessages);
    }

    if (!payload.data) {
      throw new Error("Shopify returned an empty response.");
    }

    return payload.data;
  } catch (error) {
    console.error("Shopify Fetch Exception:", error);
    throw error;
  }
}
