# PDF Generator Setup Guide

**For: Replit Agent**  
**Purpose:** Set up an identical PDF generator using Puppeteer with Trescent Lifestyles branding

---

## 1. Install Dependencies

Install these packages:

```bash
npm install puppeteer sharp
```

Or if using the Replit packager:
- `puppeteer` - Headless Chrome for PDF generation
- `sharp` - Image processing (AVIF → JPEG conversion)

---

## 2. Create PDF Generator File

Create `server/pdf-generator.ts` with this structure:

```typescript
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description?: string;
  imageUrl: string;
  specSheetUrl?: string;
  tags?: string[];
  imageType?: 'close-up' | 'lifestyle';
  lifestyleImages?: string[];
}

interface ProductWithDataUri extends Product {
  imageDataUri: string;
  lifestyleImageDataUris?: string[];
}

// Convert image URL to base64 data URI
async function imageToDataUri(imageUrl: string): Promise<string> {
  try {
    // Handle local files
    if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
      const absolutePath = path.join(process.cwd(), imageUrl.replace(/^\//, ''));
      if (fs.existsSync(absolutePath)) {
        let buffer = fs.readFileSync(absolutePath);
        let mimeType = 'image/png';
        
        const ext = path.extname(absolutePath).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.webp') mimeType = 'image/webp';
        else if (ext === '.avif') {
          // Convert AVIF to JPEG using Sharp
          buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
          mimeType = 'image/jpeg';
        }
        
        return `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
    }
    
    // Handle remote URLs
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // Convert AVIF to JPEG
    if (contentType.includes('avif') || imageUrl.toLowerCase().endsWith('.avif')) {
      buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
    
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Error converting image to data URI:', imageUrl, error);
    // Return placeholder SVG
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzBBMTEyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NDc0OEIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  }
}

