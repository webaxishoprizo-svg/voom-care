export interface BrandReview {
  id: string;
  display_name: string | null;
  rating: number;
  review_text: string;
  delivery_rating: number | null;
  support_rating: number | null;
  overall_rating: number | null;
  source: 'user' | 'curated' | 'imported';
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface BrandReviewsResponse {
  reviews: BrandReview[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface BrandReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<string, number>;
}

export interface BrandEligibility {
  canSubmit: boolean;
  reason?: string;
  existingReview: BrandReview | null;
  customerGid?: string;
}

async function jsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export async function fetchBrandReviews(page = 1, limit = 12): Promise<BrandReviewsResponse> {
  const res = await fetch(`/api/reviews/brand?page=${page}&limit=${limit}`);
  return jsonOrThrow(res);
}

export async function fetchBrandSummary(): Promise<BrandReviewSummary> {
  const res = await fetch('/api/reviews/brand/summary');
  return jsonOrThrow(res);
}

export async function fetchBrandEligibility(token: string | null): Promise<BrandEligibility> {
  if (!token) return { canSubmit: false, reason: 'unauthenticated', existingReview: null };
  const res = await fetch(`/api/reviews/brand/eligibility?token=${encodeURIComponent(token)}`);
  return jsonOrThrow(res);
}

export interface SubmitBrandReviewInput {
  rating: number;
  review: string;
  deliveryRating?: number;
  supportRating?: number;
  overallRating?: number;
  displayName?: string;
}

export async function submitBrandReview(token: string, input: SubmitBrandReviewInput): Promise<BrandReview> {
  const res = await fetch('/api/reviews/brand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, customerId: token }),
  });
  return jsonOrThrow(res);
}

export async function updateBrandReview(token: string, input: SubmitBrandReviewInput): Promise<BrandReview> {
  const res = await fetch('/api/reviews/brand', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, customerId: token }),
  });
  return jsonOrThrow(res);
}
