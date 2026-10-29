// Usage: npm run build && npx vite preview --port 4173 & node scripts/screenshots.mjs
// Uses the local `playwright` package if installed, else the sibling app's copy.
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
const require = createRequire(import.meta.url)
let pw
try { pw = require('playwright') } catch { pw = require('/workspace/work/yojana-saathi/node_modules/playwright') }
const URL = process.env.SHOT_URL || 'http://localhost:4173/'
const out = new globalThis.URL('../screenshots/', import.meta.url).pathname
mkdirSync(out, { recursive: true })
const engine = pw[process.env.SHOT_BROWSER || 'firefox']
const browser = await engine.launch({ proxy: undefined, env: { ...process.env, HTTP_PROXY: '', HTTPS_PROXY: '', http_proxy: '', https_proxy: '', ALL_PROXY: '', all_proxy: '' } })
for (const [name, w, h] of [['mobile', 390, 844], ['desktop', 1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  page.on('pageerror', (e) => console.log('PAGE ERROR', e.message))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4500)
  await page.screenshot({ path: `${out}${name}-hero.png` })
  // scroll through so scroll-triggered reveals fire
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= total; y += Math.round(h * 0.6)) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(350)
  }
  await page.waitForTimeout(1500)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log(name, 'height', total, 'horizontal overflow px', overflow)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}${name}-full.png`, fullPage: true })
  await page.close()
}
await browser.close()
