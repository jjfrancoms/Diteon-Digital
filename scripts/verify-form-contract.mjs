import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const expected = JSON.parse(fs.readFileSync(path.join(root, 'scripts/form-contract-hashes.json'), 'utf8'))
let failed = false
for (const [rel, expectedHash] of Object.entries(expected)) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) {
    console.error(`MISSING: ${rel}`)
    failed = true
    continue
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  if (actual !== expectedHash) {
    console.error(`CHANGED: ${rel}\n expected ${expectedHash}\n actual   ${actual}`)
    failed = true
  }
}

const contact = fs.readFileSync(path.join(root,'src/components/ContactModal.tsx'),'utf8')
const service = fs.readFileSync(path.join(root,'src/services/contactService.ts'),'utf8')
const mustHave = [
  [contact, "status === 'submitting'", 'double-submit guard'],
  [contact, 'TurnstileWidget', 'Turnstile widget'],
  [contact, 'honeypot', 'honeypot state'],
  [service, 'VITE_CAPTURE_LEAD_FUNCTION_URL', 'capture-lead endpoint'],
  [service, 'turnstile_token', 'Turnstile token payload'],
  [service, 'website_hp', 'honeypot payload'],
  [service, "source: 'landing'", 'landing source'],
]
for (const [text, needle, label] of mustHave) {
  if (!text.includes(needle)) {
    console.error(`CONTRACT MISSING: ${label}`)
    failed = true
  }
}
if (failed) process.exit(1)
console.log('FORM CONTRACT CHECK OK — all original critical files are byte-for-byte preserved.')
