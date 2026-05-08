import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase';
import { verifyPurchase, getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product_id, customer_id } = req.query;

  if (!product_id || !customer_id) {
    return res.status(200).json({ eligible: false, reason: 'Auth required' });
  }

  try {
    // 1. Resolve accessToken to GID
    const resolvedId = await getCustomerIdFromToken(customer_id as string);
    if (!resolvedId) {
      return res.status(200).json({ eligible: false, reason: 'Invalid session' });
    }

    // Normalize product id – store reviews against the GID consistently
    const rawProduct = product_id as string;
    const numericProduct = rawProduct.includes('/') ? rawProduct.split('/').pop()! : rawProduct;
    const gidProduct = rawProduct.startsWith('gid://')
      ? rawProduct
      : `gid://shopify/Product/${numericProduct}`;

    // 2. Check for existing review (match either format that may have been stored)
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('user_id', resolvedId)
      .in('product_id', [gidProduct, numericProduct])
      .maybeSingle();

    // 3. Verify purchase history
    const verifiedOrderId = await verifyPurchase(resolvedId, gidProduct);

    return res.status(200).json({
      eligible: !!verifiedOrderId,
      hasReviewed: !!existingReview,
      existingReview,
      resolvedId
    });
  } catch (error: any) {
    console.error('Eligibility check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
