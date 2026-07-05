import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit3, Eye, EyeOff, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  author: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const empty: Partial<BlogPost> = {
  slug: '', title: '', excerpt: '', content: '', cover_image_url: '', video_url: '', author: '', tags: [], is_published: false,
};

export default function BlogTab({ authedFetch }: { authedFetch: (u: string, i?: RequestInit) => Promise<Response> }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authedFetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [authedFetch]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const res = await authedFetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); } else toast.error('Delete failed');
  };

  const togglePublish = async (p: BlogPost) => {
    const res = await authedFetch('/api/admin/blog', {
      method: 'PATCH',
      body: JSON.stringify({ ...p, is_published: !p.is_published, tags: p.tags || [] }),
    });
    if (res.ok) { toast.success(p.is_published ? 'Unpublished' : 'Published'); load(); }
    else toast.error('Update failed');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Manage blog posts. Unpublished posts stay hidden on the website.</p>
        <Button onClick={() => setEditing({ ...empty })} className="rounded-full h-9"><Plus className="w-4 h-4 mr-1" /> New post</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 border border-dashed border-border rounded-2xl">No posts yet. Create the first one.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3 items-center min-w-0">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm truncate">{p.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${p.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">/blog/{p.slug} · {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePublish(p)} className="h-8 rounded-full">
                  {p.is_published ? <><EyeOff className="w-3.5 h-3.5 mr-1" /> Unpublish</> : <><Eye className="w-3.5 h-3.5 mr-1" /> Publish</>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(p)} className="h-8 rounded-full"><Edit3 className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => remove(p.id)} className="h-8 rounded-full text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <PostEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
          authedFetch={authedFetch}
        />
      )}
    </div>
  );
}

function PostEditor({ initial, onClose, onSaved, authedFetch }: {
  initial: Partial<BlogPost>;
  onClose: () => void;
  onSaved: () => void;
  authedFetch: (u: string, i?: RequestInit) => Promise<Response>;
}) {
  const [form, setForm] = useState<Partial<BlogPost>>(initial);
  const [saving, setSaving] = useState(false);
  const [tagsText, setTagsText] = useState((initial.tags || []).join(', '));
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileUpload = async (key: 'cover_image_url' | 'video_url', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setUploadingKey(key);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasBucket = buckets?.some(b => b.name === 'site-media');
      if (!hasBucket) {
        await supabase.storage.createBucket('site-media', { public: true });
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `blog_${key}_${Date.now()}.${fileExt}`;

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

      set(key, publicUrl);
      toast.success('Uploaded successfully!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload failed: ${err.message || err}`, { id: toastId });
    } finally {
      setUploadingKey(null);
    }
  };

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      const body = {
        ...form,
        tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const method = form.id ? 'PATCH' : 'POST';
      const res = await authedFetch('/api/admin/blog', { method, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      toast.success('Saved');
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1">
      <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
  const inputCls = "w-full h-10 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:border-primary";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl my-8 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl">{form.id ? 'Edit' : 'New'} post</h2>

        <Field label="Title">
          <input value={form.title || ''} onChange={(e) => set('title', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slug (URL)">
          <input value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="my-post-title" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Author"><input value={form.author || ''} onChange={(e) => set('author', e.target.value)} className={inputCls} /></Field>
          <Field label="Tags (comma separated)"><input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={inputCls} /></Field>
        </div>
        <Field label="Cover image URL">
          <div className="flex gap-2">
            <input value={form.cover_image_url || ''} onChange={(e) => set('cover_image_url', e.target.value)} className="flex-1 h-10 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:border-primary" placeholder="https://..." />
            <Button
              type="button"
              variant="outline"
              disabled={uploadingKey === 'cover_image_url'}
              onClick={() => document.getElementById('blog-cover-upload')?.click()}
              className="h-10 rounded-lg whitespace-nowrap gap-1 border-dashed hover:border-primary"
            >
              {uploadingKey === 'cover_image_url' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <><Upload className="w-3.5 h-3.5" /> Upload Image</>
              )}
            </Button>
            <input
              type="file"
              id="blog-cover-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload('cover_image_url', e)}
            />
          </div>
        </Field>
        <Field label="Video URL (optional)">
          <div className="flex gap-2">
            <input value={form.video_url || ''} onChange={(e) => set('video_url', e.target.value)} className="flex-1 h-10 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:border-primary" placeholder="https://.../post.mp4" />
            <Button
              type="button"
              variant="outline"
              disabled={uploadingKey === 'video_url'}
              onClick={() => document.getElementById('blog-video-upload')?.click()}
              className="h-10 rounded-lg whitespace-nowrap gap-1 border-dashed hover:border-primary"
            >
              {uploadingKey === 'video_url' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <><Upload className="w-3.5 h-3.5" /> Upload Video</>
              )}
            </Button>
            <input
              type="file"
              id="blog-video-upload"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileUpload('video_url', e)}
            />
          </div>
        </Field>
        <Field label="Excerpt">
          <textarea value={form.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)} className="w-full min-h-[60px] rounded-lg bg-background border border-border p-3 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Content">
          <textarea value={form.content || ''} onChange={(e) => set('content', e.target.value)} className="w-full min-h-[200px] rounded-lg bg-background border border-border p-3 text-sm outline-none focus:border-primary" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.is_published} onChange={(e) => set('is_published', e.target.checked)} />
          Published (visible on website)
        </label>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
          <Button onClick={save} disabled={saving} className="rounded-full gradient-gold text-primary-foreground font-bold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
