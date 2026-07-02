/**
 * Shopify Admin API Utility for Purchase Verification
 */

const SHOP =
  process.env.SHOPIFY_DOMAIN ||
  process.env.VITE_SHOPIFY_DOMAIN ||
  process.env.SHOP ||
  'shop.voomcare.com';
const ADMIN_API_TOKEN =
  process.env.SHOPIFY_ADMIN_API_TOKEN || process.env.ADMIN_API_TOKEN;
const SHOP_ID =
  process.env.SHOPIFY_SHOP_ID || process.env.VITE_SHOPIFY_SHOP_ID || '72008532077';

function normalizeProductId(productId: string) {
  const numeric = productId.includes('/') ? productId.split('/').pop()! : productId;
  const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${numeric}`;
  return { numeric, gid };
}

function isReviewableOrderStatus(status?: string | null) {
  const normalized = (status || '').toUpperCase();
  return normalized !== 'VOIDED' && normalized !== 'REFUNDED' && normalized !== 'CANCELLED';
}

async function customerAccountRequest<T>(accessToken: string, query: string): Promise<T | null> {
  const token = accessToken.trim();
  const authorizationHeaders = token.toLowerCase().startsWith('bearer ')
    ? [token]
    : [token, `Bearer ${token}`];

  for (const authorization of authorizationHeaders) {
    const response = await fetch(
      `https://shopify.com/${SHOP_ID}/account/customer/api/2024-10/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({ query }),
      },
    );

    const result = await response.json();
    if (response.status === 401 || response.status === 403) continue;
    if (result.errors) {
      console.error('[customerAccountRequest] GraphQL errors:', JSON.stringify(result.errors));
      return null;
    }

    return result.data as T;
  }

  console.warn('[customerAccountRequest] Customer token was rejected');
  return null;
}

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
    const data = await customerAccountRequest<{ customer?: { id?: string } }>(accessToken, query);
    const id = data?.customer?.id || null;
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
  const { numeric: numericProductId, gid: gidProductId } = normalizeProductId(productId);

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
      if (!isReviewableOrderStatus(order.displayFinancialStatus)) continue;

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
 * Verifies a purchase directly from the logged-in customer's Customer Account API.
 * This is the primary path used for showing the review button because it does not
 * depend on Admin API customer/order lookup permissions.
 */
export async function verifyPurchaseFromToken(accessToken: string, productId: string): Promise<{ customerId: string; orderId: string } | null> {
  if (!accessToken || !productId) return null;

  const { numeric: numericProductId, gid: gidProductId } = normalizeProductId(productId);
  const query = `
    query CustomerReviewEligibility {
      customer {
        id
        orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            financialStatus
            fulfillments(first: 10) {
              status
              fulfillmentLineItems(first: 50) {
                nodes {
                  quantity
                  lineItem { productId }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await customerAccountRequest<{
      customer?: {
        id?: string;
        orders?: {
          nodes?: Array<{
            id: string;
            financialStatus?: string | null;
            fulfillments?: Array<{
              status?: string | null;
              fulfillmentLineItems?: { nodes?: Array<{ quantity?: number; lineItem?: { productId?: string | null } }> };
            }>;
          }>;
        };
      };
    }>(accessToken, query);

    const customerId = data?.customer?.id;
    const orders = data?.customer?.orders?.nodes || [];
    if (!customerId) return null;

    const matchesProduct = (pid?: string | null) =>
      !!pid && (pid === gidProductId || pid.endsWith(`/${numericProductId}`));

    for (const order of orders) {
      if (!isReviewableOrderStatus(order.financialStatus)) continue;
      const fulfillments = order.fulfillments || [];
      for (const f of fulfillments) {
        const status = (f.status || '').toUpperCase();
        if (status !== 'SUCCESS' && status !== 'FULFILLED') continue;
        const items = f.fulfillmentLineItems?.nodes || [];
        if (items.some((it) => matchesProduct(it.lineItem?.productId))) {
          return { customerId, orderId: order.id };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('[verifyPurchaseFromToken] Error:', error);
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
