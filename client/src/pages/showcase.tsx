import { useState } from "react";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const categories = [
  "All",
  "Lighting Control",
  "Home Theater",
  "Audio Systems",
  "Climate Control",
  "Security",
  "Shading",
  "Complete Integration",
];

const projects = [
  {
    id: 1,
    title: "Mumbai Penthouse - Lutron Lighting",
    category: "Lighting Control",
    client: "Forbes-listed Industrialist",
    location: "Mumbai, Maharashtra",
    solution: "Lutron HomeWorks QSX - 250+ zones",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    description: "Complete lighting automation across a 12,000 sq ft penthouse with circadian rhythm integration and voice control.",
    tags: ["Lutron", "Smart Lighting", "Voice Control"]
  },
  {
    id: 2,
    title: "Steinway Lyngdorf Private Cinema",
    category: "Home Theater",
    client: "Bollywood Celebrity",
    location: "Juhu, Mumbai",
    solution: "Steinway Lyngdorf Model LS - THX Certified",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
    description: "Award-winning home theater installation with Steinway Lyngdorf speakers and RoomPerfect™ calibration. Rated #1 by What Hi-Fi Magazine.",
    tags: ["Home Theater", "Steinway Lyngdorf", "THX Certified"]
  },
  {
    id: 3,
    title: "C SEED Outdoor Entertainment",
    category: "Complete Integration",
    client: "YPO Member Family",
    location: "Alibaug Beach Villa",
    solution: "C SEED N1 Outdoor Display - 201 inches",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    description: "World's largest outdoor entertainment system integrated with poolside automation and weather-responsive controls.",
    tags: ["C SEED", "Outdoor", "Integration"]
  },
  {
    id: 4,
    title: "Crestron Whole-Home Automation",
    category: "Complete Integration",
    client: "Reliance Group Executive",
    location: "Worli, Mumbai",
    solution: "Crestron Home - Full Estate",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    description: "India's largest fully automated residence at 1,20,000 sq ft with unified control of lighting, climate, security, and entertainment.",
    tags: ["Crestron", "Complete Automation", "Smart Estate"]
  },
  {
    id: 5,
    title: "Basalte Touch Interfaces",
    category: "Complete Integration",
    client: "Architect Residence",
    location: "Bandra, Mumbai",
    solution: "Basalte Deseo - Wall Control",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    description: "Minimalist architectural control panels seamlessly integrated into designer interiors.",
    tags: ["Basalte", "Design", "Touch Control"]
  },
  {
    id: 6,
    title: "Sonos Multi-Room Audio",
    category: "Audio Systems",
    client: "Business Family",
    location: "Panchshil Towers, Pune",
    solution: "Sonos Architectural - 32 Zones",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
    description: "Seamless multi-room audio throughout luxury residence with synchronized whole-home listening experiences.",
    tags: ["Sonos", "Multi-Room", "Audio"]
  },
  {
    id: 7,
    title: "Climate & Shading Automation",
    category: "Climate Control",
    client: "Private Estate Owner",
    location: "Goa Waterfront Villa",
    solution: "Integrated HVAC & Motorized Blinds",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80",
    description: "Weather-responsive climate control with automated shading systems maintaining optimal comfort and energy efficiency.",
    tags: ["Climate", "Shading", "Automation"]
  },
  {
    id: 8,
    title: "Security & Access Control",
    category: "Security",
    client: "Corporate Headquarters",
    location: "BKC, Mumbai",
    solution: "Integrated Security Suite",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    description: "Enterprise-grade security with biometric access, AI surveillance, and smart lock integration.",
    tags: ["Security", "Access Control", "AI Surveillance"]
  },
];

export default function Showcase() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/showcase/search", { query });
      return await response.json();
    },
  });

  const handleAISearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = searchMutation.data
      ? searchMutation.data.projectIds.includes(project.id)
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      <div className="relative z-10">
        <GlassNavbar />

        {/* Hero Section */}
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-4">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary" data-testid="badge-showcase">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Portfolio
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-foreground leading-[1.1] tracking-tight">
              Project <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">Showcase</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Explore India's most prestigious smart home installations. Use natural language to discover solutions tailored to your vision.
            </p>

            {/* AI Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="glass-premium rounded-2xl p-4 border border-primary/20">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder='Try "luxury home theaters with Steinway" or "complete automation for large estates"'
                      className="pl-12 pr-12 bg-background/50 border-border/50 h-12 text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                      data-testid="input-ai-search"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          searchMutation.reset();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        data-testid="button-clear-search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={handleAISearch}
                    disabled={!searchQuery.trim() || searchMutation.isPending}
                    className="h-12 px-6"
                    data-testid="button-search"
                  >
                    {searchMutation.isPending ? (
                      "Searching..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Search
                      </>
                    )}
                  </Button>
                </div>
                {searchMutation.data && (
                  <p className="text-sm text-primary mt-3 text-left">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {searchMutation.data.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                  data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-12 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="glass-premium rounded-2xl overflow-hidden border border-border/40 hover-elevate cursor-pointer transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    setSelectedProject(project);
                    setCurrentImageIndex(0);
                  }}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/90 backdrop-blur-sm border-primary/30">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-2 text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{project.client}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No projects found matching your criteria. Try adjusting your search or filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl glass-heavy border-border/40" data-testid="modal-project">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-light">{selectedProject.title}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Client</p>
                      <p className="text-foreground">{selectedProject.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="text-foreground">{selectedProject.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Solution</p>
                      <p className="text-foreground">{selectedProject.solution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {selectedProject.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-foreground font-light leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedProject.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </div>
  );
}
