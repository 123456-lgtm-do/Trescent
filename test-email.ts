import { sendMoodboardEmail } from './server/email-service';

async function testEmail() {
  console.log('🧪 Testing email generation and delivery...');
  
  const testMoodboard = {
    id: 'test-id',
    userName: 'Test User',
    userEmail: 'harshul@trescent.in',
    userType: 'homeowner' as const,
    clientName: null,
    projectName: 'Test Project',
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
    productData: '[]',
    shareToken: 'test-token-' + Date.now(),
    createdAt: new Date(),
    auraProcessed: false,
    auraProcessedAt: null,
    crmStatus: null,
    crmNotes: null,
  };
  
  const testProducts = [
    {
      id: 'test-product-1',
      name: 'Sentido 2-Button',
      brand: 'Basalte',
      category: 'Lighting Control',
      description: 'Elegant lighting control keypad',
      images: ['/attached_assets/products/test.png'],
      imageType: 'close-up' as const,
      lifestyleImages: [],
      orientation: 'square' as const,
      aspectRatio: '1.0',
      sku: null,
      manufacturerUrl: 'https://basalte.be',
      specSheetUrl: 'https://basalte.be/en/product/sentido',
      tags: ['lighting'],
      hasVariants: false,
      featured: false,
      useCases: [],
      capabilities: [],
      roomTypes: [],
      priceTier: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      selectedImageIndex: 0,
    }
  ];
  
  try {
    await sendMoodboardEmail({
      moodboard: testMoodboard,
      products: testProducts,
      replyToEmail: 'info@trescentlifestyles.com',
      replyToName: 'Trescent Team',
    });
    console.log('✅ Test email sent successfully!');
    console.log('📧 Check harshul@trescent.in inbox (and spam folder)');
  } catch (error: any) {
    console.error('❌ Test email failed:', error.message);
  }
}

testEmail();
