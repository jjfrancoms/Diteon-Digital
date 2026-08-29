import React, { useEffect, useState } from 'react';
import { trackEvent } from '../services/analytics';
import { SolutionOptionValue } from './ContactModal';
import { Button } from './ui/Button';
import { TextLink } from './ui/TextLink';
import { Reveal } from './ui/Reveal';

interface HeroProps {
  onScrollTo: (id: string) => void;
  onOpenContact: (solution?: SolutionOptionValue) => void;
}

const SHOWCASE_INTERVAL_MS = 5000;

const showcaseProjects = [
  {
    src: '/images/showcase/diteon-pos-showcase.webp',
    alt: 'Interfaz del sistema POS desarrollado por DITEON',
  },
  {
    src: '/images/showcase/diteon-crm-showcase.webp',
    alt: 'Interfaz del sistema CRM desarrollado por DITEON',
  },
] as const;

export const Hero: React.FC<HeroProps> = ({
  onScrollTo,
  onOpenContact,
}) => {
  const [activeShowcase, setActiveShowcase] = useState(0);

  /*
   * Precarga todas las imágenes para evitar flashes
   * durante el cambio de proyecto.
   */
  useEffect(() => {
    showcaseProjects.forEach((project) => {
      const image = new Image();
      image.src = project.src;
    });
  }, []);

  /*
   * Cambio automático:
   *
   * POS
   * ↓
   * CRM
   * ↓
   * POS
   *
   * Sin controles visibles.
   */
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveShowcase((current) => {
        return (current + 1) % showcaseProjects.length;
      });
    }, SHOWCASE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handlePrimaryClick = () => {
    trackEvent('hero_cta_click', {
      source: 'hero_primary_button',
    });

    trackEvent('hero_contact_click', {
      source: 'hero_primary_button',
    });

    onOpenContact('otro');
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onScrollTo('soluciones');
  };

  const activeProject = showcaseProjects[activeShowcase];

  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden
        border-b
        border-[#14142B]/8
        bg-[#F7F7F5]
        pt-24
        pb-16
        sm:pt-28
        sm:pb-16
        lg:pt-32
        lg:pb-24
      "
    >
      <div className="page-shell">
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-12
            lg:grid-cols-12
            lg:gap-10
            xl:gap-14
          "
        >
          {/* =========================================================
              LEFT — VALUE PROPOSITION
          ========================================================= */}

          <div className="text-left lg:col-span-5">
            <div className="max-w-[610px]">

              <Reveal direction="up" delay={0}>
                <h1
                  className="
                    font-['Space_Grotesk']
                    text-3xl
                    font-extrabold
                    leading-[1.07]
                    tracking-tight
                    text-[#14142B]
                    sm:text-4xl
                    md:text-5xl
                    lg:text-[52px]
                    xl:text-[56px]
                  "
                >
                  Software a medida para ordenar, controlar y escalar tu
                  negocio.
                </h1>
              </Reveal>

              <Reveal direction="up" delay={70}>
                <p
                  className="
                    mt-7
                    max-w-[560px]
                    font-['Inter']
                    text-sm
                    leading-relaxed
                    text-[#14142B]/75
                    sm:text-base
                    lg:text-lg
                  "
                >
                  Diseñamos sistemas, automatizaciones y dashboards que
                  conectan tus procesos operativos para tomar mejores
                  decisiones y crecer con orden.
                </p>
              </Reveal>

              <Reveal direction="up" delay={170}>
                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    items-stretch
                    gap-4
                    sm:flex-row
                    sm:items-center
                  "
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePrimaryClick}
                    iconRight={
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    }
                  >
                    Hablemos de tu proyecto
                  </Button>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      px-2
                      sm:justify-start
                    "
                  >
                    <TextLink
                      href="#soluciones"
                      onClick={handleSecondaryClick}
                      variant="cta"
                    >
                      Ver cómo funciona
                    </TextLink>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>

          {/* =========================================================
              RIGHT — AUTOMATIC PROJECT SHOWCASE
          ========================================================= */}

          <div
            className="
              relative
              lg:col-span-7
              lg:-mr-10
              xl:-mr-16
            "
          >
            <Reveal direction="right" delay={220}>
              <div
                className="
                  relative
                  mx-auto
                  w-full
                  max-w-3xl
                  lg:max-w-none
                  lg:translate-y-3
                "
              >
                <div
                  className="
                    relative
                    w-full
                    overflow-hidden
                  "
                >
                  <img
                    key={activeProject.src}
                    src={activeProject.src}
                    alt={activeProject.alt}
                    className="
                      hero-showcase-transition
                      block
                      h-auto
                      w-full
                      select-none
                      object-contain
                      drop-shadow-[0_30px_30px_rgba(20,20,43,0.16)]
                    "
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={1200}
                    height={750}
                    draggable={false}
                  />
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};