
const SHOPIFY_CONFIG = {
  domain: "nor-perfume-2.myshopify.com",
  apiVersion: "2024-01",
  accessToken: "597e532f7345926a95b019ced728a002",
};

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

async function testShopify() {
  const query = `
    query {
      shop {
        name
        description
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

testShopify();
