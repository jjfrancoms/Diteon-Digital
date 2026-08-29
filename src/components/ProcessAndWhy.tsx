import React from 'react';
import { Timeline, TimelineStep } from './ui/Timeline';
import { Reveal } from './ui/Reveal';
import { TechnologyItem, TechnologyType } from './ui/TechnologyItem';

export const ProcessAndWhy: React.FC = () => {
  const steps: TimelineStep[] = [
    {
      number: '01',
      title: 'Entendemos tu negocio',
      description: 'Analizamos cómo operas hoy, tus cuellos de botella reales y los objetivos que necesitas resolver sin tecnicismos.',
      badge: 'Diagnóstico'
    },
    {
      number: '02',
      title: 'Diseñamos la solución',
      description: 'Definimos la arquitectura, pantallas clave y flujos exactos de información para validar contigo antes de programar.',
      badge: 'Arquitectura'
    },
    {
      number: '03',
      title: 'Desarrollo ágil',
      description: 'Construimos con código limpio, bases de datos seguras y entregas funcionales continuas para tu revisión.',
      badge: 'Sprint'
    },
    {
      number: '04',
      title: 'Implementación y capacitación',
      description: 'Ponemos el sistema en marcha en tu negocio, migramos datos iniciales y capacitamos a tu equipo paso a paso.',
      badge: 'Lanzamiento'
    },
    {
      number: '05',
      title: 'Soporte y evolución',
      description: 'Te acompañamos con soporte técnico cercano y añadimos nuevas mejoras conforme tu operación crezca.',
      badge: 'Continuidad'
    }
  ];

  interface TechEntry {
    name: string;
    tech: TechnologyType;
    category?: string;
  }

  // Strictly ordered stack: Core Development -> Backend & Data -> Integrations & Infrastructure
  const techStack: TechEntry[] = [
    { name: 'React', tech: { kind: 'brand', brand: 'react' }, category: 'FRONTEND' },
    { name: 'Next.js', tech: { kind: 'brand', brand: 'nextjs' }, category: 'FRAMEWORK' },
    { name: 'TypeScript', tech: { kind: 'brand', brand: 'typescript' }, category: 'LANGUAGE' },
    { name: 'Tailwind CSS', tech: { kind: 'brand', brand: 'tailwind' }, category: 'STYLING' },
    { name: 'Node.js', tech: { kind: 'brand', brand: 'nodejs' }, category: 'BACKEND' },
    { name: 'PostgreSQL', tech: { kind: 'brand', brand: 'postgresql' }, category: 'DATABASE' },
    { name: 'Supabase', tech: { kind: 'brand', brand: 'supabase' }, category: 'BACKEND / DATABASE' },
    { name: 'REST APIs', tech: { kind: 'system', iconName: 'api' }, category: 'INTEGRATION' },
    { name: 'WhatsApp API', tech: { kind: 'brand', brand: 'whatsapp' }, category: 'MESSAGING' },
    { name: 'Cloud Hosting', tech: { kind: 'system', iconName: 'cloud' }, category: 'INFRASTRUCTURE' }
  ];

  return (
    <section 
      id="proceso" 
      className="py-14 lg:py-18 bg-[#F7F7F5] relative border-b border-[#14142B]/8"
    >
      <div className="page-shell">
        
        {/* Editorial Section Header: Left Heading + Right Supporting Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-8 lg:mb-10 text-left">
          <div className="lg:col-span-7 space-y-2">
            <Reveal direction="left" delay={0}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C6FE0] font-['Inter']">
                <span className="w-5 h-0.5 bg-[#1C6FE0]" aria-hidden="true" />
                <span>Metodología</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#14142B] tracking-tight font-['Space_Grotesk'] leading-[1.12]">
                Cómo trabajamos.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pb-1">
            <Reveal direction="right" delay={80}>
              <p className="text-sm sm:text-base text-[#14142B]/70 font-['Inter'] leading-relaxed">
                Antes de programar, entendemos tu operación real, diseñamos la arquitectura y validamos cada avance con entregas continuas.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Process Timeline Block with tight narrow container */}
        <div className="narrow-shell mb-10 lg:mb-12">
          <Timeline steps={steps} />
        </div>

        {/* Why DITEON Section (Hierarchical Open Grid - Principal Guarantee + 3 Engineering Deliverables) */}
        <div className="content-shell pt-10 border-t border-[#14142B]/10">
          <div className="text-left mb-8 max-w-2xl">
            <Reveal direction="up" delay={0}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C6FE0] font-['Inter'] mb-1">
                <span className="w-4 h-0.5 bg-[#1C6FE0]" aria-hidden="true" />
                <span>Garantías de ingeniería</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#14142B] font-['Space_Grotesk'] tracking-tight">
                Entregables concretos y soberanía total sobre tu tecnología.
              </h3>
            </Reveal>
          </div>

          {/* Differentiators Grid with Strict Hierarchy */}
          <div className="space-y-8 text-left font-['Inter']">
            
            {/* PRINCIPAL GUARANTEE: Editorial Declaration */}
            <div className="border-l-2 border-[#1C6FE0] pl-5 sm:pl-7 py-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#1C6FE0] font-['Inter']">
                    Postura fundamental
                  </div>
                  <h4 className="font-extrabold text-xl sm:text-2xl text-[#14142B] font-['Space_Grotesk'] leading-[1.2]">
                    Propiedad total del código y de tus bases de datos.
                  </h4>
                  <div className="text-sm font-semibold text-[#14142B]/90 font-['Space_Grotesk'] pt-0.5">
                    Tu software y tus datos son 100% de tu empresa.
                  </div>
                </div>
                
                <div className="lg:col-span-7 space-y-2 lg:pt-1">
                  <p className="text-xs sm:text-sm text-[#14142B]/80 leading-relaxed">
                    Entregamos la propiedad formal del repositorio de código fuente, esquemas de bases de datos y accesos administrativos directos. Sin modelos cautivos, cobros por usuario ni comisiones sobre tus transacciones.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#14142B]">
                    <span className="material-symbols-outlined text-[16px] text-[#1C6FE0]">check_circle</span>
                    <span>Acuerdos de confidencialidad y cesión de derechos por contrato.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 SECONDARY ENGINEERING DELIVERABLES (Asymmetrical Editorial Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-6 pt-2">
              
              {/* Secondary 1: Technical Documentation (md:col-span-4) */}
              <div className="md:col-span-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#1C6FE0]" aria-hidden="true">
                    menu_book
                  </span>
                  <h4 className="font-bold text-[15px] text-[#14142B] font-['Space_Grotesk']">
                    Documentación técnica completa
                  </h4>
                </div>
                <p className="text-xs text-[#14142B]/75 leading-relaxed pl-6.5 max-w-sm">
                  Diagramas de arquitectura, especificaciones de APIs y manuales operativos para que tu equipo opere con total autonomía.
                </p>
              </div>

              {/* Secondary 2: Secure Infrastructure (md:col-span-4) */}
              <div className="md:col-span-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#7B61FF]" aria-hidden="true">
                    lock
                  </span>
                  <h4 className="font-bold text-[15px] text-[#14142B] font-['Space_Grotesk']">
                    Despliegue en infraestructura segura
                  </h4>
                </div>
                <p className="text-xs text-[#14142B]/75 leading-relaxed pl-6.5 max-w-xs">
                  Configuración de servidores dedicados, copias de seguridad automatizadas y cifrado de datos según estándares de la industria.
                </p>
              </div>

              {/* Secondary 3: Scalable Architecture (md:col-span-4) */}
              <div className="md:col-span-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#1C6FE0]" aria-hidden="true">
                    code
                  </span>
                  <h4 className="font-bold text-[15px] text-[#14142B] font-['Space_Grotesk']">
                    Arquitectura limpia y escalable
                  </h4>
                </div>
                <p className="text-xs text-[#14142B]/75 leading-relaxed pl-6.5">
                  Estructurado en TypeScript y bases de datos relacionales preparadas para crecer en volumen sin reescribir el sistema.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Marquee Tech Stack Strip with Official SVGs, Hierarchy and Hover Pause */}
        <div className="mt-10 pt-6 border-t border-[#14142B]/10 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#14142B]/50 mb-3 font-['Inter']">
            Tecnologías y estándares con los que construimos
          </div>
          
          <div className="relative overflow-hidden w-full max-w-5xl mx-auto py-2">
            <div className="marquee-track flex items-center gap-10 sm:gap-12 lg:gap-14 w-max">
              {[...techStack, ...techStack].map((item, idx) => (
                <TechnologyItem
                  key={idx}
                  tech={item.tech}
                  name={item.name}
                  category={item.category}
                  size="md"
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
