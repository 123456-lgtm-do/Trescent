import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Home, Sparkles, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const propertyTypes = [
  "Luxury Apartment",
  "Penthouse",
  "Villa / Bungalow",
  "Townhouse",
  "Farmhouse",
  "Commercial Space",
  "Other",
];

const propertySizes = [
  "Under 2,000 sq ft",
  "2,000 - 3,500 sq ft",
  "3,500 - 5,000 sq ft",
  "5,000 - 10,000 sq ft",
  "10,000+ sq ft",
];

const budgetRanges = [
  "₹25 - 50 Lakhs",
  "₹50 Lakhs - 1 Crore",
  "₹1 - 2 Crore",
  "₹2 - 5 Crore",
  "₹5 Crore+",
];

const projectTimelines = [
  "Within 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "12+ months",
  "Just exploring",
];

const interestOptions = [
  "Lighting Control",
  "Audio Systems",
  "Home Theater",
  "Climate Control",
  "Security & Access",
  "Shading & Blinds",
  "Complete Automation",
];

export default function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<"designer" | "homeowner" | "">("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [firmName, setFirmName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");
  const [primaryInterests, setPrimaryInterests] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setStep(1);
    setUserType("");
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setFirmName("");
    setClientName("");
    setProjectName("");
    setProjectLocation("");
    setProjectDetails("");
    setPropertyType("");
    setPropertySize("");
    setBudgetRange("");
    setProjectTimeline("");
    setPrimaryInterests([]);
    setIsSubmitted(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const toggleInterest = (interest: string) => {
    setPrimaryInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const submitConsultation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/consultations", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Consultation Request Sent",
        description: "We'll be in touch within 24 hours to schedule your consultation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    const data = {
      userType,
      userName,
      userEmail,
      userPhone: userPhone || null,
      firmName: userType === "designer" ? firmName || null : null,
      clientName: userType === "designer" ? clientName || null : null,
      projectName,
      projectLocation: projectLocation || null,
      projectDetails: projectDetails || null,
      propertyType: userType === "homeowner" ? propertyType || null : null,
      propertySize: userType === "homeowner" ? propertySize || null : null,
      budgetRange: userType === "homeowner" ? budgetRange || null : null,
      projectTimeline: userType === "homeowner" ? projectTimeline || null : null,
      primaryInterests: primaryInterests,
    };
    submitConsultation.mutate(data);
  };

  const handleUserTypeChange = (value: "designer" | "homeowner") => {
    setUserType(value);
  };

  const canProceedStep1 = userType && userName && userEmail;
  const canSubmit = projectName;

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg glass-heavy border-border/40" data-testid="dialog-consultation-success">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your consultation request has been received. We've sent a confirmation to your email, and our team will contact you within 24 hours.
            </p>
            <Button onClick={() => handleClose(false)} data-testid="button-close-success">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto glass-heavy border-border/40" data-testid="dialog-consultation">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            {step === 1 ? "Book a Consultation" : "Project Details"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 1 
              ? "Tell us about yourself to schedule a personalized smart home consultation."
              : "Share your project details so we can prepare for your consultation."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {step === 1 && (
            <>
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-light text-foreground">I am a...</Label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={(value) => handleUserTypeChange(value as "designer" | "homeowner")} 
                  className="space-y-3"
                >
                  <div 
                    className={`glass-premium rounded-xl p-4 border cursor-pointer transition-all ${
                      userType === "designer" ? "border-primary/60 bg-primary/5" : "border-border/40 hover:border-primary/30"
                    }`}
                    onClick={() => handleUserTypeChange("designer")}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="designer" id="consult-designer" className="mt-1" data-testid="radio-consult-designer" />
                      <div className="flex-1">
                        <Label htmlFor="consult-designer" className="cursor-pointer flex items-center gap-2 text-base font-light text-foreground mb-1">
                          <Building2 className="w-4 h-4 text-primary" />
                          Interior Designer / Architect
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Access our trade program with exclusive pricing and dedicated support
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
                      <RadioGroupItem value="homeowner" id="consult-homeowner" className="mt-1" data-testid="radio-consult-homeowner" />
                      <div className="flex-1">
                        <Label htmlFor="consult-homeowner" className="cursor-pointer flex items-center gap-2 text-base font-light text-foreground mb-1">
                          <Home className="w-4 h-4 text-primary" />
                          Homeowner
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get personalized recommendations for your smart home journey
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Your Contact Information</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="consult-name" className="text-xs text-muted-foreground">Your Name *</Label>
                  <Input
                    id="consult-name"
                    type="text"
                    placeholder="Your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-background/50 border-border/50"
                    data-testid="input-consult-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consult-email" className="text-xs text-muted-foreground">Your Email *</Label>
                  <Input
                    id="consult-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="bg-background/50 border-border/50"
                    data-testid="input-consult-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consult-phone" className="text-xs text-muted-foreground">Phone Number <span className="text-muted-foreground/60">(Optional)</span></Label>
                  <Input
                    id="consult-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="bg-background/50 border-border/50"
                    data-testid="input-consult-phone"
                  />
                </div>

                {/* Firm Name - only for designers */}
                {userType === "designer" && (
                  <div className="space-y-2">
                    <Label htmlFor="consult-firm" className="text-xs text-muted-foreground">Firm / Studio Name <span className="text-muted-foreground/60">(Optional)</span></Label>
                    <Input
                      id="consult-firm"
                      type="text"
                      placeholder="e.g., Studio XYZ Design"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="bg-background/50 border-border/50"
                      data-testid="input-consult-firm"
                    />
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="glass-premium rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-foreground mb-2">What to expect:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    30-minute discovery call
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    Personalized system recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    No-obligation consultation
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleClose(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep(2)}
                  className="flex-1"
                  disabled={!canProceedStep1}
                  data-testid="button-consult-next"
                >
                  Next Step
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Designer: Simple Project Info */}
              {userType === "designer" && (
                <div className="space-y-4 p-4 glass-card rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium text-foreground">Tell us about your client's project</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="consult-client-name" className="text-xs text-muted-foreground">Client Name <span className="text-muted-foreground/60">(Optional)</span></Label>
                    <Input
                      id="consult-client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Mr. & Mrs. Sharma"
                      className="mt-1"
                      data-testid="input-consult-client-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="consult-project-name" className="text-xs text-muted-foreground">Project Name *</Label>
                    <Input
                      id="consult-project-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., Bandra Penthouse"
                      className="mt-1"
                      data-testid="input-consult-project-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="consult-project-location" className="text-xs text-muted-foreground">Project Location <span className="text-muted-foreground/60">(Optional)</span></Label>
                    <Input
                      id="consult-project-location"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="e.g., Bandra West, Mumbai"
                      className="mt-1"
                      data-testid="input-consult-project-location"
                    />
                  </div>
                </div>
              )}

              {/* Homeowner: Property Info */}
              {userType === "homeowner" && (
                <div className="space-y-4 p-4 glass-card rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium text-foreground">Tell us about your property</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="consult-property-name" className="text-xs text-muted-foreground">Property / Project Name *</Label>
                    <Input
                      id="consult-property-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., South Mumbai Residence"
                      className="mt-1"
                      data-testid="input-consult-property-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="consult-property-location" className="text-xs text-muted-foreground">Property Location <span className="text-muted-foreground/60">(Optional)</span></Label>
                    <Input
                      id="consult-property-location"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      placeholder="e.g., Worli, Mumbai"
                      className="mt-1"
                      data-testid="input-consult-property-location"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Property Type <span className="text-muted-foreground/60">(Optional)</span></Label>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger className="mt-1" data-testid="select-property-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Property Size <span className="text-muted-foreground/60">(Optional)</span></Label>
                      <Select value={propertySize} onValueChange={setPropertySize}>
                        <SelectTrigger className="mt-1" data-testid="select-property-size">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertySizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Budget Range <span className="text-muted-foreground/60">(Optional)</span></Label>
                      <Select value={budgetRange} onValueChange={setBudgetRange}>
                        <SelectTrigger className="mt-1" data-testid="select-budget-range">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Project Timeline <span className="text-muted-foreground/60">(Optional)</span></Label>
                      <Select value={projectTimeline} onValueChange={setProjectTimeline}>
                        <SelectTrigger className="mt-1" data-testid="select-timeline">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTimelines.map((timeline) => (
                            <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Systems of Interest - shown for BOTH user types */}
              <div className="space-y-3">
                <Label className="text-sm text-foreground">Systems of Interest <span className="text-muted-foreground/60 text-xs">(Optional - select all that apply)</span></Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                        primaryInterests.includes(interest)
                          ? "bg-primary/20 border-primary/60 text-primary"
                          : "bg-background/50 border-border/50 text-muted-foreground hover:border-primary/30"
                      }`}
                      data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <Label htmlFor="consult-details" className="text-sm text-muted-foreground">
                  Anything specific you'd like to discuss? <span className="text-muted-foreground/60">(Optional)</span>
                </Label>
                <Textarea
                  id="consult-details"
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="e.g., Interested in whole-home audio, automated lighting, or home theater..."
                  className="min-h-[80px] bg-background/50 border-border/50"
                  data-testid="input-consult-details"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={!canSubmit || submitConsultation.isPending}
                  data-testid="button-consult-submit"
                >
                  {submitConsultation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Request Consultation
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
