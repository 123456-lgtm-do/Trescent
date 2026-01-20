export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient gradient orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-3xl ambient-bg-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-15%] w-[1000px] h-[1000px] rounded-full blur-3xl ambient-bg-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(100, 100, 255, 0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[40%] left-[30%] w-[600px] h-[600px] rounded-full blur-3xl ambient-bg-orb-3"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 200, 0.1) 0%, transparent 70%)',
        }}
      />
      
      {/* Subtle noise texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
