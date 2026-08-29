import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DiteonLogo } from './DiteonLogo';
import { Button } from './ui/Button';

interface HeaderProps {
  onScrollTo?: (id: string) => void;
  onOpenContact?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollTo, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cached section offsets to avoid DOM thrashing on every scroll event
  const sectionOffsetsRef = useRef<{ id: string; top: number }[]>([]);
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<number | null>(null);

  const updateSectionPositions = useCallback(() => {
    const sectionIds = ['soluciones', 'demos', 'proceso', 'faq'];
    const offsets: { id: string; top: number }[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        // Calculate absolute top from document top
        let top = 0;
        let current: HTMLElement | null = el;
        while (current) {
          top += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        offsets.push({ id, top });
      }
    }

    // Sort by top position ascending
    offsets.sort((a, b) => a.top - b.top);
    sectionOffsetsRef.current = offsets;
  }, []);

  useEffect(() => {
    updateSectionPositions();

    // Recompute offsets on window resize and after dynamic content mounts
    window.addEventListener('resize', updateSectionPositions, { passive: true });
    const timer = setTimeout(updateSectionPositions, 500);

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 15);

          // If a programmatic navigation is currently animating, let it dictate the active section
          if (isNavigatingRef.current) {
            ticking = false;
            return;
          }

          if (scrollY < 120) {
            setActiveSection('');
            ticking = false;
            return;
          }

          const isNearBottom = window.innerHeight + scrollY >= (document.documentElement.scrollHeight - 60);
          if (isNearBottom) {
            setActiveSection('faq');
            ticking = false;
            return;
          }

          const headerHeight = 72;
          const activationOffset = 180;
          const currentPosition = scrollY + headerHeight + activationOffset;

          const offsets = sectionOffsetsRef.current;
          let currentMatch = '';

          for (let i = 0; i < offsets.length; i++) {
            if (offsets[i].top <= currentPosition) {
              currentMatch = offsets[i].id;
            } else {
              break;
            }
          }

          setActiveSection((prev) => (prev !== currentMatch ? currentMatch : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSectionPositions);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, [updateSectionPositions]);

  const navLinks = [
    { name: 'Soluciones', href: '#soluciones', id: 'soluciones' },
    { name: 'Demos', href: '#demos', id: 'demos' },
    { name: 'Proceso', href: '#proceso', id: 'proceso' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');

    if (targetId === 'top') {
      setActiveSection('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '#');
      return;
    }

    // Set lock during programmatic scroll to prevent flicker
    isNavigatingRef.current = true;
    setActiveSection(targetId);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 800);

    if (onScrollTo) {
      onScrollTo(targetId);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = -72;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition + offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    window.history.pushState(null, '', href);
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onOpenContact) {
      onOpenContact();
    } else if (onScrollTo) {
      onScrollTo('contacto');
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#F7F7F5]/98 border-b border-[#14142B]/10 shadow-2xs py-3'
          : 'bg-[#F7F7F5] border-b border-[#14142B]/5 py-4 sm:py-5'
      }`}
    >
      <div className="page-shell">
        <div className="flex items-center justify-between">
          {/* Logo DITEON with light theme */}
          <a
            id="brand-logo-link"
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            className="group transition-transform active:scale-95 flex items-center"
            aria-label="DITEON Home"
          >
            <DiteonLogo size="md" variant="azul_coral" theme="light" />
          </a>

          {/* Center Navigation Links with deterministic text-width underline */}
          <nav id="desktop-navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-[14px] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#1C6FE0] after:transition-all after:duration-200 font-['Inter'] ${
                    isActive
                      ? 'text-[#1C6FE0] font-semibold after:w-full'
                      : 'text-[#14142B]/75 hover:text-[#14142B] font-medium after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA Button (Electric Blue #1C6FE0) */}
          <div className="hidden md:flex items-center">
            <Button
              id="header-cta-button"
              variant="primary"
              size="sm"
              onClick={handleCtaClick}
              iconRight={<span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
            >
              Hablemos de tu proyecto
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#14142B]/80 hover:text-[#14142B] bg-[#14142B]/[0.04] border border-[#14142B]/10 hover:bg-[#14142B]/[0.08] transition-colors flex items-center justify-center cursor-pointer"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer"
          className="md:hidden bg-[#F7F7F5] border-b border-[#14142B]/10 px-4 pt-3 pb-5 mt-2 space-y-3"
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors font-['Inter'] ${
                    isActive 
                      ? 'bg-[#1C6FE0]/10 text-[#1C6FE0] font-bold' 
                      : 'text-[#14142B]/85 hover:text-[#14142B] hover:bg-[#14142B]/[0.04] font-medium'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#14142B]/10">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleCtaClick}
              iconRight={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            >
              Hablemos de tu proyecto
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

