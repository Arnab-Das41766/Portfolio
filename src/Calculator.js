import React, { useState, useEffect, useCallback } from 'react'

const BUTTON_STYLES = {
  base: {
    border: 'none',
    borderRadius: '6px',
    fontSize: '20px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'filter 0.1s ease, transform 0.08s ease',
    userSelect: 'none',
    fontFamily: '"Ubuntu Mono", "Cascadia Code", monospace',
  },
  number: { backgroundColor: '#3d3d3d', color: '#fff' },
  operator: { backgroundColor: '#505050', color: '#fff' },
  special: { backgroundColor: '#4a4a4a', color: '#aaa' },
  equals: { backgroundColor: '#e95420', color: '#fff', fontWeight: '700' },
  zero: { gridColumn: 'span 2' },
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [operator, setOperator] = useState(null)
  const [prevValue, setPrevValue] = useState(null)
  const [justEvaluated, setJustEvaluated] = useState(false)

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b === 0 ? 'Error' : a / b
      default: return b
    }
  }

  const formatNumber = (num) => {
    if (num === 'Error') return 'Error'
    const str = String(num)
    // Limit to 12 significant characters
    if (str.replace('.', '').replace('-', '').length > 12) {
      return parseFloat(num.toPrecision(10)).toString()
    }
    return str
  }

  const handleDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      setJustEvaluated(false)
    } else {
      if (justEvaluated) {
        setDisplay(digit)
        setExpression('')
        setJustEvaluated(false)
      } else {
        setDisplay(prev => prev === '0' ? digit : prev.length < 13 ? prev + digit : prev)
      }
    }
  }, [waitingForOperand, justEvaluated])

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      setJustEvaluated(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.')
    }
  }, [waitingForOperand, display])

  const handleOperator = useCallback((op) => {
    const current = parseFloat(display)
    if (prevValue !== null && !waitingForOperand) {
      const result = calculate(prevValue, current, operator)
      setDisplay(formatNumber(result))
      setPrevValue(result === 'Error' ? null : result)
      setExpression(`${formatNumber(result)} ${op}`)
    } else {
      setPrevValue(current)
      setExpression(`${display} ${op}`)
    }
    setOperator(op)
    setWaitingForOperand(true)
    setJustEvaluated(false)
  }, [display, prevValue, operator, waitingForOperand])

  const handleEquals = useCallback(() => {
    if (operator === null || waitingForOperand) return
    const current = parseFloat(display)
    const result = calculate(prevValue, current, operator)
    setExpression(`${formatNumber(prevValue)} ${operator} ${display} =`)
    setDisplay(formatNumber(result))
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setJustEvaluated(true)
  }, [operator, waitingForOperand, display, prevValue])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setPrevValue(null)
    setWaitingForOperand(false)
    setJustEvaluated(false)
  }, [])

  const handleToggleSign = useCallback(() => {
    setDisplay(prev => prev === '0' ? '0' : prev.startsWith('-') ? prev.slice(1) : '-' + prev)
  }, [])

  const handlePercent = useCallback(() => {
    const val = parseFloat(display)
    setDisplay(formatNumber(val / 100))
  }, [display])

  const handleBackspace = useCallback(() => {
    if (waitingForOperand || justEvaluated) return
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
  }, [waitingForOperand, justEvaluated])

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key)
      else if (e.key === '.') handleDecimal()
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('−')
      else if (e.key === '*') handleOperator('×')
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷') }
      else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === 'Escape') handleClear()
      else if (e.key === '%') handlePercent()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleBackspace, handleClear, handlePercent])

  const btnPress = (e) => {
    e.currentTarget.style.transform = 'scale(0.93)'
    e.currentTarget.style.filter = 'brightness(0.85)'
  }
  const btnRelease = (e) => {
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.style.filter = 'brightness(1)'
  }
  const btnHover = (e) => { e.currentTarget.style.filter = 'brightness(1.18)' }
  const btnLeave = (e) => { e.currentTarget.style.filter = 'brightness(1)' }

  const Btn = ({ label, onClick, variant = 'number', wide = false, color }) => (
    <button
      onPointerDown={btnPress}
      onPointerUp={btnRelease}
      onMouseEnter={btnHover}
      onMouseLeave={btnLeave}
      onClick={onClick}
      style={{
        ...BUTTON_STYLES.base,
        ...BUTTON_STYLES[variant],
        ...(wide ? BUTTON_STYLES.zero : {}),
        ...(color ? { color } : {}),
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#2d2d2d',
      color: '#fff',
      fontFamily: '"Ubuntu", "Segoe UI", sans-serif',
      userSelect: 'none',
    }}>
      {/* Ubuntu-style header strip */}
      <div style={{
        backgroundColor: '#1e1e1e',
        padding: '6px 16px',
        fontSize: '12px',
        color: '#888',
        borderBottom: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>GNOME Calculator</span>
        <span style={{ color: '#555', fontSize: '11px' }}>Standard</span>
      </div>

      {/* Display */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px 20px 10px 20px',
        textAlign: 'right',
        borderBottom: '1px solid #111',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        {/* Expression / History line */}
        <div style={{
          fontSize: '13px',
          color: '#888',
          minHeight: '20px',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '"Ubuntu Mono", monospace',
        }}>
          {expression || '\u00A0'}
        </div>
        {/* Main number display */}
        <div style={{
          fontSize: display.length > 9 ? '28px' : '40px',
          fontWeight: '300',
          color: '#fff',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          fontFamily: '"Ubuntu Mono", "Cascadia Code", monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'font-size 0.1s',
          color: display === 'Error' ? '#e95420' : '#fff',
        }}>
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#2d2d2d',
      }}>
        {/* Row 1 */}
        <Btn label="AC" variant="special" onClick={handleClear} color="#e95420" />
        <Btn label="±" variant="special" onClick={handleToggleSign} />
        <Btn label="%" variant="special" onClick={handlePercent} />
        <Btn label="÷" variant="operator" onClick={() => handleOperator('÷')} color="#e95420" />

        {/* Row 2 */}
        <Btn label="7" onClick={() => handleDigit('7')} />
        <Btn label="8" onClick={() => handleDigit('8')} />
        <Btn label="9" onClick={() => handleDigit('9')} />
        <Btn label="×" variant="operator" onClick={() => handleOperator('×')} color="#e95420" />

        {/* Row 3 */}
        <Btn label="4" onClick={() => handleDigit('4')} />
        <Btn label="5" onClick={() => handleDigit('5')} />
        <Btn label="6" onClick={() => handleDigit('6')} />
        <Btn label="−" variant="operator" onClick={() => handleOperator('−')} color="#e95420" />

        {/* Row 4 */}
        <Btn label="1" onClick={() => handleDigit('1')} />
        <Btn label="2" onClick={() => handleDigit('2')} />
        <Btn label="3" onClick={() => handleDigit('3')} />
        <Btn label="+" variant="operator" onClick={() => handleOperator('+')} color="#e95420" />

        {/* Row 5 */}
        <Btn label="⌫" variant="special" onClick={handleBackspace} />
        <Btn label="0" onClick={() => handleDigit('0')} />
        <Btn label="." onClick={handleDecimal} />
        <Btn label="=" variant="equals" onClick={handleEquals} />
      </div>
    </div>
  )
}
