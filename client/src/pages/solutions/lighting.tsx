import { Volume2, Tv } from "lucide-react";
import SolutionPageTemplate from "@/components/SolutionPageTemplate";

export default function LightingSolution() {
  return (
    <SolutionPageTemplate
      title="Lighting Intelligence"
      subtitle="LUTRON AUTHORIZED DEALER"
      heroImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
      problemTitle="Why Traditional Lighting Falls Short"
      problemDescription="Standard lighting systems treat illumination as an afterthought, ignoring how light profoundly affects our wellbeing, productivity, and the very experience of architecture."
      problemPoints={[
        "Static lighting that cannot adapt to different activities, times of day, or moods",
        "Multiple switches and dimmers that create confusion rather than control",
        "No integration with natural daylight, wasting energy and missing circadian benefits",
        "Inability to create scenes or automate lighting for security and convenience",
        "Harsh, poorly designed fixtures that compromise architectural aesthetics"
      ]}
      approachTitle="The Trescent Lighting Philosophy"
      approachDescription="We believe lighting should be invisible yet transformative — enhancing architecture, supporting circadian rhythms, and responding intuitively to life's rhythms without ever demanding attention."
      features={[
        {
          title: "Circadian Tuning",
          description: "Automatically adjusts color temperature throughout the day to support natural sleep-wake cycles and boost daytime alertness."
        },
        {
          title: "Daylight Harvesting",
          description: "Sensors monitor natural light and seamlessly blend artificial illumination to maintain perfect ambiance while minimizing energy use."
        },
        {
          title: "Scene Programming",
          description: "One-touch activation of perfectly calibrated lighting for dining, entertaining, cinema, relaxation, and any activity you can imagine."
        },
        {
          title: "Architectural Integration",
          description: "Fixtures and controls that become part of the architecture — hidden coves, elegant keypads, and wireless technology that eliminates clutter."
        },
        {
          title: "Whole-Home Control",
          description: "Every light in your home responds together — from a single keypad, your phone, or automatically based on time, presence, and preferences."
        },
        {
          title: "Energy Intelligence",
          description: "Advanced dimming and scheduling reduces energy consumption by up to 60% while extending lamp life and reducing maintenance."
        }
      ]}
      brands={[
        {
          name: "Lutron",
          description: "The world leader in lighting control for over 60 years, pioneering dimming technology and setting the standard for reliability and design."
        },
        {
          name: "Ketra",
          description: "Natural light technology that delivers the full spectrum of tunable white and vibrant colors with unmatched precision."
        },
        {
          name: "Crestron",
          description: "Enterprise-grade control systems that integrate lighting with AV, climate, and security for unified automation."
        }
      ]}
      caseStudies={[
        {
          title: "Penthouse at Lodha World Towers",
          location: "Lower Parel, Mumbai",
          description: "12,000 sq ft penthouse featuring 340 Lutron fixtures with circadian tuning, motorized shading integration, and 24 pre-programmed scenes."
        },
        {
          title: "Modern Farmhouse Estate",
          location: "Alibaug, Maharashtra",
          description: "Sprawling estate with Ketra natural light throughout, landscape lighting, and astronomical time-clock scheduling for complete automation."
        }
      ]}
      specifications={[
        "Lutron RadioRA 3 & HomeWorks QSX certified installation",
        "Ketra natural light and tunable white specification",
        "Up to 500+ zones per residence",
        "Integration with Crestron, Control4, and Savant",
        "Motorized shade and blind integration",
        "Astronomical time-clock programming",
        "Occupancy and vacancy sensing",
        "Landscape and facade lighting control",
        "LED driver and fixture specification",
        "24/7 monitoring and remote support"
      ]}
      relatedSolutions={[
        { title: "Audio Systems", href: "/solutions/audio", icon: Volume2 },
        { title: "Home Theater", href: "/solutions/theater", icon: Tv }
      ]}
    />
  );
}
