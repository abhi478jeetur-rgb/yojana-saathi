// Records human-paced demo clips (desktop + mobile) of the main flow with Playwright video.
// Output: webm files in docs/assets/_video/<name>.webm (converted to mp4 with ffmpeg afterwards).
// Flow: landing hero -> CTA -> /app -> Hinglish query -> thinking -> typed reply -> cards -> checklist -> schemes -> English query.
// Usage: npm run build && node scripts/demo-video.mjs [desktop|mobile]
// Then: python3 scripts/clean-frames.py docs/assets/_video/<name>.webm <out>.mp4 W H to drop half-painted frames.
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { firefox } from 'playwright'

const which = process.argv[2] || 'desktop'
const OUT = 'docs/assets/_video'
const TMP = `${OUT}/tmp-${which}`
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })

// Serve the built dist through request interception (sandboxed Firefox blocks local http).
const DIST = 'dist'
const ORIGIN = 'https://yojana.demo'

const mobile = which === 'mobile'
const size = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }
const browser = await firefox.launch({ firefoxUserPrefs: { 'network.proxy.type': 0 } })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Visible pointer (desktop) / touch ripple (mobile), since headless video has no cursor.
const overlay = (touch) => `
  addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div')
    c.id = '__cur'
    c.style.cssText = ${JSON.stringify(
      touch
        ? 'position:fixed;z-index:99999;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.85);opacity:0;transition:opacity .25s,transform .25s;left:-100px;top:-100px'
        : 'position:fixed;z-index:99999;pointer-events:none;width:22px;height:22px;margin:-3px 0 0 -3px;left:-100px;top:-100px;background:url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2722%27 height=%2722%27><path d=%27M3 2l14 9-6 1.5L8 19z%27 fill=%27white%27 stroke=%27black%27 stroke-width=%271.4%27/></svg>") no-repeat;transition:transform .15s'
    )}
    document.body.appendChild(c)
    addEventListener('mousemove', (e) => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px' }, true)
    addEventListener('pointerdown', (e) => {
      c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'
      ${touch ? "c.style.opacity = 1; c.style.transform = 'scale(.8)'; setTimeout(() => { c.style.opacity = 0; c.style.transform = 'scale(1.3)' }, 260)" : "c.style.transform = 'scale(.8)'; setTimeout(() => (c.style.transform = ''), 160)"}
    }, true)
  })`

