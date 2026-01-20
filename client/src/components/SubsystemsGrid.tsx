import { Lightbulb, Thermometer, Volume2, Tv, Shield, Blinds, Smartphone, Network, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { Link } from "wouter";

const subsystems = [
  {
    icon: Lightbulb,
    title: "Lighting Intelligence",
    brand: "Lutron",
    description: "Circadian-responsive lighting that adapts to natural rhythms and architectural intent.",
    href: "/solutions/lighting",
  },
  {
    icon: Thermometer,
    title: "Climate Harmony",
    brand: "Smart HVAC",
    description: "Zone-based climate control that anticipates comfort needs across every space.",
    href: null,
  },
  {
    icon: Volume2,
    title: "Architectural Audio",
    brand: "Sonos · Steinway Lyngdorf",
    description: "Invisible multi-room sound systems engineered for acoustic perfection.",
    href: "/solutions/audio",
  },
  {
    icon: Tv,
    title: "Visual Experiences",
    brand: "C SEED",
    description: "Retractable displays and cinema systems that vanish when not in use.",
    href: "/solutions/theater",
  },
  {
    icon: Shield,
    title: "Intelligent Security",
    brand: "Enterprise Grade",
    description: "Proactive security systems with facial recognition and behavioral learning.",
    href: null,
  },
  {
    icon: Blinds,
    title: "Automated Shading",
    brand: "Motorized Systems",
    description: "Light and privacy control that follows the sun's path throughout the day.",
    href: null,
  },
  {
    icon: Smartphone,
    title: "Unified Control",
    brand: "Basalte · Crestron",
    description: "Elegant interfaces that unify all systems into seamless, intuitive control.",
    href: null,
  },
  {
    icon: Network,
    title: "Network Foundation",
    brand: "Enterprise Infrastructure",
    description: "Military-grade connectivity ensuring flawless performance across all systems.",
    href: null,
  },
];

export default function SubsystemsGrid() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  return (
    <section id="solutions" className="py-32 px-6 bg-gradient-to-b from-background via-background to-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
            CUSTOMIZED SMART HOME SOLUTIONS
          </p>
          <h2 className="text-5xl md:text-6xl font-light text-foreground tracking-tight mb-6" data-testid="text-subsystems-title">
            Designed For Your Space
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            We define bespoke smart home solutions tailored to your architecture, lifestyle, and vision. Every project engineered from the ground up.
          </p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subsystems.map((subsystem, index) => {
              const CardContent = (
                <div className="relative h-[340px] rounded-2xl bg-gradient-to-br from-card via-card to-card/95 border border-border/40 hover-elevate p-6 flex flex-col backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/25 via-primary/20 to-accent/25 backdrop-blur-xl border border-primary/30 flex items-center justify-center mb-6">
                      <subsystem.icon className="w-8 h-8 text-primary" data-testid={`icon-subsystem-${index}`} />
                    </div>
                    
                    <h3 className="text-xl font-light mb-2 text-foreground tracking-tight leading-tight" data-testid={`text-subsystem-title-${index}`}>
                      {subsystem.title}
                    </h3>
                    
                    <p className="text-xs text-primary/80 mb-4 uppercase tracking-wider font-light">
                      {subsystem.brand}
                    </p>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed font-light flex-1" data-testid={`text-subsystem-description-${index}`}>
                      {subsystem.description}
                    </p>
                    
                    {subsystem.href && (
                      <div className="flex items-center gap-2 text-primary text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );

              return subsystem.href ? (
                <Link
                  key={index}
                  href={subsystem.href}
                  className="group cursor-pointer"
                  data-testid={`card-subsystem-${index}`}
                >
                  {CardContent}
                </Link>
              ) : (
                <div
                  key={index}
                  className="group"
                  data-testid={`card-subsystem-${index}`}
                >
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
