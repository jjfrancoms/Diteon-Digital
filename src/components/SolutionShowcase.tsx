import React, { useState } from 'react';
import { trackEvent } from '../services/analytics';
import { SolutionOptionValue } from './ContactModal';
import { Tabs, TabItem } from './ui/Tabs';
import { Button } from './ui/Button';

export type SolutionKey = 'crm' | 'pos' | 'inventario' | 'erp' | 'automatizacion' | 'a-medida';

interface SolutionDetails {
  id: SolutionKey;
  label: string;
  badge: string;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
}

const SOLUTIONS_CONFIG: Record<SolutionKey, SolutionDetails> = {
  crm: {
    id: 'crm',
    label: 'CRM',
    badge: 'Ventas & Clientes',
    title: 'CRM para Negocios & Equipos Comerciales',
    description: 'Gestiona clientes, oportunidades, seguimientos y ventas desde un solo lugar. Conecta canales de mensajería y mantén tu pipeline comercial siempre actualizado.',
    features: [
      'Pipeline visual de ventas con etapas y montos en tiempo real',
      'Historial de interacciones, notas y llamadas por prospecto',
      'Recordatorios automáticos para no perder oportunidades de venta',
      'Integrable con WhatsApp y correo electrónico corporativo',
      'Métricas de conversión y desempeño de asesores de venta'
    ],
    ctaText: 'Consultar sobre CRM'
  },
  pos: {
    id: 'pos',
    label: 'POS',
    badge: 'Punto de Venta',
    title: 'Punto de Venta Rápido & Arqueos de Caja',
    description: 'Terminal de cobro ágil para tiendas físicas y mostradores. Cobra en segundos, emite comprobantes, controla turnos y mantén la caja siempre cuadrada.',
    features: [
      'Cobro rápido optimizado para pantallas táctiles y teclado físico',
      'Múltiples métodos de pago (Efectivo, Tarjeta, Transferencia, Yape/Plin)',
      'Control de caja, retiros, ingresos y arqueo al cierre de turno',
      'Búsqueda instantánea de productos por lector de barras o nombre',
      'Reporte diario de ventas por cajero, turno y sucursal'
    ],
    ctaText: 'Consultar sobre POS'
  },
  inventario: {
    id: 'inventario',
    label: 'Inventario',
    badge: 'Control de Stock',
    title: 'Control de Inventario & Reposición en Tiempo Real',
    description: 'Elimina las roturas de stock y las pérdidas por descontrol. Consulta existencias en tiempo real entre múltiples sucursales o almacenes con alertas automáticas.',
    features: [
      'Monitor centralizado de existencias por almacén y tienda',
      'Alertas de stock mínimo y sugerencias automáticas de reposición',
      'Registro auditado de entradas, salidas, transferencias y mermas',
      'Trazabilidad por código de barras, SKU y número de lote',
      'Valorización de inventario y rotación de mercancía'
    ],
    ctaText: 'Consultar sobre Inventario'
  },
  erp: {
    id: 'erp',
    label: 'ERP',
    badge: 'Gestión Integral',
    title: 'ERP & Operaciones Empresariales',
    description: 'Conecta compras, ventas, inventario, operaciones y finanzas en una sola plataforma sólida diseñada para el crecimiento continuo de tu empresa.',
    features: [
      'Gestión integral de órdenes de compra, proveedores y pagos',
      'Órdenes de producción y control de consumo de insumos por lote',
      'Trazabilidad operativa desde la compra hasta la entrega al cliente',
      'Gestión de personal, asignación de turnos y productividad',
      'Márgenes de rentabilidad operativa por línea de producto'
    ],
    ctaText: 'Consultar sobre ERP'
  },
  automatizacion: {
    id: 'automatizacion',
    label: 'Automatización',
    badge: 'Flujos & Procesos',
    title: 'Workflows & Procesos Automáticos',
    description: 'Elimina tareas manuales repetitivas. Conectamos tus sistemas para que las cotizaciones, confirmaciones, facturas y alertas se ejecuten de manera automática.',
    features: [
      'Disparadores automáticos por eventos (nueva venta, stock bajo)',
      'Avisos automáticos de WhatsApp con confirmación de pedido',
      'Generación y envío automático de comprobantes con código QR',
      'Flujos de validación y clasificación de consultas de clientes',
      'Conexión mediante webhooks y APIs con herramientas externas'
    ],
    ctaText: 'Consultar sobre Automatizaciones'
  },
  'a-medida': {
    id: 'a-medida',
    label: 'A medida',
    badge: 'Desarrollo Exclusivo',
    title: 'Sistemas Internos & Portales Exclusivos',
    description: 'Cuando los programas comerciales estándar no se ajustan a tu modelo. Desarrollamos portales para clientes, apps de técnicos en campo y plataformas dedicadas.',
    features: [
      'Portales de autogestión para clientes, distribuidores o proveedores',
      'Aplicaciones web para personal operativo en campo sin papel',
      'Permisos estrictos por roles y registro de auditoría de accesos',
      'Bases de datos dedicadas con alto rendimiento y seguridad',
      'Arquitectura modular que evoluciona junto a tu empresa'
    ],
    ctaText: 'Consultar software a medida'
  }
};

