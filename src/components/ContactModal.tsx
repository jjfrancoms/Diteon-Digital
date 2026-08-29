import React, { useState, useEffect } from 'react';
import { submitContactLead } from '../services/contactService';
import { trackEvent } from '../services/analytics';
import { contactConfig } from '../config/contact';
import { Modal } from './ui/Modal';
import { Input, Select, Textarea } from './ui/FormElements';
import { Button } from './ui/Button';
import { SocialIcon } from './ui/SocialIcon';

export type SolutionOptionValue = 
  | 'crm' 
  | 'pos' 
  | 'inventario' 
  | 'erp' 
  | 'automatizacion' 
  | 'a-medida' 
  | 'otro';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSolution?: SolutionOptionValue;
}

interface FormErrors {
  name?: string;
  contact?: string;
  solution?: string;
  message?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ 
  isOpen, 
  onClose,
  defaultSolution = 'otro'
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [solution, setSolution] = useState<SolutionOptionValue>(defaultSolution);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'validating' | 'submitting' | 'success' | 'error'>('idle');
  const [serverFeedback, setServerFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setSolution(defaultSolution);
      setStatus('idle');
      setServerFeedback(null);
      setErrors({});
      trackEvent('contact_form_started', { initialSolution: defaultSolution });
    }
  }, [isOpen, defaultSolution]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre o el de tu empresa.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!contact.trim()) {
      newErrors.contact = 'Ingresa un WhatsApp o correo para poder responderte.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s+()-]{7,20}$/;
      const isEmail = emailRegex.test(contact.trim());
      const isPhone = phoneRegex.test(contact.trim());

      if (!isEmail && !isPhone) {
        newErrors.contact = 'Ingresa un correo válido (ej. juan@empresa.com) o un teléfono.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('validating');
    const isValid = validateForm();

    if (!isValid) {
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    setServerFeedback(null);
    trackEvent('contact_form_submit', { solution });

    const result = await submitContactLead({
      name: name.trim(),
      contact: contact.trim(),
      solution,
      message: message.trim(),
      honeypot
    });

    if (result.success) {
      setStatus('success');
      setServerFeedback({ message: result.message, isError: false });
      trackEvent('contact_form_success', { solution });
      trackEvent('contact_form_submitted', { solution });
    } else {
      setStatus('error');
      setServerFeedback({ 
        message: result.message, 
        isError: true 
      });
      trackEvent('contact_form_error', { solution, error: result.error });
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setName('');
    setContact('');
    setMessage('');
    setErrors({});
    setServerFeedback(null);
    onClose();
  };

  const customWhatsAppMsg = `Hola DITEON, soy ${name.trim() || 'un cliente'}. Me interesa evaluar una solución de ${solution.toUpperCase()} para mi negocio.`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hablemos de tu proyecto"
      subtitle="Cuéntanos sobre tu negocio para preparar un diagnóstico técnico a tu medida."
      maxWidth="md"
    >
      {status === 'success' ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <h4 className="text-lg font-bold text-[#14142B] font-['Space_Grotesk']">
            Solicitud enviada con éxito
          </h4>
          <p className="text-xs sm:text-sm text-[#14142B]/75 max-w-sm mx-auto font-['Inter'] leading-relaxed">
            {serverFeedback?.message || 'Hemos recibido tus datos. Un ingeniero de software se comunicará contigo a la brevedad.'}
          </p>
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={handleReset}>
              Cerrar
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-['Inter']" noValidate>
          
          {/* Honeypot field (hidden from real users for anti-spam) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_hp">No llenar si eres humano</label>
            <input 
              type="text" 
              id="website_hp" 
              name="website_hp" 
              tabIndex={-1} 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              autoComplete="off" 
            />
          </div>

          {/* Actionable Server-level error notification */}
          {status === 'error' && serverFeedback && (
            <div 
              className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs space-y-2.5"
              role="alert"
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0 mt-0.5">error</span>
                <div className="leading-tight">
                  <span className="font-bold block text-[13px]">No se pudo enviar la solicitud en este momento</span>
                  <span className="text-red-700">{serverFeedback.message}</span>
                </div>
              </div>

              {/* Actionable Fallback Buttons */}
              {(contactConfig.whatsapp.isConfigured || contactConfig.email.isConfigured) && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {contactConfig.whatsapp.isConfigured && (
                    <a
                      href={contactConfig.whatsapp.getLink(customWhatsAppMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] text-white font-semibold text-xs hover:bg-[#1fa851] transition-colors"
                    >
                      <SocialIcon brand="whatsapp" size={14} />
                      <span>Escribir por WhatsApp</span>
                    </a>
                  )}
                  {contactConfig.email.isConfigured && (
                    <a
                      href={contactConfig.email.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#14142B] text-white font-semibold text-xs hover:bg-[#202042] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">mail</span>
                      <span>Enviar por Email</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Name input */}
          <Input
            id="contact-name"
            label="Tu nombre o el de tu empresa"
            placeholder="Ej. Carlos Mendoza / Distribuidora Lima"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            iconLeft="person"
          />

          {/* Contact input */}
          <Input
            id="contact-detail"
            label="WhatsApp o Correo electrónico"
            placeholder="Ej. +51 987 654 321 o contacto@empresa.com"
            required
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
            }}
            error={errors.contact}
            iconLeft="contact_mail"
          />

          {/* Solution select */}
          <Select
            id="contact-solution"
            label="Solución de interés"
            value={solution}
            onChange={(e) => setSolution(e.target.value as SolutionOptionValue)}
            options={[
              { value: 'crm', label: 'CRM & Seguimiento de Clientes' },
              { value: 'pos', label: 'Punto de Venta (POS) & Caja' },
              { value: 'inventario', label: 'Control de Inventario & Stock' },
              { value: 'erp', label: 'ERP & Gestión Integral de Operaciones' },
              { value: 'automatizacion', label: 'Automatización de Procesos & WhatsApp' },
              { value: 'a-medida', label: 'Desarrollo Web / Portal a Medida' },
              { value: 'otro', label: 'Aún no estoy seguro / Deseo asesoría' }
            ]}
          />

          {/* Message textarea */}
          <Textarea
            id="contact-message"
            label="Cuéntanos brevemente sobre tu proceso o necesidad (opcional)"
            placeholder="Ej. Manejamos múltiples almacenes y necesitamos unificar el stock con los puntos de venta..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={status === 'submitting'}
              disabled={status === 'submitting'}
              iconRight={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            >
              Solicitar diagnóstico sin compromiso
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#14142B]/60 pt-1">
            <span className="material-symbols-outlined text-[14px] text-[#14142B]/50" aria-hidden="true">lock</span>
            <span>Tratamiento de datos estrictamente confidencial. Sin spam.</span>
          </div>
        </form>
      )}
    </Modal>
  );
};
