# Trescent Lifestyles - Luxury Tech Design Guidelines

## Design Approach: Crypto-Tech Glass Morphism

This website embraces a sophisticated, luxurious tech aesthetic inspired by premium fintech and crypto platforms. Deep blacks, electric blues, and cyan accents create a mature, masculine mood that appeals to ultra-high-net-worth individuals seeking best-in-class intelligent home solutions.

**Core Design Principles:**
- Deep black backgrounds (#050911) with subtle dark blues
- Electric blue (cyan-400) to indigo-600 gradient accents
- Glass morphism with heavy backdrop blur on translucent panels
- Minimal, sophisticated layouts emphasizing intelligence and precision
- Crypto-tech inspired with Replit-level polish

## Typography

**Font Selection:** Use Google Fonts
- Primary: 'Inter' or 'Poppins' (modern, clean sans-serif)
- Accent/Headings: Can use same font with varied weights

**Hierarchy:**
- Hero Headline: text-5xl to text-7xl, font-bold (700)
- Section Headings: text-3xl to text-4xl, font-semibold (600)
- Subheadings: text-xl to text-2xl, font-medium (500)
- Body Text: text-base to text-lg, font-normal (400)
- Small Text/Labels: text-sm, font-normal (400)

## Layout System

**Spacing Strategy:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: p-6, p-8, p-12
- Section spacing: py-16, py-20, py-24
- Element gaps: gap-4, gap-6, gap-8
- Margin between sections: mb-12, mb-16, mb-20

**Container Strategy:**
- Full-width sections with inner max-w-7xl containers
- Glass cards: max-w-md to max-w-2xl depending on content
- Content max-width: max-w-6xl for main content areas

## Component Library

### Navigation
Glass navbar with backdrop blur, fixed or sticky positioning, semi-transparent background with soft border-b. Include logo, navigation links, and CTA button (also glass-styled).

### Hero Section
Large viewport section (80-90vh) with layered glass panels. Feature:
- Large background image (specified in Images section)
- Overlapping glass cards containing headline and CTA
- Frosted glass effect on all overlay elements
- Buttons on glass should have their own backdrop blur

### Glass Cards
Primary content containers with:
- Backdrop blur effect (heavy blur)
- Semi-transparent background
- Subtle border (1px)
- Rounded corners (rounded-2xl to rounded-3xl)
- Soft shadow for elevation
- Padding: p-6 to p-12 depending on size

### Buttons
Two button styles:
- Primary Glass Button: Backdrop blur, semi-transparent, soft border, rounded-full or rounded-xl
- Secondary Glass Button: More transparent, outlined style with glass effect

### Feature Sections
Use 2-3 column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) with individual glass cards for each feature. Each card includes icon area, heading, and description.

### Content Sections
Alternating layouts with glass panels:
- Text + Glass Card combinations
- Floating glass containers over gradient backgrounds
- Staggered/offset glass panels for visual interest

### Footer
Glass-styled footer with backdrop blur, multiple columns for links, newsletter signup in glass input field, social icons.

## Images

**Hero Image:**
Yes - Large, high-quality abstract/gradient background image for hero section. Should be vibrant but not overwhelming, allowing glass overlays to stand out. Suggested themes: abstract gradients, bokeh effects, soft colorful blurs, or technological/digital aesthetics.

**Supporting Images:**
- Section backgrounds: Abstract gradient images or subtle textures behind glass panels
- Feature icons: Use icon library (Heroicons or Lucide) within glass circles
- Content imagery: Product shots, mockups, or abstract visuals placed within glass cards

**Image Treatment:**
All images behind glass elements should have subtle blur or opacity to ensure glass effect remains prominent.

## Animations

**Approach:** Minimal but fluid
- Smooth transitions on hover (transition-all duration-300)
- Gentle float animations on glass cards (subtle translateY)
- Fade-in animations on scroll for glass elements entering viewport
- Ripple effect on button clicks (optional)
- Smooth backdrop blur transitions

**Avoid:** Excessive motion, spinning elements, aggressive animations that break the sophisticated aesthetic.

## Page Structure

1. **Glass Navigation** - Fixed/sticky header
2. **Hero Section** - Large viewport with layered glass panels and background image
3. **Features Grid** - 3-column glass cards showcasing key features
4. **Content Section 1** - Glass panel with text and supporting visual
5. **Content Section 2** - Offset glass cards in 2-column layout
6. **Testimonials** - Horizontal glass cards or single large glass carousel
7. **CTA Section** - Centered glass card with prominent call-to-action
8. **Footer** - Multi-column glass footer with links and newsletter

**Total Sections:** 8 comprehensive sections creating a complete, polished experience.

## Glass Effect Implementation Notes

- All primary containers use backdrop blur
- Maintain consistent transparency levels across similar components
- Layer glass elements intentionally for depth
- Use subtle shadows to enhance floating effect
- Borders should be barely visible, adding definition without harshness

This design creates a modern, sophisticated web experience that fully embraces the Liquid Glass UI aesthetic while maintaining excellent usability and visual hierarchy.