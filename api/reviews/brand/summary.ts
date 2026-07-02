import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../../src/lib/supabase.js';

let cached: { value: any; ts: number } | null = null;
const TTL_MS = 60_000;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    if (cached && Date.now() - cached.ts < TTL_MS) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(cached.value);
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
    cached = { value, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(value);
  } catch (err: any) {
    console.error('[api/reviews/brand/summary]', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
