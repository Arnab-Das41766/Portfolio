import React, { useState } from 'react'

// ─── Your Certifications ──────────────────────────────────────────────────────
const CERTIFICATIONS = [
  {
    id: 'cybersecurity-google',
    name: 'Cybersecurity Specialization',
    issuer: 'Google',
    date: '2024',
    category: 'Cybersecurity',
    icon: '🔒',
    color: '#4285f4',
    description: 'Comprehensive cybersecurity specialization covering security fundamentals, threat analysis, and protection strategies.',
    file: 'Cybersecurity - Google.pdf',
    credentialUrl: null,
  },
  {
    id: 'computer-comm-coursera',
    name: 'Computer Communication',
    issuer: 'Coursera',
    date: '2023',
    category: 'Networking',
    icon: '🌐',
    color: '#0056d2',
    description: 'Computer communication course covering network protocols, data transmission, and communication systems.',
    file: 'Computer Communication - Coursera.pdf',
    credentialUrl: null,
  },
  {
    id: 'iot-coursera',
    name: 'Internet of Things (IoT)',
    issuer: 'Coursera',
    date: '2023',
    category: 'IoT',
    icon: '📱',
    color: '#1f2937',
    description: 'IoT fundamentals and development, covering embedded systems, sensors, and connected devices.',
    file: 'IOT - coursera.pdf',
    credentialUrl: null,
  },
  {
    id: 'nmap-udemy',
    name: 'Network Scanning with Nmap',
    issuer: 'Udemy',
    date: '2023',
    category: 'Cybersecurity',
    icon: '🔍',
    color: '#ea5252',
    description: 'Practical network reconnaissance and scanning techniques using Nmap for security assessments.',
    file: 'nmap - udemy.pdf',
    credentialUrl: null,
  },
  {
    id: 'sqli-udemy',
    name: 'SQL Injection & Database Security',
    issuer: 'Udemy',
    date: '2023',
    category: 'Cybersecurity',
    icon: '⚠️',
    color: '#f97316',
    description: 'SQL injection vulnerabilities, database security, and secure coding practices to prevent attacks.',
    file: 'sql injection - udemy.pdf',
    credentialUrl: null,
  },
  {
    id: 'wireshark-udemy',
    name: 'Network Analysis with Wireshark',
    issuer: 'Udemy',
    date: '2023',
    category: 'Networking',
    icon: '📊',
    color: '#0099d8',
    description: 'Network packet capture, analysis, and troubleshooting using Wireshark for security and diagnostics.',
    file: 'wireshark - udemy.pdf',
    credentialUrl: null,
  },
]
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', ...new Set(CERTIFICATIONS.map(c => c.category))]

