import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useBlogPosts } from "@/lib/blog";
import { PlayCircle } from "lucide-react";

const Footer = lazy(() => import("@/components/Footer"));

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts(50);

  return (
    <main className="min-h-screen bg-background">
      <SEO title="Journal | VOOM Care" description="Guides, stories, and tips from VOOM Care — India's premium car care brand." />
      <Navbar />
      <div className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">The Journal</p>
            <h1 className="font-display italic text-[clamp(2.5rem,6vw,4.5rem)] text-foreground leading-tight">
              Stories, Guides & News
            </h1>
          </header>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-20">Loading…</div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-20 border border-dashed border-border rounded-2xl">
              No posts yet. Check back soon.
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all"
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-background" />
                    )}
                    {post.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-xl text-foreground leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    <div className="flex justify-between text-[11px] text-muted-foreground pt-2">
                      <span>{post.author || 'VOOM'}</span>
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
};

export default Blog;
