import { useState } from 'react';
import { groupByDay } from '../utils/api.js';
import { findBestWindow, getConditionLabel } from '../utils/scoring.js';
import ScoreBadge from './ScoreBadge.jsx';
import DayCard from './DayCard.jsx';
import HourlyTable from './HourlyTable.jsx';

export default function SpotDashboard({ spotKey, hours }) {
  const days = groupByDay(hours);
  const dateKeys = Object.keys(days).sort();
  const [selectedDay, setSelectedDay] = useState(dateKeys[0]);

  if (!dateKeys.length) return null;

  const todayHours = days[dateKeys[0]] || [];
  const nowHour = new Date().getHours();
  const currentHour = todayHours.find(h => parseInt(h.time.split('T')[1]) >= nowHour) || todayHours[0];
  const todayBest = Math.max(...todayHours.map(h => h.score));
  const bestWindow = findBestWindow(todayHours);
  const bestWindowHour = todayHours[bestWindow.start];
  const { label: todayLabel } = getConditionLabel(todayBest);

  const selectedHours = days[selectedDay] || [];

  return (
    <div>
      {/* Today Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2037 0%, #1a3a5c 100%)',
        borderRadius: 16, padding: 24, marginBottom: 20,
        border: '1px solid #1e3a5f',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>TODAY'S BEST</div>
            <ScoreBadge score={todayBest} size="lg" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>BEST WINDOW</div>
            {bestWindowHour && (
              <div style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600 }}>
                {bestWindowHour.time.split('T')[1].substring(0,5)}–
                {todayHours[bestWindow.start + 2]?.time.split('T')[1].substring(0,5) || ''}
              </div>
            )}
            <div style={{ color: '#94a3b8', fontSize: 13 }}>
              {currentHour && `Now: ${currentHour.waveHeight.toFixed(1)}m @ ${currentHour.wavePeriod.toFixed(0)}s`}
            </div>
          </div>
        </div>
      </div>

      {/* 5-day strip */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {dateKeys.map(date => (
          <DayCard
            key={date}
            date={date}
            hours={days[date]}
            isSelected={selectedDay === date}
            onClick={() => setSelectedDay(date)}
          />
        ))}
      </div>

      {/* Hourly table */}
      <div style={{ background: '#0a1628', borderRadius: 12, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e3a5f', color: '#94a3b8', fontSize: 13 }}>
          Hourly breakdown — {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <HourlyTable hours={selectedHours} />
      </div>
    </div>
  );
}
