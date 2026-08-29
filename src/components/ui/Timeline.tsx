import React, { useEffect, useRef, useState } from 'react';

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  badge?: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className = '' }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScrollProgress(1);
      return;
    }

    let ticking = false;

    const calculateProgress = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const triggerPoint = viewportHeight * 0.6;
      const totalHeight = rect.height;
      const currentScroll = triggerPoint - rect.top;

      let progress = currentScroll / totalHeight;
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateProgress);
        ticking = true;
      }
    };

    calculateProgress();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <div ref={timelineRef} className={`relative max-w-3xl mx-auto ${className}`}>
      
      {/* Central Spine (Desktop >= md) */}
      <div 
        className="hidden md:block absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-[#14142B]/12 overflow-hidden" 
        aria-hidden="true" 
      >
        <div 
          className="w-full bg-[#1C6FE0] transition-all duration-150 ease-out"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Left Spine (Mobile < md) */}
      <div 
        className="md:hidden absolute top-3 bottom-3 left-4 -translate-x-1/2 w-0.5 bg-[#14142B]/12 overflow-hidden" 
        aria-hidden="true" 
      >
        <div 
          className="w-full bg-[#1C6FE0] transition-all duration-150 ease-out"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Step Items */}
      <div className="space-y-4 md:space-y-6">
        {steps.map((step, index) => {
          const stepThreshold = steps.length > 1 ? index / (steps.length - 1) : 0;
          const isReached = scrollProgress >= stepThreshold - 0.05;
          const isEven = index % 2 === 0; // 0 (01), 2 (03), 4 (05) on left, 1 (02), 3 (04) on right

          return (
            <div key={step.number} className="relative">
              
              {/* MOBILE LAYOUT (< md): Left aligned with spine on left */}
              <div className="flex md:hidden items-start gap-3.5 pl-0.5 text-left w-full">
                <div 
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[11px] font-['Space_Grotesk'] shrink-0 z-10 border transition-colors duration-300 ${
                    isReached 
                      ? 'bg-[#1C6FE0] text-white border-[#1C6FE0]' 
                      : 'bg-[#14142B] text-white border-[#14142B]'
                  }`}
                >
                  {step.number}
                </div>
                <div className="space-y-0.5 flex-1">
                  {step.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C6FE0] font-['Inter'] block">
                      {step.badge}
                    </span>
                  )}
                  <h4 className="text-[14px] font-bold text-[#14142B] font-['Space_Grotesk'] leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#14142B]/75 leading-relaxed font-['Inter']">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* DESKTOP LAYOUT (>= md): Alternating 50/50 with central spine node */}
              <div className="hidden md:grid grid-cols-12 gap-3 items-center w-full">
                
                {/* LEFT CONTENT (Cols 1-5) */}
                <div className="col-span-5 text-right">
                  {isEven ? (
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[11px] font-mono text-[#14142B]/40 font-semibold">
                          Paso {step.number}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C6FE0]/40" aria-hidden="true" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C6FE0] font-['Inter']">
                          {step.badge}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-[#14142B] font-['Space_Grotesk'] leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#14142B]/75 leading-relaxed font-['Inter'] ml-auto max-w-xs">
                        {step.description}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* CENTER SPINE NODE (Cols 6-7) */}
                <div className="col-span-2 flex items-center justify-center z-10">
                  <div 
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[11px] font-['Space_Grotesk'] border transition-colors duration-300 select-none shadow-sm ${
                      isReached
                        ? 'bg-[#1C6FE0] text-white border-[#1C6FE0]'
                        : 'bg-[#14142B] text-white border-[#14142B]'
                    }`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* RIGHT CONTENT (Cols 8-12) */}
                <div className="col-span-5 text-left">
                  {!isEven ? (
                    <div className="space-y-1 pl-3">
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C6FE0] font-['Inter']">
                          {step.badge}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C6FE0]/40" aria-hidden="true" />
                        <span className="text-[11px] font-mono text-[#14142B]/40 font-semibold">
                          Paso {step.number}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-[#14142B] font-['Space_Grotesk'] leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#14142B]/75 leading-relaxed font-['Inter'] mr-auto max-w-xs">
                        {step.description}
                      </p>
                    </div>
                  ) : null}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
