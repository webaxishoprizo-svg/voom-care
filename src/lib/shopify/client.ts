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

export const SHOPIFY_ENDPOINT = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

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
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("\n"));
  }

  if (!payload.data) {
    throw new Error("Shopify returned an empty response.");
  }

  return payload.data;
}
