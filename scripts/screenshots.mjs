// Takes README screenshots with Playwright. Run `npm run build` first.
// Usage: node scripts/screenshots.mjs
import { spawn } from 'node:child_process'
import { firefox } from 'playwright'

const PORT = 4179
const URL = `http://127.0.0.1:${PORT}/`
const OUT = 'docs/assets'
const QUERY = 'main kisan hoon, 2 acre zameen, beti college jaayegi'

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { stdio: 'ignore', detached: true })
await new Promise((r) => setTimeout(r, 2500))

// Bypass any HTTP proxy for localhost
const browser = await firefox.launch({ firefoxUserPrefs: { 'network.proxy.type': 0 } })
try {
  for (const [name, viewport] of [
    ['mobile', { width: 390, height: 844 }],
    ['desktop', { width: 1440, height: 900 }]
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2, reducedMotion: 'reduce' })
    await page.goto(URL)
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/${name}-home.png` })

    await page.fill('#q', QUERY)
    await page.click('button[type=submit]')
    await page.waitForSelector('.scheme-card')
    await page.waitForTimeout(500)
    if (name === 'mobile') await page.evaluate(() => document.querySelector('.results').scrollIntoView())
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${OUT}/${name}-results.png` })

    // tick two documents and save, then open checklist
    const docs = page.locator('.scheme-card').first().locator('.docs button')
    await docs.nth(0).click()
    await docs.nth(1).click()
    const nav = name === 'mobile' ? '.bottom-nav' : '.desk-nav'
    await page.click(`${nav} button:has-text("Schemes")`)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/${name}-schemes.png` })
    await page.click(`${nav} button:has-text("Checklist")`)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/${name}-checklist.png` })
    await page.close()
  }
} finally {
  await browser.close()
  process.kill(-server.pid)
}
console.log('screenshots saved to', OUT)
