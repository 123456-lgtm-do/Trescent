import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { HeroSlide, Testimonial, Stat, BrandLogo, FooterLink, SocialLink, NavLink } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, GripVertical, Image as ImageIcon, Star, Quote, TrendingUp, Building2, Link as LinkIcon, Save, X, Share2, Navigation, FileText } from "lucide-react";
import CompanyProfileEditor from "./CompanyProfileEditor";

type CMSTab = "hero" | "testimonials" | "stats" | "brands" | "footer" | "social" | "nav" | "profile";

export default function CMSPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CMSTab>("hero");
  
  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
  
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandLogo | null>(null);
  
  const [footerDialogOpen, setFooterDialogOpen] = useState(false);
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLink | null>(null);
  
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [editingNavLink, setEditingNavLink] = useState<NavLink | null>(null);

  const { data: heroSlides = [], isLoading: loadingHero } = useQuery<HeroSlide[]>({
    queryKey: ["/api/cms/hero-slides"],
  });

  const { data: testimonials = [], isLoading: loadingTestimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/cms/testimonials"],
  });

  const { data: stats = [], isLoading: loadingStats } = useQuery<Stat[]>({
    queryKey: ["/api/cms/stats"],
  });

  const { data: brandLogos = [], isLoading: loadingBrands } = useQuery<BrandLogo[]>({
    queryKey: ["/api/cms/brand-logos"],
  });
  
  const { data: footerLinks = [], isLoading: loadingFooter } = useQuery<FooterLink[]>({
    queryKey: ["/api/cms/footer-links"],
  });
  
  const { data: socialLinks = [], isLoading: loadingSocial } = useQuery<SocialLink[]>({
    queryKey: ["/api/cms/social-links"],
  });
  
  const { data: navLinks = [], isLoading: loadingNav } = useQuery<NavLink[]>({
    queryKey: ["/api/cms/nav-links"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light">Content Management</h2>
          <p className="text-sm text-muted-foreground">Manage hero images, testimonials, stats, and brand logos</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CMSTab)}>
        <TabsList className="grid grid-cols-8 w-full max-w-6xl">
          <TabsTrigger value="nav" data-testid="cms-tab-nav">
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="hero" data-testid="cms-tab-hero">
            <ImageIcon className="w-4 h-4 mr-2" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="testimonials" data-testid="cms-tab-testimonials">
            <Quote className="w-4 h-4 mr-2" />
            Testimonials
          </TabsTrigger>
          <TabsTrigger value="stats" data-testid="cms-tab-stats">
            <TrendingUp className="w-4 h-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="brands" data-testid="cms-tab-brands">
            <Building2 className="w-4 h-4 mr-2" />
            Brands
          </TabsTrigger>
          <TabsTrigger value="footer" data-testid="cms-tab-footer">
            <LinkIcon className="w-4 h-4 mr-2" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="social" data-testid="cms-tab-social">
            <Share2 className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="profile" data-testid="cms-tab-profile">
            <FileText className="w-4 h-4 mr-2" />
            Profile PDF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nav" className="mt-6">
          <NavLinksSection
            links={navLinks}
            isLoading={loadingNav}
            dialogOpen={navDialogOpen}
            setDialogOpen={setNavDialogOpen}
            editingItem={editingNavLink}
            setEditingItem={setEditingNavLink}
          />
        </TabsContent>

        <TabsContent value="hero" className="mt-6">
          <HeroSlidesSection 
            slides={heroSlides}
            isLoading={loadingHero}
            dialogOpen={heroDialogOpen}
            setDialogOpen={setHeroDialogOpen}
            editingSlide={editingHeroSlide}
            setEditingSlide={setEditingHeroSlide}
          />
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <TestimonialsSection
            testimonials={testimonials}
            isLoading={loadingTestimonials}
            dialogOpen={testimonialDialogOpen}
            setDialogOpen={setTestimonialDialogOpen}
            editingItem={editingTestimonial}
            setEditingItem={setEditingTestimonial}
          />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <StatsSection
            stats={stats}
            isLoading={loadingStats}
            dialogOpen={statDialogOpen}
            setDialogOpen={setStatDialogOpen}
            editingItem={editingStat}
            setEditingItem={setEditingStat}
          />
        </TabsContent>

        <TabsContent value="brands" className="mt-6">
          <BrandLogosSection
            logos={brandLogos}
            isLoading={loadingBrands}
            dialogOpen={brandDialogOpen}
            setDialogOpen={setBrandDialogOpen}
            editingItem={editingBrand}
            setEditingItem={setEditingBrand}
          />
        </TabsContent>

        <TabsContent value="footer" className="mt-6">
          <FooterLinksSection
            links={footerLinks}
            isLoading={loadingFooter}
            dialogOpen={footerDialogOpen}
            setDialogOpen={setFooterDialogOpen}
            editingItem={editingFooterLink}
            setEditingItem={setEditingFooterLink}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialLinksSection
            links={socialLinks}
            isLoading={loadingSocial}
            dialogOpen={socialDialogOpen}
            setDialogOpen={setSocialDialogOpen}
            editingItem={editingSocialLink}
            setEditingItem={setEditingSocialLink}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <CompanyProfileEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroSlidesSection({ 
  slides, 
  isLoading, 
  dialogOpen, 
  setDialogOpen, 
  editingSlide, 
  setEditingSlide 
}: {
  slides: HeroSlide[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingSlide: HeroSlide | null;
  setEditingSlide: (slide: HeroSlide | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    ctaText: "",
    ctaLink: "",
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      ctaText: "",
      ctaLink: "",
      sortOrder: slides.length,
      active: true,
    });
    setEditingSlide(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/hero-slides", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hero-slides"] });
      toast({ title: "Hero slide created!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/hero-slides/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hero-slides"] });
      toast({ title: "Hero slide updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/hero-slides/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hero-slides"] });
      toast({ title: "Hero slide deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText || "",
      ctaLink: slide.ctaLink || "",
      sortOrder: slide.sortOrder,
      active: slide.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Hero slides appear on the homepage carousel. Drag to reorder (coming soon).
        </p>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-hero-slide">
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : slides.length === 0 ? (
        <Card className="p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Hero Slides</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first hero slide to get started.</p>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Slide
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide) => (
            <Card key={slide.id} className={`overflow-hidden ${!slide.active ? 'opacity-50' : ''}`}>
              <div className="aspect-video relative bg-muted">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {!slide.active && (
                  <Badge variant="secondary" className="absolute top-2 right-2">Inactive</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{slide.title}</h4>
                    {slide.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(slide)} data-testid={`button-edit-hero-${slide.id}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(slide.id)} data-testid={`button-delete-hero-${slide.id}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg" data-testid="dialog-hero-slide">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Edit Hero Slide" : "Add Hero Slide"}</DialogTitle>
            <DialogDescription>Configure the hero slide details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Intelligent Living Spaces"
                data-testid="input-hero-title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., Where Technology Meets Elegance"
                data-testid="input-hero-subtitle"
              />
            </div>
            <div>
              <Label>Image URL *</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/attached_assets/website/hero-image.jpg"
                data-testid="input-hero-image"
              />
              <p className="text-xs text-muted-foreground mt-1">Path to image in attached_assets</p>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional longer description"
                data-testid="input-hero-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Button Text</Label>
                <Input
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Explore Now"
                  data-testid="input-hero-cta-text"
                />
              </div>
              <div>
                <Label>CTA Link</Label>
                <Input
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/products"
                  data-testid="input-hero-cta-link"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-hero-sort"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  data-testid="switch-hero-active"
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.title || !formData.imageUrl} data-testid="button-save-hero">
                <Save className="w-4 h-4 mr-2" />
                {editingSlide ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TestimonialsSection({
  testimonials,
  isLoading,
  dialogOpen,
  setDialogOpen,
  editingItem,
  setEditingItem,
}: {
  testimonials: Testimonial[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingItem: Testimonial | null;
  setEditingItem: (item: Testimonial | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatarUrl: "",
    featured: false,
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatarUrl: "",
      featured: false,
      sortOrder: testimonials.length,
      active: true,
    });
    setEditingItem(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/testimonials", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/testimonials"] });
      toast({ title: "Testimonial created!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/testimonials/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/testimonials"] });
      toast({ title: "Testimonial updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/testimonials"] });
      toast({ title: "Testimonial deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company || "",
      content: item.content,
      rating: item.rating,
      avatarUrl: item.avatarUrl || "",
      featured: item.featured,
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Client testimonials displayed on the homepage
        </p>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-testimonial">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </Card>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="p-8 text-center">
          <Quote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Testimonials</h3>
          <p className="text-sm text-muted-foreground mb-4">Add client testimonials to showcase.</p>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <Card key={item.id} className={`p-6 ${!item.active ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    {item.featured && <Badge variant="secondary">Featured</Badge>}
                    {!item.active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <p className="text-sm mb-3 line-clamp-3">"{item.content}"</p>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}{item.company && `, ${item.company}`}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} data-testid={`button-edit-testimonial-${item.id}`}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-testimonial-${item.id}`}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg" data-testid="dialog-testimonial">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>Add a client testimonial</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Client Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rajesh Sharma"
                data-testid="input-testimonial-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role/Title *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Homeowner, Mumbai"
                  data-testid="input-testimonial-role"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Optional"
                  data-testid="input-testimonial-company"
                />
              </div>
            </div>
            <div>
              <Label>Testimonial Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="What the client said..."
                rows={4}
                data-testid="input-testimonial-content"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rating (1-5)</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(v) => setFormData({ ...formData, rating: parseInt(v) })}
                >
                  <SelectTrigger data-testid="select-testimonial-rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={r.toString()}>{r} Star{r > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="Optional image URL"
                  data-testid="input-testimonial-avatar"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  data-testid="switch-testimonial-featured"
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  data-testid="switch-testimonial-active"
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.role || !formData.content} data-testid="button-save-testimonial">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatsSection({
  stats,
  isLoading,
  dialogOpen,
  setDialogOpen,
  editingItem,
  setEditingItem,
}: {
  stats: Stat[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingItem: Stat | null;
  setEditingItem: (item: Stat | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    description: "",
    icon: "",
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      label: "",
      value: "",
      description: "",
      icon: "",
      sortOrder: stats.length,
      active: true,
    });
    setEditingItem(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/stats", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      toast({ title: "Stat created!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/stats/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      toast({ title: "Stat updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/stats/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      toast({ title: "Stat deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (item: Stat) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      value: item.value,
      description: item.description || "",
      icon: item.icon || "",
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Key statistics displayed on the homepage (e.g., "20+ Years", "500+ Projects")
        </p>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-stat">
          <Plus className="w-4 h-4 mr-2" />
          Add Stat
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse p-6 text-center">
              <div className="h-8 bg-muted rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-muted rounded w-24 mx-auto" />
            </Card>
          ))}
        </div>
      ) : stats.length === 0 ? (
        <Card className="p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Stats</h3>
          <p className="text-sm text-muted-foreground mb-4">Add key statistics to showcase.</p>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item) => (
            <Card key={item.id} className={`p-6 text-center ${!item.active ? 'opacity-50' : ''}`}>
              <div className="text-3xl font-bold text-primary mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground mb-3">{item.label}</div>
              <div className="flex justify-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} data-testid={`button-edit-stat-${item.id}`}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-stat-${item.id}`}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" data-testid="dialog-stat">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Stat" : "Add Stat"}</DialogTitle>
            <DialogDescription>Add a key statistic to display</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Value *</Label>
              <Input
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g., 20+"
                data-testid="input-stat-value"
              />
            </div>
            <div>
              <Label>Label *</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Years of Excellence"
                data-testid="input-stat-label"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional longer text"
                data-testid="input-stat-description"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                data-testid="switch-stat-active"
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.value || !formData.label} data-testid="button-save-stat">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BrandLogosSection({
  logos,
  isLoading,
  dialogOpen,
  setDialogOpen,
  editingItem,
  setEditingItem,
}: {
  logos: BrandLogo[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingItem: BrandLogo | null;
  setEditingItem: (item: BrandLogo | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    category: "partner",
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      logoUrl: "",
      websiteUrl: "",
      category: "partner",
      sortOrder: logos.length,
      active: true,
    });
    setEditingItem(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/brand-logos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/brand-logos"] });
      toast({ title: "Brand logo added!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/brand-logos/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/brand-logos"] });
      toast({ title: "Brand logo updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/brand-logos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/brand-logos"] });
      toast({ title: "Brand logo deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (item: BrandLogo) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      logoUrl: item.logoUrl,
      websiteUrl: item.websiteUrl || "",
      category: item.category,
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const categorizedLogos = {
    partner: logos.filter(l => l.category === 'partner'),
    featured: logos.filter(l => l.category === 'featured'),
    certification: logos.filter(l => l.category === 'certification'),
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Partner brands and certifications displayed on the site
        </p>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-brand">
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse p-4 aspect-video" />
          ))}
        </div>
      ) : logos.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Brand Logos</h3>
          <p className="text-sm text-muted-foreground mb-4">Add partner brand logos.</p>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(categorizedLogos).map(([category, categoryLogos]) => (
            categoryLogos.length > 0 && (
              <div key={category}>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 capitalize">{category} Brands</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {categoryLogos.map((item) => (
                    <Card key={item.id} className={`p-4 ${!item.active ? 'opacity-50' : ''}`}>
                      <div className="aspect-video relative bg-muted rounded flex items-center justify-center mb-2">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-center truncate mb-2">{item.name}</p>
                      <div className="flex justify-center gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEdit(item)} data-testid={`button-edit-brand-${item.id}`}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-brand-${item.id}`}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" data-testid="dialog-brand">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Brand Logo" : "Add Brand Logo"}</DialogTitle>
            <DialogDescription>Add a partner or featured brand</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Brand Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Lutron"
                data-testid="input-brand-name"
              />
            </div>
            <div>
              <Label>Logo URL *</Label>
              <Input
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="/attached_assets/website/logos/lutron.svg"
                data-testid="input-brand-logo"
              />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.lutron.com"
                data-testid="input-brand-website"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger data-testid="select-brand-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                data-testid="switch-brand-active"
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.logoUrl} data-testid="button-save-brand">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const FOOTER_CATEGORIES = ["Solutions", "Partners", "Company", "Support"];

function FooterLinksSection({
  links,
  isLoading,
  dialogOpen,
  setDialogOpen,
  editingItem,
  setEditingItem,
}: {
  links: FooterLink[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingItem: FooterLink | null;
  setEditingItem: (item: FooterLink | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "Solutions",
    label: "",
    url: "#",
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      category: "Solutions",
      label: "",
      url: "#",
      sortOrder: links.length,
      active: true,
    });
    setEditingItem(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/footer-links", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/footer-links"] });
      toast({ title: "Footer link added!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/footer-links/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/footer-links"] });
      toast({ title: "Footer link updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/footer-links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/footer-links"] });
      toast({ title: "Footer link deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (item: FooterLink) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      label: item.label,
      url: item.url,
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const linksByCategory = FOOTER_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = links.filter(l => l.category === cat).sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Manage footer navigation links by category
        </p>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-footer-link">
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse p-4 h-32" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <Card className="p-8 text-center">
          <LinkIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Footer Links</h3>
          <p className="text-sm text-muted-foreground mb-4">Add footer navigation links by category.</p>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOOTER_CATEGORIES.map((category) => (
            <Card key={category} className="p-4">
              <h4 className="font-medium text-sm mb-3 border-b pb-2">{category}</h4>
              <div className="space-y-2">
                {linksByCategory[category].length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No links in this category</p>
                ) : (
                  linksByCategory[category].map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-2 rounded-md bg-muted/30 ${!item.active ? 'opacity-50' : ''}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEdit(item)} data-testid={`button-edit-footer-${item.id}`}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-footer-${item.id}`}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" data-testid="dialog-footer-link">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Footer Link" : "Add Footer Link"}</DialogTitle>
            <DialogDescription>Add a navigation link to the footer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger data-testid="select-footer-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOOTER_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Link Label *</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Lighting Control"
                data-testid="input-footer-label"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="e.g., /solutions/lighting or #lighting"
                data-testid="input-footer-url"
              />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-footer-order"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                data-testid="switch-footer-active"
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.label || !formData.category} data-testid="button-save-footer">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SOCIAL_PLATFORMS = ["whatsapp", "instagram", "linkedin", "twitter", "facebook", "youtube", "email"] as const;

const platformLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  facebook: "Facebook",
  youtube: "YouTube",
  email: "Email",
};

const platformPlaceholders: Record<string, string> = {
  whatsapp: "https://wa.me/919372345545",
  instagram: "https://instagram.com/yourusername",
  linkedin: "https://linkedin.com/company/yourcompany",
  twitter: "https://x.com/yourusername",
  facebook: "https://facebook.com/yourpage",
  youtube: "https://youtube.com/@yourchannel",
  email: "mailto:email@example.com",
};

function SocialLinksSection({
  links,
  isLoading,
  dialogOpen,
  setDialogOpen,
  editingItem,
  setEditingItem,
}: {
  links: SocialLink[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingItem: SocialLink | null;
  setEditingItem: (item: SocialLink | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    platform: "whatsapp" as string,
    url: "",
    label: "",
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      platform: "whatsapp",
      url: "",
      label: "",
      sortOrder: links.length,
      active: true,
    });
    setEditingItem(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/social-links", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/social-links"] });
      toast({ title: "Social link added!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/social-links/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/social-links"] });
      toast({ title: "Social link updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/social-links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/social-links"] });
      toast({ title: "Social link deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (item: SocialLink) => {
    setEditingItem(item);
    setFormData({
      platform: item.platform,
      url: item.url,
      label: item.label || "",
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Social Links</h3>
          <p className="text-sm text-muted-foreground">Manage social media links displayed in the footer</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-social">
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : links.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No social links configured yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {links.sort((a, b) => a.sortOrder - b.sortOrder).map((link) => (
            <Card key={link.id} className={`p-4 ${!link.active ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={link.active ? "default" : "secondary"}>
                  {platformLabels[link.platform] || link.platform}
                </Badge>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(link)} data-testid={`button-edit-social-${link.id}`}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(link.id)}
                    data-testid={`button-delete-social-${link.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate" title={link.url}>{link.url}</p>
              {link.label && (
                <p className="text-xs text-muted-foreground mt-1">Label: {link.label}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" data-testid="dialog-social-link">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
            <DialogDescription>Configure a social media link for the footer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(v) => setFormData({ ...formData, platform: v })}
              >
                <SelectTrigger data-testid="select-social-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform}>{platformLabels[platform]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>URL *</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder={platformPlaceholders[formData.platform] || "https://..."}
                data-testid="input-social-url"
              />
            </div>
            <div>
              <Label>Label (optional)</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Follow us on Instagram"
                data-testid="input-social-label"
              />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-social-order"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                data-testid="switch-social-active"
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.platform || !formData.url} data-testid="button-save-social">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavLinksSection({
  links,
  isLoading,
  dialogOpen,
  setDialogOpen,
  editingItem,
  setEditingItem,
}: {
  links: NavLink[];
  isLoading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingItem: NavLink | null;
  setEditingItem: (item: NavLink | null) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    href: "",
    sortOrder: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      href: "",
      sortOrder: links.length,
      active: true,
    });
    setEditingItem(null);
  };

  const invalidateNavLinks = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/cms/nav-links"] });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/nav-links?active=true"] });
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/cms/nav-links", data),
    onSuccess: () => {
      invalidateNavLinks();
      toast({ title: "Navigation link added!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<typeof formData> }) => 
      apiRequest("PATCH", `/api/cms/nav-links/${data.id}`, data.updates),
    onSuccess: () => {
      invalidateNavLinks();
      toast({ title: "Navigation link updated!" });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cms/nav-links/${id}`),
    onSuccess: () => {
      invalidateNavLinks();
      toast({ title: "Navigation link deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = (item: NavLink) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      href: item.href,
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleToggleActive = (item: NavLink) => {
    updateMutation.mutate({ id: item.id, updates: { active: !item.active } });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Header Navigation</h3>
          <p className="text-sm text-muted-foreground">Toggle which navigation links appear in the header menu</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} data-testid="button-add-nav">
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : links.length === 0 ? (
        <Card className="p-8 text-center">
          <Navigation className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No navigation links configured yet.</p>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Navigation Link
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {links.sort((a, b) => a.sortOrder - b.sortOrder).map((link) => (
            <Card key={link.id} className={`p-4 ${!link.active ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={link.active}
                    onCheckedChange={() => handleToggleActive(link)}
                    data-testid={`switch-nav-active-${link.id}`}
                  />
                  <div>
                    <p className="font-medium">{link.name}</p>
                    <p className="text-sm text-muted-foreground">{link.href}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={link.active ? "default" : "secondary"}>
                    {link.active ? "Visible" : "Hidden"}
                  </Badge>
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(link)} data-testid={`button-edit-nav-${link.id}`}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(link.id)}
                    data-testid={`button-delete-nav-${link.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md" data-testid="dialog-nav-link">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Navigation Link" : "Add Navigation Link"}</DialogTitle>
            <DialogDescription>Configure a header navigation link</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Showcase"
                data-testid="input-nav-name"
              />
            </div>
            <div>
              <Label>URL *</Label>
              <Input
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                placeholder="e.g., /showcase or #section"
                data-testid="input-nav-href"
              />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-nav-order"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                data-testid="switch-nav-form-active"
              />
              <Label>Visible in header</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.href} data-testid="button-save-nav">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
