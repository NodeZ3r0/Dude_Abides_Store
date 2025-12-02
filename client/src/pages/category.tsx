import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useSaleorProducts, useSaleorCategories, type SaleorProduct, type SaleorCategory } from "@/lib/api";
import { Link, useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading: productsLoading } = useSaleorProducts(undefined, 50);
  const { data: categories, isLoading: categoriesLoading } = useSaleorCategories(20);

  const category = categories?.find((c: SaleorCategory) => c.slug === slug);
  const filteredProducts = products?.filter((p: SaleorProduct) => 
    (p as any).category?.slug === slug
  ) || [];

  const isLoading = productsLoading || categoriesLoading;

  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-white/60 hover:text-[#e8dac9] mb-8 transition-colors" data-testid="link-back">
            <ChevronLeft className="h-4 w-4" />
            All Products
          </Link>

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-[#e8dac9] mb-4">
              {category?.name || slug || 'Category'}
            </h1>
            {category?.description && (
              <p className="text-white/60 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: category.description }} />
            )}
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

          {!isLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: SaleorProduct) => (
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
                    <p className="font-bold text-[#e8dac9]">
                      ${product.pricing?.priceRange?.start?.gross?.amount?.toFixed(2) || '0.00'}
                    </p>
                    <h3 className="text-sm text-white/80 font-medium leading-tight group-hover:text-primary cursor-pointer">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#c45d36]">The Dude Abides®</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50 mb-4">No products found in this category</p>
              <Link href="/products">
                <Button variant="outline" className="border-[#e8dac9] text-[#e8dac9]">
                  View All Products
                </Button>
              </Link>
            </div>
          )}

          {category?.children && category.children.edges.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl text-[#e8dac9] mb-8 text-center">Subcategories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {category.children.edges.map(({ node }: { node: { id: string; name: string; slug: string } }) => (
                  <Link 
                    key={node.id}
                    href={`/category/${node.slug}`}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square bg-[#2a201c] overflow-hidden rounded-sm mb-4 flex items-center justify-center border border-white/10 hover:border-[#c45d36] transition-colors">
                      <span className="font-display text-[#e8dac9] text-lg text-center group-hover:text-[#c45d36] transition-colors p-4">
                        {node.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
