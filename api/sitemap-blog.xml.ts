import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase.js';

// Dynamic sitemap for published blog posts
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('slug, updated_at, published_at, created_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false });
    if (error) throw error;

    const urls = (data || [])
      .map((p) => {
        const lastmod = new Date(
          p.updated_at || p.published_at || p.created_at,
        ).toISOString();
        return `  <url>\n    <loc>https://voomcare.com/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('[api/sitemap-blog]', err);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
}
