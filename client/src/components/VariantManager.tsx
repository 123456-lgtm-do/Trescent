import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Star } from "lucide-react";

export interface ProductVariant {
  id?: string;
  finishName: string;
  images: string[];
  orientation?: string;
  aspectRatio?: string;
  isDefault: boolean;
}

interface VariantManagerProps {
  variants: ProductVariant[];
  availableImages: string[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export default function VariantManager({
  variants,
  availableImages,
  onVariantsChange,
}: VariantManagerProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      finishName: "",
      images: [],
      isDefault: variants.length === 0, // First variant is default
    };
    onVariantsChange([...variants, newVariant]);
    setSelectedVariantIndex(variants.length);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    // If we removed the default, make the first one default
    if (variants[index].isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    onVariantsChange(updated);
    setSelectedVariantIndex(null);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    
    // If setting as default, unset all others
    if (field === "isDefault" && value === true) {
      updated.forEach((v, i) => {
        if (i !== index) v.isDefault = false;
      });
    }
    
    onVariantsChange(updated);
  };

  const handleToggleImage = (variantIndex: number, imagePath: string) => {
    const variant = variants[variantIndex];
    const images = variant.images.includes(imagePath)
      ? variant.images.filter(img => img !== imagePath)
      : [...variant.images, imagePath];
    
    handleUpdateVariant(variantIndex, "images", images);
  };

  if (variants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground mb-4">
          No finish variants yet. Add your first finish option.
        </p>
        <Button onClick={handleAddVariant} variant="outline" data-testid="button-add-first-variant">
          <Plus className="w-4 h-4 mr-2" />
          Add First Finish
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Variant List */}
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <Button
            key={index}
            variant={selectedVariantIndex === index ? "default" : "outline"}
            onClick={() => setSelectedVariantIndex(index)}
            className="relative"
            data-testid={`button-select-variant-${index}`}
          >
            {variant.isDefault && (
              <Star className="w-3 h-3 mr-1 fill-current" />
            )}
            {variant.finishName || `Finish ${index + 1}`}
          </Button>
        ))}
        <Button onClick={handleAddVariant} variant="outline" size="icon" data-testid="button-add-variant">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Variant Editor */}
      {selectedVariantIndex !== null && (
        <Card className="glass-heavy border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-light">
              Edit Finish {selectedVariantIndex + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveVariant(selectedVariantIndex)}
              disabled={variants.length === 1}
              data-testid="button-remove-variant"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Finish Name */}
            <div>
              <Label htmlFor={`finish-name-${selectedVariantIndex}`}>
                Finish Name
              </Label>
              <Input
                id={`finish-name-${selectedVariantIndex}`}
                placeholder="e.g., Soft Copper, Black, White"
                value={variants[selectedVariantIndex].finishName}
                onChange={(e) =>
                  handleUpdateVariant(selectedVariantIndex, "finishName", e.target.value)
                }
                data-testid="input-finish-name"
              />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`default-${selectedVariantIndex}`}
                checked={variants[selectedVariantIndex].isDefault}
                onChange={(e) =>
                  handleUpdateVariant(selectedVariantIndex, "isDefault", e.target.checked)
                }
                className="w-4 h-4"
                data-testid="checkbox-is-default"
              />
              <Label htmlFor={`default-${selectedVariantIndex}`}>
                Default Finish (shown first)
              </Label>
            </div>

            {/* Images */}
            <div>
              <Label className="mb-2 block">Select Images for this Finish</Label>
              {variants[selectedVariantIndex].images.length === 0 && (
                <p className="text-sm text-muted-foreground mb-2">
                  No images selected yet
                </p>
              )}
              {variants[selectedVariantIndex].images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {variants[selectedVariantIndex].images.map((imgPath) => {
                    const filename = imgPath.split("/").pop() || imgPath;
                    return (
                      <div key={imgPath} className="relative group">
                        <img
                          src={imgPath}
                          alt={filename}
                          className="aspect-square rounded-lg object-cover border-2 border-primary"
                        />
                        <Badge variant="secondary" className="absolute top-1 right-1 text-xs">
                          Selected
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {availableImages.map((image) => {
                  const imagePath = `/attached_assets/products/${image}`;
                  const isSelected = variants[selectedVariantIndex].images.includes(imagePath);
                  
                  return (
                    <button
                      key={image}
                      onClick={() => handleToggleImage(selectedVariantIndex, imagePath)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover-elevate ${
                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/40"
                      }`}
                      data-testid={`button-variant-image-${image}`}
                    >
                      <img
                        src={imagePath}
                        alt={image}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
