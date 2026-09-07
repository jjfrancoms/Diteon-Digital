import type { SolutionOptionValue } from './solutionOptions'

export type ContactHandler = (
  solution?: SolutionOptionValue,
  message?: string,
) => void
export const needs = [
  {
    id: 'crm',
    label: 'Organizar ventas',
    title: 'Cada oportunidad, con un siguiente paso.',
    description:
      'Reúne contactos, conversaciones y tareas para que el seguimiento no dependa de recordar un mensaje.',
    benefits: [
      'Clientes e historial en un solo lugar',
      'Responsables y próximas acciones',
      'Visibilidad de tu proceso comercial',
    ],
    visual: 'crm',
  },
  {
    id: 'inventario',
    label: 'Controlar inventario',
    title: 'Saber qué tienes. Y qué hace falta.',
    description:
      'Conecta entradas, salidas y puntos de venta para trabajar con información clara sobre tus productos.',
    benefits: [
      'Movimientos y existencias por producto',
      'Alertas con reglas de tu negocio',
      'Inventario conectado con ventas y caja',
    ],
    visual: 'inventory',
  },
  {
    id: 'automatizacion',
    label: 'Automatizar tareas',
    title: 'Menos tareas repetidas. Más continuidad.',
    description:
      'Conecta tus herramientas y define qué debe ocurrir después de cada evento, con reglas y responsables claros.',
    benefits: [
      'Captura y asignación de solicitudes',
      'Avisos y tareas de seguimiento',
      'Trazabilidad de cada ejecución',
    ],
    visual: 'automation',
  },
  {
    id: 'a-medida',
    label: 'Crear una plataforma',
    title: 'Un sistema que encaje con tu operación.',
    description:
      'Diseñamos portales y aplicaciones con los módulos, permisos y flujos que necesitan tus usuarios.',
    benefits: [
      'Experiencias adaptadas a cada rol',
      'Módulos que puedes incorporar por fases',
      'Datos y herramientas conectados',
    ],
    visual: 'custom',
  },
] as const satisfies readonly {
  id: SolutionOptionValue
  label: string
  title: string
  description: string
  benefits: readonly string[]
  visual: string
}[]
