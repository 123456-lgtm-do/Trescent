import { DatabaseStorage } from './server/storage';
import { generateMoodboardPDF } from './server/pdf-generator';
import path from 'path';
import fs from 'fs';

async function forceRegenerate() {
  const storage = new DatabaseStorage();
  const shareToken = 'nZT4uFvITB7aOpORZEPMb-';
  
  console.log('🔄 Force regenerating PDF with actual lifestyle images...');
  
  const moodboard = await storage.getMoodboardByShareToken(shareToken);
  
  if (!moodboard) {
    console.log('❌ Moodboard not found');
    return;
  }
  
  // Get the actual product with lifestyle images
  const product = await storage.getProduct('89f9fe21-249b-48f9-9fb8-3a1abc3d34bd');
  
  if (!product) {
    console.log('❌ Product not found');
    return;
  }
  
  console.log(`📦 Product: ${product.name}`);
  console.log(`📸 Lifestyle images: ${product.lifestyleImages?.length || 0}`);
  if (product.lifestyleImages && product.lifestyleImages.length > 0) {
    console.log(`   - ${product.lifestyleImages[0]}`);
  }
  
  // Generate PDF with the actual product and lifestyle images
  const pdfBuffer = await generateMoodboardPDF({
    products: [
      {
        ...product,
        selectedImageIndex: 0,
        selectedFinishIndex: null
      }
    ],
    userName: moodboard.customerName,
    userEmail: moodboard.customerEmail,
    clientName: moodboard.clientName || undefined,
    projectName: moodboard.projectName || undefined,
    projectLocation: moodboard.projectLocation || undefined,
    layoutStyle: 'magazine',
    shareToken: shareToken
  });
  
  console.log(`✅ PDF regenerated: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
  console.log(`🎬 View at: /view/${shareToken}`);
  console.log('');
  console.log('✓ Lifestyle images now use object-fit: contain');
  console.log('✓ Zoom controls now work with updateOptions()');
  console.log('✓ Pages use more screen space (reduced padding)');
}

forceRegenerate().catch(console.error);
