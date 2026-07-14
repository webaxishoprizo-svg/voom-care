import fetch from "node-fetch";

const SHOPIFY_CONFIG = {
  domain: 'voom-9527.myshopify.com',
  apiVersion: '2024-04',
  accessToken: 'c67fc2fdbc1bc842d1ca4c21ee42d0fa',
};
const SHOPIFY_ENDPOINT = 'https://' + SHOPIFY_CONFIG.domain + '/api/' + SHOPIFY_CONFIG.apiVersion + '/graphql.json';

async function run() {
  const query = `
    query {
      products(first: 1) {
        edges {
          node {
            handle
            totalInventory
          }
        }
      }
    }
  `;
  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.accessToken
    },
    body: JSON.stringify({ query })
  });
  console.log(JSON.stringify(await res.json(), null, 2));
}
run();
