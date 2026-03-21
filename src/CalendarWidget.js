import React from 'react';

export default function CalendarWidget({ currentDate }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div style={{
      position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)',
      backgroundColor: 'rgba(30, 30, 30, 0.95)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 12px 12px',
      padding: '20px', color: '#fff', width: '280px', zIndex: 1000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.7)', fontFamily: '"Ubuntu", sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
        <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '14px' }}>
        {weekDays.map(d => (
          <div key={d} style={{ color: '#aaa', fontWeight: 'bold', fontSize: '12px' }}>{d}</div>
        ))}
        {days.map((day, i) => {
          const isToday = day === currentDate.getDate();
          return (
            <div key={i} style={{
              padding: '6px 0', borderRadius: '50%',
              backgroundColor: isToday ? '#E95420' : 'transparent',
              color: isToday ? '#fff' : (day ? '#ddd' : 'transparent'),
              cursor: day ? 'pointer' : 'default',
              transition: 'background 0.2s'
            }}>
              {day || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
