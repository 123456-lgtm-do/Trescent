import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ContentSectionProps {
  reverse?: boolean;
}

export default function ContentSection({ reverse = false }: ContentSectionProps) {
  const benefits = [
    "Unified control of Lutron lighting, Crestron systems, and Basalte interfaces",
    "Seamless integration with premium audio from Sonos and Steinway Lyngdorf",
    "Stunning visuals with C SEED retractable displays and architectural screens",
    "Voice control, scene automation, and predictive AI powered by AURA",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`${reverse ? 'lg:order-2' : ''}`}>
            <div className="backdrop-blur-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/20 rounded-3xl p-12 aspect-square flex items-center justify-center">
              <div className="backdrop-blur-xl bg-background/30 border border-white/30 rounded-2xl w-3/4 h-3/4 flex items-center justify-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent" data-testid="text-content-placeholder">
                  UI
                </div>
              </div>
            </div>
          </div>

          <div className={`${reverse ? 'lg:order-1' : ''}`}>
            <div className="backdrop-blur-xl bg-card/30 border border-card-border/50 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent" data-testid="text-content-title">
                {reverse ? 'Seamless Integration' : 'Luxury Meets Intelligence'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="text-content-description">
                {reverse 
                  ? "AURA unifies the world's finest smart home technologies into one elegant experience. From lighting to entertainment, climate to security, everything works together in perfect harmony."
                  : "Experience the pinnacle of smart home luxury with Trescent Lifestyles. AURA seamlessly orchestrates premium systems from the world's leading brands to create your perfect living environment."}
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`item-benefit-${index}`}>
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                className="backdrop-blur-lg bg-primary/80 border border-primary-border hover-elevate active-elevate-2"
                data-testid="button-discover-more"
              >
                {reverse ? 'View Integrations' : 'Schedule Consultation'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
