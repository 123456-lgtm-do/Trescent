# Trescent Lifestyles - Smart Home Architectural Intelligence

## Overview

Trescent Lifestyles is a luxury smart home website showcasing **Architectural Intelligence**, a philosophy where technology seamlessly integrates with architecture. The site features premium smart home brands (Lutron, Crestron, Basalte, C SEED, Sonos, Steinway Lyngdorf) to create unified living experiences. The application boasts a modern, crypto-tech inspired design with glass morphism aesthetics, deep navy backgrounds, and electric blue accents. The backend business intelligence platform for smart home configuration and operations is named AURA, but "Architectural Intelligence" is the customer-facing philosophy. The project highlights significant achievements, including industry awards, large-scale installations, and a clientele of high-net-worth individuals and celebrities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript and Vite for fast development and optimized builds. UI components are built with shadcn/ui on Radix UI primitives, styled with Tailwind CSS, and feature a glass morphism design. State management and data fetching are handled by TanStack React Query, with custom configurations for caching. The design system uses Inter/Poppins typography, a consistent 4px spacing scale, and a dark mode-only fractalized navy color scheme with electric blue accents. Wouter is used for client-side routing.

### Backend Architecture

The backend is built with Express.js on Node.js and TypeScript, supporting both development (Vite integration) and production environments. It utilizes Drizzle ORM for PostgreSQL (via Neon Database serverless connection) with type-safe models validated by drizzle-zod. An in-memory storage fallback is available for testing. The API follows a RESTful pattern with `/api` prefixing and includes centralized route registration, an abstract storage interface, and request logging. OpenAI Vision API (GPT-4o-mini) is integrated for AI-powered product data extraction and image analysis, with automatic AVIF to JPEG conversion using Sharp.

### UI/UX Decisions

The design emphasizes a futuristic, crypto-tech aesthetic with a color scheme dominated by deep navy (`HSL(220, 45%, 8%)` to `HSL(220, 25%, 3%)`), contrasted with electric cyan/blue accents (`HSL(200, 100%, 60%)` - `#00C8FF`). Glass morphism effects with semi-transparent white overlays, backdrop blur (24-32px), and subtle white borders create depth. Gradients and glow effects use the electric cyan to provide a signature shimmer.

### Feature Specifications

- **AI-Powered Product Autofill**: Extracts product descriptions and tags from images using OpenAI Vision API. Includes AVIF image format conversion.
- **Admin Product Management**: Comprehensive CRUD operations for products at `/admin`, with a visual image gallery. Products are stored in a PostgreSQL database. Includes bulk delete functionality for cleaning up multiple products at once.
- **Image Library Management**: Separate tab in admin panel for managing raw uploaded images before they become products. Features include:
  - Grid view of all uploaded images with "In Use" badges for images assigned to products
  - Bulk selection with "Select All" checkbox
  - Bulk delete for removing unwanted images (especially useful after PDF extracts)
  - Bulk background removal for processing multiple product close-up images at once
  - Visual indicators showing which images are already used in products vs. available for new products
- **Product Image Type System**: Products can have either close-up images (product shots) or lifestyle images (in-use). Close-up products can optionally include lifestyle images that render as full-page spreads in generated PDFs, showing products in real-world settings after their detail pages.
- **Adaptive Moodboard Layout**: Dynamically adjusts layout based on image orientation (landscape, portrait, square), automatically detecting orientation and aspect ratio.
- **AI-Powered Showcase**: An interactive portfolio gallery at `/showcase` with natural language search capabilities using OpenAI GPT-4o-mini.
- **Photoroom Background Removal**: Integration for automatic background removal of product close-up images (manual selection to avoid processing lifestyle images).
- **Asset Repository**: Separated `attached_assets/website/` for static site assets and `attached_assets/products/` for product library images.
- **Moodboard Lead Capture System**: Complete lead qualification capturing designer/architect firms and homeowner prospects. Designer submissions include client/project details for firm CRM tracking. Homeowner submissions include property qualification fields. All data saved to PostgreSQL for AURA backend processing (PDF generation, email delivery, CRM integration with deduplication).
- **Luxury Product Detail Page**: Basalte-inspired detail pages at `/product/:id` with large hero images, horizontal finish selectors below the image, and smart finish display (images when available, text-only buttons as fallback). Fixed moodboard item structure ensures correct image display for all selected finishes.
- **Sectional Moodboard Organization (Phase 1)**: Products automatically grouped by category (Lighting Control, Audio Systems, Home Theater, etc.) with professional section headers and gradient dividers. Applied to both main moodboard view and preview/PDF modal. Foundation for Phase 2 (magazine-style presentation mode) and Phase 3 (PDF enhancements).
- **Automated Email Delivery**: Upon moodboard submission, the system automatically generates a personalized magazine-style PDF (with client/project details, products by category, spec sheet links, and grouped manufacturer links) and sends it via Resend email service. Emails include customizable reply-to address (`TRESCENT_REPLY_TO_EMAIL` env var) for direct prospect communication.
- **Interactive Flipbook Viewer with Heyzine Integration**: Professional magazine-style flipbook viewer at `/view/:token` with smooth page-turning animations. The system uses Heyzine API for professional flipbook hosting with automatic fallback to local PDF viewer. Key features:
  - **Heyzine Professional Flipbooks**: PDFs automatically converted to hosted Heyzine flipbooks with smooth animations
  - **White-Label Ready**: Heyzine Standard plan (€49/year) removes Heyzine branding and allows custom logo
  - **Embedded on Site**: Flipbooks displayed via iframe on Trescent website at `/view/:token`
  - **Automatic Fallback**: If Heyzine conversion fails, viewer displays PDF using react-pdf (rollback capability preserved)
  - **PDF Consistency**: Same magazine-style PDF sent via email is converted to flipbook
  - Secure shareable links with cryptographic tokens (stored in `share_token` column)
  - Download PDF button for offline access
  - Mobile-responsive with touch gestures
  - Path sanitization to prevent directory traversal attacks
