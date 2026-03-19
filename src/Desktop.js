import React, { useState, useEffect, useCallback } from 'react'
import desktopIcon from './image.png'
import Terminal from './Terminal'
import MusicPlayer from './MusicPlayer'
import Calculator from './Calculator'
import Camera from './Camera'
import ArnabBot from './ArnabBot'
import ContactApp from './ContactApp'
import CertificationsApp from './CertificationsApp'

// --- Projects Data ---
const PROJECTS = [
  {
    id: 'riskatlasai',
    name: 'RiskAtlas',
    icon: '🌍',
    color: '#e95420',
    tagline: 'AI trade risk intelligence dashboard',
    tech: ['React', 'FastAPI', 'Python', 'D3.js', 'DeepSeek API'],
    description: 'A real-time geopolitical and trade risk intelligence platform powered by AI. Visualizes supply chain exposure, sanctions risk, and multi-country trade dependencies on interactive maps.',
    status: 'Deployed',
    github: 'https://github.com/Arnab-Das41766/RiskAtlas',
  },
  {
    id: 'encrive',
    name: 'Encrive',
    icon: '🔒',
    color: '#9b59b6',
    tagline: 'Zero-knowledge encrypted cloud storage',
    tech: ['React', 'AES-256-GCM', 'Web Crypto API', 'Argon2id', 'Supabase'],
    description: 'End-to-end encrypted cloud storage where even the server never sees your data. Files are encrypted client-side before upload, using zero-knowledge architecture.',
    status: 'In Progress',
    github: 'https://github.com/Arnab-Das41766/Encrive',
  },
  {
    id: 'autobusbook',
    name: 'AutoBusBook',
    icon: '🚌',
    color: '#27ae60',
    tagline: 'Intercity bus booking platform',
    tech: ['React', 'Flask', 'SQLite', 'Supabase', 'Socket.IO'],
    description: 'A full-stack intercity bus booking system with real-time seat selection, dynamic pricing, operator dashboards, and live trip tracking via geolocation.',
    status: 'Deployed',
    github: 'https://github.com/Arnab-Das41766/AutoBusBook',
  },
  {
    id: 'stockbook',
    name: 'Stockbook v2',
    icon: '📈',
    color: '#2980b9',
    tagline: 'AI-powered stock portfolio tracker',
    tech: ['React', 'Python', 'Recharts', 'Groq API', 'Qwen 2.5'],
    description: 'A smart portfolio tracker with AI-generated market commentary, multi-stock watchlists, live price feed integration, and predictive sentiment analysis.',
    status: 'In Progress',
    github: 'https://github.com/Arnab-Das41766/Stockbook_v2',
  },
  {
    id: 'codestrikers',
    name: 'Code-Strikers',
    icon: '⚔️',
    color: '#e67e22',
    tagline: 'Real-time multiplayer DSA quiz',
    tech: ['React', 'Flask-SocketIO', 'Gevent', 'SQLite'],
    description: 'A real-time competitive coding quiz platform where players duel on DSA problems. Features rooms, leaderboards, timed rounds, and instant result feedback.',
    status: 'Deployed',
    github: 'https://github.com/Arnab-Das41766/Code-Strikers',
  },
  {
    id: 'redteamlabs',
    name: 'Red-Team-Labs',
    icon: '💀',
    color: '#c0392b',
    tagline: 'Offensive security PoC collection',
    tech: ['Python', 'C2 Techniques', 'Malware Dev', 'Pentesting'],
    description: 'A curated collection of offensive security proof-of-concept tools — covering C2 frameworks, phishing kits, rat/spyware prototypes, and social engineering simulations. For educational & CTF use.',
    status: 'Private',
    github: 'https://github.com/Arnab-Das41766/Red-Team-Labs',
  },
  {
    id: 'beatclaude',
    name: 'Beat-Claude',
    icon: '🎶',
    color: '#1dd1a1',
    tagline: 'AI beat generator',
    tech: ['React', 'Groq API', 'AI'],
    description: 'A unified applications interacting with the Groq API to generate dynamic beats and musical exam patterns using LLMs.',
    status: 'Deployed',
    github: 'https://github.com/Arnab-Das41766/Beat-Claude',
  },
  {
    id: 'riskyurl',
    name: 'RiskyURL',
    icon: '🔗',
    color: '#e74c3c',
    tagline: 'Malicious URL detector',
    tech: ['Python', 'Machine Learning', 'Flask'],
    description: 'A machine learning powered platform designed to detect and flag malicious URLs preventing users from falling victim to phishing and scams.',
    status: 'Deployed',
    github: 'https://github.com/Arnab-Das41766/RiskyURL',
  },
]

