import React, { useState, useEffect, useRef } from 'react'

export default function AkinatorApp() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Start the game on component mount
  useEffect(() => {
    handleSendMessage("I am ready to play. What is your first question?", true)
  }, [])

  const handleSendMessage = async (text, isHidden = false) => {
    if (!text.trim() || isLoading) return

    const newMessages = [...messages]
    if (!isHidden) {
      newMessages.push({ role: 'user', content: text })
      setMessages(newMessages)
    }
    
    setIsLoading(true)

    // Append hidden message if it's the starter
    const updatedMessagesForApi = isHidden 
      ? [...messages, { role: 'user', content: text }]
      : newMessages

    try {
      const res = await fetch('/api/akinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessagesForApi })
      })
      const data = await res.json()

      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'The mystical connection was lost... (Error)' }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'The magical ether is blocked. I cannot read your mind right now.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      backgroundColor: '#1E1B2E', fontFamily: '"Ubuntu", sans-serif', color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px', backgroundColor: '#13111C', borderBottom: '1px solid #322A4E',
        display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '32px' }}>🧞‍♂️</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#EEDB73' }}>AI Akinator</div>
          <div style={{ fontSize: '13px', color: '#9D97B5' }}>Think of a character, and I will guess who it is!</div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '75%', padding: '12px 16px', borderRadius: '14px',
            backgroundColor: msg.role === 'user' ? '#5E2CA5' : '#2A2440',
            borderBottomRightRadius: msg.role === 'user' ? 0 : '14px',
            borderBottomLeftRadius: msg.role === 'assistant' ? 0 : '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            lineHeight: '1.5', fontSize: '15px'
          }}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start', maxWidth: '75%', padding: '12px 16px', borderRadius: '14px',
            backgroundColor: '#2A2440', borderBottomLeftRadius: 0, fontStyle: 'italic', color: '#aaa',
            display: 'flex', gap: '8px', alignItems: 'center'
          }}>
            <span style={{ fontSize: '20px' }}>🔮</span> Reading your mind...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Options */}
      <div style={{
        padding: '16px', backgroundColor: '#13111C', borderTop: '1px solid #322A4E',
        display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'
      }}>
        <button
          onClick={() => handleSendMessage('Yes')}
          disabled={isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', flex: '1 0 100px', transition: 'background 0.2s', opacity: isLoading ? 0.5 : 1 }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563EB'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3B82F6'}
        >
          ✅ Yes
        </button>
        <button
          onClick={() => handleSendMessage('No')}
          disabled={isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', flex: '1 0 100px', transition: 'background 0.2s', opacity: isLoading ? 0.5 : 1 }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2626'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EF4444'}
        >
          ❌ No
        </button>
        <button
          onClick={() => handleSendMessage('I don\'t know')}
          disabled={isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#6B7280', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', flex: '1 0 100px', transition: 'background 0.2s', opacity: isLoading ? 0.5 : 1 }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4B5563'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6B7280'}
        >
          🤷 Don't Know
        </button>
        <button
          onClick={() => handleSendMessage('Probably')}
          disabled={isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#8B5CF6', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', flex: '1 0 100px', transition: 'background 0.2s', opacity: isLoading ? 0.5 : 1 }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#7C3AED'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#8B5CF6'}
        >
          🤔 Probably
        </button>
        <button
          onClick={() => handleSendMessage('Probably Not')}
          disabled={isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#F59E0B', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', flex: '1 0 100px', transition: 'background 0.2s', opacity: isLoading ? 0.5 : 1 }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D97706'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F59E0B'}
        >
          🤨 Probably Not
        </button>
      </div>
    </div>
  )
}
