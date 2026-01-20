import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlassNavbar from "@/components/GlassNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone, MessageCircle, Clock, Globe, Send, CheckCircle2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").transform(s => s.trim()),
  email: z.string().email("Please enter a valid email address").transform(s => s.trim().toLowerCase()),
  phone: z.string().optional().transform(s => s?.trim() || undefined),
  company: z.string().optional().transform(s => s?.trim() || undefined),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters").transform(s => s.trim()),
  source: z.string().default("contact_page"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const whatsappNumber = "919372345545";
  const whatsappMessage = encodeURIComponent("Hi Trescent, I'm interested in learning more about your smart home solutions.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=324+TV+Industrial+Estate+Behind+Glaxo+Labs+Worli+Mumbai+400030";

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      source: "contact_page",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }
      
      return result;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlassNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4" data-testid="text-contact-title">
            Let's Create Something
            <span className="text-primary"> Extraordinary</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-description">
            Ready to transform your space with intelligent living? Our team is here to guide you through every step of your smart home journey.
          </p>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Contact Form - 3 columns */}
            <div className="lg:col-span-3">
              <Card className="glass-premium p-8 border-border/40">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-medium text-foreground mb-3" data-testid="text-success-title">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6" data-testid="text-success-description">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      data-testid="button-send-another"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-medium text-foreground mb-6" data-testid="text-form-title">Send Us a Message</h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="John Smith" 
                                    {...field} 
                                    data-testid="input-contact-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    {...field} 
                                    data-testid="input-contact-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="+91 98765 43210" 
                                    {...field} 
                                    data-testid="input-contact-phone"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company / Firm</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Your company name" 
                                    {...field} 
                                    data-testid="input-contact-company"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-contact-subject">
                                    <SelectValue placeholder="What can we help you with?" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="consultation">Request a Consultation</SelectItem>
                                  <SelectItem value="residential">Residential Project</SelectItem>
                                  <SelectItem value="commercial">Commercial Project</SelectItem>
                                  <SelectItem value="trade">Trade Program / Partnership</SelectItem>
                                  <SelectItem value="support">Technical Support</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about your project or inquiry..."
                                  className="min-h-[120px] resize-none"
                                  {...field} 
                                  data-testid="textarea-contact-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={submitMutation.isPending}
                          data-testid="button-submit-contact"
                        >
                          {submitMutation.isPending ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </Card>
            </div>
            
            {/* Contact Info Cards - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Visit Us */}
              <Card className="glass-premium p-6 border-border/40 hover-elevate transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-1" data-testid="text-address-title">Experience Studio</h3>
                    <p className="text-xs text-primary/80 mb-2 font-medium">(By Appointment Only)</p>
                    <address className="text-muted-foreground not-italic text-sm leading-relaxed mb-3" data-testid="text-address">
                      324 TV Industrial Estate,<br />
                      Behind Glaxo Labs,<br />
                      Worli, Mumbai 400030
                    </address>
                    <a 
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
                      data-testid="link-google-maps"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </Card>

              {/* Email Us */}
              <Card className="glass-premium p-6 border-border/40 hover-elevate transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2" data-testid="text-email-title">Email Us</h3>
                    <a 
                      href="mailto:sales-team@trescent.in" 
                      className="text-primary hover:underline block text-sm"
                      data-testid="link-email-sales"
                    >
                      sales-team@trescent.in
                    </a>
                  </div>
                </div>
              </Card>

              {/* Call Us */}
              <Card className="glass-premium p-6 border-border/40 hover-elevate transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2" data-testid="text-phone-title">Call Us</h3>
                    <a 
                      href="tel:+919372345545" 
                      className="text-primary hover:underline block text-lg font-medium"
                      data-testid="link-phone-main"
                    >
                      +91 93723-45545
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">
                      Mon - Sat: 10:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>
              </Card>

              {/* Business Hours */}
              <Card className="glass-card p-6 border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-medium text-foreground" data-testid="text-hours-title">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground">10:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground">11:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground">By Appointment</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-heavy p-8 border-primary/30 bg-gradient-to-r from-green-500/5 to-primary/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <SiWhatsapp className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-1" data-testid="text-whatsapp-title">Quick Connect via WhatsApp</h3>
                  <p className="text-muted-foreground" data-testid="text-whatsapp-description">
                    Get instant answers to your questions. Our team typically responds within minutes.
                  </p>
                </div>
              </div>
              <Button 
                asChild
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg"
                data-testid="button-whatsapp"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Service Areas */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-premium p-8 border-border/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground" data-testid="text-service-title">Service Areas</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-service-description">
                  We serve clients across India
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {["Mumbai & Navi Mumbai", "Delhi NCR", "Kolkata", "Bangalore", "Hyderabad"].map((city) => (
                <div 
                  key={city}
                  className="text-center p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <MapPin className="w-4 h-4 text-primary mx-auto mb-2" />
                  <span className="text-sm text-foreground">{city}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border/30 text-center">
              <p className="text-muted-foreground">
                <span className="text-primary font-medium">Pan India Project Execution</span>
                <span className="mx-2">•</span>
                <span className="text-sm">We bring smart home solutions to your doorstep, anywhere in India</span>
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p data-testid="text-footer">© 2025 Trescent Lifestyles. Celebrating 20 Years of Architectural Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
