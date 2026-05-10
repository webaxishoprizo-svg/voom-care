
CREATE TABLE public.brand_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  display_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  support_rating INT CHECK (support_rating >= 1 AND support_rating <= 5),
  overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT NOT NULL CHECK (source IN ('user','curated','imported')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX brand_reviews_user_id_unique
  ON public.brand_reviews(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX brand_reviews_visible_idx
  ON public.brand_reviews(is_hidden, is_featured, created_at DESC);

ALTER TABLE public.brand_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible brand reviews"
  ON public.brand_reviews FOR SELECT
  USING (is_hidden = FALSE OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admin/staff can update brand reviews"
  ON public.brand_reviews FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admin can delete brand reviews"
  ON public.brand_reviews FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin/staff can insert brand reviews"
  ON public.brand_reviews FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE TRIGGER update_brand_reviews_updated_at
  BEFORE UPDATE ON public.brand_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