export default function CertificationsApp() {
  const [selected, setSelected] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [preview, setPreview] = useState(null) // null | cert object for full-screen preview

  const filtered = activeCategory === 'All'
    ? CERTIFICATIONS
    : CERTIFICATIONS.filter(c => c.category === activeCategory)

  if (preview) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0a', color: '#fff' }}>
        {/* Preview header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', flexShrink: 0 }}>
          <button onClick={() => setPreview(null)} style={{ background: '#2a2a2a', border: 'none', color: '#aaa', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>← Back</button>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#eee' }}>{preview.name}</span>
          {preview.credentialUrl && (
            <a href={preview.credentialUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', background: '#7c3aed', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}>
              🔗 Verify Credential
            </a>
          )}
        </div>
        {/* Preview content */}
        {preview.file ? (
          preview.file.endsWith('.pdf') ? (
            <iframe src={`/certifications/${preview.file}`} style={{ flex: 1, border: 'none', width: '100%' }} title={preview.name} />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' }}>
              <img src={`/certifications/${preview.file}`} alt={preview.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} />
            </div>
          )
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#555', padding: '40px' }}>
            <span style={{ fontSize: '48px' }}>📄</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#888', marginBottom: '8px' }}>No file attached</div>
              <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.6' }}>
                Drop a PDF or image into<br />
                <code style={{ background: '#1a1a1a', padding: '2px 8px', borderRadius: '4px', color: '#a78bfa' }}>public/certifications/</code><br />
                and update the <code style={{ background: '#1a1a1a', padding: '2px 8px', borderRadius: '4px', color: '#a78bfa' }}>file</code> field in <code style={{ background: '#1a1a1a', padding: '2px 8px', borderRadius: '4px', color: '#a78bfa' }}>CertificationsApp.js</code>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#1c1c1c', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{ width: '160px', backgroundColor: '#141414', borderRight: '1px solid #2a2a2a', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', color: '#555', padding: '4px 8px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</div>
        {CATEGORIES.map(cat => (
          <div key={cat} onClick={() => setActiveCategory(cat)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
            backgroundColor: activeCategory === cat ? 'rgba(124,58,237,0.25)' : 'transparent',
            color: activeCategory === cat ? '#c4b5fd' : '#aaa',
            border: activeCategory === cat ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
            transition: 'all 0.15s'
          }}
            onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.backgroundColor = '#222' }}
            onMouseLeave={e => { if (activeCategory !== cat) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <span>{cat === 'All' ? '🗂' : '📂'}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
            {cat !== 'All' && (
              <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '10px', color: '#666' }}>
                {CERTIFICATIONS.filter(c => c.category === cat).length}
              </span>
            )}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '8px', fontSize: '10.5px', color: '#333', lineHeight: '1.5' }}>
          {CERTIFICATIONS.length} cert{CERTIFICATIONS.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Path bar */}
        <div style={{ height: '36px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '6px', fontSize: '13px', color: '#888', flexShrink: 0 }}>
          <span>🏠</span><span>›</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>Certifications</span>
          {activeCategory !== 'All' && <><span>›</span><span style={{ color: '#c4b5fd' }}>{activeCategory}</span></>}
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* File grid */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '10px' }}>
            {filtered.map(cert => (
              <div
                key={cert.id}
                onClick={() => setSelected(selected?.id === cert.id ? null : cert)}
                onDoubleClick={() => setPreview(cert)}
                style={{
                  width: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '10px 6px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
                  backgroundColor: selected?.id === cert.id ? `${cert.color}22` : 'transparent',
                  border: selected?.id === cert.id ? `1px solid ${cert.color}55` : '1px solid transparent',
                  userSelect: 'none'
                }}
                onMouseEnter={e => { if (selected?.id !== cert.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (selected?.id !== cert.id) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '12px',
                  background: `linear-gradient(135deg, ${cert.color}44, ${cert.color}22)`,
                  border: `1.5px solid ${cert.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', marginBottom: '8px', position: 'relative',
                  boxShadow: selected?.id === cert.id ? `0 0 16px ${cert.color}40` : 'none'
                }}>
                  {cert.icon}
                  {cert.file && (
                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '4px', backgroundColor: '#1c1c1c', border: `1px solid ${cert.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                      {cert.file.endsWith('.pdf') ? '📄' : '🖼'}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '11.5px', textAlign: 'center', color: selected?.id === cert.id ? '#fff' : '#ccc', lineHeight: '1.3', wordBreak: 'break-word' }}>{cert.name}</span>
                <span style={{ fontSize: '10px', color: cert.color + 'cc', marginTop: '3px' }}>{cert.date}</span>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', flexDirection: 'column', gap: '10px', width: '100%', paddingTop: '60px' }}>
                <span style={{ fontSize: '36px' }}>🗂️</span>
                <span style={{ fontSize: '14px' }}>No certifications in this category</span>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ width: '220px', backgroundColor: '#141414', borderLeft: '1px solid #2a2a2a', padding: '20px 16px', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px' }}>{selected.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#eee', lineHeight: '1.4' }}>{selected.name}</div>
                <div style={{ fontSize: '11px', color: selected.color, fontWeight: '600' }}>{selected.issuer}</div>
                <div style={{ fontSize: '11px', color: '#555', background: '#222', padding: '3px 10px', borderRadius: '20px' }}>{selected.date}</div>
              </div>

              <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '12px', fontSize: '12px', color: '#888', lineHeight: '1.6' }}>
                {selected.description}
              </div>

              {/* Category badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#555' }}>Category</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', padding: '2px 10px', borderRadius: '20px' }}>{selected.category}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                {/* View certificate button */}
                <button onClick={() => setPreview(selected)} style={{ padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                  📄 View Certificate
                </button>
                {selected.credentialUrl && (
                  <a href={selected.credentialUrl} target="_blank" rel="noreferrer" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#222', color: '#aaa', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    🔗 Verify Credential
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
