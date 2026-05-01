
const SHOPIFY_CONFIG = {
  domain: "shop.voomcare.com",
  apiVersion: "2024-01",
  accessToken: "504cccb325162a0091bcf2bea3c35d16",
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
