import React, { useState, useRef, useEffect } from 'react'
import { TRACKS } from './Terminal'

export default function MusicPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)

  // Initialize and handle track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    audioRef.current = new Audio(TRACKS[currentIdx].src)
    audioRef.current.volume = 0.5
    
    // Auto-play next track
    const handleEnded = () => {
      setCurrentIdx((curr) => (curr + 1) % TRACKS.length)
      setIsPlaying(true)
    }

    const updateProgress = () => {
      if (audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
      }
    }
    
    audioRef.current.addEventListener('timeupdate', updateProgress)
    audioRef.current.addEventListener('ended', handleEnded)
    
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback error:", e))
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('timeupdate', updateProgress)
        audioRef.current.removeEventListener('ended', handleEnded)
      }
    }
  }, [currentIdx])

  // Handle Play/Pause toggle
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback error:", e))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleNext = () => {
    setCurrentIdx((curr) => (curr + 1) % TRACKS.length)
    setIsPlaying(true)
  }
  const handlePrev = () => {
    setCurrentIdx((curr) => (curr - 1 + TRACKS.length) % TRACKS.length)
    setIsPlaying(true)
  }

  // A tiny helper to parse Artist vs Title from strings like "Motivation (Dream On)"
  // -> title: "Dream On", artist: "Motivation"
  const parseTrackInfo = (rawName) => {
    const match = rawName.match(/(.+)\s*\((.+)\)/)
    if (match) return { artist: match[1].trim(), title: match[2].trim() }
    return { artist: 'Unknown Artist', title: rawName }
  }

  const currentTrackInfo = parseTrackInfo(TRACKS[currentIdx].name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#121212', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif' }}>
      
      {/* Top Main Section */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Spotify Sidebar */}
        <div style={{ width: '180px', backgroundColor: '#000', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '15px', color: '#b3b3b3', borderRight: '1px solid #282828' }}>
           <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
             <span style={{ color: '#1db954', fontSize: '24px' }}>🎵</span> Spotify
           </div>
           
           <div style={{ cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '4px', backgroundColor: '#282828', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
             <span style={{ fontSize: '18px' }}>🏠</span> Home
           </div>
           <div style={{ cursor: 'pointer', padding: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#b3b3b3'}>
             <span style={{ fontSize: '18px' }}>🔍</span> Search
           </div>
           <div style={{ cursor: 'pointer', padding: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#b3b3b3'}>
             <span style={{ fontSize: '18px' }}>📚</span> Your Library
           </div>
        </div>

        {/* Track List Workspace */}
        <div style={{ flex: 1, padding: '20px 30px', background: 'linear-gradient(to bottom, #1db95420, #121212 40%)', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '5px', fontWeight: '800' }}>Vibes Collection</h2>
          <div style={{ color: '#b3b3b3', fontSize: '13px', marginBottom: '30px' }}>Arnab Das • {TRACKS.length} songs</div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#b3b3b3', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '10px', width: '40px', fontWeight: '400' }}>#</th>
                <th style={{ padding: '10px', fontWeight: '400' }}>Title</th>
                <th style={{ padding: '10px', fontWeight: '400' }}>Album / Artist</th>
              </tr>
            </thead>
            <tbody>
              {TRACKS.map((track, i) => {
                const info = parseTrackInfo(track.name)
                const isActive = currentIdx === i

                return (
                  <tr 
                    key={track.id} 
                    onClick={() => { setCurrentIdx(i); setIsPlaying(true); }}
                    style={{ 
                      cursor: 'pointer', 
                      backgroundColor: isActive ? '#ffffff1a' : 'transparent',
                      color: isActive ? '#1db954' : '#b3b3b3',
                      transition: 'background-color 0.2s ease, color 0.1s ease',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff0a' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <td style={{ padding: '12px 10px', borderRadius: '8px 0 0 8px' }}>
                      {isActive && isPlaying ? <span style={{ fontSize: '12px', animation: 'desktopPulse 1s infinite' }}>▶</span> : i + 1}
                    </td>
                    <td style={{ padding: '12px 10px', color: isActive ? '#1db954' : '#fff', fontWeight: '500' }}>{info.title}</td>
                    <td style={{ padding: '12px 10px', borderRadius: '0 8px 8px 0' }}>{info.artist}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div style={{ height: '90px', backgroundColor: '#181818', borderTop: '1px solid #282828', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10 }}>
        
        {/* Current Track Info */}
        <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
           <div style={{ width: '56px', height: '56px', backgroundColor: '#282828', marginRight: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
             🎧
           </div>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>{currentTrackInfo.title}</span>
             <span style={{ fontSize: '12px', color: '#b3b3b3', marginTop: '2px' }}>{currentTrackInfo.artist}</span>
           </div>
           <div style={{ marginLeft: '20px', fontSize: '18px', color: '#1db954' }}>💚</div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '500px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '8px' }}>
              <button style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '16px', cursor: 'pointer' }}>🔀</button>
              <button 
                onClick={handlePrev} 
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#1db954'} onMouseLeave={e => e.target.style.color='#fff'}
              >
                ⏮
              </button>
              
              <button 
                onClick={handlePlayPause}
                style={{ 
                  width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', 
                  border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  cursor: 'pointer', fontSize: '16px', transition: 'transform 0.1s ease',
                  paddingLeft: isPlaying ? '0' : '2px' 
                }}
                onMouseDown={e => e.target.style.transform='scale(0.95)'}
                onMouseUp={e => e.target.style.transform='scale(1)'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              
              <button 
                onClick={handleNext} 
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#1db954'} onMouseLeave={e => e.target.style.color='#fff'}
              >
                ⏭
              </button>
              <button style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '16px', cursor: 'pointer' }}>🔁</button>
           </div>
           
           {/* Progress Bar Segment */}
           <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontSize: '11px', color: '#b3b3b3', userSelect: 'none' }}>{(progress / 100 * (audioRef.current?.duration || 0) / 60).toFixed(2).replace('.', ':')}</span>
             <div style={{ flex: 1, height: '4px', backgroundColor: '#535353', borderRadius: '2px', cursor: 'pointer', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#1db954', borderRadius: '2px' }} />
             </div>
             <span style={{ fontSize: '11px', color: '#b3b3b3', userSelect: 'none' }}>
                {audioRef.current?.duration ? (audioRef.current.duration / 60).toFixed(2).replace('.', ':') : '0:00'}
             </span>
           </div>
        </div>

        {/* Volume / Extra Placeholder */}
        <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', color: '#b3b3b3' }}>
          <span style={{ fontSize: '14px' }}>🎤</span>
          <span style={{ fontSize: '14px' }}>📻</span>
          <span style={{ fontSize: '16px' }}>🔈</span>
          <div style={{ width: '90px', height: '4px', backgroundColor: '#535353', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '50%', backgroundColor: '#fff', borderRadius: '2px' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
