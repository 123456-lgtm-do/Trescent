import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MoodboardPresentation, Moodboard } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Trash2, BookOpen, Sparkles } from "lucide-react";

const productCategories = [
  "Lighting Control",
  "Home Theater",
  "Audio Systems",
  "Climate Control",
  "Security & Access",
  "Shading & Blinds",
  "Networking",
  "Complete Automation"
];

interface CategoryNarrative {
  category: string;
  headline: string;
  description: string;
}

export default function MagazineTemplateEditor() {
  const { toast } = useToast();
  
  const [selectedMoodboardId, setSelectedMoodboardId] = useState<string>("");
  const [layoutTemplate, setLayoutTemplate] = useState<"magazine" | "minimal" | "luxury">("magazine");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubhead, setHeroSubhead] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [categoryNarratives, setCategoryNarratives] = useState<CategoryNarrative[]>([]);
  const [showFinishLabels, setShowFinishLabels] = useState(true);
  const [showDescriptiveCopy, setShowDescriptiveCopy] = useState(true);
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);
  
  // Fetch all moodboards to select from
  const { data: moodboards = [] } = useQuery<Moodboard[]>({
    queryKey: ["/api/moodboards"],
  });
  
  // Fetch presentation for selected moodboard
  const { data: presentation } = useQuery<MoodboardPresentation>({
    queryKey: ["/api/moodboard-presentations", selectedMoodboardId],
    enabled: !!selectedMoodboardId,
  });
  
  // Load presentation data when it changes
  useEffect(() => {
    if (presentation) {
      setLayoutTemplate(presentation.layoutTemplate as "magazine" | "minimal" | "luxury");
      setHeroHeadline(presentation.heroHeadline || "");
      setHeroSubhead(presentation.heroSubhead || "");
      setHeroDescription(presentation.heroDescription || "");
      setShowFinishLabels(presentation.showFinishLabels);
      setShowDescriptiveCopy(presentation.showDescriptiveCopy);
      setShowTechnicalSpecs(presentation.showTechnicalSpecs);
      
      if (presentation.categoryNarratives) {
        try {
          const parsed = JSON.parse(presentation.categoryNarratives);
          setCategoryNarratives(parsed);
        } catch (e) {
          console.error("Failed to parse category narratives:", e);
          setCategoryNarratives([]);
        }
      } else {
        setCategoryNarratives([]);
      }
    }
  }, [presentation]);
  
  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest("POST", "/api/moodboard-presentations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moodboard-presentations", selectedMoodboardId] });
      toast({ 
        title: "Magazine template saved!", 
        description: "Your editorial content has been successfully saved."
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error saving template", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
  
  const addCategoryNarrative = () => {
    if (categoryNarratives.length >= productCategories.length) {
      toast({
        title: "All categories covered",
        description: "You've already added narratives for all categories",
        variant: "default"
      });
      return;
    }
    
    const usedCategories = categoryNarratives.map(n => n.category);
    const availableCategories = productCategories.filter(c => !usedCategories.includes(c));
    
    if (availableCategories.length === 0) {
      toast({
        title: "No categories available",
        description: "All categories are already in use",
        variant: "default"
      });
      return;
    }
    
    setCategoryNarratives([
      ...categoryNarratives,
      { category: availableCategories[0], headline: "", description: "" }
    ]);
  };
  
  const removeCategoryNarrative = (index: number) => {
    setCategoryNarratives(categoryNarratives.filter((_, i) => i !== index));
  };
  
  const updateCategoryNarrative = (index: number, field: keyof CategoryNarrative, value: string) => {
    const updated = [...categoryNarratives];
    updated[index] = { ...updated[index], [field]: value };
    setCategoryNarratives(updated);
  };
  
  const handleSave = () => {
    if (!selectedMoodboardId) {
      toast({
        title: "No moodboard selected",
        description: "Please select a moodboard first",
        variant: "destructive"
      });
      return;
    }
    
    saveMutation.mutate({
      moodboardId: selectedMoodboardId,
      layoutTemplate,
      heroHeadline,
      heroSubhead,
      heroDescription,
      categoryNarratives: JSON.stringify(categoryNarratives),
      showFinishLabels,
      showDescriptiveCopy,
      showTechnicalSpecs
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Moodboard Selector */}
      <Card className="glass-premium border-border/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Magazine Template Editor</CardTitle>
              <CardDescription>
                Create editorial content for luxury magazine-style moodboard presentations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="moodboard-select">Select Moodboard</Label>
            <Select value={selectedMoodboardId} onValueChange={setSelectedMoodboardId}>
              <SelectTrigger id="moodboard-select" data-testid="select-moodboard">
                <SelectValue placeholder="Choose a moodboard to edit..." />
              </SelectTrigger>
              <SelectContent>
                {moodboards.map((moodboard) => (
                  <SelectItem key={moodboard.id} value={moodboard.id}>
                    {moodboard.projectName || `Moodboard by ${moodboard.userName}`}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({new Date(moodboard.createdAt).toLocaleDateString()})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedMoodboardId && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground">
                Now editing editorial content for this moodboard
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedMoodboardId && (
        <>
          {/* Layout Settings */}
          <Card className="glass-premium border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Layout & Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layout-template">Layout Template</Label>
                <Select value={layoutTemplate} onValueChange={(val) => setLayoutTemplate(val as any)}>
                  <SelectTrigger id="layout-template" data-testid="select-layout-template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="magazine">Magazine (Editorial Style)</SelectItem>
                    <SelectItem value="minimal">Minimal (Clean Grid)</SelectItem>
                    <SelectItem value="luxury">Luxury (Premium Showcase)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 pt-2 border-t border-border/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-finish-labels" className="cursor-pointer">Show Finish Labels</Label>
                  <Switch 
                    id="show-finish-labels" 
                    checked={showFinishLabels} 
                    onCheckedChange={setShowFinishLabels}
                    data-testid="switch-show-finish-labels"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-descriptive-copy" className="cursor-pointer">Show Descriptive Copy</Label>
                  <Switch 
                    id="show-descriptive-copy" 
                    checked={showDescriptiveCopy} 
                    onCheckedChange={setShowDescriptiveCopy}
                    data-testid="switch-show-descriptive-copy"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-technical-specs" className="cursor-pointer">Show Technical Specs</Label>
                  <Switch 
                    id="show-technical-specs" 
                    checked={showTechnicalSpecs} 
                    onCheckedChange={setShowTechnicalSpecs}
                    data-testid="switch-show-technical-specs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Hero Section */}
          <Card className="glass-premium border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Hero Editorial</CardTitle>
              <CardDescription>Opening spread headline and narrative copy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-headline">Hero Headline</Label>
                <Input
                  id="hero-headline"
                  placeholder="e.g., A Vision of Modern Luxury"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="text-lg"
                  data-testid="input-hero-headline"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subhead">Hero Subhead</Label>
                <Input
                  id="hero-subhead"
                  placeholder="e.g., Curated smart home solutions for discerning homeowners"
                  value={heroSubhead}
                  onChange={(e) => setHeroSubhead(e.target.value)}
                  data-testid="input-hero-subhead"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-description">Hero Description</Label>
                <Textarea
                  id="hero-description"
                  placeholder="Write a longer narrative description for the opening spread..."
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  rows={4}
                  data-testid="textarea-hero-description"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Category Narratives */}
          <Card className="glass-premium border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Category Narratives</CardTitle>
                  <CardDescription>Add editorial copy for each product category</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  onClick={addCategoryNarrative}
                  disabled={categoryNarratives.length >= productCategories.length}
                  data-testid="button-add-category-narrative"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryNarratives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No category narratives added yet.</p>
                  <p className="text-xs mt-1">Click "Add Category" to start authoring editorial content.</p>
                </div>
              ) : (
                categoryNarratives.map((narrative, index) => (
                  <div key={index} className="p-4 border border-border/40 rounded-lg space-y-3 bg-background/20">
                    <div className="flex items-center justify-between">
                      <Select 
                        value={narrative.category} 
                        onValueChange={(val) => updateCategoryNarrative(index, "category", val)}
                      >
                        <SelectTrigger className="w-64" data-testid={`select-category-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeCategoryNarrative(index)}
                        data-testid={`button-remove-narrative-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`narrative-headline-${index}`}>Headline</Label>
                      <Input
                        id={`narrative-headline-${index}`}
                        placeholder="Category section headline..."
                        value={narrative.headline}
                        onChange={(e) => updateCategoryNarrative(index, "headline", e.target.value)}
                        data-testid={`input-narrative-headline-${index}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`narrative-description-${index}`}>Description</Label>
                      <Textarea
                        id={`narrative-description-${index}`}
                        placeholder="Category narrative copy..."
                        value={narrative.description}
                        onChange={(e) => updateCategoryNarrative(index, "description", e.target.value)}
                        rows={3}
                        data-testid={`textarea-narrative-description-${index}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isPending}
              className="min-w-32"
              data-testid="button-save-template"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
