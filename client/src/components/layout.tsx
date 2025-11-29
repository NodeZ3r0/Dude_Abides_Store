import { Link } from "wouter";
import { ShoppingBag, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Announcement Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 text-center text-sm font-medium tracking-wide">
        FREE SHIPPING ON ORDERS OVER $50 | THE DUDE ABIDES
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80 text-secondary-foreground shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background border-r-border">
                <nav className="flex flex-col gap-6 mt-10">
                  <Link href="/" className="text-2xl font-display text-secondary hover:text-primary transition-colors">Home</Link>
                  <Link href="/catalog" className="text-2xl font-display text-secondary hover:text-primary transition-colors">Catalog</Link>
                  <Link href="/about" className="text-2xl font-display text-secondary hover:text-primary transition-colors">About The Dude</Link>
                  <Link href="/contact" className="text-2xl font-display text-secondary hover:text-primary transition-colors">Contact</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 w-12 rounded-full bg-primary overflow-hidden border-2 border-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
               {/* Placeholder for logo if image fails */}
               <span className="font-display text-primary-foreground text-xs text-center leading-tight font-bold">THE<br/>DUDE<br/>ABIDES</span>
            </div>
            <span className="hidden md:block text-2xl font-display font-bold tracking-wider text-primary-foreground group-hover:text-primary transition-colors">
              THE DUDE ABIDES
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">Home</Link>
            <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">Catalog</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
             {isSearchOpen ? (
                <div className="absolute md:relative top-20 md:top-0 left-0 w-full md:w-auto bg-secondary p-4 md:p-0 animate-in fade-in slide-in-from-top-2">
                   <form className="relative w-full md:w-64" onSubmit={(e) => { e.preventDefault(); setIsSearchOpen(false); }}>
                      <Input 
                        placeholder="Search for products..." 
                        className="pr-10 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50 focus-visible:ring-primary"
                        autoFocus
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-0 top-0 h-full text-secondary-foreground hover:text-primary"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        X
                      </Button>
                   </form>
                </div>
             ) : (
               <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-primary transition-colors" onClick={() => setIsSearchOpen(true)}>
                 <Search className="h-5 w-5" />
               </Button>
             )}
            
            <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-primary transition-colors">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-secondary-foreground hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
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
      <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-primary/20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-display text-primary">The Dude Abides</h3>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">
              The official shop for achievers. We abide by the highest standards of comfort and style.
            </p>
          </div>
          
          <div>
            <h4 className="font-header font-bold text-lg mb-6 tracking-wider">SHOP</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Apparel</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Home Goods</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Stickers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-header font-bold text-lg mb-6 tracking-wider">INFO</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-header font-bold text-lg mb-6 tracking-wider">NEWSLETTER</h4>
             <p className="text-sm text-secondary-foreground/70 mb-4">Subscribe to stay up to date on our upcoming sales.</p>
             <div className="flex gap-2">
               <Input placeholder="Enter email" className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground" />
               <Button className="bg-primary hover:bg-primary/90 text-white font-bold">JOIN</Button>
             </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pt-8 border-t border-secondary-foreground/10 text-center text-xs text-secondary-foreground/50">
          <p>&copy; 2025 The Dude Abides. Powered by The WOPR Foundation.</p>
        </div>
      </footer>
    </div>
  );
}