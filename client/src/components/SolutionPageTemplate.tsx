import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import ConsultationModal from "@/components/ConsultationModal";
import { useState } from "react";

interface Brand {
  name: string;
  logo?: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
}

interface CaseStudy {
  title: string;
  location: string;
  description: string;
  image?: string;
}

interface SolutionPageProps {
  title: string;
  subtitle: string;
  heroImage: string;
  problemTitle: string;
  problemDescription: string;
  problemPoints: string[];
  approachTitle: string;
  approachDescription: string;
  features: Feature[];
  brands: Brand[];
  caseStudies: CaseStudy[];
  specifications: string[];
  relatedSolutions: { title: string; href: string; icon: any }[];
}

export default function SolutionPageTemplate({
  title,
  subtitle,
  heroImage,
  problemTitle,
  problemDescription,
  problemPoints,
  approachTitle,
  approachDescription,
  features,
  brands,
  caseStudies,
  specifications,
  relatedSolutions,
}: SolutionPageProps) {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      <div className="relative z-10">
        <GlassNavbar />
        
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${heroImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <Link href="/#solutions">
              <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground" data-testid="button-back-solutions">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Solutions
              </Button>
            </Link>
            <p className="text-xs text-primary mb-4 uppercase tracking-[0.3em] font-light">
              {subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl font-light text-foreground tracking-tight mb-6" data-testid="text-solution-title">
              {title}
            </h1>
            <Button 
              size="lg" 
              className="mt-4"
              onClick={() => setConsultationOpen(true)}
              data-testid="button-hero-consultation"
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-background to-card/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs text-primary mb-4 uppercase tracking-[0.2em] font-light">
                  THE CHALLENGE
                </p>
                <h2 className="text-4xl font-light text-foreground tracking-tight mb-6" data-testid="text-problem-title">
                  {problemTitle}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {problemDescription}
                </p>
              </div>
              <div className="space-y-4">
                {problemPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/40"
                    data-testid={`card-problem-point-${index}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-destructive text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-primary mb-4 uppercase tracking-[0.2em] font-light">
                OUR APPROACH
              </p>
              <h2 className="text-4xl font-light text-foreground tracking-tight mb-6" data-testid="text-approach-title">
                {approachTitle}
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {approachDescription}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-card/50 border border-border/40 hover-elevate"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-card/30 to-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-primary mb-4 uppercase tracking-[0.2em] font-light">
                CURATED BRANDS
              </p>
              <h2 className="text-4xl font-light text-foreground tracking-tight mb-6" data-testid="text-brands-title">
                Best-in-Class Partners
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We exclusively partner with industry-leading manufacturers who share our commitment to excellence.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brands.map((brand, index) => (
                <div 
                  key={index}
                  className="p-8 rounded-2xl bg-card border border-border/40 text-center hover-elevate"
                  data-testid={`card-brand-${index}`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary">{brand.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        {caseStudies.length > 0 && (
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-xs text-primary mb-4 uppercase tracking-[0.2em] font-light">
                  PROJECT GALLERY
                </p>
                <h2 className="text-4xl font-light text-foreground tracking-tight mb-6" data-testid="text-casestudies-title">
                  Featured Installations
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {caseStudies.map((study, index) => (
                  <div 
                    key={index}
                    className="group rounded-2xl overflow-hidden bg-card border border-border/40 hover-elevate"
                    data-testid={`card-casestudy-${index}`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Project Image</span>
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-primary mb-2 uppercase tracking-wider">{study.location}</p>
                      <h3 className="text-xl font-medium text-foreground mb-3">{study.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{study.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Specifications Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-background to-card/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-primary mb-4 uppercase tracking-[0.2em] font-light">
                CAPABILITIES
              </p>
              <h2 className="text-4xl font-light text-foreground tracking-tight mb-6" data-testid="text-specs-title">
                Technical Specifications
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {specifications.map((spec, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/40"
                  data-testid={`card-spec-${index}`}
                >
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border/40">
              <h2 className="text-4xl font-light text-foreground tracking-tight mb-4">
                Ready to Transform Your Space?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience the future of intelligent living with a personalized consultation from our architectural intelligence experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => setConsultationOpen(true)}
                  data-testid="button-cta-consultation"
                >
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/moodboard">
                  <Button size="lg" variant="outline" data-testid="button-cta-moodboard">
                    Build Your Moodboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Solutions */}
        {relatedSolutions.length > 0 && (
          <section className="py-16 px-6 border-t border-border/40">
            <div className="max-w-6xl mx-auto">
              <p className="text-xs text-muted-foreground mb-6 uppercase tracking-[0.2em] text-center">
                EXPLORE MORE SOLUTIONS
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {relatedSolutions.map((solution, index) => (
                  <Link key={index} href={solution.href}>
                    <Button variant="outline" className="gap-2" data-testid={`button-related-${index}`}>
                      <solution.icon className="w-4 h-4" />
                      {solution.title}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>

      <ConsultationModal 
        open={consultationOpen} 
        onOpenChange={setConsultationOpen}
      />
    </div>
  );
}
