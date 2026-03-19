import { useState, useRef, useEffect } from 'react'
import desktopIcon from './image.png'

export const TRACKS = [
  { id: '1', name: 'Lofi Chill (Ek Tera Pyar)', src: '/music/Ek_Tera_Pyar.mp3' },
  { id: '2', name: 'Motivation (Dream On)', src: '/music/Aerosmith - Dream On.mp3' },
  { id: '3', name: 'Sad Vibes (Arijit Singh)', src: '/music/Arijit Singh - Main Dhoondne Ko Zamaane Mein.mp3' },
  { id: '4', name: 'Classic Retro (Feeling Good) ', src: '/music/Michael Bubl - Feeling Good.m4a' },
]

const COMMANDS = {
  help: () => [
    '+---------------------------------------+',
    '|           available commands          |',
    '+---------------------------------------+',
    '|  skills       →  tech stack           |',
    '|  contact      →  get in touch         |',
    '|  whoami       →  quick intro          |',
    '|  date         →  current date & time  |',
    '|  projects     →  notable work         |',
    '|  sudo resume  →  download resume      |',
    '|  help         →  show this menu       |',
    '|  clear        →  clear terminal       |',
    '|  silly stuff  →  ???                  |',
    '+---------------------------------------+',
  ],

  'silly stuff': () => [
    '+---------------------------------------+',
    '|             silly stuff               |',
    '+---------------------------------------+',
    '|  music        →  chill beats          |',
    '|  music stop   → To stop playing music |',
    '|  hack         →  matrix overload      |',
    '|  theme <name> →  matrix, retro, def.  |',
    '|  sudo rm -rf /→  do not type this     |',
    '+---------------------------------------+',
  ],

  whoami: () => [
    '> Arnab Das — vibecoder 🚀',
    '',
    '  Developer, tinkerer, and perpetual learner.',
    '  Building things at the intersection of AI & web.',
    '  Passionate about 3D experiences and crafting products that feel alive.',
    '',
    '  Currently: making the web weird and wonderful.',
  ],

  skills: () => [
    '> Tech Stack',
    '',
    '  Languages       →  Python, JavaScript, TypeScript, HTML5, CSS3, SQL',
    '  Frontend        →  React 18, Vite, Tailwind CSS, shadcn/ui, Recharts, D3, GSAP, Socket.IO',
    '  Backend         →  FastAPI, Flask, Flask-SocketIO, Supabase, SQLite, Uvicorn',
    '  AI / ML         →  Ollama (local LLM), Qwen 2.5, DeepSeek API, Groq APIs',
    '  Security        →  AES-256-GCM, Web Crypto API, Argon2id',
    '  Red Team / PoC  →  C2 Techniques, Malwares, Spywares, Rats, Phishing, Social Engineering, Pentesting',
    '  GIS / Geo       →  Python (OSMnx), Folium, GeoPandas, react-simple-maps',
    '  Tools & Misc    →  Git, VS Code, Netlify, Cloudflare Tunnel, Gevent, SMTP / Email',
  ],

  contact: () => [
    '> Reach Out',
    '',
    <span key="github">  GitHub   →  <a href="https://github.com/Arnab-Das41766" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>github.com/Arnab-Das41766</a></span>,
    <span key="email">  Email    →  <a href="mailto:arnabdas40922@gmail.com" style={{ color: '#a78bfa', textDecoration: 'underline' }}>arnabdas40922@gmail.com</a></span>,
    <span key="linkedin">  LinkedIn →  <a href="https://www.linkedin.com/in/arnab-das-183ba7302/" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>linkedin.com/in/Arnab-Das</a></span>,
    '',
  ],

  projects: () => [
    '> Notable Projects',
    '',
    '  RiskAtlas      →  AI trade risk intelligence dashboard',
    '  Encrive        →  Zero-knowledge encrypted cloud storage',
    '  AutoBusBook    →  Intercity bus booking platform',
    '  Stockbook v2   →  AI-powered stock portfolio tracker',
    '  Code-Strikers  →  Real-time multiplayer DSA quiz',
    '  Red-Team-Labs  →  Offensive security PoC collection',
  ],

  date: () => [new Date().toString()],

  'sudo resume': () => {
    // Programmatically trigger a download for the resume
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/Arnab_Das_CV.pdf' // Place resume.pdf in the public/ folder
      link.download = 'Resume_Arnab_Das.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 500)

    return [
      'Authenticating as root...',
      'Access granted.',
      'Initiating download for Resume_Arnab_Das.pdf...',
    ]
  },

  hack: ({ setLines }) => {
    let count = 0
    const chars = '0123456789ABCDEF!@#$%^&*()_+'
    const iv = setInterval(() => {
      let line = ''
      for (let i = 0; i < 50; i++) line += chars[Math.floor(Math.random() * chars.length)]
      setLines(prev => [...prev, { type: 'output', text: line }])
      count++
      if (count > 25) {
        clearInterval(iv)
        setLines(prev => [
          ...prev,
          { type: 'error', text: '[ SYSTEM COMPROMISE DETECTED ]' },
          { type: 'output', text: 'ACCESS GRANTED to Red-Team-Labs mainframe.' }
        ])
      }
    }, 45)
    return ['Initiating unauthorized access sequence...', 'Bypassing visual subroutines...']
  },

  'sudo rm -rf /': ({ setLines }) => {
    setTimeout(() => {
      setLines(prev => [...prev, { type: 'error', text: '... just kidding. You don\'t have root privileges! Nice try though.' }])
    }, 1500)
    return [
      '[CRITICAL] Deleting system32...',
      '[CRITICAL] Purging database...',
      '[CRITICAL] Erasing kernel...',
    ]
  },
}

