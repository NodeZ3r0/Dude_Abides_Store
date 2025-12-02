import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useSaleorProduct, type SaleorProductDetail } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useSaleorProduct(slug || '');
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast({
        title: "Please select a variant",
        description: "Choose a size or color before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, selectedVariant, quantity);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const currentVariant = product?.variants?.find(v => v.id === selectedVariant);
  const displayPrice = currentVariant?.pricing?.price?.gross?.amount || 
                       product?.pricing?.priceRange?.start?.gross?.amount || 0;
  const currency = currentVariant?.pricing?.price?.gross?.currency || 
                   product?.pricing?.priceRange?.start?.gross?.currency || 'USD';

  const allMedia = product?.media || [];
  const images = allMedia.length > 0 ? allMedia : (product?.thumbnail ? [{ id: 'thumb', url: product.thumbnail.url, alt: product.thumbnail.alt }] : []);

  const groupedAttributes = product?.variants?.reduce((acc, variant) => {
    variant.attributes?.forEach(attr => {
      if (!acc[attr.attribute.slug]) {
        acc[attr.attribute.slug] = {
          name: attr.attribute.name,
          values: new Set<string>()
        };
      }
      attr.values.forEach(v => acc[attr.attribute.slug].values.add(v.name));
    });
    return acc;
  }, {} as Record<string, { name: string; values: Set<string> }>);

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-white/60 hover:text-[#e8dac9] mb-8 transition-colors" data-testid="link-back-products">
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>

          {isLoading && (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full bg-white/5" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 bg-white/5" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4 bg-white/5" />
                <Skeleton className="h-8 w-1/4 bg-white/5" />
                <Skeleton className="h-32 w-full bg-white/5" />
                <Skeleton className="h-12 w-full bg-white/5" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-[#c45d36] mb-4">Failed to load product</p>
              <Link href="/products">
                <Button variant="outline" className="border-[#e8dac9] text-[#e8dac9]">
                  Return to Products
                </Button>
              </Link>
            </div>
          )}

          {product && (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-white/5 overflow-hidden rounded-sm">
                  {images[selectedImage] ? (
                    <img 
                      src={images[selectedImage].url} 
                      alt={images[selectedImage].alt || product.name}
                      className="w-full h-full object-cover"
                      data-testid="img-product-main"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      No image available
                    </div>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={img.id || index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-[#c45d36]' : 'border-transparent'
                        }`}
                        data-testid={`btn-thumbnail-${index}`}
                      >
                        <img 
                          src={img.url} 
                          alt={img.alt || `${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {product.category && (
                  <Link 
                    href={`/category/${product.category.slug}`}
                    className="text-xs text-[#c45d36] uppercase tracking-wider hover:text-white transition-colors"
                  >
                    {product.category.name}
                  </Link>
                )}
                
                <h1 className="font-display text-3xl md:text-4xl text-[#e8dac9]" data-testid="text-product-name">
                  {product.name}
                </h1>
                
                <p className="text-2xl font-bold text-[#e8dac9]" data-testid="text-product-price">
                  ${displayPrice.toFixed(2)} {currency}
                </p>

                {product.description && (
                  <div 
                    className="text-white/70 prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    data-testid="text-product-description"
                  />
                )}

                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#e8dac9] uppercase tracking-wider">
                      Select Variant
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => {
                        const isSelected = selectedVariant === variant.id;
                        const inCart = isInCart(variant.id);
                        const attrLabel = variant.attributes?.map(a => a.values.map(v => v.name).join(', ')).join(' / ') || variant.name;
                        
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant.id)}
                            className={`px-4 py-2 text-sm rounded-sm border transition-all ${
                              isSelected 
                                ? 'bg-[#e8dac9] text-[#2a201c] border-[#e8dac9]' 
                                : 'bg-transparent text-white/70 border-white/20 hover:border-[#e8dac9]'
                            }`}
                            data-testid={`btn-variant-${variant.id}`}
                          >
                            {attrLabel}
                            {inCart && <Check className="inline-block ml-2 h-3 w-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-white/20 rounded-sm">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 text-white/60 hover:text-white transition-colors"
                      data-testid="btn-quantity-minus"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 text-[#e8dac9] min-w-[3rem] text-center" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 text-white/60 hover:text-white transition-colors"
                      data-testid="btn-quantity-plus"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full bg-[#c45d36] hover:bg-[#a04d2e] text-white py-6 text-lg uppercase tracking-wider"
                  disabled={!product.variants || product.variants.length === 0}
                  data-testid="btn-add-to-cart"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                {currentVariant?.sku && (
                  <p className="text-xs text-white/40">
                    SKU: {currentVariant.sku}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
