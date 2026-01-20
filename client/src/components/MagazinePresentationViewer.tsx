import { Badge } from "@/components/ui/badge";
import type { Product, ProductVariant, MoodboardPresentation } from "@shared/schema";
import { resolveMoodboardLayout } from "@/lib/moodboardLayout";
import { Sparkles } from "lucide-react";

interface MoodboardItem extends Product {
  selectedImageIndex?: number;
  moodboardItemId?: string;
  variants?: ProductVariant[];
  selectedFinishName?: string;
}

interface CategoryNarrative {
  category: string;
  headline?: string;
  description?: string;
}

interface MagazinePresentationViewerProps {
  products: (Product | MoodboardItem)[];
  presentation?: MoodboardPresentation;
  userName?: string;
  userEmail?: string;
  clientName?: string;
  projectName?: string;
  projectLocation?: string;
}

export default function MagazinePresentationViewer({ 
  products, 
  presentation,
  userName, 
  userEmail, 
  clientName, 
  projectName, 
  projectLocation 
}: MagazinePresentationViewerProps) {
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, MoodboardItem[]>);

  const categories = Object.keys(productsByCategory).sort();
  
  const categoryNarratives: Record<string, CategoryNarrative> = {};
  if (presentation?.categoryNarratives) {
    try {
      const parsed = JSON.parse(presentation.categoryNarratives);
      parsed.forEach((narrative: CategoryNarrative) => {
        categoryNarratives[narrative.category] = narrative;
      });
    } catch (e) {
      console.error("Failed to parse category narratives:", e);
    }
  }
  
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getSelectedImage = (product: MoodboardItem): string => {
    if ('selectedImageIndex' in product && typeof product.selectedImageIndex === 'number') {
      return product.images[product.selectedImageIndex] || product.images[0];
    }
    return product.images[0];
  };

  const getFinishLabel = (product: MoodboardItem): string | null => {
    if (!presentation?.showFinishLabels) return null;
    
    if (product.hasVariants && product.selectedFinishName) {
      return product.selectedFinishName;
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0A1120] via-[#0D1528] to-[#0A1120] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative z-10 py-16 px-8 lg:px-16 max-w-[1400px] mx-auto">
        {/* HERO SPREAD */}
        <div className="mb-20">
          {/* Magazine Masthead */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-light tracking-tight text-foreground">
                TRESCENT
              </h1>
              <div className="h-8 w-px bg-primary/30"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground font-light">Architectural Intelligence</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">20th Anniversary</p>
              <p className="text-xs text-muted-foreground">{formatDate()}</p>
            </div>
          </div>

          {/* Hero Editorial */}
          <div className="border-t border-b border-primary/10 py-12">
            <div className="max-w-4xl">
              {/* Hero Headline */}
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-6 leading-tight">
                {presentation?.heroHeadline || projectName || "Your Vision of Modern Living"}
              </h2>
              
              {/* Hero Subhead */}
              {(presentation?.heroSubhead || clientName) && (
                <p className="text-xl text-muted-foreground font-light mb-6 leading-relaxed">
                  {presentation?.heroSubhead || `Curated exclusively for ${clientName}`}
                </p>
              )}
              
              {/* Hero Description */}
              {presentation?.heroDescription && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-foreground/80 font-light leading-relaxed">
                    {presentation.heroDescription}
                  </p>
                </div>
              )}
              
              {/* Project Metadata */}
              {(clientName || projectLocation) && (
                <div className="flex items-center gap-6 mt-8 text-sm border-t border-primary/10 pt-6">
                  {clientName && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground uppercase tracking-wider text-xs">Prepared for</span>
                      <span className="text-foreground font-light">{clientName}</span>
                    </div>
                  )}
                  {projectLocation && (
                    <>
                      <div className="h-4 w-px bg-primary/20"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground uppercase tracking-wider text-xs">Location</span>
                        <span className="text-foreground font-light">{projectLocation}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORY SPREADS */}
        <div className="space-y-24">
          {categories.map((category, categoryIndex) => {
            const categoryProducts = productsByCategory[category];
            const categoryLayout = resolveMoodboardLayout(categoryProducts);
            const narrative = categoryNarratives[category];
            
            return (
              <div key={category} className="relative">
                {/* Category Spread Header */}
                <div className="mb-10">
                  {/* Category Number & Title */}
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-5xl font-light text-primary/30">
                      {String(categoryIndex + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-3xl font-light text-foreground mb-2">{category}</h3>
                      <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Category Narrative */}
                  {narrative && presentation?.showDescriptiveCopy && (
                    <div className="ml-20 max-w-3xl">
                      {narrative.headline && (
                        <h4 className="text-xl text-foreground/90 font-light mb-3 leading-relaxed">
                          {narrative.headline}
                        </h4>
                      )}
                      {narrative.description && (
                        <p className="text-muted-foreground font-light leading-relaxed">
                          {narrative.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Category Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryLayout.map(({ product }) => {
                    const itemKey = ('moodboardItemId' in product && product.moodboardItemId) ? product.moodboardItemId : product.id;
                    const selectedImage = getSelectedImage(product);
                    const finishLabel = getFinishLabel(product);
                    
                    return (
                      <div 
                        key={String(itemKey)}
                        className="group relative"
                      >
                        {/* Product Card */}
                        <div className="glass-premium rounded-2xl overflow-hidden border border-primary/20 transition-all duration-300 hover:border-primary/40 flex flex-col h-full">
                          {/* Image Container */}
                          <div className="relative aspect-square bg-background/10">
                            <img 
                              src={selectedImage} 
                              alt={product.name}
                              className="w-full h-full object-contain p-6"
                            />
                            
                            {/* Brand Badge */}
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-primary/90 backdrop-blur-sm border-primary/30 text-xs font-light">
                                {product.brand}
                              </Badge>
                            </div>
                            
                            {/* Finish Label Badge */}
                            {finishLabel && (
                              <div className="absolute bottom-3 left-3">
                                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs font-light">
                                  {finishLabel}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-5 bg-background/40 backdrop-blur-sm border-t border-border/20 flex-1 flex flex-col">
                            <h5 className="text-base font-light text-foreground mb-2 leading-snug">
                              {product.name}
                            </h5>
                            
                            {/* Product Description */}
                            {presentation?.showDescriptiveCopy && product.description && (
                              <p className="text-xs text-muted-foreground font-light mb-3 leading-relaxed line-clamp-3">
                                {product.description}
                              </p>
                            )}
                            
                            {/* Product Link (Spec Sheet) */}
                            {product.specSheetUrl && (
                              <div className="mb-3">
                                <a 
                                  href={product.specSheetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60"
                                >
                                  <span>Product Details</span>
                                  <span>→</span>
                                </a>
                              </div>
                            )}
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {product.tags.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag} 
                                  className="text-[10px] text-muted-foreground/70 bg-background/30 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Lifestyle Images Section - Full Width Spreads */}
                {(() => {
                  const lifestyleProducts = categoryProducts.filter(
                    p => p.imageType === 'close-up' && p.lifestyleImages && p.lifestyleImages.length > 0
                  );
                  
                  if (lifestyleProducts.length > 0) {
                    return (
                      <div className="mt-12 space-y-8">
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider">In Real Spaces</p>
                          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent"></div>
                        </div>
                        <div className="space-y-8">
                          {lifestyleProducts.flatMap(product => 
                            (product.lifestyleImages || []).map((lifestyleImg, idx) => {
                              const imgPath = lifestyleImg.startsWith('/') || lifestyleImg.startsWith('attached_assets')
                                ? lifestyleImg
                                : `/attached_assets/products/${lifestyleImg}`;
                              return (
                                <div 
                                  key={`${product.id}-lifestyle-${idx}`}
                                  className="relative w-full rounded-2xl overflow-hidden border border-primary/20"
                                  style={{ aspectRatio: '16/9' }}
                                >
                                  <img 
                                    src={imgPath}
                                    alt={`${product.name} - Lifestyle`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                                    <p className="text-2xl font-light text-white mb-1">{product.name}</p>
                                    <p className="text-base text-white/70">{product.brand}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Manufacturer Links Section */}
                {(() => {
                  const manufacturerLinks = categoryProducts
                    .filter(p => p.manufacturerUrl && p.brand)
                    .reduce((acc, p) => {
                      if (!acc.some(item => item.brand === p.brand)) {
                        acc.push({ brand: p.brand, url: p.manufacturerUrl! });
                      }
                      return acc;
                    }, [] as { brand: string; url: string }[]);
                  
                  if (manufacturerLinks.length > 0) {
                    return (
                      <div className="mt-10 pt-6 border-t border-border/20">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Manufacturer Resources</p>
                        <div className="flex flex-wrap gap-4">
                          {manufacturerLinks.map(({ brand, url }) => (
                            <a
                              key={brand}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60"
                            >
                              <span>{brand} Website</span>
                              <span>→</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {/* Category Separator */}
                {categoryIndex < categories.length - 1 && (
                  <div className="mt-16 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-primary/10">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>TRESCENT LIFESTYLES</span>
              <div className="h-3 w-px bg-primary/20"></div>
              <span>Architectural Intelligence Since 2005</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Powered by AURA</span>
              <div className="h-3 w-px bg-primary/20"></div>
              <span>Generated {formatDate()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
