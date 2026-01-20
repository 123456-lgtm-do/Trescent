# Trescent Lifestyles - PDF Theme Guide

**Purpose:** Design specifications for PDF outputs to ensure brand consistency across applications.

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Electric Cyan** | `#00C8FF` | `rgb(0, 200, 255)` | Primary accent, headings, links, CTAs |
| **Deep Navy** | `#0A1120` | `rgb(10, 17, 32)` | Primary background |
| **Navy Mid** | `#0D1528` | `rgb(13, 21, 40)` | Secondary background |
| **Slate 100** | `#E2E8F0` | `rgb(226, 232, 240)` | Primary text |
| **Slate 400** | `#94A3B8` | `rgb(148, 163, 184)` | Secondary text, descriptions |
| **Slate 500** | `#64748B` | `rgb(100, 116, 139)` | Labels, muted text |
| **Slate 600** | `#475569` | `rgb(71, 85, 105)` | Separators, subtle elements |

### Transparent Overlays

| Name | Value | Usage |
|------|-------|-------|
| Card Background | `rgba(15, 23, 42, 0.6)` | Product cards, info sections |
| Lighter Card | `rgba(15, 23, 42, 0.4)` | Info sections |
| Glass Border | `rgba(0, 200, 255, 0.15)` | Card borders |
| Strong Border | `rgba(0, 200, 255, 0.3)` | Active borders, dividers |
| Glow Effect | `rgba(0, 200, 255, 0.15)` | Blur circles, highlights |
| Grid Pattern | `rgba(0, 200, 255, 0.05)` | Background grid lines |

---

## Typography

### Font Families

```css
/* Primary - Body text, descriptions */
font-family: 'Inter', sans-serif;

/* Secondary - Headings, brand elements */
font-family: 'Poppins', sans-serif;
```

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap');
```

### Font Weights & Sizes

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Magazine Title | Poppins | 300 | 64px | `#00C8FF` |
| Category Title | Poppins | 300 | 28px | `#00C8FF` |
| Product Name | Inter | 300 | 22px | `#E2E8F0` |
| Subtitle | Inter | 400 | 18px | `#94A3B8` |
| Body Text | Inter | 300 | 14px | `#94A3B8` |
| Product Link | Inter | 400 | 13px | `#00C8FF` |
| Labels | Inter | 500 | 11px | `#64748B` |
| Tags | Inter | 400 | 9px | `#94A3B8` |
| Brand Badge | Inter | 600 | 13px | `#0A1120` |
| Footer | Inter | 400 | 11px | `#64748B` |

### Letter Spacing

| Element | Spacing |
|---------|---------|
| Magazine Title | 8px |
| Subtitle (Uppercase) | 4px |
| Brand Name | 1px |
| Labels (Uppercase) | 0.5px |

---

## Background Styling

### Main Background Gradient

```css
background: linear-gradient(135deg, #0A1120 0%, #0D1528 50%, #0A1120 100%);
```

### Grid Pattern Overlay

```css
background-image: 
  linear-gradient(rgba(0, 200, 255, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 200, 255, 0.05) 1px, transparent 1px);
background-size: 40px 40px;
opacity: 0.3;
```

### Blur Glow Effects

**Top-Right Glow:**
```css
.bg-blur-top {
  position: absolute;
  top: 0;
  right: 0;
  width: 384px;
  height: 384px;
  background: rgba(0, 200, 255, 0.15);
  border-radius: 50%;
  filter: blur(120px);
}
```

**Bottom-Left Glow:**
```css
.bg-blur-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 384px;
  height: 384px;
  background: rgba(100, 200, 255, 0.08);
  border-radius: 50%;
  filter: blur(120px);
}
```

---

## Component Styling

### Glass Card

```css
.glass-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 200, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Info Section

```css
.info-section {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 24px;
}
```

### Brand Badge (Accent)

```css
.brand-badge {
  background: rgba(0, 200, 255, 0.95);
  color: #0A1120;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid rgba(0, 200, 255, 0.3);
}
```

### AURA Badge

```css
.aura-badge {
  background: rgba(0, 200, 255, 0.15);
  color: #00C8FF;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 1px solid rgba(0, 200, 255, 0.3);
}
```

### Category Divider

```css
.category-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 300;
  color: #00C8FF;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(0, 200, 255, 0.3);
  letter-spacing: 0.5px;
}
```

### Tag/Chip

```css
.tag {
  font-size: 9px;
  color: #94A3B8;
  background: rgba(15, 23, 42, 0.5);
  padding: 2px 6px;
  border-radius: 3px;
}
```

### Link Style

```css
.link {
  color: #00C8FF;
  text-decoration: none;
  font-size: 13px;
  border-bottom: 1px solid transparent;
}

.link:hover {
  border-bottom-color: #00C8FF;
}
```

---

## Page Layouts

### A4 Page Setup

```css
@page {
  size: A4;
  margin: 0;
}

