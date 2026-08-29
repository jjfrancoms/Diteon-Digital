import React, { useEffect, useRef, useState } from 'react';
import { Reveal } from './ui/Reveal';
import { EvolutionArrow } from './ui/EvolutionArrow';

interface ComparisonRowProps {
  problemTitle: string;
  problemDesc: string;
  solutionTitle: string;
  solutionDesc: string;
  index: number;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({
  problemTitle,
  problemDesc,
  solutionTitle,
  solutionDesc,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const isPrimaryRow = index < 2;

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window)
    ) {
      setIsVisible(true);
      return;
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (rowRef.current) {
            observer.unobserve(rowRef.current);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -4% 0px',
      }
    );

    const currentEl = rowRef.current;

    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  return (
    <div
      ref={rowRef}
      className={`
        comparison-row
        ${isVisible ? 'is-visible' : ''}
        ${isPrimaryRow ? 'py-5 sm:py-6' : 'py-4 sm:py-5'}
        grid
        grid-cols-1
        items-center
        gap-4
        px-0
        md:grid-cols-12
        md:gap-6
      `}
      style={{
        transitionDelay: `${index * 45}ms`,
      }}
    >
      {/* =========================================================
          LEFT — PROBLEM
      ========================================================= */}
      <div
        className="
          comparison-problem
          space-y-1
          md:col-span-5
        "
      >
        <div className="flex items-start gap-2">
          <span
            className="
              material-symbols-outlined
              mt-0.5
              shrink-0
              text-[16px]
              text-[#FF6B35]
            "
            aria-hidden="true"
          >
            remove
          </span>

          <h3
            className={`
              font-['Space_Grotesk']
              leading-snug
              ${
                isPrimaryRow
                  ? 'text-[15px] font-bold text-[#14142B] sm:text-base'
                  : 'text-sm font-semibold text-[#14142B]/85 sm:text-[14px]'
              }
            `}
          >
            {problemTitle}
          </h3>
        </div>

        <p
          className={`
            pl-6
            font-['Inter']
            leading-relaxed
            ${
              isPrimaryRow
                ? 'text-xs text-[#14142B]/70 sm:text-[13px]'
                : 'text-xs text-[#14142B]/60'
            }
          `}
        >
          {problemDesc}
        </p>
      </div>

      {/* =========================================================
          CENTER — EVOLUTION ARROW
      ========================================================= */}
      <div
        className="
          hidden
          items-center
          justify-center
          md:col-span-2
          md:flex
        "
      >
        <EvolutionArrow />
      </div>

      {/* =========================================================
          RIGHT — SOLUTION
      ========================================================= */}
      <div
        className="
          comparison-solution
          space-y-1
          pt-1
          md:col-span-5
          md:pt-0
        "
      >
        <div className="flex items-start gap-2">
          <span
            className="
              material-symbols-outlined
              mt-0.5
              shrink-0
              text-[16px]
              text-[#1C6FE0]
            "
            aria-hidden="true"
          >
            check
          </span>

          <h3
            className={`
              font-['Space_Grotesk']
              leading-snug
              ${
                isPrimaryRow
                  ? 'text-[15px] font-bold text-[#14142B] sm:text-base'
                  : 'text-sm font-semibold text-[#14142B] sm:text-[14px]'
              }
            `}
          >
            {solutionTitle}
          </h3>
        </div>

        <p
          className={`
            pl-6
            font-['Inter']
            leading-relaxed
            ${
              isPrimaryRow
                ? 'text-xs text-[#14142B]/80 sm:text-[13px]'
                : 'text-xs text-[#14142B]/70'
            }
          `}
        >
          {solutionDesc}
        </p>
      </div>
    </div>
  );
};

export const ProblemSolution: React.FC = () => {
  const comparisons = [
    {
      problemTitle: 'Múltiples hojas de cálculo dispersas',
      problemDesc:
        'Información desactualizada en archivos locales que no se sincronizan en tiempo real.',
      solutionTitle: 'Base de datos centralizada y segura',
      solutionDesc:
        'Un único punto de verdad con permisos por rol y acceso inmediato desde cualquier sucursal.',
    },
    {
      problemTitle: 'Descuadres de stock e inventario',
      problemDesc:
        'Diferencias constantes entre existencias físicas y registros al no descontar ventas en vivo.',
      solutionTitle: 'Control de inventario en tiempo real',
      solutionDesc:
        'Descuento automático por cada transacción y alertas oportunas de reposición crítica.',
    },
    {
      problemTitle: 'Seguimiento de clientes olvidado',
      problemDesc:
        'Cotizaciones y mensajes perdidos en chats personales sin trazabilidad ni historial.',
      solutionTitle: 'Pipeline comercial y CRM estructurado',
      solutionDesc:
        'Historial completo de clientes, etapas de venta y recordatorios de cotizaciones pendientes.',
    },
    {
      problemTitle: 'Cierres de caja manuales y lentos',
      problemDesc:
        'Horas cuadrando comprobantes en papel y calculando subtotales manualmente.',
      solutionTitle: 'Cobro ágil y arqueo de caja automático',
      solutionDesc:
        'Cálculo instantáneo por medio de pago (efectivo, tarjeta, transferencias) y reportes de turno.',
    },
    {
      problemTitle: 'Falta de visibilidad para decidir',
      problemDesc:
        'Dificultad para conocer la rentabilidad real de cada producto y el estado de la operación.',
      solutionTitle: 'Dashboard operativo con métricas en vivo',
      solutionDesc:
        'Márgenes, volumen de ventas y rendimiento disponibles en tiempo real para tomar decisiones.',
    },
  ];

  return (
    <section
      id="problema-solucion"
      className="
        relative
        border-b
        border-[#14142B]/8
        bg-white
        py-14
        lg:py-18
      "
    >
      <div className="content-shell">
        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div
          className="
            mb-10
            grid
            grid-cols-1
            items-end
            gap-6
            text-left
            lg:mb-14
            lg:grid-cols-12
            lg:gap-10
          "
        >
          <div className="space-y-2 lg:col-span-7">
            <Reveal direction="left" delay={0}>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  font-['Inter']
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#1C6FE0]
                "
              >
                <span
                  className="h-0.5 w-5 bg-[#1C6FE0]"
                  aria-hidden="true"
                />

                <span>Transformación Operativa</span>
              </div>

              <h2
                className="
                  font-['Space_Grotesk']
                  text-2xl
                  font-extrabold
                  leading-[1.12]
                  tracking-tight
                  text-[#14142B]
                  sm:text-3xl
                  lg:text-[40px]
                "
              >
                De procesos desordenados a una operación conectada.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pb-1">
            <Reveal direction="right" delay={80}>
              <p
                className="
                  font-['Inter']
                  text-sm
                  leading-relaxed
                  text-[#14142B]/70
                  sm:text-base
                "
              >
                Comparamos la operación tradicional fragmentada frente
                al control estructurado y trazable que entrega DITEON.
              </p>
            </Reveal>
          </div>
        </div>

        {/* =========================================================
            COMPARISON
        ========================================================= */}
        <div>
          {/* COLUMN HEADERS */}
          <div
            className="
              grid
              grid-cols-1
              gap-4
              border-b
              border-[#14142B]/15
              pb-3.5
              text-left
              md:grid-cols-12
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                md:col-span-5
              "
            >
              <span
                className="
                  material-symbols-outlined
                  text-[15px]
                  text-[#FF6B35]
                "
                aria-hidden="true"
              >
                history
              </span>

              <span
                className="
                  font-['Inter']
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#14142B]/60
                "
              >
                Operación tradicional
              </span>
            </div>

            <div
              className="
                hidden
                items-center
                justify-center
                md:col-span-2
                md:flex
              "
            >
              <span
                className="
                  font-mono
                  text-[11px]
                  uppercase
                  tracking-widest
                  text-[#14142B]/40
                "
              >
                Evolución
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                md:col-span-5
              "
            >
              <span
                className="
                  material-symbols-outlined
                  text-[15px]
                  text-[#1C6FE0]
                "
                aria-hidden="true"
              >
                verified
              </span>

              <span
                className="
                  font-['Inter']
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#1C6FE0]
                "
              >
                Con DITEON a medida
              </span>
            </div>
          </div>

          {/* ROWS */}
          <div
            className="
              divide-y
              divide-[#14142B]/8
              text-left
            "
          >
            {comparisons.map((row, index) => (
              <ComparisonRow
                key={row.problemTitle}
                index={index}
                problemTitle={row.problemTitle}
                problemDesc={row.problemDesc}
                solutionTitle={row.solutionTitle}
                solutionDesc={row.solutionDesc}
              />
            ))}
          </div>

          {/* =========================================================
              BOTTOM TRANSITION
          ========================================================= */}
          <Reveal direction="up" delay={120}>
            <div
              className="
                mt-8
                flex
                flex-col
                items-center
                justify-between
                gap-4
                border-t
                border-[#14142B]/12
                pt-6
                text-left
                font-['Inter']
                sm:flex-row
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    material-symbols-outlined
                    text-[20px]
                    text-[#1C6FE0]
                  "
                >
                  bolt
                </span>

                <span
                  className="
                    font-['Space_Grotesk']
                    text-xs
                    font-bold
                    text-[#14142B]
                    sm:text-sm
                  "
                >
                  Software diseñado alrededor de tu operación
                </span>
              </div>

              <a
                href="#soluciones"
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  font-['Inter']
                  text-xs
                  font-bold
                  text-[#1C6FE0]
                  transition-colors
                  hover:text-[#155ec4]
                "
              >
                <span>Explorar soluciones</span>

                <span className="material-symbols-outlined text-[16px]">
                  arrow_downward
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};