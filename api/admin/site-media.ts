import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function isAuthed(req: VercelRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (!token || token.length !== ADMIN_PASSWORD.length) return false;
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) mismatch |= token.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  return mismatch === 0;
}

const ALLOWED_SLOTS = ['hero_mobile_video', 'hero_desktop_video', 'hero_mobile_image', 'hero_desktop_image'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('site_media').select('*').order('slot');
      if (error) throw error;
      return res.status(200).json({ media: data || [] });
    }

    if (req.method === 'PUT') {
      const { slot, media_type, url, poster_url, alt, is_enabled } = req.body || {};
      if (!ALLOWED_SLOTS.includes(slot)) return res.status(400).json({ error: 'Invalid slot' });
      if (!media_type || !['video', 'image'].includes(media_type)) return res.status(400).json({ error: 'Invalid media_type' });
      if (!url) return res.status(400).json({ error: 'url required' });
      const row = {
        slot,
        media_type,
        url: String(url).slice(0, 2000),
        poster_url: poster_url ? String(poster_url).slice(0, 2000) : null,
        alt: alt ? String(alt).slice(0, 200) : null,
        is_enabled: is_enabled !== false,
      };
      const { data, error } = await supabaseAdmin
        .from('site_media')
        .upsert(row, { onConflict: 'slot' })
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const slot = (req.query.slot as string) || req.body?.slot;
      if (!slot) return res.status(400).json({ error: 'slot required' });
      const { error } = await supabaseAdmin.from('site_media').delete().eq('slot', slot);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/admin/site-media]', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
