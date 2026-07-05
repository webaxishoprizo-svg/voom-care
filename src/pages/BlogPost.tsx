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

  const canonical = `/blog/${post.slug}`;
  const url = `https://voomcare.com${canonical}`;
  const image = post.cover_image_url || "https://voomcare.com/og-image.jpg";
  const publishedISO = new Date(post.published_at || post.created_at).toISOString();
  const modifiedISO = new Date(post.updated_at || post.published_at || post.created_at).toISOString();
  const plainDesc = (post.excerpt || (post.content || "").replace(/\s+/g, " ").slice(0, 155) || post.title).trim();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: plainDesc,
    image: [image],
    datePublished: publishedISO,
    dateModified: modifiedISO,
    author: { "@type": "Person", name: post.author || "VOOM Care" },
    publisher: {
      "@type": "Organization",
      name: "VOOM Care",
      logo: { "@type": "ImageObject", url: "https://voomcare.com/voom-logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: (post.tags || []).join(", ") || undefined,
    inLanguage: "en-IN",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://voomcare.com/" },
      { "@type": "ListItem", position: 2, name: "Journal", item: "https://voomcare.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={plainDesc}
        canonical={canonical}
        ogImage={image}
        ogType="article"
        author={post.author || "VOOM Care"}
        publishedTime={publishedISO}
        modifiedTime={modifiedISO}
        keywords={(post.tags || []).join(", ")}
        schema={[articleSchema, breadcrumbSchema]}
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
