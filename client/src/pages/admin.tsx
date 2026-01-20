import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product, ProductVariant } from "@shared/schema";
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
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X, Eye, EyeOff, FileImage, BookOpen, Sparkles, FileDown, Settings, Mail, LayoutDashboard, LogOut } from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import AmbientBackground from "@/components/AmbientBackground";
import VariantManager from "@/components/VariantManager";
import MagazineTemplateEditor from "@/components/MagazineTemplateEditor";
import CMSPanel from "@/components/CMSPanel";
import AdminLogin from "@/components/AdminLogin";

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

const productBrands = [
  "Lutron",
  "Crestron",
  "Basalte",
  "C SEED",
  "Sonos",
  "Steinway Lyngdorf",
  "Other"
];

// Product images are stored in attached_assets/products/
// Fetch dynamically from API

// Extended Product type with optional variants
type ProductWithVariants = Product & {
  variants?: ProductVariant[];
};

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  imageType?: string;
  lifestyleImages?: string[];
  orientation?: string;
  aspectRatio?: string;
  manufacturerUrl?: string;
  specSheetUrl?: string;
  tags: string[];
  featured: boolean;
  hasVariants: boolean;
}

interface VariantFormData {
  id?: string;
  finishName: string;
  images: string[];
  orientation?: string;
  aspectRatio?: string;
  isDefault: boolean;
}

