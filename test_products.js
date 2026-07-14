
const SHOPIFY_CONFIG = {
  domain: "checkout.voomcare.com",
  apiVersion: "2024-01",
  accessToken: "504cccb325162a0091bcf2bea3c35d16",
};

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

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
        url
        altText
      }
    }
  }
`;

const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

async function testShopify() {
  try {
    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
      },
      body: JSON.stringify({
        query: GET_PRODUCTS_QUERY,
        variables: { first: 5 }
      }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error("GraphQL Errors:", JSON.stringify(data.errors, null, 2));
    } else {
      console.log("Products count:", data.data.products.edges.length);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

testShopify();
