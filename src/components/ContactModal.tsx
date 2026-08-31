import React, { useState, useEffect, useRef, useCallback } from 'react';
import { submitContactLead } from '../services/contactService';
import { trackEvent } from '../services/analytics';
import { contactConfig } from '../config/contact';
import { SOLUTION_OPTIONS, SolutionOptionValue } from '../config/solutionOptions';
import { Modal } from './ui/Modal';
import { Input, Textarea, CustomSelect } from './ui/FormElements';
import { Button } from './ui/Button';
import { SocialIcon } from './ui/SocialIcon';
import { TurnstileWidget, TurnstileWidgetRef } from './TurnstileWidget';

// Re-export SolutionOptionValue and SOLUTION_OPTIONS for backwards compatibility with other components
export { SOLUTION_OPTIONS, type SolutionOptionValue };

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
  turnstile?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ 
  isOpen, 
  onClose,
  defaultSolution = 'otro'
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [solution, setSolution] = useState<SolutionOptionValue>(defaultSolution);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');
  
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const [status, setStatus] = useState<'idle' | 'validating' | 'submitting' | 'success' | 'error'>('idle');
  const [serverFeedback, setServerFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || '';

  // Stable callbacks for Turnstile widget to prevent unnecessary re-renders or widget reconstruction
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError('');
    setErrors((prev) => ({
      ...prev,
      turnstile: undefined,
    }));
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
    setTurnstileError('La verificación expiró. Inténtalo nuevamente.');
  }, []);

  const handleTurnstileError = useCallback((errorCode?: string) => {
    setTurnstileToken('');
    setTurnstileError('No pudimos completar la verificación de seguridad. Inténtalo nuevamente.');
    if (import.meta.env.DEV) {
      console.warn('[Turnstile]', errorCode);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSolution(defaultSolution);
      setStatus('idle');
      setServerFeedback(null);
      setErrors({});
      setTurnstileError('');
      trackEvent('contact_form_started', { initialSolution: defaultSolution });
    }
  }, [isOpen, defaultSolution]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre completo.';
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

    // Require Turnstile token only if VITE_TURNSTILE_SITE_KEY is configured
    if (turnstileSiteKey && !turnstileToken) {
      newErrors.turnstile = 'Completa la verificación para continuar.';
      setTurnstileError('Completa la verificación para continuar.');
    } else {
      setTurnstileError('');
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

    const result = await submitContactLead(
      {
        name: name.trim(),
        company: company.trim(),
        contact: contact.trim(),
        solution,
        message: message.trim(),
        honeypot
      },
      turnstileToken
    );

    if (result.success) {
      setStatus('success');
      setServerFeedback({ message: result.message, isError: false });
      trackEvent('contact_form_success', { solution });
      trackEvent('contact_form_submitted', { solution });
      turnstileRef.current?.reset();
      setTurnstileToken('');
    } else {
      setStatus('error');
      setServerFeedback({ 
        message: result.message, 
        isError: true 
      });
      trackEvent('contact_form_error', { solution, error: result.error });
      // Reset Turnstile on error so user can re-verify if needed
      turnstileRef.current?.reset();
      setTurnstileToken('');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setName('');
    setCompany('');
    setContact('');
    setMessage('');
    setTurnstileToken('');
    setTurnstileError('');
    setErrors({});
    setServerFeedback(null);
    turnstileRef.current?.reset();
    onClose();
  };

  const customWhatsAppMsg = `Hola DITEON, soy ${name.trim() || 'un cliente'}${company.trim() ? ` de ${company.trim()}` : ''}. Me interesa evaluar una solución de ${solution.toUpperCase()} para mi negocio.`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hablemos de tu proyecto"
      subtitle="Cuéntanos sobre tu negocio y prepararemos un diagnóstico a tu medida."
      headerIcon="forum"
      maxWidth="md"
    >
      {status === 'success' ? (
        /* ESTADO C — SOLICITUD ENVIADA CON ÉXITO */
        <div className="py-3 sm:py-4 text-center">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[24px] sm:text-[26px]" aria-hidden="true">check</span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-[#14142B] font-['Space_Grotesk'] tracking-tight mb-2">
            Solicitud enviada con éxito
          </h4>

          <p className="text-xs sm:text-sm text-[#14142B]/70 max-w-sm sm:max-w-md mx-auto font-['Inter'] leading-relaxed mb-6">
            {serverFeedback?.message || 'Hemos recibido tus datos con éxito. Un ingeniero de software se comunicará contigo a la brevedad.'}
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="px-7 py-2.5 sm:py-3 rounded-[6px] bg-[#1C6FE0] hover:bg-[#155fc5] active:bg-[#104fa8] text-white text-xs sm:text-sm font-semibold tracking-tight transition-all duration-150 cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C6FE0] focus-visible:ring-offset-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        /* ESTADO A & B — FORMULARIO NORMAL Y SELECTOR DE SOLUCIÓN */
        <form onSubmit={handleSubmit} className="text-xs font-['Inter']" noValidate>
          
          {/* Honeypot field (anti-spam invisible) */}
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
              className="mb-5 p-3.5 rounded-[6px] bg-red-50 border border-red-200 text-red-900 text-xs space-y-2.5"
              role="alert"
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0 mt-0.5" aria-hidden="true">error</span>
                <div className="leading-tight">
                  <span className="font-bold block text-[13px]">No se pudo enviar la solicitud en este momento</span>
                  <span className="text-red-700">{serverFeedback.message}</span>
                </div>
              </div>

              {/* Fallback Channels */}
              {(contactConfig.whatsapp.isConfigured || contactConfig.email.isConfigured) && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {contactConfig.whatsapp.isConfigured && (
                    <a
                      href={contactConfig.whatsapp.getLink(customWhatsAppMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#25D366] text-white font-semibold text-xs hover:bg-[#1fa851] transition-colors"
                    >
                      <SocialIcon brand="whatsapp" size={14} />
                      <span>Escribir por WhatsApp</span>
                    </a>
                  )}
                  {contactConfig.email.isConfigured && (
                    <a
                      href={contactConfig.email.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#14142B] text-white font-semibold text-xs hover:bg-[#202042] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">mail</span>
                      <span>Enviar por Email</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Campos del Formulario — Layout de 4 Filas Desktop / 1 Columna Mobile */}
          <div className="space-y-4 sm:space-y-4.5">
            {/* Fila 1: Nombre completo | Empresa (opcional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
              <Input
                id="contact-name"
                label="Nombre completo"
                placeholder="Carlos Mendoza"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
              />

              <Input
                id="contact-company"
                label="Empresa (opcional)"
                optionalLabel="(opcional)"
                placeholder="Distribuidora Lima SAC"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Fila 2: WhatsApp o correo | Solución de interés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
              <Input
                id="contact-detail"
                label="WhatsApp o correo"
                placeholder="+51 987 654 321 / contacto@empresa.com"
                required
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
                }}
                error={errors.contact}
              />

              <CustomSelect<SolutionOptionValue>
                id="contact-solution"
                label="Solución de interés"
                required
                value={solution}
                onChange={(val) => setSolution(val)}
                options={SOLUTION_OPTIONS}
              />
            </div>

            {/* Fila 3: Mensaje / descripción del proyecto a ancho completo */}
            <Textarea
              id="contact-message"
              label="Cuéntanos brevemente tu necesidad"
              optionalLabel="(opcional)"
              placeholder="Cuéntanos qué proceso quieres mejorar o qué problema necesitas resolver."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Fila 4: Cloudflare Turnstile */}
            {turnstileSiteKey && (
              <div className="pt-1">
                <TurnstileWidget
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  onVerify={handleTurnstileVerify}
                  onExpire={handleTurnstileExpire}
                  onError={handleTurnstileError}
                />
                {(turnstileError || errors.turnstile) && (
                  <p className="text-xs text-[#FF6B35] font-medium flex items-center gap-1.5 pt-1">
                    <span className="material-symbols-outlined text-[15px] shrink-0">error</span>
                    <span>{turnstileError || errors.turnstile}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Separación Estructural y Footer de Acciones Horizontal en Desktop */}
          <div className="border-t border-[#14142B]/8 pt-5 mt-6 sm:mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Microcopy de Confidencialidad */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs text-[#14142B]/50">
              <span className="material-symbols-outlined text-[14px] text-[#14142B]/40 shrink-0" aria-hidden="true">lock</span>
              <span>Información confidencial. Sin spam.</span>
            </div>

            {/* Botón CTA */}
            <Button
              type="submit"
              variant="primary"
              isLoading={status === 'submitting'}
              disabled={status === 'submitting'}
              className="w-full sm:w-auto sm:min-w-[270px] h-12 sm:h-[50px] rounded-[6px] px-6 sm:px-7 text-xs sm:text-sm font-semibold tracking-tight shadow-2xs hover:bg-[#155fc5]"
              iconRight={<span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>}
            >
              Solicitar diagnóstico sin compromiso
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
