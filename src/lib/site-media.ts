import { useQuery } from '@tanstack/react-query';

export interface SiteMediaItem {
  slot: string;
  media_type: 'video' | 'image';
  url: string;
  poster_url?: string | null;
  alt?: string | null;
  is_enabled: boolean;
}

export type SiteMediaMap = Record<string, SiteMediaItem>;

async function fetchSiteMedia(): Promise<SiteMediaMap> {
  try {
    const res = await fetch('/api/site-media');
    if (!res.ok) return {};
    const json = await res.json();
    return json.media || {};
  } catch {
    return {};
  }
}

export function useSiteMedia() {
  return useQuery({
    queryKey: ['site-media'],
    queryFn: fetchSiteMedia,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