try {
  const ctx = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    ...(mobile ? { isMobile: false, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36' } : {}),
    recordVideo: { dir: TMP, size }
  })
  await ctx.route(`${ORIGIN}/**`, (r) => {
    let f = decodeURIComponent(new URL(r.request().url()).pathname)
    if (f === '/' || !existsSync(DIST + f)) f = '/index.html'
    r.fulfill({ path: DIST + f })
  })
  const page = await ctx.newPage()
  await page.addInitScript(overlay(mobile))
  let mx = size.width / 2
  let my = size.height / 2

  const smoothScrollTo = async (y, ms = 900) => {
    await page.evaluate(
      ([y, ms]) =>
        new Promise((res) => {
          const s = scrollY, t0 = performance.now()
          const step = (t) => {
            const k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
            scrollTo(0, s + (y - s) * e)
            k < 1 ? requestAnimationFrame(step) : res()
          }
          requestAnimationFrame(step)
        }),
      [y, ms]
    )
  }
  const scrollToEl = async (loc, offset = 120, ms = 900) => {
    const top = await loc.evaluate((el) => el.getBoundingClientRect().top + scrollY)
    await smoothScrollTo(Math.max(0, top - offset), ms)
  }
  const act = async (loc, { scroll = true, offset } = {}) => {
    if (scroll) {
      const inView = await loc.evaluate((el) => {
        const r = el.getBoundingClientRect()
        return r.top > 70 && r.bottom < innerHeight - 110
      })
      if (!inView) await scrollToEl(loc, offset ?? Math.round(size.height * 0.4), 700)
    }
    const b = await loc.boundingBox()
    const x = b.x + b.width / 2, y = b.y + b.height / 2
    if (mobile) {
      await page.evaluate(([x, y]) => dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y })), [x, y])
      await wait(120)
      await page.touchscreen.tap(x, y)
    } else {
      await page.mouse.move(x, y, { steps: 22 })
      mx = x; my = y
      await wait(220)
      await page.mouse.click(x, y)
    }
  }

  {
    // 0. Landing hero with the capsule loop, a little scroll, then the CTA into /app
    await page.goto(`${ORIGIN}/`).catch(() => {})
    await page.waitForSelector('.lp-capsule img')
    await page.waitForLoadState('networkidle')
    await wait(5200)
    await smoothScrollTo(mobile ? 700 : 820, 1500)
    await wait(1500)
    await smoothScrollTo(0, 1100)
    await wait(700)
    await act(page.locator('.lp-foot .lp-pill'), { scroll: false })
    await page.waitForSelector('#q')
    await page.waitForLoadState('networkidle')
    await wait(1800)
    // 1. Hinglish query typed by hand
    await act(page.locator('#q'))
    await page.keyboard.type('main kisan hoon, 2 acre zameen, beti college jaayegi', { delay: 70 })
    await wait(600)
    await act(page.locator('button[type=submit]'))
    await wait(300)
    if (mobile) await scrollToEl(page.locator('.results'), 70, 800)
    await page.waitForSelector('.scheme-card')
    await wait(2600)
    // 2. Open PM-KISAN details
    const card = page.locator('.scheme-card', { has: page.locator('h3', { hasText: 'PM-KISAN' }) }).first()
    if ((await card.locator('.btn-ghost').getAttribute('aria-expanded')) !== 'true') await act(card.locator('.btn-ghost'), { offset: mobile ? 240 : 300 })
    else await scrollToEl(card, mobile ? 80 : 100, 800)
    await wait(900)
    await scrollToEl(card.locator('.docs'), mobile ? 200 : 260, 900)
    await wait(900)
    const docs = card.locator('.docs button')
    for (let i = 0; i < 2; i++) {
      await act(docs.nth(i), { scroll: false })
      await wait(650)
    }
    // 3. Save
    // Ticking a document already saves the scheme; only press Save when it is not saved yet.
    const save = card.locator('.btn-save')
    if ((await save.getAttribute('aria-pressed')) !== 'true') await act(save, { offset: mobile ? 300 : 400 })
    else {
      await scrollToEl(save, mobile ? 300 : 400, 700)
      const b = await save.boundingBox()
      if (!mobile) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 18 })
    }
    await wait(1300)
    // 4. Checklist tab
    const nav = mobile ? '.bottom-nav' : '.desk-tabs'
    await act(page.locator(`${nav} button`, { hasText: 'Checklist' }), { scroll: false })
    await wait(2600)
    await smoothScrollTo(mobile ? 380 : 250, 1100)
    await wait(1600)
    // 5. Schemes tab, browse a category
    await act(page.locator(`${nav} button`, { hasText: 'Schemes' }), { scroll: false })
    await wait(1800)
    await act(page.locator('.cat-chip', { hasText: 'Farmers' }), { scroll: false })
    await wait(1500)
    await smoothScrollTo(mobile ? 600 : 400, 1300)
    await wait(1200)
    await smoothScrollTo(0, 900)
    await wait(500)
    // 6. English query from Home
    await act(page.locator(`${nav} button`, { hasText: 'Home' }), { scroll: false })
    await wait(1400)
    await act(page.locator('#q'))
    await page.locator('#q').fill('')
    await page.keyboard.type('I am a widow, 62 years old, living in a village', { delay: 65 })
    await wait(600)
    await act(page.locator('button[type=submit]'))
    await wait(300)
    if (mobile) await scrollToEl(page.locator('.results'), 70, 800)
    await page.waitForSelector('.scheme-card')
    await wait(2800)
    await smoothScrollTo((await page.evaluate(() => scrollY)) + (mobile ? 700 : 500), 1600)
    await wait(1800)
  }
  await ctx.close()
} finally {
  await browser.close()
}
const f = readdirSync(TMP).find((x) => x.endsWith('.webm'))
renameSync(`${TMP}/${f}`, `${OUT}/${which}.webm`)
rmSync(TMP, { recursive: true, force: true })
console.log(`saved ${OUT}/${which}.webm`)
