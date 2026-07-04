import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useBlogPosts } from "@/lib/blog";

const HomeBlogSection = () => {
  const { data: posts, isLoading } = useBlogPosts(3);
  if (isLoading) return null;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">The Journal</p>
            <h2 className="font-display italic text-[clamp(2rem,5vw,3.5rem)] text-foreground leading-tight">
              Stories & Guides
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-background" />
                  )}
                  {post.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] uppercase tracking-widest text-primary font-bold">{t}</span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-display text-xl md:text-2xl text-foreground leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2">
                    <span>{post.author || 'VOOM'}</span>
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
