import { Lightbulb, Tv } from "lucide-react";
import SolutionPageTemplate from "@/components/SolutionPageTemplate";

export default function AudioSolution() {
  return (
    <SolutionPageTemplate
      title="Architectural Audio"
      subtitle="INVISIBLE SOUND SYSTEMS"
      heroImage="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1920&q=80"
      problemTitle="The Sound vs. Design Dilemma"
      problemDescription="Exceptional audio has traditionally demanded visible speakers, bulky equipment, and aesthetic compromise. Architects and interior designers are forced to choose between beautiful spaces and great sound."
      problemPoints={[
        "Visible speakers that clash with carefully designed interiors",
        "Inconsistent sound quality as you move through spaces",
        "Separate systems for different rooms with no unified control",
        "Complex remotes and apps that frustrate daily use",
        "Audio equipment rooms that consume valuable living space"
      ]}
      approachTitle="Sound That Honors Architecture"
      approachDescription="We believe the best audio system is one you never see but always feel. Our installations deliver reference-quality sound from speakers completely hidden within walls, ceilings, and architectural elements."
      features={[
        {
          title: "Invisible Speakers",
          description: "Speakers that mount flush behind drywall and plaster, delivering studio-quality audio from surfaces that look like ordinary walls."
        },
        {
          title: "Whole-Home Audio",
          description: "Stream different music to every room or unify the entire home in one immersive soundscape, controlled from any device."
        },
        {
          title: "Acoustic Design",
          description: "Room analysis and acoustic treatment that ensures perfect sound in every space, regardless of architecture or furnishings."
        },
        {
          title: "Reference Listening Rooms",
          description: "Dedicated spaces engineered for audiophile-grade reproduction, featuring the world's finest loudspeakers and amplification."
        },
        {
          title: "Outdoor Audio",
          description: "Landscape speakers, pool-area systems, and terrace installations that bring high-fidelity sound to outdoor living spaces."
        },
        {
          title: "Voice Control",
          description: "Seamless integration with major voice platforms for hands-free control of any source, any room, any volume."
        }
      ]}
      brands={[
        {
          name: "Steinway Lyngdorf",
          description: "The only audio company licensed by Steinway & Sons, delivering the world's most accurate reproduction of recorded music."
        },
        {
          name: "Sonos",
          description: "The leader in multi-room streaming, offering reliable, intuitive whole-home audio with extensive source compatibility."
        },
        {
          name: "Bowers & Wilkins",
          description: "British precision engineering with 50+ years of loudspeaker innovation, trusted by Abbey Road Studios."
        }
      ]}
      caseStudies={[
        {
          title: "Audiophile's Sanctuary",
          location: "Juhu, Mumbai",
          description: "Dedicated listening room with Steinway Model D speakers, custom acoustic treatment, and invisible Sonos throughout the remaining 8,000 sq ft residence."
        },
        {
          title: "Beachfront Entertainment Villa",
          location: "Alibaug, Maharashtra",
          description: "22 zones of Sonos audio with marine-grade outdoor speakers, invisible in-ceiling speakers throughout, and B&W formation for critical listening areas."
        }
      ]}
      specifications={[
        "Steinway Lyngdorf authorized dealer",
        "Sonos Pro certified installation",
        "Bowers & Wilkins CI (custom installation) series",
        "Invisible speaker installation (Sonance, Amina)",
        "Dolby Atmos up to 9.4.6 configurations",
        "Acoustic room analysis and treatment",
        "Outdoor and marine-grade speaker systems",
        "High-resolution audio streaming (192kHz/24-bit)",
        "Vinyl and analog source integration",
        "Voice control (Alexa, Google, Siri)"
      ]}
      relatedSolutions={[
        { title: "Home Theater", href: "/solutions/theater", icon: Tv },
        { title: "Lighting Control", href: "/solutions/lighting", icon: Lightbulb }
      ]}
    />
  );
}
