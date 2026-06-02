import { getScoreColor, getConditionLabel } from '../utils/scoring.js';

export default function ScoreBadge({ score, size = 'md' }) {
  const color = getScoreColor(score);
  const { label } = getConditionLabel(score);
  const sizes = {
    sm: { circle: 36, font: 14 },
    md: { circle: 56, font: 22 },
    lg: { circle: 80, font: 32 },
  };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: s.circle, height: s.circle, borderRadius: '50%',
        background: color + '22', border: `3px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: s.font, fontWeight: 700, color,
      }}>
        {score}
      </div>
      {size !== 'sm' && <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>}
    </div>
  );
}