- **AURA CRM Data Integration**: Structured data payload prepared for each moodboard submission including customer info (name, email, type, property details), architect/designer info (firm, client, project details), moodboard items organized by category as "Interests" fields, and activity logging ("moodboard_sent" timestamp). Ready for AURA backend CRM processing with lead tracking and deduplication.
- **Admin Settings Panel**: Settings tab in admin panel (`/admin`) for configuring system-wide preferences. Currently includes:
  - **Team Lead Notifications**: Configure email addresses to receive internal notifications when new moodboard leads are submitted. Notifications include full lead details: customer info, project details, selected products with finishes, brands of interest with product counts, and links to spec sheets.
  - Settings stored in PostgreSQL `site_settings` table with key/value pairs for flexible configuration storage.
- **CMS System**: Admin panel includes a "Content" tab for managing frequently-edited website content without code changes:
  - **Hero Slides**: Carousel images on the homepage with title, subtitle, CTA button, and image URL. Supports sort order and active/inactive toggle.
  - **Testimonials**: Client quotes with name, role, company, content, rating (1-5 stars), and avatar image. Featured flag for highlighting key testimonials.
  - **Stats**: Numeric highlights (e.g., "20+ Years", "500+ Projects") with label, value, optional description, and icon name.
  - **Brand Logos**: Partner/featured brand logos with name, image URL, website link, and category (partner, featured, certification).
  - **Footer Links**: Footer navigation links organized by category (Solutions, Partners, Company, Support). Each link has label, URL, sort order, and active toggle. Pre-populated with default links; Footer component fetches from CMS with fallback to hardcoded defaults.
  - All CMS content supports sort ordering and active/inactive toggle.
  - Frontend components (HeroSection, TestimonialsSection, Footer) fetch from CMS API with fallback to hardcoded defaults when CMS is empty.
  - Full Zod validation on all CMS API endpoints ensures data integrity.

## External Dependencies

- **Database**: PostgreSQL (via Neon Database), Drizzle ORM, drizzle-kit.
- **UI Libraries**: Radix UI, shadcn/ui, Embla Carousel, cmdk, Lucide React.
- **Form & Validation**: React Hook Form, Zod, @hookform/resolvers.
- **AI/Image Processing**: OpenAI Vision API, Sharp (for image conversion), Photoroom API (for background removal).
- **PDF Generation & Email**: Puppeteer (for headless browser PDF rendering), Resend (for transactional email delivery), Heyzine API (for professional flipbook hosting), react-pdf with pdfjs-dist (for fallback PDF viewer).
- **Styling**: Tailwind CSS, PostCSS, class-variance-authority (CVA), clsx, tailwind-merge.
- **Fonts**: Google Fonts (Inter, Poppins, DM Sans, Fira Code, Geist Mono).
- **Development Tools**: Vite, TypeScript, ESBuild.

## AURA Backend Integration

**Note: AURA is currently in Beta.** All email templates display a "BETA" badge next to AURA mentions to set appropriate expectations for users that the system is under active development.

The website automatically processes moodboard submissions with real-time email delivery and CRM data preparation:

### Automated Workflow (On Moodboard Submit)
1. **Save to Database**: Moodboard data stored in PostgreSQL `moodboards` table
2. **Generate PDF**: Puppeteer creates magazine-style PDF with client/project details, products by category, spec sheet links, and manufacturer links grouped by brand
3. **Send Email**: Resend delivers personalized email with PDF attachment (different templates for designers vs. homeowners), configurable reply-to address
4. **AURA CRM Payload**: Structured data prepared with:
   - **Customer Info**: name, email, type (designer/homeowner), property details (for homeowners)
   - **Architect Info**: firm, client name, project name/location/details (for designers)
   - **Interests**: Products organized by category (matching PDF sections)
   - **Activities**: "moodboard_sent" event with timestamp and details

### CRM Processing (Handled by AURA)
- **Designers** → Firms table (with deduplication by email/firm name)
- **Homeowners** → Leads table with qualification fields
- **Lead Management**: Status updates, follow-ups, sales pipeline tracking
- **Activity Logging**: Email sent, PDF delivered, follow-up scheduled

### Environment Variables
- `TRESCENT_REPLY_TO_EMAIL`: Reply-to address for moodboard emails (defaults to `info@trescentlifestyles.com`)

Database table `moodboards` includes fields for AURA processing status (`aura_processed`, `aura_processed_at`) and CRM tracking (`crm_status`, `crm_notes`).