/** Tiny class-name joiner — avoids pulling in clsx for a portfolio. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const random = (min: number, max: number) => Math.random() * (max - min) + min

/** Check whether the device should skip heavy effects (mobile / low power). */
export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return true
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.matchMedia('(max-width: 768px)').matches
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4
  return coarse || small || lowCores
}

/**
 * Generate a unique, subtly animated abstract SVG preview for each project.
 * The CSS animations live inside the SVG so they keep running when the SVG is
 * used as an <img> source, and they honour prefers-reduced-motion.
 */
export function projectArtSvg(hue: number, kind: string): string {
  const c1 = `hsl(${hue} 85% 60%)`
  const c2 = `hsl(${(hue + 60) % 360} 85% 65%)`
  const c3 = `hsl(${(hue + 140) % 360} 85% 68%)`

  const style = `<style>
    .mover{animation:travel 5s linear infinite}
    .mover.b{animation-duration:6.2s;animation-delay:-2s}
    .mover.c{animation-duration:7.4s;animation-delay:-4s}
    .bob{animation:bob 1.6s ease-in-out infinite alternate}
    .rise{transform-box:fill-box;transform-origin:bottom;animation:rise 2.4s ease-in-out infinite alternate}
    .spin{transform-box:fill-box;transform-origin:center;animation:spin 14s linear infinite}
    .spin.rev{animation-direction:reverse;animation-duration:20s}
    .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.6s ease-out infinite}
    .pulse.d1{animation-delay:-0.9s}.pulse.d2{animation-delay:-1.8s}
    .dash{animation:dash 3s linear infinite}
    .sweep{transform-box:fill-box;transform-origin:center;animation:spin 6s linear infinite}
    @keyframes travel{from{transform:translate(-30px,0)}to{transform:translate(630px,0)}}
    @keyframes bob{from{transform:translateY(-16px)}to{transform:translateY(16px)}}
    @keyframes rise{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{from{transform:scale(.6);opacity:.9}to{transform:scale(1.7);opacity:0}}
    @keyframes dash{to{stroke-dashoffset:-100}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}}
  </style>`

  let motif = ''

  switch (kind) {
    // Flowing nodes along curvy data streams (ETL).
    case 'pipeline':
      motif = `
        <path d="M-20 120 C120 20 200 200 320 90 S520 160 620 60" stroke="url(#line)" stroke-width="3" fill="none"/>
        <path d="M-20 180 C140 100 220 240 360 140 S540 220 620 130" stroke="url(#line)" stroke-width="2" fill="none" opacity=".5"/>
        <path d="M-20 70 C120 160 220 30 360 110 S540 40 620 100" stroke="${c3}" stroke-width="1.5" fill="none" opacity=".35"/>
        <g class="mover"><g class="bob"><circle cx="0" cy="120" r="7" fill="${c1}"/><circle cx="0" cy="120" r="13" fill="none" stroke="${c1}" opacity=".4"/></g></g>
        <g class="mover b"><g class="bob"><circle cx="0" cy="180" r="5" fill="${c2}"/></g></g>
        <g class="mover c"><g class="bob"><circle cx="0" cy="70" r="5" fill="${c3}"/></g></g>
        ${[110, 250, 390, 520].map((x, i) => `<circle cx="${x}" cy="${95 + (i % 2) * 45}" r="3" fill="${[c1, c2, c3][i % 3]}" opacity=".7"/>`).join('')}`
      break

    // Falling churn bars with a declining trend line.
    case 'churn':
      motif = `
        ${[60, 120, 180, 240, 300, 360, 420, 480, 540].map((x, i) => {
          const h = 165 - i * 14
          return `<rect class="rise" style="animation-delay:-${i * 0.18}s" x="${x}" y="${200 - h}" width="34" height="${h}" rx="5" fill="${i % 3 === 0 ? c3 : c1}" opacity="${0.3 + i * 0.06}"/>`
        }).join('')}
        <path class="dash" d="M40 45 Q160 90 280 130 T560 205" stroke="${c2}" stroke-width="3" fill="none" stroke-dasharray="9 8"/>
        <circle cx="560" cy="205" r="6" fill="${c2}"/>`
      break

    // Risk gauges — counter-rotating dials.
    case 'credit':
      motif = `
        <circle cx="300" cy="130" r="98" stroke="none" fill="${c1}" opacity=".05"/>
        <g class="spin"><circle cx="300" cy="130" r="92" stroke="url(#line)" stroke-width="13" fill="none" stroke-dasharray="330 580" stroke-linecap="round"/></g>
        <g class="spin rev"><circle cx="300" cy="130" r="66" stroke="${c2}" stroke-width="9" fill="none" stroke-dasharray="210 415" stroke-linecap="round" opacity=".8"/></g>
        <g class="pulse"><circle cx="300" cy="130" r="34" fill="none" stroke="${c3}" stroke-width="2"/></g>
        <circle cx="300" cy="130" r="26" fill="${c3}" opacity=".85"/>
        <text x="300" y="137" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="#07070b">RISK</text>`
      break

    // Satellite grid with expanding signal rings and a sweeping radar line.
    case 'satellite':
      motif = `
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 75} 0 V260" stroke="${c1}" stroke-width=".6" opacity=".16"/>`).join('')}
        ${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${i * 65} H600" stroke="${c1}" stroke-width=".6" opacity=".16"/>`).join('')}
        <g class="pulse"><circle cx="300" cy="130" r="40" fill="none" stroke="${c2}" stroke-width="2"/></g>
        <g class="pulse d1"><circle cx="300" cy="130" r="40" fill="none" stroke="${c2}" stroke-width="2"/></g>
        <g class="pulse d2"><circle cx="300" cy="130" r="40" fill="none" stroke="${c2}" stroke-width="2"/></g>
        <g class="sweep"><path d="M300 130 L300 12 A118 118 0 0 1 400 55 Z" fill="${c3}" opacity=".16"/></g>
        ${[110, 200, 380, 470].map((x, i) => `<rect x="${x}" y="${70 + (i % 2) * 80}" width="20" height="20" rx="2" fill="${[c1, c2, c3][i % 3]}" opacity=".8"/>`).join('')}
        <circle cx="300" cy="130" r="12" fill="${c1}"/>`
      break

    // Shield + broken link — malicious URL detection.
    default: // phishing
      motif = `
        <g class="spin"><circle cx="300" cy="130" r="82" fill="none" stroke="url(#line)" stroke-width="2" stroke-dasharray="5 10"/></g>
        <path d="M300 52 L370 82 V132 C370 178 338 202 300 216 C262 202 230 178 230 132 V82 Z" fill="none" stroke="url(#line)" stroke-width="4"/>
        <path d="M300 76 L348 98 V132 C348 165 327 184 300 195 C273 184 252 165 252 132 V98 Z" fill="${c1}" opacity=".08"/>
        <g class="pulse"><circle cx="300" cy="132" r="30" fill="none" stroke="${c3}" stroke-width="2"/></g>
        <path d="M280 132 h-22 m64 0 h22" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>
        <path d="M286 118 l-8 14 8 14 M314 118 l8 14 -8 14" stroke="${c3}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="300" cy="132" r="4" fill="${c3}"/>`
  }

  const defs = `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 45% 11%)"/>
      <stop offset="1" stop-color="#07070b"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c1}"/><stop offset="0.5" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/>
    </linearGradient>
  </defs>`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260">${style}${defs}<rect width="600" height="260" fill="url(#bg)"/>${motif}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
