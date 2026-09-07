import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadTs } from './load-ts.mjs'
const { sendContactLead, isValidEndpoint } = await loadTs(
  'src/services/contactTransport.ts',
)
const { validateContact, isValidPhone } = await loadTs(
  'src/services/contactValidation.ts',
)
const endpoint = 'https://contact.example.test/capture-lead'
const fields = {
  fullName: ' Ana Torres ',
  companyName: ' ',
  email: ' ana@example.test ',
  phone: '',
  solution: 'crm',
  message: ' Necesito organizar las ventas. ',
  honeypot: '',
}
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

test('preserva el contrato capture-lead y normaliza campos opcionales', async () => {
  let request
  const result = await sendContactLead(endpoint, fields, ' token ', {
    fetcher: async (url, options) => {
      request = { url, ...options }
      return json({ success: true })
    },
  })
  assert.equal(result.success, true)
  assert.equal(request.url, endpoint)
  assert.equal(request.method, 'POST')
  assert.deepEqual(JSON.parse(request.body), {
    full_name: 'Ana Torres',
    company_name: null,
    email: 'ana@example.test',
    phone: null,
    service_interest: 'crm',
    message: 'Necesito organizar las ventas.',
    source: 'landing',
    turnstile_token: 'token',
    website_hp: '',
  })
})
test('acepta únicamente confirmación JSON success:true', async () => {
  for (const body of [
    {},
    null,
    { success: false },
    { success: 'true' },
    { message: 'ok' },
    true,
    [],
  ]) {
    const result = await sendContactLead(endpoint, fields, 'token', {
      fetcher: async () => json(body),
    })
    assert.equal(result.success, false, JSON.stringify(body))
    assert.equal(result.error, 'INVALID_RESPONSE')
  }
  for (const response of [
    new Response('<html>Error</html>'),
    new Response(null, { status: 204 }),
  ]) {
    assert.equal(
      (
        await sendContactLead(endpoint, fields, 'token', {
          fetcher: async () => response,
        })
      ).success,
      false,
    )
  }
})
test('maneja errores HTTP sin filtrar mensajes internos ni confirmar un fallo', async () => {
  for (const status of [400, 403, 429, 500]) {
    const result = await sendContactLead(endpoint, fields, 'token', {
      fetcher: async () =>
        json({ success: true, error: 'internal database detail' }, status),
    })
    assert.equal(result.success, false)
    assert.equal(result.error, `HTTP_${status}`)
    assert.equal(result.message.includes('internal database'), false)
  }
})
test('no envía sin configuración válida ni token', async () => {
  let calls = 0
  const fetcher = async () => {
    calls++
    return json({ success: true })
  }
  for (const url of [
    '',
    'http://insecure.example.test',
    'javascript:alert(1)',
    'https://user:password@example.test',
  ]) {
    assert.equal(
      (await sendContactLead(url, fields, 'token', { fetcher })).success,
      false,
    )
  }
  assert.equal(
    (await sendContactLead(endpoint, fields, ' ', { fetcher })).error,
    'TURNSTILE_TOKEN_MISSING',
  )
  assert.equal(calls, 0)
  assert.equal(isValidEndpoint('http://localhost:3000/capture-lead'), true)
})
test('tiempo límite termina una petición colgada y aborta la red', async () => {
  let requestSignal
  const result = await sendContactLead(endpoint, fields, 'token', {
    timeoutMs: 10,
    fetcher: async (_, { signal }) => {
      requestSignal = signal
      return new Promise(() => {})
    },
  })
  assert.equal(result.error, 'TIMEOUT')
  assert.equal(requestSignal.aborted, true)
})
test('tiempo límite también cubre una respuesta cuyo cuerpo no termina', async () => {
  const result = await sendContactLead(endpoint, fields, 'token', {
    timeoutMs: 10,
    fetcher: async () => ({ ok: true, json: () => new Promise(() => {}) }),
  })
  assert.equal(result.error, 'TIMEOUT')
})
test('cancelación externa termina la espera sin falso éxito', async () => {
  const controller = new AbortController()
  const pending = sendContactLead(endpoint, fields, 'token', {
    signal: controller.signal,
    fetcher: async () => new Promise(() => {}),
  })
  controller.abort()
  assert.equal((await pending).error, 'ABORTED')
})
test('una petición previamente cancelada no inicia la red', async () => {
  const controller = new AbortController()
  controller.abort()
  let called = false
  assert.equal(
    (
      await sendContactLead(endpoint, fields, 'token', {
        signal: controller.signal,
        fetcher: async () => {
          called = true
          return json({ success: true })
        },
      })
    ).error,
    'ABORTED',
  )
  assert.equal(called, false)
})
test('un fallo de red permite recuperar el formulario sin filtrar excepciones', async () => {
  const result = await sendContactLead(endpoint, fields, 'token', {
    fetcher: async () => {
      throw new Error('secret internal URL')
    },
  })
  assert.equal(result.error, 'NETWORK_ERROR')
  assert.equal(result.message.includes('secret'), false)
})
test('teléfonos vacíos, solo signos o con formato inválido son rechazados', () => {
  for (const value of [
    '',
    '------',
    '(((((((',
    '+',
    '123456',
    '+51+999888777',
    '999.888.777',
    '1234567890123456',
  ])
    assert.equal(isValidPhone(value), false, value)
  for (const value of ['+51 999 888 777', '999888777', '+1 (631) 555-1181'])
    assert.equal(isValidPhone(value), true, value)
})
test('correo o teléfono es suficiente, pero valida todo dato suministrado', () => {
  assert.deepEqual(validateContact(fields, 'token'), {})
  assert.deepEqual(
    validateContact(
      { ...fields, email: '', phone: '+51 999 888 777' },
      'token',
    ),
    {},
  )
  assert.ok(validateContact({ ...fields, email: '' }, 'token').contact)
  assert.ok(
    validateContact(
      { ...fields, email: 'invalido', phone: '+51 999 888 777' },
      'token',
    ).email,
  )
  assert.ok(validateContact({ ...fields, phone: '------' }, 'token').phone)
})
test('respeta límites y rechaza soluciones fuera del catálogo y token vacío', () => {
  const errors = validateContact(
    {
      ...fields,
      fullName: 'x',
      companyName: 'x'.repeat(151),
      message: 'x'.repeat(2001),
      solution: 'arbitrary',
    },
    '',
  )
  for (const key of [
    'fullName',
    'companyName',
    'message',
    'solution',
    'turnstile',
  ])
    assert.ok(errors[key], key)
})
