export default function WindArrow({ degrees, size = 20 }) {
  // Wind direction FROM - arrow points where wind is going TO (downwind)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${degrees}deg)`, display: 'inline-block' }}>
      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="7,9 12,4 17,9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function windDirLabel(degrees) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(degrees / 45) % 8];
}
