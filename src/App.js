import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import Terminal from './Terminal'
import lanyardPhoto from './front.jpg'
import lanyardBackPhoto from './lanyardbackphoto.jpeg'

extend({ MeshLineGeometry, MeshLineMaterial })
useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
useTexture.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg')

// ── Custom card texture ───────────────────────────────────────────────────────
function useCardTexture(photoSrc) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    // Use full photo dimensions without padding
    const W = 308, H = 393
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    function draw(photo) {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)

      if (photo) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Calculate scale to COVER canvas fully (object-fit: cover)
        const canvasAspect = W / H
        const aspectRatio = photo.naturalWidth / photo.naturalHeight

        let scale
        if (aspectRatio > canvasAspect) {
          scale = H / photo.naturalHeight
        } else {
          scale = W / photo.naturalWidth
        }

        const dw = photo.naturalWidth * scale
        const dh = photo.naturalHeight * scale
        const sx = (W - dw) / 2
        const sy = (H - dh) / 2

        ctx.drawImage(photo, sx, sy, dw, dh)
      }

      const tex = new THREE.CanvasTexture(canvas)
      // Fix UV orientation for this GLB card mesh:
      // flipY=false: canvas-top maps to card-top
      // repeat.x=-1 + offset.x=1: mirrors horizontally (card UV is reflected)
      tex.flipY = false
      tex.repeat.set(-1, 1)
      tex.offset.set(1, 0)
      tex.needsUpdate = true
      setTexture(tex)
    }

    if (photoSrc) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => draw(img)
      img.onerror = () => draw(null)
      img.src = photoSrc
    } else {
      draw(null)
    }
  }, [photoSrc])

  return texture
}

// ── Back card texture (full-bleed photo) ─────────────────────────────────────
function useBackCardTexture(photoSrc) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const W = 1200, H = 1600
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    function draw(photo) {
      // Draw normally — UV corrected via Three.js tex.repeat/offset below
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)

      if (photo) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Calculate scale to COVER canvas fully (object-fit: cover)
        const canvasAspect = W / H
        const aspectRatio = photo.naturalWidth / photo.naturalHeight

        let scale
        if (aspectRatio > canvasAspect) {
          // Photo is wider than canvas ratio: scale by height to cleanly crop horizontal edges
          scale = H / photo.naturalHeight
        } else {
          // Photo is taller than canvas ratio: scale by width to cleanly crop vertical edges
          scale = W / photo.naturalWidth
        }

        const dw = photo.naturalWidth * scale
        const dh = photo.naturalHeight * scale
        const sx = (W - dw) / 2
        const sy = (H - dh) / 2

        ctx.drawImage(photo, sx, sy, dw, dh)
      }

      const tex = new THREE.CanvasTexture(canvas)
      tex.flipY = false
      tex.repeat.set(-1, 1)
      tex.offset.set(1, 0)
      tex.needsUpdate = true
      setTexture(tex)
    }

    if (photoSrc) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => draw(img)
      img.onerror = () => draw(null)
      img.src = photoSrc
    } else draw(null)
  }, [photoSrc])

  return texture
}

// ── App ───────────────────────────────────────────────────────────────────────
import Desktop from './Desktop'

function MobileOrientationPrompt({ onContinue }) {
  return (
    <div className="orientation-prompt">
      <div className="orientation-icon">📱</div>
      <h2>Rotate your device</h2>
      <p>Please switch to landscape mode for the best experience with the 3D lanyard and terminal.</p>
      <button className="continue-btn" onClick={onContinue}>
        CONTINUE ANYWAY
      </button>
    </div>
  )
}

export default function App() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [desktopMode, setDesktopMode] = useState(true)
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false)
  const [ignoredPrompt, setIgnoredPrompt] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const isPortrait = window.innerHeight > window.innerWidth
      setShowOrientationPrompt(isMobile && isPortrait && !ignoredPrompt)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [ignoredPrompt])

  if (showOrientationPrompt) {
    return <MobileOrientationPrompt onContinue={() => setIgnoredPrompt(true)} />
  }

  if (desktopMode) {
    return <Desktop onExit={() => setDesktopMode(false)} />
  }

  return (
    <div className="portfolio">
      {/* Section 1: Hero */}
      <header className="hero">
        <h1 className="hero-name">Arnab Das</h1>
        <span className="hero-tag">vibecoder</span>
      </header>

      {/* Sections 2 & 3 */}
      <div className="portfolio-bottom">
        <div className="lanyard-panel">
          <LanyardCanvas isFlipped={isFlipped} />
          <button
            className="flip-button"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(167,139,250,0.5)',
              color: '#a78bfa',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              backdropFilter: 'blur(4px)'
            }}>
            FLIP CARD
          </button>
          <span className="lanyard-hint">drag the badge ↑</span>
        </div>
        <Terminal onDesktopSwitch={() => setDesktopMode(true)} />
      </div>
    </div>
  )
}

function LanyardCanvas({ isFlipped }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={Math.PI} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band isFlipped={isFlipped} />
      </Physics>
      <Environment background blur={0.75}>
        <color attach="background" args={['#0d0d0d']} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10, isFlipped }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const quat = new THREE.Quaternion(), euler = new THREE.Euler(0, 0, 0, 'YXZ')
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
  const texture = useTexture('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg')
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  // Custom card textures — front (portrait + name) and back (full-bleed photo)
  const customCardTex = useCardTexture(lanyardPhoto)
  const backCardTex = useBackCardTexture(lanyardBackPhoto)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
        ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      ang.copy(card.current.angvel())

      const q = card.current.rotation()
      quat.set(q.x, q.y, q.z, q.w)
      euler.setFromQuaternion(quat, 'YXZ')

      const targetRotY = isFlipped ? Math.PI : 0;
      let rotDiff = euler.y - targetRotY;

      // Normalize rotation difference to [-PI, PI] for shortest path
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;

      // Multiply by 0.125 to match the exact same restoring force of the original quaternion-based spring
      card.current.setAngvel({ x: ang.x, y: ang.y - rotDiff * 0.125, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            {/* Front face — slightly forward to avoid z-fighting */}
            <group position={[0, 0, 0.003]}>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  side={THREE.FrontSide}
                  map={customCardTex || materials.base.map}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
            </group>
            {/* Back face — slightly behind */}
            <group position={[0, 0, -0.003]}>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  side={THREE.BackSide}
                  map={backCardTex || materials.base.map}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
            </group>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
    </>
  )
}