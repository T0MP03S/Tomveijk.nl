'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import type { Group, Mesh } from 'three'

/**
 * Het glasobject in de hero.
 *
 * Alles wordt in code opgebouwd: geen gedownload 3D-model, dus geen
 * licentiekwestie op de site waarmee je je diensten verkoopt.
 *
 * De merkkleuren zitten niet in het materiaal zelf maar in de lichtvlakken
 * eromheen. Glas krijgt zijn kleur van wat het weerspiegelt en breekt, dus zo
 * ziet het er veel echter uit dan een gekleurd oppervlak — en het scheelt een
 * HDR-bestand van een paar MB van een externe server.
 */

const GROEN = '#00e93c'
const BLAUW = '#0252f4'
const PAARS = '#b54aff'

function Glasvorm(props: ThreeElements['group']) {
  const groep = useRef<Group>(null)
  const vorm = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (!groep.current || !vorm.current) return

    // Rustige eigen rotatie.
    vorm.current.rotation.x += delta * 0.14
    vorm.current.rotation.y += delta * 0.2

    // Zachte deining, zodat het nooit helemaal stilstaat.
    const t = state.clock.elapsedTime
    groep.current.position.y = Math.sin(t * 0.6) * 0.09

    // Subtiel meebewegen met de muis. Bewust klein gehouden: het moet aanvoelen
    // als diepte, niet als een object dat de cursor achtervolgt.
    const { x, y } = state.pointer
    groep.current.rotation.y += (x * 0.32 - groep.current.rotation.y) * 0.045
    groep.current.rotation.x += (-y * 0.22 - groep.current.rotation.x) * 0.045
  })

  return (
    <group ref={groep} {...props}>
      <mesh ref={vorm} scale={1.05}>
        <torusKnotGeometry args={[1, 0.38, 256, 48]} />
        <MeshTransmissionMaterial
          // Laag gehouden: dit materiaal rendert een extra buffer per frame en
          // is verreweg de duurste post in de scene.
          samples={4}
          resolution={256}
          transmission={1}
          thickness={1.15}
          roughness={0.08}
          ior={1.42}
          chromaticAberration={0.42}
          anisotropy={0.22}
          distortion={0.28}
          distortionScale={0.4}
          temporalDistortion={0.12}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 1000]}
          clearcoat={1}
          color="#ffffff"
        />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      {/* Lichtvlakken in je merkkleuren. Dit is wat je terugziet in het glas. */}
      <Environment resolution={256}>
        <Lightformer intensity={2.4} color={GROEN} position={[-4, 2, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={2.8} color={BLAUW} position={[4, -1, 3]} scale={[8, 8, 1]} />
        <Lightformer intensity={2.2} color={PAARS} position={[0, 4, -3]} scale={[10, 6, 1]} />
        <Lightformer intensity={1.1} color="#ffffff" position={[0, -4, 2]} scale={[10, 4, 1]} />
      </Environment>

      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />

      <Glasvorm />
    </>
  )
}

export default function HeroObject({ className = '' }: { className?: string }) {
  const [mislukt, setMislukt] = useState(false)

  // Zonder WebGL (oude browser, uitgeschakelde hardwareversnelling) tonen we een
  // rustige kleurgloed in plaats van een leeg gat.
  if (mislukt) {
    return <div className={`hero-object-terugval ${className}`} aria-hidden="true" />
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
        onError={() => setMislukt(true)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
