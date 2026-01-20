import { DatabaseStorage } from './server/storage';
import { sendMoodboardEmail } from './server/email-service';

function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createTestMoodboard() {
  const storage = new DatabaseStorage();
  const shareToken = generateShareToken();
  
  console.log('🧪 Creating test moodboard with updated PDF generation...');
  
  const moodboard = await storage.createMoodboard({
    userName: 'Test User - Updated',
    userEmail: 'harshul@trescent.in',
    userType: 'homeowner',
    clientName: null,
    projectName: 'Test Project - NEW PDF',
    projectLocation: null,
    projectDetails: null,
    sendToDesigner: false,
    designerEmail: null,
    designerName: null,
    propertyType: null,
    propertySize: null,
    projectTimeline: null,
    budgetRange: null,
    primaryInterests: ['Complete Automation'],
    productData: JSON.stringify([]),
    shareToken,
  });
  
  console.log(`✅ Moodboard created: ${moodboard.id}`);
  console.log(`🔗 Share Token: ${shareToken}`);
  
  // Get a real product from database
  const products = await storage.getAllProducts();
  const testProduct = products[0];
  
  if (!testProduct) {
    console.log('❌ No products found in database');
    return;
  }
  
  console.log(`📦 Using product: ${testProduct.name} (${testProduct.brand})`);
  
  await sendMoodboardEmail({
    moodboard,
    products: [{ ...testProduct, selectedImageIndex: 0 }],
    replyToEmail: 'info@trescentlifestyles.com',
    replyToName: 'Trescent Team',
  });
  
  console.log('✅ Email sent!');
  console.log(`🎬 View flipbook at: /view/${shareToken}`);
  console.log(`📧 Check email: harshul@trescent.in`);
  console.log('');
  console.log('This PDF has:');
  console.log('  ✓ Full lifestyle images (object-fit: contain)');
  console.log('  ✓ Larger flipbook pages');
  console.log('  ✓ Working zoom controls');
}

createTestMoodboard();
