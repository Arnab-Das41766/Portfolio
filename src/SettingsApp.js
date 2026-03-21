import React, { useState } from 'react';

const WALLPAPERS = [
  { id: 'ubuntu', name: 'Ubuntu Default', value: 'linear-gradient(135deg, #E95420, #77216F)' },
  { id: 'hacker', name: 'Hacker Terminal', value: '#0a0a0a' },
  { id: 'ocean', name: 'Deep Ocean', value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
  { id: 'purple', name: 'Royal Purple', value: 'linear-gradient(135deg, #4b134f, #c94b4b)' },
  { id: 'minimal', name: 'Minimal Gray', value: '#2c3e50' },
  { id: 'cyber', name: 'Cyberpunk', value: 'linear-gradient(135deg, #120E1F, #F83600, #F9D423)' },
];

const ACCENT_COLORS = [
  { id: 'orange', name: 'Ubuntu Orange', value: '#e95420' },
  { id: 'blue', name: 'Ocean Blue', value: '#3498db' },
  { id: 'green', name: 'Hacker Green', value: '#2ecc71' },
  { id: 'purple', name: 'Royal Purple', value: '#9b59b6' },
  { id: 'red', name: 'Crimson Red', value: '#e74c3c' },
  { id: 'yellow', name: 'Sun Yellow', value: '#f1c40f' },
];

export default function SettingsApp({ currentWallpaper, setWallpaper, currentAccentColor, setAccentColor }) {
  const [activeTab, setActiveTab] = useState('background');

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      backgroundColor: '#1E1E1E', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '180px', backgroundColor: '#141414', borderRight: '1px solid #2a2a2a',
        padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px'
      }}>
        <div style={{ fontSize: '11px', color: '#666', padding: '0 8px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
          Personalize
        </div>
        
        <div 
          onClick={() => setActiveTab('background')}
          style={{
            padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
            backgroundColor: activeTab === 'background' ? currentAccentColor : 'transparent',
            color: activeTab === 'background' ? '#fff' : '#ccc',
            transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          <span>🖼️</span> Background
        </div>
        
        <div 
          onClick={() => setActiveTab('appearance')}
          style={{
            padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
            backgroundColor: activeTab === 'appearance' ? currentAccentColor : 'transparent',
            color: activeTab === 'appearance' ? '#fff' : '#ccc',
            transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          <span>🎨</span> Appearance
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {activeTab === 'background' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
              Desktop Background
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
              {WALLPAPERS.map((wp) => (
                <div key={wp.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <div 
                    onClick={() => {
                      setWallpaper(wp.value);
                      localStorage.setItem('ubuntu-wallpaper', wp.value);
                    }}
                    style={{
                      width: '100%', paddingBottom: '60%', background: wp.value, borderRadius: '12px', cursor: 'pointer',
                      border: currentWallpaper === wp.value ? `3px solid ${currentAccentColor}` : '3px solid transparent',
                      boxShadow: currentWallpaper === wp.value ? `0 0 15px ${currentAccentColor}66` : '0 4px 10px rgba(0,0,0,0.5)',
                      transition: 'transform 0.2s, border 0.2s', transform: currentWallpaper === wp.value ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  <span style={{ fontSize: '13px', color: currentWallpaper === wp.value ? '#fff' : '#aaa', fontWeight: currentWallpaper === wp.value ? 'bold' : 'normal' }}>
                    {wp.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
              Appearance
            </h2>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                System Accent Color
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {ACCENT_COLORS.map((color) => (
                  <div key={color.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      onClick={() => {
                        setAccentColor(color.value);
                        localStorage.setItem('ubuntu-accent-color', color.value);
                      }}
                      style={{
                        width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color.value, cursor: 'pointer',
                        border: currentAccentColor === color.value ? '3px solid #fff' : '3px solid transparent',
                        boxShadow: currentAccentColor === color.value ? `0 0 15px ${color.value}88` : '0 4px 8px rgba(0,0,0,0.4)',
                        transform: currentAccentColor === color.value ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s, border 0.2s'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: currentAccentColor === color.value ? '#fff' : '#888' }}>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '12px', borderLeft: `4px solid ${currentAccentColor}` }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>💡</span> Note
              </h3>
              <p style={{ margin: '0', fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>
                The Accent Color applies globally to buttons, active window dock indicators, highlighted items, and selection borders across your desktop apps. 
                These settings are automatically saved and will be restored on your next visit!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
