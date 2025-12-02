import { Layout } from "@/components/layout";
import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    slug: "real-american-value-menu",
    title: "The Real American Value Menu",
    date: "July 20, 2025",
    excerpt: "Cut the military budget in half - still the biggest in the world. Universal healthcare. Free college. Rebuild infrastructure. That's the real value menu America needs. Stop letting billionaires convince you that helping people is radical.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
    category: "Politics",
    readTime: "5 min read"
  },
  {
    id: 2,
    slug: "wired-for-democracy",
    title: "Wired for Democracy",
    date: "July 19, 2025",
    excerpt: "As liberal democratic nations come under increasing pressure from authoritarian movements, we must remember what's at stake. Democracy isn't just about voting - it's about the fundamental respect for human dignity and the rule of law.",
    image: "https://images.unsplash.com/photo-1540910419868-474947ce5716?q=80&w=800&auto=format&fit=crop",
    category: "Democracy",
    readTime: "8 min read"
  },
  {
    id: 3,
    slug: "blitzgrift-chaos-governance",
    title: "The Blitzgrift: When Governance Turns into Chaos",
    date: "March 12, 2025",
    excerpt: "Donald Trump in the eye of Hurricane DOGE, celebrating the destruction of institutional norms while ordinary Americans bear the brunt of policy chaos. The grift continues unabated while democracy burns.",
    image: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?q=80&w=800&auto=format&fit=crop",
    category: "Commentary",
    readTime: "10 min read"
  },
  {
    id: 4,
    slug: "bowling-for-sanity",
    title: "Bowling for Sanity",
    date: "February 28, 2025",
    excerpt: "In times of chaos, sometimes you just need to roll with it. Finding zen in the simple pleasures - a cold beverage, good friends, and the satisfying sound of pins crashing. The Dude abides, and so can you.",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800&auto=format&fit=crop",
    category: "Lifestyle",
    readTime: "4 min read"
  },
  {
    id: 5,
    slug: "rug-economy",
    title: "The Rug Economy: What Really Ties the Room Together",
    date: "February 15, 2025",
    excerpt: "An exploration of how small things - the rugs, the rituals, the routines - create the fabric of our daily lives. And what happens when someone comes along and tries to take that away.",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=800&auto=format&fit=crop",
    category: "Philosophy",
    readTime: "6 min read"
  },
  {
    id: 6,
    slug: "abide-resistance",
    title: "Abide as Resistance",
    date: "January 30, 2025",
    excerpt: "In a world that demands constant productivity, choosing to abide is an act of rebellion. Reclaiming our time, our peace, and our sanity from the grind culture that profits from our exhaustion.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    category: "Philosophy",
    readTime: "7 min read"
  }
];

export default function Blog() {
  return (
    <Layout>
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-[#e8dac9] mb-4">
              The Dude's Dispatch
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Thoughts, musings, and occasional rants from those who give a damn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group cursor-pointer bg-[#2a201c] hover:bg-[#3a2c26] transition-colors rounded-sm overflow-hidden h-full flex flex-col"
                data-testid={`blog-card-${post.slug}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-[#c45d36] uppercase tracking-wider">{post.category}</span>
                    <span className="text-xs text-white/30">•</span>
                    <span className="text-xs text-white/40">{post.readTime}</span>
                  </div>
                  <h2 className="font-display text-[#e8dac9] text-xl mb-3 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-white/60 mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{post.date}</span>
                    <span className="text-xs text-[#c45d36] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export { blogPosts };
