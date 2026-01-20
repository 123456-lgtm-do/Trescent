import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Product, ProductVariant } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Extended Product type with optional variants
type ProductWithVariants = Product & {
  variants?: ProductVariant[];
};

// Helper function to get images from a product (handles both regular and variant products)
function getProductImages(product: ProductWithVariants): string[] {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    // For variant products, return all variant images
    return product.variants.map(v => v.images[0]).filter(Boolean);
  }
  return product.images || [];
}
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import MoodboardPreview from "@/components/MoodboardPreview";
import MagazinePresentationViewer from "@/components/MagazinePresentationViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Save, Share2, Sparkles, X, Download, Building2, Home, Eye, BookOpen, Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// MoodboardItem type for tracking selected finishes
interface MoodboardItem extends Product {
  selectedImageIndex: number;
  moodboardItemId: string; // Unique ID for this specific selection
}

// Product categories
const productCategories = [
  "All Products",
  "Lighting Control",
  "Home Theater",
  "Audio Systems",
  "Climate Control",
  "Security & Access",
  "Shading & Blinds",
  "Networking",
  "Complete Automation",
];

export default function Moodboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [presentationMode, setPresentationMode] = useState<"standard" | "magazine">("standard");
  const [saveStep, setSaveStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState<"designer" | "homeowner" | "">("");
  
  // Scroll to top when step changes
  useEffect(() => {
    if (saveStep === 2) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        const dialogContent = document.querySelector('[data-testid="dialog-save"]');
        if (dialogContent) {
          dialogContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [saveStep]);
  
  // Client/Project personalization fields (for designers)
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [sendToClient, setSendToClient] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  
  // Homeowner qualification fields
  const [sendToDesigner, setSendToDesigner] = useState(false);
  const [designerEmail, setDesignerEmail] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [primaryInterests, setPrimaryInterests] = useState<string[]>([]);

  // Load moodboard from localStorage on mount
  useEffect(() => {
    const savedMoodboard = localStorage.getItem("moodboard");
    if (savedMoodboard) {
      try {
        const parsed = JSON.parse(savedMoodboard);
        setMoodboardItems(parsed);
      } catch (error) {
        console.error("Error loading moodboard from localStorage:", error);
      }
    }
  }, []);

  // Save moodboard to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("moodboard", JSON.stringify(moodboardItems));
  }, [moodboardItems]);

  // Fetch products from database
  const { data: products = [], isLoading } = useQuery<ProductWithVariants[]>({
    queryKey: ["/api/products"],
  });
  
  // Create a demo presentation for the preview (since we don't have a saved moodboard ID yet)
  const demoPresentation = {
    layoutTemplate: "magazine" as const,
    heroHeadline: projectName || "Your Vision of Modern Living",
    heroSubhead: clientName ? `Curated exclusively for ${clientName}` : "Curated smart home solutions",
    heroDescription: "Experience the seamless integration of cutting-edge technology with timeless design. Each element has been carefully selected to create a unified living environment that responds to your lifestyle.",
    categoryNarratives: null,
    showFinishLabels: true,
    showDescriptiveCopy: true,
    showTechnicalSpecs: false,
    moodboardId: "",
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create moodboard mutation
  const createMoodboard = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/moodboards", data);
      return await res.json();
    },
    onSuccess: async (data: any) => {
      const effectiveClientName = userType === "homeowner" ? userName : clientName;
      
      // Create default magazine presentation for this moodboard
      let presentationCreated = true;
      try {
        await apiRequest("POST", "/api/moodboard-presentations", {
          moodboardId: data.id,
          layoutTemplate: "magazine",
          heroHeadline: projectName || "Your Vision of Modern Living",
          heroSubhead: effectiveClientName ? `Curated exclusively for ${effectiveClientName}` : "Curated smart home solutions",
          heroDescription: "Experience the seamless integration of cutting-edge technology with timeless design. Each element has been carefully selected to create a unified living environment that responds to your lifestyle.",
          categoryNarratives: null,
          showFinishLabels: true,
          showDescriptiveCopy: true,
          showTechnicalSpecs: false,
        });
      } catch (error) {
        console.error("Failed to create presentation:", error);
        presentationCreated = false;
        toast({
          title: "Note: Presentation Pending",
          description: "Your moodboard was saved successfully, but the magazine template will be created by our AURA team during processing.",
          variant: "default"
        });
      }
      
      let message = "";
      if (userType === "designer") {
        if (sendToClient && clientEmail) {
          message = `Perfect! Your client's moodboard for ${projectName || "this project"} has been saved and sent to both you and ${clientName || "your client"} at ${clientEmail}.`;
        } else {
          message = `Perfect! Your client's moodboard for ${projectName || "this project"} has been saved and sent to your email.`;
        }
      } else if (sendToDesigner && designerEmail) {
        message = `Thank you! Your moodboard has been saved and sent to both you and your designer ${designerName ? designerName + ' ' : ''}at ${designerEmail}.`;
      } else {
        message = `Thank you! Your moodboard has been saved and sent to your email.`;
      }
      
      setSuccessMessage(message);
      setShowSaveDialog(false);
      setShowSuccessDialog(true);
      
      // Reset form
      setSaveStep(1);
      setUserName("");
      setUserEmail("");
      setUserType("");
      setSendToDesigner(false);
      setDesignerEmail("");
      setDesignerName("");
      setClientName("");
      setClientEmail("");
      setSendToClient(false);
      setProjectName("");
      setProjectLocation("");
      setProjectDetails("");
      setPropertyType("");
      setPropertySize("");
      setProjectTimeline("");
      setBudgetRange("");
      setPrimaryInterests([]);
      setMoodboardItems([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save moodboard. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get all unique tags for the selected category
  const availableTags = Array.from(
    new Set(
      products
        .filter(p => selectedCategory === "All Products" || p.category === selectedCategory)
        .flatMap(p => p.tags)
    )
  ).sort();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    
    // Enhanced search: includes product name, tags, AND variant finish names
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchLower) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (product.hasVariants && product.variants?.some(v => v.finishName.toLowerCase().includes(searchLower)));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(selectedTag => product.tags.includes(selectedTag));
    return matchesCategory && matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Group products by category for section view
  const productsByCategory = productCategories
    .filter(cat => cat !== "All Products")
    .map(category => ({
      category,
      products: filteredProducts.filter(p => p.category === category)
    }))
    .filter(group => group.products.length > 0);

  const addToMoodboard = (product: ProductWithVariants, imageIndex: number = 0) => {
    // Create unique ID for this specific selection (product + image)
    const moodboardItemId = `${product.id}-${imageIndex}-${Date.now()}`;
    
    // Get computed images for this product (handles both regular and variant products)
    const productImages = getProductImages(product);
    
    const newItem: MoodboardItem = {
      ...product,
      images: productImages, // Use computed images array
      selectedImageIndex: imageIndex,
      moodboardItemId
    };
    
    setMoodboardItems([...moodboardItems, newItem]);
  };

  const removeFromMoodboard = (moodboardItemId: string) => {
    setMoodboardItems(moodboardItems.filter(item => item.moodboardItemId !== moodboardItemId));
  };

  const handleSave = () => {
    setShowSaveDialog(true);
    setSaveStep(1);
  };

  const handleUserTypeChange = (type: "designer" | "homeowner") => {
    setUserType(type);
    // Clear clientName when switching to homeowner to prevent stale data
    if (type === "homeowner") {
      setClientName("");
    }
  };

  const handleNextStep = () => {
    if (userType === "homeowner") {
      setSaveStep(2);
    } else {
      // Designer flow - save immediately
      handleFinalSave();
    }
  };

  const handleFinalSave = () => {
    const effectiveClientName = userType === "homeowner" ? userName : clientName;
    
    const moodboardData = {
      userName,
      userEmail,
      userType,
      clientName: effectiveClientName || null,
      clientEmail: userType === "designer" && sendToClient ? clientEmail || null : null,
      sendToClient: userType === "designer" ? sendToClient : false,
      projectName: projectName || null,
      projectLocation: projectLocation || null,
      projectDetails: projectDetails || null,
      propertyType: userType === "homeowner" ? propertyType || null : null,
      propertySize: userType === "homeowner" ? propertySize || null : null,
      projectTimeline: userType === "homeowner" ? projectTimeline || null : null,
      budgetRange: userType === "homeowner" ? budgetRange || null : null,
      primaryInterests: userType === "homeowner" ? primaryInterests : [],
      sendToDesigner: userType === "homeowner" ? sendToDesigner : false,
      designerEmail: sendToDesigner ? designerEmail || null : null,
      designerName: sendToDesigner ? designerName || null : null,
      productIds: moodboardItems.map(item => item.id),
      productData: JSON.stringify(moodboardItems.map(item => ({
        ...item,
        images: item.images,
        selectedImageIndex: item.selectedImageIndex
      }))),
    };
    
    createMoodboard.mutate(moodboardData);
  };

  const toggleInterest = (interest: string) => {
    setPrimaryInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      <div className="relative z-10">
        <GlassNavbar />

        {/* Hero Section */}
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary" data-testid="badge-moodboard">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Design Tool
            </Badge>
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-foreground leading-[1.1] tracking-tight">
              Create Your <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">Smart Home Vision</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Explore premium smart home products and curate your personalized moodboard. Save and share your vision with architects and designers.
            </p>
          </div>
        </section>

        {/* Moodboard Section - Compact */}
        {moodboardItems.length > 0 && (
          <section className="pb-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="glass-heavy rounded-2xl p-5 border border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-light text-foreground">Your Moodboard</h2>
                    <p className="text-xs text-muted-foreground">{moodboardItems.length} items selected</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} data-testid="button-preview-moodboard">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setMoodboardItems([])} data-testid="button-clear-board">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                    <Button size="sm" onClick={handleSave} data-testid="button-save-board">
                      <Save className="w-3 h-3 mr-1" />
                      Save & Share
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(moodboardItems.reduce((acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof moodboardItems>))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, items]) => (
                    <div key={category}>
                      <div className="mb-3">
                        <h3 className="text-sm font-light text-foreground/80 uppercase tracking-wide">{category}</h3>
                        <div className="h-px bg-gradient-to-r from-primary/30 to-transparent mt-1"></div>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {items.map((item) => (
                          <div key={item.moodboardItemId} className="relative group">
                            <Card className="overflow-hidden border-primary/20 hover-elevate transition-all">
                              <CardContent className="p-0">
                                <div className="relative h-24 bg-background/30">
                                  <img src={item.images[item.selectedImageIndex]} alt={item.name} className="w-full h-full object-contain p-2" />
                                  <button
                                    onClick={() => removeFromMoodboard(item.moodboardItemId)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    data-testid={`button-remove-${item.moodboardItemId}`}
                                  >
                                    <X className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                                <div className="p-2">
                                  <p className="text-xs font-light text-foreground line-clamp-1">{item.name}</p>
                                  {item.images.length > 1 && (
                                    <p className="text-xs text-muted-foreground">Finish {item.selectedImageIndex + 1}/{item.images.length}</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Search - Below Moodboard */}
        <section className="pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="glass-premium rounded-2xl p-4 border border-primary/20">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder='Try "metal keypads" or "outdoor speakers" or "luxury audio"'
                      className="pl-12 pr-12 bg-background/50 border-border/50 h-12 text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-product-search"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {productCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedTags([]); // Clear tag filters when changing category
                  }}
                  className="rounded-full"
                  data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Tag Filters (shown when category is selected) */}
        {selectedCategory !== "All Products" && availableTags.length > 0 && (
          <section className="pb-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="glass-premium rounded-2xl p-5 border border-primary/20">
                <div className="mb-3">
                  <h3 className="text-sm font-light text-foreground mb-1">Refine by tags</h3>
                  <p className="text-xs text-muted-foreground">Select tags to narrow your search</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover-elevate transition-all"
                      onClick={() => toggleTag(tag)}
                      data-testid={`badge-tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product Gallery */}
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-foreground mb-2">Product Gallery</h2>
              <p className="text-muted-foreground">Click any product to explore details and finishes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const productImages = getProductImages(product);
                const displayImage = productImages[0] || product.images[0];
                
                return (
                <Card 
                  key={product.id} 
                  className="overflow-hidden border-border/40 hover-elevate transition-all group cursor-pointer" 
                  data-testid={`card-product-${product.id}`}
                  onClick={() => setLocation(`/product/${product.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative h-64 overflow-hidden bg-background/30">
                      <img 
                        src={displayImage} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/90 backdrop-blur-sm border-primary/30">
                          {product.brand}
                        </Badge>
                      </div>
                      
                      {/* Finish Indicator Badge */}
                      {product.hasVariants && product.variants && product.variants.length > 1 && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-primary/30">
                            {product.variants.length} Finishes
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-light mb-2 text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-primary/20">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-primary/20">
                            +{product.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No products found. Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Moodboard Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] glass-heavy border-border/40 p-6" data-testid="dialog-preview">
            <DialogHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-light">Your Moodboard Preview</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Choose between standard grid or magazine-style presentation
                  </DialogDescription>
                </div>
                
                {/* Presentation Mode Toggle */}
                <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg border border-border/50">
                  <Button
                    size="sm"
                    variant={presentationMode === "standard" ? "default" : "ghost"}
                    onClick={() => setPresentationMode("standard")}
                    className="px-3"
                    data-testid="button-standard-mode"
                  >
                    <Eye className="w-3 h-3 mr-1.5" />
                    Standard
                  </Button>
                  <Button
                    size="sm"
                    variant={presentationMode === "magazine" ? "default" : "ghost"}
                    onClick={() => setPresentationMode("magazine")}
                    className="px-3"
                    data-testid="button-magazine-mode"
                  >
                    <BookOpen className="w-3 h-3 mr-1.5" />
                    Magazine
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="bg-white rounded-lg overflow-auto shadow-2xl max-h-[calc(90vh-180px)]">
              {presentationMode === "standard" ? (
                <MoodboardPreview 
                  products={moodboardItems} 
                  userName={userName || undefined}
                  userEmail={userEmail || undefined}
                  clientName={(userType === "homeowner" ? userName : clientName) || undefined}
                  projectName={projectName || undefined}
                  projectLocation={projectLocation || undefined}
                />
              ) : (
                <MagazinePresentationViewer
                  products={moodboardItems}
                  presentation={demoPresentation}
                  userName={userName || undefined}
                  userEmail={userEmail || undefined}
                  clientName={(userType === "homeowner" ? userName : clientName) || undefined}
                  projectName={projectName || undefined}
                  projectLocation={projectLocation || undefined}
                />
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
                Close
              </Button>
              <Button onClick={() => {
                setShowPreview(false);
                handleSave();
              }} className="flex-1" data-testid="button-save-from-preview">
                <Save className="w-4 h-4 mr-2" />
                Save & Share This
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Save Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={(open) => {
          setShowSaveDialog(open);
          if (!open) setSaveStep(1);
        }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto glass-heavy border-border/40" data-testid="dialog-save">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light">
                {saveStep === 1 ? "Save Your Moodboard" : "Tell Us About Your Project"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {saveStep === 1 
                  ? "Share your details to save and receive a personalized link to your curated smart home vision."
                  : "Help us understand your property so we can provide tailored recommendations."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              
              {saveStep === 1 && (
                <>
              {/* User Type Selection - FIRST */}
              <div className="space-y-3">
                <Label className="text-sm font-light text-foreground">I am a...</Label>
                <RadioGroup value={userType} onValueChange={(value) => handleUserTypeChange(value as "designer" | "homeowner")} className="space-y-3">
                  <div 
                    className={`glass-premium rounded-xl p-4 border cursor-pointer transition-all ${
                      userType === "designer" ? "border-primary/60 bg-primary/5" : "border-border/40 hover:border-primary/30"
                    }`}
                    onClick={() => handleUserTypeChange("designer")}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="designer" id="designer" className="mt-1" data-testid="radio-designer" />
                      <div className="flex-1">
                        <Label htmlFor="designer" className="cursor-pointer flex items-center gap-2 text-base font-light text-foreground mb-1">
                          <Building2 className="w-4 h-4 text-primary" />
                          Interior Designer / Architect
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get early access to SmartHomeConfigurator and exclusive designer resources
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`glass-premium rounded-xl p-4 border cursor-pointer transition-all ${
                      userType === "homeowner" ? "border-primary/60 bg-primary/5" : "border-border/40 hover:border-primary/30"
                    }`}
                    onClick={() => handleUserTypeChange("homeowner")}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="homeowner" id="homeowner" className="mt-1" data-testid="radio-homeowner" />
                      <div className="flex-1">
                        <Label htmlFor="homeowner" className="cursor-pointer flex items-center gap-2 text-base font-light text-foreground mb-1">
                          <Home className="w-4 h-4 text-primary" />
                          Homeowner
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive personalized consultation and product recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Conditional Personalization - Designer */}
              {userType === "designer" && (
                <div className="space-y-4 p-4 glass-card rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium text-foreground">Tell us about your client's project</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="client-name" className="text-xs text-muted-foreground">Client Name *</Label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Mr. & Mrs. Sharma"
                      className="mt-1"
                      data-testid="input-client-name"
                    />
                  </div>
                  
                  {/* Send copy to client toggle */}
                  <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <Label htmlFor="send-to-client" className="text-sm text-foreground cursor-pointer">
                        Send a copy to my client
                      </Label>
                    </div>
                    <Switch
                      id="send-to-client"
                      checked={sendToClient}
                      onCheckedChange={setSendToClient}
                      data-testid="switch-send-to-client"
                    />
                  </div>
                  
                  {/* Client email field - shown when sendToClient is true */}
                  {sendToClient && (
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border/40">
                      <div>
                        <Label htmlFor="client-email" className="text-xs text-muted-foreground">Client Email *</Label>
                        <Input
                          id="client-email"
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@email.com"
                          className="mt-1"
                          data-testid="input-client-email"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="project-name" className="text-xs text-muted-foreground">Project Name *</Label>
                    <Input
                      id="project-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., Bandra Penthouse"
                      className="mt-1"
                      data-testid="input-project-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="project-location" className="text-xs text-muted-foreground">Project Location</Label>
                    <Input
                      id="project-location"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="e.g., Bandra West, Mumbai"
                      className="mt-1"
                      data-testid="input-project-location"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Personalization - Homeowner */}
              {userType === "homeowner" && (
                <div className="space-y-4 p-4 glass-card rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium text-foreground">Tell us about your property</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="property-name" className="text-xs text-muted-foreground">Property / Project Name *</Label>
                    <Input
                      id="property-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., South Mumbai Residence"
                      className="mt-1"
                      data-testid="input-property-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="property-location" className="text-xs text-muted-foreground">Property Location</Label>
                    <Input
                      id="property-location"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="e.g., Worli, Mumbai"
                      className="mt-1"
                      data-testid="input-property-location"
                    />
                  </div>
                </div>
              )}

              {/* Your Contact Information */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Your Contact Information</Label>
                
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-muted-foreground">Your Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-background/50 border-border/50"
                  data-testid="input-name"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">Your Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-background/50 border-border/50"
                  data-testid="input-email"
                />
              </div>
              </div>

              {/* Benefits Box */}
              <div className="glass-premium rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-foreground mb-2">What you'll receive:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    Shareable moodboard link
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    High-resolution PDF export
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    {userType === "designer" ? "SmartHomeConfigurator early access" : "Personalized consultation booking"}
                  </li>
                </ul>
              </div>

              {/* Action Buttons - Step 1 */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="flex-1"
                  disabled={
                    !userEmail || 
                    !userName || 
                    !userType ||
                    (userType === "designer" && (!clientName || !projectName)) ||
                    (userType === "designer" && sendToClient && !clientEmail)
                  }
                  data-testid="button-next-step"
                >
                  {userType === "designer" ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Moodboard
                    </>
                  ) : (
                    "Next Step →"
                  )}
                </Button>
              </div>
              </>
              )}

              {saveStep === 2 && userType === "homeowner" && (
                <>
                  {/* Send to Designer Option */}
                  <div className="glass-premium rounded-xl p-4 border border-primary/20">
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="send-to-designer"
                        checked={sendToDesigner}
                        onChange={(e) => setSendToDesigner(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-border bg-background"
                        data-testid="checkbox-send-to-designer"
                      />
                      <div className="flex-1">
                        <Label htmlFor="send-to-designer" className="cursor-pointer text-sm font-light text-foreground mb-1 block">
                          Send this moodboard to my Interior Designer / Architect
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          We'll send the moodboard to your designer and copy you
                        </p>
                      </div>
                    </div>
                    
                    {sendToDesigner && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-border/30">
                        <div className="space-y-2">
                          <Label htmlFor="designer-name" className="text-sm font-light text-foreground">Designer / Architect Name</Label>
                          <Input
                            id="designer-name"
                            type="text"
                            placeholder="Designer's full name"
                            value={designerName}
                            onChange={(e) => setDesignerName(e.target.value)}
                            className="bg-background/50 border-border/50"
                            data-testid="input-designer-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designer-email" className="text-sm font-light text-foreground">Designer / Architect Email</Label>
                          <Input
                            id="designer-email"
                            type="email"
                            placeholder="designer@example.com"
                            value={designerEmail}
                            onChange={(e) => setDesignerEmail(e.target.value)}
                            className="bg-background/50 border-border/50"
                            data-testid="input-designer-email"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Questions - Now Optional */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-light text-foreground">Project Details (Optional)</Label>
                      <Badge variant="outline" className="text-xs">Help us serve you better</Badge>
                    </div>
                    
                    {/* Property Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-muted-foreground">Property Type</Label>
                      <RadioGroup value={propertyType} onValueChange={setPropertyType} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="new-construction" id="new-construction" data-testid="radio-new-construction" />
                          <Label htmlFor="new-construction" className="cursor-pointer font-light">New Construction</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="renovation" id="renovation" data-testid="radio-renovation" />
                          <Label htmlFor="renovation" className="cursor-pointer font-light">Renovation / Retrofit</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="existing" id="existing" data-testid="radio-existing" />
                          <Label htmlFor="existing" className="cursor-pointer font-light">Existing Property</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Property Size */}
                    <div className="space-y-2">
                      <Label htmlFor="property-size" className="text-sm font-light text-muted-foreground">Approximate Property Size</Label>
                      <Input
                        id="property-size"
                        type="text"
                        placeholder="e.g., 5,000 sq ft or 10 BHK"
                        value={propertySize}
                        onChange={(e) => setPropertySize(e.target.value)}
                        className="bg-background/50 border-border/50"
                        data-testid="input-property-size"
                      />
                    </div>

                    {/* Project Timeline */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-muted-foreground">Project Timeline</Label>
                      <RadioGroup value={projectTimeline} onValueChange={setProjectTimeline} className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="immediate" id="immediate" data-testid="radio-immediate" />
                          <Label htmlFor="immediate" className="cursor-pointer font-light text-sm">Within 3 months</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="3-6-months" id="3-6-months" data-testid="radio-3-6-months" />
                          <Label htmlFor="3-6-months" className="cursor-pointer font-light text-sm">3-6 months</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="6-12-months" id="6-12-months" data-testid="radio-6-12-months" />
                          <Label htmlFor="6-12-months" className="cursor-pointer font-light text-sm">6-12 months</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="planning" id="planning" data-testid="radio-planning" />
                          <Label htmlFor="planning" className="cursor-pointer font-light text-sm">Planning phase</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-2">
                      <Label className="text-sm font-light text-muted-foreground">Estimated Budget Range</Label>
                      <RadioGroup value={budgetRange} onValueChange={setBudgetRange} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="premium" id="premium" data-testid="radio-premium" />
                          <Label htmlFor="premium" className="cursor-pointer font-light">₹25L - ₹50L</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="luxury" id="luxury" data-testid="radio-luxury" />
                          <Label htmlFor="luxury" className="cursor-pointer font-light">₹50L - ₹1Cr</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="ultra-luxury" id="ultra-luxury" data-testid="radio-ultra-luxury" />
                          <Label htmlFor="ultra-luxury" className="cursor-pointer font-light">₹1Cr+</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="flexible" id="flexible" data-testid="radio-flexible" />
                          <Label htmlFor="flexible" className="cursor-pointer font-light">Flexible / Not sure yet</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Primary Interests */}
                    <div className="space-y-3">
                      <Label className="text-sm font-light text-muted-foreground">Primary Areas of Interest</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Lighting Control", "Audio Systems", "Home Theater", "Climate Control", "Security", "Shading", "Outdoor Integration", "Complete Automation"].map((interest) => (
                          <Badge
                            key={interest}
                            variant={primaryInterests.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer justify-center py-2 hover-elevate"
                            onClick={() => toggleInterest(interest)}
                            data-testid={`badge-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Step 2 */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setSaveStep(1)} className="flex-1" data-testid="button-back">
                      ← Back
                    </Button>
                    <Button 
                      onClick={handleFinalSave}
                      className="flex-1"
                      disabled={createMoodboard.isPending || (sendToDesigner && (!designerEmail || !designerName))}
                      data-testid="button-confirm-save"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {createMoodboard.isPending ? "Saving..." : (sendToDesigner ? "Send to Designer" : "Save Moodboard")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* AURA Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="glass-premium border-primary/20 max-w-lg">
            <div className="text-center space-y-6 py-4">
              {/* AURA Branding */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-cyan-400/20 to-primary/20 flex items-center justify-center shimmer-border">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-light text-foreground mb-1">Thank you, {userName}!</h3>
                  <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">
                    Powered by AURA
                  </p>
                </div>
              </div>

              {/* Success Message */}
              <p className="text-base font-light text-muted-foreground leading-relaxed px-4">
                {successMessage}
              </p>

              {/* Action Button */}
              <Button 
                onClick={() => setShowSuccessDialog(false)} 
                className="min-w-[160px]"
                data-testid="button-close-success"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </div>
  );
}
