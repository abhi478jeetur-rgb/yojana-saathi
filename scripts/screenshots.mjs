// Takes README screenshots of the landing page ("/") and the app ("/app") with Playwright (Firefox).
// Run `npm run build` first. Usage: node scripts/screenshots.mjs
// The built dist is served through request interception (sandboxed Firefox may block local http).
import { existsSync } from 'node:fs'
import { firefox } from 'playwright'

const ORIGIN = 'https://yojana.demo'
const OUT = 'docs/assets'
const QUERY = 'main kisan hoon, 2 acre zameen, beti college jaayegi'

const browser = await firefox.launch({ firefoxUserPrefs: { 'network.proxy.type': 0 } })
try {
  for (const [name, viewport] of [
    ['mobile', { width: 390, height: 844 }],
    ['desktop', { width: 1440, height: 900 }]
  ]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, reducedMotion: 'reduce' })
    await ctx.route(`${ORIGIN}/**`, (r) => {
      let f = decodeURIComponent(new URL(r.request().url()).pathname)
      if (f === '/' || !existsSync('dist' + f)) f = '/index.html'
      r.fulfill({ path: 'dist' + f })
    })
    const page = await ctx.newPage()

    await page.goto(`${ORIGIN}/`)
    await page.waitForSelector('.lp-capsule img')
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${OUT}/${name}-landing.png` })
    await page.screenshot({ path: `${OUT}/_${name}-landing-full.png`, fullPage: true, scale: 'css' })

    await page.click('.lp-foot .lp-pill')
    await page.waitForSelector('#q')
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/${name}-home.png` })

    await page.fill('#q', QUERY)
    await page.click('button[type=submit]')
    await page.waitForSelector('.scheme-card')
    await page.waitForTimeout(500)
    if (name === 'mobile') await page.evaluate(() => document.querySelector('.results').scrollIntoView())
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${OUT}/${name}-results.png` })

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
    await ctx.close()
  }
} finally {
  await browser.close()
}
console.log('screenshots saved to', OUT)
