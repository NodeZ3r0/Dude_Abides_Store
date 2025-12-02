import { Link } from "wouter";
import { ShoppingBag, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import logoImage from "@assets/logo-400_1764430531407.png";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-white/10">
      <div className="w-full px-3 md:container md:mx-auto md:px-4 h-20 md:h-24 flex items-center">
        
        {/* Mobile Menu & Search (Left on Mobile) - equal width column */}
        <div className="flex flex-1 basis-0 items-center gap-0 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary h-9 w-9" data-testid="btn-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-r-white/10 text-foreground bg-pattern-overlay">
              <nav className="relative z-10 flex flex-col gap-6 mt-10">
                <Link href="/" className="text-2xl font-display hover:text-primary transition-colors">Home</Link>
                <Link href="/products" className="text-2xl font-display hover:text-primary transition-colors">Shop All</Link>
                <Link href="/about" className="text-2xl font-display hover:text-primary transition-colors">About The Dude</Link>
                <Link href="/blog" className="text-2xl font-display hover:text-primary transition-colors">Blog</Link>
                <Link href="/cart" className="text-2xl font-display hover:text-primary transition-colors">Cart ({itemCount})</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary h-9 w-9">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo - Center on Mobile, Left on Desktop */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link href="/" className="flex items-center group">
            <img 
              src={logoImage} 
              alt="The Dude Abides Logo" 
              className="h-14 md:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-lg" 
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
          <Link href="/" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80" data-testid="link-home">Home</Link>
          <Link href="/products" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80" data-testid="link-products">Shop</Link>
          <Link href="/blog" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80" data-testid="link-blog">Blog</Link>
          <Link href="/about" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider text-foreground/80" data-testid="link-about">About</Link>
        </nav>

        {/* Actions - equal width column on mobile, right-aligned */}
        <div className="flex flex-1 basis-0 items-center justify-end gap-2 md:flex-none md:basis-auto">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium mr-4 text-foreground/80 hover:text-primary cursor-pointer">
             <User className="h-5 w-5" />
             <span>Login</span>
          </div>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary transition-colors" data-testid="btn-cart">
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#c45d36] text-[10px] font-bold flex items-center justify-center text-white" data-testid="cart-count">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}