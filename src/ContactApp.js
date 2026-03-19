import React, { useState } from 'react'

const FIELDS = [
  { key: 'name', label: 'Your Name', placeholder: 'e.g. Jane Smith', type: 'text', required: true },
  { key: 'email', label: 'Your Email', placeholder: 'e.g. jane@example.com', type: 'email', required: true },
  { key: 'subject', label: 'Subject / Need', placeholder: 'e.g. Freelance project, Collaboration, Query…', type: 'text', required: false },
]

const QUICK_SUBJECTS = [
  '💼 Hire me for a project',
  '🤝 Open-source collaboration',
  '🐛 Found a bug in your code',
  '💬 Just saying hi!',
]

export default function ContactApp() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [touched, setTouched] = useState({})

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const touch = (key) => setTouched(t => ({ ...t, [key]: true }))

  const isEmailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const errors = {
    name: touched.name && !form.name.trim() ? 'Name is required' : null,
    email: touched.email && (!form.email.trim() ? 'Email is required' : !isEmailValid(form.email) ? 'Invalid email address' : null),
    message: touched.message && !form.message.trim() ? 'Please write a message' : null,
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const submit = async (e) => {
    e.preventDefault()
    // Touch all fields to show validation
    setTouched({ name: true, email: true, message: true })
    if (!form.name.trim() || !form.email.trim() || !isEmailValid(form.email) || !form.message.trim()) return

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', subject: '', message: '' })
    setTouched({})
    setStatus('idle')
    setErrorMsg('')
  }

  const inputStyle = (key) => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${errors[key] ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '13.5px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  })

  if (status === 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0d1117', gap: '20px', padding: '40px', textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '64px', animation: 'popIn 0.4s ease-out' }}>📬</div>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#e2e8f0', marginBottom: '8px' }}>Message Sent!</div>
          <div style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7', maxWidth: '300px' }}>
            Thanks, <strong style={{ color: '#a78bfa' }}>{form.name.split(' ')[0]}</strong>! Arnab will get back to you at <strong style={{ color: '#a78bfa' }}>{form.email}</strong> soon.
          </div>
        </div>
        <button onClick={reset} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', boxShadow: '0 4px 15px rgba(124,58,237,0.35)' }}>
          Send another message
        </button>
        <style>{`@keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117', fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#e2e8f0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))', borderBottom: '1px solid rgba(124,58,237,0.25)', padding: '16px 20px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 14px rgba(124,58,237,0.4)', flexShrink: 0 }}>📬</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>Contact Arnab</div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Share your project needs, ideas, or questions</div>
        </div>
      </div>

      {/* Scrollable form area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <form onSubmit={submit} noValidate>
          {/* Text fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '14px' }}>
            {FIELDS.map(({ key, label, placeholder, type, required }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {label}{required && <span style={{ color: '#7c3aed', marginLeft: '3px' }}>*</span>}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  onBlur={() => touch(key)}
                  onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)' }}
                  placeholder={placeholder}
                  style={inputStyle(key)}
                />
                {errors[key] && <div style={{ fontSize: '11.5px', color: '#f87171', marginTop: '4px' }}>{errors[key]}</div>}
              </div>
            ))}
          </div>

          {/* Quick subject pills */}
          {!form.subject && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11.5px', color: '#4b5563', marginBottom: '8px' }}>Quick select:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {QUICK_SUBJECTS.map((s, i) => (
                  <button key={i} type="button" onClick={() => set('subject', s)} style={{ fontSize: '11.5px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Message textarea */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Message <span style={{ color: '#7c3aed' }}>*</span>
            </label>
            <textarea
              rows={5}
              value={form.message}
              onChange={e => set('message', e.target.value)}
              onBlur={() => touch('message')}
              onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)' }}
              placeholder="Describe what you need, your project idea, or any questions you have for Arnab…"
              style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '100px', lineHeight: '1.6' }}
            />
            {errors.message && <div style={{ fontSize: '11.5px', color: '#f87171', marginTop: '4px' }}>{errors.message}</div>}
            <div style={{ fontSize: '11px', color: '#374151', marginTop: '4px', textAlign: 'right' }}>{form.message.length} chars</div>
          </div>

          {/* Error banner */}
          {status === 'error' && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {errorMsg || 'Something went wrong. Please try again.'}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === 'sending' || hasErrors} style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
            background: status === 'sending' || hasErrors ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
            color: status === 'sending' || hasErrors ? 'rgba(255,255,255,0.4)' : '#fff',
            cursor: status === 'sending' || hasErrors ? 'not-allowed' : 'pointer',
            fontSize: '14px', fontWeight: '700', fontFamily: 'inherit',
            boxShadow: status === 'sending' || hasErrors ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            {status === 'sending' ? (
              <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Sending…</>
            ) : '📨 Send Message'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: '#374151', textAlign: 'center', flexShrink: 0 }}>
        Your details are private · Arnab is notified instantly
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #4b5563; }
      `}</style>
    </div>
  )
}
