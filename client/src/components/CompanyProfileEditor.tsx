import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CompanyProfileContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, FileText, Award, Users, Building2, Newspaper } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface PressFeature {
  publication: string;
  description: string;
}

const SECTION_ICONS: Record<string, any> = {
  milestones: FileText,
  awards: Award,
  celebrities: Users,
  corporateClients: Building2,
  pressFeatures: Newspaper,
};

const SECTION_LABELS: Record<string, string> = {
  milestones: "Company Milestones",
  awards: "Awards & Recognition",
  celebrities: "Celebrity Clients",
  corporateClients: "Corporate Partners",
  pressFeatures: "Press Features",
};

export default function CompanyProfileEditor() {
  const { toast } = useToast();
  
  const { data: sections = [], isLoading } = useQuery<CompanyProfileContent[]>({
    queryKey: ["/api/cms/company-profile"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { section: string; title?: string; subtitle?: string; content: string }) => {
      return await apiRequest("POST", "/api/cms/company-profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/company-profile"] });
      toast({ title: "Saved", description: "Company profile content updated" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const parseContent = (content: string | null): any[] => {
    if (!content) return [];
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const getSectionData = (sectionName: string) => {
    return sections.find(s => s.section === sectionName);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light">Company Profile PDF</h2>
          <p className="text-sm text-muted-foreground">Edit content for the company brochure PDF</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          <MilestonesSection 
            data={getSectionData("milestones")} 
            onSave={(content) => saveMutation.mutate({ section: "milestones", title: "Our Journey", subtitle: "Two Decades of Innovation", content })}
            isPending={saveMutation.isPending}
          />
          <ListSection
            sectionKey="awards"
            label="Awards & Recognition"
            data={getSectionData("awards")}
            onSave={(content) => saveMutation.mutate({ section: "awards", title: "Recognition", subtitle: "Industry Awards", content })}
            isPending={saveMutation.isPending}
          />
          <ListSection
            sectionKey="celebrities"
            label="Celebrity Clients"
            data={getSectionData("celebrities")}
            onSave={(content) => saveMutation.mutate({ section: "celebrities", title: "Celebrity Clients", subtitle: "Trusted by India's Elite", content })}
            isPending={saveMutation.isPending}
          />
          <ListSection
            sectionKey="corporateClients"
            label="Corporate Partners"
            data={getSectionData("corporateClients")}
            onSave={(content) => saveMutation.mutate({ section: "corporateClients", title: "Corporate Partners", subtitle: "Enterprise Clients", content })}
            isPending={saveMutation.isPending}
          />
          <PressFeaturesSection
            data={getSectionData("pressFeatures")}
            onSave={(content) => saveMutation.mutate({ section: "pressFeatures", title: "Press Coverage", subtitle: "Featured In", content })}
            isPending={saveMutation.isPending}
          />
        </Accordion>
      )}
    </div>
  );
}

function MilestonesSection({ data, onSave, isPending }: { data?: CompanyProfileContent; onSave: (content: string) => void; isPending: boolean }) {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    if (!data?.content) return [];
    try {
      return JSON.parse(data.content);
    } catch {
      return [];
    }
  });

  const addMilestone = () => {
    setMilestones([...milestones, { year: "", title: "", description: "" }]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <AccordionItem value="milestones" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-medium">Company Milestones</span>
          <span className="text-xs text-muted-foreground">({milestones.length} items)</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {milestones.map((m, i) => (
          <Card key={i} className="bg-background/50">
            <CardContent className="pt-4 space-y-3">
              <div className="flex gap-3">
                <div className="w-24">
                  <Label className="text-xs">Year</Label>
                  <Input 
                    value={m.year} 
                    onChange={(e) => updateMilestone(i, "year", e.target.value)}
                    placeholder="2006"
                    data-testid={`milestone-year-${i}`}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Title</Label>
                  <Input 
                    value={m.title} 
                    onChange={(e) => updateMilestone(i, "title", e.target.value)}
                    placeholder="Foundation"
                    data-testid={`milestone-title-${i}`}
                  />
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeMilestone(i)} data-testid={`remove-milestone-${i}`}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea 
                  value={m.description} 
                  onChange={(e) => updateMilestone(i, "description", e.target.value)}
                  placeholder="Trescent Lifestyles founded..."
                  rows={2}
                  data-testid={`milestone-description-${i}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={addMilestone} data-testid="add-milestone">
            <Plus className="w-4 h-4 mr-2" /> Add Milestone
          </Button>
          <Button onClick={() => onSave(JSON.stringify(milestones))} disabled={isPending} data-testid="save-milestones">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ListSection({ sectionKey, label, data, onSave, isPending }: { 
  sectionKey: string; 
  label: string; 
  data?: CompanyProfileContent; 
  onSave: (content: string) => void; 
  isPending: boolean 
}) {
  const [items, setItems] = useState<string[]>(() => {
    if (!data?.content) return [];
    try {
      return JSON.parse(data.content);
    } catch {
      return [];
    }
  });
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const Icon = SECTION_ICONS[sectionKey] || FileText;

  return (
    <AccordionItem value={sectionKey} className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">({items.length} items)</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
              <span className="text-sm">{item}</span>
              <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => removeItem(i)} data-testid={`remove-${sectionKey}-${i}`}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newItem} 
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add ${label.toLowerCase()}...`}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            data-testid={`new-${sectionKey}-input`}
          />
          <Button variant="outline" onClick={addItem} data-testid={`add-${sectionKey}`}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Button onClick={() => onSave(JSON.stringify(items))} disabled={isPending} data-testid={`save-${sectionKey}`}>
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}

function PressFeaturesSection({ data, onSave, isPending }: { data?: CompanyProfileContent; onSave: (content: string) => void; isPending: boolean }) {
  const [features, setFeatures] = useState<PressFeature[]>(() => {
    if (!data?.content) return [];
    try {
      return JSON.parse(data.content);
    } catch {
      return [];
    }
  });

  const addFeature = () => {
    setFeatures([...features, { publication: "", description: "" }]);
  };

  const updateFeature = (index: number, field: keyof PressFeature, value: string) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <AccordionItem value="pressFeatures" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-primary" />
          <span className="font-medium">Press Features</span>
          <span className="text-xs text-muted-foreground">({features.length} items)</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {features.map((f, i) => (
          <Card key={i} className="bg-background/50">
            <CardContent className="pt-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-xs">Publication</Label>
                  <Input 
                    value={f.publication} 
                    onChange={(e) => updateFeature(i, "publication", e.target.value)}
                    placeholder="Robb Report"
                    data-testid={`press-publication-${i}`}
                  />
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeFeature(i)} data-testid={`remove-press-${i}`}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea 
                  value={f.description} 
                  onChange={(e) => updateFeature(i, "description", e.target.value)}
                  placeholder="Featured 5 consecutive years..."
                  rows={2}
                  data-testid={`press-description-${i}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={addFeature} data-testid="add-press-feature">
            <Plus className="w-4 h-4 mr-2" /> Add Press Feature
          </Button>
          <Button onClick={() => onSave(JSON.stringify(features))} disabled={isPending} data-testid="save-press-features">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
