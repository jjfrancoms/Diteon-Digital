import { isSolutionOptionValue } from '../config/solutionOptions'

export interface ContactFields {
  fullName: string
  companyName: string
  email: string
  phone: string
  solution: string
  message: string
  honeypot: string
}
export type FormErrors = Partial<
  Record<keyof ContactFields | 'contact' | 'turnstile', string>
>
export const isValidEmail = (value: string) =>
  value.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return (
    /^\+?[\d\s()-]+$/.test(value) &&
    value.length <= 30 &&
    digits.length >= 7 &&
    digits.length <= 15
  )
}
export function validateContact(
  fields: ContactFields,
  token: string,
): FormErrors {
  const errors: FormErrors = {}
  const name = fields.fullName.trim()
  const email = fields.email.trim()
  const phone = fields.phone.trim()
  if (name.length < 2 || name.length > 120)
    errors.fullName = 'Ingresa un nombre de entre 2 y 120 caracteres.'
  if (fields.companyName.trim().length > 150)
    errors.companyName = 'La empresa no puede superar 150 caracteres.'
  if (!email && !phone)
    errors.contact = 'Completa al menos un correo o un número de contacto.'
  if (email && !isValidEmail(email))
    errors.email = 'Ingresa un correo electrónico válido.'
  if (phone && !isValidPhone(phone))
    errors.phone =
      'Ingresa un teléfono válido, con 7 a 15 dígitos y su prefijo internacional.'
  if (!isSolutionOptionValue(fields.solution))
    errors.solution = 'Selecciona una solución de la lista.'
  if (fields.message.trim().length > 2000)
    errors.message = 'El mensaje no puede superar 2000 caracteres.'
  if (!token.trim()) errors.turnstile = 'Completa la verificación de seguridad.'
  return errors
}
