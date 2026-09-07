import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import ts from 'typescript'

// Compile actual TypeScript modules in memory. Environment fixtures never enter the app build.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(path.join(root, 'package.json'))
export async function loadTs(relative, env = {}) {
  const cache = new Map()
  async function moduleUrl(file) {
    if (cache.has(file)) return cache.get(file)
    let code = ts.transpileModule(await fs.readFile(file, 'utf8'), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText
    code = code.replaceAll('import.meta.env', `(${JSON.stringify(env)})`)
    for (const match of [...code.matchAll(/from\s+['"]([^'"]+)['"]/g)]) {
      let url
      if (match[1].startsWith('.')) {
        let target = path.resolve(path.dirname(file), match[1])
        if (!path.extname(target))
          target += existsSync(target + '.ts') ? '.ts' : '.tsx'
        url = await moduleUrl(target)
      } else url = pathToFileURL(require.resolve(match[1])).href
      code = code.replace(match[0], `from '${url}'`)
    }
    const url = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
    cache.set(file, url)
    return url
  }
  return import(await moduleUrl(path.resolve(root, relative)))
}
