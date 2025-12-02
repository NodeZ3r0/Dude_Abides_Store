import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useSaleorCategoryBySlug, type SaleorProduct } from "@/lib/api";
import { Link, useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading, error } = useSaleorCategoryBySlug(slug || '');

  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-white/60 hover:text-[#e8dac9] mb-8 transition-colors" data-testid="link-back">
            <ChevronLeft className="h-4 w-4" />
            All Products
          </Link>

          {isLoading && (
            <div className="space-y-8">
              <div className="text-center">
                <Skeleton className="h-12 w-1/3 mx-auto bg-white/5" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full bg-white/5" />
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-[#c45d36] mb-4">Failed to load category</p>
              <Link href="/products">
                <Button variant="outline" className="border-[#e8dac9] text-[#e8dac9]">
                  View All Products
                </Button>
              </Link>
            </div>
          )}

          {category && (
            <>
              <div className="text-center mb-12">
                {category.backgroundImage?.url && (
                  <div className="w-full h-48 md:h-64 mb-8 overflow-hidden rounded-sm">
                    <img 
                      src={category.backgroundImage.url} 
                      alt={category.backgroundImage.alt || category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h1 className="font-display text-4xl md:text-5xl text-[#e8dac9] mb-4" data-testid="text-category-name">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-white/60 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: category.description }} data-testid="text-category-description" />
                )}
              </div>

              {category.products && category.products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.products.map((product: SaleorProduct) => (
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
                        <p className="font-bold text-[#e8dac9]" data-testid={`text-price-${product.id}`}>
                          ${product.pricing?.priceRange?.start?.gross?.amount?.toFixed(2) || '0.00'}
                        </p>
                        <h3 className="text-sm text-white/80 font-medium leading-tight group-hover:text-primary cursor-pointer" data-testid={`text-name-${product.id}`}>
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#c45d36]">The Dude Abides®</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-white/50 mb-4">No products found in this category</p>
                  <Link href="/products">
                    <Button variant="outline" className="border-[#e8dac9] text-[#e8dac9]">
                      View All Products
                    </Button>
                  </Link>
                </div>
              )}

              {category.children && category.children.edges && category.children.edges.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-display text-2xl text-[#e8dac9] mb-8 text-center">Subcategories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {category.children.edges.map(({ node }: { node: { id: string; name: string; slug: string } }) => (
                      <Link 
                        key={node.id}
                        href={`/category/${node.slug}`}
                        className="group cursor-pointer"
                        data-testid={`subcategory-${node.slug}`}
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
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
