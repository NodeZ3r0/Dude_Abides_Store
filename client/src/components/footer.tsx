import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "Featured", href: "/collections/featured" },
        { name: "New Arrivals", href: "/collections/new" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Shipping", href: "/shipping" },
      ],
    },
  ];

  return (
    <footer className="bg-[#4a2c2a] text-[#f5e6d3]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-[#3d2420]">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="font-display text-2xl mb-4 tracking-wider">Subscribe Dudes!</h4>
            <p className="text-[#f5e6d3]/70 mb-6 text-sm leading-relaxed">
              Get the inside scoop on new designs, deals, and all things groovy.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Input 
                placeholder="Email address" 
                className="bg-transparent border-[#f5e6d3]/20 text-[#f5e6d3] h-12 rounded-sm" 
                data-testid="input-newsletter-email"
              />
              <Button 
                className="bg-[#ff6b35] text-[#f5e6d3] hover:bg-[#ff6b35]/90 h-12 px-8 font-bold rounded-sm uppercase tracking-widest"
                data-testid="button-newsletter-submit"
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[#ff6b35] mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name} className="text-sm hover:text-[#ff6b35] transition-colors">
                    <Link href={link.href} data-testid={`link-footer-${link.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col justify-between border-t border-[#3d2420] py-8 sm:flex-row">
          <p className="text-sm text-[#f5e6d3]">
            Copyright &copy; {currentYear} The Dude Abides, powered by The WOPR Foundation
          </p>
          <p className="flex gap-4 text-sm text-[#f5e6d3] mt-4 sm:mt-0">
            <a
              href="https://wopr.foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff6b35] transition-colors"
              data-testid="link-wopr-foundation"
            >
              WOPR Foundation
            </a>
            <span className="text-[#ff6b35]">|</span>
            <a
              href="https://wopr.systems"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff6b35] transition-colors"
              data-testid="link-wopr-systems"
            >
              WOPR Systems
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}