import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { 
  fetchProducts, 
  fetchFeaturedProducts, 
  fetchCategories,
  fetchCollections,
  getChannel,
  type SaleorProduct,
  type SaleorCategory,
  type SaleorCollection
} from "./saleor";

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  
  return res.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchAPI("/products") as Promise<Product[]>,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchAPI(`/products/${id}`) as Promise<Product>,
    enabled: !!id,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => fetchAPI(`/products/category/${category}`) as Promise<Product[]>,
    enabled: !!category,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      fetchAPI("/products", {
        method: "POST",
        body: JSON.stringify(product),
      }) as Promise<Product>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchAPI("/cart"),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: { productId: number; quantity: number; selectedVariant?: any }) =>
      fetchAPI("/cart", {
        method: "POST",
        body: JSON.stringify(item),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      fetchAPI(`/cart/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchAPI(`/cart/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useSeedProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetchAPI("/admin/seed", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSaleorProducts(channel?: string, first: number = 12) {
  const activeChannel = channel || getChannel();
  return useQuery({
    queryKey: ["saleor-products", activeChannel, first],
    queryFn: () => fetchProducts(activeChannel, first),
  });
}

export function useSaleorFeaturedProducts(channel?: string, collectionSlug: string = 'featured') {
  const activeChannel = channel || getChannel();
  return useQuery({
    queryKey: ["saleor-featured-products", activeChannel, collectionSlug],
    queryFn: () => fetchFeaturedProducts(activeChannel, collectionSlug),
  });
}

export function useSaleorCategories(first: number = 20) {
  return useQuery({
    queryKey: ["saleor-categories", first],
    queryFn: () => fetchCategories(first),
  });
}

export function useSaleorCollections(first: number = 10) {
  return useQuery({
    queryKey: ["saleor-collections", first],
    queryFn: () => fetchCollections(first),
  });
}

export type { SaleorProduct, SaleorCategory, SaleorCollection };
