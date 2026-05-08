import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product_id, page = '1', limit = '10' } = req.query;

  if (!product_id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const productIdStr = product_id as string;
  const p = parseInt(page as string);
  const l = parseInt(limit as string);
  const from = (p - 1) * l;
  const to = from + l - 1;

  try {
    // 1. Get real reviews from Supabase
    const { data: reviews, error, count } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productIdStr)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // 2. Get stats
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('product_id', productIdStr);

    if (statsError) throw statsError;

    const totalRating = statsData.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    const averageRating = statsData.length > 0 ? (totalRating / statsData.length).toFixed(1) : 0;

    return res.status(200).json({
      reviews,
      pagination: {
        total: count,
        page: p,
        limit: l,
        pages: Math.ceil((count || 0) / l)
      },
      stats: {
        averageRating: parseFloat(averageRating as string),
        totalReviews: count || 0
      }
    });
  } catch (error: any) {
    console.error('Reviews API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
