import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { Link, useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ChevronLeft, Lock, CheckCircle, Loader2 } from "lucide-react";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

async function getStripe() {
  if (!stripePromise) {
    const response = await fetch("/api/stripe/config");
    const { publishableKey } = await response.json();
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

interface ShippingInfo {
  name: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

function CheckoutForm({ 
  clientSecret, 
  shipping,
  onSuccess 
}: { 
  clientSecret: string;
  shipping: ShippingInfo;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: shipping.email,
        shipping: {
          name: shipping.name,
          address: {
            line1: shipping.address.line1,
            line2: shipping.address.line2,
            city: shipping.address.city,
            state: shipping.address.state,
            postal_code: shipping.address.postal_code,
            country: shipping.address.country,
          },
        },
      },
    });

    if (submitError) {
      setError(submitError.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#2a201c] rounded-sm p-6">
        <h3 className="text-lg font-display text-[#e8dac9] mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Secure Payment
        </h3>
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#c45d36] hover:bg-[#a04d2e] text-white py-6 text-lg uppercase tracking-wider"
        data-testid="btn-pay"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Purchase"
        )}
      </Button>

      <p className="text-xs text-white/40 text-center">
        Your payment is secured with 256-bit SSL encryption
      </p>
    </form>
  );
}

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<any>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    email: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  const total = getTotal();

  useEffect(() => {
    getStripe().then(setStripeInstance);
  }, []);

  useEffect(() => {
    if (items.length === 0 && step !== "success") {
      navigate("/cart");
    }
  }, [items, step, navigate]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPayment(true);

    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          email: shipping.email,
          shipping: shipping,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch (error: any) {
      console.error("Error creating payment:", error);
      alert(error.message || "Failed to initialize payment. Please try again.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setStep("success");
  };

  if (step === "success") {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-screen">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-8" />
            <h1 className="font-display text-4xl text-[#e8dac9] mb-4">
              Order Confirmed!
            </h1>
            <p className="text-white/60 mb-8">
              Thanks for your order, {shipping.name}! We've sent a confirmation to {shipping.email}.
              Your items will be printed and shipped within 3-5 business days.
            </p>
            <Link href="/products">
              <Button className="bg-[#c45d36] hover:bg-[#a04d2e] text-white" data-testid="btn-continue-shopping">
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
          <Link href="/cart" className="inline-flex items-center gap-2 text-white/60 hover:text-[#e8dac9] mb-8 transition-colors" data-testid="link-back-cart">
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === "shipping" ? "bg-[#c45d36] text-white" : "bg-[#e8dac9] text-[#2a201c]"
                }`}>
                  1
                </div>
                <span className={step === "shipping" ? "text-[#e8dac9]" : "text-white/40"}>
                  Shipping
                </span>
                <div className="h-px flex-1 bg-white/10" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === "payment" ? "bg-[#c45d36] text-white" : "bg-white/10 text-white/40"
                }`}>
                  2
                </div>
                <span className={step === "payment" ? "text-[#e8dac9]" : "text-white/40"}>
                  Payment
                </span>
              </div>

              {step === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h2 className="font-display text-2xl text-[#e8dac9] mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name" className="text-white/70">Full Name</Label>
                      <Input
                        id="name"
                        value={shipping.name}
                        onChange={(e) => setShipping(s => ({ ...s, name: e.target.value }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="Jeffrey Lebowski"
                        data-testid="input-name"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email" className="text-white/70">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shipping.email}
                        onChange={(e) => setShipping(s => ({ ...s, email: e.target.value }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="thedude@abides.com"
                        data-testid="input-email"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address1" className="text-white/70">Address Line 1</Label>
                      <Input
                        id="address1"
                        value={shipping.address.line1}
                        onChange={(e) => setShipping(s => ({ 
                          ...s, 
                          address: { ...s.address, line1: e.target.value }
                        }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="123 Bowling Lane"
                        data-testid="input-address1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address2" className="text-white/70">Address Line 2 (Optional)</Label>
                      <Input
                        id="address2"
                        value={shipping.address.line2}
                        onChange={(e) => setShipping(s => ({ 
                          ...s, 
                          address: { ...s.address, line2: e.target.value }
                        }))}
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="Apt 4B"
                        data-testid="input-address2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-white/70">City</Label>
                      <Input
                        id="city"
                        value={shipping.address.city}
                        onChange={(e) => setShipping(s => ({ 
                          ...s, 
                          address: { ...s.address, city: e.target.value }
                        }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="Los Angeles"
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white/70">State</Label>
                      <Input
                        id="state"
                        value={shipping.address.state}
                        onChange={(e) => setShipping(s => ({ 
                          ...s, 
                          address: { ...s.address, state: e.target.value }
                        }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="CA"
                        data-testid="input-state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-white/70">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={shipping.address.postal_code}
                        onChange={(e) => setShipping(s => ({ 
                          ...s, 
                          address: { ...s.address, postal_code: e.target.value }
                        }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="90001"
                        data-testid="input-zip"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-white/70">Country</Label>
                      <Input
                        id="country"
                        value={shipping.address.country}
                        onChange={(e) => setShipping(s => ({ 
                          ...s, 
                          address: { ...s.address, country: e.target.value }
                        }))}
                        required
                        className="bg-[#2a201c] border-white/10 text-[#e8dac9] mt-1"
                        placeholder="US"
                        data-testid="input-country"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoadingPayment}
                    className="w-full bg-[#c45d36] hover:bg-[#a04d2e] text-white py-6 text-lg uppercase tracking-wider"
                    data-testid="btn-continue-payment"
                  >
                    {isLoadingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </form>
              )}

              {step === "payment" && clientSecret && stripeInstance && (
                <Elements 
                  stripe={stripeInstance} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#c45d36',
                        colorBackground: '#2a201c',
                        colorText: '#e8dac9',
                        colorTextSecondary: '#e8dac9',
                        borderRadius: '2px',
                      },
                    },
                  }}
                >
                  <div className="mb-6">
                    <button 
                      onClick={() => setStep("shipping")}
                      className="text-[#c45d36] hover:text-white text-sm flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      Edit shipping info
                    </button>
                    <div className="mt-4 p-4 bg-[#2a201c] rounded-sm">
                      <p className="text-white/70 text-sm">Shipping to:</p>
                      <p className="text-[#e8dac9]">{shipping.name}</p>
                      <p className="text-white/60 text-sm">
                        {shipping.address.line1}
                        {shipping.address.line2 && `, ${shipping.address.line2}`}
                      </p>
                      <p className="text-white/60 text-sm">
                        {shipping.address.city}, {shipping.address.state} {shipping.address.postal_code}
                      </p>
                    </div>
                  </div>
                  <CheckoutForm 
                    clientSecret={clientSecret}
                    shipping={shipping}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              )}
            </div>

            <div className="lg:order-last">
              <div className="bg-[#2a201c] rounded-sm p-6 sticky top-4">
                <h2 className="font-display text-xl text-[#e8dac9] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.productName} className="w-16 h-16 object-cover rounded-sm" />
                      ) : (
                        <div className="w-16 h-16 bg-white/5 rounded-sm" />
                      )}
                      <div className="flex-1">
                        <p className="text-[#e8dac9] text-sm">{item.productName}</p>
                        <p className="text-white/40 text-xs">{item.variantName}</p>
                        <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[#e8dac9] font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-[#e8dac9] font-bold text-lg">
                      <span>Total</span>
                      <span data-testid="text-checkout-total">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
