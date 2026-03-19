import React, { useRef, useEffect, useState, useCallback } from 'react'

export default function Camera() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [status, setStatus] = useState('idle') // 'idle' | 'requesting' | 'active' | 'denied' | 'error'
  const [facing, setFacing] = useState('user') // 'user' | 'environment'
  const [captured, setCaptured] = useState(null) // data URL of last snapshot
  const [flash, setFlash] = useState(false)
  const [mirrored, setMirrored] = useState(true)

  const startCamera = useCallback(async (facingMode = facing) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setStatus('requesting')
    setCaptured(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('active')
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('denied')
      } else {
        setStatus('error')
        console.error('Camera error:', err)
      }
    }
  }, [facing])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, []) // eslint-disable-line

  const handleFlipCamera = () => {
    const next = facing === 'user' ? 'environment' : 'user'
    setFacing(next)
    startCamera(next)
  }

  const handleCapture = () => {
    if (!videoRef.current || status !== 'active') return
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (mirrored) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/png')
    setCaptured(dataUrl)
    // Flash effect
    setFlash(true)
    setTimeout(() => setFlash(false), 180)
  }

  const handleDownload = () => {
    if (!captured) return
    const a = document.createElement('a')
    a.href = captured
    a.download = `photo_${Date.now()}.png`
    a.click()
  }

  const handleDiscard = () => setCaptured(null)

  const BtnStyle = (bg = '#2a2a2a', color = '#fff') => ({
    background: bg, color, border: 'none', borderRadius: '8px', padding: '8px 16px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'filter 0.15s',
    display: 'flex', alignItems: 'center', gap: '6px',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0e0e0e', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* Flash overlay */}
      {flash && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#fff', opacity: 0.7, zIndex: 999, pointerEvents: 'none', transition: 'opacity 0.18s' }} />}

      {/* Ubuntu-style header */}
      <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a', padding: '6px 14px', fontSize: '12px', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span>GNOME Camera</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: status === 'active' ? '#e95420' : '#555', display: 'inline-block', boxShadow: status === 'active' ? '0 0 6px #e95420' : 'none', transition: 'all 0.3s' }} />
          <span style={{ fontSize: '11px', color: status === 'active' ? '#e95420' : '#555' }}>
            {status === 'active' ? 'LIVE' : status === 'requesting' ? 'Connecting…' : status === 'denied' ? 'Blocked' : status === 'error' ? 'Error' : 'Off'}
          </span>
        </div>
      </div>

      {/* Main viewfinder area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>

        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: mirrored && facing === 'user' ? 'scaleX(-1)' : 'none',
            display: (status === 'active' && !captured) ? 'block' : 'none',
            transition: 'transform 0.2s',
          }}
        />

        {/* Captured photo preview */}
        {captured && (
          <img src={captured} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Permission / Error states */}
        {status === 'idle' || status === 'requesting' ? (
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', color: '#888' }}>
            <span style={{ fontSize: '60px', animation: 'camSpin 2s linear infinite' }}>📷</span>
            <style>{`@keyframes camSpin { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
            <span style={{ fontSize: '14px' }}>Starting camera…</span>
          </div>
        ) : status === 'denied' ? (
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', color: '#aaa', padding: '30px', textAlign: 'center' }}>
            <span style={{ fontSize: '56px' }}>🚫</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Camera Access Denied</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>Please allow camera access in your browser settings and try again.</div>
            </div>
            <button onClick={() => startCamera()} style={{ ...BtnStyle('#e95420'), marginTop: '8px' }}>
              🔄 Try Again
            </button>
          </div>
        ) : status === 'error' ? (
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#aaa' }}>
            <span style={{ fontSize: '52px' }}>⚠️</span>
            <div style={{ fontSize: '14px' }}>Couldn't access camera.</div>
            <button onClick={() => startCamera()} style={BtnStyle('#e95420')}>Retry</button>
          </div>
        ) : null}

        {/* Viewfinder crosshair (only when live) */}
        {status === 'active' && !captured && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '180px', height: '120px', border: '1.5px solid rgba(233,84,32,0.35)', borderRadius: '10px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }} />
          </div>
        )}
      </div>

      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Bottom Controls */}
      <div style={{ backgroundColor: '#141414', borderTop: '1px solid #222', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>

        {/* Left controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setMirrored(m => !m)}
            title="Toggle Mirror"
            style={{ ...BtnStyle(mirrored ? '#e9542022' : '#2a2a2a', mirrored ? '#e95420' : '#888'), border: `1px solid ${mirrored ? '#e9542055' : '#333'}` }}
          >
            ↔ Mirror
          </button>
          <button
            onClick={handleFlipCamera}
            title="Flip Camera"
            style={BtnStyle()}
          >
            🔄 Flip
          </button>
        </div>

        {/* Centre: shutter */}
        {!captured ? (
          <button
            onClick={handleCapture}
            disabled={status !== 'active'}
            style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fff', border: '4px solid #444', cursor: status === 'active' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', transition: 'transform 0.1s, opacity 0.2s', opacity: status === 'active' ? 1 : 0.3 }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.90)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            title="Take Photo"
          >
            📷
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDiscard} style={BtnStyle('#2a2a2a', '#f87171')}>🗑 Discard</button>
            <button onClick={handleDownload} style={BtnStyle('#e95420')}>💾 Save</button>
          </div>
        )}

        {/* Right: re-allow */}
        <div style={{ width: '120px', display: 'flex', justifyContent: 'flex-end' }}>
          {status !== 'active' && status !== 'requesting' && (
            <button onClick={() => startCamera()} style={{ ...BtnStyle('#2a2a2a', '#aaa'), fontSize: '12px' }}>
              🔄 Restart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
