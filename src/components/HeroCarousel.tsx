import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteMedia } from "@/lib/site-media";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";


const HeroCarousel = () => {
  const { data: media, isLoading } = useSiteMedia();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Admin-managed desktop hero. If provided, it becomes the primary slide.
  const adminDesktopVideo = media?.hero_desktop_video?.media_type === 'video' ? media.hero_desktop_video : null;
  const adminDesktopImage = media?.hero_desktop_image?.media_type === 'image' ? media.hero_desktop_image : null;
  const adminMobileImage = media?.hero_mobile_image?.media_type === 'image' ? media.hero_mobile_image : null;
  const adminMobileVideo = media?.hero_mobile_video?.media_type === 'video' ? media.hero_mobile_video : null;

  const slides = useMemo(() => {
    const list = [];
    if (adminDesktopVideo || adminDesktopImage) {
      list.push({
        id: 'admin-hero',
        title: adminDesktopImage?.alt || adminDesktopVideo?.alt || 'Signature Series',
        description: '',
        image: adminDesktopImage?.url || adminDesktopVideo?.poster_url || '',
        mobileImage: adminMobileImage?.url || adminDesktopImage?.url || '',
        mobileVideo: adminMobileVideo?.url || adminDesktopVideo?.url || '',
        desktopVideo: adminDesktopVideo?.url || '',
        link: '/products',
      } as any);
    }
    return list;
  }, [adminDesktopVideo, adminDesktopImage, adminMobileImage, adminMobileVideo]);

  if (isLoading && !slides.length) {
    return <section className="relative h-screen w-full overflow-hidden bg-background" />;
  }

  if (!slides.length) return null;


  return (
    <section className="relative h-screen w-full overflow-hidden group">
      <div className="overflow-hidden h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              <div className="absolute inset-0">
                {slide.mobileVideo ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    poster={slide.mobileImage || slide.image}
                  >
                    <source src={slide.mobileVideo} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={slide.mobileImage || slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="font-display  text-[clamp(2.5rem,7vw,5.5rem)] text-foreground leading-[1.1] mb-6 tracking-normal"
                >
                  Signature Series
                </motion.h2>
                {slide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-[clamp(0.9rem,2.5vw,1.4rem)] text-foreground/60 max-w-lg mx-auto leading-relaxed tracking-normal  font-light px-4"
                  >
                    {slide.description}
                  </motion.p>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Link
                    to="/products"
                    className="mt-12 px-12 py-3.5 glass-card rounded-full text-foreground text-[12px] font-medium tracking-wide hover:bg-white/10 transition-all duration-500 backdrop-blur-md inline-block"
                  >
                    Explore Collection
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-glass hidden md:flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors opacity-0 group-hover:opacity-100 duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-glass hidden md:flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors opacity-0 group-hover:opacity-100 duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroCarousel;