.page {
  width: 210mm;
  height: 297mm;
  padding: 25px 35px;
  page-break-after: always;
  overflow: hidden;
}
```

### Standard Layout Padding

```css
body {
  padding: 48px 60px 80px 60px;
}
```

### Cover Page (Magazine)

```css
.cover-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px 50px;
  background: radial-gradient(circle at top right, rgba(0, 200, 255, 0.08) 0%, transparent 70%);
}
```

---

## Footer Styling

```css
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

/* "Powered by AURA" text */
.footer-aura {
  color: #00C8FF;
  font-weight: 500;
}
```

### Footer Content

```
TRESCENT LIFESTYLES • Architectural Intelligence       Powered by AURA
```

---

## Image Styling

### Product Image Container

```css
.product-image {
  width: 100%;
  height: 480px;
  object-fit: contain;
  object-position: center;
  background: rgba(15, 23, 42, 0.3);
  padding: 48px;
}
```

### Lifestyle Image (Full Page)

```css
.lifestyle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.lifestyle-caption {
  position: absolute;
  bottom: 50px;
  left: 30px;
  right: 30px;
  background: rgba(10, 17, 32, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 10px;
  padding: 12px 20px;
}
```

---

## System Icons (SVG)

All icons use:
```css
stroke: #00C8FF;
stroke-width: 1.5;
fill: none;
```

### Icon Definitions (24x24 viewBox)

**Lighting Control:**
```html
<path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 3 2 5 2 8h8c0-3 2-5 2-8a6 6 0 0 0-6-6z"/>
<path d="M10 17v1a2 2 0 0 0 4 0v-1"/>
```

**Shading/Blinds:**
```html
<rect x="3" y="3" width="18" height="18" rx="1"/>
<line x1="3" y1="9" x2="21" y2="9"/>
<line x1="3" y1="15" x2="21" y2="15"/>
```

**Climate Control:**
```html
<path d="M12 2v20M12 6l-2-2M12 6l2-2M12 10l-3-3M12 10l3-3M12 14l-3 3M12 14l3 3M12 18l-2 2M12 18l2 2"/>
```

**Audio Systems:**
```html
<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
<path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
```

**Home Theater:**
```html
<rect x="2" y="3" width="20" height="14" rx="2"/>
<line x1="8" y1="21" x2="16" y2="21"/>
<line x1="12" y1="17" x2="12" y2="21"/>
```

**Security:**
```html
<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
```

**Complete Automation:**
```html
<rect x="4" y="4" width="16" height="16" rx="2"/>
<circle cx="9" cy="9" r="1.5" fill="#00C8FF"/>
<circle cx="15" cy="9" r="1.5" fill="#00C8FF"/>
<circle cx="9" cy="15" r="1.5" fill="#00C8FF"/>
<circle cx="15" cy="15" r="1.5" fill="#00C8FF"/>
```

**Outdoor/Sun:**
```html
<circle cx="12" cy="12" r="5"/>
<line x1="12" y1="1" x2="12" y2="3"/>
<line x1="12" y1="21" x2="12" y2="23"/>
<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
<line x1="1" y1="12" x2="3" y2="12"/>
<line x1="21" y1="12" x2="23" y2="12"/>
<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
```

---

## Icon Box Styling

```css
.icon-box {
  width: 70px;
  height: 70px;
  border: 1.5px solid rgba(0, 200, 255, 0.5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 200, 255, 0.03);
}

.icon-box.active {
  border-color: rgba(0, 200, 255, 0.8);
  background: rgba(0, 200, 255, 0.08);
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.15);
}

.icon-box svg {
  width: 32px;
  height: 32px;
  stroke: #00C8FF;
  stroke-width: 1.5;
  fill: none;
}
```

---

## Quick Reference: CSS Variables

```css
:root {
  /* Primary */
  --color-primary: #00C8FF;
  --color-primary-rgb: 0, 200, 255;
  
  /* Backgrounds */
  --bg-deep: #0A1120;
  --bg-mid: #0D1528;
  --bg-card: rgba(15, 23, 42, 0.6);
  --bg-card-light: rgba(15, 23, 42, 0.4);
  
  /* Text */
  --text-primary: #E2E8F0;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --text-separator: #475569;
  
  /* Borders */
  --border-subtle: rgba(0, 200, 255, 0.15);
  --border-medium: rgba(0, 200, 255, 0.3);
  --border-muted: rgba(100, 116, 139, 0.2);
  
  /* Effects */
  --glow-primary: rgba(0, 200, 255, 0.15);
  --glow-secondary: rgba(100, 200, 255, 0.08);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
  --blur-standard: blur(16px);
  --blur-heavy: blur(24px);
  
  /* Spacing */
  --page-padding: 48px 60px 80px 60px;
  --card-padding: 24px;
  --card-radius: 16px;
  --badge-radius: 8px;
}
```

---

## Brand Text

| Element | Text |
|---------|------|
| Company Name | TRESCENT LIFESTYLES |
| Tagline | Architectural Intelligence |
| AI Platform | Powered by AURA |
| AI Badge | AURA |

---

*Use this guide to maintain visual consistency across all PDF-generating applications.*
