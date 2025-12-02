import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  const total = getTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-24 w-24 text-white/20 mx-auto mb-8" />
            <h1 className="font-display text-4xl text-[#e8dac9] mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-white/60 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products">
              <Button className="bg-[#e8dac9] text-[#2a201c] hover:bg-white" data-testid="btn-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl text-[#e8dac9]">
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
            <Button 
              variant="ghost" 
              className="text-white/50 hover:text-[#c45d36]"
              onClick={clearCart}
              data-testid="btn-clear-cart"
            >
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-6 bg-[#2a201c] rounded-sm p-4"
                  data-testid={`cart-item-${item.variantId}`}
                >
                  <Link href={`/products/${item.productSlug}`} className="flex-shrink-0">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-white/5 rounded-sm flex items-center justify-center text-white/30">
                        No img
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.productSlug}`}>
                        <h3 className="text-[#e8dac9] font-medium hover:text-primary transition-colors" data-testid={`text-item-name-${item.variantId}`}>
                          {item.productName}
                        </h3>
                      </Link>
                      <p className="text-sm text-white/50">{item.variantName}</p>
                      {item.sku && <p className="text-xs text-white/30">SKU: {item.sku}</p>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-white/20 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-white/60 hover:text-white transition-colors"
                          data-testid={`btn-minus-${item.variantId}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-[#e8dac9] text-sm" data-testid={`text-qty-${item.variantId}`}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-white/60 hover:text-white transition-colors"
                          data-testid={`btn-plus-${item.variantId}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/40 hover:text-[#c45d36] transition-colors"
                        data-testid={`btn-remove-${item.variantId}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[#e8dac9] font-bold" data-testid={`text-price-${item.variantId}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-white/40">
                        ${item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#2a201c] rounded-sm p-6 sticky top-4">
                <h2 className="font-display text-xl text-[#e8dac9] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-[#e8dac9] font-bold text-lg">
                      <span>Total</span>
                      <span data-testid="text-total">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button 
                    className="w-full bg-[#c45d36] hover:bg-[#a04d2e] text-white py-6 text-lg uppercase tracking-wider"
                    data-testid="btn-checkout"
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="text-xs text-white/40 text-center mt-4">
                  Taxes calculated at checkout
                </p>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link href="/products" className="text-sm text-[#c45d36] hover:text-white flex items-center justify-center gap-2 transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
