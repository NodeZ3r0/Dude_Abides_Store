import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-[#1a120f] text-center overflow-hidden">
        <div className="absolute inset-0 bg-pattern-overlay opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-display text-5xl md:text-7xl text-[#e8dac9] mb-6 animate-in slide-in-from-bottom-4 duration-700">
            The Dude's Tale
          </h1>
          <p className="text-xl md:text-2xl text-[#e8dac9]/80 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-200 font-sans">
            Way out west there was this fella... fella I wanna tell ya about.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-invert prose-lg mx-auto text-[#e8dac9]/90 font-sans leading-relaxed">
            <p className="text-2xl font-display mb-8 text-[#c45d36]">
              Sometimes there's a man...
            </p>
            <p className="mb-6">
              I won't say a hero, 'cause, what's a hero? But sometimes, there's a man. 
              And I'm talkin' about the Dude here. Sometimes, there's a man, well, 
              he's the man for his time and place. He fits right in there. And that's the Dude.
            </p>
            
            <div className="my-12 p-8 bg-[#2a201c] border-l-4 border-[#c45d36] rounded-r-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 modal-pattern"></div>
              <p className="relative z-10 text-xl italic text-[#e8dac9]">
                "The Dude abides. I don't know about you but I take comfort in that. 
                It's good knowin' he's out there. The Dude. Takin' 'er easy for all us sinners."
              </p>
            </div>

            <h3 className="text-3xl font-display text-[#e8dac9] mt-12 mb-6">Why We Do It</h3>
            <p className="mb-6">
              We started this shop because we believe that comfort isn't just a feeling—it's a lifestyle. 
              Whether you're rolling rocks at the local alley, enjoying a beverage, or just listening to 
              some whale songs in the bath, you deserve gear that abides.
            </p>
            <p>
              Our prints are high quality, our fabrics are soft, and our ethos is simple: 
              <strong>Take it easy, man.</strong>
            </p>
          </div>

          <div className="mt-16 text-center">
            <Button className="bg-[#c45d36] hover:bg-[#a04b2b] text-white px-12 py-6 text-lg font-bold uppercase tracking-widest rounded-sm shadow-lg transition-transform hover:-translate-y-1">
              Shop The Collection
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}