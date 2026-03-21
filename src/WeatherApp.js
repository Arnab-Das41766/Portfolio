import React, { useState, useEffect } from 'react';

// Using open-meteo free API (no key needed)
export default function WeatherApp() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // If geolocation fails or is denied, fallback to a default city (London)
    const fetchWeather = async (lat, lon, cityName) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        if (!res.ok) throw new Error('API Error')
        const json = await res.json()
        setData({ ...json.current_weather, city: cityName })
      } catch (err) {
        setError('Failed to fetch weather data. Check your internet connection.')
      } finally {
        setLoading(false)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your Location'),
        err => fetchWeather(51.5074, -0.1278, 'London (Fallback)')
      )
    } else {
      fetchWeather(51.5074, -0.1278, 'London (Fallback)')
    }
  }, [])

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️' // Clear
    if (code >= 1 && code <= 3) return '⛅' // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️' // Fog
    if (code >= 51 && code <= 67) return '🌧️' // Rain
    if (code >= 71 && code <= 77) return '❄️' // Snow
    if (code >= 80 && code <= 82) return '🌦️' // Showers
    if (code >= 95) return '⛈️' // Thunderstorm
    return '🌡️'
  }

  return (
    <div style={{ 
      padding: '30px', color: '#fff', backgroundColor: '#1E1E1E', 
      height: '100%', boxSizing: 'border-box', fontFamily: '"Ubuntu", sans-serif'
    }}>
      <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>🌤️ Local Weather</h2>
      <p style={{ color: '#aaa', margin: '0 0 20px 0', fontSize: '14px' }}>
        {loading ? 'Locating...' : data ? data.city : ''}
      </p>
      
      {loading && <div style={{ fontSize: '16px', color: '#ccc' }}>Loading latest conditions...</div>}
      {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
      
      {data && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '72px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>
            {getWeatherIcon(data.weathercode)}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '56px', fontWeight: 'bold' }}>{Math.round(data.temperature)}°C</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '18px', color: '#ccc' }}>Wind: <span style={{ color: '#fff' }}>{data.windspeed} km/h</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
