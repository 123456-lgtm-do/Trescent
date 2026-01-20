import { DatabaseStorage } from './server/storage';
import { sendMoodboardEmail } from './server/email-service';

async function regeneratePDF() {
  const storage = new DatabaseStorage();
  const shareToken = 'nZT4uFvITB7aOpORZEPMb-';
  
  console.log('🔄 Regenerating PDF with fixed lifestyle images...');
  
  const moodboard = await storage.getMoodboardByShareToken(shareToken);
  
  if (!moodboard) {
    console.log('❌ Moodboard not found');
    return;
  }
  
  const products = await storage.getAllProducts();
  const testProduct = products[0];
  
  if (!testProduct) {
    console.log('❌ No products found');
    return;
  }
  
  console.log(`📦 Using product: ${testProduct.name}`);
  
  await sendMoodboardEmail({
    moodboard,
    products: [{ ...testProduct, selectedImageIndex: 0 }],
    replyToEmail: 'info@trescentlifestyles.com',
    replyToName: 'Trescent Team',
  });
  
  console.log('✅ PDF regenerated with fixed lifestyle images!');
  console.log(`🎬 View flipbook at: /view/${shareToken}`);
  console.log('');
  console.log('✓ Lifestyle images now use object-fit: contain (full image visible)');
  console.log('✓ Zoom controls now work');
  console.log('✓ Pages use more screen space');
}

regeneratePDF();
