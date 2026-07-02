
-- Product reviews table (used by product pages)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,                       -- Shopify customer GID (nullable for admin-added)
  display_name TEXT,
  product_id TEXT NOT NULL,           -- Shopify product GID
  order_id TEXT,                      -- Shopify order GID (nullable for admin-added)
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved','pending','rejected')),
  source TEXT NOT NULL DEFAULT 'user' CHECK (source IN ('user','admin','imported')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_product_unique
  ON public.reviews(user_id, product_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reviews_product_status_idx ON public.reviews(product_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews; writes are service-role only (via API)
CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add moderation status to brand_reviews
ALTER TABLE public.brand_reviews
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
  CHECK (status IN ('approved','pending','rejected'));

CREATE INDEX IF NOT EXISTS brand_reviews_status_idx ON public.brand_reviews(status);
