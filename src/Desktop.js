import React, { useState, useEffect } from 'react'
import desktopIcon from './image.png'
import Terminal from './Terminal'
import MusicPlayer from './MusicPlayer'

// --- Internal Window Component ---
function Window({ id, title, onClose, isActive, onFocus, isMaximized, onToggleMaximize, defaultPos = { x: 100, y: 100 }, children }) {
  const [pos, setPos] = useState(defaultPos)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    onFocus()
    if (isMaximized) return
    e.target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }

  const handlePointerMove = (e) => {
    if (isDragging && !isMaximized) {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y })
    }
  }

  const handlePointerUp = (e) => {
    if (isMaximized) return
    e.target.releasePointerCapture(e.pointerId)
    setIsDragging(false)
  }

  const style = isMaximized ? {
    position: 'absolute', left: '56px', top: '28px', width: 'calc(100vw - 56px)', height: 'calc(100vh - 28px)',
    backgroundColor: '#202020', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', border: 'none', zIndex: isActive ? 100 : 50, transition: 'all 0.15s ease-out'
  } : {
    position: 'absolute', left: pos.x, top: pos.y, width: '700px', height: '480px',
    backgroundColor: '#202020', borderRadius: '8px 8px 0 0', boxShadow: isActive ? '0 15px 50px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #333',
    zIndex: isActive ? 100 : 50, transition: 'width 0.15s, height 0.15s'
  }

  return (
    <div style={style} onPointerDownCapture={onFocus}>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={onToggleMaximize}
        style={{
          height: '35px', backgroundColor: isActive ? '#383838' : '#2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isMaximized ? 'default' : (isDragging ? 'grabbing' : 'grab'), position: 'relative', userSelect: 'none', color: '#e0e0e0',
          transition: 'background-color 0.2s'
        }}
      >
        <div style={{ fontWeight: '600', fontSize: '14px', letterSpacing: '0.5px' }}>{title}</div>

        {/* Ubuntu Window Controls (Top Right) */}
        <div style={{ position: 'absolute', right: '15px', display: 'flex', gap: '8px' }}>
          <div
            onClick={(e) => { e.stopPropagation(); onToggleMaximize(); }}
            style={{ width: '14px', height: '14px', backgroundColor: '#28c940', borderRadius: '50%', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)' }}
            title={isMaximized ? "Restore" : "Maximize"}
          />
          <div
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ width: '14px', height: '14px', backgroundColor: '#ff5f56', borderRadius: '50%', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)' }}
            title="Close"
          />
        </div>
      </div>
      <div style={{ flex: 1, backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

export default function Desktop({ onExit }) {
  const [time, setTime] = useState(new Date())

  // App States
  const [openApps, setOpenApps] = useState({ projects: false, resume: false, terminal: false, music: false })
  const [activeApp, setActiveApp] = useState(null)
  const [maximizedApps, setMaximizedApps] = useState({ projects: false, resume: false, terminal: false, music: false })

  const toggleApp = (app) => {
    setOpenApps(prev => {
      const isOpening = !prev[app]
      if (isOpening) setActiveApp(app)
      else if (activeApp === app) setActiveApp(null)
      return { ...prev, [app]: isOpening }
    })
  }

  const focusApp = (app) => setActiveApp(app)
  const toggleMaximize = (app) => setMaximizedApps(prev => ({ ...prev, [app]: !prev[app] }))

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <style>{`
        body { margin: 0; overflow: hidden; }
        .desktop-icon:hover { background-color: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); }
        .desktop-icon { border: 1px solid transparent; transition: all 0.2s ease; }
        .dock-icon { transition: transform 0.2s; }
        .dock-icon:hover { transform: scale(1.1); background-color: rgba(255,255,255,0.2); }
        .dock-active-dot { width: 4px; height: 4px; background-color: #e95420; border-radius: 50%; position: absolute; left: 4px; top: 50%; transform: translateY(-50%); }
      `}</style>
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: 'linear-gradient(135deg, #E95420, #77216F)',
        backgroundSize: 'cover',
        display: 'flex', flexDirection: 'column',
        fontFamily: '"Ubuntu", "Segoe UI", sans-serif',
        overflow: 'hidden',
        color: '#fff',
        zIndex: 999999
      }}>
        {/* Top Navbar */}
        <div style={{
          height: '28px', backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 15px', fontSize: '14px', zIndex: 1000,
          boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', gap: '15px', cursor: 'pointer' }}>
            <span style={{ fontWeight: 'bold' }}>Activities</span>
          </div>

          <div style={{ fontWeight: '500', cursor: 'pointer' }}>
            {time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}&nbsp;&nbsp;
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div style={{ display: 'flex', gap: '15px', cursor: 'pointer' }}>
            <span title="Network Connected">📶</span>
            <span title="Battery">🔋</span>
            <span title="Power Off" onClick={onExit} style={{ color: '#ff5f56', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.2)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>⏻</span>
          </div>
        </div>

        {/* Ubuntu Dock (Left Sidebar) */}
        <div style={{
          position: 'absolute', top: '28px', left: 0, width: '56px', height: 'calc(100vh - 28px)',
          backgroundColor: 'rgba(0,0,0,0.6)', borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px', gap: '12px',
          zIndex: 500, backdropFilter: 'blur(10px)', boxShadow: '2px 0 5px rgba(0,0,0,0.3)'
        }}>
          <div className="dock-icon" onClick={() => toggleApp('projects')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'projects') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Projects">
            {openApps.projects && <div className="dock-active-dot" />}
            <span style={{ fontSize: '24px' }}>📁</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('resume')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'resume') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Resume">
            {openApps.resume && <div className="dock-active-dot" />}
            <span style={{ fontSize: '24px' }}>📄</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('terminal')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'terminal') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Terminal">
            {openApps.terminal && <div className="dock-active-dot" />}
            <img src={desktopIcon} style={{ width: '28px', height: '28px', filter: 'drop-shadow(1px 1px 2px #000)' }} alt="terminal" />
          </div>

          <div className="dock-icon" onClick={() => toggleApp('music')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'music') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Spotify Music">
            {openApps.music && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>🎵</span>
          </div>
        </div>

        {/* Desktop Workspace */}
        <div style={{ flex: 1, position: 'relative', padding: '15px 15px 15px 70px', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'flex-start', gap: '15px' }}>

          {/* Folders & Shortcuts */}
          <div className="desktop-icon" onClick={() => toggleApp('projects')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>📁</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Projects</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('resume')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>📄</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Resume.pdf</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('terminal')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <img src={desktopIcon} style={{ width: '42px', height: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }} alt="terminal" />
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Terminal</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('music')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>🎵</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Spotify</span>
          </div>

          {/* Render Active Windows */}
          {openApps.projects && (
            <Window
              id="projects" title="Projects Folder"
              onClose={() => toggleApp('projects')}
              isActive={activeApp === 'projects'} onFocus={() => focusApp('projects')}
              isMaximized={maximizedApps.projects} onToggleMaximize={() => toggleMaximize('projects')}
              defaultPos={{ x: 150, y: 80 }}
            >
              <div style={{ padding: '20px', color: '#fff', height: '100%', backgroundColor: '#1e1e1e' }}>
                <h3>My Work</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>RiskAtlas — AI trade risk intelligence dashboard</li>
                  <li>Encrive   — Zero-knowledge encrypted cloud storage</li>
                  <li>AutoBusBook — Intercity bus booking platform</li>
                  <li>Stockbook v2 — AI-powered stock portfolio tracker</li>
                </ul>
              </div>
            </Window>
          )}

          {openApps.resume && (
            <Window
              id="resume" title="Arnab_Das_CV.pdf"
              onClose={() => toggleApp('resume')}
              isActive={activeApp === 'resume'} onFocus={() => focusApp('resume')}
              isMaximized={maximizedApps.resume} onToggleMaximize={() => toggleMaximize('resume')}
              defaultPos={{ x: 200, y: 120 }}
            >
              <iframe src="/Arnab_Das_CV.pdf" style={{ width: '100%', height: '100%', border: 'none' }} title="Resume PDF" />
            </Window>
          )}

          {openApps.terminal && (
            <Window
              id="terminal" title="terminal@portfolio:~"
              onClose={() => toggleApp('terminal')}
              isActive={activeApp === 'terminal'} onFocus={() => focusApp('terminal')}
              isMaximized={maximizedApps.terminal} onToggleMaximize={() => toggleMaximize('terminal')}
              defaultPos={{ x: 250, y: 150 }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                <Terminal />
              </div>
            </Window>
          )}

          {openApps.music && (
            <Window
              id="music" title="Spotify - Web Player"
              onClose={() => toggleApp('music')}
              isActive={activeApp === 'music'} onFocus={() => focusApp('music')}
              isMaximized={maximizedApps.music} onToggleMaximize={() => toggleMaximize('music')}
              defaultPos={{ x: 300, y: 180 }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                <MusicPlayer />
              </div>
            </Window>
          )}

        </div>
      </div>
    </>
  )
}
