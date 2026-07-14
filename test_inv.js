const fetch = require('node-fetch');
const SHOPIFY_CONFIG = {
  domain: 'checkout.voomcare.com',
  apiVersion: '2024-01',
  accessToken: '504cccb325162a0091bcf2bea3c35d16',
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
            variants(first:1) { edges { node { quantityAvailable } } }
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
