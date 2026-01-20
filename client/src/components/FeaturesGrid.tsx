import { Building2, Users, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

const features = [
  {
    icon: Building2,
    label: "PILLAR ONE",
    title: "Architecture First",
    description: "We design technology around the space — not the other way around. Layouts, materials, lighting, acoustics, and form factor always lead.",
  },
  {
    icon: Users,
    label: "PILLAR TWO",
    title: "Human-Centered Intelligence",
    description: "Homes that respond, interpret, anticipate — without demanding attention. Not smart tech. Human tech.",
  },
  {
    icon: EyeOff,
    label: "PILLAR THREE",
    title: "Invisible Technology",
    description: "Intelligence should be felt, not seen. Hardware vanishes. Interfaces simplify. The focus returns to the purity of the space.",
  },
];

export default function FeaturesGrid() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
              20-YEAR TRESCENT LEGACY
            </p>
            <h2 className="text-5xl md:text-6xl font-light text-foreground tracking-tight" data-testid="text-features-title">
              Architectural Intelligence
            </h2>
          </div>
          
          <div className="hidden md:flex gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-border hover-elevate active-elevate-2 flex items-center justify-center"
              data-testid="button-features-prev"
              aria-label="Previous features"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-border hover-elevate active-elevate-2 flex items-center justify-center"
              data-testid="button-features-next"
              aria-label="Next features"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                data-testid={`card-feature-${index}`}
              >
                <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border border-border/40 hover-elevate p-8 flex flex-col transition-all duration-500 group backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 mb-6">
                      <span className="text-sm font-light tracking-wider text-foreground">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-4 uppercase tracking-[0.15em] font-light">
                      {feature.label}
                    </p>
                    
                    <h3 className="text-2xl md:text-3xl font-light mb-6 text-foreground tracking-tight leading-tight" data-testid={`text-feature-title-${index}`}>
                      {feature.title}
                    </h3>
                  </div>

                  <div className="flex-1 flex items-center justify-center relative z-10 my-6">
                    <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/15 to-accent/20 backdrop-blur-xl border border-primary/25 flex items-center justify-center shadow-2xl shadow-primary/10">
                      <feature.icon className="w-20 h-20 text-primary" data-testid={`icon-feature-${index}`} />
                    </div>
                  </div>

                  <p className="relative z-10 text-sm text-muted-foreground leading-relaxed font-light tracking-wide" data-testid={`text-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
