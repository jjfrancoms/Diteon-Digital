import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  submitContactLead,
} from '../services/contactService';

import {
  trackEvent,
} from '../services/analytics';

import {
  SOLUTION_OPTIONS,
  type SolutionOptionValue,
} from '../config/solutionOptions';

export { SOLUTION_OPTIONS, type SolutionOptionValue };

import {
  Modal,
} from './ui/Modal';

import {
  Input,
  Select,
  Textarea,
} from './ui/FormElements';

import {
  Button,
} from './ui/Button';

import {
  TurnstileWidget,
} from './TurnstileWidget';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSolution?: SolutionOptionValue;
}

interface FormErrors {
  fullName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  contact?: string;
  solution?: string;
  message?: string;
  turnstile?: string;
}

type SubmitStatus =
  | 'idle'
  | 'validating'
  | 'submitting'
  | 'success'
  | 'error';

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^[\d\s+()-]{6,30}$/;

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultSolution = 'otro',
}) => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [solution, setSolution] =
    useState<SolutionOptionValue>(defaultSolution);

  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [turnstileToken, setTurnstileToken] =
    useState('');

  const [turnstileResetKey, setTurnstileResetKey] =
    useState(0);

  const [status, setStatus] =
    useState<SubmitStatus>('idle');

  const [serverFeedback, setServerFeedback] =
    useState<{
      message: string;
      isError?: boolean;
    } | null>(null);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const turnstileSiteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? '';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFullName('');
    setCompanyName('');
    setPhone('');
    setEmail('');
    setSolution(defaultSolution);
    setMessage('');
    setHoneypot('');
    setTurnstileToken('');
    setTurnstileResetKey((value) => value + 1);
    setStatus('idle');
    setServerFeedback(null);
    setErrors({});

    trackEvent('contact_form_started', {
      initialSolution: defaultSolution,
    });
  }, [isOpen, defaultSolution]);

  const clearError = useCallback(
    (field: keyof FormErrors) => {
      setErrors((previous) => {
        if (!previous[field]) {
          return previous;
        }

        return {
          ...previous,
          [field]: undefined,
        };
      });
    },
    []
  );

  const handleTurnstileVerify = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      clearError('turnstile');
    },
    [clearError]
  );

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
    setErrors((previous) => ({
      ...previous,
      turnstile:
        'La verificación expiró. Complétala nuevamente.',
    }));
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setErrors((previous) => ({
      ...previous,
      turnstile:
        'No se pudo completar la verificación de seguridad.',
    }));
  }, []);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    const normalizedName = fullName.trim();
    const normalizedCompany = companyName.trim();
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();
    const normalizedMessage = message.trim();

    if (!normalizedName) {
      nextErrors.fullName =
        'Ingresa tu nombre completo.';
    } else if (normalizedName.length < 2) {
      nextErrors.fullName =
        'El nombre debe tener al menos 2 caracteres.';
    } else if (normalizedName.length > 120) {
      nextErrors.fullName =
        'El nombre no puede superar 120 caracteres.';
    }

    if (normalizedCompany.length > 150) {
      nextErrors.companyName =
        'La empresa no puede superar 150 caracteres.';
    }

    if (!normalizedEmail && !normalizedPhone) {
      nextErrors.contact =
        'Completa al menos un correo electrónico o un número de WhatsApp.';
    }

    if (
      normalizedEmail &&
      (!EMAIL_REGEX.test(normalizedEmail) ||
        normalizedEmail.length > 255)
    ) {
      nextErrors.email =
        'Ingresa un correo electrónico válido.';
    }

    if (
      normalizedPhone &&
      !PHONE_REGEX.test(normalizedPhone)
    ) {
      nextErrors.phone =
        'Ingresa un número de WhatsApp o celular válido.';
    }

    if (!solution) {
      nextErrors.solution =
        'Selecciona una solución de interés.';
    }

    if (normalizedMessage.length > 2000) {
      nextErrors.message =
        'El mensaje no puede superar 2000 caracteres.';
    }

    if (!turnstileToken.trim()) {
      nextErrors.turnstile =
        'Completa la verificación de seguridad.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (status === 'submitting') {
      return;
    }

    setStatus('validating');
    setServerFeedback(null);

    if (!validateForm()) {
      setStatus('idle');
      return;
    }

    setStatus('submitting');

    const result = await submitContactLead(
      {
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        solution,
        message: message.trim(),
        honeypot,
      },
      turnstileToken
    );

    if (result.success) {
      setStatus('success');
      setServerFeedback({
        message: result.message,
        isError: false,
      });

      trackEvent('contact_form_submitted', {
        solution,
      });

      return;
    }

    setStatus('error');

    setServerFeedback({
      message: result.message,
      isError: true,
    });

    setTurnstileToken('');
    setTurnstileResetKey((value) => value + 1);

    trackEvent('contact_form_error', {
      solution,
      error: result.error,
    });
  };

  const handleClose = () => {
    if (status === 'submitting') {
      return;
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Hablemos de tu proyecto"
      subtitle="Cuéntanos sobre tu negocio y prepararemos un diagnóstico a tu medida."
      maxWidth="lg"
      className="rounded-[8px]"
    >
      {status === 'success' ? (
        <div className="py-5 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <span className="material-symbols-outlined text-[24px]">
              check_circle
            </span>
          </div>

          <h4 className="mt-4 font-['Space_Grotesk'] text-lg font-bold text-[#14142B]">
            Solicitud enviada
          </h4>

          <p className="mx-auto mt-2 max-w-md font-['Inter'] text-sm leading-relaxed text-[#14142B]/70">
            {serverFeedback?.message ||
              'Recibimos tus datos correctamente. Nos pondremos en contacto contigo a la brevedad.'}
          </p>

          <div className="mt-5">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 font-['Inter']"
        >
          <div
            className="hidden"
            aria-hidden="true"
          >
            <label htmlFor="website_hp">
              No llenar si eres humano
            </label>

            <input
              id="website_hp"
              name="website_hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) =>
                setHoneypot(event.target.value)
              }
            />
          </div>

          {status === 'error' && serverFeedback && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
            >
              <span className="material-symbols-outlined mt-0.5 text-[16px]">
                error
              </span>

              <span>
                {serverFeedback.message}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="contact-full-name"
              label="Nombre completo"
              placeholder="Carlos Mendoza"
              required
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                clearError('fullName');
              }}
              error={errors.fullName}
              autoComplete="name"
            />

            <Input
              id="contact-company"
              label="Empresa (opcional)"
              placeholder="Distribuidora SAC Lima"
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value);
                clearError('companyName');
              }}
              error={errors.companyName}
              autoComplete="organization"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="contact-phone"
              label="WhatsApp / Celular"
              type="tel"
              placeholder="+51 987 654 321"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                clearError('phone');
                clearError('contact');
              }}
              error={errors.phone}
              autoComplete="tel"
              inputMode="tel"
            />

            <Input
              id="contact-email"
              label="Correo electrónico"
              type="email"
              placeholder="contacto@empresa.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError('email');
                clearError('contact');
              }}
              error={errors.email}
              autoComplete="email"
              inputMode="email"
            />
          </div>

          {errors.contact && (
            <p
              role="alert"
              className="-mt-2 flex items-center gap-1 text-xs font-medium text-red-600"
            >
              <span className="material-symbols-outlined text-[14px]">
                error
              </span>

              <span>
                {errors.contact}
              </span>
            </p>
          )}

          {!errors.contact && (
            <p className="-mt-2 text-[11px] text-[#14142B]/50">
              Completa al menos uno de los dos medios de contacto. Puedes ingresar ambos.
            </p>
          )}

          <Select
            id="contact-solution"
            label="Solución de interés"
            required
            value={solution}
            onChange={(event) => {
              setSolution(
                event.target.value as SolutionOptionValue
              );
              clearError('solution');
            }}
            options={[...SOLUTION_OPTIONS]}
            error={errors.solution}
          />

          <Textarea
            id="contact-message"
            label="Cuéntanos brevemente tu necesidad"
            placeholder="Cuéntanos cuál es la lógica de tu negocio, qué proceso quieres mejorar o qué problema necesitas resolver."
            rows={3}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              clearError('message');
            }}
            error={errors.message}
          />

          <div className="pt-1">
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onVerify={handleTurnstileVerify}
              onExpire={handleTurnstileExpire}
              onError={handleTurnstileError}
              resetKey={turnstileResetKey}
            />

            {errors.turnstile && (
              <p
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
              >
                <span className="material-symbols-outlined text-[14px]">
                  error
                </span>

                <span>
                  {errors.turnstile}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#14142B]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-[11px] leading-tight text-[#14142B]/50">
              <span className="material-symbols-outlined text-[16px]">
                lock
              </span>

              <span>
                Información confidencial. Sin spam.
              </span>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[310px]">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={status === 'submitting'}
                iconRight={
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                }
              >
                Solicitar diagnóstico sin compromiso
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ContactModal;
