import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Truck, Percent } from "lucide-react";
import { useProducts, useSeedProducts, useSaleorProducts, type SaleorProduct } from "@/lib/api";

// Mock Data for Blogs
const blogs = [
  {
    id: 1,
    title: "The Real American Value Menu",
    date: "July 20, 2025",
    excerpt: "Cut the military budget in half - still the biggest in the world.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Wired for Democracy",
    date: "July 19, 2025",
    excerpt: "As liberal democratic nations come under increasing pressure...",
    image: "https://images.unsplash.com/photo-1540910419868-474947ce5716?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "The Blitzgrift: When Governance Turns into Chaos",
    date: "March 12, 2025",
    excerpt: "Donald Trump in the eye of Hurricane DOGE, celebrating the destruction...",
    image: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?q=80&w=600&auto=format&fit=crop"
  }
];

export default function Home() {
  const { data: products, isLoading, error } = useProducts();
  const { data: saleorProducts, isLoading: saleorLoading, error: saleorError } = useSaleorProducts('default-channel', 8);
  const seedMutation = useSeedProducts();

  const handleSeedData = () => {
    seedMutation.mutate();
  };

  return (
    <Layout>
      {/* Hero Text Section */}
      <section className="py-20 md:py-32 text-center bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-[#e8dac9] mb-6 animate-in slide-in-from-bottom-4 duration-700">
            THE DUDE<br/>ABIDES
          </h1>
          <h2 className="font-display text-2xl md:text-4xl text-[#e8dac9] mb-12 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Merch for Those Who Give A Damn
          </h2>
          
          <h3 className="font-display text-xl md:text-2xl text-[#e8dac9] opacity-90 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            Featured Products
          </h3>
        </div>
      </section>
      
      {/* Featured Product Highlight - Single Item (Like Hoodie in screenshot) */}
      <section className="pb-16 bg-background">
         <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto group cursor-pointer">
               <div className="aspect-[4/5] overflow-hidden rounded-sm bg-white/5 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop" 
                    alt="Snapback Hat" 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#3d2b25] p-4 text-center">
                     <h3 className="font-display text-[#e8dac9] text-xl">Snapback Hat</h3>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Features Icons Bar - Cream Background with Pattern */}
      <section className="py-12 bg-[#e8dac9] text-[#2a201c] bg-pattern-overlay">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-center relative z-10">
           <div className="flex flex-col items-center gap-4">
              <Truck className="h-10 w-10 stroke-1" />
              <div>
                 <h4 className="font-display text-lg font-bold mb-1">Free Shipping</h4>
                 <p className="text-sm opacity-80">All of our products offer Free Shipping!</p>
              </div>
           </div>
           <div className="flex flex-col items-center gap-4">
              <Percent className="h-10 w-10 stroke-1" />
              <div>
                 <h4 className="font-display text-lg font-bold mb-1">The Dude's Discount</h4>
                 <p className="text-sm opacity-80">Buy 3 or more products and get 15% off!</p>
              </div>
           </div>
        </div>
      </section>

      {/* Saleor Products from Production Store */}
      <section className="py-20 bg-background text-[#e8dac9]">
        <div className="container mx-auto px-4">
           <h2 className="font-display text-2xl md:text-3xl text-center mb-4 tracking-wide">
              Products from Saleor Store
           </h2>
           <p className="text-center text-sm text-white/50 mb-12">
              Live data from dudeabides.wopr.systems
           </p>
           
           {saleorLoading && (
             <div className="text-center py-12">
               <p className="text-[#e8dac9]">Loading from Saleor...</p>
             </div>
           )}
           
           {saleorError && (
             <div className="text-center py-12">
               <p className="text-[#c45d36] mb-2">Could not connect to Saleor API</p>
               <p className="text-white/50 text-sm">Check that VITE_SALEOR_API_URL is set correctly</p>
             </div>
           )}
           
           {saleorProducts && saleorProducts.length > 0 && (
             <>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {saleorProducts.slice(0, 8).map((product: SaleorProduct) => (
                   <div key={product.id} className="group">
                      <div className="aspect-square bg-white/5 overflow-hidden rounded-sm mb-4 relative">
                         <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                            <div className="h-4 w-4 border border-white/30 rounded-sm"></div>
                            <span className="text-[10px] uppercase tracking-wider text-white/70">Compare</span>
                         </div>
                         {product.thumbnail?.url ? (
                           <img src={product.thumbnail.url} alt={product.thumbnail.alt || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-white/30">No image</div>
                         )}
                         <div className="absolute bottom-0 left-0 w-full p-2 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity text-center">
                            <Button size="sm" className="w-full bg-[#e8dac9] text-background hover:bg-white text-xs uppercase font-bold">Quick Shop</Button>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="font-bold text-[#e8dac9]" data-testid={`text-saleor-price-${product.id}`}>
                           ${product.pricing?.priceRange?.start?.gross?.amount?.toFixed(2) || '0.00'}
                         </p>
                         <h3 className="text-sm text-white/80 font-medium leading-tight hover:text-primary cursor-pointer" data-testid={`text-saleor-name-${product.id}`}>{product.name}</h3>
                         <p className="text-xs text-[#c45d36]">The Dude Abides®</p>
                         <p className="text-xs text-green-500 uppercase tracking-wide">In stock</p>
                      </div>
                   </div>
                ))}
               </div>
               
               <div className="text-center mt-12">
                  <Button className="bg-[#e8dac9] text-[#2a201c] hover:bg-white px-8 py-6 text-sm font-bold uppercase tracking-widest rounded-sm">
                     View All Products
                  </Button>
               </div>
             </>
           )}
           
           {saleorProducts && saleorProducts.length === 0 && !saleorLoading && (
             <div className="text-center py-12">
               <p className="text-white/50">No products found in Saleor store</p>
             </div>
           )}
        </div>
      </section>

      {/* Pride Collection Grid (Local Database) */}
      <section className="py-20 bg-[#1a120f] text-[#e8dac9] border-t border-white/5">
        <div className="container mx-auto px-4">
           <h2 className="font-display text-2xl md:text-3xl text-center mb-4 tracking-wide">
              Pride Lives Here LGBTQIA+ Collection
           </h2>
           <p className="text-center text-sm text-white/50 mb-12">
              Local staging data
           </p>
           
           {isLoading && (
             <div className="text-center py-12">
               <p className="text-[#e8dac9]">Loading products...</p>
             </div>
           )}
           
           {error && (
             <div className="text-center py-12">
               <p className="text-[#c45d36] mb-4">No local products found. Would you like to add some?</p>
               <Button 
                 onClick={handleSeedData}
                 disabled={seedMutation.isPending}
                 className="bg-[#e8dac9] text-[#2a201c] hover:bg-white"
                 data-testid="button-seed-products"
               >
                 {seedMutation.isPending ? "Adding Products..." : "Add Sample Products"}
               </Button>
             </div>
           )}
           
           {products && products.length > 0 && (
             <>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {products.slice(0,4).map((product) => (
                   <div key={product.id} className="group">
                      <div className="aspect-square bg-white/5 overflow-hidden rounded-sm mb-4 relative">
                         <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                            <div className="h-4 w-4 border border-white/30 rounded-sm"></div>
                            <span className="text-[10px] uppercase tracking-wider text-white/70">Compare</span>
                         </div>
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                         <div className="absolute bottom-0 left-0 w-full p-2 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity text-center">
                            <Button size="sm" className="w-full bg-[#e8dac9] text-background hover:bg-white text-xs uppercase font-bold">Quick Shop</Button>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="flex gap-1 justify-center mb-2">
                            <div className="h-3 w-3 rounded-full bg-black border border-white/20"></div>
                            <div className="h-3 w-3 rounded-full bg-blue-900 border border-white/20"></div>
                            <div className="h-3 w-3 rounded-full bg-gray-500 border border-white/20"></div>
                            <span className="text-[10px] text-white/50 ml-1">+17</span>
                         </div>
                         <p className="font-bold text-[#e8dac9]" data-testid={`text-price-${product.id}`}>${parseFloat(product.price).toFixed(2)}</p>
                         <h3 className="text-sm text-white/80 font-medium leading-tight hover:text-primary cursor-pointer" data-testid={`text-name-${product.id}`}>{product.name}</h3>
                         <p className="text-xs text-[#c45d36]">The Dude Abides®</p>
                         <p className="text-xs text-green-500 uppercase tracking-wide">In stock</p>
                      </div>
                   </div>
                ))}
               </div>
               
               <div className="text-center mt-12">
                  <Button className="bg-[#e8dac9] text-[#2a201c] hover:bg-white px-8 py-6 text-sm font-bold uppercase tracking-widest rounded-sm">
                     Buy Now!
                  </Button>
               </div>
             </>
           )}
        </div>
      </section>

      {/* Hero Banner - Beach Life */}
      <section className="py-12 bg-[#2a1a15] border-y border-white/5">
         <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex justify-center">
               <div className="relative max-w-xs">
                  <img src="https://images.unsplash.com/photo-1545959796-9659fa30a30b?q=80&w=600&auto=format&fit=crop" alt="Tank Top" className="rounded-sm shadow-2xl"/>
                  {/* Thumbnails sidebar simulation */}
                  <div className="absolute -left-16 top-0 bottom-0 w-12 flex flex-col gap-2 overflow-hidden">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-full aspect-[3/4] bg-white/10 border border-white/20"></div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
               <h2 className="font-display text-4xl md:text-5xl text-[#e8dac9] mb-4">Beach Life Is<br/>The Best Life</h2>
               <p className="text-xl text-[#e8dac9] font-bold mb-6">$25.99</p>
               <Button variant="link" className="text-[#c45d36] hover:text-white p-0 text-sm font-bold uppercase tracking-wider decoration-2 underline-offset-4">
                  View full details
               </Button>
            </div>
         </div>
      </section>

      {/* Collections List */}
      <section className="py-20 bg-background">
         <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl text-center text-[#e8dac9] mb-12 tracking-wide">
               The Dude's Collections
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { title: "Clothing for Men", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400&auto=format&fit=crop" },
                  { title: "Clothing for Women", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400&auto=format&fit=crop" },
                  { title: "Clothing For Kids", img: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=400&auto=format&fit=crop" },
                  { title: "Coffee Mugs and Water Bottles", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400&auto=format&fit=crop" }
               ].map((col, idx) => (
                  <div key={idx} className="group cursor-pointer text-center">
                     <div className="aspect-square bg-white overflow-hidden rounded-sm mb-4 flex items-center justify-center p-4">
                        <img src={col.img} alt={col.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"/>
                     </div>
                     <h3 className="font-display text-[#e8dac9] text-sm leading-tight group-hover:text-primary">{col.title}</h3>
                  </div>
               ))}
            </div>
            <div className="text-center mt-12">
              <Button className="bg-[#e8dac9] text-[#2a201c] hover:bg-white px-8 py-2 text-xs font-bold uppercase tracking-widest rounded-sm">
                 View All
              </Button>
           </div>
         </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-[#1a120f] border-t border-white/5">
         <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl text-center text-[#e8dac9] mb-12 tracking-wide">
               Blog posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {blogs.map((blog) => (
                  <div key={blog.id} className="group cursor-pointer bg-[#2a201c] hover:bg-[#3a2c26] transition-colors rounded-sm overflow-hidden h-full flex flex-col">
                     <div className="aspect-video overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                     </div>
                     <div className="p-6 flex-1 flex flex-col text-center">
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">{blog.date}</p>
                        <h3 className="font-display text-[#e8dac9] text-xl mb-4 leading-tight group-hover:text-primary">{blog.title}</h3>
                        <p className="text-sm text-white/60 mb-6 flex-1 line-clamp-3">{blog.excerpt}</p>
                        <span className="text-xs text-[#c45d36] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Read now &gt;</span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="text-center mt-12">
               <span className="text-xs text-[#c45d36] font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">See more &gt;</span>
            </div>
         </div>
      </section>
    </Layout>
  );
}