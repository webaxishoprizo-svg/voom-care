import { useQuery } from '@tanstack/react-query';

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  author: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
}

export interface BlogPost extends BlogPostSummary {
  content: string | null;
  is_published: boolean;
  updated_at: string;
}

export function useBlogPosts(limit = 20) {
  return useQuery({
    queryKey: ['blog-posts', limit],
    queryFn: async (): Promise<BlogPostSummary[]> => {
      const res = await fetch(`/api/blog?limit=${limit}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.posts || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useBlogPost(slug?: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    enabled: !!slug,
    queryFn: async (): Promise<BlogPost | null> => {
      const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug!)}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.post || null;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
