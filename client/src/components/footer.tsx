import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
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
  );
}