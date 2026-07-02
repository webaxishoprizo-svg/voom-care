import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { verifyPurchaseFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product_id, customer_id } = req.query;
  if (!product_id || !customer_id) {
    return res.status(200).json({ eligible: false, reason: 'Auth required' });
  }

  try {
    const rawProduct = product_id as string;
    const numericProduct = rawProduct.includes('/') ? rawProduct.split('/').pop()! : rawProduct;
    const gidProduct = rawProduct.startsWith('gid://')
      ? rawProduct
      : `gid://shopify/Product/${numericProduct}`;

    // Customer Account API — must be fulfilled to be eligible
    const purchase = await verifyPurchaseFromToken(customer_id as string, gidProduct);
    if (!purchase) {
      return res.status(200).json({
        eligible: false,
        reason: 'No fulfilled order for this product',
      });
    }

    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('user_id', purchase.customerId)
      .in('product_id', [gidProduct, numericProduct])
      .maybeSingle();

    return res.status(200).json({
      eligible: true,
      hasReviewed: !!existingReview,
      existingReview,
      resolvedId: purchase.customerId,
      verifiedOrderId: purchase.orderId,
    });
  } catch (error: any) {
    console.error('Eligibility check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
