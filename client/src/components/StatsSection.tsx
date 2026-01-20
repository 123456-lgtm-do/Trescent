import { useQuery } from "@tanstack/react-query";
import { Calendar, Building, Users, Star, Award, Globe, Zap, Shield } from "lucide-react";
import type { Stat } from "@shared/schema";

const iconMap: Record<string, any> = {
  Calendar,
  Building,
  Users,
  Star,
  Award,
  Globe,
  Zap,
  Shield,
};

const defaultStats = [
  { id: "default-1", label: "Years of Excellence", value: "20+", description: "Pioneering smart home integration", icon: "Calendar" },
  { id: "default-2", label: "Projects Completed", value: "500+", description: "Luxury residences worldwide", icon: "Building" },
  { id: "default-3", label: "Premium Partners", value: "50+", description: "World-class brands", icon: "Users" },
  { id: "default-4", label: "Client Satisfaction", value: "99%", description: "Five-star service", icon: "Star" },
];

export default function StatsSection() {
  const { data: cmsStats = [] } = useQuery<Stat[]>({
    queryKey: ["/api/cms/stats", { active: true }],
  });

  const stats = cmsStats && cmsStats.length > 0 ? cmsStats : defaultStats;

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Trusted Excellence
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light">
            Two decades of transforming luxury living through intelligent integration
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon || "Star"] || Star;
            
            return (
              <div
                key={stat.id || index}
                className="glass-heavy border border-primary/20 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group hover-elevate"
                data-testid={`stat-card-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-cyan-400" />
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-2" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  
                  <div className="text-sm md:text-base font-medium text-foreground mb-1" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </div>
                  
                  {stat.description && (
                    <div className="text-xs md:text-sm text-muted-foreground font-light" data-testid={`stat-description-${index}`}>
                      {stat.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
