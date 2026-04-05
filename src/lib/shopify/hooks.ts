import { useQuery } from "@tanstack/react-query";
import { buildHeroSlides, fetchHybridCollections, fetchHybridProduct, fetchHybridProducts } from "./shopify";

const SHOPIFY_STALE_TIME = 1000 * 60 * 60;

export function useHybridProducts(limit = 20) {
  return useQuery({
    queryKey: ["shopify", "products", limit],
    queryFn: () => fetchHybridProducts(limit),
    staleTime: SHOPIFY_STALE_TIME,
    retry: 1,
  });
}

export function useHybridCollections(limit = 20) {
  return useQuery({
    queryKey: ["shopify", "collections", limit],
    queryFn: () => fetchHybridCollections(limit),
    staleTime: SHOPIFY_STALE_TIME,
    retry: 1,
  });
}

export function useHybridProduct(idOrHandle?: string) {
  return useQuery({
    queryKey: ["shopify", "product", idOrHandle],
    queryFn: () => fetchHybridProduct(idOrHandle || ""),
    enabled: Boolean(idOrHandle),
    staleTime: SHOPIFY_STALE_TIME,
    retry: 1,
  });
}

export function useHeroSlides() {
  const collectionsQuery = useHybridCollections();

  return {
    data: collectionsQuery.data ? buildHeroSlides([], collectionsQuery.data) : [],
    isLoading: collectionsQuery.isLoading,
    isError: collectionsQuery.isError,
  };
}

export function useCollectionProducts(handle: string) {
  const productsQuery = useHybridProducts();
  const collectionsQuery = useHybridCollections();

  const products = productsQuery.data || [];
  const collections = collectionsQuery.data || [];
  const collection = collections.find((item) => item.handle === handle);
  const productMap = new Map(products.map((product) => [product.shopifyHandle, product]));

  const data =
    collection?.productHandles?.length
      ? collection.productHandles
          .map((productHandle) => productMap.get(productHandle))
          .filter((product): product is (typeof products)[number] => Boolean(product))
      : [];

  return {
    data,
    isLoading: productsQuery.isLoading || collectionsQuery.isLoading,
    isError: productsQuery.isError || collectionsQuery.isError,
  };
}
