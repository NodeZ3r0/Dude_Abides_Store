import { Link } from "wouter";
import { ShoppingBag, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import logoImage from "@assets/Dude-sweater-design-shirt-6000x6000 (1)_1764417402275.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs md:text-sm font-bold tracking-widest uppercase">
        Welcome to The Dude Abides Shop! Let's check out our latest Blogs! <span className="underline cursor-pointer ml-2">Check it Out Now</span>
      </div>
      
      <div className="bg-[#1a120f] text-white/70 py-1 text-center text-xs font-medium tracking-wide border-b border-white/5">
        Strikes & Gutters, Man...
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-white/10">
        <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
          
          {/* Mobile Menu & Search (Left on Mobile) */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background border-r-white/10 text-foreground bg-pattern-overlay">
                <nav className="relative z-10 flex flex-col gap-6 mt-10">
                  <Link href="/" className="text-2xl font-display hover:text-primary transition-colors">Home</Link>
                  <Link href="/catalog" className="text-2xl font-display hover:text-primary transition-colors">All Categories</Link>
                  <Link href="/about" className="text-2xl font-display hover:text-primary transition-colors">About The Dude</Link>
                  <Link href="/blog" className="text-2xl font-display hover:text-primary transition-colors">Blog</Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo - Left on Desktop, Center on Mobile */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src={logoImage} 
                alt="The Dude Abides Logo" 
                className="h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-lg" 
              />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
             <div className="relative w-full">
                <Input 
                  placeholder="All categories | What are you looking for?" 
                  className="w-full bg-[#2a201c] border-none text-sm rounded-sm h-10 pr-10 focus-visible:ring-1 focus-visible:ring-primary placeholder:text-white/30 text-white"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-white/50" />
             </div>
          </div>

          {/* Desktop Nav Links (Bottom row usually, but inline here for simplicity) */}
          <nav className="hidden lg:flex items-center gap-6 mr-6">
            <Link href="/" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80">Home</Link>
            <Link href="/catalog" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80">Catalog</Link>
            <Link href="/contact" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80">Contact</Link>
            <Link href="/shop" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80">Shop</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium mr-4 text-foreground/80 hover:text-primary cursor-pointer">
               <User className="h-5 w-5" />
               <span>Login</span>
            </div>
            
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-white">
                0
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#150f0d] text-white pt-16 pb-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          {/* Newsletter */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h4 className="font-display text-2xl mb-4 tracking-wider">Subscribe Dudes!</h4>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto text-sm leading-relaxed">
              Alright, man, subscribing to our email list is like getting a direct line to all things groovy. 
              You'll stay in the know about cool designs, deals, and whatever else ties your world together. 
              No spam, just vibes, dude. Hit that button and abide with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
               <Input placeholder="Email address" className="bg-transparent border-white/20 text-white h-12 rounded-sm" />
               <Button className="bg-[#e8dac9] text-[#150f0d] hover:bg-white h-12 px-8 font-bold rounded-sm uppercase tracking-widest">Sign up</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
            <div>
              <h4 className="font-display font-bold text-lg mb-6 tracking-wider text-[#e8dac9]">Main menu</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Catalog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Search</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-lg mb-6 tracking-wider text-[#e8dac9]">Follow us</h4>
              <div className="flex gap-4 text-white/60">
                 {/* Social Icons placeholders */}
                 <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">FB</div>
                 <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">IG</div>
                 <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">TT</div>
              </div>
            </div>

            <div className="md:col-span-2">
               <h4 className="font-display font-bold text-lg mb-6 tracking-wider text-[#e8dac9]">About The Dude Abides</h4>
               <p className="text-sm text-white/60 leading-relaxed">
                 We are a print-on-demand shop dedicated to the lifestyle of taking it easy. 
                 Our products are made for those who don't roll on Shabbos and enjoy a good rug.
               </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2025 The Dude Abides</p>
            <div className="flex gap-4">
               <span>USD $</span>
               <span>English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}