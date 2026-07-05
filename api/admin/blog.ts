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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
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
  } catch (err: any) {
    console.error('[api/admin/blog]', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
