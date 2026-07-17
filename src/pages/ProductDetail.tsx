import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Shield,
  Leaf,
  Clock,
  ChevronLeft,
  Minus,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useHybridProduct, useHybridProducts, useCollectionProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import SEO from "@/components/SEO";
import { trackViewContent } from "@/lib/meta-pixel";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { getAccessToken } from "@/lib/shopify/customer-account";

const testimonials = [
  {
    text: "The Combo Voom kit is actually very good. The shampoo gives a lot of foam and the dash cleaner doesn't leave any oily feel. My car is looking like new again. Paisa vasool!",
    name: "Rajesh",
    rating: 5,
  },
  {
    text: "Everything you need is in this one kit only. Very easy to use also, no need to go to detailing shops every time. The tyre polish shine stays for a long time even in this heat.",
    name: "Sneha",
    rating: 4,
  },
  {
    text: "The quality is top notch. I used it on my sedan and the finish is just wow. Glad to see an Indian brand making such high quality products. Must buy for every car owner.",
    name: "Gokul",
    rating: 5,
  },
  {
    text: "Actually the best car care kit I've used till now. Packaging was very professional and delivery was fast also. Results on my SUV are amazing. Finally a product that actually works.",
    name: "Vivek",
    rating: 4,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, customerAccessToken } = useCustomerAuth();
  const [qty, setQty] = useState(1);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const productQuery = useHybridProduct(id);
  const catalogQuery = useHybridProducts();
  const product = productQuery.data;
  const catalog = catalogQuery.data || [];
  const recommended = catalog.filter((item) =>
    item.id !== product?.id &&
    !(item.price === 0 && !item.availableForSale)
  ).slice(0, 3);

  const { data: compoInnerProducts } = useCollectionProducts("what-is-insice-the-compo");
  const isInsideCompo = product && compoInnerProducts?.some(p => p.id === product.id);
  const isNotForSale = product && product.price === 0 && !product.availableForSale;

  useEffect(() => {
    if (product) {
      trackViewContent(product);
    }
  }, [product]);

  if (!product && productQuery.isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Loading Product...</h1>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Product Not Found</h1>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const detailCards = [
    {
      icon: Leaf,
      title: "Why Choose VOOM",
      content: product.details?.composition,
    },
    {
      icon: Clock,
      title: "How To Use",
      content: product.details?.howToUse,
    },
    {
      icon: Shield,
      title: "What's In The Box",
      content: product.details?.whatsInTheBox,
    },
  ].filter((card) => Boolean(card.content));

  const handleAddToCart = async () => {
    await addItem(product, qty);
  };

  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image, ...(product.images || [])],
    "description": product.description || `Premium car care ${product.name} by VOOM.`,
    "sku": product.id,
    "brand": { "@type": "Brand", "name": "VOOM" },
    "category": "Automotive > Car Care",
    "countryOfOrigin": "IN",
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : `https://voomcare.com/product/${product.id}`,
      "priceCurrency": product.currencyCode || "INR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().slice(0, 10),
      "availability": product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "areaServed": { "@type": "Country", "name": "India" },
      "seller": { "@type": "Organization", "name": "VOOM Care" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "120",
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

  const breadcrumbSchema = product ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://voomcare.com/" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://voomcare.com/products" },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://voomcare.com/product/${product.id}` },
    ],
  } : null;

  const allImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${product.name} — Premium Car Care | VOOM`}
        description={product.description?.slice(0, 155) || `Buy ${product.name} — a premium professional carcare product from VOOM Care. Showroom results, pH-balanced formula, made in India. Free shipping over ₹999.`}
        keywords={`${product.name}, buy ${product.name} India, carcare products, car shampoo, car detailing, VOOM care, premium car wash, ${product.name} price`}
        canonical={`/product/${product.id}`}
        ogImage={product.image}
        ogType="product"
        schema={productSchema ? [productSchema, breadcrumbSchema].filter(Boolean) as object[] : undefined}
      />

      <Navbar />

      {isInsideCompo && (
        <div className="pt-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground tracking-wide uppercase">Compo Kit Exclusive</h4>
                  <p className="text-xs text-muted-foreground">This premium component is exclusively available as part of our signature collection.</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/products?collection=compo')}
                variant="outline"
                className="rounded-full px-8 border-primary/30 text-primary hover:bg-primary/5"
              >
                View Full Kit
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={`${isInsideCompo ? 'pt-8' : 'pt-24'} px-4`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border group">
              <div className="overflow-hidden h-full w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex h-full w-full">
                  {allImages.map((img, idx) => (
                    <div key={idx} className="flex-[0_0_100%] min-w-0 h-full relative">
                      <img
                        src={img}
                        alt={`${product.name} - ${idx + 1}`}
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {product.discount && (
                <span className="absolute top-4 left-4 gradient-gold text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                  -{product.discount}% OFF
                </span>
              )}

              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 md:hidden">
                  {allImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-white/40"
                        }`}
                    />
                  ))}
                </div>
              )}

            </div>

            {allImages.length > 1 && (
              <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`flex-[0_0_100px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${idx === selectedIndex
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-40 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            {!isNotForSale && (
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="text-muted-foreground text-xs ml-2">(128 reviews)</span>
              </div>
            )}

            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">VOOM Collection</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {isNotForSale ? (
              <div className="mb-8">
                <p className="text-red-500 font-bold text-lg tracking-wider uppercase">
                  Sorry, currently not selling
                </p>
              </div>
            ) : !isInsideCompo && (
              <div className="flex items-baseline gap-3 mb-6 md:mb-8">
                <span className="font-sans text-3xl text-foreground font-semibold">
                  {formatCurrency(product.price, product.currencyCode)}
                </span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-lg">
                    {formatCurrency(product.originalPrice, product.currencyCode)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-sm font-semibold text-primary">
                    Save {product.discount}%
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              {(isInsideCompo || isNotForSale) ? (
                <Button
                  onClick={() => navigate('/products?collection=compo')}
                  className="flex-1 h-12 gradient-gold text-primary-foreground font-semibold text-base rounded-full hover:opacity-90 transition-opacity gap-2"
                >
                  View Combo Kit
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <>
                  <div className="flex items-center border border-border rounded-full overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-foreground font-medium">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.availableForSale}
                    className="flex-1 h-12 gradient-gold text-primary-foreground font-semibold text-base rounded-full hover:opacity-90 transition-opacity gap-2 disabled:opacity-60"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {product.availableForSale ? "Add to Cart" : "Sold Out"}
                  </Button>
                </>
              )}
            </div>

            {detailCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:hidden mt-6">
                {detailCards.map((card) => (
                  <div
                    key={card.title}
                    className="bg-card border border-border rounded-xl p-4 text-center"
                  >
                    <card.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-2">{card.title}</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                      {card.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Laptop UI: Detail cards moved below the product grid */}
        {detailCards.length > 0 && (
          <div className="max-w-6xl mx-auto hidden md:grid md:grid-cols-3 gap-8 mt-16">
            {detailCards.map((card) => (
              <div
                key={card.title}
                className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <card.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-4">{card.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {card.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <ReviewSection
        productId={product.shopifyId || product.id}
        customerId={(getAccessToken() || customerAccessToken) || undefined}
        canWriteReview={isAuthenticated}
      />

      {recommended.length > 0 && (
        <section className="px-4 py-16 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-primary text-center mb-2">
              You May Also Like
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-10">
              Recommended
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommended.map((recommendedProduct, index) => (
                <motion.div
                  key={recommendedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    navigate(`/product/${recommendedProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={recommendedProduct.image}
                      alt={recommendedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-foreground">
                      {recommendedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-primary font-semibold">
                        {formatCurrency(
                          recommendedProduct.price,
                          recommendedProduct.currencyCode,
                        )}
                      </span>
                      {recommendedProduct.originalPrice && (
                        <span className="text-muted-foreground text-xs line-through">
                          {formatCurrency(
                            recommendedProduct.originalPrice,
                            recommendedProduct.currencyCode,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
      <Footer />
    </main>
  );
};

export default ProductDetail;