const TAB_ITEMS: TabItem[] = [
  { id: 'crm', label: 'CRM', icon: 'groups' },
  { id: 'pos', label: 'POS', icon: 'point_of_sale' },
  { id: 'inventario', label: 'Inventario', icon: 'inventory_2' },
  { id: 'erp', label: 'ERP', icon: 'domain' },
  { id: 'automatizacion', label: 'Automatización', icon: 'bolt' },
  { id: 'a-medida', label: 'A medida', icon: 'tune' },
];

const DEMO_IMAGES: Record<SolutionKey, { src: string; alt: string }> = {
  crm: { src: '/demos/crm.svg', alt: 'Interfaz de CRM y Pipeline de Ventas DITEON' },
  pos: { src: '/demos/pos.svg', alt: 'Terminal Punto de Venta y Cobros POS DITEON' },
  inventario: { src: '/demos/inventory.svg', alt: 'Panel de Control de Inventario y Stock Multisede DITEON' },
  erp: { src: '/demos/erp.svg', alt: 'Sistema de Gestión y Órdenes de Producción ERP DITEON' },
  automatizacion: { src: '/demos/automation.svg', alt: 'Flujos de Automatización y Notificaciones WhatsApp DITEON' },
  'a-medida': { src: '/demos/custom.svg', alt: 'Portal Dedicado y Aplicación a Medida DITEON' },
};

interface SolutionShowcaseProps {
  onOpenContact?: (solution?: SolutionOptionValue) => void;
}

export const SolutionShowcase: React.FC<SolutionShowcaseProps> = ({ onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<SolutionKey>('crm');
  const current = SOLUTIONS_CONFIG[activeTab];

  const handleTabChange = (key: string) => {
    const solutionKey = key as SolutionKey;
    setActiveTab(solutionKey);
    trackEvent('solution_tab_selected', { tab: solutionKey });
  };

  const handleCta = () => {
    trackEvent('solution_cta_click', { solution: activeTab });
    trackEvent('solution_contact_click', { solution: activeTab });
    if (onOpenContact) {
      onOpenContact(activeTab);
    } else {
      const el = document.getElementById('contacto');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="soluciones" 
      className="py-16 lg:py-24 bg-[#14142B] text-[#F7F7F5] relative overflow-hidden"
    >
      <div className="page-shell">
        
        {/* Editorial Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F7F7F5] tracking-tight font-['Space_Grotesk']">
            ¿Qué necesitas digitalizar en tu negocio?
          </h2>
          <p className="text-sm sm:text-base text-[#F7F7F5]/70 font-['Inter']">
            Explora las soluciones que construimos y adaptamos a tu flujo operativo.
          </p>
        </div>

        {/* Accessible Tabs Bar Component */}
        <div className="flex justify-center mb-8">
          <Tabs
            tabs={TAB_ITEMS}
            activeId={activeTab}
            onChange={handleTabChange}
            theme="dark"
          />
        </div>

        {/* Anchor for #demos pointing right to the live interactive software showcase */}
        <div id="demos" className="relative -top-20" />

        {/* Main Solution Presentation View */}
        <div 
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="bg-[#1C1C36] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT DETAILS: (lg:col-span-4) */}
            <div 
              key={`details-${activeTab}`}
              className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 space-y-6 text-left solution-copy-enter"
            >
              
              <div className="space-y-4">
                <div className="text-[11px] uppercase tracking-wider text-[#1C6FE0] font-bold font-['Inter']">
                  {current.badge}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#F7F7F5] font-['Space_Grotesk'] leading-snug">
                  {current.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#F7F7F5]/75 leading-relaxed font-['Inter']">
                  {current.description}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7F7F5]/50 mb-3 font-['Inter']">
                    Capacidades funcionales
                  </div>
                  <ul className="space-y-2.5">
                    {current.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#F7F7F5]/90 font-['Inter']">
                        <span className="w-4 h-4 rounded-full bg-[#1C6FE0]/20 text-[#1C6FE0] flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                          <span className="material-symbols-outlined text-[12px] text-[#1C6FE0] font-bold">check</span>
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCta}
                  iconRight={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                >
                  {current.ctaText}
                </Button>
              </div>

            </div>

            {/* RIGHT REALISTIC MOCKUP PER TAB: (lg:col-span-8) */}
            <div 
              key={`demo-${activeTab}`}
              className="lg:col-span-8 p-4 sm:p-6 lg:p-7 bg-[#101024] flex flex-col justify-center text-left solution-demo-enter"
            >
              
              {/* Software Screenshot Showcase */}
              <div className="rounded-xl border border-white/10 shadow-2xl overflow-hidden bg-[#14142B] ring-1 ring-white/5">
                <img
                  src={DEMO_IMAGES[activeTab].src}
                  alt={DEMO_IMAGES[activeTab].alt}
                  className="w-full h-auto block object-cover select-none"
                  loading="lazy"
                  width={1200}
                  height={750}
                />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
