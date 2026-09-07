import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { loadTs } from './load-ts.mjs'
const { default: App } = await loadTs('src/App.tsx')
const html = renderToStaticMarkup(createElement(App))

test('la landing renderiza con una sola cabecera principal y sin IDs duplicados', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length)
})
test('todos los enlaces internos y relaciones ARIA apuntan a elementos existentes', () => {
  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
  )
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.has(target), target)
  for (const [, targets] of html.matchAll(
    /aria-(?:controls|labelledby|describedby)="([^"]+)"/g,
  )) {
    for (const target of targets.split(' ')) assert.ok(ids.has(target), target)
  }
})
test('todas las imágenes y páginas locales referenciadas existen', () => {
  for (const [, asset] of html.matchAll(
    /(?:src|href)="(\/(?:demos|brands|isotipos)\/[^"?#]+|\/[^"?#]+\.html)"/g,
  ))
    assert.ok(existsSync(`public${asset}`), asset)
})
test('los datos de ejemplo se identifican y las secciones de conversión están presentes', () => {
  assert.ok(html.includes('Datos de ejemplo'))
  assert.ok(html.includes('Interfaz ilustrativa'))
  for (const section of [
    'soluciones',
    'producto',
    'ingenieria',
    'metodologia',
    'integraciones',
    'diagnostico',
    'contacto',
  ])
    assert.ok(html.includes(`id="${section}"`), section)
})
test('canales ausentes o inválidos nunca generan enlaces de contacto falsos', async () => {
  const { getAvailableContactChannels } = await loadTs(
    'src/config/contact.ts',
    {
      VITE_WHATSAPP_NUMBER: '------',
      VITE_CONTACT_PHONE: '++++++',
      VITE_CONTACT_EMAIL: 'x@',
      VITE_LINKEDIN_URL: 'httpbroken',
      VITE_INSTAGRAM_URL: 'javascript:alert(1)',
    },
  )
  assert.deepEqual(getAvailableContactChannels(), [])
})
test('canales válidos se normalizan y codifican el contexto', async () => {
  const { getAvailableContactChannels } = await loadTs(
    'src/config/contact.ts',
    {
      VITE_WHATSAPP_NUMBER: '+51 999 888 777',
      VITE_CONTACT_EMAIL: 'contact@example.test',
      VITE_CONTACT_PHONE: '+51 (1) 555 1234',
    },
  )
  const channels = getAvailableContactChannels('Inventario & ventas')
  assert.equal(channels.length, 3)
  assert.equal(
    channels.find((channel) => channel.id === 'whatsapp').href,
    'https://wa.me/51999888777?text=Inventario%20%26%20ventas',
  )
  assert.equal(
    channels.find((channel) => channel.id === 'call').href,
    'tel:+5115551234',
  )
})