export default function Admin() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [selectedLibraryImages, setSelectedLibraryImages] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"products" | "library" | "magazine" | "pdf" | "cms" | "settings">("products");
  const [teamEmails, setTeamEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    brand: "",
    category: "",
    description: "",
    images: [],
    imageType: "close-up",
    lifestyleImages: [],
    orientation: "square",
    aspectRatio: "1.0",
    tags: [],
    featured: false,
    hasVariants: false
  });
  const [tagInput, setTagInput] = useState("");
  const [processingImage, setProcessingImage] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const [selectedForBgRemoval, setSelectedForBgRemoval] = useState<Record<string, boolean>>({});
  const [bgRemovalProgress, setBgRemovalProgress] = useState<{ completed: number; total: number } | null>(null);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillMethod, setAutofillMethod] = useState<"visual" | "webscrape" | "pdf">("pdf");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTextOnly, setPdfTextOnly] = useState(false);
  const [extractedImagesFilter, setExtractedImagesFilter] = useState<string[] | null>(null);
  const [variants, setVariants] = useState<VariantFormData[]>([]);

  const { data: products = [], isLoading } = useQuery<ProductWithVariants[]>({
    queryKey: ["/api/products"],
  });

  const { data: availableImages = [] } = useQuery<string[]>({
    queryKey: ["/api/product-images"],
  });

  // Get images that are already used in products
  const usedImages = new Set<string>();
  products.forEach(product => {
    product.images?.forEach(imagePath => {
      // Extract just the filename from the full path
      const filename = imagePath.replace('/attached_assets/products/', '');
      usedImages.add(filename);
    });
  });

  // Filter available images to only show unused ones for create dialog
  let unusedImages = availableImages.filter(image => !usedImages.has(image));
  
  // If we have an extracted images filter active, show only those images
  if (extractedImagesFilter && extractedImagesFilter.length > 0) {
    unusedImages = unusedImages.filter(image => extractedImagesFilter.includes(image));
  }

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData & { continueAdding?: boolean }) => {
      const { continueAdding, ...productData } = data;
      return apiRequest("POST", "/api/products", productData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      const continueAdding = (variables as any).continueAdding;
      
      if (continueAdding) {
        toast({ 
          title: "Product created!", 
          description: "Select images for your next product from the same brochure."
        });
        // Keep dialog open and preserve extracted images filter
        resetForm(true);
      } else {
        toast({ title: "Product created successfully!" });
        setShowCreateDialog(false);
        resetForm();
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<ProductFormData> }) => 
      apiRequest("PATCH", `/api/products/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully!" });
      setShowEditDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (productIds: string[]) => apiRequest("POST", "/api/products/bulk-delete", { productIds }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setSelectedProductIds(new Set());
      toast({ title: `Successfully deleted ${data.deletedCount} products!` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting products", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const bulkDeleteImagesMutation = useMutation({
    mutationFn: (imagePaths: string[]) => apiRequest("POST", "/api/product-images/bulk-delete", { imagePaths }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-images"] });
      setSelectedLibraryImages(new Set());
      toast({ title: `Successfully deleted ${data.deletedCount} images!` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting images", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-images"] });
      toast({ title: `Successfully uploaded ${data.count} images!` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error uploading images", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Auth status check
  const { data: authStatus, isLoading: authLoading, refetch: refetchAuth } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/auth/status"],
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
  });
  
  // Show login screen if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!authStatus?.isAdmin) {
    return <AdminLogin onLoginSuccess={() => refetchAuth()} />;
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.size === products.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(products.map(p => p.id)));
    }
  };

  const toggleLibraryImageSelection = (imagePath: string) => {
    setSelectedLibraryImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imagePath)) {
        newSet.delete(imagePath);
      } else {
        newSet.add(imagePath);
      }
      return newSet;
    });
  };

  const toggleSelectAllLibraryImages = () => {
    if (selectedLibraryImages.size === availableImages.length) {
      setSelectedLibraryImages(new Set());
    } else {
      setSelectedLibraryImages(new Set(availableImages));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedProductIds.size} products? This cannot be undone.`)) {
      bulkDeleteMutation.mutate(Array.from(selectedProductIds));
    }
  };

  const handleBulkDeleteImages = () => {
    if (selectedLibraryImages.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedLibraryImages.size} images? This cannot be undone.`)) {
      bulkDeleteImagesMutation.mutate(Array.from(selectedLibraryImages));
    }
  };

  const handleBulkBackgroundRemoval = async () => {
    if (selectedLibraryImages.size === 0) return;
    
    const imagesToProcess = Array.from(selectedLibraryImages);
    const total = imagesToProcess.length;
    
    // Initialize progress
    setBgRemovalProgress({ completed: 0, total });
    
    toast({ 
      title: "Processing images...", 
      description: `Removing backgrounds from ${total} images. This may take a moment.`
    });

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < imagesToProcess.length; i++) {
      const imagePath = imagesToProcess[i];
      try {
        const fullImageUrl = `${window.location.origin}/attached_assets/products/${imagePath}`;
        await apiRequest("POST", "/api/remove-background", {
          imageUrl: fullImageUrl,
          originalFilename: imagePath
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
      
      // Update progress after each image
      setBgRemovalProgress({ completed: i + 1, total });
    }

    queryClient.invalidateQueries({ queryKey: ["/api/product-images"] });
    setSelectedLibraryImages(new Set());
    setBgRemovalProgress(null); // Clear progress

    toast({ 
      title: "Background removal complete!", 
      description: `Successfully processed ${successCount} images${errorCount > 0 ? `, ${errorCount} failed` : ''}`
    });
  };

  const handleRemoveBackground = async (imageUrl: string) => {
    if (processingImage) {
      toast({
        title: "Please wait",
        description: "Another image is being processed. Please wait for it to complete.",
        variant: "default"
      });
      return;
    }
    
    setProcessingImage(imageUrl);
    try {
      const fullImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `${window.location.origin}/attached_assets/products/${imageUrl}`;
      
      const response = await apiRequest("POST", "/api/remove-background", {
        imageUrl: fullImageUrl,
        originalFilename: imageUrl
      });
      
      const data = await response.json() as { filename: string; processedImageUrl: string };
      
      // Store the new filename (server saved it directly)
      setProcessedImages(prev => ({
        ...prev,
        [imageUrl]: data.processedImageUrl
      }));
      
      // Invalidate the images query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/product-images"] });
      
      toast({ 
        title: "Background removed!", 
        description: "Image saved. Click to select it for your product."
      });
    } catch (error: any) {
      toast({ 
        title: "Background removal failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setProcessingImage(null);
    }
  };

  const toggleImageView = (imageUrl: string) => {
    setShowOriginal(prev => ({
      ...prev,
      [imageUrl]: !prev[imageUrl]
    }));
  };

  const resetForm = (keepExtractedFilter = false) => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      description: "",
      images: [],
      orientation: "square",
      aspectRatio: "1.0",
      manufacturerUrl: "",
      specSheetUrl: "",
      tags: [],
      featured: false,
      hasVariants: false
    });
    setSelectedImages([]);
    setTagInput("");
    setSelectedProduct(null);
    setPdfFile(null);
    setVariants([]);
    if (!keepExtractedFilter) {
      setExtractedImagesFilter(null);
    }
  };

  const handleCreateProduct = (continueAdding = false) => {
    // Different validation for variant vs non-variant products
    if (formData.hasVariants) {
      if (!formData.name || !formData.brand || !formData.category) {
        toast({ 
          title: "Missing required fields", 
          description: "Please provide name, brand, and category",
          variant: "destructive" 
        });
        return;
      }
      if (variants.length === 0) {
        toast({ 
          title: "No finish variants", 
          description: "Please add at least one finish variant",
          variant: "destructive" 
        });
        return;
      }
      const invalidVariant = variants.find(v => !v.finishName || v.images.length === 0);
      if (invalidVariant) {
        toast({ 
          title: "Incomplete variant", 
          description: "Each finish must have a name and at least one image",
          variant: "destructive" 
        });
        return;
      }
    } else {
      if (!formData.name || !formData.brand || !formData.category || formData.images.length === 0) {
        toast({ 
          title: "Missing required fields", 
          description: "Please provide name, brand, category, and select an image",
          variant: "destructive" 
        });
        return;
      }
    }
    if (!formData.description) {
      toast({ 
        title: "Missing description", 
        description: "Please add a product description",
        variant: "destructive" 
      });
      return;
    }
    createMutation.mutate({ ...formData, variants, continueAdding } as any);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
    // Different validation for variant vs non-variant products
    if (formData.hasVariants) {
      if (!formData.name || !formData.brand || !formData.category) {
        toast({ 
          title: "Missing required fields", 
          description: "Please provide name, brand, and category",
          variant: "destructive" 
        });
        return;
      }
      if (variants.length === 0) {
        toast({ 
          title: "No finish variants", 
          description: "Please add at least one finish variant",
          variant: "destructive" 
        });
        return;
      }
      const invalidVariant = variants.find(v => !v.finishName || v.images.length === 0);
      if (invalidVariant) {
        toast({ 
          title: "Incomplete variant", 
          description: "Each finish must have a name and at least one image",
          variant: "destructive" 
        });
        return;
      }
    } else {
      if (!formData.name || !formData.brand || !formData.category || formData.images.length === 0) {
        toast({ 
          title: "Missing required fields", 
          description: "Please provide name, brand, category, and select an image",
          variant: "destructive" 
        });
        return;
      }
    }
    if (!formData.description) {
      toast({ 
        title: "Missing description", 
        description: "Please add a product description",
        variant: "destructive" 
      });
      return;
    }
    
    // Always include hasVariants and variants in update to ensure consistency
    const updateData = {
      ...formData,
      hasVariants: formData.hasVariants,
      variants: formData.hasVariants ? variants : []
    };
    
    updateMutation.mutate({ id: selectedProduct.id, updates: updateData });
  };

  const handleEditClick = async (product: Product) => {
    setSelectedProduct(product);
    
    // Clean up duplicate images (if both original and _nobg version exist, keep only _nobg)
    const cleanedImages = (product.images || []).filter((img, index, arr) => {
      const filename = img.split('/').pop() || '';
      const withoutExt = filename.replace(/\.[^/.]+$/, '');
      const nobgFilename = withoutExt.replace(/_nobg$/, '') + '_nobg';
      
      // If this is an original image and a _nobg version exists, skip it
      if (!filename.includes('_nobg')) {
        const hasNobgVersion = arr.some(other => {
          const otherFilename = other.split('/').pop() || '';
          return otherFilename.startsWith(nobgFilename);
        });
        if (hasNobgVersion) return false;
      }
      return true;
    });
    
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      images: cleanedImages,
      imageType: product.imageType || "close-up",
      lifestyleImages: product.lifestyleImages || [],
      orientation: product.orientation || "square",
      aspectRatio: product.aspectRatio || "1.0",
      manufacturerUrl: product.manufacturerUrl || "",
      specSheetUrl: product.specSheetUrl || "",
      tags: product.tags,
      featured: product.featured,
      hasVariants: product.hasVariants || false
    });
    setSelectedImages(cleanedImages.map(img => img.replace('/attached_assets/products/', '')));
    
    // Load variants if product has variants
    if (product.hasVariants) {
      try {
        const response = await fetch(`/api/products/${product.id}/variants`);
        if (response.ok) {
          const variantsData = await response.json();
          setVariants(variantsData.map((v: any) => ({
            finishName: v.finishName,
            images: v.images,
            isDefault: v.isDefault
          })));
        }
      } catch (error) {
        console.error("Failed to load variants:", error);
        setVariants([]);
      }
    } else {
      setVariants([]);
    }
    
    setShowEditDialog(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSelectImage = async (image: string) => {
    // Check if we should use the processed version instead
    const hasProcessedVersion = processedImages[image];
    const imagePath = hasProcessedVersion 
      ? processedImages[image]  // Use the processed version path
      : `/attached_assets/products/${image}`;
    
    // Toggle image selection (multi-select)
    setSelectedImages(prev => {
      if (prev.includes(image)) {
        // Deselect if already selected
        return prev.filter(img => img !== image);
      } else {
        // Add to selection
        return [...prev, image];
      }
    });
    
    // Update formData images
    setFormData(prevData => {
      const currentImagePaths = prevData.images || [];
      let newImages: string[];
      
      // If selecting a processed version, remove BOTH the original and processed from the list first
      if (hasProcessedVersion) {
        const originalPath = `/attached_assets/products/${image}`;
        const processedFilename = imagePath.split('/').pop();
        
        newImages = currentImagePaths.filter(path => 
          !path.endsWith(image) && // Remove original
          !path.endsWith(processedFilename!) // Remove processed if already there
        );
        
        // Then add the processed version
        if (!currentImagePaths.some(path => path === imagePath)) {
          newImages = [...newImages, imagePath];
        }
      } else {
        // Normal toggle behavior for non-processed images
        if (currentImagePaths.some(path => path.endsWith(image))) {
          // Remove image
          newImages = currentImagePaths.filter(path => !path.endsWith(image));
        } else {
          // Add image
          newImages = [...currentImagePaths, imagePath];
        }
      }
      
      return {
        ...prevData,
        images: newImages
      };
    });
    
    // Compute aspect ratio and orientation for the first selected image
    if ((formData.images?.length || 0) === 0) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        const aspectRatio = ratio.toFixed(2);
        let orientation = 'square';
        
        if (ratio > 1.2) {
          orientation = 'landscape';
        } else if (ratio < 0.8) {
          orientation = 'portrait';
        }
        
        setFormData(prevData => ({
          ...prevData,
          orientation,
          aspectRatio
        }));
      };
      img.onerror = () => {
        setFormData(prevData => ({
          ...prevData,
          orientation: 'square',
          aspectRatio: '1.0'
        }));
      };
      img.src = imagePath;
    }
  };

  const handleSelectAllFromPDF = () => {
    if (!extractedImagesFilter || extractedImagesFilter.length === 0) return;
    
    // Add all extracted images with proper paths
    const imagePaths = extractedImagesFilter.map(img => `/attached_assets/products/${img}`);
    
    // Update selected images
    setSelectedImages(extractedImagesFilter);
    
    // Update formData with all image paths
    setFormData(prevData => ({
      ...prevData,
      images: imagePaths
    }));
    
    // Compute orientation from first image
    if (extractedImagesFilter.length > 0) {
      const firstImage = extractedImagesFilter[0];
      const imagePath = `/attached_assets/products/${firstImage}`;
      
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        const aspectRatio = ratio.toFixed(2);
        let orientation = 'square';
        
        if (ratio > 1.2) {
          orientation = 'landscape';
        } else if (ratio < 0.8) {
          orientation = 'portrait';
        }
        
        setFormData(prevData => ({
          ...prevData,
          orientation,
          aspectRatio
        }));
      };
      img.onerror = () => {
        setFormData(prevData => ({
          ...prevData,
          orientation: 'square',
          aspectRatio: '1.0'
        }));
      };
      img.src = imagePath;
    }
    
    toast({
      title: "All images selected",
      description: `${extractedImagesFilter.length} images from PDF selected.`
    });
  };

  const handleAutofill = async () => {
    // Validate required inputs based on method
    if (autofillMethod === "visual") {
      if (selectedImages.length === 0) {
        toast({
          title: "No images selected",
          description: "Please select at least one image for visual analysis",
          variant: "destructive"
        });
        return;
      }
    } else if (autofillMethod === "webscrape") {
      // Web scraping method
      if (!formData.manufacturerUrl) {
        toast({
          title: "Manufacturer URL required",
          description: "Please enter a manufacturer URL for web scraping",
          variant: "destructive"
        });
        return;
      }
    } else if (autofillMethod === "pdf") {
      // PDF brochure method
      if (!pdfFile) {
        toast({
          title: "PDF file required",
          description: "Please upload a product brochure PDF",
          variant: "destructive"
        });
        return;
      }
    }

    setIsAutofilling(true);
    try {
      let data: {
        description: string;
        tags: string[];
        specs?: Record<string, string>;
      };

      if (autofillMethod === "visual") {
        // Visual analysis method - use first selected image
        const firstImage = selectedImages[0];
        const fullImageUrl = firstImage.startsWith('http')
          ? firstImage
          : `${window.location.origin}/attached_assets/products/${firstImage}`;

        const response = await apiRequest("POST", "/api/autofill-product", {
          imageUrl: fullImageUrl
        });

        data = await response.json();

        toast({
          title: "Visual analysis complete!",
          description: "Image analyzed. Review the description and adjust as needed."
        });
      } else if (autofillMethod === "webscrape") {
        // Web scraping method
        const response = await apiRequest("POST", "/api/scrape-product", {
          url: formData.manufacturerUrl,
          useAI: true // Use AI to enhance extraction when needed
        });

        data = await response.json();

        toast({
          title: "Web scraping complete!",
          description: "Product data extracted from manufacturer website."
        });
      } else {
        // PDF brochure method
        const formDataUpload = new FormData();
        formDataUpload.append('pdf', pdfFile!);
        // Add context to help AI extraction
        if (formData.name) formDataUpload.append('name', formData.name);
        if (formData.brand) formDataUpload.append('brand', formData.brand);
        if (formData.category) formDataUpload.append('category', formData.category);
        // Add text-only flag
        if (pdfTextOnly) formDataUpload.append('textOnly', 'true');

        const response = await fetch('/api/extract-from-pdf', {
          method: 'POST',
          body: formDataUpload
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'PDF extraction failed');
        }

        data = await response.json();

        const extractedImages = (data as any).extractedImages || [];
        
        toast({
          title: "PDF extraction complete!",
          description: extractedImages.length > 0 
            ? `Extracted product data and ${extractedImages.length} image(s) from brochure.`
            : "Product data extracted from brochure."
        });
        
        // Refresh image library to show newly extracted images first
        await queryClient.refetchQueries({ queryKey: ['/api/product-images'] });
        
        // Filter library to show only extracted images (but don't auto-select)
        if (extractedImages.length > 0) {
          setExtractedImagesFilter(extractedImages);
        }
      }

      setFormData(prevData => ({
        ...prevData,
        name: (data as any).name || prevData.name,
        description: data.description || prevData.description,
        tags: data.tags && data.tags.length > 0 ? data.tags : prevData.tags
      }));

      // Clear PDF file after successful extraction
      if (autofillMethod === "pdf") {
        setPdfFile(null);
        // Reset file input
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }

    } catch (error: any) {
      console.error("Autofill error:", error);
      const methodName = autofillMethod === "visual" ? "Visual analysis" : 
                         autofillMethod === "webscrape" ? "Web scraping" : "PDF extraction";
      toast({
        title: `${methodName} failed`,
        description: error.message || "Could not extract product data. Please fill in details manually.",
        variant: "destructive"
      });
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AmbientBackground />
      <div className="relative z-10">
        <GlassNavbar />

        <div className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light mb-2 text-foreground">Product Management</h1>
                <p className="text-muted-foreground">Manage your moodboard product catalog and image library</p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-product">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>

            {/* Tabs for Products, Image Library, Magazine Templates, and PDF Downloads */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "products" | "library" | "magazine" | "pdf" | "settings")} className="w-full">
              <TabsList className="glass-premium border border-border/40 mb-6">
                <TabsTrigger value="products" data-testid="tab-products">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Products ({products.length})
                </TabsTrigger>
                <TabsTrigger value="library" data-testid="tab-library">
                  <FileImage className="w-4 h-4 mr-2" />
                  Image Library ({availableImages.length})
                </TabsTrigger>
                <TabsTrigger value="magazine" data-testid="tab-magazine">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Magazine Templates
                </TabsTrigger>
                <TabsTrigger value="pdf" data-testid="tab-pdf">
                  <FileDown className="w-4 h-4 mr-2" />
                  PDF Samples
                </TabsTrigger>
                <TabsTrigger value="cms" data-testid="tab-cms">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  CMS
                </TabsTrigger>
                <TabsTrigger value="settings" data-testid="tab-settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products">

            {/* Product Grid */}
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading products...</div>
            ) : products.length === 0 ? (
              <Card className="glass-premium border-border/40 p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No products yet. Create your first product to get started.</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Product
                </Button>
              </Card>
            ) : (
              <div className="flex flex-col">
                {/* Bulk Actions Header */}
                <div className="flex items-center justify-between mb-6 p-4 glass-premium rounded-xl border border-border/40">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.size === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-border/40 text-primary focus:ring-primary cursor-pointer"
                      data-testid="checkbox-select-all"
                    />
                    <Label className="text-sm text-muted-foreground cursor-pointer" onClick={toggleSelectAll}>
                      Select All ({selectedProductIds.size}/{products.length})
                    </Label>
                  </div>
                  {selectedProductIds.size > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={bulkDeleteMutation.isPending}
                      data-testid="button-bulk-delete"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete {selectedProductIds.size} Product{selectedProductIds.size > 1 ? 's' : ''}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  // Get display image: for variant products, use default variant's first image
                  const displayImage = product.hasVariants && product.variants && product.variants.length > 0
                    ? product.variants.find((v) => v.isDefault)?.images?.[0] || product.variants?.[0]?.images?.[0]
                    : product.images?.[0];
                  
                  return (
                  <Card key={product.id} className="glass-premium border-border/40 overflow-hidden hover-elevate relative">
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.has(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-5 h-5 rounded border-border/40 bg-background/80 backdrop-blur-sm text-primary focus:ring-primary cursor-pointer"
                        data-testid={`checkbox-product-${product.id}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="aspect-video relative bg-background/30">
                      <img 
                        src={displayImage || ""} 
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                      {product.featured && (
                        <Badge className="absolute top-3 right-3 bg-primary/90">Featured</Badge>
                      )}
                      {product.hasVariants && product.variants && product.variants.length > 0 && (
                        <Badge className="absolute top-3 left-12 bg-accent/90 text-accent-foreground">
                          {product.variants.length} finishes
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-light mb-1 truncate">{product.name}</CardTitle>
                          <CardDescription className="text-sm">{product.brand} · {product.category}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteMutation.mutate(product.id)}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                          {product.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{product.tags.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  );
                })}
                </div>
              </div>
            )}
              </TabsContent>

              {/* Image Library Tab */}
              <TabsContent value="library">
                {/* Upload Images - Visible File Input */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="bulk-image-upload"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          // Convert FileList to Array to preserve files after input reset
                          const filesArray = Array.from(files);
                          uploadImagesMutation.mutate(filesArray as any);
                          e.target.value = ''; // Now safe to reset
                        }
                      }}
                      disabled={uploadImagesMutation.isPending}
                      className="block text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                      data-testid="input-bulk-image-upload"
                    />
                    {uploadImagesMutation.isPending && (
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select one or more product images to upload (JPG, PNG, WEBP, etc.)
                  </p>
                </div>

                {availableImages.length === 0 ? (
                  <Card className="glass-premium border-border/40 p-12 text-center">
                    <FileImage className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No images in library. Upload images using the button above or via PDF extract.</p>
                  </Card>
                ) : (
                  <div className="flex flex-col">
                    {/* Bulk Actions Header */}
                    <div className="flex items-center justify-between mb-6 p-4 glass-premium rounded-xl border border-border/40">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedLibraryImages.size === availableImages.length && availableImages.length > 0}
                          onChange={toggleSelectAllLibraryImages}
                          className="w-5 h-5 rounded border-border/40 text-primary focus:ring-primary cursor-pointer"
                          data-testid="checkbox-select-all-images"
                        />
                        <Label className="text-sm text-muted-foreground cursor-pointer" onClick={toggleSelectAllLibraryImages}>
                          Select All ({selectedLibraryImages.size}/{availableImages.length})
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        {selectedLibraryImages.size > 0 && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleBulkBackgroundRemoval}
                              disabled={processingImage !== null || bgRemovalProgress !== null}
                              data-testid="button-bulk-remove-bg"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {bgRemovalProgress ? 'Processing...' : `Remove BG (${selectedLibraryImages.size})`}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleBulkDeleteImages}
                              disabled={bulkDeleteImagesMutation.isPending}
                              data-testid="button-bulk-delete-images"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete {selectedLibraryImages.size} Image{selectedLibraryImages.size > 1 ? 's' : ''}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Background Removal Progress Bar */}
                    {bgRemovalProgress && (
                      <div className="mb-6 p-4 glass-premium rounded-xl border border-border/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Removing backgrounds...</span>
                          <span className="text-sm text-muted-foreground">
                            {bgRemovalProgress.completed} / {bgRemovalProgress.total}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(bgRemovalProgress.completed / bgRemovalProgress.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Processing image {bgRemovalProgress.completed} of {bgRemovalProgress.total}...
                        </p>
                      </div>
                    )}

                    {/* Image Library Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {availableImages.map((imagePath) => {
                        const isUsed = usedImages.has(imagePath);
                        return (
                          <Card key={imagePath} className="glass-premium border-border/40 overflow-hidden hover-elevate relative group">
                            {/* Selection Checkbox */}
                            <div className="absolute top-2 left-2 z-10">
                              <input
                                type="checkbox"
                                checked={selectedLibraryImages.has(imagePath)}
                                onChange={() => toggleLibraryImageSelection(imagePath)}
                                className="w-5 h-5 rounded border-border/40 bg-background/80 backdrop-blur-sm text-primary focus:ring-primary cursor-pointer"
                                data-testid={`checkbox-image-${imagePath}`}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            {/* Used Badge */}
                            {isUsed && (
                              <Badge className="absolute top-2 right-2 bg-green-600/90 text-xs">In Use</Badge>
                            )}
                            <div className="aspect-square relative bg-background/30">
                              <img 
                                src={`/attached_assets/products/${imagePath}`} 
                                alt={imagePath}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <CardContent className="p-2">
                              <p className="text-xs text-muted-foreground truncate" title={imagePath}>
                                {imagePath}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Magazine Templates Tab */}
              <TabsContent value="magazine">
                <MagazineTemplateEditor />
              </TabsContent>

              {/* PDF Samples Tab */}
              <TabsContent value="pdf">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Standard PDF */}
                  <Card className="glass-premium border-border/40">
                    <CardHeader>
                      <CardTitle className="text-xl font-light">Standard Layout</CardTitle>
                      <CardDescription>
                        Clean catalog-style PDF with uniform product cards and consistent spacing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Vertical product cards</li>
                        <li>• Consistent layout throughout</li>
                        <li>• Professional catalog aesthetic</li>
                        <li>• Clear product information</li>
                      </ul>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open('/api/moodboards/sample-pdf?style=standard', '_blank')}
                        data-testid="button-download-standard-pdf"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download Standard PDF
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Magazine PDF */}
                  <Card className="glass-premium border-border/40">
                    <CardHeader>
                      <CardTitle className="text-xl font-light">Magazine Layout</CardTitle>
                      <CardDescription>
                        Editorial-style PDF with varied product sizes and sophisticated typography
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Elegant cover page design</li>
                        <li>• Hero feature products</li>
                        <li>• Multi-column grids</li>
                        <li>• Editorial typography & spacing</li>
                      </ul>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open('/api/moodboards/sample-pdf?style=magazine', '_blank')}
                        data-testid="button-download-magazine-pdf"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download Magazine PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Card */}
                <Card className="glass-premium border-border/40 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-light">About PDF Samples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      These sample PDFs showcase the two layout styles available for customer moodboards. 
                      Both PDFs are generated with test products from your library and demonstrate how the final 
                      customer-facing documents will appear. Click the buttons above to download and compare both styles.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="cms">
                <CMSPanel />
              </TabsContent>
              
              <TabsContent value="settings">
                <SettingsPanel 
                  teamEmails={teamEmails}
                  setTeamEmails={setTeamEmails}
                  newEmail={newEmail}
                  setNewEmail={setNewEmail}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass-heavy border-border/40" data-testid="dialog-create-product">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light">Create New Product</DialogTitle>
              <DialogDescription>Select an image and fill in the product details</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Gallery - Only show unused images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-light">Select Product Image</Label>
                    {extractedImagesFilter && extractedImagesFilter.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {extractedImagesFilter.length} from PDF
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {extractedImagesFilter && extractedImagesFilter.length > 0 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSelectAllFromPDF}
                          className="h-7 text-xs"
                          data-testid="button-select-all-pdf"
                        >
                          Select All from PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExtractedImagesFilter(null)}
                          className="h-7 text-xs"
                          data-testid="button-show-all-images"
                        >
                          Show All Images
                        </Button>
                      </>
                    )}
                    {processingImage && (
                      <Badge variant="secondary" className="text-xs">
                        Processing...
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const imagesToProcess = Object.keys(selectedForBgRemoval).filter(img => selectedForBgRemoval[img]);
                        imagesToProcess.forEach(img => handleRemoveBackground(img));
                      }}
                      disabled={!Object.values(selectedForBgRemoval).some(v => v) || !!processingImage}
                      className="h-7 text-xs"
                      data-testid="button-process-selected"
                    >
                      Remove BG ({Object.values(selectedForBgRemoval).filter(v => v).length})
                    </Button>
                  </div>
                </div>
                {unusedImages.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No unused images available. All images are already assigned to products.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-2">
                    {unusedImages.map((image) => {
                    const isProcessing = processingImage === image;
                    const hasProcessed = !!processedImages[image];
                    const showingOriginal = showOriginal[image];
                    const currentSrc = (hasProcessed && !showingOriginal) 
                      ? processedImages[image] 
                      : `/attached_assets/products/${image}`;
                    
                    return (
                      <div key={image} className="relative group">
                        <button
                          type="button"
                          onClick={() => handleSelectImage(image)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover-elevate ${
                            selectedImages.includes(image) ? 'border-primary ring-2 ring-primary/20' : 'border-border/40'
                          }`}
                          data-testid={`button-select-image-${image}`}
                        >
                          <img 
                            src={currentSrc} 
                            alt={image}
                            className="w-full h-full object-contain p-2"
                          />
                        </button>
                        
                        {/* Checkbox for BG Removal Selection */}
                        {!hasProcessed && !isProcessing && (
                          <div 
                            className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1.5 text-white text-xs cursor-pointer hover:bg-black/75 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedForBgRemoval(prev => ({
                                ...prev,
                                [image]: !prev[image]
                              }));
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedForBgRemoval[image] || false}
                              onChange={() => {}}
                              className="w-3 h-3 cursor-pointer"
                              data-testid={`checkbox-bg-removal-${image}`}
                            />
                            <span>Remove BG</span>
                          </div>
                        )}
                        
                        {isProcessing && (
                          <Badge variant="secondary" className="absolute top-1 right-1 text-xs">
                            Processing...
                          </Badge>
                        )}
                        {hasProcessed && (
                          <>
                            <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                              {showingOriginal ? "Original" : "Processed"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={() => toggleImageView(image)}
                              data-testid={`button-toggle-view-${image}`}
                            >
                              {showingOriginal ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Image Type Selector */}
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/40">
                  <Label htmlFor="image-type">Image Type</Label>
                  <Select 
                    value={formData.imageType || "close-up"} 
                    onValueChange={(value) => setFormData({ ...formData, imageType: value as "close-up" | "lifestyle" })}
                  >
                    <SelectTrigger data-testid="select-image-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="close-up">Close-up (Product detail shots)</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle (In-use images)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {formData.imageType === "close-up" 
                      ? "Product close-ups can optionally include lifestyle images showing the product in use" 
                      : "Lifestyle images show the product in real-world settings"}
                  </p>
                </div>

                {/* Lifestyle Images Upload (only show for close-up products) */}
                {formData.imageType === "close-up" && (
                  <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-cyan-400" />
                      <Label className="text-base">Lifestyle Images (Optional)</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add images showing this product in real-world settings. These will appear as full-page spreads in PDF moodboards.
                    </p>
                    
                    {/* Lifestyle Image Selection Grid - matches close-up grid structure */}
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                      {availableImages.map((image) => {
                        const isSelected = formData.lifestyleImages?.includes(image) || false;
                        return (
                          <div key={image} className="relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const currentLifestyle = formData.lifestyleImages || [];
                                setFormData({
                                  ...formData,
                                  lifestyleImages: isSelected
                                    ? currentLifestyle.filter(img => img !== image)
                                    : [...currentLifestyle, image]
                                });
                              }}
                              className={`aspect-square w-full rounded-lg overflow-hidden border-2 transition-all hover-elevate ${
                                isSelected 
                                  ? "border-cyan-500 ring-2 ring-cyan-500/30" 
                                  : "border-border/40 hover:border-cyan-500/50"
                              }`}
                              data-testid={`lifestyle-image-${image}`}
                            >
                              <img
                                src={`/attached_assets/products/${image}`}
                                alt={image}
                                className="w-full h-full object-contain p-2"
                              />
                            </button>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-cyan-500 rounded-full p-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {formData.lifestyleImages && formData.lifestyleImages.length > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        {formData.lifestyleImages.length} lifestyle {formData.lifestyleImages.length === 1 ? 'image' : 'images'} selected
                      </Badge>
                    )}
                  </div>
                )}

                {/* Autofill Method Selector */}
                <div>
                  <Label htmlFor="autofill-method">Data Extraction Method</Label>
                  <Select 
                    value={autofillMethod} 
                    onValueChange={(value: "visual" | "webscrape" | "pdf") => setAutofillMethod(value)}
                  >
                    <SelectTrigger data-testid="select-autofill-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Brochure (recommended)</SelectItem>
                      <SelectItem value="visual">Visual Analysis (from image)</SelectItem>
                      <SelectItem value="webscrape">Web Scrape (experimental)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {autofillMethod === "pdf" 
                      ? "Upload manufacturer brochure PDF for accurate product details" 
                      : autofillMethod === "visual"
                      ? "Analyze product image for visual details"
                      : "Extract from manufacturer website (may be blocked)"}
                  </p>
                </div>

                {/* PDF Upload (only show when PDF method selected) */}
                {autofillMethod === "pdf" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="pdf-upload">Product Brochure PDF</Label>
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        data-testid="input-pdf-upload"
                      />
                      {pdfFile && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pdf-text-only"
                        checked={pdfTextOnly}
                        onChange={(e) => setPdfTextOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary cursor-pointer"
                        data-testid="checkbox-pdf-text-only"
                      />
                      <Label htmlFor="pdf-text-only" className="cursor-pointer text-sm">
                        Text only (skip image extraction)
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pdfTextOnly 
                        ? "✓ Will only extract product description and details, no images"
                        : "Will extract both text content and product images from the PDF"}
                    </p>
                  </div>
                )}

                {/* AI Autofill Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutofill}
                  disabled={(autofillMethod === "visual" && selectedImages.length === 0) || 
                            (autofillMethod === "webscrape" && !formData.manufacturerUrl) ||
                            (autofillMethod === "pdf" && !pdfFile) ||
                            isAutofilling}
                  className="w-full"
                  data-testid="button-autofill"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {isAutofilling 
                    ? (autofillMethod === "pdf" ? "Extracting from PDF..." : 
                       autofillMethod === "webscrape" ? "Scraping..." : "Analyzing...") 
                    : (autofillMethod === "pdf" ? "AI: Extract from PDF Brochure" :
                       autofillMethod === "webscrape" ? "AI: Extract from Website" : "AI: Analyze Visual Details")}
                </Button>

                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Seetouch Keypad"
                    data-testid="input-product-name"
                  />
                  {autofillMethod === "pdf" && !formData.name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 AI will extract product name from the PDF brochure
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Lutron, Crestron, Basalte"
                    data-testid="input-brand"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Popular: Lutron, Crestron, Basalte, C SEED, Sonos
                  </p>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the product"
                    rows={3}
                    data-testid="input-description"
                  />
                </div>

                {/* Multiple Finishes Checkbox */}
                <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-lg border border-border/40">
                  <input
                    type="checkbox"
                    id="hasVariants"
                    checked={formData.hasVariants}
                    onChange={(e) => {
                      setFormData({ ...formData, hasVariants: e.target.checked });
                      if (!e.target.checked) setVariants([]);
                    }}
                    className="w-4 h-4"
                    data-testid="checkbox-has-variants"
                  />
                  <Label htmlFor="hasVariants" className="cursor-pointer">
                    This product has multiple finishes (e.g., Soft Copper, Black, White)
                  </Label>
                </div>

                {/* Variant Manager - only show if hasVariants is true */}
                {formData.hasVariants && (
                  <div className="border border-border/40 rounded-lg p-4 bg-muted/10">
                    <Label className="text-base mb-3 block">Product Finishes</Label>
                    <VariantManager
                      variants={variants.map(v => ({
                        ...v,
                        images: v.images
                      }))}
                      availableImages={availableImages}
                      onVariantsChange={(newVariants) => setVariants(newVariants as VariantFormData[])}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="manufacturerUrl">Brand Website</Label>
                  <Input
                    id="manufacturerUrl"
                    type="url"
                    value={formData.manufacturerUrl || ""}
                    onChange={(e) => setFormData({ ...formData, manufacturerUrl: e.target.value })}
                    placeholder="https://www.lutron.com"
                    data-testid="input-manufacturer-url"
                  />
                </div>

                <div>
                  <Label htmlFor="specSheetUrl">Product Link</Label>
                  <Input
                    id="specSheetUrl"
                    type="url"
                    value={formData.specSheetUrl || ""}
                    onChange={(e) => setFormData({ ...formData, specSheetUrl: e.target.value })}
                    placeholder="https://www.lutron.com/products/seetouch"
                    data-testid="input-spec-sheet-url"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags..."
                      data-testid="input-tags"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="imageType">Image Type</Label>
                  <Select 
                    value={formData.imageType || "close-up"} 
                    onValueChange={(value) => setFormData({ ...formData, imageType: value })}
                  >
                    <SelectTrigger data-testid="select-image-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="close-up">Close-up (Product Shots)</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle (In-Use)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.imageType === "close-up" 
                      ? "Product close-ups can have optional lifestyle images" 
                      : "Lifestyle images show products in real-world settings"}
                  </p>
                </div>

                {formData.imageType === "close-up" && (
                  <div>
                    <Label>Lifestyle Images (optional)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select images showing this product in real-world use
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-2 border border-border/40 rounded-lg">
                      {availableImages.map((image) => {
                        const isSelected = formData.lifestyleImages?.includes(image);
                        return (
                          <div key={image} className="relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const current = formData.lifestyleImages || [];
                                if (isSelected) {
                                  setFormData({ 
                                    ...formData, 
                                    lifestyleImages: current.filter(img => img !== image) 
                                  });
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    lifestyleImages: [...current, image] 
                                  });
                                }
                              }}
                              className={`aspect-square rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border/40'
                              }`}
                              data-testid={`button-select-lifestyle-${image}`}
                            >
                              <img 
                                src={`/attached_assets/products/${image}`} 
                                alt={image}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {formData.lifestyleImages && formData.lifestyleImages.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {formData.lifestyleImages.length} lifestyle image{formData.lifestyleImages.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  {extractedImagesFilter && extractedImagesFilter.length > 0 && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md border border-border/40">
                      💡 <strong>Multi-product brochure?</strong> Use "Save & Add Another" to create multiple products from the same PDF extraction.
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleCreateProduct(false)} 
                      disabled={createMutation.isPending}
                      className="flex-1"
                      data-testid="button-save-product"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {createMutation.isPending ? "Creating..." : "Create Product"}
                    </Button>
                    {extractedImagesFilter && extractedImagesFilter.length > 0 && (
                      <Button 
                        onClick={() => handleCreateProduct(true)} 
                        disabled={createMutation.isPending}
                        variant="outline"
                        className="flex-1"
                        data-testid="button-save-and-add-another"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Save & Add Another
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass-heavy border-border/40" data-testid="dialog-edit-product">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light">Edit Product</DialogTitle>
              <DialogDescription>Update product details</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-light">Product Image</Label>
                  <div className="flex items-center gap-2">
                    {processingImage && (
                      <Badge variant="secondary" className="text-xs">
                        Processing...
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const imagesToProcess = Object.keys(selectedForBgRemoval).filter(img => selectedForBgRemoval[img]);
                        imagesToProcess.forEach(img => handleRemoveBackground(img));
                      }}
                      disabled={!Object.values(selectedForBgRemoval).some(v => v) || !!processingImage}
                      className="h-7 text-xs"
                      data-testid="button-edit-process-selected"
                    >
                      Remove BG ({Object.values(selectedForBgRemoval).filter(v => v).length})
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-2">
                  {availableImages.map((image) => {
                    const isProcessing = processingImage === image;
                    const hasProcessed = !!processedImages[image];
                    const showingOriginal = showOriginal[image];
                    const currentSrc = (hasProcessed && !showingOriginal) 
                      ? processedImages[image] 
                      : `/attached_assets/products/${image}`;
                    
                    return (
                      <div key={image} className="relative group">
                        <button
                          type="button"
                          onClick={() => handleSelectImage(image)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover-elevate ${
                            selectedImages.includes(image) ? 'border-primary ring-2 ring-primary/20' : 'border-border/40'
                          }`}
                          data-testid={`button-edit-select-image-${image}`}
                        >
                          <img 
                            src={currentSrc} 
                            alt={image}
                            className="w-full h-full object-contain p-2"
                          />
                        </button>
                        
                        {/* Checkbox for BG Removal Selection */}
                        {!hasProcessed && !isProcessing && (
                          <div 
                            className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1.5 text-white text-xs cursor-pointer hover:bg-black/75 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedForBgRemoval(prev => ({
                                ...prev,
                                [image]: !prev[image]
                              }));
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedForBgRemoval[image] || false}
                              onChange={() => {}}
                              className="w-3 h-3 cursor-pointer"
                              data-testid={`checkbox-edit-bg-removal-${image}`}
                            />
                            <span>Remove BG</span>
                          </div>
                        )}
                        
                        {isProcessing && (
                          <Badge variant="secondary" className="absolute top-1 right-1 text-xs">
                            Processing...
                          </Badge>
                        )}
                        {hasProcessed && (
                          <>
                            <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                              {showingOriginal ? "Original" : "Processed"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={() => toggleImageView(image)}
                              data-testid={`button-edit-toggle-view-${image}`}
                            >
                              {showingOriginal ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* AI Extraction Section */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Product Data Extraction
                  </h3>
                  
                  {/* Autofill Method Selector */}
                  <div>
                    <Label htmlFor="edit-autofill-method">Data Extraction Method</Label>
                    <Select 
                      value={autofillMethod} 
                      onValueChange={(value: "visual" | "webscrape" | "pdf") => setAutofillMethod(value)}
                    >
                      <SelectTrigger data-testid="select-edit-autofill-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Brochure (recommended)</SelectItem>
                        <SelectItem value="visual">Visual Analysis (from image)</SelectItem>
                        <SelectItem value="webscrape">Web Scrape (experimental)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {autofillMethod === "pdf" 
                        ? "Upload manufacturer brochure PDF for accurate product details" 
                        : autofillMethod === "visual"
                        ? "Analyze product image for visual details"
                        : "Extract from manufacturer website (may be blocked)"}
                    </p>
                  </div>

                  {/* PDF Upload (only show when PDF method selected) */}
                  {autofillMethod === "pdf" && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="edit-pdf-upload">Product Brochure PDF</Label>
                        <Input
                          id="edit-pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                          data-testid="input-edit-pdf-upload"
                        />
                        {pdfFile && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-pdf-text-only"
                          checked={pdfTextOnly}
                          onChange={(e) => setPdfTextOnly(e.target.checked)}
                          className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary cursor-pointer"
                          data-testid="checkbox-edit-pdf-text-only"
                        />
                        <Label htmlFor="edit-pdf-text-only" className="cursor-pointer text-sm">
                          Text only (skip image extraction)
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {pdfTextOnly 
                          ? "✓ Will only extract product description and details, no images"
                          : "Will extract both text content and product images from the PDF"}
                      </p>
                    </div>
                  )}

                  {/* AI Autofill Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutofill}
                    disabled={isAutofilling}
                    className="w-full"
                    data-testid="button-edit-autofill"
                  >
                    {isAutofilling ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI: {autofillMethod === "pdf" ? "Extract from PDF Brochure" : autofillMethod === "visual" ? "Analyze Product Image" : "Scrape from Website"}
                      </>
                    )}
                  </Button>
                </div>

                {/* Image Type Selector */}
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/40">
                  <Label htmlFor="edit-image-type">Image Type</Label>
                  <Select 
                    value={formData.imageType || "close-up"} 
                    onValueChange={(value) => setFormData({ ...formData, imageType: value as "close-up" | "lifestyle" })}
                  >
                    <SelectTrigger data-testid="select-image-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="close-up">Close-up (Product detail shots)</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle (In-use images)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {formData.imageType === "close-up" 
                      ? "Product close-ups can optionally include lifestyle images showing the product in use" 
                      : "Lifestyle images show the product in real-world settings"}
                  </p>
                </div>

                {/* Lifestyle Images Upload (only show for close-up products) */}
                {formData.imageType === "close-up" && (
                  <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-cyan-400" />
                      <Label className="text-base">Lifestyle Images (Optional)</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add images showing this product in real-world settings. These will appear as full-page spreads in PDF moodboards.
                    </p>
                    
                    {/* Lifestyle Image Selection Grid - matches close-up grid structure */}
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                      {availableImages.map((image) => {
                        const isSelected = formData.lifestyleImages?.includes(image) || false;
                        return (
                          <div key={image} className="relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const currentLifestyle = formData.lifestyleImages || [];
                                setFormData({
                                  ...formData,
                                  lifestyleImages: isSelected
                                    ? currentLifestyle.filter(img => img !== image)
                                    : [...currentLifestyle, image]
                                });
                              }}
                              className={`aspect-square w-full rounded-lg overflow-hidden border-2 transition-all hover-elevate ${
                                isSelected 
                                  ? "border-cyan-500 ring-2 ring-cyan-500/30" 
                                  : "border-border/40 hover:border-cyan-500/50"
                              }`}
                              data-testid={`edit-lifestyle-image-${image}`}
                            >
                              <img
                                src={`/attached_assets/products/${image}`}
                                alt={image}
                                className="w-full h-full object-contain p-2"
                              />
                            </button>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-cyan-500 rounded-full p-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {formData.lifestyleImages && formData.lifestyleImages.length > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        {formData.lifestyleImages.length} lifestyle {formData.lifestyleImages.length === 1 ? 'image' : 'images'} selected
                      </Badge>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Seetouch Keypad"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-brand">Brand *</Label>
                  <Input
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Lutron, Crestron, Basalte"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the product"
                    rows={3}
                  />
                </div>

                {/* Multiple Finishes Checkbox */}
                <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-lg border border-border/40">
                  <input
                    type="checkbox"
                    id="edit-hasVariants"
                    checked={formData.hasVariants}
                    onChange={(e) => {
                      setFormData({ ...formData, hasVariants: e.target.checked });
                      if (!e.target.checked) setVariants([]);
                    }}
                    className="w-4 h-4"
                    data-testid="checkbox-edit-has-variants"
                  />
                  <Label htmlFor="edit-hasVariants" className="cursor-pointer">
                    This product has multiple finishes (e.g., Soft Copper, Black, White)
                  </Label>
                </div>

                {/* Variant Manager - only show if hasVariants is true */}
                {formData.hasVariants && (
                  <div className="border border-border/40 rounded-lg p-4 bg-muted/10">
                    <Label className="text-base mb-3 block">Product Finishes</Label>
                    <VariantManager
                      variants={variants.map(v => ({
                        ...v,
                        images: v.images
                      }))}
                      availableImages={availableImages}
                      onVariantsChange={(newVariants) => setVariants(newVariants as VariantFormData[])}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="edit-manufacturerUrl">Brand Website</Label>
                  <Input
                    id="edit-manufacturerUrl"
                    type="url"
                    value={formData.manufacturerUrl || ""}
                    onChange={(e) => setFormData({ ...formData, manufacturerUrl: e.target.value })}
                    placeholder="https://www.lutron.com"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-specSheetUrl">Product Link</Label>
                  <Input
                    id="edit-specSheetUrl"
                    type="url"
                    value={formData.specSheetUrl || ""}
                    onChange={(e) => setFormData({ ...formData, specSheetUrl: e.target.value })}
                    placeholder="https://www.lutron.com/products/seetouch"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-tags">Tags (optional)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="edit-tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags..."
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleUpdateProduct} 
                    disabled={updateMutation.isPending}
                    className="flex-1"
                    data-testid="button-update-product"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? "Updating..." : "Update Product"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Settings Panel Component
interface SettingsPanelProps {
  teamEmails: string[];
  setTeamEmails: (emails: string[]) => void;
  newEmail: string;
  setNewEmail: (email: string) => void;
}

function SettingsPanel({ teamEmails, setTeamEmails, newEmail, setNewEmail }: SettingsPanelProps) {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showFeaturedBrands, setShowFeaturedBrands] = useState(false);
  
  // Fetch team notification emails setting
  const { data: teamEmailsSetting, isLoading } = useQuery<{ key: string; value: string } | null>({
    queryKey: ['/api/settings/team_notification_emails'],
  });
  
  // Fetch homepage section settings
  const { data: statsSetting } = useQuery<{ key: string; value: string } | null>({
    queryKey: ['/api/settings/show_stats'],
  });
  
  const { data: testimonialsSetting } = useQuery<{ key: string; value: string } | null>({
    queryKey: ['/api/settings/show_testimonials'],
  });
  
  const { data: brandsSetting } = useQuery<{ key: string; value: string } | null>({
    queryKey: ['/api/settings/show_featured_brands'],
  });
  
  // Initialize homepage section toggles
  useEffect(() => {
    if (statsSetting?.value !== undefined) {
      setShowStats(statsSetting.value !== "false");
    }
  }, [statsSetting]);
  
  useEffect(() => {
    if (testimonialsSetting?.value !== undefined) {
      setShowTestimonials(testimonialsSetting.value === "true");
    }
  }, [testimonialsSetting]);
  
  useEffect(() => {
    if (brandsSetting?.value !== undefined) {
      setShowFeaturedBrands(brandsSetting.value === "true");
    }
  }, [brandsSetting]);
  
  // Update local state when setting is loaded
  useEffect(() => {
    if (!initialized && teamEmailsSetting?.value) {
      try {
        const emails = JSON.parse(teamEmailsSetting.value) as string[];
        setTeamEmails(emails);
        setInitialized(true);
      } catch {
        setTeamEmails([]);
        setInitialized(true);
      }
    }
  }, [teamEmailsSetting, initialized, setTeamEmails]);
  
  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      return apiRequest('POST', '/api/settings', {
        key: 'team_notification_emails',
        value: JSON.stringify(emails),
        description: 'Email addresses to receive internal lead notifications',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/team_notification_emails'] });
      toast({
        title: "Settings saved",
        description: "Team notification emails have been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving settings",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    },
  });
  
  // Save homepage section toggle
  const saveToggleMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: string; description: string }) => {
      return apiRequest('POST', '/api/settings', { key, value, description });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings/homepage'] });
      toast({
        title: "Setting updated",
        description: "Homepage section visibility has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving setting",
        description: error.message || "Failed to save setting",
        variant: "destructive",
      });
    },
  });
  
  const handleToggleStats = (checked: boolean) => {
    setShowStats(checked);
    saveToggleMutation.mutate({
      key: 'show_stats',
      value: String(checked),
      description: 'Show stats section on homepage',
    });
  };
  
  const handleToggleTestimonials = (checked: boolean) => {
    setShowTestimonials(checked);
    saveToggleMutation.mutate({
      key: 'show_testimonials',
      value: String(checked),
      description: 'Show testimonials section on homepage',
    });
  };
  
  const handleToggleFeaturedBrands = (checked: boolean) => {
    setShowFeaturedBrands(checked);
    saveToggleMutation.mutate({
      key: 'show_featured_brands',
      value: String(checked),
      description: 'Show featured brands section on homepage',
    });
  };
  
  const handleAddEmail = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (teamEmails.includes(email)) {
      toast({
        title: "Email exists",
        description: "This email is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    const updatedEmails = [...teamEmails, email];
    setTeamEmails(updatedEmails);
    setNewEmail("");
    saveMutation.mutate(updatedEmails);
  };
  
  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmails = teamEmails.filter(e => e !== emailToRemove);
    setTeamEmails(updatedEmails);
    saveMutation.mutate(updatedEmails);
  };
  
  return (
    <div className="space-y-6">
      {/* Homepage Section Visibility */}
      <Card className="glass-premium border-border/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-light">Homepage Sections</CardTitle>
          </div>
          <CardDescription>
            Control which optional sections are visible on the homepage. Enable these when you have content ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Stats</Label>
              <p className="text-sm text-muted-foreground">
                Show company stats section (20+ Years, 500+ Projects, etc.)
              </p>
            </div>
            <Switch
              checked={showStats}
              onCheckedChange={handleToggleStats}
              disabled={saveToggleMutation.isPending}
              data-testid="switch-show-stats"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Testimonials</Label>
              <p className="text-sm text-muted-foreground">
                Show client testimonials section on the homepage
              </p>
            </div>
            <Switch
              checked={showTestimonials}
              onCheckedChange={handleToggleTestimonials}
              disabled={saveToggleMutation.isPending}
              data-testid="switch-show-testimonials"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Featured Brands</Label>
              <p className="text-sm text-muted-foreground">
                Show scrolling brand logos between Testimonials and CTA
              </p>
            </div>
            <Switch
              checked={showFeaturedBrands}
              onCheckedChange={handleToggleFeaturedBrands}
              disabled={saveToggleMutation.isPending}
              data-testid="switch-show-brands"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Team Notification Emails */}
      <Card className="glass-premium border-border/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-light">Team Lead Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure email addresses to receive internal notifications when new moodboard leads are submitted. 
            These emails include full lead details: customer info, project details, selected products, brands, and finishes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Email Input */}
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter team member email..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
              className="flex-1"
              data-testid="input-team-email"
            />
            <Button 
              onClick={handleAddEmail}
              disabled={saveMutation.isPending}
              data-testid="button-add-email"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          
          {/* Email List */}
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading settings...</div>
          ) : teamEmails.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-border/40 rounded-lg">
              <Mail className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                No team emails configured. Add email addresses above to receive lead notifications.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Notifications will be sent to ({teamEmails.length} recipient{teamEmails.length > 1 ? 's' : ''}):
              </Label>
              <div className="flex flex-wrap gap-2">
                {teamEmails.map((email) => (
                  <Badge 
                    key={email} 
                    variant="secondary" 
                    className="px-3 py-1.5 text-sm"
                    data-testid={`badge-email-${email}`}
                  >
                    <Mail className="w-3 h-3 mr-2 opacity-70" />
                    {email}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEmail(email)} 
                      className="ml-2 hover:text-destructive transition-colors"
                      disabled={saveMutation.isPending}
                      data-testid={`button-remove-email-${email}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Info */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mt-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">What's included in notifications:</strong>
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• Lead type (Designer/Architect or Homeowner)</li>
              <li>• Contact information and project details</li>
              <li>• Homeowner qualification (property type, size, budget, timeline)</li>
              <li>• All selected products organized by category</li>
              <li>• Brands of interest with product counts</li>
              <li>• Links to spec sheets and manufacturer pages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
