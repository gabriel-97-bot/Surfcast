import ScoreBadge from './ScoreBadge.jsx';
import WindArrow, { windDirLabel } from './WindArrow.jsx';

export default function DayCard({ date, hours, isSelected, onClick }) {
  const bestScore = Math.max(...hours.map(h => h.score));
  const avgHeight = (hours.reduce((s, h) => s + h.waveHeight, 0) / hours.length).toFixed(1);
  const avgWind = (hours.reduce((s, h) => s + h.windSpeed, 0) / hours.length).toFixed(1);
  const avgWindDir = hours[Math.floor(hours.length/2)]?.windDir ?? 0;

  const d = new Date(date + 'T12:00:00');
  const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const dayNum = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div onClick={onClick} style={{
      background: isSelected ? '#1e3a5f' : '#0f2037',
      border: `2px solid ${isSelected ? '#3b82f6' : '#1e3a5f'}`,
      borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
      minWidth: 100, textAlign: 'center', transition: 'all 0.2s',
      flexShrink: 0,
    }}>
      <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 2 }}>{dayName}</div>
      <div style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>{dayNum}</div>
      <ScoreBadge score={bestScore} size="sm" />
      <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 8 }}>
        {avgHeight}m
      </div>
      <div style={{ color: '#94a3b8', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <WindArrow degrees={avgWindDir} size={12} />
        {windDirLabel(avgWindDir)} {avgWind}m/s
      </div>
    </div>
  );
}
