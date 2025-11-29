import { Link } from "wouter";
import { ShoppingBag, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import logoImage from "@assets/Dude-sweater-design-shirt-6000x6000 (1)_1764417402275.png";

export function Header() {
  return (
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

        {/* Desktop Nav Links */}
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
  );
}