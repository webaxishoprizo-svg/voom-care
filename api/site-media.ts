import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase.js';

// Public: returns all enabled hero slots keyed by slot name
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { data, error } = await supabaseAdmin
      .from('site_media')
      .select('slot, media_type, url, poster_url, alt, is_enabled')
      .eq('is_enabled', true);
    if (error) throw error;
    const map: Record<string, any> = {};
    (data || []).forEach((row) => { map[row.slot] = row; });
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ media: map });
  } catch (err: any) {
    console.error('[api/site-media]', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
