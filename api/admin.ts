import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase.js';

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

// ==========================================
// BLOG ROUTE LOGIC
// ==========================================
function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

function pickPost(body: any) {
  return {
    slug: body.slug ? slugify(body.slug) : (body.title ? slugify(body.title) : ''),
    title: String(body.title || '').slice(0, 250),
    excerpt: body.excerpt ? String(body.excerpt).slice(0, 500) : null,
    content: body.content ? String(body.content).slice(0, 50000) : null,
    cover_image_url: body.cover_image_url || null,
    video_url: body.video_url || null,
    author: body.author ? String(body.author).slice(0, 120) : null,
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 15).map((t: any) => String(t).slice(0, 40)) : [],
    is_published: !!body.is_published,
    published_at: body.is_published ? (body.published_at || new Date().toISOString()) : null,
  };
}

async function handleBlog(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return res.status(200).json({ posts: data || [] });
  }

  if (req.method === 'POST') {
    const row = pickPost(req.body || {});
    if (!row.title || !row.slug) return res.status(400).json({ error: 'title and slug required' });
    const { data, error } = await supabaseAdmin.from('blog_posts').insert(row).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  }

  if (req.method === 'PATCH') {
    const { id, ...rest } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id required' });
    const row = pickPost(rest);
    if (!row.title || !row.slug) return res.status(400).json({ error: 'title and slug required' });
    const { data, error } = await supabaseAdmin.from('blog_posts').update(row).eq('id', id).select().single();
    if (error) throw error;
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) return res.status(400).json({ error: 'id required' });
    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ==========================================
// REVIEWS ROUTE LOGIC
// ==========================================
function normProductId(pid: string) {
  const numeric = pid.includes('/') ? pid.split('/').pop()! : pid;
  const gid = pid.startsWith('gid://') ? pid : `gid://shopify/Product/${numeric}`;
  return { numeric, gid };
}

async function handleReviews(req: VercelRequest, res: VercelResponse) {
  // Auth (login endpoint via ?action=login or ?route=reviews&action=login is public)
  if (req.method === 'POST' && (req.query.action === 'login' || req.body?.action === 'login')) {
    const { password } = req.body || {};
    if (!ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
    if (password === ADMIN_PASSWORD) return res.status(200).json({ ok: true, token: ADMIN_PASSWORD });
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });

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
}

// ==========================================
// SITE-MEDIA ROUTE LOGIC
// ==========================================
const ALLOWED_SLOTS = ['hero_mobile_video', 'hero_desktop_video', 'hero_mobile_image', 'hero_desktop_image'];

async function handleSiteMedia(req: VercelRequest, res: VercelResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });

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
}

// ==========================================
// MAIN HANDLER ROUTER
// ==========================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const route = req.query.route || req.body?.route;

  try {
    if (route === 'blog') {
      return await handleBlog(req, res);
    }
    if (route === 'reviews') {
      return await handleReviews(req, res);
    }
    if (route === 'site-media') {
      return await handleSiteMedia(req, res);
    }
    return res.status(400).json({ error: 'Invalid or missing route parameter' });
  } catch (err: any) {
    console.error(`[api/admin?route=${route}]`, err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
