import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { isLowPowerDevice, random } from '../utils/helpers'

interface ParticleData {
  curve: number
  t: number
  speed: number
  wobble: number
}

/** Build a soft circular sprite once for all points. */
function makeSprite(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

/** Pre-sample each curve into a flat lookup table for cheap per-frame lookup. */
function sampleCurves(curves: THREE.CatmullRomCurve3[], samples: number) {
  return curves.map((curve) => {
    const table = new Float32Array(samples * 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < samples; i++) {
      curve.getPoint(i / (samples - 1), v)
      table[i * 3] = v.x
      table[i * 3 + 1] = v.y
      table[i * 3 + 2] = v.z
    }
    return table
  })
}

const PALETTE = [new THREE.Color('#22d3ee'), new THREE.Color('#8b5cf6'), new THREE.Color('#f472b6')]
const SAMPLES = 220

function FlowField({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const posAttr = useRef<THREE.BufferAttribute>(null)

  const { tables, data, positions, colors, sprite } = useMemo(() => {
    const curves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -2, -2), new THREE.Vector3(-4, 3, 1),
        new THREE.Vector3(1, -2, -1), new THREE.Vector3(6, 2, 2), new THREE.Vector3(11, -1, -2),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 3, 1), new THREE.Vector3(-5, -3, -2),
        new THREE.Vector3(0, 3, 2), new THREE.Vector3(5, -2, -1), new THREE.Vector3(11, 2, 1),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-11, 0, -3), new THREE.Vector3(-3, 1, 2),
        new THREE.Vector3(3, -1, -2), new THREE.Vector3(9, 1, 2),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-9, -3, 2), new THREE.Vector3(-2, 3, -1),
        new THREE.Vector3(4, -3, 1), new THREE.Vector3(11, 1, -2),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 1, 0), new THREE.Vector3(-2, -1, 3),
        new THREE.Vector3(5, 3, -2), new THREE.Vector3(11, -1, 1),
      ]),
    ]
    const tables = sampleCurves(curves, SAMPLES)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const data: ParticleData[] = []

    for (let i = 0; i < count; i++) {
      const curve = Math.floor(Math.random() * curves.length)
      const t = Math.random()
      data.push({ curve, t, speed: random(0.0004, 0.0014), wobble: random(0, Math.PI * 2) })
      const c = PALETTE[curve % PALETTE.length].clone().lerp(PALETTE[(curve + 1) % PALETTE.length], Math.random())
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      // initial positions
      const table = tables[curve]
      const idx = Math.floor(t * (SAMPLES - 1)) * 3
      positions[i * 3] = table[idx]
      positions[i * 3 + 1] = table[idx + 1]
      positions[i * 3 + 2] = table[idx + 2]
    }

    return { tables, data, positions, colors, sprite: makeSprite() }
  }, [count])

  useFrame((state, delta) => {
    if (!posAttr.current) return
    const arr = posAttr.current.array as Float32Array
    const dt = Math.min(delta, 0.05) * 60

    for (let i = 0; i < data.length; i++) {
      const p = data[i]
      p.t += p.speed * dt
      if (p.t >= 1) p.t -= 1
      const table = tables[p.curve]
      const f = p.t * (SAMPLES - 1)
      const i0 = Math.floor(f) * 3
      const i1 = Math.min(i0 + 3, table.length - 3)
      const frac = f - Math.floor(f)
      // wobble for organic motion
      const wob = Math.sin(p.wobble + p.t * 18) * 0.06
      arr[i * 3] = table[i0] + (table[i1] - table[i0]) * frac
      arr[i * 3 + 1] = table[i0 + 1] + (table[i1 + 1] - table[i0 + 1]) * frac + wob
      arr[i * 3 + 2] = table[i0 + 2] + (table[i1 + 2] - table[i0 + 2]) * frac
    }
    posAttr.current.needsUpdate = true

    if (groupRef.current) {
      const targetY = state.pointer.y * 0.18
      const targetX = state.pointer.x * 0.18
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.04
    }
  })

  useEffect(() => {
    return () => {
      // Textures/geometries created imperatively must be released manually.
      sprite.dispose()
    }
  }, [sprite])

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute ref={posAttr} attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          map={sprite}
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

/** Full-screen animated data-stream field. */
export default function HeroScene({ paused = false }: { paused?: boolean }) {
  const count = isLowPowerDevice() ? 900 : 2600

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 13], fov: 55 }}
      dpr={[1, 1.6]}
      frameloop={paused ? 'never' : 'always'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <color attach="background" args={['#07070b']} />
      <fog attach="fog" args={['#07070b', 12, 26]} />
      <FlowField count={count} />
    </Canvas>
  )
}
