# Trescent Lifestyles - Technical Stack Documentation

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Purpose:** Technical handoff documentation for IT maintenance providers

---

## Table of Contents

1. [Overview](#overview)
2. [Frontend Technologies](#frontend-technologies)
3. [Backend Technologies](#backend-technologies)
4. [Database](#database)
5. [External Services & APIs](#external-services--apis)
6. [Environment Variables](#environment-variables)
7. [Project Structure](#project-structure)
8. [Build & Development](#build--development)
9. [Hosting Requirements](#hosting-requirements)
10. [Deployment Considerations](#deployment-considerations)
11. [Key Features & Integrations](#key-features--integrations)
12. [Maintenance Notes](#maintenance-notes)

---

## Overview

Trescent Lifestyles is a luxury smart home website featuring:
- Interactive moodboard tool for product curation
- Magazine-style PDF generation with automated email delivery
- Heyzine flipbook integration for professional presentations
- Consultation booking system with lead capture
- Secure admin panel for product and content management
- Comprehensive CMS for managing website content

**Architecture:** Full-stack TypeScript application with React frontend, Express.js backend, and PostgreSQL database.

---

## Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 6.x | Build tool & development server |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| shadcn/ui | Latest | Component library (built on Radix UI) |
| TanStack Query | v5 | Server state management & data fetching |
| Wouter | Latest | Client-side routing |
| Framer Motion | Latest | Animation library |
| React Hook Form | Latest | Form state management |
| Zod | Latest | Schema validation |
| Lucide React | Latest | Icon library |
| React Icons | Latest | Additional icons (company logos) |
| Embla Carousel | Latest | Carousel/slider component |
| cmdk | Latest | Command palette component |
| react-pdf | Latest | PDF viewer (fallback for flipbooks) |

### Frontend Design System

- **Color Scheme:** Dark mode with deep navy backgrounds, electric cyan accents (#00C8FF)
- **Typography:** Inter, Poppins, DM Sans fonts
- **Design Pattern:** Glass morphism with backdrop blur effects
- **Responsive:** Mobile-first approach

---

## Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | JavaScript runtime |
| Express.js | 4.x | Web application framework |
| TypeScript | 5.x | Type-safe server code |
| Drizzle ORM | Latest | Type-safe database ORM |
| drizzle-zod | Latest | Zod schema generation from Drizzle |
| Puppeteer | Latest | Headless Chrome for PDF generation |
| Sharp | Latest | Image processing & format conversion |
| Multer | Latest | File upload handling |
| express-session | Latest | Session management |
| connect-pg-simple | Latest | PostgreSQL session store |
| Passport.js | Latest | Authentication middleware |

---

## Database

| Component | Technology |
|-----------|------------|
| Database Engine | PostgreSQL 14+ |
| Current Hosting | Neon Database (serverless) |
| Driver | @neondatabase/serverless |
| ORM | Drizzle ORM |
| Migration Tool | Drizzle Kit |

### Key Database Tables

| Table | Purpose |
|-------|---------|
| `products` | Product catalog with images, descriptions, finishes |
| `product_images` | Image library for products |
| `moodboards` | Saved moodboard configurations |
| `moodboard_items` | Products within moodboards |
| `consultations` | Consultation booking requests |
| `hero_slides` | CMS: Homepage carousel slides |
| `testimonials` | CMS: Client testimonials |
| `stats` | CMS: Numeric highlights |
| `brand_logos` | CMS: Partner/brand logos |
| `footer_links` | CMS: Footer navigation |
| `social_links` | CMS: Social media links |
| `nav_links` | CMS: Navigation menu items |
| `site_settings` | Key-value configuration store |
| `session` | Express session storage |

### Database Commands

```bash
# Push schema changes to database (safe sync)
npm run db:push

# Force push if data-loss warning appears
npm run db:push --force

# Open Drizzle Studio (database GUI)
npm run db:studio
```

---

## External Services & APIs

### Required Services

| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Resend** | Transactional email delivery | https://resend.com/docs |
| **Heyzine** | PDF to flipbook conversion | https://heyzine.com/api |
| **OpenAI** | AI product data extraction (GPT-4o-mini) | https://platform.openai.com |

### Optional Services

| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Photoroom** | Background removal (primary) | https://www.photoroom.com/api |
| **RemoveBG** | Background removal (fallback) | https://www.remove.bg/api |

### Service Notes

- **Heyzine:** Standard plan (€49/year) recommended for white-label branding
- **OpenAI:** Uses Vision API for image analysis
- **Resend:** Free tier allows 100 emails/day, paid plans for production

---

## Environment Variables

### Required Variables

```bash
# Database Connection
DATABASE_URL=postgresql://user:password@host:5432/database
PGHOST=hostname
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name

# Authentication & Security
ADMIN_PASSWORD=secure_admin_password
SESSION_SECRET=random_32_char_string

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
TRESCENT_REPLY_TO_EMAIL=sales-team@trescent.in

# AI Integration (OpenAI)
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# Flipbook Service (Heyzine)
HEYZINE_API_KEY=xxxxxxxxxxxx
HEYZINE_CLIENT_ID=xxxxxxxxxxxx
```

### Optional Variables

```bash
# Background Removal Services
PHOTOROOM_API_KEY=xxxxxxxxxxxx
REMOVEBG_API_KEY=xxxxxxxxxxxx

# Puppeteer (if custom Chromium path needed)
PUPPETEER_EXECUTABLE_PATH=/path/to/chromium

# Server Port (defaults to 5000)
PORT=5000
```

---

## Project Structure

```
/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── GlassNavbar.tsx
│   │   │   ├── CMSPanel.tsx
│   │   │   ├── ConsultationModal.tsx
│   │   │   └── ...
│   │   ├── pages/             # Route pages
│   │   │   ├── home.tsx
│   │   │   ├── moodboard.tsx
│   │   │   ├── admin.tsx
│   │   │   ├── showcase.tsx
│   │   │   └── ...
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities & helpers
│   │   └── App.tsx            # Main app with routing
│   └── index.html
│
├── server/                    # Backend Express application
│   ├── routes.ts              # All API endpoints
│   ├── storage.ts             # Database operations (IStorage interface)
│   ├── email-service.ts       # Resend email integration
│   ├── heyzine-service.ts     # Flipbook API integration
│   ├── pdf-generator.ts       # Puppeteer PDF creation
│   ├── vite.ts                # Vite dev server integration
│   └── index.ts               # Server entry point
│
├── shared/                    # Shared code (frontend & backend)
│   └── schema.ts              # Drizzle database schema & types
│
├── attached_assets/           # Uploaded & static assets
│   ├── products/              # Product images
│   ├── website/               # Static website assets
│   └── generated_images/      # AI-generated images
│
├── private/                   # Server-only files (not public)
│   └── moodboard-pdfs/        # Generated PDF files
│
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── drizzle.config.ts          # Drizzle ORM configuration
├── tsconfig.json              # TypeScript configuration
└── replit.md                  # Project documentation
```

---

## Build & Development

### Development

```bash
# Install dependencies
npm install

# Start development server (frontend + backend on port 5000)
npm run dev

# The server automatically restarts on file changes
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Database Operations

```bash
# Push schema changes to database
npm run db:push

# Force push (use with caution)
npm run db:push --force

# Open database GUI
npm run db:studio
```

---

## Hosting Requirements

### Minimum Server Specifications

| Resource | Requirement |
|----------|-------------|
| Node.js | v20.x or higher |
| RAM | 2GB minimum (PDF generation is memory-intensive) |
| CPU | 1 vCPU minimum, 2+ recommended |
| Storage | 10GB+ for images and PDFs |
| OS | Linux (Ubuntu 22.04 recommended) |

### System Dependencies

| Dependency | Purpose |
|------------|---------|
| Chromium/Chrome | Required for Puppeteer PDF generation |
| libvips | Required for Sharp image processing |

### Compatible Hosting Platforms

| Platform | Notes |
|----------|-------|
| Railway | Recommended - easy setup, includes Postgres |
| Render | Good option, auto-deploy from Git |
| DigitalOcean App Platform | Scalable, includes managed Postgres |
| AWS EC2 + RDS | Full control, more setup required |
| Heroku | Simple but more expensive |
| VPS (any) | Manual setup of Node, Postgres, Chromium |

### Puppeteer/Chromium Setup

For production servers, Chromium must be available. Options:

1. **System Chromium:**
   ```bash
   apt-get install chromium-browser
   export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

2. **Puppeteer bundled Chromium:**
   ```bash
   npm install puppeteer  # Downloads Chromium automatically
   ```

3. **Docker:** Use a Puppeteer-ready base image

---

## Deployment Considerations

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] PostgreSQL database provisioned and accessible
- [ ] Chromium installed for PDF generation
- [ ] Resend domain verified for email sending
- [ ] Heyzine account active (if using flipbooks)
- [ ] OpenAI API key with sufficient credits
- [ ] File storage configured (local or cloud)

### File Storage

Currently uses local filesystem. For scalable deployments:

| Current | Recommended for Scale |
|---------|----------------------|
| Local `/attached_assets/` | AWS S3, Cloudflare R2, or similar |
| Local `/private/moodboard-pdfs/` | S3 with signed URLs for security |

### Session Storage

Uses PostgreSQL for session storage (`connect-pg-simple`), enabling:
- Multiple server instances (load balancing)
- Session persistence across deploys

### SSL/HTTPS

- Required for production
- Most platforms (Railway, Render) include automatic SSL
- For VPS, use Let's Encrypt with Nginx reverse proxy

---

## Key Features & Integrations

### 1. Moodboard System

**Flow:**
1. User selects products from catalog
2. Saves moodboard with contact details
3. System generates magazine-style PDF (Puppeteer)
4. PDF converted to flipbook (Heyzine API)
5. Personalized email sent with flipbook link (Resend)
6. Lead data prepared for CRM (AURA backend)

### 2. PDF Generation

- Uses Puppeteer with headless Chromium
- Two layout styles: "standard" and "magazine"
- Includes product images, specs, and branding
- Stored in `/private/moodboard-pdfs/`

### 3. Flipbook Integration

- PDFs uploaded to Heyzine API
- Returns hosted flipbook URL
- Embedded via iframe on `/view/:token`
- Fallback to react-pdf if Heyzine fails

### 4. Email System

- Transactional emails via Resend
- Different templates for designers vs. homeowners
- PDF attachment with flipbook link
- Team notification emails for new leads

### 5. Admin Panel

- Password-protected (`/admin`)
- Product CRUD with image gallery
- Image library management
- Bulk operations (delete, background removal)
- CMS for all website content
- Settings for email notifications

### 6. CMS System

Managed content types:
- Hero slides (homepage carousel)
- Testimonials
- Stats/metrics
- Brand logos
- Footer links
- Social media links
- Navigation menu items

---

## Maintenance Notes

### Regular Tasks

| Task | Frequency | Notes |
|------|-----------|-------|
| Database backups | Daily | Use Neon/provider backup or pg_dump |
| Log monitoring | Weekly | Check for errors in PDF/email generation |
| Storage cleanup | Monthly | Remove orphaned PDFs and images |
| Dependency updates | Monthly | `npm update` and test thoroughly |
| SSL certificate | Auto-renewed | Most platforms handle this |

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| PDF generation fails | Check Chromium installation, increase memory |
| Emails not sending | Verify Resend API key, check domain verification |
| Flipbook conversion fails | Check Heyzine API quota, verify PDF accessibility |
| Images not uploading | Check disk space, verify multer configuration |
| Database connection fails | Check `DATABASE_URL`, verify network access |

### Monitoring Recommendations

- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track email delivery rates via Resend dashboard
- Set up uptime monitoring (UptimeRobot, Pingdom)

### Security Notes

- Admin password stored as environment variable
- Session secrets rotated periodically
- API keys never exposed to frontend
- PDFs stored in `/private/` (not publicly accessible)
- Share tokens use cryptographic randomness

---

## Support Contacts

| Service | Support |
|---------|---------|
| Resend | support@resend.com |
| Heyzine | support@heyzine.com |
| OpenAI | help.openai.com |
| Neon Database | support@neon.tech |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 2024 | Initial documentation |

---

*This document should be updated whenever significant changes are made to the technology stack or infrastructure.*
