import React, { useState, useEffect, useRef } from 'react';

const WORD_BANK = [
  'react', 'javascript', 'python', 'asynchronous', 'promise', 'component', 'function',
  'variable', 'constant', 'frontend', 'backend', 'database', 'cybersecurity', 'encryption',
  'authentication', 'authorization', 'deploy', 'container', 'docker', 'kubernetes', 'serverless',
  'api', 'rest', 'graphql', 'interface', 'algorithm', 'structure', 'git', 'repository', 'commit'
];

export default function TypingTesterApp() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);
  const [totalKeyStrokes, setTotalKeyStrokes] = useState(0);
  
  const inputRef = useRef(null);

  useEffect(() => {
    generateWords();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsActive(false);
      setIsFinished(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const generateWords = () => {
    const shuffled = [...WORD_BANK].sort(() => 0.5 - Math.random());
    // Create an array of word objects with status: 'untyped', 'correct', 'incorrect'
    const newWords = shuffled.map(word => ({ text: word, status: 'untyped' }));
    setWords([...newWords, ...newWords, ...newWords].slice(0, 50)); // ensures plenty of words
    setCurrentWordIndex(0);
    setUserInput('');
    setTimer(30);
    setIsActive(false);
    setIsFinished(false);
    setCorrectKeyStrokes(0);
    setTotalKeyStrokes(0);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleInputChange = (e) => {
    if (isFinished) return;
    
    const val = e.target.value;
    
    // Start timer on first keystroke
    if (!isActive && val.length === 1) {
      setIsActive(true);
    }

    // Spacebar triggers word submission
    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      setTotalKeyStrokes(prev => prev + typedWord.length + 1); // +1 for space

      const currentWordText = words[currentWordIndex].text;
      const isCorrect = typedWord === currentWordText;

      if (isCorrect) {
        setCorrectKeyStrokes(prev => prev + typedWord.length + 1);
      }

      const newWords = [...words];
      newWords[currentWordIndex].status = isCorrect ? 'correct' : 'incorrect';
      setWords(newWords);
      
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
    } else {
      setUserInput(val);
    }
  };

  const calculateWPM = () => {
    // WPM = (Total correct keystrokes / 5) / (Time in minutes)
    const timeInMinutes = (30 - timer) / 60;
    if (timeInMinutes === 0) return 0;
    return Math.round((correctKeyStrokes / 5) / timeInMinutes);
  };

  const calculateAccuracy = () => {
    if (totalKeyStrokes === 0) return 100;
    return Math.round((correctKeyStrokes / totalKeyStrokes) * 100);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', 
      backgroundColor: '#1e1e1e', color: '#e0e0e0', padding: '24px', 
      fontFamily: '"Fira Code", monospace', boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
        <h2 style={{ margin: 0, color: '#61dafb' }}>⌨️ Keyword Typist</h2>
        <div style={{ display: 'flex', gap: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          <div style={{ color: timer <= 10 ? '#ff5f56' : '#e0e0e0' }}>Time: {timer}s</div>
          <div style={{ color: '#28c940' }}>WPM: {calculateWPM()}</div>
          <div style={{ color: '#ffbd2e' }}>Acc: {calculateAccuracy()}%</div>
        </div>
      </div>

      <div 
        style={{ 
          flex: 1, backgroundColor: '#2d2d2d', borderRadius: '8px', padding: '20px', 
          overflow: 'hidden', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
          gap: '10px', fontSize: '20px', lineHeight: '1.5', position: 'relative'
        }}
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        {words.map((word, index) => {
          let color = '#888';
          let backgroundColor = 'transparent';
          
          if (word.status === 'correct') color = '#28c940';
          if (word.status === 'incorrect') {
            color = '#ff5f56';
            backgroundColor = 'rgba(255,95,86,0.2)';
          }
          if (index === currentWordIndex) {
            color = '#fff';
            backgroundColor = 'rgba(97,218,251,0.2)';
          }

          return (
            <span key={index} style={{ 
              color, backgroundColor, padding: '2px 6px', borderRadius: '4px',
              borderBottom: index === currentWordIndex ? '2px solid #61dafb' : '2px solid transparent'
            }}>
              {word.text}
            </span>
          );
        })}

        {isFinished && (
          <div style={{
            position: 'absolute', inset: 0, backgroundColor: 'rgba(30,30,30,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10
          }}>
            <h1 style={{ color: '#61dafb', margin: '0 0 10px 0' }}>Time's Up!</h1>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>Final WPM: <span style={{ color: '#28c940', fontWeight: 'bold' }}>{calculateWPM()}</span></div>
            <div style={{ fontSize: '20px', marginBottom: '24px' }}>Accuracy: <span style={{ color: '#ffbd2e', fontWeight: 'bold' }}>{calculateAccuracy()}%</span></div>
            <button onClick={generateWords} style={{
              padding: '12px 24px', borderRadius: '6px', border: 'none', backgroundColor: '#61dafb',
              color: '#000', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              Restart Game
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <input 
          ref={inputRef}
          type="text" 
          value={userInput} 
          onChange={handleInputChange}
          disabled={isFinished}
          placeholder={isActive ? '' : 'Type the highlighted word to begin...'}
          style={{
            width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #444', 
            backgroundColor: '#121212', color: '#fff', fontSize: '18px', fontFamily: '"Fira Code", monospace',
            outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
}
