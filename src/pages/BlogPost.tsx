import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useBlogPost } from "@/lib/blog";
import { ArrowLeft } from "lucide-react";

const Footer = lazy(() => import("@/components/Footer"));

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 text-center text-muted-foreground">Loading…</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 text-center">
          <p className="text-muted-foreground mb-6">Post not found.</p>
          <Link to="/blog" className="text-primary underline">Back to blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | VOOM Care Journal`}
        description={post.excerpt || post.title}
      />
      <Navbar />
      <article className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Journal
          </Link>

          <header className="mb-10 space-y-4">
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] uppercase tracking-widest text-primary font-bold">{t}</span>
                ))}
              </div>
            )}
            <h1 className="font-display italic text-[clamp(2rem,5vw,4rem)] text-foreground leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{post.author || 'VOOM'}</span>
              <span>·</span>
              <span>{new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          {post.video_url ? (
            <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-black">
              <video src={post.video_url} controls poster={post.cover_image_url || undefined} className="w-full h-full object-cover" />
            </div>
          ) : post.cover_image_url ? (
            <img src={post.cover_image_url} alt={post.title} className="w-full rounded-2xl mb-10" />
          ) : null}

          {post.excerpt && (
            <p className="text-lg text-muted-foreground italic mb-8 leading-relaxed">{post.excerpt}</p>
          )}

          {post.content && (
            <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          )}
        </div>
      </article>
      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
};

export default BlogPostPage;
