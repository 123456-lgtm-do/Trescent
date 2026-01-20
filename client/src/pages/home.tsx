import { useQuery } from "@tanstack/react-query";
import GlassNavbar from "@/components/GlassNavbar";
import HeroSection from "@/components/HeroSection";
import FeaturedBrands from "@/components/FeaturedBrands";
import FeaturesGrid from "@/components/FeaturesGrid";
import SubsystemsGrid from "@/components/SubsystemsGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";

interface SiteSettings {
  showTestimonials?: boolean;
  showFeaturedBrands?: boolean;
  showStats?: boolean;
}

export default function Home() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings/homepage"],
  });

  // Default to shown for Stats, hidden for Testimonials and Brands
  const showStats = settings?.showStats ?? true;
  const showTestimonials = settings?.showTestimonials ?? false;
  const showFeaturedBrands = settings?.showFeaturedBrands ?? false;

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      <div className="relative z-10">
        <GlassNavbar />
        <HeroSection />
        <SubsystemsGrid />
        {showStats && <StatsSection />}
        {showFeaturedBrands && <FeaturedBrands />}
        <FeaturesGrid />
        {showTestimonials && <TestimonialsSection />}
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
