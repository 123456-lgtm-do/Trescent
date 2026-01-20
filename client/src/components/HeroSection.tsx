import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import type { HeroSlide } from "@shared/schema";

import lutronHome from "@assets/website/lutron-3672936_luxury_portfolio_brochure-images-109_1763798644206.jpg";
import cseedN1_30 from "@assets/website/C SEED N1_30_1763798811502.jpg";
import cseedN1_31 from "@assets/website/C SEED N1_31_1763798811503.jpg";
import crestronControl from "@assets/website/final_composite_glow_clean_1763808587976.png";
import luxuryLiving from "@assets/website/CANVAS_1763815364382.png";

const defaultSlides = [
  { id: "default-1", image: lutronHome, alt: "Luxury Smart Home", position: "center", title: "Lutron Lighting", subtitle: "Precision light control for every moment" },
  { id: "default-2", image: luxuryLiving, alt: "Premium Living Room Design", position: "center", title: "Immersive Living", subtitle: "Where luxury meets intelligent design" },
  { id: "default-3", image: cseedN1_30, alt: "C SEED N1 Display", position: "center", title: "C SEED N1", subtitle: "The world's largest foldable TV" },
  { id: "default-4", image: cseedN1_31, alt: "C SEED Home Theater", position: "center", title: "Home Cinema", subtitle: "Cinematic experiences at home" },
  { id: "default-5", image: crestronControl, alt: "Crestron Smart Home Control", position: "center", title: "Crestron Control", subtitle: "Unified home automation" },
];

export default function HeroSection() {
  const { data: cmsSlides = [] } = useQuery<HeroSlide[]>({
    queryKey: ["/api/cms/hero-slides?active=true"],
  });

  const slides = cmsSlides && cmsSlides.length > 0
    ? cmsSlides.map(s => ({ 
        id: s.id, 
        image: s.imageUrl, 
        alt: s.title, 
        position: "center",
        title: s.title,
        subtitle: s.subtitle 
      }))
    : defaultSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <>
      {/* Full-screen Carousel */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className="flex-[0_0_100%] min-w-0 relative"
                data-testid={`carousel-slide-${index}`}
              >
                <div
                  className={`w-full h-screen bg-cover ${slide.position === 'right' ? 'bg-right' : 'bg-center'}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                  
                  {/* Glass UI Info Card */}
                  {(slide.title || slide.subtitle) && (
                    <div 
                      className="absolute bottom-24 left-6 md:left-12 z-10 max-w-sm"
                      data-testid={`slide-info-${index}`}
                    >
                      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-5 py-4 shadow-2xl shadow-black/20">
                        {slide.title && (
                          <h3 className="text-white text-lg md:text-xl font-medium tracking-wide mb-1">
                            {slide.title}
                          </h3>
                        )}
                        {slide.subtitle && (
                          <p className="text-white/70 text-sm md:text-base font-light">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel navigation dots - floating overlay */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                data-testid={`carousel-dot-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ribbon Content Section - Below Carousel */}
      <section className="relative z-20 -mt-1">
        <div className="glass-heavy border-t border-white/10 pt-12 pb-10 px-6 shadow-2xl shadow-black/40">
          <div className="max-w-5xl mx-auto text-center">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-light mb-5 text-white leading-[1.1] tracking-tight"
              data-testid="text-hero-title"
            >
              Crafting <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">Intelligent Spaces</span>
            </h1>

            <p
              className="text-base md:text-lg text-white/80 max-w-3xl mx-auto font-light tracking-wide leading-relaxed"
              data-testid="text-hero-description"
            >
              Architectural Intelligence — where smart home technology enhances your space instead of cluttering it. We design and install complete home automation: lighting control, immersive audio, private cinema, climate, security, and motorized shading. All unified into one seamless experience that learns how you live.
            </p>

            <div className="flex items-center justify-center mt-8">
              <ChevronDown className="w-6 h-6 text-primary animate-bounce opacity-60" data-testid="icon-scroll-indicator" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
