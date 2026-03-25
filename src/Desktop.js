import React, { useState, useEffect, useCallback } from 'react'
import desktopIcon from './image.png'
import Terminal from './Terminal'
import MusicPlayer from './MusicPlayer'
import Calculator from './Calculator'
import Camera from './Camera'
import ArnabBot from './ArnabBot'
import ContactApp from './ContactApp'
import CertificationsApp from './CertificationsApp'
import AkinatorApp from './AkinatorApp'
import TypingTesterApp from './TypingTesterApp'
import SettingsApp from './SettingsApp'
import WeatherApp from './WeatherApp'
import CalendarWidget from './CalendarWidget'
import NotepadApp from './NotepadApp'

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
    caseStudy: {
      problem: 'Global supply chains are extremely vulnerable to complex geopolitical tensions and fluctuating sanctions, often obfuscating potential trade risks until it is too late.',
      approach: 'Built a full-stack intelligence platform using React for geographic visualizations and a FastAPI backend empowered by the DeepSeek API to continuously analyze and interpret massive streams of geopolitical event data.',
      result: 'An interactive, multi-layered dashboard providing predictive insights and visual mapping of supply chain dependencies across various continents.',
      impact: 'Allows risk analysts to proactively detect hidden exposures and minimize disruption costs caused by unprecedented sanctions or political shifts.'
    }
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
    caseStudy: {
      problem: 'Traditional cloud storage solutions compromise user privacy by managing the encryption keys themselves, making data vulnerable to server breaches and unauthorized access.',
      approach: 'Engineered a zero-knowledge architecture utilizing the Web Crypto API for client-side encryption using AES-256-GCM, along with Argon2id for secure local key derivation before pushing encrypted blobs to Supabase.',
      result: 'A highly secure, intuitive file storage application where users retain exclusive control over their encryption keys, and servers only handle undecipherable ciphertexts.',
      impact: 'Establishes absolute data privacy and security, completely eliminating the risk of data exposure through server-side compromises.'
    }
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
    caseStudy: {
      problem: 'Intercity bus travelers frequently face disjointed booking experiences without reliable real-time seat selection or live tracking capabilities for their journeys.',
      approach: 'Developed a comprehensive full-stack platform leveraging React for a responsive UI, paired with a Flask and Supabase backend incorporating WebSockets for real-time seat locking and GPS integrations.',
      result: 'Delivered an integrated ecosystem with dynamic pricing engines, live trip tracking, and specialized admin panels for fleet operators to monitor metrics.',
      impact: 'Streamlined the booking process, increased transparency for riders handling delays, and provided operators with actionable fleet analytics.'
    }
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
    caseStudy: {
      problem: 'Retail investors struggle to contextualize volatile market movements and synthesize massive amounts of financial news to manage their portfolios efficiently.',
      approach: 'Integrates live financial data feeds and Recharts for visual tracking with an AI backend featuring the Qwen 2.5 model via the Groq API for predictive sentiment analysis and automated commentary.',
      result: 'A unified dashboard capable of managing multi-stock watchlists and delivering real-time, AI-driven market summaries and predictive analyses.',
      impact: 'Empowers users to make informed, timely investment decisions backed by synthesized machine learning inferences and comprehensive data visualization.'
    }
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
    caseStudy: {
      problem: 'Practicing Data Structures and Algorithms can be an isolating and monotonous process lacking the engaging elements of peer competition.',
      approach: 'Created a gamified, real-time battleground using React for rapid state interactions and Flask-SocketIO managed via Gevent to handle simultaneous, low-latency multiplayer rooms.',
      result: 'A robust, scalable competitive quiz application accommodating dynamic time rounds, live leaderboards, and instant player feedback mechanisms.',
      impact: 'Transformed solitary DSA practice into an engaging multiplayer experience, significantly boosting user retention and competitive learning outcomes.'
    }
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
    caseStudy: {
      problem: 'A lack of consolidated, practical offensive security toolsets makes predicting advanced persistent threats (APTs) and developing robust defenses difficult for security teams.',
      approach: 'Curated and developed Python-based Command & Control (C2) frameworks, advanced phishing techniques, and customized Remote Access Trojan (RAT) prototypes.',
      result: 'An extensive repository of functional, educational proofs-of-concept that demonstrably simulate modern adversary tactics and infiltration methods.',
      impact: 'Facilitates intensive penetration testing and red teaming operations, providing tangible methodologies to harden targeted network infrastructures.'
    }
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
    caseStudy: {
      problem: 'Music creators and educators need rapid, innovative, to easily scaffold new rhythmic patterns or generate complex musical exam materials on the fly.',
      approach: 'Designed a React application interfacing seamlessly with the high-speed Groq API to process natural language prompts into structural rhythmic patterns and test parameters.',
      result: 'A versatile generator that instantly outputs customized musical beats and formatted examination architectures suitable for varying skill levels.',
      impact: 'Drastically reduces the time required for creative brainstorming and educational material preparation, fostering efficiency for musicians and teachers.'
    }
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
    caseStudy: {
      problem: 'Cybercriminals continuously launch highly evasive phishing and scam URLs, outpacing traditional blocklist methods and endangering standard users.',
      approach: 'Engineered a specialized Python and Flask platform embedding customized machine learning models trained specifically on identifying obscure patterns inside fraudulent web addresses.',
      result: 'A rapid, user-facing detection tool effectively calculating risk percentages and flagging potentially malicious URLs based on lexical and domain heuristics.',
      impact: 'Serves as an active frontline defense, significantly diminishing the chances of non-technical users compromising their sensitive data via social engineering links.'
    }
  }
]

