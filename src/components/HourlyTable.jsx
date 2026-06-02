import WindArrow, { windDirLabel } from './WindArrow.jsx';
import { getScoreColor } from '../utils/scoring.js';

function SwellArrow({ degrees, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${degrees}deg)`, display: 'inline-block' }}>
      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="7,9 12,4 17,9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HourlyTable({ hours }) {
  // Only show 6am–10pm
  const filtered = hours.filter(h => {
    const hour = parseInt(h.time.split('T')[1].split(':')[0]);
    return hour >= 6 && hour <= 22;
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid #1e3a5f' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Time</th>
            <th style={{ padding: '8px 12px', textAlign: 'center' }}>Score</th>
            <th style={{ padding: '8px 12px', textAlign: 'center' }}>Height</th>
            <th style={{ padding: '8px 12px', textAlign: 'center' }}>Period</th>
            <th style={{ padding: '8px 12px', textAlign: 'center' }}>Wind</th>
            <th style={{ padding: '8px 12px', textAlign: 'center' }}>Swell</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((h, i) => {
            const hour = h.time.split('T')[1].substring(0,5);
            const color = getScoreColor(h.score);
            return (
              <tr key={i} style={{ borderBottom: '1px solid #0f2037', background: i % 2 === 0 ? '#0a1628' : 'transparent' }}>
                <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{hour}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{ color, fontWeight: 700, fontSize: 15 }}>{h.score}</span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0' }}>
                  {h.waveHeight.toFixed(1)}m
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0' }}>
                  {h.wavePeriod.toFixed(0)}s
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <WindArrow degrees={h.windDir} size={14} />
                    {windDirLabel(h.windDir)} {h.windSpeed.toFixed(1)}
                  </div>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <SwellArrow degrees={h.swellDir} size={14} />
                    {windDirLabel(h.swellDir)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
