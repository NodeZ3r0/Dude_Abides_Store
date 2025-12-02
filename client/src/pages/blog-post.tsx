import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { ChevronLeft, Calendar, Clock, Tag } from "lucide-react";
import { blogPosts } from "./blog";

const blogContent: Record<string, string> = {
  "real-american-value-menu": `
    <p>Let me break this down for you in terms everyone can understand. We're told constantly that we can't afford nice things. Universal healthcare? Too expensive. Free college? Impossible. Infrastructure? Maybe next decade.</p>
    
    <p>Meanwhile, we spend more on our military than the next ten countries combined. Cut that in half and we're still the biggest military on the planet by a massive margin. But now we've got hundreds of billions to actually help Americans.</p>
    
    <h2>The Real Numbers</h2>
    
    <p>Universal healthcare would actually save us money. We already pay more per capita than any other developed nation and get worse outcomes. Medicare for All isn't radical - it's common sense.</p>
    
    <p>Free public college? We used to have it. The GI Bill sent millions to college. State schools were essentially free in many places until the 1980s. We've done this before.</p>
    
    <h2>Who's Really Radical?</h2>
    
    <p>You know what's actually radical? Letting people die because they can't afford insulin. Saddling 18-year-olds with six-figure debt. Watching bridges crumble while billionaires build space rockets.</p>
    
    <p>The next time someone tells you we can't afford to help people, ask them why we can always afford another aircraft carrier.</p>
    
    <p>The Dude abides, but the Dude also votes.</p>
  `,
  "wired-for-democracy": `
    <p>Democracy is under attack. Not just in faraway places, but right here at home. And it's not coming from foreign armies - it's coming from within.</p>
    
    <h2>The Authoritarian Playbook</h2>
    
    <p>First, they undermine trust in institutions. The press is "fake news." Elections are "rigged." Courts are "biased." Once people stop believing in the systems designed to protect them, they're ripe for a strongman who promises to "fix everything."</p>
    
    <p>Then comes the scapegoating. Immigrants. Minorities. The "elite." Anyone but the actual people hoarding power and wealth.</p>
    
    <h2>Why It Matters</h2>
    
    <p>Democracy isn't just about voting every few years. It's about the fundamental idea that every person has inherent dignity and worth. That power flows from the people, not down from a king or dictator.</p>
    
    <p>When we give that up, we don't just lose elections. We lose the ability to change things peacefully. We lose the protection of laws that apply equally to everyone. We lose our voice.</p>
    
    <h2>What We Can Do</h2>
    
    <p>Stay informed. Stay engaged. Vote in every election - local, state, and federal. Support local journalism. Talk to your neighbors. Build community.</p>
    
    <p>The forces trying to tear us apart are counting on our apathy. Don't give it to them.</p>
  `,
  "blitzgrift-chaos-governance": `
    <p>There's a method to the madness, and it's called the "firehose of falsehood." Overwhelm people with so much chaos that they can't keep up, can't fact-check, can't organize effective opposition.</p>
    
    <h2>The DOGE Disaster</h2>
    
    <p>When you put people in charge of government who don't believe in government, you shouldn't be surprised when things fall apart. That's not incompetence - that's the plan.</p>
    
    <p>Gut the agencies that protect workers, consumers, and the environment. Then point to the chaos and say "See? Government doesn't work."</p>
    
    <h2>Following the Money</h2>
    
    <p>While everyone's distracted by the latest outrage tweet, the real work continues. Deregulation for donors. Tax cuts for the wealthy. Contracts for cronies.</p>
    
    <p>It's not about ideology. It's about the grift. Always follow the money.</p>
    
    <h2>Breaking the Cycle</h2>
    
    <p>Don't let them exhaust you. That's what they want. Pick your battles. Focus on what matters. Build coalitions. Show up consistently.</p>
    
    <p>They're counting on you giving up. Prove them wrong.</p>
  `,
  "bowling-for-sanity": `
    <p>Sometimes the best thing you can do is step back from the chaos. Not forever - just long enough to remember what actually matters.</p>
    
    <h2>The Simple Pleasures</h2>
    
    <p>A cold beverage on a hot day. The weight of a bowling ball in your hand. The satisfying crash of pins. Good friends who don't take life too seriously.</p>
    
    <p>These things won't save democracy or fix climate change. But they'll keep you sane enough to keep fighting another day.</p>
    
    <h2>The Art of Abiding</h2>
    
    <p>Abiding isn't about giving up. It's about not letting the bastards grind you down. It's about maintaining your humanity in inhuman times.</p>
    
    <p>Take care of yourself. Take care of your people. Roll when it's your turn. Let the little things go.</p>
    
    <p>The Dude abides. And so can you.</p>
  `,
  "rug-economy": `
    <p>That rug really tied the room together. It wasn't just a floor covering - it was the foundation of a space, the thing that made everything else make sense.</p>
    
    <h2>The Things That Matter</h2>
    
    <p>We all have rugs in our lives. The morning coffee ritual. The evening walk. The weekly call with family. These small things create the structure of our days.</p>
    
    <p>When someone takes them away - a job loss, a health crisis, a global pandemic - we feel untethered. The room falls apart.</p>
    
    <h2>Rebuilding After Loss</h2>
    
    <p>You can't always get your rug back. But you can find new things to tie the room together. New rituals. New connections. New foundations.</p>
    
    <p>It takes time. It takes effort. It takes being gentle with yourself when the new things don't feel right immediately.</p>
    
    <p>The room will come together again. Just give it time.</p>
  `,
  "abide-resistance": `
    <p>We're told constantly to hustle. To optimize. To monetize every moment. Rest is weakness. Leisure is laziness.</p>
    
    <h2>The Cult of Productivity</h2>
    
    <p>This isn't an accident. A exhausted population doesn't organize. Doesn't protest. Doesn't demand better. They're too busy trying to survive.</p>
    
    <p>When every hour must be productive, we have no time to think. No time to question. No time to imagine alternatives.</p>
    
    <h2>Choosing to Abide</h2>
    
    <p>Taking time for yourself isn't selfish. It's revolutionary. You're refusing to be ground down by a system designed to extract every last bit of your energy.</p>
    
    <p>Read a book that won't advance your career. Take a nap. Stare at the clouds. Do nothing productive and feel no guilt.</p>
    
    <h2>The Long Game</h2>
    
    <p>Movements are marathons, not sprints. You can't sustain activism if you're burnt out. Rest is preparation for the work ahead.</p>
    
    <p>The Dude didn't save the world. But he kept his sanity. And sometimes that's enough.</p>
  `
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const content = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl text-[#e8dac9] mb-4">Post Not Found</h1>
            <p className="text-white/60 mb-8">Sorry, we couldn't find that blog post.</p>
            <Link href="/blog">
              <Button className="bg-[#e8dac9] text-[#2a201c] hover:bg-white">
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-[#e8dac9] mb-8 transition-colors" data-testid="link-back-blog">
            <ChevronLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="inline-flex items-center gap-1 text-[#c45d36]">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-white/40">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1 text-white/40">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-[#e8dac9] mb-6 leading-tight" data-testid="text-blog-title">
              {post.title}
            </h1>

            <p className="text-xl text-white/70 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          <div className="aspect-video mb-12 overflow-hidden rounded-sm">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {content && (
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:font-display prose-headings:text-[#e8dac9]
                prose-p:text-white/70 prose-p:leading-relaxed
                prose-a:text-[#c45d36] prose-a:no-underline hover:prose-a:text-white
                prose-strong:text-[#e8dac9]
                prose-blockquote:border-l-[#c45d36] prose-blockquote:text-white/50"
              dangerouslySetInnerHTML={{ __html: content }}
              data-testid="blog-content"
            />
          )}

          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Link href="/blog" className="text-[#c45d36] hover:text-white transition-colors">
                ← More posts
              </Link>
              <div className="flex gap-4">
                <span className="text-white/40 text-sm">Share:</span>
                <a href="#" className="text-white/40 hover:text-[#c45d36] transition-colors text-sm">Twitter</a>
                <a href="#" className="text-white/40 hover:text-[#c45d36] transition-colors text-sm">Facebook</a>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </Layout>
  );
}
