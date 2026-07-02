import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { verifyPurchaseFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { rating, review, productId, customerId, displayName, token } = req.body || {};
  if (!rating || !review || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' });
  }
  const text = String(review).trim().slice(0, 1500);
  if (text.length < 5) return res.status(400).json({ error: 'Review too short' });
  const name = displayName ? String(displayName).trim().slice(0, 60) : null;

  const numericProduct = String(productId).includes('/')
    ? String(productId).split('/').pop()!
    : String(productId);
  const gidProduct = String(productId).startsWith('gid://')
    ? String(productId)
    : `gid://shopify/Product/${numericProduct}`;

  try {
    let finalCustomerId: string | null = null;
    let finalOrderId: string | null = null;

    // 1) One-time review token path (email link)
    if (token) {
      const { data: tokenData } = await supabaseAdmin
        .from('review_tokens')
        .select('*')
        .eq('token', token)
        .maybeSingle();
      if (!tokenData) return res.status(401).json({ error: 'Invalid or expired token' });
      if (tokenData.used) return res.status(401).json({ error: 'Token already used' });
      if (new Date(tokenData.expires_at) < new Date()) return res.status(401).json({ error: 'Token expired' });
      const tp = String(tokenData.product_id).includes('/')
        ? String(tokenData.product_id).split('/').pop()
        : String(tokenData.product_id);
      if (tp !== numericProduct) return res.status(400).json({ error: 'Token does not match product' });
      finalCustomerId = tokenData.user_id;
      finalOrderId = tokenData.order_id;
    }
    // 2) Logged-in customer path (Customer Account API — must be fulfilled)
    else if (customerId) {
      const purchase = await verifyPurchaseFromToken(customerId, gidProduct);
      if (!purchase) return res.status(403).json({ error: 'Only customers with a fulfilled order for this product can review' });
      finalCustomerId = purchase.customerId;
      finalOrderId = purchase.orderId;
    } else {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Prevent duplicates
    const { data: existing } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('user_id', finalCustomerId)
      .in('product_id', [gidProduct, numericProduct])
      .maybeSingle();
    if (existing) return res.status(400).json({ error: 'You have already reviewed this product' });

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{
        user_id: finalCustomerId,
        display_name: name,
        product_id: gidProduct,
        order_id: finalOrderId,
        rating: r,
        review: text,
        status: 'approved',
        source: 'user',
        is_verified: true,
      }])
      .select()
      .single();

    if (error) throw error;

    if (token) {
      await supabaseAdmin.from('review_tokens').update({ used: true }).eq('token', token);
    }

    return res.status(201).json(data);
  } catch (err: any) {
    console.error('Submit review error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
