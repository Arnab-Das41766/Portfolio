import React, { useState, useRef, useEffect } from 'react'

const WELCOME_MSG = {
  role: 'assistant',
  content: "👋 Hey! I'm **Arnab Bot** — your guide to Arnab Das's portfolio!\n\nI can help you with:\n- 📁 Info about any of his **8 GitHub projects**\n- 🚀 How to **clone, install & run** them\n- 💡 What each project **does and why it exists**\n- 📬 How to **connect with Arnab**\n\nWhat would you like to know?"
}

function renderMarkdown(text) {
  // Simple inline markdown: **bold**, `code`, line breaks
  return text
    .split('\n')
    .map((line, i) => {
      // Code blocks (single-line)
      if (line.startsWith('```')) return null
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline code
      line = line.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.12);padding:1px 5px;border-radius:3px;font-family:monospace;font-size:12px">$1</code>')
      // Bullet points
      if (line.startsWith('- ')) {
        line = `<span style="display:flex;gap:6px;align-items:flex-start"><span style="opacity:0.5;flex-shrink:0">•</span><span>${line.slice(2)}</span></span>`
      }
      return <div key={i} style={{ minHeight: '4px' }} dangerouslySetInnerHTML={{ __html: line }} />
    })
    .filter(Boolean)
}

export default function ArnabBot() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setError(null)

    const userMsg = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Build the conversation history (exclude the welcome message for the API)
    const apiMessages = newMessages
      .slice(1) // remove welcome which is just for UI
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get response')
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I had trouble connecting. Try again in a moment!'
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const SUGGESTIONS = [
    "Tell me about RiskAtlas",
    "How do I run Code-Strikers?",
    "What is Encrive?",
    "How can I contact Arnab?",
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: '#0d1117', fontFamily: '"Inter", "Segoe UI", sans-serif',
      color: '#e2e8f0', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 18px', borderBottom: '1px solid rgba(124,58,237,0.3)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))',
        flexShrink: 0
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#e2e8f0' }}>Arnab Bot</div>
          <div style={{ fontSize: '11px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            Powered by Groq · llama-3.3-70b
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '85%', padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
                : 'rgba(255,255,255,0.06)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
              fontSize: '13.5px', lineHeight: '1.6', color: '#e2e8f0',
              boxShadow: msg.role === 'user' ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
            }}>
              {renderMarkdown(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', gap: '4px', alignItems: 'center'
            }}>
              {[0.1, 0.2, 0.35].map((d, i) => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#a78bfa',
                  animation: `botBounce 1s ${d}s infinite ease-in-out`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions (only show before first user message) */}
      {messages.length === 1 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setInput(s); inputRef.current?.focus() }} style={{
              fontSize: '11.5px', padding: '5px 12px', borderRadius: '20px',
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)',
              color: '#c4b5fd', cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{
        padding: '12px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.3)', flexShrink: 0
      }}>
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.05)', borderRadius: '14px',
          border: '1px solid rgba(124,58,237,0.3)', padding: '8px 8px 8px 14px',
          transition: 'border-color 0.2s'
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything about Arnab's projects..."
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#e2e8f0', fontSize: '13.5px', fontFamily: 'inherit',
              resize: 'none', lineHeight: '1.5', maxHeight: '100px',
              scrollbarWidth: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: '34px', height: '34px', borderRadius: '10px', border: 'none', flexShrink: 0,
              background: input.trim() && !loading ? 'linear-gradient(135deg, #7c3aed, #6366f1)' : 'rgba(255,255,255,0.08)',
              color: '#fff', cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? '0 2px 10px rgba(124,58,237,0.4)' : 'none'
            }}
          >↑</button>
        </div>
        <div style={{ fontSize: '10.5px', color: '#4b5563', textAlign: 'center', marginTop: '8px' }}>
          Shift+Enter for new line · Enter to send
        </div>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes botBounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
