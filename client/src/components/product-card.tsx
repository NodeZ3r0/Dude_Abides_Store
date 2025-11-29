import { Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden border-none shadow-none bg-transparent flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5 rounded-sm">
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="h-4 w-4 border border-white/30 rounded-sm bg-transparent"></div>
           <span className="text-[10px] uppercase tracking-wider text-white/70">Compare</span>
        </div>
        
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute bottom-0 left-0 w-full p-2 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity text-center">
          <Button size="sm" className="w-full bg-[#e8dac9] text-background hover:bg-white text-xs uppercase font-bold">
             Quick Shop
          </Button>
        </div>
        
        <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground hover:bg-secondary border-none">
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="pt-4 px-0 flex-grow space-y-1 text-center">
         <div className="flex gap-1 justify-center mb-2">
            <div className="h-3 w-3 rounded-full bg-black border border-white/20"></div>
            <div className="h-3 w-3 rounded-full bg-blue-900 border border-white/20"></div>
            <div className="h-3 w-3 rounded-full bg-gray-500 border border-white/20"></div>
            <span className="text-[10px] text-white/50 ml-1">+9</span>
         </div>
         <p className="font-bold text-[#e8dac9]">${product.price.toFixed(2)}</p>
         <h3 className="font-sans text-sm text-white/80 font-medium leading-tight hover:text-primary cursor-pointer transition-colors line-clamp-2">
          {product.name}
         </h3>
         <p className="text-xs text-[#c45d36]">The Dude Abides®</p>
         <p className="text-[10px] text-green-500 uppercase tracking-wide">In stock</p>
      </CardContent>
    </Card>
  );
}