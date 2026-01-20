import { useQuery } from "@tanstack/react-query";
import type { BrandLogo } from "@shared/schema";

import lutronLogo from "@assets/lutron-logo-black_1767704510151.png";
import crestronLogo from "@assets/Crestron-Logo-1536x864_1767704510151.png";
import basalteLogo from "@assets/Basalte_logo_2053242538_1767704510150.jpg";
import cseedLogo from "@assets/C-SEED-ENTERTAINMENT-SYSTEMS-GMBH-logo-637038570813282577_1767704510150.jpg";
import sonosLogo from "@assets/Sonos-Logo.wine_1767704510151.png";
import steinwayLogo from "@assets/Steinway-Lyngdorf-black-logo-on-two-lines_1767704510151.png";
import bwLogo from "@assets/B&W_logo_1767704510150.jpg";
import control4Logo from "@assets/control4-logo_1767704510150.png";
import marantzLogo from "@assets/Marantz-Logo.wine_1767704510151.png";
import somfyLogo from "@assets/Somfy_logo.svg_1767704510151.png";
import tosoLogo from "@assets/toso-logo_1767704510152.png";

const defaultBrands = [
  { id: "1", name: "Lutron", logoUrl: lutronLogo },
  { id: "2", name: "Crestron", logoUrl: crestronLogo },
  { id: "3", name: "Basalte", logoUrl: basalteLogo },
  { id: "4", name: "C SEED", logoUrl: null },
  { id: "5", name: "Sonos", logoUrl: sonosLogo },
  { id: "6", name: "Steinway Lyngdorf", logoUrl: steinwayLogo },
  { id: "7", name: "Bowers & Wilkins", logoUrl: null },
  { id: "8", name: "Control4", logoUrl: control4Logo },
  { id: "9", name: "Marantz", logoUrl: marantzLogo },
  { id: "10", name: "Somfy", logoUrl: somfyLogo },
  { id: "11", name: "TOSO", logoUrl: tosoLogo },
];

export default function FeaturedBrands() {
  const { data: cmsLogos = [] } = useQuery<BrandLogo[]>({
    queryKey: ["/api/cms/brand-logos?active=true"],
  });

  // Use CMS logos only if they have actual logo URLs, otherwise use defaults
  const cmsLogosWithUrls = cmsLogos.filter(b => b.active && b.logoUrl);
  const brands = cmsLogosWithUrls.length > 0 
    ? cmsLogosWithUrls.sort((a, b) => a.sortOrder - b.sortOrder)
    : defaultBrands;

  // Double the brands array for seamless infinite scroll
  const scrollBrands = [...brands, ...brands];

  return (
    <section className="py-12 md:py-16 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.2em] font-light">
            TRUSTED PARTNERS
          </p>
          <h2 className="text-5xl md:text-6xl font-light text-foreground tracking-tight">
            World-Class Brands
          </h2>
        </div>
      </div>

      {/* Infinite Scroll Marquee */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex animate-marquee">
          {scrollBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 mx-6 md:mx-10"
              data-testid={`brand-logo-${brand.id}`}
            >
              <div className="h-8 flex items-center justify-center group cursor-default">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-5 w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                ) : (
                  <span className="text-white/40 text-xs font-light tracking-[0.15em] group-hover:text-white/70 transition-colors duration-300 whitespace-nowrap">
                    {brand.name.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
