// Records the main flow on a mobile viewport and converts it to docs/assets/demo.gif.
// Needs ffmpeg on PATH. Run `npm run build` first.
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync } from 'node:fs'
import { firefox } from 'playwright'

const PORT = 4180
const URL = `http://127.0.0.1:${PORT}/`
const VID = 'docs/assets/_video'
rmSync(VID, { recursive: true, force: true })
mkdirSync(VID, { recursive: true })

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { stdio: 'ignore', detached: true })
await new Promise((r) => setTimeout(r, 2500))
const browser = await firefox.launch({ firefoxUserPrefs: { 'network.proxy.type': 0 } })
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, recordVideo: { dir: VID, size: { width: 390, height: 844 } } })
  const page = await ctx.newPage()
  await page.goto(URL)
  await page.waitForTimeout(1200)
  await page.click('#q')
  await page.keyboard.type('main kisan hoon, 2 acre zameen, beti college jaayegi', { delay: 45 })
  await page.waitForTimeout(400)
  await page.click('button[type=submit]')
  await page.mouse.move(200, 30)
  await page.waitForTimeout(400)
  await page.evaluate(() => document.querySelector('.results').scrollIntoView())
  await page.waitForTimeout(1800)
  await page.mouse.wheel(0, 520)
  await page.waitForTimeout(900)
  const docs = page.locator('.scheme-card').first().locator('.docs button')
  for (let i = 0; i < 3; i++) {
    await docs.nth(i).click()
    await page.mouse.move(200, 30)
    await page.waitForTimeout(350)
  }
  await page.waitForTimeout(500)
  await page.click('.bottom-nav button:has-text("Schemes")')
  await page.waitForTimeout(1600)
  await page.click('.bottom-nav button:has-text("Checklist")')
  await page.waitForTimeout(1800)
  await ctx.close()
} finally {
  await browser.close()
  process.kill(-server.pid)
}
const video = `${VID}/${readdirSync(VID).find((f) => f.endsWith('.webm'))}`
const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]))
const start = 2.2 // skip the blank page while the first paint loads
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(start), '-t', String(duration - start - 0.6), '-i', video, '-vf', 'fps=10,scale=360:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4', 'docs/assets/demo.gif'])
rmSync(VID, { recursive: true, force: true })
console.log('saved docs/assets/demo.gif')
