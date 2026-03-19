import React, { useState, useEffect, useRef } from 'react'

const GRID_SIZE = 15
const CELL_SIZE = 20

export default function SnakeGame() {
  const canvasRef = useRef(null)
  const [snake, setSnake] = useState([{ x: 7, y: 7 }])
  const [food, setFood] = useState({ x: 10, y: 10 })
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0)
  const gameLoopRef = useRef(null)

  // Generate random food position
  const generateFood = () => {
    let newFood
    let validPosition = false
    while (!validPosition) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
      validPosition = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    }
    return newFood
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return

      const key = e.key.toLowerCase()
      const arrowUp = key === 'arrowup' || key === 'w'
      const arrowDown = key === 'arrowdown' || key === 's'
      const arrowLeft = key === 'arrowleft' || key === 'a'
      const arrowRight = key === 'arrowright' || key === 'd'

      if (arrowUp && direction.y === 0) setNextDirection({ x: 0, y: -1 })
      else if (arrowDown && direction.y === 0) setNextDirection({ x: 0, y: 1 })
      else if (arrowLeft && direction.x === 0) setNextDirection({ x: -1, y: 0 })
      else if (arrowRight && direction.x === 0) setNextDirection({ x: 1, y: 0 })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameOver])

  // Game loop
  useEffect(() => {
    if (gameOver) return

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        setDirection(nextDirection)
        const head = prevSnake[0]
        const newHead = {
          x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        let newSnake = [newHead, ...prevSnake]

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood())
          setScore(prev => {
            const newScore = prev + 10
            if (newScore > highScore) {
              setHighScore(newScore)
              localStorage.setItem('snakeHighScore', newScore)
            }
            return newScore
          })
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, 100)

    return () => clearInterval(gameLoopRef.current)
  }, [gameOver, food, nextDirection, highScore])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE)

    // Draw grid
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#1dd1a1'
        ctx.shadowColor = '#1dd1a1'
        ctx.shadowBlur = 8
      } else {
        ctx.fillStyle = '#0fd882'
        ctx.shadowColor = 'transparent'
      }
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
    })
    ctx.shadowColor = 'transparent'

    // Draw food
    ctx.fillStyle = '#ff6b6b'
    ctx.shadowColor = '#ff6b6b'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowColor = 'transparent'
  }, [snake, food])

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }])
    setFood(generateFood())
    setDirection({ x: 1, y: 0 })
    setNextDirection({ x: 1, y: 0 })
    setScore(0)
    setGameOver(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: '"Ubuntu", "Segoe UI", sans-serif', padding: '16px', gap: '16px' }}>
      {/* Score Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>SCORE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1dd1a1' }}>{score}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>HIGH SCORE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>{highScore}</div>
        </div>
      </div>

      {/* Game Canvas */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', borderRadius: '8px', border: '2px solid #1dd1a1', position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          style={{ display: 'block' }}
        />
        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b' }}>GAME OVER</div>
            <div style={{ fontSize: '18px', color: '#aaa' }}>Final Score: <span style={{ color: '#1dd1a1', fontWeight: 'bold' }}>{score}</span></div>
            {score > parseInt(highScore) && (
              <div style={{ fontSize: '16px', color: '#fbbf24', fontWeight: 'bold' }}>🏆 New High Score!</div>
            )}
            <button
              onClick={resetGame}
              style={{
                marginTop: '12px',
                padding: '10px 24px',
                backgroundColor: '#1dd1a1',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.target.style.backgroundColor = '#0fd882'}
              onMouseLeave={e => e.target.style.backgroundColor = '#1dd1a1'}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <div style={{ marginBottom: '6px' }}>⬆️ ⬇️ ⬅️ ➡️ or WASD to move</div>
        <div>🍎 Eat food to grow • 💥 Don't hit yourself</div>
      </div>
    </div>
  )
}
