import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase.js';
import { getCustomerIdFromToken } from '../src/lib/shopify/admin-verify.js';

const MAX_REVIEW_LENGTH = 1000;
const MIN_REVIEW_LENGTH = 10;

function validateRating(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

function sanitizeText(input: unknown, max = MAX_REVIEW_LENGTH): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, max);
}

// ==========================================
// ELIGIBILITY LOGIC
// ==========================================
async function handleEligibility(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const accessToken = (req.query.token as string) || '';
  if (!accessToken) {
    return res.status(200).json({ canSubmit: false, reason: 'unauthenticated', existingReview: null });
  }

  const customerGid = await getCustomerIdFromToken(accessToken);
  if (!customerGid) {
    return res.status(200).json({ canSubmit: false, reason: 'invalid_session', existingReview: null });
  }

  const { data: existing } = await supabaseAdmin
    .from('brand_reviews')
    .select('id, rating, review_text, delivery_rating, support_rating, overall_rating, display_name, source, created_at')
    .eq('user_id', customerGid)
    .maybeSingle();

  if (existing) {
    return res.status(200).json({ canSubmit: false, reason: 'already_reviewed', existingReview: existing, customerGid });
  }

  return res.status(200).json({ canSubmit: true, existingReview: null, customerGid });
}

// ==========================================
// SUMMARY LOGIC
// ==========================================
let summaryCached: { value: any; ts: number } | null = null;
const TTL_MS = 60_000;

async function handleSummary(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (summaryCached && Date.now() - summaryCached.ts < TTL_MS) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(summaryCached.value);
  }

  const { data, error, count } = await supabaseAdmin
    .from('brand_reviews')
    .select('rating', { count: 'exact' })
    .eq('is_hidden', false)
    .eq('status', 'approved');

  if (error) throw error;

  const total = count || 0;
  const sum = (data || []).reduce((acc, r: any) => acc + (r.rating || 0), 0);
  const average = total > 0 ? Number((sum / total).toFixed(1)) : 0;

  const breakdown = [1, 2, 3, 4, 5].reduce<Record<number, number>>((acc, n) => {
    acc[n] = (data || []).filter((r: any) => r.rating === n).length;
    return acc;
  }, {});

  const value = { averageRating: average, totalReviews: total, breakdown };
  summaryCached = { value, ts: Date.now() };
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(value);
}

// ==========================================
// INDEX (GET, POST, PUT) LOGIC
// ==========================================
async function handleIndexGet(req: VercelRequest, res: VercelResponse) {
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('brand_reviews')
    .select('id, display_name, rating, review_text, delivery_rating, support_rating, overall_rating, source, is_featured, is_verified, created_at', { count: 'exact' })
    .eq('is_hidden', false)
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
  return res.status(200).json({
    reviews: data || [],
    pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) },
  });
}

async function handleIndexPost(req: VercelRequest, res: VercelResponse) {
  const { customerId: accessToken, rating, review, deliveryRating, supportRating, overallRating, displayName } = req.body || {};

  if (!accessToken) return res.status(401).json({ error: 'Authentication required' });

  const r = validateRating(rating);
  const text = sanitizeText(review);
  if (!r) return res.status(400).json({ error: 'Rating must be an integer 1-5' });
  if (text.length < MIN_REVIEW_LENGTH) return res.status(400).json({ error: `Review must be at least ${MIN_REVIEW_LENGTH} characters` });

  const customerGid = await getCustomerIdFromToken(accessToken);
  if (!customerGid) return res.status(401).json({ error: 'Invalid or expired session' });

  // Reject duplicates
  const { data: existing } = await supabaseAdmin
    .from('brand_reviews')
    .select('id')
    .eq('user_id', customerGid)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'You have already submitted a brand review. Please edit it instead.' });
  }

  const { data, error } = await supabaseAdmin
    .from('brand_reviews')
    .insert({
      user_id: customerGid,
      display_name: sanitizeText(displayName, 80) || null,
      rating: r,
      review_text: text,
      delivery_rating: validateRating(deliveryRating),
      support_rating: validateRating(supportRating),
      overall_rating: validateRating(overallRating) ?? r,
      source: 'user',
      is_verified: true,
    })
    .select()
    .single();

  if (error) throw error;
  return res.status(201).json(data);
}

async function handleIndexPut(req: VercelRequest, res: VercelResponse) {
  const { customerId: accessToken, rating, review, deliveryRating, supportRating, overallRating, displayName } = req.body || {};
  if (!accessToken) return res.status(401).json({ error: 'Authentication required' });

  const r = validateRating(rating);
  const text = sanitizeText(review);
  if (!r) return res.status(400).json({ error: 'Rating must be an integer 1-5' });
  if (text.length < MIN_REVIEW_LENGTH) return res.status(400).json({ error: `Review must be at least ${MIN_REVIEW_LENGTH} characters` });

  const customerGid = await getCustomerIdFromToken(accessToken);
  if (!customerGid) return res.status(401).json({ error: 'Invalid or expired session' });

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from('brand_reviews')
    .select('id, source')
    .eq('user_id', customerGid)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (!existing) return res.status(404).json({ error: 'No existing review to update' });
  if (existing.source !== 'user') return res.status(403).json({ error: 'This review cannot be edited' });

  const { data, error } = await supabaseAdmin
    .from('brand_reviews')
    .update({
      rating: r,
      review_text: text,
      delivery_rating: validateRating(deliveryRating),
      support_rating: validateRating(supportRating),
      overall_rating: validateRating(overallRating) ?? r,
      display_name: sanitizeText(displayName, 80) || null,
    })
    .eq('id', existing.id)
    .select()
    .single();

  if (error) throw error;
  return res.status(200).json(data);
}

// ==========================================
// MAIN HANDLER ROUTER
// ==========================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const route = req.query.route || req.body?.route;

  try {
    if (route === 'eligibility') {
      return await handleEligibility(req, res);
    }
    if (route === 'summary') {
      return await handleSummary(req, res);
    }
    if (route === 'index' || !route) {
      if (req.method === 'GET') return await handleIndexGet(req, res);
      if (req.method === 'POST') return await handleIndexPost(req, res);
      if (req.method === 'PUT') return await handleIndexPut(req, res);
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return res.status(400).json({ error: 'Invalid or missing route parameter' });
  } catch (err: any) {
    console.error(`[api/reviews-brand?route=${route}] fatal:`, err);
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    return res.status(500).json({
      error: err?.message || 'Internal server error',
      code: err?.code,
      details: err?.details,
      hint: err?.hint,
      env: { hasUrl, hasKey },
    });
  }
}
