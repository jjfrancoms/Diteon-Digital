import React from 'react';
import { DiteonLogo } from './DiteonLogo';
import { trackEvent } from '../services/analytics';
import { getContactChannels } from '../services/contactChannels';
import { SolutionOptionValue } from './ContactModal';
import { SocialIcon } from './ui/SocialIcon';

interface FooterProps {
  onScrollTo?: (id: string) => void;
  onOpenContact?: (solution?: SolutionOptionValue) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo, onOpenContact }) => {
  const channels = getContactChannels('Hola DITEON, me comunico desde la web para realizar una consulta.');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    if (onScrollTo) {
      onScrollTo(targetId);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenContact = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('hero_contact_click', { source: 'footer_link' });
    if (onOpenContact) {
      onOpenContact('otro');
    }
  };

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('whatsapp_click', { source: 'footer' });
    window.open(channels.whatsapp.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#14142B] text-[#F7F7F5] border-t border-white/10 pt-10 pb-8 font-['Inter']">
      <div className="page-shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10 text-left">
          
          {/* Col 1: Brand & Purpose (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <a href="#top" onClick={(e) => handleNavClick(e, '#top')} className="inline-block" aria-label="DITEON Inicio">
              <DiteonLogo size="md" variant="azul_coral" theme="dark" />
            </a>
            <p className="text-xs sm:text-[13px] text-[#F7F7F5]/70 max-w-sm leading-relaxed">
              Ingeniería de software a medida, plataformas de control operativo y automatización de flujos empresariales construidas para estructurar y escalar empresas.
            </p>
          </div>

          {/* Col 2: Soluciones (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7F7F5]/40 font-['Space_Grotesk']">
              Soluciones operativas
            </div>
            <ul className="space-y-2 text-xs text-[#F7F7F5]/75">
              <li>
                <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
                  CRM y Pipeline de Ventas
                </a>
              </li>
              <li>
                <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
                  Terminal Punto de Venta (POS)
                </a>
              </li>
              <li>
                <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
                  Control de Stock e Inventario
                </a>
              </li>
              <li>
                <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
                  Gestión Empresarial (ERP)
                </a>
              </li>
              <li>
                <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
                  Automatizaciones & WhatsApp
                </a>
              </li>
              <li>
                <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
                  Sistemas a la Medida
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Metodología & Garantías (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7F7F5]/40 font-['Space_Grotesk']">
              Metodología
            </div>
            <ul className="space-y-2 text-xs text-[#F7F7F5]/75">
              <li>
                <a href="#proceso" onClick={(e) => handleNavClick(e, '#proceso')} className="hover:text-white transition-colors">
                  Diagnóstico y alcance
                </a>
              </li>
              <li>
                <a href="#proceso" onClick={(e) => handleNavClick(e, '#proceso')} className="hover:text-white transition-colors">
                  Arquitectura técnica
                </a>
              </li>
              <li>
                <a href="#proceso" onClick={(e) => handleNavClick(e, '#proceso')} className="hover:text-white transition-colors">
                  Entregables continuos
                </a>
              </li>
              <li>
                <a href="#proceso" onClick={(e) => handleNavClick(e, '#proceso')} className="hover:text-white transition-colors">
                  Garantías de entrega
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-white transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Canales Directos de Comunicación (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7F7F5]/40 font-['Space_Grotesk']">
              Comunicación directa
            </div>
            
            <div className="flex flex-col gap-2.5 text-xs text-[#F7F7F5]/80">
              {channels.whatsapp.isConfigured && (
                <button
                  type="button"
                  onClick={handleWhatsappClick}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors text-left"
                >
                  <SocialIcon brand="whatsapp" size={15} className="text-[#25D366]" />
                  <span>WhatsApp directo</span>
                </button>
              )}

              {channels.email.isConfigured && channels.email.href && (
                <a
                  href={channels.email.href}
                  onClick={() => trackEvent('email_click', { source: 'footer' })}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <SocialIcon brand="email" size={15} className="text-[#1C6FE0]" />
                  <span>{channels.email.address || 'Contacto por Email'}</span>
                </a>
              )}

              {channels.phone.isConfigured && channels.phone.href && (
                <a
                  href={channels.phone.href}
                  onClick={() => trackEvent('phone_click', { source: 'footer' })}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <SocialIcon brand="call" size={15} className="text-[#1C6FE0]" />
                  <span>{channels.phone.formatted || 'Llamada telefónica'}</span>
                </a>
              )}

              {channels.calendly.isConfigured && channels.calendly.url && (
                <a
                  href={channels.calendly.url}
                  onClick={() => trackEvent('calendly_click', { source: 'footer' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <SocialIcon brand="calendar" size={15} className="text-[#1C6FE0]" />
                  <span>Agendar reunión técnica</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleOpenContact}
                className="inline-flex items-center gap-1 text-[#1C6FE0] hover:text-[#5295eb] font-semibold transition-colors mt-1"
              >
                <span>Formulario de consulta</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* Social icons strictly rendered if configured */}
            {(channels.linkedin.isConfigured || channels.instagram.isConfigured) && (
              <div className="pt-2 flex items-center gap-2">
                {channels.linkedin.isConfigured && channels.linkedin.url && (
                  <a
                    href={channels.linkedin.url}
                    onClick={() => trackEvent('linkedin_click', { source: 'footer' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn DITEON"
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#F7F7F5]/70 hover:text-white transition-colors"
                  >
                    <SocialIcon brand="linkedin" size={14} />
                  </a>
                )}

                {channels.instagram.isConfigured && channels.instagram.url && (
                  <a
                    href={channels.instagram.url}
                    onClick={() => trackEvent('instagram_click', { source: 'footer' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram DITEON"
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#F7F7F5]/70 hover:text-white transition-colors"
                  >
                    <SocialIcon brand="instagram" size={14} />
                  </a>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Bottom Bar: Institutional copyright & Quick anchors */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F7F7F5]/50">
          <div>
            © {new Date().getFullYear()} DITEON. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a href="#soluciones" onClick={(e) => handleNavClick(e, '#soluciones')} className="hover:text-white transition-colors">
              Soluciones
            </a>
            <a href="#demos" onClick={(e) => handleNavClick(e, '#demos')} className="hover:text-white transition-colors">
              Demos
            </a>
            <a href="#proceso" onClick={(e) => handleNavClick(e, '#proceso')} className="hover:text-white transition-colors">
              Metodología
            </a>
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-white transition-colors">
              Preguntas frecuentes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
