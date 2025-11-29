import { Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden border-none shadow-md bg-card hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-4">
           <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg">
             Add to Cart
           </Button>
        </div>
        
        <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground hover:bg-secondary">
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="pt-6 px-4 flex-grow">
        <h3 className="font-display text-xl text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 pb-6 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold text-foreground font-header tracking-wide">
          ${product.price.toFixed(2)}
        </span>
      </CardFooter>
    </Card>
  );
}