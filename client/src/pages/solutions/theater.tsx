import { Lightbulb, Volume2 } from "lucide-react";
import SolutionPageTemplate from "@/components/SolutionPageTemplate";

export default function TheaterSolution() {
  return (
    <SolutionPageTemplate
      title="Visual Experiences"
      subtitle="PRIVATE CINEMA & DISPLAY SYSTEMS"
      heroImage="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80"
      problemTitle="Beyond the Home Theater Room"
      problemDescription="Traditional home theaters are dark rooms stuffed with visible equipment. Modern living demands displays that appear when needed and vanish completely when not — technology that serves life, not dominates it."
      problemPoints={[
        "Bulky equipment and visible wiring that compromise interior design",
        "Displays that dominate living spaces even when turned off",
        "Separate remotes and apps for TV, audio, lighting, and shades",
        "Poor calibration that fails to deliver true cinema-quality imagery",
        "Rooms that only function as theaters, wasting valuable living space"
      ]}
      approachTitle="Invisible Cinema, Unforgettable Experiences"
      approachDescription="We create visual experiences that transform spaces on demand — displays that rise from furniture, descend from ceilings, or unfold from the architecture itself, all orchestrated with one-touch simplicity."
      features={[
        {
          title: "Architectural Displays",
          description: "TVs that rise, rotate, descend, or emerge from hidden compartments, becoming invisible when not in use and stunning when revealed."
        },
        {
          title: "Reference-Grade Projection",
          description: "4K and 8K laser projection systems with acoustically transparent screens, calibrated to ISF standards for true cinema reproduction."
        },
        {
          title: "Immersive Audio Integration",
          description: "Seamlessly integrated with Dolby Atmos and Steinway Lyngdorf systems for three-dimensional sound that matches the visual spectacle."
        },
        {
          title: "One-Touch Automation",
          description: "Press 'Movie' and watch as lights dim, shades descend, display emerges, and audio calibrates — all in perfect choreography."
        },
        {
          title: "Multi-Purpose Spaces",
          description: "Rooms that transform from formal living to cinema to gaming arena, maximizing every square foot of your home."
        },
        {
          title: "Outdoor Experiences",
          description: "Weather-resistant displays and projection systems for poolside cinema, terrace entertainment, and garden gatherings."
        }
      ]}
      brands={[
        {
          name: "C SEED",
          description: "The world's most exclusive outdoor and indoor TV systems, featuring retractable MicroLED displays up to 301 inches."
        },
        {
          name: "Sony",
          description: "Reference-grade 4K laser projectors and Crystal LED direct-view displays trusted by Hollywood studios."
        },
        {
          name: "Samsung",
          description: "The Wall MicroLED and premium QLED displays for residential and architectural applications."
        }
      ]}
      caseStudies={[
        {
          title: "Cliffside Villa Cinema",
          location: "Goa, India",
          description: "Outdoor C SEED 201-inch retractable display rising from a custom-designed terrace planter, with Dolby Atmos hidden in landscape architecture."
        },
        {
          title: "Minimalist Living Room Theater",
          location: "Worli Sea Face, Mumbai",
          description: "Sony VPL-GTZ380 projector with acoustically transparent screen hidden behind motorized art panels, converting living room to private cinema."
        }
      ]}
      specifications={[
        "4K and 8K laser projection systems",
        "MicroLED and OLED display specification",
        "Motorized lifts, mounts, and concealment systems",
        "ISF and THX certified calibration",
        "Dolby Atmos and DTS:X integration",
        "Acoustically transparent screen installation",
        "Ambient light rejecting (ALR) screen technology",
        "Multi-zone video distribution",
        "Gaming optimization with 4K/120Hz support",
        "Outdoor-rated weather-resistant systems"
      ]}
      relatedSolutions={[
        { title: "Audio Systems", href: "/solutions/audio", icon: Volume2 },
        { title: "Lighting Control", href: "/solutions/lighting", icon: Lightbulb }
      ]}
    />
  );
}
