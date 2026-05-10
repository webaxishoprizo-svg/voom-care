import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../../src/lib/supabase';
import { getCustomerIdFromToken } from '../../../src/lib/shopify/admin-verify';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') return handleGet(req, res);
    if (req.method === 'POST') return handlePost(req, res);
    if (req.method === 'PUT') return handlePut(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/reviews/brand] fatal:', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('brand_reviews')
    .select('id, display_name, rating, review_text, delivery_rating, support_rating, overall_rating, source, is_featured, is_verified, created_at', { count: 'exact' })
    .eq('is_hidden', false)
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

async function handlePost(req: VercelRequest, res: VercelResponse) {
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

async function handlePut(req: VercelRequest, res: VercelResponse) {
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
