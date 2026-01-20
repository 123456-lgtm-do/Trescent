import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";

const defaultTestimonials = [
  {
    id: "default-1",
    name: "James Morrison",
    role: "Luxury Home Owner",
    content: "AURA has transformed our home. The integration of our Lutron lighting and Crestron systems is flawless. It's like living in the future.",
    rating: 5,
  },
  {
    id: "default-2",
    name: "Patricia Chen",
    role: "Interior Architect",
    content: "Trescent's ability to seamlessly integrate Basalte controls and C SEED displays into our designs is unmatched. Pure elegance meets intelligence.",
    rating: 5,
  },
  {
    id: "default-3",
    name: "Robert Hamilton",
    role: "Technology Enthusiast",
    content: "From Steinway Lyngdorf audio to architectural Sonos, every premium brand works perfectly together. AURA makes it effortless.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const { data: cmsTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/cms/testimonials?active=true"],
  });

  const testimonials = cmsTestimonials && cmsTestimonials.length > 0 
    ? cmsTestimonials 
    : defaultTestimonials;

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent" data-testid="text-testimonials-title">
            What Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-description">
            Trusted by discerning homeowners and architects worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="backdrop-blur-xl bg-card/40 border border-card-border/50 rounded-2xl p-8 hover-elevate transition-all duration-300"
              data-testid={`card-testimonial-${testimonial.id || index}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                    data-testid={`icon-star-${index}-${i}`}
                  />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed" data-testid={`text-testimonial-content-${index}`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="backdrop-blur-lg bg-primary/20 border border-primary/30 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary" data-testid={`text-testimonial-initial-${index}`}>
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground" data-testid={`text-testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
