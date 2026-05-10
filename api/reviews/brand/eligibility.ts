import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../../src/lib/supabase';
import { getCustomerIdFromToken } from '../../../src/lib/shopify/admin-verify';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const accessToken = (req.query.token as string) || '';
  if (!accessToken) {
    return res.status(200).json({ canSubmit: false, reason: 'unauthenticated', existingReview: null });
  }

  try {
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
  } catch (err: any) {
    console.error('[brand/eligibility]', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
