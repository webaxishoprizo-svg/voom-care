import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function isAuthed(req: VercelRequest): boolean {
  if (!ADMIN_PASSWORD) return false;
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (!token || token.length !== ADMIN_PASSWORD.length) return false;
  // constant-time compare
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return mismatch === 0;
}

function normProductId(pid: string) {
  const numeric = pid.includes('/') ? pid.split('/').pop()! : pid;
  const gid = pid.startsWith('gid://') ? pid : `gid://shopify/Product/${numeric}`;
  return { numeric, gid };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Auth (login endpoint via ?action=login is public)
  if (req.method === 'POST' && (req.query.action === 'login' || req.body?.action === 'login')) {
    const { password } = req.body || {};
    if (!ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
    if (password === ADMIN_PASSWORD) return res.status(200).json({ ok: true, token: ADMIN_PASSWORD });
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const type = ((req.query.type as string) || req.body?.type || 'product').toLowerCase();
    const table = type === 'brand' ? 'brand_reviews' : 'reviews';

    if (req.method === 'GET') {
      const status = (req.query.status as string) || 'all';
      let q = supabaseAdmin.from(table).select('*').order('created_at', { ascending: false }).limit(500);
      if (status !== 'all') q = q.eq('status', status);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json({ reviews: data || [] });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      if (type === 'brand') {
        const insert = {
          user_id: null,
          display_name: (body.displayName || 'Admin').toString().slice(0, 80),
          rating: Number(body.rating),
          review_text: String(body.review || '').slice(0, 2000),
          delivery_rating: body.deliveryRating ? Number(body.deliveryRating) : null,
          support_rating: body.supportRating ? Number(body.supportRating) : null,
          overall_rating: body.overallRating ? Number(body.overallRating) : Number(body.rating),
          source: 'curated',
          is_verified: false,
          is_featured: !!body.isFeatured,
          status: 'approved',
        };
        const { data, error } = await supabaseAdmin.from('brand_reviews').insert(insert).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
      if (!body.productId) return res.status(400).json({ error: 'productId required' });
      const { gid } = normProductId(String(body.productId));
      const insert = {
        user_id: null,
        display_name: (body.displayName || 'Admin').toString().slice(0, 80),
        product_id: gid,
        order_id: null,
        rating: Number(body.rating),
        review: String(body.review || '').slice(0, 2000),
        status: 'approved',
        source: 'admin',
        is_verified: false,
      };
      const { data, error } = await supabaseAdmin.from('reviews').insert(insert).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const allowed: Record<string, any> = {};
      const fields = type === 'brand'
        ? ['rating', 'review_text', 'display_name', 'status', 'is_featured', 'is_hidden', 'delivery_rating', 'support_rating', 'overall_rating']
        : ['rating', 'review', 'display_name', 'status'];
      for (const f of fields) if (f in updates) allowed[f] = updates[f];
      if (Object.keys(allowed).length === 0) return res.status(400).json({ error: 'No fields to update' });
      const { data, error } = await supabaseAdmin.from(table).update(allowed).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/admin/reviews]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