// --- Projects File Explorer ---
function ProjectsExplorer({ onOpenCaseStudy }) {
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
              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <a href={selected.github} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', backgroundColor: '#2a2a2a', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                >
                  <span>🐙</span> GitHub
                </a>
                <button
                  onClick={() => onOpenCaseStudy && onOpenCaseStudy(selected)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', backgroundColor: '#e95420', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.15s', height: '100%' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dd4814'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e95420'}
                >
                  <span>📘</span> Case Study
                </button>
              </div>
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
    zIndex: isActive ? 100 : 50, transition: 'transform 0.15s, box-shadow 0.15s',
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
  const [openApps, setOpenApps] = useState({ projects: false, casestudy: false, resume: false, certifications: false, terminal: false, music: false, calculator: false, camera: false, linkedin: false, github: false, whatsapp: false, arnabbot: false, contact: false, akinator: false, typing: false, notepad: false, settings: false, weather: false })
  const [activeApp, setActiveApp] = useState(null)
  const [maximizedApps, setMaximizedApps] = useState({ projects: false, casestudy: false, resume: false, certifications: false, terminal: false, music: false, calculator: false, camera: false, linkedin: false, github: false, whatsapp: false, arnabbot: false, contact: false, akinator: false, typing: false, notepad: false, settings: false, weather: false })
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('ubuntu-wallpaper') || 'linear-gradient(135deg, #E95420, #77216F)')
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('ubuntu-accent-color') || '#e95420')
  const [showCalendarWidget, setShowCalendarWidget] = useState(false)
  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState(null)
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
        /* Dock Active Dot using Dynamic Accent Color */
        .dock-active-dot { width: 4px; height: 4px; background-color: ${accentColor}; border-radius: 50%; position: absolute; left: 4px; top: 50%; transform: translateY(-50%); }
        .ubuntu-dock { flex-direction: column !important; width: 70px !important; padding: 12px 8px !important; }
        .ubuntu-window { position: absolute; width: 600px; height: 400px; min-width: 300px; min-height: 200px; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); resize: both; }
        .ubuntu-window.maximized { position: fixed; top: 28px; left: 70px; right: 0; bottom: 0; width: calc(100% - 70px) !important; height: calc(100vh - 28px) !important; border-radius: 0; margin: 0; transform: none !important; resize: none; }
      `}</style>
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: wallpaper,
        backgroundSize: 'cover',
        display: 'flex', flexDirection: 'column',
        fontFamily: '"Ubuntu", "Segoe UI", sans-serif',
        overflow: 'hidden',
        color: '#fff',
        zIndex: 999999,
        transition: 'background 0.3s ease-in-out'
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

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer', padding: '0 10px' }} onClick={() => setShowCalendarWidget(!showCalendarWidget)}>
            {time.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>

          <div style={{ display: 'flex', gap: '15px', cursor: 'pointer' }}>
            <span title="Network Connected">📶</span>
            <span title="Battery">🔋</span>
            <span title="Power Off" onClick={onExit} style={{ color: '#ff5f56', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.2)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>⏻</span>
          </div>
        </div>
        
        {/* Calendar Widget Dropdown */}
        {showCalendarWidget && <CalendarWidget currentDate={time} />}

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

          <div className="dock-icon" onClick={() => toggleApp('akinator')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'akinator') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="AI Akinator">
            {openApps.akinator && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>🧞‍♂️</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('typing')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'typing') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Typing Tester">
            {openApps.typing && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>⌨️</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('notepad')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'notepad') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Notepad">
            {openApps.notepad && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>📝</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('settings')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'settings') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Settings">
            {openApps.settings && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>⚙️</span>
          </div>

          <div className="dock-icon" onClick={() => toggleApp('weather')} style={{ width: '42px', height: '42px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (activeApp === 'weather') ? 'rgba(255,255,255,0.15)' : 'transparent', borderRadius: '10px', position: 'relative' }} title="Weather">
            {openApps.weather && <div className="dock-active-dot" />}
            <span style={{ fontSize: '26px', filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))' }}>🌤️</span>
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

          <div className="desktop-icon" onClick={() => toggleApp('akinator')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>🧞‍♂️</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Akinator</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('typing')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>⌨️</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Typing Tester</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('settings')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>⚙️</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Settings</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('notepad')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>📝</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Notepad</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleApp('weather')} style={{
            width: '85px', height: '85px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            borderRadius: '8px', padding: '5px'
          }}>
            <span style={{ fontSize: '42px', filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5))' }}>🌤️</span>
            <span style={{ fontSize: '13px', marginTop: '6px', textShadow: '1px 1px 2px #000', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>Weather</span>
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
              <ProjectsExplorer
                onOpenCaseStudy={(proj) => {
                  setActiveCaseStudyProject(proj);
                  if (!openApps.casestudy) {
                    toggleApp('casestudy');
                  } else {
                    focusApp('casestudy');
                  }
                }}
              />
            </Window>
          )}

          {openApps.casestudy && activeCaseStudyProject && (
            <Window
              id="casestudy" title={`Case Study: ${activeCaseStudyProject.name}`}
              onClose={() => toggleApp('casestudy')}
              isActive={activeApp === 'casestudy'} onFocus={() => focusApp('casestudy')}
              isMaximized={maximizedApps.casestudy} onToggleMaximize={() => toggleMaximize('casestudy')}
              defaultPos={{ x: 200, y: 100 }}
            >
              <div className="casestudy-content" style={{ padding: '24px', overflowY: 'auto', height: '100%', backgroundColor: '#1e1e1e', color: '#eee', fontFamily: '"Inter", "Segoe UI", sans-serif', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                  <div style={{ fontSize: '48px', backgroundColor: activeCaseStudyProject.color + '22', border: `2px solid ${activeCaseStudyProject.color}55`, borderRadius: '12px', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: `0 0 20px ${activeCaseStudyProject.color}44`, flexShrink: 0 }}>
                    {activeCaseStudyProject.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>{activeCaseStudyProject.name}</div>
                    <div style={{ fontSize: '15px', color: activeCaseStudyProject.color, fontWeight: '600', marginTop: '4px' }}>{activeCaseStudyProject.tagline}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '20px' }}>
                  <section>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ff5f56' }}>🔴</span> Problem
                    </h3>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.6', color: '#ccc' }}>
                      {activeCaseStudyProject.caseStudy.problem}
                    </p>
                  </section>
                  
                  <section>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ffbd2e' }}>🟡</span> Approach
                    </h3>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.6', color: '#ccc' }}>
                      {activeCaseStudyProject.caseStudy.approach}
                    </p>
                  </section>

                  <section>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#28c940' }}>🟢</span> Result
                    </h3>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.6', color: '#ccc' }}>
                      {activeCaseStudyProject.caseStudy.result}
                    </p>
                  </section>

                  <section>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#4daafc' }}>🔵</span> Impact
                    </h3>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.6', color: '#ccc' }}>
                      {activeCaseStudyProject.caseStudy.impact}
                    </p>
                  </section>
                </div>
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

          {openApps.akinator && (
            <Window
              id="akinator" title="🧞‍♂️ AI Akinator"
              onClose={() => toggleApp('akinator')}
              isActive={activeApp === 'akinator'} onFocus={() => focusApp('akinator')}
              isMaximized={maximizedApps.akinator} onToggleMaximize={() => toggleMaximize('akinator')}
              defaultPos={{ x: 400, y: 150 }}
            >
              <AkinatorApp />
            </Window>
          )}

          {openApps.typing && (
            <Window
              id="typing" title="⌨️ Keyword Typist"
              onClose={() => toggleApp('typing')}
              isActive={activeApp === 'typing'} onFocus={() => focusApp('typing')}
              isMaximized={maximizedApps.typing} onToggleMaximize={() => toggleMaximize('typing')}
              defaultPos={{ x: 350, y: 120 }}
            >
              <TypingTesterApp />
            </Window>
          )}

          {openApps.settings && (
            <Window
              id="settings" title="⚙️ System Settings"
              onClose={() => toggleApp('settings')}
              isActive={activeApp === 'settings'} onFocus={() => focusApp('settings')}
              isMaximized={maximizedApps.settings} onToggleMaximize={() => toggleMaximize('settings')}
              defaultPos={{ x: 260, y: 100 }}
            >
              <SettingsApp 
                currentWallpaper={wallpaper} 
                setWallpaper={setWallpaper} 
                currentAccentColor={accentColor} 
                setAccentColor={setAccentColor} 
              />
            </Window>
          )}

          {openApps.notepad && (
            <Window
              id="notepad" title="📝 Notepad"
              onClose={() => toggleApp('notepad')}
              isActive={activeApp === 'notepad'} onFocus={() => focusApp('notepad')}
              isMaximized={maximizedApps.notepad} onToggleMaximize={() => toggleMaximize('notepad')}
              defaultPos={{ x: 260, y: 150 }}
            >
              <NotepadApp />
            </Window>
          )}

          {openApps.weather && (
            <Window
              id="weather" title="🌤️ Weather"
              onClose={() => toggleApp('weather')}
              isActive={activeApp === 'weather'} onFocus={() => focusApp('weather')}
              isMaximized={maximizedApps.weather} onToggleMaximize={() => toggleMaximize('weather')}
              defaultPos={{ x: 150, y: 100 }}
            >
              <WeatherApp />
            </Window>
          )}
        </div>
      </div>
    </>
  )
}
