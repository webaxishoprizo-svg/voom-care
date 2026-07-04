import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2, Check, X, Plus, Edit3, Star, LogOut } from 'lucide-react';
import HeroMediaTab from '@/components/admin/HeroMediaTab';
import BlogTab from '@/components/admin/BlogTab';

type Section = 'reviews' | 'hero' | 'blog';


type ReviewType = 'product' | 'brand';
type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

const TOKEN_KEY = 'voom_admin_token';

interface AnyReview {
  id: string;
  user_id: string | null;
  display_name: string | null;
  product_id?: string;
  rating: number;
  review?: string;
  review_text?: string;
  status: string;
  source: string;
  is_verified?: boolean;
  is_featured?: boolean;
  is_hidden?: boolean;
  created_at: string;
}

export default function VoomAdminControlPanel() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [section, setSection] = useState<Section>('reviews');
  const [type, setType] = useState<ReviewType>('product');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [reviews, setReviews] = useState<AnyReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<AnyReview | null>(null);


  const authedFetch = useCallback(async (url: string, init: RequestInit = {}) => {
    return fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
    });
  }, [token]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authedFetch(`/api/admin/reviews?type=${type}&status=${status}`);
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        return;
      }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [type, status, token, authedFetch]);

  useEffect(() => { load(); }, [load]);

  const login = async () => {
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/reviews?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword('');
      toast.success('Signed in');
    } catch (e: any) {
      toast.error(e.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setReviews([]);
  };

  const setReviewStatus = async (id: string, newStatus: string) => {
    const res = await authedFetch(`/api/admin/reviews?type=${type}`, {
      method: 'PATCH',
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) { toast.success(`Marked ${newStatus}`); load(); }
    else toast.error('Update failed');
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    const res = await authedFetch(`/api/admin/reviews?type=${type}&id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); }
    else toast.error('Delete failed');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-4">
          <h1 className="text-xl font-display text-foreground text-center">VOOM Admin Control Panel</h1>
          <p className="text-xs text-muted-foreground text-center">Restricted access. Enter admin password.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="Admin password"
            className="w-full h-11 rounded-xl bg-background border border-border px-4 text-sm outline-none focus:border-primary"
            autoFocus
          />
          <Button onClick={login} disabled={loggingIn || !password} className="w-full h-11 rounded-full gradient-gold text-primary-foreground font-bold">
            {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl">Admin Control Panel</h1>
            <p className="text-xs text-muted-foreground">Moderate customer & brand reviews</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAdd(true)} className="rounded-full h-10"><Plus className="w-4 h-4 mr-1" /> Add review</Button>
            <Button onClick={logout} variant="outline" className="rounded-full h-10"><LogOut className="w-4 h-4 mr-1" /> Logout</Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {(['product', 'brand'] as ReviewType[]).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 h-9 rounded-full text-xs font-bold uppercase tracking-wider border ${type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
              {t === 'product' ? 'Product Reviews' : 'Brand Reviews'}
            </button>
          ))}
          <span className="w-px bg-border mx-2" />
          {(['all', 'approved', 'pending', 'rejected'] as StatusFilter[]).map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 h-9 rounded-full text-xs font-medium capitalize border ${status === s ? 'bg-foreground text-background border-foreground' : 'bg-card border-border text-muted-foreground'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 border border-dashed border-border rounded-2xl">No reviews found</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{r.display_name || 'Anonymous'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        r.status === 'approved' ? 'bg-green-500/10 text-green-500'
                        : r.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-red-500/10 text-red-500'
                      }`}>{r.status}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{r.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                      {r.product_id && <> · Product: {r.product_id.split('/').pop()}</>}
                      {r.user_id && <> · User: {r.user_id.split('/').pop()}</>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.status !== 'approved' && (
                      <Button size="sm" onClick={() => setReviewStatus(r.id, 'approved')} className="h-8 rounded-full bg-green-600 hover:bg-green-700 text-white">
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    {r.status !== 'rejected' && (
                      <Button size="sm" variant="outline" onClick={() => setReviewStatus(r.id, 'rejected')} className="h-8 rounded-full">
                        <X className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setEditing(r)} className="h-8 rounded-full">
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteReview(r.id)} className="h-8 rounded-full text-red-500 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {r.review || r.review_text}
                </p>
              </div>
            ))}
          </div>
        )}

        {(showAdd || editing) && (
          <ReviewEditor
            type={type}
            initial={editing}
            onClose={() => { setShowAdd(false); setEditing(null); }}
            onSaved={() => { setShowAdd(false); setEditing(null); load(); }}
            authedFetch={authedFetch}
          />
        )}
      </div>
    </div>
  );
}

interface EditorProps {
  type: ReviewType;
  initial: AnyReview | null;
  onClose: () => void;
  onSaved: () => void;
  authedFetch: (url: string, init?: RequestInit) => Promise<Response>;
}

function ReviewEditor({ type, initial, onClose, onSaved, authedFetch }: EditorProps) {
  const [rating, setRating] = useState(initial?.rating || 5);
  const [text, setText] = useState(initial?.review || initial?.review_text || '');
  const [name, setName] = useState(initial?.display_name || '');
  const [productId, setProductId] = useState(initial?.product_id?.split('/').pop() || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (initial) {
        const body: any = { id: initial.id, rating, display_name: name };
        if (type === 'brand') body.review_text = text;
        else body.review = text;
        const res = await authedFetch(`/api/admin/reviews?type=${type}`, { method: 'PATCH', body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      } else {
        const body: any = { rating, review: text, displayName: name };
        if (type === 'product') body.productId = productId;
        const res = await authedFetch(`/api/admin/reviews?type=${type}`, { method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      }
      toast.success('Saved');
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl">{initial ? 'Edit' : 'Add'} {type} review</h2>

        {!initial && type === 'product' && (
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-muted-foreground">Product ID (Shopify numeric or GID)</label>
            <input value={productId} onChange={(e) => setProductId(e.target.value)}
              placeholder="7300000000000"
              className="w-full h-11 rounded-xl bg-background border border-border px-4 text-sm outline-none focus:border-primary" />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Display Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full h-11 rounded-xl bg-background border border-border px-4 text-sm outline-none focus:border-primary" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star className={`w-7 h-7 ${s <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Review</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[120px] rounded-xl bg-background border border-border p-3 text-sm outline-none focus:border-primary resize-none" />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
          <Button onClick={save} disabled={saving} className="rounded-full gradient-gold text-primary-foreground font-bold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
