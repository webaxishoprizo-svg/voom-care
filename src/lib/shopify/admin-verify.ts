/**
 * Shopify Admin API Utility for Purchase Verification
 */

const SHOP =
  process.env.SHOPIFY_DOMAIN ||
  process.env.VITE_SHOPIFY_DOMAIN ||
  process.env.SHOP;
const ADMIN_API_TOKEN =
  process.env.SHOPIFY_ADMIN_API_TOKEN || process.env.ADMIN_API_TOKEN;
const SHOP_ID =
  process.env.SHOPIFY_SHOP_ID || process.env.VITE_SHOPIFY_SHOP_ID;

/**
 * Resolves a Customer GID from an access token using the Customer Account API.
 */
export async function getCustomerIdFromToken(accessToken: string): Promise<string | null> {
  if (!SHOP_ID) {
    console.error('[getCustomerIdFromToken] SHOPIFY_SHOP_ID is missing');
    return null;
  }
  if (!accessToken) {
    console.error('[getCustomerIdFromToken] No access token provided');
    return null;
  }

  const query = `query { customer { id } }`;

  try {
    const response = await fetch(
      `https://shopify.com/${SHOP_ID}/account/customer/api/2024-10/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({ query }),
      },
    );

    const result = await response.json();
    if (result.errors) {
      console.error('[getCustomerIdFromToken] GraphQL errors:', JSON.stringify(result.errors));
    }
    const id = result.data?.customer?.id || null;
    if (!id) console.warn('[getCustomerIdFromToken] No customer id resolved');
    return id;
  } catch (error) {
    console.error('[getCustomerIdFromToken] Error:', error);
    return null;
  }
}

/**
 * Verifies if a customer has purchased a specific product.
 * Returns the order ID if found, otherwise null.
 */
export async function verifyPurchase(customerId: string, productId: string): Promise<string | null> {
  if (!ADMIN_API_TOKEN) {
    console.error('[verifyPurchase] ADMIN_API_TOKEN is not set');
    return null;
  }
  if (!SHOP) {
    console.error('[verifyPurchase] SHOP domain is not set');
    return null;
  }
  if (!customerId || !productId) {
    console.error('[verifyPurchase] Missing customerId or productId', { customerId, productId });
    return null;
  }

  // Normalize productId so both numeric and GID inputs match.
  const numericProductId = productId.includes('/') ? productId.split('/').pop()! : productId;
  const gidProductId = productId.startsWith('gid://')
    ? productId
    : `gid://shopify/Product/${numericProductId}`;

  // Query for ANY order (paid, pending, fulfilled) – review eligibility shouldn't
  // require the order to be shipped. We just need a confirmed purchase.
  const query = `
    query getCustomerOrders($customerId: ID!) {
      customer(id: $customerId) {
        orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              displayFinancialStatus
              lineItems(first: 50) {
                edges {
                  node {
                    product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { customerId },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('[verifyPurchase] Shopify Admin API Error:', JSON.stringify(result.errors));
      return null;
    }

    const orders = result.data?.customer?.orders?.edges || [];
    console.log(`[verifyPurchase] Found ${orders.length} orders for customer ${customerId}, looking for product ${gidProductId}`);

    for (const orderEdge of orders) {
      const order = orderEdge.node;
      // Reject voided/refunded-only purchases
      const status = (order.displayFinancialStatus || '').toUpperCase();
      if (status === 'VOIDED' || status === 'REFUNDED') continue;

      const lineItems = order.lineItems?.edges || [];
      const hasProduct = lineItems.some((item: any) => {
        const lineProductId = item.node?.product?.id;
        if (!lineProductId) return false;
        return lineProductId === gidProductId || lineProductId.endsWith(`/${numericProductId}`);
      });

      if (hasProduct) {
        console.log(`[verifyPurchase] Match found in order ${order.id}`);
        return order.id;
      }
    }

    console.log('[verifyPurchase] No matching order found');
    return null;
  } catch (error) {
    console.error('[verifyPurchase] Error:', error);
    return null;
  }
}

/**
 * Validates a specific order directly if we have the order ID.
 */
export async function verifyOrderProduct(orderId: string, productId: string): Promise<boolean> {
  if (!ADMIN_API_TOKEN) return false;

  const query = `
    query getOrder($orderId: ID!) {
      order(id: $orderId) {
        lineItems(first: 50) {
          edges {
            node {
              product {
                id
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { orderId },
      }),
    });

    const result = await response.json();
    const lineItems = result.data?.order?.lineItems?.edges || [];
    
    return lineItems.some((item: any) => item.node.product?.id === productId);
  } catch (error) {
    return false;
  }
}
