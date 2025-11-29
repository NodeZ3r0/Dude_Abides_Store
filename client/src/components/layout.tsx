import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs md:text-sm font-bold tracking-widest uppercase">
        Welcome to The Dude Abides Shop! Let's check out our latest Blogs! <span className="underline cursor-pointer ml-2">Check it Out Now</span>
      </div>
      
      <div className="bg-[#1a120f] text-white/70 py-1 text-center text-xs font-medium tracking-wide border-b border-white/5">
        Strikes & Gutters, Man...
      </div>

      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}