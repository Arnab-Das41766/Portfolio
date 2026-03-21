import React, { useState, useEffect } from 'react';

export default function NotepadApp() {
  const [text, setText] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedText = localStorage.getItem('ubuntu-notepad-data');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Save to localStorage on change
  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    localStorage.setItem('ubuntu-notepad-data', val);
  };


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      backgroundColor: '#f5f5f5', color: '#111', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        height: '32px', backgroundColor: '#e1e1e1', borderBottom: '1px solid #ccc',
        display: 'flex', alignItems: 'center', padding: '0 10px', gap: '15px', fontSize: '13px'
      }}>
        <span style={{ cursor: 'pointer' }}>File</span>
        <span style={{ cursor: 'pointer' }}>Edit</span>
        <span style={{ cursor: 'pointer' }}>Format</span>
        <span style={{ cursor: 'pointer' }}>View</span>
        <span style={{ cursor: 'pointer' }}>Help</span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type your notes here... (Saves automatically)"
        style={{
          flex: 1, width: '100%', padding: '10px 15px', border: 'none', outline: 'none',
          resize: 'none', backgroundColor: '#ffffff', color: '#000', fontSize: '15px',
          lineHeight: '1.5', boxSizing: 'border-box', fontFamily: 'monospace',
          userSelect: 'text', WebkitUserSelect: 'text'
        }}
        spellCheck="false"
      />

      <div style={{
        height: '24px', backgroundColor: '#f0f0f0', borderTop: '1px solid #dcdcdc',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 15px',
        fontSize: '11px', color: '#666', gap: '20px'
      }}>
        <span>Ln {text.split('\\n').length}, Col {text.split('\\n').pop().length + 1}</span>
        <span>100%</span>
        <span>Windows (CRLF)</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
