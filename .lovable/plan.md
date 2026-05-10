## Brand Review System (Home Page) — Implementation Plan

A new **brand-level** review system, completely separate from the existing product reviews. Verified Shopify customers can submit one brand review (delivery, support, overall satisfaction). Admin can add curated/imported testimonials. UI replaces the static `TestimonialsSection` data source on the home page (no design changes).

---

### 1. Database (Supabase migration)

New table `brand_reviews`:
- `id` uuid PK
- `user_id` text UNIQUE NOT NULL — Shopify customer GID (nullable for curated/imported)
- `display_name` text — shown on card
- `rating` int (1–5)
- `review_text` text
- `delivery_rating` int (1–5)
- `support_rating` int (1–5)
- `overall_rating` int (1–5)
- `is_verified` bool default true
- `is_featured` bool default false
- `is_hidden` bool default false
- `source` text check in ('user','curated','imported')
- `created_at`, `updated_at` timestamptz

RLS:
- SELECT: anyone where `is_hidden = false`
- INSERT/UPDATE/DELETE: service role only (enforced via API routes — Shopify auth happens server-side, not Supabase auth)
- Admin curated/imported entries: inserted via service role with `user_id = NULL` allowed by relaxing UNIQUE to a partial unique index on `user_id` where `user_id IS NOT NULL`.

Trigger for `updated_at`.

### 2. API Endpoints (Vercel serverless, mirrors existing review APIs)

- `POST /api/reviews/brand` — create. Requires Shopify customer access token; resolves customer GID via existing `getCustomerIdFromToken`. Rejects if a review already exists for that user_id.
- `PUT /api/reviews/brand` — update own review (token → customer GID match).
- `GET /api/reviews/brand` — paginated list (visible only, featured first, then newest). Accepts `page`, `limit`.
- `GET /api/reviews/brand/summary` — `{ averageRating, totalReviews, breakdown }`. Cached in-memory for 60s.
- `GET /api/reviews/brand/eligibility` — given customer token, returns `{ canSubmit, existingReview }` so the form knows whether to show submit or edit mode.

### 3. Frontend

- New `src/lib/brand-reviews.ts` — fetcher helpers for the 4 endpoints.
- New `src/components/reviews/BrandReviewForm.tsx` — modal form (rating + delivery/support/overall + text), uses existing customer auth context. Login prompt if logged out. Edit mode if review exists.
- `src/components/TestimonialsSection.tsx` — replace static `testimonials` with API data. Keep existing carousel layout/visuals 1:1. Show summary (avg + count) above carousel using existing typography. Add a small "Write a review / Edit your review" trigger inside the section header (uses existing button styles, no new design tokens). Map source → tag chip ("Verified Customer" / "Customer Story" / "Imported Feedback") rendered inside the existing card.
- Empty state: if API returns 0 reviews, fall back to static `testimonials` so the section is never empty.

### 4. Admin Controls

Add a `BrandReviewsAdmin` panel under existing `/admin` route:
- Table of all reviews with toggles for `is_featured`, `is_hidden`.
- "Add curated" and "Add imported" forms.
- Protected by existing `has_role(user_id, 'admin')` check.

Endpoint `POST /api/admin/reviews/brand` for curated/imported inserts; `PATCH` for feature/hide. Validates Supabase admin role server-side.

### 5. Performance

- React Query cache (existing 5min staleTime) for list + summary.
- Pagination (10 per page) with "Load more".
- Lazy-load: section already inside `<Reveal>` on home page.
- In-memory 60s summary cache in serverless function.

### 6. What does NOT change

- No edits to product review system, Shopify integration, or visual design tokens.
- `TestimonialsSection` keeps its current carousel, fonts, colors, cards, drag/arrows — only the data source and a small CTA + chip are added.

---

### Files to create
- `api/reviews/brand/index.ts` (GET/POST/PUT)
- `api/reviews/brand/summary.ts`
- `api/reviews/brand/eligibility.ts`
- `api/admin/reviews/brand.ts`
- `src/lib/brand-reviews.ts`
- `src/components/reviews/BrandReviewForm.tsx`
- `src/components/admin/BrandReviewsAdmin.tsx` (wired into existing admin page)

### Files to modify
- `src/components/TestimonialsSection.tsx` (data source + chip + CTA, layout unchanged)
- existing admin page (add tab/section for brand reviews)

### Migration
One Supabase migration creates the table, partial unique index, RLS policies, and `updated_at` trigger.
