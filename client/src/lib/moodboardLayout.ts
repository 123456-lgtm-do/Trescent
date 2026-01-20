import type { Product } from "@shared/schema";

export interface LayoutSlot {
  product: Product;
  gridColumn: string;
  gridRow: string;
}

export function detectOrientation(aspectRatio: number): 'landscape' | 'portrait' | 'square' {
  if (aspectRatio > 1.2) return 'landscape';
  if (aspectRatio < 0.8) return 'portrait';
  return 'square';
}

function getProductOrientation(product: Product): 'landscape' | 'portrait' | 'square' {
  // Use stored orientation if available
  if (product.orientation) {
    return product.orientation as 'landscape' | 'portrait' | 'square';
  }
  
  // Fallback: compute from aspectRatio if available
  if (product.aspectRatio) {
    const ratio = parseFloat(product.aspectRatio);
    if (!isNaN(ratio)) {
      return detectOrientation(ratio);
    }
  }
  
  // Default to square
  return 'square';
}

export function resolveMoodboardLayout(products: Product[]): LayoutSlot[] {
  if (products.length === 0) return [];

  const slots: LayoutSlot[] = [];
  
  // Process all products (not just first 9)
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const orientation = getProductOrientation(product);

    if (i === 0) {
      // Hero layout (first product)
      if (orientation === 'landscape') {
        // Landscape hero: full width, 2 rows tall
        slots.push({
          product,
          gridColumn: 'span 3',
          gridRow: 'span 2'
        });
      } else if (orientation === 'portrait') {
        // Portrait hero: 1 column, 2 rows tall
        slots.push({
          product,
          gridColumn: 'span 1',
          gridRow: 'span 2'
        });
      } else {
        // Square hero: 2 columns, 2 rows
        slots.push({
          product,
          gridColumn: 'span 2',
          gridRow: 'span 2'
        });
      }
    } else {
      // Remaining products - smart layout based on orientation
      if (orientation === 'landscape') {
        // Landscape: 2 columns wide, 1 row tall
        slots.push({
          product,
          gridColumn: 'span 2',
          gridRow: 'span 1'
        });
      } else if (orientation === 'portrait') {
        // Portrait: 1 column wide, 2 rows tall  
        slots.push({
          product,
          gridColumn: 'span 1',
          gridRow: 'span 2'
        });
      } else {
        // Square: 1 column, 1 row
        slots.push({
          product,
          gridColumn: 'span 1',
          gridRow: 'span 1'
        });
      }
    }
  }

  return slots;
}
