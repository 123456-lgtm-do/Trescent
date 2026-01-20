import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import CompanyProfileModal from "@/components/CompanyProfileModal";
import { Award, Users, Building2, Sparkles, CheckCircle, Trophy, Newspaper, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const milestones = [
  { year: "2006", title: "Foundation", description: "Trescent Lifestyles founded by Harshul Parikh with a vision to redefine luxury living" },
  { year: "2010", title: "Steinway Lyngdorf", description: "Brought Steinway Lyngdorf to India, becoming exclusive distributor for 10+ years" },
  { year: "2012", title: "CEDIA India", description: "Founding member of CEDIA India Chapter, establishing industry standards" },
  { year: "2016", title: "Design Collaboration", description: "Strategic partnership with Steinway Lyngdorf and Gauri Khan Design" },
  { year: "2022", title: "Best Residential Award", description: "Smart Home Expo recognition for groundbreaking residential automation" },
  { year: "2026", title: "Trescent 2.0", description: "20th Anniversary evolution into Architectural Intelligence" },
];

const awards = [
  "Best of Houzz Design - 3 Consecutive Years",
  "Lutron West India Champion - 2 Consecutive Years",
  "#1 Home Theatre Install - What Hi-Fi Magazine",
  "Smart Home Expo Best Residential Award 2022",
  "THX Home Theater Certified - Level 1 & 2",
  "Featured in Robb Report - 5 Consecutive Years",
];

const celebrities = [
  "Shah Rukh Khan",
  "Ranbir Kapoor",
  "Alia Bhatt",
  "Shilpa Shetty Kundra",
  "Akshay Kumar",
  "Twinkle Khanna",
  "Shahid Kapoor",
];

const corporateClients = [
  "Reliance Group",
  "Orbit Construction",
  "Lupin Pharma",
  "ISPAT Industries",
  "Kamala Group",
  "Biyanis",
  "Zee Entertainment",
  "Emami Group",
];

const pressFeatures = [
  { publication: "Robb Report", description: "Featured 5 consecutive years for luxury smart home innovation" },
  { publication: "Architectural Digest", description: "Showcasing India's most prestigious smart home installations" },
  { publication: "Elle Decor", description: "Featured for seamless integration of technology and design" },
  { publication: "GQ India", description: "Luxury lifestyle technology for India's elite" },
  { publication: "Bloomberg TV India", description: "Industry leadership and technology excellence coverage" },
  { publication: "The Economic Times", description: "Pioneering smart home automation in India" },
  { publication: "Electronic Lifestyles", description: "Leading residential technology provider" },
  { publication: "What Hi-Fi Magazine", description: "#1 Home Theatre Installation in India" },
];

export default function About() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      <div className="relative z-10">
        <GlassNavbar />
        
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-[0.2em] font-light">
                EST. 2006
              </p>
              <p className="text-2xl md:text-3xl font-light uppercase tracking-[0.15em]">
                <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
                  20 YEARS
                </span>{" "}
                <span className="text-foreground">OF EXCELLENCE</span>
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-light mb-6 text-foreground leading-[1.1] tracking-tight" data-testid="text-about-title">
              Welcome to <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">Trescent 2.0</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed mb-8" data-testid="text-about-subtitle">
              Two decades of pioneering luxury smart home innovation. From India's first ultra-luxury automation experiences to the evolution of Architectural Intelligence.
            </p>
            
            <Button
              onClick={() => setIsProfileModalOpen(true)}
              className="glass-heavy bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/40 hover-elevate active-elevate-2 text-foreground font-light tracking-wide"
              data-testid="button-download-profile"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Company Profile
            </Button>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="glass-premium rounded-3xl p-12 border border-border/40 backdrop-blur-xl">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light mb-6 text-foreground tracking-tight">
                    The Journey
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4 font-light">
                    Founded in 2006 by visionary entrepreneur <span className="text-foreground">Harshul Parikh</span>, Trescent Lifestyles began with a singular mission: to bring world-class smart home experiences to India's most discerning residents.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4 font-light">
                    Over 20 years, we've delivered India's most prestigious smart home projects, including the nation's largest fully automated <span className="text-primary">1,20,000 sq ft residence</span>, and established ourselves as the trusted technology partner for Bollywood's elite, Forbes-listed industrialists, India's wealthiest families, and YPO members.
                  </p>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    Today, <span className="text-foreground">Trescent 2.0</span> represents our evolution from smart home installation to <span className="text-primary">Architectural Intelligence</span> — where technology becomes an invisible extension of architecture itself.
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="glass-premium rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-light mb-2 text-foreground">India's Largest Residence</h3>
                        <p className="text-sm text-muted-foreground font-light">1,20,000 sq ft fully automated estate for one of India's most prominent families</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-premium rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-light mb-2 text-foreground">Ultra-High-Net-Worth Clientele</h3>
                        <p className="text-sm text-muted-foreground font-light">Trusted by India's wealthiest families, Forbes listers, and Bollywood's biggest names</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-premium rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-light mb-2 text-foreground">CEDIA Founding Member</h3>
                        <p className="text-sm text-muted-foreground font-light">Established industry standards as founding member of CEDIA India Chapter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
                TWO DECADES OF INNOVATION
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                Key Milestones
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="glass-premium rounded-2xl p-6 border border-border/40 hover-elevate"
                  data-testid={`card-milestone-${index}`}
                >
                  <div className="text-4xl font-light text-primary mb-4">{milestone.year}</div>
                  <h3 className="text-xl font-light mb-2 text-foreground">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-card/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
                INDUSTRY RECOGNITION
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-6">
                Awards & Accolades
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="glass-premium rounded-xl p-5 border border-border/40 flex items-center gap-4 hover-elevate"
                  data-testid={`award-${index}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-light text-foreground">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press & Media */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
                IN THE SPOTLIGHT
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-6">
                Press & Media Coverage
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto font-light">
                Featured in India's most prestigious publications for pioneering luxury smart home innovation
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pressFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="glass-premium rounded-xl p-6 border border-border/40 hover-elevate"
                  data-testid={`press-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Newspaper className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-light mb-2 text-foreground">{feature.publication}</h3>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Celebrity & Corporate Clients */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-card/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
                TRUSTED BY THE ELITE
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-6">
                Notable Clients
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-light mb-6 text-foreground flex items-center gap-3">
                  <Award className="w-6 h-6 text-primary" />
                  Bollywood Icons
                </h3>
                <p className="text-sm text-muted-foreground mb-4 font-light">
                  Trusted by India's most celebrated entertainment personalities
                </p>
                <div className="space-y-3">
                  {celebrities.map((celebrity, index) => (
                    <div
                      key={index}
                      className="glass-premium rounded-lg p-4 border border-border/30 flex items-center gap-3"
                      data-testid={`celebrity-${index}`}
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-sm font-light text-foreground">{celebrity}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-light mb-6 text-foreground flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  Business Families
                </h3>
                <p className="text-sm text-muted-foreground mb-4 font-light">
                  Private residences of owners from India's leading business houses
                </p>
                <div className="space-y-3">
                  {corporateClients.map((client, index) => (
                    <div
                      key={index}
                      className="glass-premium rounded-lg p-4 border border-border/30 flex items-center gap-3"
                      data-testid={`corporate-${index}`}
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-sm font-light text-foreground">{client}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision for Future */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="glass-heavy rounded-3xl p-12 border border-primary/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-light mb-6 text-foreground tracking-tight">
                  The Future: Architectural Intelligence
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed mb-8">
                  At our 20th anniversary, we're not just celebrating the past — we're pioneering the future. 
                  <span className="text-foreground"> Trescent 2.0</span> represents our evolution into an era where homes don't just contain technology, 
                  <span className="text-primary"> they think with you</span>.
                </p>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                  Powered by AURA — our Autonomous Unified Response Agent — we're building intelligent spaces that are silent, seamless, and invisible. 
                  Where technology enhances architecture instead of interrupting it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-cyan-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_65%)]" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block mb-6">
              <div className="glass-premium rounded-full px-6 py-2 border border-primary/30">
                <p className="text-xs uppercase tracking-[0.3em] text-primary font-light">
                  Experience The Future
                </p>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-light mb-6 text-foreground leading-[1.1] tracking-tight">
              Ready to Transform Your <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">Living Space?</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Join India's most distinguished families in experiencing homes that think, adapt, and anticipate. 
              Schedule a private consultation with our Architectural Intelligence specialists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="glass-heavy rounded-xl px-8 py-4 border border-primary/40 bg-gradient-to-r from-primary/20 to-cyan-500/20 hover-elevate active-elevate-2 group"
                data-testid="button-schedule-demo"
              >
                <span className="text-base font-light text-foreground flex items-center gap-2">
                  Schedule Demo
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
              
              <button 
                className="glass-premium rounded-xl px-8 py-4 border border-border/40 hover-elevate active-elevate-2"
                data-testid="button-view-portfolio"
              >
                <span className="text-base font-light text-muted-foreground">
                  View Portfolio
                </span>
              </button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-premium rounded-2xl p-6 border border-border/30">
                <div className="text-3xl font-light text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground font-light">AURA Intelligence Support</p>
              </div>
              <div className="glass-premium rounded-2xl p-6 border border-border/30">
                <div className="text-3xl font-light text-primary mb-2">20+</div>
                <p className="text-sm text-muted-foreground font-light">Years of Excellence</p>
              </div>
              <div className="glass-premium rounded-2xl p-6 border border-border/30">
                <div className="text-3xl font-light text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground font-light">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <CompanyProfileModal 
        open={isProfileModalOpen} 
        onOpenChange={setIsProfileModalOpen} 
      />
    </div>
  );
}
