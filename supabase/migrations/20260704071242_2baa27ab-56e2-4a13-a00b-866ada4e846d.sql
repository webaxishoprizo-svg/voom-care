
-- Site media (hero slots) — key/value store
CREATE TABLE public.site_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL CHECK (media_type IN ('video','image')),
  url TEXT NOT NULL,
  poster_url TEXT,
  alt TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_media TO anon;
GRANT SELECT ON public.site_media TO authenticated;
GRANT ALL ON public.site_media TO service_role;

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled site media"
  ON public.site_media FOR SELECT
  USING (is_enabled = true);

CREATE TRIGGER update_site_media_updated_at
  BEFORE UPDATE ON public.site_media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  video_url TEXT,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX blog_posts_published_idx ON public.blog_posts (is_published, published_at DESC);
