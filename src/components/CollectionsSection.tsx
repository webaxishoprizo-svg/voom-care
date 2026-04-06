import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { CollectionCard as ShopifyCollectionCard } from "@/data/products";
import { useHybridCollections } from "@/lib/shopify/hooks";

const PRIORITY_HANDLES = ["best-seller", "new-arrival", "all-collection"];
const EXCLUDED_HANDLES = new Set(["hero-slider", "frontpage"]);

function sortCollections(collections: ShopifyCollectionCard[]) {
  return [...collections].sort((left, right) => {
    const leftPriority = PRIORITY_HANDLES.indexOf(left.handle);
    const rightPriority = PRIORITY_HANDLES.indexOf(right.handle);

    if (leftPriority !== -1 || rightPriority !== -1) {
      if (leftPriority === -1) return 1;
      if (rightPriority === -1) return -1;
      return leftPriority - rightPriority;
    }

    return left.title.localeCompare(right.title);
  });
}

function CollectionTile({
  collection,
  index,
  className,
  titleClassName,
  titlePositionClassName,
}: {
  collection: ShopifyCollectionCard;
  index: number;
  className: string;
  titleClassName: string;
  titlePositionClassName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link
        to={`/products?collection=${encodeURIComponent(collection.handle)}`}
        className={`group relative block overflow-hidden rounded-xl ${className}`}
      >
        <img
          src={collection.image}
          alt={collection.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-background/30" />
        <div className={`absolute inset-0 flex ${titlePositionClassName}`}>
          <span
            className={`bg-primary/20 px-6 py-2.5 font-display text-lg tracking-wider text-foreground uppercase backdrop-blur-sm border border-primary/30 rounded-md md:text-xl ${titleClassName}`}
          >
            {collection.title}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

const CollectionsSection = () => {
  const { data: collections = [], isLoading } = useHybridCollections();

  const visibleCollections = sortCollections(
    collections.filter(
      (collection) => !EXCLUDED_HANDLES.has(collection.handle) && Boolean(collection.image),
    ),
  );

  const featuredCollections = visibleCollections.slice(0, 2);
  const bannerCollection = visibleCollections[2];
  const additionalCollections = visibleCollections.slice(3);

  return (
    <section className="px-4 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-9">
          <p className="mb-2 text-xs tracking-[0.3em] uppercase text-primary">
            The Signature Series
          </p>
          <h2 className="font-display text-4xl text-foreground md:text-5xl">
            Explore Our Collections
          </h2>
        </div>

        {isLoading && !visibleCollections.length ? (
          <div className="text-center text-muted-foreground">Loading collections...</div>
        ) : visibleCollections.length ? (
          <>
            {featuredCollections.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-3">
                {featuredCollections.map((collection, index) => (
                  <CollectionTile
                    key={collection.handle}
                    collection={collection}
                    index={index}
                    className="aspect-[3/4] md:aspect-[16/10]"
                    titleClassName=""
                    titlePositionClassName="items-center justify-center"
                  />
                ))}
              </div>
            )}

            {bannerCollection && (
              <div className="mb-3">
                <CollectionTile
                  collection={bannerCollection}
                  index={featuredCollections.length}
                  className="aspect-[16/10] md:aspect-[21/7]"
                  titleClassName="text-base md:text-lg"
                  titlePositionClassName="items-end justify-center pb-6"
                />
              </div>
            )}

            {additionalCollections.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {additionalCollections.map((collection, index) => (
                  <CollectionTile
                    key={collection.handle}
                    collection={collection}
                    index={featuredCollections.length + 1 + index}
                    className="aspect-[16/10] md:aspect-[21/7]"
                    titleClassName="text-base md:text-lg"
                    titlePositionClassName="items-end justify-center pb-6"
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">No Shopify collections found.</div>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
