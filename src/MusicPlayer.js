import React, { useState, useRef, useEffect, useCallback } from 'react'
import { TRACKS } from './tracks'

export default function MusicPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none') // 'none' | 'all' | 'one'
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  // Helper: pick next track depending on shuffle/repeat
  const getNextIdx = useCallback((curr) => {
    if (repeatMode === 'one') return curr
    if (isShuffle) {
      let next
      do { next = Math.floor(Math.random() * TRACKS.length) } while (next === curr && TRACKS.length > 1)
      return next
    }
    return (curr + 1) % TRACKS.length
  }, [isShuffle, repeatMode])

  // Initialize audio element once
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume / 100

    return () => {
      audioRef.current?.pause()
    }
  }, []) // eslint-disable-line

  // Load new track when currentIdx changes
  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current

    audio.pause()
    audio.src = TRACKS[currentIdx].src
    audio.load()

    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      setCurrentIdx(prev => getNextIdx(prev))
      setIsPlaying(true)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    if (isPlaying) {
      audio.play().catch(e => console.error('Playback error:', e))
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [currentIdx]) // eslint-disable-line

  // Play / Pause
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error('Playback error:', e))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Volume
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  const handlePlayPause = useCallback(() => setIsPlaying(p => !p), [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.code === 'Space') {
        e.preventDefault()
        handlePlayPause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePlayPause])

  const handleNext = () => {
    setCurrentIdx(prev => getNextIdx(prev))
    setIsPlaying(true)
  }

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setProgress(0)
    } else {
      setCurrentIdx(prev => (prev - 1 + TRACKS.length) % TRACKS.length)
      setIsPlaying(true)
    }
  }

  const handleSeek = (e) => {
    const bar = progressBarRef.current
    if (!bar || !audioRef.current?.duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * audioRef.current.duration
    setProgress(ratio * 100)
  }

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value))
    setIsMuted(false)
  }

  const toggleMute = () => setIsMuted(m => !m)

  const toggleShuffle = () => setIsShuffle(s => !s)

  const toggleRepeat = () => {
    setRepeatMode(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')
  }

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const parseTrackInfo = (rawName) => {
    const match = rawName.match(/(.+)\s*\((.+)\)/)
    if (match) return { artist: match[1].trim(), title: match[2].trim() }
    return { artist: 'Unknown Artist', title: rawName }
  }

  const currentTrackInfo = parseTrackInfo(TRACKS[currentIdx].name)

  const RepeatIcon = () => {
    if (repeatMode === 'one') return <span style={{ fontSize: '14px', position: 'relative' }}>🔂</span>
    return <span style={{ fontSize: '14px' }}>🔁</span>
  }

  const volumeIcon = isMuted || volume === 0 ? '🔇' : volume < 40 ? '🔉' : '🔊'

  return (
    <>
    <style>{`
      @keyframes spinRecord {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#121212', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif', userSelect: 'none' }}>

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
          <div style={{ cursor: 'pointer', padding: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#b3b3b3'}>
            <span style={{ fontSize: '18px' }}>🔍</span> Search
          </div>
          <div style={{ cursor: 'pointer', padding: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#b3b3b3'}>
            <span style={{ fontSize: '18px' }}>📚</span> Your Library
          </div>
        </div>

        {/* Track List Section */}
        <div style={{ flex: 1, background: 'linear-gradient(to bottom, #1db95420, #121212 40%)', overflowY: 'auto' }}>
          
          {/* Spotify Hero Banner */}
          <div style={{ padding: '30px', display: 'flex', alignItems: 'flex-end', gap: '20px', background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.5) 100%)', marginBottom: '20px' }}>
            <div style={{ width: '190px', height: '190px', background: 'linear-gradient(135deg, #1db954, #121212)', borderRadius: '8px', boxShadow: '0 8px 25px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '72px' }}>
              🎵
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Playlist</div>
              <h1 style={{ fontSize: '72px', margin: '0 0 10px 0', fontWeight: '900', letterSpacing: '-2px' }}>Vibes Collection</h1>
              <div style={{ color: '#b3b3b3', fontSize: '14px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Arnab Das</span> • {TRACKS.length} songs
              </div>
            </div>
          </div>

          {/* Big Play Button row */}
          <div style={{ padding: '10px 30px', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
             <button onClick={() => { if(!isPlaying) handlePlayPause() }} style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1db954', color: '#000', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '24px', transition: 'transform 0.1s ease', boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}
               onMouseDown={e => e.currentTarget.style.transform='scale(0.95)'}
               onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
               ▶
             </button>
             <div style={{ marginLeft: '25px', fontSize: '32px', color: '#1db954', cursor: 'pointer' }}>🤍</div>
             <div style={{ marginLeft: '20px', fontSize: '24px', color: '#b3b3b3', cursor: 'pointer' }}>•••</div>
          </div>

          <div style={{ padding: '0 30px 30px 30px' }}>

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
                const isSelected = selectedIdx === i
                return (
                  <tr
                    key={track.id}
                    onClick={() => setSelectedIdx(i)}
                    onDoubleClick={() => { setCurrentIdx(i); setIsPlaying(true) }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#ffffff1a' : (isSelected ? '#ffffff11' : 'transparent'),
                      transition: 'background-color 0.2s ease',
                      userSelect: 'none'
                    }}
                    onMouseEnter={e => { if (!isActive && !isSelected) e.currentTarget.style.backgroundColor = '#ffffff0a' }}
                    onMouseLeave={e => { if (!isActive && !isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <td style={{ padding: '12px 10px', borderRadius: '8px 0 0 8px', color: isActive ? '#1db954' : '#b3b3b3' }}>
                      {isActive && isPlaying ? <span style={{ fontSize: '12px' }}>▶</span> : i + 1}
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
      </div>

      {/* Bottom Player Bar */}
      <div style={{ height: '90px', backgroundColor: '#181818', borderTop: '1px solid #282828', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10 }}>

        {/* Current Track Info */}
        <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
          <div style={{ 
            width: '56px', height: '56px', background: `linear-gradient(135deg, hsl(${(currentIdx * 45) % 360}, 60%, 50%), #121212)`, 
            marginRight: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', 
            borderRadius: isPlaying ? '50%' : '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', flexShrink: 0,
            animation: isPlaying ? 'spinRecord 4s linear infinite' : 'none', transition: 'border-radius 0.3s ease'
          }}>
            🎧
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrackInfo.title}</span>
            <span style={{ fontSize: '12px', color: '#b3b3b3', marginTop: '2px' }}>{currentTrackInfo.artist}</span>
          </div>
          <div style={{ marginLeft: '15px', fontSize: '18px', color: '#1db954', flexShrink: 0 }}>💚</div>
        </div>

        {/* Controls + Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '500px' }}>
          {/* Control Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '8px' }}>
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              title="Shuffle"
              style={{ background: 'none', border: 'none', color: isShuffle ? '#1db954' : '#b3b3b3', fontSize: '16px', cursor: 'pointer', transition: 'color 0.2s', position: 'relative' }}
            >
              🔀
              {isShuffle && <span style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', backgroundColor: '#1db954', borderRadius: '50%', display: 'block' }} />}
            </button>

            {/* Prev */}
            <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#1db954'} onMouseLeave={e => e.target.style.color='#fff'}>⏮</button>

            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '16px', transition: 'transform 0.1s ease', flexShrink: 0 }}
              onMouseDown={e => e.currentTarget.style.transform='scale(0.92)'}
              onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Next */}
            <button onClick={handleNext} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#1db954'} onMouseLeave={e => e.target.style.color='#fff'}>⏭</button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              title={repeatMode === 'none' ? 'Enable Repeat' : repeatMode === 'all' ? 'Repeat One' : 'Disable Repeat'}
              style={{ background: 'none', border: 'none', color: repeatMode !== 'none' ? '#1db954' : '#b3b3b3', fontSize: '16px', cursor: 'pointer', transition: 'color 0.2s', position: 'relative' }}
            >
              <RepeatIcon />
              {repeatMode !== 'none' && <span style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', backgroundColor: '#1db954', borderRadius: '50%', display: 'block' }} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: '#b3b3b3', userSelect: 'none', minWidth: '35px', textAlign: 'right' }}>
              {formatTime(audioRef.current ? (audioRef.current.currentTime || 0) : 0)}
            </span>
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              style={{ flex: 1, height: '4px', backgroundColor: '#535353', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.querySelector('.progress-thumb')?.style && (e.currentTarget.querySelector('.progress-thumb').style.opacity = '1')}
              onMouseLeave={e => e.currentTarget.querySelector('.progress-thumb')?.style && (e.currentTarget.querySelector('.progress-thumb').style.opacity = '0')}
            >
              <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#1db954', borderRadius: '2px', position: 'relative', transition: 'width 0.1s linear' }}>
                <div className="progress-thumb" style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '50%', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#b3b3b3', userSelect: 'none', minWidth: '35px' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', color: '#b3b3b3' }}>
          <span style={{ fontSize: '14px' }}>🎤</span>
          <span style={{ fontSize: '14px' }}>📻</span>
          <button
            onClick={toggleMute}
            style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '16px', cursor: 'pointer', padding: 0 }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {volumeIcon}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{
              width: '80px',
              accentColor: '#1db954',
              cursor: 'pointer',
              height: '4px',
            }}
          />
        </div>
      </div>
    </div>
    </>
  )
}
