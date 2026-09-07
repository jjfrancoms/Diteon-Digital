// Behavioral contract verification replaces frozen source hashes so defects can be fixed.
// These tests exercise the actual transport and validation modules against isolated fixtures.
import { spawnSync } from 'node:child_process'
const result = spawnSync(
  process.execPath,
  ['--test', 'tests/contact.test.mjs'],
  { stdio: 'inherit', cwd: new URL('..', import.meta.url) },
)
process.exit(result.status ?? 1)
