import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useSaleorProducts, type SaleorProduct } from "@/lib/api";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const { data: products, isLoading, error } = useSaleorProducts(undefined, 50);

  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-[#e8dac9] mb-4">
              All Products
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Browse our complete collection of merchandise that ties the room together.
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-[#c45d36] mb-4">Failed to load products</p>
              <p className="text-white/50 text-sm">Please try again later</p>
            </div>
          )}

          {products && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: SaleorProduct) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.slug}`}
                  className="group"
                  data-testid={`product-card-${product.slug}`}
                >
                  <div className="aspect-square bg-white/5 overflow-hidden rounded-sm mb-4 relative">
                    {product.thumbnail?.url ? (
                      <img 
                        src={product.thumbnail.url} 
                        alt={product.thumbnail.alt || product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        No image
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <Button size="sm" className="w-full bg-[#e8dac9] text-background hover:bg-white text-xs uppercase font-bold">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-bold text-[#e8dac9]" data-testid={`text-price-${product.slug}`}>
                      ${product.pricing?.priceRange?.start?.gross?.amount?.toFixed(2) || '0.00'}
                    </p>
                    <h3 className="text-sm text-white/80 font-medium leading-tight group-hover:text-primary cursor-pointer" data-testid={`text-name-${product.slug}`}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#c45d36]">The Dude Abides®</p>
                    <p className="text-xs text-green-500 uppercase tracking-wide">In stock</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {products && products.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-white/50 mb-4">No products found</p>
              <p className="text-white/30 text-sm">Check back soon for new arrivals</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