// --- Projects File Explorer ---
function ProjectsExplorer() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#1c1c1c', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif', overflow: 'hidden' }}>

      {/* Nautilus-style Sidebar */}
      <div style={{ width: '150px', backgroundColor: '#141414', borderRight: '1px solid #2a2a2a', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', color: '#666', padding: '4px 8px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Places</div>
        {[['🏠', 'Home'], ['📂', 'Projects'], ['⭐', 'Starred'], ['🗑', 'Trash']].map(([icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', backgroundColor: label === 'Projects' ? '#2a2a2a' : 'transparent', color: label === 'Projects' ? '#fff' : '#aaa', transition: 'background 0.15s' }}
            onMouseEnter={e => { if (label !== 'Projects') e.currentTarget.style.backgroundColor = '#222' }}
            onMouseLeave={e => { if (label !== 'Projects') e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Path Bar */}
        <div style={{ height: '36px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '6px', fontSize: '13px', color: '#888', flexShrink: 0 }}>
          <span style={{ color: '#aaa' }}>🏠</span>
          <span>›</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>Projects</span>
          {selected && <><span>›</span><span style={{ color: selected.color }}>{selected.name}</span></>}
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* File Grid */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '8px' }}>
            {PROJECTS.map(proj => (
              <div
                key={proj.id}
                onClick={() => setSelected(selected?.id === proj.id ? null : proj)}
                style={{
                  width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '10px 6px', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: selected?.id === proj.id ? 'rgba(233,84,32,0.2)' : 'transparent',
                  border: selected?.id === proj.id ? `1px solid ${proj.color}55` : '1px solid transparent',
                  transition: 'all 0.15s ease', userSelect: 'none'
                }}
                onMouseEnter={e => { if (selected?.id !== proj.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (selected?.id !== proj.id) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: proj.color + '22', border: `1.5px solid ${proj.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '8px', boxShadow: selected?.id === proj.id ? `0 0 12px ${proj.color}44` : 'none', transition: 'box-shadow 0.15s' }}>
                  {proj.icon}
                </div>
                <span style={{ fontSize: '12px', textAlign: 'center', color: selected?.id === proj.id ? '#fff' : '#ccc', lineHeight: '1.3', wordBreak: 'break-word' }}>{proj.name}</span>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ width: '220px', backgroundColor: '#141414', borderLeft: '1px solid #2a2a2a', padding: '20px 16px', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '32px' }}>{selected.icon}</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{selected.name}</div>
                  <div style={{ fontSize: '11px', color: selected.color, marginTop: '2px' }}>{selected.status}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6', borderTop: '1px solid #2a2a2a', paddingTop: '12px' }}>
                {selected.description}
              </div>
              <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '10px' }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Stack</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {selected.tech.map(t => (
                    <span key={t} style={{ fontSize: '11px', backgroundColor: '#2a2a2a', color: '#ccc', padding: '3px 7px', borderRadius: '4px' }}>{t}</span>
                  ))}
                </div>
              </div>
              <a href={selected.github} target="_blank" rel="noreferrer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', backgroundColor: '#2a2a2a', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              >
                <span>🐙</span> GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Internal Window Component ---
function Window({ id, title, onClose, isActive, onFocus, isMaximized, onToggleMaximize, defaultPos = { x: 100, y: 100 }, children }) {
  const [pos, setPos] = useState(defaultPos)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const isMobile = window.innerWidth <= 768

  const handlePointerDown = (e) => {
    onFocus()
    if (isMaximized || isMobile) return
    e.target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }

  const handlePointerMove = (e) => {
    if (isDragging && !isMaximized && !isMobile) {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y })
    }
  }

  const handlePointerUp = (e) => {
    if (isMaximized || isMobile) return
    e.target.releasePointerCapture(e.pointerId)
    setIsDragging(false)
  }

  const style = isMaximized ? {
    zIndex: isActive ? 100 : 50, transition: 'all 0.15s ease-out'
  } : isMobile ? {
    // On mobile: let CSS classes handle centering, no JS transform
    zIndex: isActive ? 100 : 50,
  } : {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    zIndex: isActive ? 100 : 50, transition: 'transform 0.15s, width 0.15s, height 0.15s',
    boxShadow: isActive ? '0 15px 50px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.5)',
  }

  return (
    <div className={isMaximized ? "ubuntu-window maximized" : "ubuntu-window"} style={style} onPointerDownCapture={onFocus}>
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
  const [openApps, setOpenApps] = useState({ projects: false, resume: false, certifications: false, terminal: false, music: false, calculator: false, camera: false, linkedin: false, github: false, whatsapp: false, arnabbot: false, contact: false })
  const [activeApp, setActiveApp] = useState(null)
  const [maximizedApps, setMaximizedApps] = useState({ projects: false, resume: false, certifications: false, terminal: false, music: false, calculator: false, camera: false, linkedin: false, github: false, whatsapp: false, arnabbot: false, contact: false })
  const [linkedinConfirmed, setLinkedinConfirmed] = useState(false)
  const [githubConfirmed, setGithubConfirmed] = useState(false)
  const [whatsappConfirmed, setWhatsappConfirmed] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)

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

  useEffect(() => {
    // Check if it's a touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setShowScrollHint(true)
      const hintTimer = setTimeout(() => setShowScrollHint(false), 5000)
      return () => clearTimeout(hintTimer)
    }
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
        {showScrollHint && (
          <div className="scroll-hint-popup">
            <span style={{ fontSize: '18px' }}>👆</span> Two-finger scroll to view all apps
          </div>
        )}

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

        {/* Ubuntu Dock (Sidebar / Bottom bar on mobile) */}
        <div className="ubuntu-dock" style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', gap: '12px',
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

          <div className="dock-icon" onClick={() => toggleApp('certifications')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'certifications') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Certifications">
            {openApps.certifications && <div className="dock-active-dot" />}
            <span style={{ fontSize: '24px' }}>🏆</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('terminal')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'terminal') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Terminal">
            {openApps.terminal && <div className="dock-active-dot" />}
            <img src={desktopIcon} style={{ width: '28px', height: '28px', filter: 'drop-shadow(1px 1px 2px #000)' }} alt="terminal" />
          </div>

          <div className="dock-icon" onClick={() => toggleApp('music')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'music') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Spotify Music">
            {openApps.music && <div className="dock-active-dot" />}
            <img src="/icons/spotify.png" alt="Spotify" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.5))' }} />
          </div>

          <div className="dock-icon" onClick={() => toggleApp('calculator')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'calculator') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Calculator">
            {openApps.calculator && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>🖩</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('camera')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'camera') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Camera">
            {openApps.camera && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>📷</span>
          </div>

          <div className="dock-icon" onClick={() => { setLinkedinConfirmed(false); toggleApp('linkedin'); }} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'linkedin') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="LinkedIn">
            {openApps.linkedin && <div className="dock-active-dot" />}
            <img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.5))' }} />
          </div>

          <div className="dock-icon" onClick={() => { setGithubConfirmed(false); toggleApp('github'); }} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'github') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="GitHub">
            {openApps.github && <div className="dock-active-dot" />}
            <img src="/icons/github.png" alt="GitHub" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.5)) brightness(0) invert(1)' }} />
          </div>

          <div className="dock-icon" onClick={() => { setWhatsappConfirmed(false); toggleApp('whatsapp'); }} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'whatsapp') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="WhatsApp">
            {openApps.whatsapp && <div className="dock-active-dot" />}
            <img src="/icons/whatsapp.png" alt="WhatsApp" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.5))' }} />
          </div>

          <div className="dock-icon" onClick={() => toggleApp('arnabbot')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'arnabbot') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Arnab Bot">
            {openApps.arnabbot && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>🤖</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('contact')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'contact') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Contact Arnab">
            {openApps.contact && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>📬</span>
          </div>
        </div>

        {/* Desktop Workspace */}
        <div className="ubuntu-desktop" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'flex-start', gap: '15px' }}>

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

          <div className="desktop-icon" onClick={() => toggleApp('certifications')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>🏆</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Certifications</span>
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
            <img src="/icons/spotify.png" alt="Spotify" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.6))' }} />
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Spotify</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('calculator')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>🖩</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Calculator</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('camera')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>📷</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Camera</span>
          </div>

          <div className="desktop-icon" onClick={() => { setLinkedinConfirmed(false); toggleApp('linkedin'); }} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.6))' }} />
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>LinkedIn</span>
          </div>

          <div className="desktop-icon" onClick={() => { setGithubConfirmed(false); toggleApp('github'); }} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <img src="/icons/github.png" alt="GitHub" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.8)) brightness(0) invert(1)' }} />
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>GitHub</span>
          </div>

          <div className="desktop-icon" onClick={() => { setWhatsappConfirmed(false); toggleApp('whatsapp'); }} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <img src="/icons/whatsapp.png" alt="WhatsApp" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.6))' }} />
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>WhatsApp</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('arnabbot')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>🤖</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Arnab Bot</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('contact')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>📬</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Contact</span>
          </div>

          {/* Render Active Windows */}
          {openApps.projects && (
            <Window
              id="projects" title="Files — ~/Projects"
              onClose={() => toggleApp('projects')}
              isActive={activeApp === 'projects'} onFocus={() => focusApp('projects')}
              isMaximized={maximizedApps.projects} onToggleMaximize={() => toggleMaximize('projects')}
              defaultPos={{ x: 150, y: 80 }}
            >
              <ProjectsExplorer />
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

          {openApps.certifications && (
            <Window
              id="certifications" title="Certifications"
              onClose={() => toggleApp('certifications')}
              isActive={activeApp === 'certifications'} onFocus={() => focusApp('certifications')}
              isMaximized={maximizedApps.certifications} onToggleMaximize={() => toggleMaximize('certifications')}
              defaultPos={{ x: 220, y: 140 }}
            >
              <CertificationsApp />
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

          {openApps.calculator && (
            <Window
              id="calculator" title="Calculator"
              onClose={() => toggleApp('calculator')}
              isActive={activeApp === 'calculator'} onFocus={() => focusApp('calculator')}
              isMaximized={maximizedApps.calculator} onToggleMaximize={() => toggleMaximize('calculator')}
              defaultPos={{ x: 350, y: 200 }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                <Calculator />
              </div>
            </Window>
          )}

          {openApps.camera && (
            <Window
              id="camera" title="Camera"
              onClose={() => toggleApp('camera')}
              isActive={activeApp === 'camera'} onFocus={() => focusApp('camera')}
              isMaximized={maximizedApps.camera} onToggleMaximize={() => toggleMaximize('camera')}
              defaultPos={{ x: 180, y: 90 }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                <Camera />
              </div>
            </Window>
          )}

          {openApps.linkedin && (
            <Window
              id="linkedin" title="LinkedIn"
              onClose={() => toggleApp('linkedin')}
              isActive={activeApp === 'linkedin'} onFocus={() => focusApp('linkedin')}
              isMaximized={maximizedApps.linkedin} onToggleMaximize={() => toggleMaximize('linkedin')}
              defaultPos={{ x: 280, y: 130 }}
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a66c2', gap: '0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', backgroundColor: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', padding: '8px' }}><img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>LinkedIn</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>This will open Arnab Das's LinkedIn<br />profile in a new browser tab.</div>
                  </div>
                  {!linkedinConfirmed ? (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button onClick={() => toggleApp('linkedin')} style={{ padding: '10px 22px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Cancel</button>
                      <button onClick={() => { setLinkedinConfirmed(true); window.open('https://www.linkedin.com/in/arnab-das-183ba7302/', '_blank', 'noopener,noreferrer'); }} style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#fff', color: '#0a66c2', cursor: 'pointer', fontSize: '14px', fontWeight: '800', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>Open LinkedIn ↗</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <div style={{ fontSize: '36px' }}>✅</div>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Opened in a new tab!</div>
                      <button onClick={() => toggleApp('linkedin')} style={{ padding: '8px 20px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Close</button>
                    </div>
                  )}
                </div>
              </div>
            </Window>
          )}

          {openApps.github && (
            <Window
              id="github" title="GitHub"
              onClose={() => toggleApp('github')}
              isActive={activeApp === 'github'} onFocus={() => focusApp('github')}
              isMaximized={maximizedApps.github} onToggleMaximize={() => toggleMaximize('github')}
              defaultPos={{ x: 320, y: 150 }}
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d1117', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', backgroundColor: '#21262d', borderRadius: '50%', border: '2px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', padding: '12px' }}><img src="/icons/github.png" alt="GitHub" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /></div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#e6edf3', marginBottom: '6px' }}>GitHub</div>
                    <div style={{ fontSize: '13px', color: '#8b949e', lineHeight: '1.6' }}>Open <span style={{ color: '#58a6ff', fontWeight: '600' }}>Arnab-Das41766</span>'s GitHub<br />homepage in a new tab.</div>
                  </div>
                  {!githubConfirmed ? (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button onClick={() => toggleApp('github')} style={{ padding: '10px 22px', borderRadius: '8px', border: '1px solid #30363d', background: '#21262d', color: '#c9d1d9', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#30363d'} onMouseLeave={e => e.currentTarget.style.background = '#21262d'}>Cancel</button>
                      <button onClick={() => { setGithubConfirmed(true); window.open('https://github.com/Arnab-Das41766', '_blank', 'noopener,noreferrer'); }} style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#238636', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'background 0.15s, transform 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#2ea043'} onMouseLeave={e => e.currentTarget.style.background = '#238636'} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>View on GitHub ↗</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <div style={{ fontSize: '36px' }}>✅</div>
                      <div style={{ color: '#8b949e', fontSize: '13px' }}>Opened in a new tab!</div>
                      <button onClick={() => toggleApp('github')} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #30363d', background: '#21262d', color: '#c9d1d9', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Close</button>
                    </div>
                  )}
                </div>
              </div>
            </Window>
          )}

          {openApps.whatsapp && (
            <Window
              id="whatsapp" title="WhatsApp"
              onClose={() => toggleApp('whatsapp')}
              isActive={activeApp === 'whatsapp'} onFocus={() => focusApp('whatsapp')}
              isMaximized={maximizedApps.whatsapp} onToggleMaximize={() => toggleMaximize('whatsapp')}
              defaultPos={{ x: 360, y: 170 }}
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111b21', position: 'relative', overflow: 'hidden' }}>
                {/* WhatsApp bubble pattern bg */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, #25d366 0, #25d366 1px, transparent 0, transparent 28px), repeating-linear-gradient(90deg, #25d366 0, #25d366 1px, transparent 0, transparent 28px)', backgroundSize: '28px 28px' }} />
                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', textAlign: 'center' }}>
                  {/* WhatsApp logo circle */}
                  <div style={{ width: '72px', height: '72px', backgroundColor: '#25d366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(37,211,102,0.35)', padding: '12px' }}><img src="/icons/whatsapp.png" alt="WhatsApp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#e9edef', marginBottom: '6px' }}>WhatsApp</div>
                    <div style={{ fontSize: '13px', color: '#8696a0', lineHeight: '1.6' }}>Start a chat with <span style={{ color: '#25d366', fontWeight: '600' }}>Arnab Das</span><br />on WhatsApp in a new tab.</div>
                  </div>
                  {!whatsappConfirmed ? (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button onClick={() => toggleApp('whatsapp')} style={{ padding: '10px 22px', borderRadius: '8px', border: '1px solid #2a3942', background: '#202c33', color: '#8696a0', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#2a3942'} onMouseLeave={e => e.currentTarget.style.background = '#202c33'}>Cancel</button>
                      <button onClick={() => { setWhatsappConfirmed(true); window.open('https://wa.me/919304832942?text=Hi%20Arnab!%20I%20found%20you%20through%20your%20portfolio.', '_blank', 'noopener,noreferrer'); }} style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#25d366', color: '#111b21', cursor: 'pointer', fontSize: '14px', fontWeight: '800', boxShadow: '0 4px 15px rgba(37,211,102,0.35)', transition: 'background 0.15s, transform 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#20ba5a'} onMouseLeave={e => e.currentTarget.style.background = '#25d366'} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>💬 Open Chat ↗</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <div style={{ fontSize: '36px' }}>✅</div>
                      <div style={{ color: '#8696a0', fontSize: '13px' }}>Chat opened in a new tab!</div>
                      <button onClick={() => toggleApp('whatsapp')} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #2a3942', background: '#202c33', color: '#8696a0', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Close</button>
                    </div>
                  )}
                </div>
              </div>
            </Window>
          )}

          {openApps.arnabbot && (
            <Window
              id="arnabbot" title="🤖 Arnab Bot"
              onClose={() => toggleApp('arnabbot')}
              isActive={activeApp === 'arnabbot'} onFocus={() => focusApp('arnabbot')}
              isMaximized={maximizedApps.arnabbot} onToggleMaximize={() => toggleMaximize('arnabbot')}
              defaultPos={{ x: 300, y: 120 }}
            >
              <ArnabBot />
            </Window>
          )}

          {openApps.contact && (
            <Window
              id="contact" title="📬 Contact Arnab"
              onClose={() => toggleApp('contact')}
              isActive={activeApp === 'contact'} onFocus={() => focusApp('contact')}
              isMaximized={maximizedApps.contact} onToggleMaximize={() => toggleMaximize('contact')}
              defaultPos={{ x: 320, y: 140 }}
            >
              <ContactApp />
            </Window>
          )}

        </div>
      </div>
    </>
  )
}
