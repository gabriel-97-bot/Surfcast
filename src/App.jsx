import { useState, useEffect } from 'react';
import { fetchSpotData, SPOTS } from './utils/api.js';
import SpotDashboard from './components/SpotDashboard.jsx';

export default function App() {
  const [activeSpot, setActiveSpot] = useState('olberg');
  const [data, setData] = useState({ olberg: null, bore: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [olberg, bore] = await Promise.all([
        fetchSpotData('olberg'),
        fetchSpotData('bore'),
      ]);
      setData({ olberg, bore });
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#060f1e', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: '#0a1628', borderBottom: '1px solid #1e3a5f', padding: '16px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#38bdf8' }}>Surfcast</h1>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Jæren · Stavanger</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {lastUpdated && (
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <button onClick={loadData} style={{
              background: 'none', border: '1px solid #1e3a5f', color: '#94a3b8',
              borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', marginTop: 4
            }}>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Spot tabs */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex' }}>
          {Object.entries(SPOTS).map(([key, spot]) => (
            <button key={key} onClick={() => setActiveSpot(key)} style={{
              background: 'none', border: 'none', padding: '14px 24px',
              color: activeSpot === key ? '#38bdf8' : '#64748b',
              fontWeight: activeSpot === key ? 700 : 400,
              borderBottom: activeSpot === key ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer', fontSize: 15, transition: 'all 0.2s',
            }}>
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 700, margin: '0 auto', padding: '20px 16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌊</div>
            <div>Loading forecast...</div>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ color: '#ef4444', marginBottom: 12 }}>Failed to load forecast</div>
            <button onClick={loadData} style={{
              background: '#1e3a5f', border: 'none', color: '#e2e8f0',
              borderRadius: 8, padding: '10px 20px', cursor: 'pointer'
            }}>Try again</button>
          </div>
        )}
        {!loading && !error && data[activeSpot] && (
          <SpotDashboard spotKey={activeSpot} hours={data[activeSpot]} />
        )}

        {/* Legend */}
        <div style={{ marginTop: 32, padding: 16, background: '#0a1628', borderRadius: 12, border: '1px solid #1e3a5f' }}>
          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>SCORE GUIDE</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12 }}>
            {[['8–10','#22c55e','Firing 🔥'],['6–7','#22c55e','Good'],['4–5','#f59e0b','Fair'],['2–3','#ef4444','Poor'],['0–1','#ef4444','Flat/Blown out']].map(([range, color, label]) => (
              <div key={range} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: color + '22', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color, fontWeight: 700 }}>{range}</div>
                <span style={{ color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ color: '#475569', fontSize: 11, marginTop: 12 }}>
            Tuned for intermediate shortboarder. Offshore E winds scored highest. Wave data from Open-Meteo.
          </div>
        </div>
      </main>
    </div>
  );
}
