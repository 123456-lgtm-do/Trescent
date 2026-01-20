import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import TrescentLogo from "./TrescentLogo";
import ConsultationModal from "./ConsultationModal";
import type { NavLink } from "@shared/schema";

const defaultNavLinks = [
  { name: "Intelligence", href: "/" },
  { name: "Solutions", href: "#solutions" },
  { name: "Moodboard", href: "/moodboard" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  const { data: cmsNavLinks } = useQuery<NavLink[]>({
    queryKey: ["/api/cms/nav-links?active=true"],
  });

  const navLinks = cmsNavLinks && cmsNavLinks.length > 0
    ? [...cmsNavLinks].sort((a, b) => a.sortOrder - b.sortOrder)
    : defaultNavLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-border/30 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 group cursor-pointer" data-testid="link-home">
            <TrescentLogo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
            <div className="text-2xl font-light tracking-[0.08em] text-foreground transition-all duration-300">
              TRESCENT
            </div>
          </a>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-light tracking-wide text-foreground/70 border border-transparent hover:text-foreground hover:border-primary/40 glass-premium glow-primary-hover hover-elevate transition-all duration-500 ease-out"
                data-testid={`link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              onClick={() => setShowConsultationModal(true)}
              className="glass-heavy bg-gradient-to-r from-primary/80 to-cyan-500/80 border border-primary/60 glow-primary-hover hover-elevate active-elevate-2 font-normal tracking-wide text-white"
              data-testid="button-get-started"
            >
              Book Consultation
            </Button>
          </div>

          <button
            className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-menu-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-300 py-2"
                data-testid={`link-mobile-${link.name.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button
              onClick={() => {
                setIsOpen(false);
                setShowConsultationModal(true);
              }}
              className="glass-heavy bg-gradient-to-r from-primary/80 to-cyan-500/80 border border-primary/60 font-normal text-white"
              data-testid="button-mobile-get-started"
            >
              Book Consultation
            </Button>
          </div>
        )}
      </div>
      
      <ConsultationModal 
        open={showConsultationModal} 
        onOpenChange={setShowConsultationModal} 
      />
    </nav>
  );
}
