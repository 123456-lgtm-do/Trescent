import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Helper function to get images from a product (handles both regular and variant products)
function getProductImages(product: ProductWithVariants): string[] {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    return product.variants.map(v => v.images[0]).filter(Boolean);
  }
  return product.images || [];
}

type ProductVariant = {
  id: string;
  productId: string;
  finishName: string;
  images: string[];
  orientation: string | null;
  aspectRatio: string | null;
  sku: string | null;
  isDefault: boolean;
  createdAt: string;
};

type ProductWithVariants = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  featured: boolean;
  hasVariants: boolean;
  variants?: ProductVariant[];
  manufacturerUrl?: string;
};

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const productId = params?.id;
  const { toast } = useToast();

  const [selectedFinishIndex, setSelectedFinishIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading } = useQuery<ProductWithVariants>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  const displayImages = product.hasVariants && product.variants && product.variants.length > 0
    ? product.variants[selectedFinishIndex]?.images || product.images
    : product.images;

  const selectedFinish = product.hasVariants && product.variants
    ? product.variants[selectedFinishIndex]
    : null;

  const handleAddToMoodboard = () => {
    setIsAdding(true);
    
    // Get existing moodboard from localStorage
    const existingMoodboard = localStorage.getItem("moodboard");
    const moodboardItems = existingMoodboard ? JSON.parse(existingMoodboard) : [];

    // Create unique ID for this specific selection
    const moodboardItemId = `${product.id}-${selectedFinishIndex}-${Date.now()}`;
    
    // Get the flattened images array (same way gallery does it)
    const productImages = getProductImages(product);
    
    // Create moodboard item with correct structure matching gallery expectations
    const moodboardItem = {
      ...product,
      images: productImages, // Must use flattened variant images array
      selectedImageIndex: selectedFinishIndex,
      moodboardItemId, // Required for list keys and removal
    };

    // Add to moodboard
    moodboardItems.push(moodboardItem);
    localStorage.setItem("moodboard", JSON.stringify(moodboardItems));

    toast({
      title: "Added to Moodboard",
      description: selectedFinish 
        ? `${product.name} (${selectedFinish.finishName}) has been added to your moodboard`
        : `${product.name} has been added to your moodboard`,
    });

    setTimeout(() => {
      setIsAdding(false);
      setLocation("/moodboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background pb-24">
      {/* Header with Back Button and Add to Moodboard */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation("/moodboard")}
            className="gap-2"
            data-testid="button-back-to-gallery"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-primary/90">{product.brand}</Badge>
            <Button
              size="default"
              onClick={handleAddToMoodboard}
              disabled={isAdding}
              className="hidden md:flex gap-2"
              data-testid="button-add-to-moodboard-header"
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Moodboard
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Sticky Mobile FAB (Floating Action Button) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={handleAddToMoodboard}
          disabled={isAdding}
          className="h-14 px-6 rounded-full shadow-2xl shadow-primary/20"
          data-testid="button-add-to-moodboard-fab"
        >
          {isAdding ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add to Moodboard
            </>
          )}
        </Button>
        {selectedFinish && !isAdding && (
          <p className="text-xs text-center mt-2 text-foreground bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
            {selectedFinish.finishName}
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Product Title & Info - Top of Page */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground font-light uppercase tracking-wider">
            {product.category}
            {product.hasVariants && product.variants && (
              <span className="ml-3">• available in {product.variants.length} finishes</span>
            )}
          </p>
        </div>

        {/* Two Column Layout: Image Left, Details Right */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Hero Image */}
          <div className="space-y-4">
            <div className="bg-background/30 rounded-lg border border-border/40 p-6 overflow-hidden">
              <img
                src={displayImages[0]}
                alt={selectedFinish ? `${product.name} - ${selectedFinish.finishName}` : product.name}
                className="w-full h-auto object-contain max-h-[50vh]"
                data-testid="img-product-hero"
              />
            </div>
            
            {/* Finish Selector Below Image */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Choose Your Finish
                  </h3>
                  {selectedFinish && (
                    <p className="text-xs text-foreground font-medium">
                      {selectedFinish.finishName}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => {
                    const hasFinishImage = variant.images && variant.images.length > 0;
                    
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedFinishIndex(index)}
                        className={`group relative transition-all ${
                          selectedFinishIndex === index
                            ? 'ring-2 ring-primary'
                            : 'hover:ring-2 hover:ring-primary/40'
                        }`}
                        data-testid={`button-finish-${index}`}
                      >
                        {hasFinishImage ? (
                          <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-border/40 bg-background/20">
                            <img
                              src={variant.images[0]}
                              alt={variant.finishName}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div className={`px-3 py-2 rounded-md border-2 transition-colors ${
                            selectedFinishIndex === index
                              ? 'border-primary bg-primary/10'
                              : 'border-border/40 bg-background/20 hover:border-primary/40'
                          }`}>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">
                              {variant.finishName}
                            </p>
                          </div>
                        )}
                        
                        {hasFinishImage && (
                          <p className={`mt-1 text-[10px] text-center leading-tight transition-colors ${
                            selectedFinishIndex === index
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground font-normal'
                          }`}>
                            {variant.finishName}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="space-y-8">
            {/* Luxury Tagline */}
            {product.hasVariants && (
              <div>
                <h2 className="text-3xl font-light text-foreground mb-4 leading-tight">
                  Your {product.name.split(' ')[0]}, Your Style
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Blend in or stand out. Our high-end finishes give you the ultimate freedom of design when it comes to your living spaces.
                </p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  About This Product
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-primary/20 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
