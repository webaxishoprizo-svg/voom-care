import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product_id, page = '1', limit = '10' } = req.query;

  if (!product_id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const rawProduct = product_id as string;
  const numericProduct = rawProduct.includes('/') ? rawProduct.split('/').pop()! : rawProduct;
  const gidProduct = rawProduct.startsWith('gid://')
    ? rawProduct
    : `gid://shopify/Product/${numericProduct}`;
  const productIds = [gidProduct, numericProduct];

  const p = parseInt(page as string);
  const l = parseInt(limit as string);
  const from = (p - 1) * l;
  const to = from + l - 1;

  try {
    // Only approved reviews are visible publicly
    const { data: reviews, error, count } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact' })
      .in('product_id', productIds)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .in('product_id', productIds)
      .eq('status', 'approved');

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
