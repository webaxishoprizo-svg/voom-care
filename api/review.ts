import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase.js';
import { getCustomerIdFromToken, verifyPurchaseFromToken } from '../src/lib/shopify/admin-verify.js';

// ==========================================
// DELETE ROUTE LOGIC
// ==========================================
async function handleDelete(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, customerId } = req.body;
  if (!id || !customerId) {
    return res.status(400).json({ error: 'Review ID and Customer ID are required' });
  }

  // 1. Resolve accessToken to GID
  const resolvedId = await getCustomerIdFromToken(customerId);
  if (!resolvedId) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  // 2. Verify ownership
  const { data: existingReview, error: fetchError } = await supabaseAdmin
    .from('reviews')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingReview) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (existingReview.user_id !== resolvedId) {
    return res.status(403).json({ error: 'You are not authorized to delete this review' });
  }

  // 3. Delete
  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return res.status(200).json({ message: 'Review deleted successfully' });
}

// ==========================================
// ELIGIBILITY ROUTE LOGIC
// ==========================================
async function handleEligibility(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product_id, customer_id } = req.query;
  if (!product_id || !customer_id) {
    return res.status(200).json({ eligible: false, reason: 'Auth required' });
  }

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
}

// ==========================================
// SUBMIT ROUTE LOGIC
// ==========================================
async function handleSubmit(req: VercelRequest, res: VercelResponse) {
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
}

// ==========================================
// UPDATE ROUTE LOGIC
// ==========================================
async function handleUpdate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, rating, review, customerId } = req.body;
  if (!id || !customerId) {
    return res.status(400).json({ error: 'Review ID and Customer ID are required' });
  }

  // 1. Resolve accessToken to GID
  const resolvedId = await getCustomerIdFromToken(customerId);
  if (!resolvedId) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  // 2. Verify ownership
  const { data: existingReview, error: fetchError } = await supabaseAdmin
    .from('reviews')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingReview) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (existingReview.user_id !== resolvedId) {
    return res.status(403).json({ error: 'You are not authorized to edit this review' });
  }

  // 3. Update
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .update({ rating, review, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return res.status(200).json(data);
}

// ==========================================
// VALIDATE-TOKEN ROUTE LOGIC
// ==========================================
async function handleValidateToken(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const { data, error } = await supabaseAdmin
    .from('review_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    return res.status(404).json({ valid: false, error: 'Invalid token' });
  }

  if (data.used) {
    return res.status(400).json({ valid: false, error: 'Token already used' });
  }

  if (new Date(data.expires_at) < new Date()) {
    return res.status(400).json({ valid: false, error: 'Token expired' });
  }

  return res.status(200).json({ 
    valid: true, 
    productId: data.product_id,
    orderId: data.order_id,
    userId: data.user_id
  });
}

// ==========================================
// MAIN HANDLER ROUTER
// ==========================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const route = req.query.route || req.body?.route;

  try {
    if (route === 'delete') {
      return await handleDelete(req, res);
    }
    if (route === 'eligibility') {
      return await handleEligibility(req, res);
    }
    if (route === 'submit') {
      return await handleSubmit(req, res);
    }
    if (route === 'update') {
      return await handleUpdate(req, res);
    }
    if (route === 'validate-token') {
      return await handleValidateToken(req, res);
    }
    return res.status(400).json({ error: 'Invalid or missing route parameter' });
  } catch (err: any) {
    console.error(`[api/review?route=${route}]`, err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