const BOOT_LINES = [
  'ArnabOS v1.0.0 — vibecoder edition',
  'Kernel: react-scripts 5.0.1',
  'Uptime: always',
  '',
  'Type `help` to see available commands.',
  '',
]

export default function Terminal({ onDesktopSwitch }) {
  const [lines, setLines] = useState(BOOT_LINES.map(l => ({ type: 'output', text: l })))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [theme, setTheme] = useState('default')
  const [isDesktopLoading, setIsDesktopLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const audioRef = useRef(null)

  const themeStyles = {
    matrix: `
      .terminal { background: #000 !important; color: #0f0 !important; text-shadow: 0 0 5px #0f0; }
      .terminal-line--output { color: #0f0 !important; }
      .terminal-line--prompt { color: #0f0 !important; }
      .terminal-prompt span { color: #0f0 !important; }
      .terminal-titlebar { background: #001100 !important; border-bottom: 1px solid #0f0 !important; }
      .terminal-title { color: #0f0 !important; }
      .terminal-input { color: #0f0 !important; text-shadow: 0 0 5px #0f0; caret-color: #0f0 !important; }
      .dot { background: #0f0 !important; box-shadow: 0 0 5px #0f0; }
    `,
    retro: `
      .terminal { background: #2b1d0f !important; color: #ffb000 !important; text-shadow: 0 0 5px #ffb000; }
      .terminal-line--output { color: #ffb000 !important; }
      .terminal-line--prompt { color: #ffb000 !important; }
      .terminal-prompt span { color: #ffb000 !important; }
      .terminal-titlebar { background: #1a1005 !important; border-bottom: 1px solid #ffb000 !important; }
      .terminal-title { color: #ffb000 !important; }
      .terminal-input { color: #ffb000 !important; caret-color: #ffb000 !important; }
      .dot { background: #ffb000 !important; }
    `
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = 0.5
    return () => {
      audioRef.current?.pause()
      if (audioRef.current) audioRef.current.src = ''
    }
  }, [])

  useEffect(() => {
    if (isDesktopLoading) {
      let prog = 0
      const iv = setInterval(() => {
        prog += Math.random() * 12
        if (prog >= 100) {
          prog = 100
          clearInterval(iv)
          setTimeout(() => {
            setIsDesktopLoading(false)
            setLoadingProgress(0)
            if (onDesktopSwitch) onDesktopSwitch()
          }, 1200)
        }
        setLoadingProgress(prog)
      }, 250)
      return () => clearInterval(iv)
    }
  }, [isDesktopLoading])

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase()
    const newLines = [{ type: 'prompt', text: raw }]

    if (!cmd) {
      setLines(prev => [...prev, ...newLines])
      return
    }

    if (cmd === 'clear') {
      setLines(BOOT_LINES.map(l => ({ type: 'output', text: l })))
      setHistory(prev => [raw, ...prev])
      setHistIdx(-1)
      return
    }

    const fn = COMMANDS[cmd]
    if (fn) {
      const res = fn({ setLines, setTheme })
      if (res) {
        res.forEach(l => newLines.push({ type: 'output', text: l }))
      }
    } else if (cmd.startsWith('theme ')) {
      const col = cmd.split(' ')[1]
      if (['matrix', 'retro', 'default'].includes(col)) {
        setTheme(col)
        newLines.push({ type: 'output', text: `Theme updated: ${col}` })
      } else {
        newLines.push({ type: 'error', text: `Theme not found. Try: theme matrix, theme retro, or theme default.` })
      }
    } else if (cmd.startsWith('music')) {
      const args = cmd.split(' ').filter(Boolean)
      if (args.length === 1 || args[1] === 'list') {
        newLines.push({ type: 'output', text: '🎵 Available Music Tracks:' })
        TRACKS.forEach(t => newLines.push({ type: 'output', text: `  [${t.id}] ${t.name}` }))
        newLines.push({ type: 'output', text: 'Type `music <id>` to play, or `music stop` to halt.' })
      } else if (args[1] === 'stop') {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        newLines.push({ type: 'output', text: 'Music playback stopped.' })
      } else {
        const trackId = args[1]
        const tr = TRACKS.find(t => t.id === trackId)
        if (tr) {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = tr.src
            audioRef.current.play().catch(e => console.error(e))
          }
          newLines.push({ type: 'output', text: `▶ Playing: ${tr.name}` })
        } else {
          newLines.push({ type: 'error', text: `Track [${trackId}] not found.` })
        }
      }
    } else {
      newLines.push({ type: 'error', text: `bash: ${cmd}: command not found. Type 'help' for options.` })
    }

    setLines(prev => [...prev, ...newLines])
    setHistory(prev => [raw, ...prev])
    setHistIdx(-1)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  return (
    <>
      <style>{`
        @keyframes desktopPulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 15px rgba(167,139,250,0.6)); }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
      <div className="terminal" onClick={() => inputRef.current?.focus()}>
        {theme !== 'default' && <style>{themeStyles[theme]}</style>}
        <div className="terminal-titlebar">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="terminal-title">arnab@portfolio: ~</span>
          <img
            src={desktopIcon}
            alt="Desktop OS"
            title="Boot Desktop Environment"
            onClick={(e) => { e.stopPropagation(); setIsDesktopLoading(true); }}
            style={{ width: '18px', height: '18px', marginLeft: 'auto', cursor: 'pointer', borderRadius: '4px', filter: 'drop-shadow(0 0 3px rgba(167,139,250,0.4))' }}
          />
        </div>
        <div className="terminal-body">
          {lines.map((line, i) => (
            <div key={i} className={`terminal-line terminal-line--${line.type}`}>
              {line.type === 'prompt' && (
                <span className="terminal-prompt" style={{ marginRight: '6px' }}>
                  <span style={{ color: '#4ade80', fontWeight: 'bold' }}>arnab@portfolio</span>
                  <span style={{ color: '#cbd5e1' }}>:</span>
                  <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>~</span>
                  <span style={{ color: '#ffffff' }}>$</span>
                </span>
              )}
              {line.text}
            </div>
          ))}
          <div className="terminal-input-row">
            <span className="terminal-prompt" style={{ marginRight: '6px' }}>
              <span style={{ color: '#4ade80', fontWeight: 'bold' }}>arnab@portfolio</span>
              <span style={{ color: '#cbd5e1' }}>:</span>
              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>~</span>
              <span style={{ color: '#ffffff' }}>$</span>
            </span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {isDesktopLoading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#0a0a0a', color: '#a78bfa', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 99999, fontFamily: '"JetBrains Mono", monospace'
        }}>
          <img src={desktopIcon} alt="Logo" style={{ width: '90px', height: '90px', marginBottom: '35px', animation: 'desktopPulse 2s infinite ease-in-out', borderRadius: '12px' }} />
          <h2 style={{ marginBottom: '20px', letterSpacing: '3px', fontSize: '1.3rem', textTransform: 'uppercase', fontWeight: 600 }}>Loading Desktop Environment</h2>
          <div style={{ width: '320px', height: '14px', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '2px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
            <div style={{ height: '100%', backgroundColor: '#a78bfa', width: `${loadingProgress}%`, transition: 'width 0.2s ease-out', borderRadius: '4px', boxShadow: '0 0 15px rgba(167,139,250,0.8)' }}></div>
          </div>
          <div style={{ marginTop: '20px', color: '#6b7280', fontSize: '0.85rem', letterSpacing: '1px' }}>
            {Math.floor(loadingProgress)}% / MOUNTING_ROOT_FS
          </div>
        </div>
      )}
    </>
  )
}