// Main PDF generation function
export async function generateMoodboardPDF(
  products: Product[],
  layoutStyle: 'standard' | 'magazine' = 'magazine',
  userName?: string,
  userEmail?: string,
  clientName?: string,
  projectName?: string,
  projectLocation?: string,
  primaryInterests: string[] = [],
  shareToken?: string
): Promise<string> {
  
  // Convert all product images to data URIs
  const productsWithDataUris: ProductWithDataUri[] = await Promise.all(
    products.map(async (product) => {
      const imageDataUri = await imageToDataUri(product.imageUrl);
      
      // Also convert lifestyle images if present
      let lifestyleImageDataUris: string[] = [];
      if (product.lifestyleImages && product.lifestyleImages.length > 0) {
        lifestyleImageDataUris = await Promise.all(
          product.lifestyleImages.map(url => imageToDataUri(url))
        );
      }
      
      return {
        ...product,
        imageDataUri,
        lifestyleImageDataUris
      };
    })
  );

  // Generate HTML based on layout style
  const html = layoutStyle === 'magazine' 
    ? generateMagazineHTML(productsWithDataUris, userName, userEmail, clientName, projectName, projectLocation, primaryInterests)
    : generateStandardHTML(productsWithDataUris, userName, userEmail, clientName, projectName, projectLocation);

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Create PDF output directory
    const pdfDir = path.join(process.cwd(), 'private', 'moodboard-pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Generate filename
    const filename = shareToken 
      ? `moodboard-${shareToken}.pdf`
      : `moodboard-${Date.now()}.pdf`;
    const filepath = path.join(pdfDir, filename);

    // Generate PDF
    await page.pdf({
      path: filepath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return filepath;
  } finally {
    await browser.close();
  }
}
```

---

## 3. HTML Template Functions

### Standard Layout

```typescript
function generateStandardHTML(
  products: ProductWithDataUri[],
  userName?: string,
  userEmail?: string,
  clientName?: string,
  projectName?: string,
  projectLocation?: string
): string {
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, ProductWithDataUri[]>);

  const categories = Object.keys(productsByCategory).sort();
  const formatDate = () => new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${getBaseStyles()}
        </style>
      </head>
      <body>
        <div class="bg-pattern"></div>
        <div class="bg-blur-top"></div>
        <div class="bg-blur-bottom"></div>
        
        <div class="content">
          <!-- Header -->
          <div class="header">
            <div class="brand">
              <h1>TRESCENT LIFESTYLES</h1>
              <span class="badge">AURA</span>
            </div>
            <div class="date">${formatDate()}</div>
          </div>

          <!-- Client Info -->
          ${(clientName || projectName) ? `
            <div class="info-section">
              <div class="info-grid">
                ${clientName ? `<div class="info-item"><span class="info-label">Prepared For</span><span class="info-value">${clientName}</span></div>` : ''}
                ${projectName ? `<div class="info-item"><span class="info-label">Project</span><span class="info-value">${projectName}</span></div>` : ''}
                ${projectLocation ? `<div class="info-item"><span class="info-label">Location</span><span class="info-value">${projectLocation}</span></div>` : ''}
                ${userName ? `<div class="info-item"><span class="info-label">Designed By</span><span class="info-value">${userName}</span></div>` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Products by Category -->
          ${categories.map(category => `
            <div class="category-section">
              <h2 class="category-title">${category}</h2>
              <div class="products-grid">
                ${productsByCategory[category].map(product => `
                  <div class="product-card">
                    <div class="product-image-container" style="position: relative;">
                      <img src="${product.imageDataUri}" class="product-image" alt="${product.name}" />
                      <div class="product-brand">${product.brand}</div>
                    </div>
                    <div class="product-info">
                      <div class="product-name">${product.name}</div>
                      ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
                      ${product.specSheetUrl ? `<a href="${product.specSheetUrl}" class="product-link">View Specifications →</a>` : ''}
                      ${product.tags && product.tags.length > 0 ? `
                        <div class="product-tags">
                          ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Footer -->
          <div class="footer">
            <div class="footer-brand">
              <span>TRESCENT LIFESTYLES</span>
              <span style="color: #475569;">•</span>
              <span>Architectural Intelligence</span>
            </div>
            <div class="footer-aura">Powered by AURA</div>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

---

## 4. Base CSS Styles

```typescript
function getBaseStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Poppins:wght@300;400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0A1120 0%, #0D1528 50%, #0A1120 100%);
      color: #E2E8F0;
      padding: 48px 60px 80px 60px;
      position: relative;
    }
    
    a {
      text-decoration: none;
      color: inherit;
    }
    
    .bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(0, 200, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 200, 255, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.3;
      z-index: 0;
    }
    
    .bg-blur-top {
      position: absolute;
      top: 0;
      right: 0;
      width: 384px;
      height: 384px;
      background: rgba(0, 200, 255, 0.15);
      border-radius: 50%;
      filter: blur(120px);
      z-index: 0;
    }
    
    .bg-blur-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 384px;
      height: 384px;
      background: rgba(100, 200, 255, 0.08);
      border-radius: 50%;
      filter: blur(120px);
      z-index: 0;
    }
    
    .content {
      position: relative;
      z-index: 10;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 32px;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand h1 {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 300;
      letter-spacing: 1px;
      color: #E2E8F0;
    }
    
    .brand .badge {
      background: rgba(0, 200, 255, 0.15);
      color: #00C8FF;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.5px;
      border: 1px solid rgba(0, 200, 255, 0.3);
    }
    
    .date {
      font-size: 12px;
      color: #94A3B8;
      font-weight: 300;
    }
    
    .info-section {
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(100, 116, 139, 0.2);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .info-label {
      font-size: 11px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    
    .info-value {
      font-size: 15px;
      color: #E2E8F0;
      font-weight: 300;
    }
    
    .category-section {
      margin-bottom: 64px;
      page-break-before: auto;
      page-break-inside: avoid;
    }
    
    .category-title {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 300;
      color: #00C8FF;
      margin: 0 0 32px 0;
      padding-bottom: 16px;
      border-bottom: 2px solid rgba(0, 200, 255, 0.3);
      letter-spacing: 0.5px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      margin-bottom: 48px;
    }
    
    .product-card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(0, 200, 255, 0.15);
      border-radius: 16px;
      overflow: hidden;
      break-inside: avoid;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .product-image-container {
      position: relative;
    }
    
    .product-image {
      width: 100%;
      height: 480px;
      object-fit: contain;
      object-position: center;
      background: rgba(15, 23, 42, 0.3);
      padding: 48px;
    }
    
    .product-brand {
      position: absolute;
      top: 24px;
      right: 24px;
      background: rgba(0, 200, 255, 0.95);
      color: #0A1120;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .product-info {
      padding: 24px 32px;
      background: rgba(15, 23, 42, 0.5);
      border-top: 1px solid rgba(0, 200, 255, 0.1);
    }
    
    .product-name {
      font-size: 22px;
      font-weight: 300;
      color: #E2E8F0;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    
    .product-description {
      font-size: 14px;
      color: #94A3B8;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    
    .product-link {
      font-size: 13px;
      color: #00C8FF;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
    }
    
    .product-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }
    
    .product-tag {
      font-size: 9px;
      color: #94A3B8;
      background: rgba(15, 23, 42, 0.5);
      padding: 2px 6px;
      border-radius: 3px;
    }
    
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 200, 255, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748B;
    }
    
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .footer-aura {
      color: #00C8FF;
      font-weight: 500;
    }
  `;
}
```

---

## 5. Magazine Layout (Multi-Page)

For magazine-style PDFs with cover page and page breaks:

```typescript
function generateMagazineHTML(
  products: ProductWithDataUri[],
  userName?: string,
  userEmail?: string,
  clientName?: string,
  projectName?: string,
  projectLocation?: string,
  primaryInterests: string[] = []
): string {
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, ProductWithDataUri[]>);

  const categories = Object.keys(productsByCategory).sort();
  const formatDate = () => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Trescent Moodboard - Magazine Edition</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0A1120 0%, #0D1528 50%, #0A1120 100%);
            color: #E2E8F0;
          }
          
          .page {
            width: 210mm;
            height: 297mm;
            padding: 25px 35px;
            page-break-after: always;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          
          /* Cover Page */
          .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 60px 50px;
            background: radial-gradient(circle at top right, rgba(0, 200, 255, 0.08) 0%, transparent 70%);
          }
          
          .magazine-title {
            font-family: 'Poppins', sans-serif;
            font-size: 64px;
            font-weight: 300;
            color: #00C8FF;
            letter-spacing: 8px;
            margin-bottom: 24px;
            text-transform: uppercase;
          }
          
          .magazine-subtitle {
            font-size: 18px;
            color: #94A3B8;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 48px;
          }
          
          .cover-info {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(0, 200, 255, 0.2);
            border-radius: 12px;
            padding: 32px;
            max-width: 500px;
          }
          
          .cover-info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(100, 116, 139, 0.2);
          }
          
          .cover-info-row:last-child {
            border-bottom: none;
          }
          
          .cover-info-label {
            font-size: 12px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .cover-info-value {
            font-size: 14px;
            color: #E2E8F0;
            font-weight: 400;
          }
          
          /* Category Page */
          .category-page {
            padding: 40px;
          }
          
          .category-header {
            margin-bottom: 30px;
          }
          
          .category-name {
            font-family: 'Poppins', sans-serif;
            font-size: 36px;
            font-weight: 300;
            color: #00C8FF;
            margin-bottom: 8px;
          }
          
          .category-divider {
            height: 2px;
            background: linear-gradient(90deg, rgba(0, 200, 255, 0.8) 0%, rgba(0, 200, 255, 0.1) 100%);
          }
          
          /* Footer on each page */
          .page-footer {
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid rgba(0, 200, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #64748B;
          }
          
          ${getBaseStyles()}
        </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="page cover-page">
          <div class="magazine-title">MOODBOARD</div>
          <div class="magazine-subtitle">Architectural Intelligence</div>
          
          <div class="cover-info">
            ${projectName ? `
              <div class="cover-info-row">
                <span class="cover-info-label">Project</span>
                <span class="cover-info-value">${projectName}</span>
              </div>
            ` : ''}
            ${clientName ? `
              <div class="cover-info-row">
                <span class="cover-info-label">Client</span>
                <span class="cover-info-value">${clientName}</span>
              </div>
            ` : ''}
            ${projectLocation ? `
              <div class="cover-info-row">
                <span class="cover-info-label">Location</span>
                <span class="cover-info-value">${projectLocation}</span>
              </div>
            ` : ''}
            <div class="cover-info-row">
              <span class="cover-info-label">Date</span>
              <span class="cover-info-value">${formatDate()}</span>
            </div>
          </div>
        </div>

        <!-- Category Pages -->
        ${categories.map((category, categoryIndex) => `
          <div class="page category-page">
            <div class="category-header">
              <div class="category-name">${category}</div>
              <div class="category-divider"></div>
            </div>
            
            <div class="products-grid">
              ${productsByCategory[category].map(product => `
                <div class="product-card">
                  <div class="product-image-container">
                    <img src="${product.imageDataUri}" class="product-image" alt="${product.name}" />
                    <div class="product-brand">${product.brand}</div>
                  </div>
                  <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="page-footer">
              <span>TRESCENT LIFESTYLES • Architectural Intelligence</span>
              <span>Page ${categoryIndex + 2}</span>
            </div>
          </div>
        `).join('')}

        <!-- Closing Page -->
        <div class="page" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <div style="margin-bottom: 40px;">
            <div style="font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 300; color: #00C8FF; margin-bottom: 16px;">
              Ready to Begin?
            </div>
            <div style="font-size: 16px; color: #94A3B8; max-width: 400px;">
              Schedule a consultation with our team to bring your smart home vision to life.
            </div>
          </div>
          
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(0, 200, 255, 0.2); border-radius: 12px; padding: 24px 40px;">
            <div style="font-size: 14px; color: #E2E8F0; margin-bottom: 8px;">sales-team@trescent.in</div>
            <div style="font-size: 14px; color: #94A3B8;">+91-93723-45545</div>
          </div>
          
          <div style="margin-top: 60px; font-size: 11px; color: #64748B;">
            <span style="color: #00C8FF; font-weight: 500;">Powered by AURA</span>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

---

## 6. API Route Example

```typescript
import { generateMoodboardPDF } from './pdf-generator';

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { 
      products, 
      layoutStyle = 'magazine',
      userName,
      userEmail,
      clientName,
      projectName,
      projectLocation,
      primaryInterests = []
    } = req.body;

    // Generate unique share token
    const shareToken = crypto.randomBytes(16).toString('hex');

    // Generate PDF
    const pdfPath = await generateMoodboardPDF(
      products,
      layoutStyle,
      userName,
      userEmail,
      clientName,
      projectName,
      projectLocation,
      primaryInterests,
      shareToken
    );

    res.json({ 
      success: true, 
      pdfPath,
      shareToken 
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});
```

---

## 7. Serving PDFs

```typescript
import express from 'express';
import path from 'path';

// Serve PDFs via token (secure)
app.get('/api/pdf/:token', (req, res) => {
  const { token } = req.params;
  const pdfPath = path.join(process.cwd(), 'private', 'moodboard-pdfs', `moodboard-${token}.pdf`);
  
  if (fs.existsSync(pdfPath)) {
    res.sendFile(pdfPath);
  } else {
    res.status(404).json({ error: 'PDF not found' });
  }
});
```

---

## 8. Color Quick Reference

```css
/* Primary */
--electric-cyan: #00C8FF;

/* Backgrounds */
--deep-navy: #0A1120;
--navy-mid: #0D1528;
--card-bg: rgba(15, 23, 42, 0.6);

/* Text */
--text-primary: #E2E8F0;
--text-secondary: #94A3B8;
--text-muted: #64748B;

/* Borders */
--border-glow: rgba(0, 200, 255, 0.15);
--border-strong: rgba(0, 200, 255, 0.3);

/* Effects */
--shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
--blur: blur(16px);
```

---

## 9. Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

- **Inter** - Body text, descriptions
- **Poppins** - Headings, brand elements

---

## 10. Branding Text

| Element | Text |
|---------|------|
| Company | TRESCENT LIFESTYLES |
| Tagline | Architectural Intelligence |
| AI Platform | Powered by AURA |
| Contact Email | sales-team@trescent.in |
| Contact Phone | +91-93723-45545 |

---

*Copy this entire file to your project and adjust as needed.*
