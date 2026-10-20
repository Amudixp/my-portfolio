import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// Inline the extracted stylesheet into index.html so first paint is not
// blocked by an extra stylesheet request. The generated CSS only references
// data-URI assets, so inlining it is safe.
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    closeBundle() {
      const distDir = join(process.cwd(), 'dist')
      const htmlPath = join(distDir, 'index.html')
      let html: string
      try {
        html = readFileSync(htmlPath, 'utf8')
      } catch {
        return
      }
      let inlined = false
      const assetsDir = join(distDir, 'assets')
      for (const file of readdirSync(assetsDir)) {
        if (!file.endsWith('.css')) continue
        const href = `/assets/${file}`
        if (!html.includes(href)) continue
        const css = readFileSync(join(assetsDir, file), 'utf8').replace(
          /\/\*#\s*sourceMappingURL=.*?\*\//g,
          ''
        )
        const linkPattern = new RegExp(
          `<link[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
          'g'
        )
        if (!linkPattern.test(html)) continue
        html = html.replace(linkPattern, () => `<style>${css}</style>`)
        inlined = true
        unlinkSync(join(assetsDir, file))
        try {
          unlinkSync(join(assetsDir, `${file}.map`))
        } catch {
          // sourcemap may be disabled
        }
      }
      if (inlined) writeFileSync(htmlPath, html)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
  assetsInclude: ['**/*.glb'],
  build: {
    sourcemap: true,
  },
})
