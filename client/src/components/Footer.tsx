import { Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook, SiYoutube, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { FooterLink, SocialLink } from "@shared/schema";

const defaultFooterLinks = {
  Solutions: ["Lighting Control", "Audio Systems", "Home Cinema", "Integration"],
  Partners: ["Lutron", "Crestron", "Basalte", "C SEED"],
  Company: ["About", "Portfolio", "Careers", "Contact"],
  Support: ["Resources", "Installation", "Service", "Privacy"],
};

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: SiWhatsapp,
  instagram: SiInstagram,
  linkedin: Linkedin,
  twitter: SiX,
  facebook: SiFacebook,
  youtube: SiYoutube,
  email: Mail,
};

export default function Footer() {
  const { data: cmsLinks = [] } = useQuery<FooterLink[]>({
    queryKey: ['/api/cms/footer-links', { active: true }],
  });

  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ['/api/cms/social-links', { active: true }],
  });

  const footerLinksByCategory = cmsLinks.length > 0
    ? cmsLinks.reduce((acc, link) => {
        if (!acc[link.category]) {
          acc[link.category] = [];
        }
        acc[link.category].push({ label: link.label, url: link.url });
        return acc;
      }, {} as Record<string, { label: string; url: string }[]>)
    : null;

  const hasCustomLinks = footerLinksByCategory && Object.keys(footerLinksByCategory).length > 0;

  return (
    <>
      {/* Stay Connected Section - Above Footer */}
      <section className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-card/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="glass-heavy border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-cyan-500/10 to-primary/10 pointer-events-none" />
            <div className="max-w-md mx-auto text-center relative z-10">
              <h3 className="text-xl font-light mb-2 bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent" data-testid="text-newsletter-title">
                Stay Connected
              </h3>
              <p className="text-muted-foreground mb-6 font-light" data-testid="text-newsletter-description">
                Discover the latest in intelligent home automation
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="glass-premium border-border/40 font-light"
                  data-testid="input-newsletter-email"
                />
                <Button
                  className="glass-premium bg-gradient-to-r from-primary/30 to-cyan-500/30 border-primary/40 hover-elevate active-elevate-2"
                  data-testid="button-subscribe"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer id="contact" className="backdrop-blur-xl bg-gradient-to-b from-card/30 to-card/60 border-t border-card-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-4">
                Trescent Lifestyles
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm" data-testid="text-footer-description">
                Architectural intelligence powered by AURA. Unifying luxury smart home brands into seamless living experiences.
              </p>
              
              <div className="space-y-2 mb-5">
                <a 
                  href="mailto:sales-team@trescent.in" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-email"
                >
                  <Mail className="w-4 h-4" />
                  sales-team@trescent.in
                </a>
                <a 
                  href="tel:+919372345545" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-phone"
                >
                  <Phone className="w-4 h-4" />
                  +91 93723-45545
                </a>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=324+TV+Industrial+Estate+Behind+Glaxo+Labs+Worli+Mumbai+400030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-address"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>324 TV Industrial Estate, Worli, Mumbai 400030</span>
                </a>
              </div>
              
              <div className="flex gap-3">
                {socialLinks.length > 0 ? (
                  socialLinks.map((social) => {
                    const Icon = socialIcons[social.platform] || Mail;
                    const isExternal = !social.url.startsWith('mailto:');
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="backdrop-blur-lg bg-background/20 border border-white/20 rounded-lg p-2 hover-elevate active-elevate-2"
                        data-testid={`button-social-${social.platform}`}
                        title={social.label || social.platform}
                      >
                        <Icon className="w-5 h-5 text-foreground/70" />
                      </a>
                    );
                  })
                ) : (
                  <>
                    <a
                      href="https://wa.me/919372345545"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-background/20 border border-white/20 rounded-lg p-2 hover-elevate active-elevate-2"
                      data-testid="button-social-whatsapp"
                    >
                      <SiWhatsapp className="w-5 h-5 text-foreground/70" />
                    </a>
                    <a
                      href="https://instagram.com/trescentlifestyles"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-background/20 border border-white/20 rounded-lg p-2 hover-elevate active-elevate-2"
                      data-testid="button-social-instagram"
                    >
                      <SiInstagram className="w-5 h-5 text-foreground/70" />
                    </a>
                    <a
                      href="https://linkedin.com/company/trescent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-background/20 border border-white/20 rounded-lg p-2 hover-elevate active-elevate-2"
                      data-testid="button-social-linkedin"
                    >
                      <Linkedin className="w-5 h-5 text-foreground/70" />
                    </a>
                    <a
                      href="mailto:sales-team@trescent.in"
                      className="backdrop-blur-lg bg-background/20 border border-white/20 rounded-lg p-2 hover-elevate active-elevate-2"
                      data-testid="button-social-email"
                    >
                      <Mail className="w-5 h-5 text-foreground/70" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {hasCustomLinks ? (
              Object.entries(footerLinksByCategory).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-semibold mb-4 text-card-foreground" data-testid={`text-footer-category-${category.toLowerCase()}`}>
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.url}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                          data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              Object.entries(defaultFooterLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-semibold mb-4 text-card-foreground" data-testid={`text-footer-category-${category.toLowerCase()}`}>
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                          data-testid={`link-footer-${link.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-muted-foreground text-sm" data-testid="text-copyright">
            © 2024 Trescent Lifestyles. Powered by AURA. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
