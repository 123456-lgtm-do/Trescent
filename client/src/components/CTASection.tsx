import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 border border-white/20 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent" data-testid="text-cta-title">
              Ready to Experience True Intelligence?
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto" data-testid="text-cta-description">
              Join the elite homeowners experiencing the perfect harmony of luxury brands 
              unified by AURA. Transform your home into an intelligent sanctuary.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="backdrop-blur-lg bg-primary/90 border border-primary-border hover-elevate active-elevate-2 text-lg px-8"
                data-testid="button-get-started-cta"
              >
                Schedule Your Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-lg bg-background/30 border-white/40 hover-elevate active-elevate-2 text-lg px-8"
                data-testid="button-view-pricing"
              >
                Explore Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
