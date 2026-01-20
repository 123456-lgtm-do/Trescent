import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { resolveMoodboardLayout } from "@/lib/moodboardLayout";

// MoodboardItem type for items with selected finishes
interface MoodboardItem extends Product {
  selectedImageIndex?: number;
  moodboardItemId?: string;
}

interface MoodboardPreviewProps {
  products: (Product | MoodboardItem)[];
  userName?: string;
  userEmail?: string;
  clientName?: string;
  projectName?: string;
  projectLocation?: string;
}

export default function MoodboardPreview({ 
  products, 
  userName, 
  userEmail, 
  clientName, 
  projectName, 
  projectLocation 
}: MoodboardPreviewProps) {
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(productsByCategory).sort();
  
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="w-full min-h-[1100px] bg-gradient-to-br from-[#0A1120] via-[#0D1528] to-[#0A1120] p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Magazine-Style Personalized Header */}
        <div className="mb-12">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light tracking-tight text-foreground">
                TRESCENT
              </h1>
              <div className="h-6 w-px bg-primary/30"></div>
              <span className="text-xs text-muted-foreground font-light">Architectural Intelligence</span>
            </div>
            <p className="text-xs text-muted-foreground">{formatDate()}</p>
          </div>

          {/* Client/Project Hero Section - Magazine Style */}
          {(clientName || projectName) && (
            <div className="border-t border-b border-primary/10 py-8 mb-6">
              <div className="max-w-3xl">
                {projectName && (
                  <h2 className="text-5xl font-light tracking-tight text-foreground mb-3 leading-tight">
                    {projectName}
                  </h2>
                )}
                <div className="flex items-center gap-6 text-sm">
                  {clientName && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground uppercase tracking-wider text-xs">For</span>
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
              </div>
            </div>
          )}

          {/* Subheading */}
          <div className="flex items-baseline gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Curated Smart Home Selection</p>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
          </div>
        </div>

        {/* Product Sections by Category */}
        <div className="mb-8 space-y-12">
          {categories.map((category) => {
            const categoryProducts = productsByCategory[category];
            const categoryLayout = resolveMoodboardLayout(categoryProducts);
            
            return (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-light text-foreground mb-1">{category}</h2>
                  <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"></div>
                </div>
                
                {/* Category Products Grid */}
                <div className="grid grid-cols-3 gap-4 grid-flow-dense">
                  {categoryLayout.map(({ product, gridColumn, gridRow }) => {
                    const itemKey = ('moodboardItemId' in product && product.moodboardItemId) ? product.moodboardItemId : product.id;
                    return (
                      <div 
                        key={String(itemKey)}
                        className="glass-premium rounded-xl overflow-hidden border border-primary/20 flex flex-col"
                        style={{
                          gridColumn,
                          gridRow
                        }}
                      >
                        <div className="relative flex-1 min-h-0 bg-background/10">
                          <img 
                            src={product.images['selectedImageIndex' in product && typeof product.selectedImageIndex === 'number' ? product.selectedImageIndex : 0]} 
                            alt={product.name}
                            className="w-full h-full object-contain p-3"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary/90 backdrop-blur-sm border-primary/30 text-xs">
                              {product.brand}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 bg-background/40 backdrop-blur-sm border-t border-border/20 flex flex-col gap-2">
                          <p className="text-xs font-light text-foreground line-clamp-1">{product.name}</p>
                          
                          {/* Product Link (Spec Sheet) */}
                          {product.specSheetUrl && (
                            <a 
                              href={product.specSheetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60"
                              data-testid={`link-product-${product.id}`}
                            >
                              <span>Product Details</span>
                              <span>→</span>
                            </a>
                          )}
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-[9px] text-muted-foreground bg-background/30 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Lifestyle Images Section - Full Width */}
                {(() => {
                  const lifestyleProducts = categoryProducts.filter(
                    p => p.imageType === 'close-up' && p.lifestyleImages && p.lifestyleImages.length > 0
                  );
                  
                  if (lifestyleProducts.length > 0) {
                    return (
                      <div className="mt-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">In Real Spaces</p>
                          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                        </div>
                        <div className="space-y-6">
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
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                                    <p className="text-lg font-light text-white">{product.name}</p>
                                    <p className="text-sm text-white/70">{product.brand}</p>
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
                      <div className="mt-6 pt-4 border-t border-border/20">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Manufacturer Resources</p>
                        <div className="flex flex-wrap gap-3">
                          {manufacturerLinks.map(({ brand, url }) => (
                            <a
                              key={brand}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60"
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
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-primary/20 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Curated by</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                <span className="text-xs font-light text-white">T</span>
              </div>
              <div>
                <p className="text-sm font-light text-foreground">Trescent Lifestyles</p>
                <p className="text-[10px] text-muted-foreground">20 Years of Architectural Intelligence</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground mb-1">Contact</p>
            <p className="text-xs text-foreground">contact@trescent.in</p>
            <p className="text-xs text-primary">+91 98765 43210</p>
          </div>
        </div>
      </div>

      {/* Electric Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
    </div>
  );
}
