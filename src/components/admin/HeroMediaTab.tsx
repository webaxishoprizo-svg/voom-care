import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2, Save, Eye, EyeOff, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SLOTS: { key: string; label: string; type: 'video' | 'image'; hint: string }[] = [
  { key: 'hero_mobile_video', label: 'Hero — Mobile Video', type: 'video', hint: 'MP4 URL shown on phones' },
  { key: 'hero_desktop_video', label: 'Hero — Desktop Video', type: 'video', hint: 'MP4 URL shown on desktop carousel' },
  { key: 'hero_mobile_image', label: 'Hero — Mobile Image', type: 'image', hint: 'Poster / fallback image for phones' },
  { key: 'hero_desktop_image', label: 'Hero — Desktop Image', type: 'image', hint: 'Primary desktop hero image' },
];

interface MediaRow {
  slot: string;
  media_type: 'video' | 'image';
  url: string;
  poster_url: string | null;
  alt: string | null;
  is_enabled: boolean;
}

export default function HeroMediaTab({ authedFetch }: { authedFetch: (u: string, i?: RequestInit) => Promise<Response> }) {
  const [rows, setRows] = useState<Record<string, MediaRow>>({});
  const [loading, setLoading] = useState(false);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const handleFileUpload = async (slotKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    const isPoster = slotKey.endsWith('-poster');
    const baseSlot = isPoster ? slotKey.replace('-poster', '') : slotKey;

    setUploadingSlot(slotKey);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasBucket = buckets?.some(b => b.name === 'site-media');
      if (!hasBucket) {
        await supabase.storage.createBucket('site-media', { public: true });
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${slotKey}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('site-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('site-media')
        .getPublicUrl(fileName);

      if (isPoster) {
        update(baseSlot, { poster_url: publicUrl });
      } else {
        update(baseSlot, { url: publicUrl });
      }

      toast.success('File uploaded successfully!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload failed: ${err.message || err}`, { id: toastId });
    } finally {
      setUploadingSlot(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authedFetch('/api/admin/site-media');
      const data = await res.json();
      const map: Record<string, MediaRow> = {};
      (data.media || []).forEach((r: MediaRow) => { map[r.slot] = r; });
      setRows(map);
    } catch {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  useEffect(() => { load(); }, [load]);

  const update = (slot: string, patch: Partial<MediaRow>) => {
    setRows((prev) => ({
      ...prev,
      [slot]: {
        slot,
        media_type: (patch.media_type || prev[slot]?.media_type || SLOTS.find((s) => s.key === slot)?.type || 'image') as 'video' | 'image',
        url: patch.url ?? prev[slot]?.url ?? '',
        poster_url: patch.poster_url ?? prev[slot]?.poster_url ?? null,
        alt: patch.alt ?? prev[slot]?.alt ?? null,
        is_enabled: patch.is_enabled ?? prev[slot]?.is_enabled ?? true,
      },
    }));
  };

  const save = async (slot: string) => {
    const row = rows[slot];
    if (!row?.url) { toast.error('URL required'); return; }
    setSavingSlot(slot);
    try {
      const res = await authedFetch('/api/admin/site-media', {
        method: 'PUT',
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      toast.success('Saved');
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingSlot(null);
    }
  };

  const remove = async (slot: string) => {
    if (!confirm('Remove this media?')) return;
    const res = await authedFetch(`/api/admin/site-media?slot=${slot}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Removed'); load(); }
    else toast.error('Delete failed');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Paste a public URL for each hero slot (e.g. a Supabase Storage or CDN link). Toggle the eye icon to enable/disable a slot.
        Disabled slots fall back to defaults on the storefront.
      </p>
      {SLOTS.map((s) => {
        const row = rows[s.key] || { slot: s.key, media_type: s.type, url: '', poster_url: null, alt: null, is_enabled: true };
        return (
          <div key={s.key} className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
            <div className="flex flex-wrap justify-between gap-2 items-center">
              <div>
                <h3 className="font-bold text-sm">{s.label}</h3>
                <p className="text-[11px] text-muted-foreground">{s.hint}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update(s.key, { is_enabled: !row.is_enabled })}
                  className={`p-2 rounded-full ${row.is_enabled ? 'text-green-500' : 'text-muted-foreground'}`}
                  title={row.is_enabled ? 'Enabled' : 'Disabled'}
                >
                  {row.is_enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {row.url && (
                  <Button size="sm" variant="outline" onClick={() => remove(s.key)} className="rounded-full text-red-500 h-8">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button size="sm" onClick={() => save(s.key)} disabled={savingSlot === s.key} className="rounded-full h-8 gradient-gold text-primary-foreground font-bold">
                  {savingSlot === s.key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5 mr-1" />Save</>}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={row.url}
                onChange={(e) => update(s.key, { url: e.target.value })}
                placeholder={`https://.../${s.type === 'video' ? 'hero.mp4' : 'hero.jpg'}`}
                className="flex-1 h-10 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:border-primary"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingSlot === s.key}
                onClick={() => document.getElementById(`file-upload-${s.key}`)?.click()}
                className="h-10 rounded-lg whitespace-nowrap gap-1 border-dashed hover:border-primary"
              >
                {uploadingSlot === s.key ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <><Upload className="w-3.5 h-3.5" /> Upload File</>
                )}
              </Button>
              <input
                type="file"
                id={`file-upload-${s.key}`}
                accept={s.type === 'video' ? 'video/*' : 'image/*'}
                className="hidden"
                onChange={(e) => handleFileUpload(s.key, e)}
              />
            </div>
            {s.type === 'video' && (
              <div className="flex gap-2">
                <input
                  value={row.poster_url || ''}
                  onChange={(e) => update(s.key, { poster_url: e.target.value })}
                  placeholder="Poster image URL (optional)"
                  className="flex-1 h-10 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:border-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingSlot === `${s.key}-poster`}
                  onClick={() => document.getElementById(`file-upload-${s.key}-poster`)?.click()}
                  className="h-10 rounded-lg whitespace-nowrap gap-1 border-dashed hover:border-primary"
                >
                  {uploadingSlot === `${s.key}-poster` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <><Upload className="w-3.5 h-3.5" /> Upload Poster</>
                  )}
                </Button>
                <input
                  type="file"
                  id={`file-upload-${s.key}-poster`}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(`${s.key}-poster`, e)}
                />
              </div>
            )}
            <input
              value={row.alt || ''}
              onChange={(e) => update(s.key, { alt: e.target.value })}
              placeholder="Alt text / caption"
              className="w-full h-10 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:border-primary"
            />
            {row.url && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border bg-black max-h-56">
                {row.media_type === 'video' ? (
                  <video src={row.url} poster={row.poster_url || undefined} className="w-full max-h-56 object-contain" controls muted />
                ) : (
                  <img src={row.url} alt={row.alt || ''} className="w-full max-h-56 object-contain" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
