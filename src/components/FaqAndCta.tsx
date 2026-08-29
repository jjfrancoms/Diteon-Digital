import React from 'react';
import { trackEvent } from '../services/analytics';
import { getContactChannels } from '../services/contactChannels';
import { SolutionOptionValue } from './ContactModal';
import { Accordion, AccordionItemData } from './ui/Accordion';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';
import { SocialIcon } from './ui/SocialIcon';

interface FaqAndCtaProps {
  onOpenContact?: (solution?: SolutionOptionValue) => void;
}

export const FaqAndCta: React.FC<FaqAndCtaProps> = ({ onOpenContact }) => {
  const contactData = getContactChannels('Hola DITEON, me gustaría solicitar un diagnóstico para mi negocio.');

  const faqData: AccordionItemData[] = [
    {
      title: '¿Cuánto tiempo toma desarrollar un sistema a medida?',
      content: 'Depende de la complejidad. Módulos específicos o sistemas iniciales (como un POS o CRM básico) suelen implementarse en 3 a 6 semanas. Para plataformas completas trabajamos con entregas por fases para que empieces a operar lo antes posible.'
    },
    {
      title: '¿Cómo es el esquema de pagos del proyecto?',
      content: 'Trabajamos con esquema de hitos claros: un anticipo inicial para arranque y prototipado, pagos intermedios contra validación de avances y un saldo final tras la puesta en producción y capacitación.'
    },
    {
      title: '¿Qué pasa si mi negocio crece o añade nuevas sucursales?',
      content: 'La arquitectura es modular y extensible. Puedes incorporar nuevas sucursales, roles de usuario, almacenes o funciones adicionales en cualquier momento sin tener que rehacer el sistema desde cero.'
    },
    {
      title: '¿Pueden integrar el sistema con WhatsApp o facturación electrónica?',
      content: 'Sí. Desarrollamos integraciones con WhatsApp API, pasarelas de pago (tarjetas, billeteras digitales), servicios de facturación electrónica y APIs de terceros requeridas por tu operación.'
    },
    {
      title: '¿Quién es dueño del software y la base de datos?',
      content: 'Tus datos son tuyos. La propiedad, entrega y alcance del código se define claramente desde el inicio del proyecto sin cargos ocultos ni ataduras.'
    },
    {
      title: '¿Qué tipo de soporte recibo después del lanzamiento?',
      content: 'Incluimos un periodo de estabilización técnica y acompañamiento tras el lanzamiento, además de planes acordados de soporte continuo y mantenimiento correctivo.'
    },
    {
      title: '¿Capacitan a mi personal para utilizar el sistema?',
      content: 'Sí. Realizamos sesiones de capacitación guiadas para tu equipo operativo y administrativo, complementadas con guías prácticas y soporte de dudas.'
    },
    {
      title: '¿Cómo podemos comenzar?',
      content: 'Comenzamos con una llamada breve de diagnóstico sin costo donde revisamos tus procesos y te entregamos una propuesta clara con tiempos y alcance.'
    }
  ];

  const handleToggle = (index: number, isOpen: boolean) => {
    if (isOpen) {
      trackEvent('faq_opened', { faqQuestion: faqData[index].title });
    }
  };

  const handleCtaClick = () => {
    trackEvent('hero_contact_click', { source: 'faq_cta_block' });
    if (onOpenContact) {
      onOpenContact('otro');
    }
  };

  const handleWhatsappClick = () => {
    trackEvent('whatsapp_click', { source: 'faq_cta_block' });
    window.open(contactData.whatsapp.url, '_blank', 'noopener,noreferrer');
  };

  const handleChannelClick = (channelId: string) => {
    switch (channelId) {
      case 'email':
        trackEvent('email_click', { source: 'faq_cta_block' });
        break;
      case 'call':
        trackEvent('phone_click', { source: 'faq_cta_block' });
        break;
      case 'linkedin':
        trackEvent('linkedin_click', { source: 'faq_cta_block' });
        break;
      case 'instagram':
        trackEvent('instagram_click', { source: 'faq_cta_block' });
        break;
      case 'calendly':
        trackEvent('calendly_click', { source: 'faq_cta_block' });
        break;
      default:
        break;
    }
  };

  // Secondary channels (Email, Call, LinkedIn, Instagram, Calendly)
  const secondaryChannels = contactData.availableList.filter((ch) => ch.id !== 'whatsapp');

  return (
    <section 
      id="faq" 
      className="py-16 lg:py-20 bg-[#F7F7F5] relative border-b border-[#14142B]/8"
    >
      {/* Anchor alias for #contacto */}
      <div id="contacto" className="absolute -top-16 left-0" />

      <div className="page-shell">
        
        {/* Editorial Section Header: Left Heading + Displaced Supporting Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end mb-10 lg:mb-12 text-left">
          <div className="lg:col-span-7 space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#14142B] tracking-tight font-['Space_Grotesk'] leading-[1.15]">
              Dudas habituales sobre el desarrollo.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-1">
            <p className="text-xs sm:text-sm text-[#14142B]/70 font-['Inter'] leading-relaxed">
              Resolvemos las preguntas operativas, técnicas y contractuales que suelen surgir antes de iniciar la construcción de tu sistema.
            </p>
          </div>
        </div>

        {/* Asymmetric 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: OPEN FAQ ACCORDION WITH DIVIDERS (lg:col-span-7) */}
          <div className="lg:col-span-7 text-left space-y-2">
            <Accordion
              items={faqData}
              defaultOpenIndex={0}
              onToggle={handleToggle}
            />
          </div>

          {/* RIGHT: EDITORIAL INVITATION BLOCK (lg:col-span-5) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#14142B] text-white rounded-lg p-6 sm:p-7 border border-white/8 space-y-5 text-left">
              
              <div className="space-y-3">
                <div className="w-6 h-0.5 bg-[#1C6FE0]" aria-hidden="true" />
                
                <h3 className="text-lg sm:text-xl font-bold text-[#F7F7F5] font-['Space_Grotesk'] leading-[1.25]">
                  ¿Hay un proceso en tu empresa que todavía depende de hojas de cálculo, WhatsApp o trabajo manual?
                </h3>
                <p className="text-xs sm:text-[13px] text-[#F7F7F5]/75 leading-relaxed font-['Inter']">
                  Antes de proponerte software, revisamos cómo funciona tu operación contigo para entregarte una propuesta técnica con alcance claro.
                </p>
              </div>

              {/* Action & Direct Channels */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleCtaClick}
                  iconRight={<span className="material-symbols-outlined text-[17px]">arrow_forward</span>}
                >
                  Hablar con DITEON
                </Button>

                {/* Direct Accessible Channels List */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-['Inter']">
                  {contactData.whatsapp.isConfigured && (
                    <a
                      href={contactData.whatsapp.url}
                      onClick={handleWhatsappClick}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/6 hover:bg-white/12 text-white/90 hover:text-white transition-colors text-[11px]"
                    >
                      <SocialIcon brand="whatsapp" size={13} className="text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {secondaryChannels.map((channel) => (
                    <a
                      key={channel.id}
                      href={channel.href}
                      onClick={() => handleChannelClick(channel.id)}
                      target={channel.isExternal ? '_blank' : undefined}
                      rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/6 hover:bg-white/12 text-white/80 hover:text-white transition-colors text-[11px]"
                    >
                      {channel.iconBrand ? (
                        <SocialIcon brand={channel.iconBrand} size={13} />
                      ) : (
                        <span className="material-symbols-outlined text-[13px] text-[#1C6FE0]">
                          {channel.systemIcon}
                        </span>
                      )}
                      <span>{channel.label}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
