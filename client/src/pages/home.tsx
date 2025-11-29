import { Layout } from "@/components/layout";
import { mockProducts } from "@/lib/mockData";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import rugPattern from "@assets/generated_images/a_cozy_rug_texture_pattern_inspired_by_the_big_lebowski.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={rugPattern} 
            alt="Rug Pattern" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6 animate-in fade-in zoom-in duration-1000">
            <span className="px-4 py-2 bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-lg">
              New Collection Drop
            </span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-secondary drop-shadow-2xl mb-6 animate-in slide-in-from-bottom-4 duration-1000 delay-200">
            THE DUDE<br/>ABIDES
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 font-medium max-w-2xl mx-auto mb-10 drop-shadow-md animate-in slide-in-from-bottom-4 duration-1000 delay-300">
            The finest apparel and accessories for those who take it easy. 
            It really ties the room together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 font-header tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              SHOP NOW
            </Button>
            <Button size="lg" variant="outline" className="bg-white/80 hover:bg-white text-secondary border-2 border-secondary text-lg px-8 py-6 font-header tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              VIEW CATALOG
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl text-secondary mb-2">Featured Merch</h2>
              <p className="text-muted-foreground">Hand-picked items for the urban achiever.</p>
            </div>
            <Button variant="link" className="text-primary font-bold hidden md:block">
              View All Products &rarr;
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-5xl mb-6">Don't Miss Out, Man</h2>
          <p className="text-xl text-secondary-foreground/80 mb-10 max-w-xl mx-auto">
            Subscribe to our newsletter for occasional updates, new product drops, and bowling league schedules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-md bg-secondary-foreground/10 border border-secondary-foreground/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}