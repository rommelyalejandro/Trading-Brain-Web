'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [loadingKey, setLoadingKey] = useState(false);
  const router = useRouter();

  // Emociones (Tiltmeter)
  const EMOTIONS = ["🟢 Plan Perfecto", "🟡 Ansiedad", "🔴 FOMO", "🔥 Venganza"];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      const fetchApiKey = async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/keys', { headers: { 'Authorization': `Bearer ${token}` } });
          const data = await res.json();
          if (data.success && data.api_key) setApiKey(data.api_key);
        } catch (e) { console.error(e); }
      };
      fetchApiKey();
    }
  }, [user]);

  const generateApiKey = async () => {
    try {
      setLoadingKey(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/keys', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setApiKey(data.api_key);
      else if (data.requirePlan) { alert('Selecciona un plan primero.'); router.push('/pricing'); }
    } finally { setLoadingKey(false); }
  };

  useEffect(() => {
    if (!user) return;
    const fetchTrades = async () => {
      try {
        const res = await fetch('/api/trades');
        const json = await res.json();
        if (json.success) {
          // Initialize local state for emotions if missing
          const tradesWithEmotion = json.data.map(t => ({
            ...t,
            localEmotion: t.localEmotion || 'Seleccionar...'
          }));
          setTrades(tradesWithEmotion);
          setError(null);
        }
      } catch (err) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchTrades();
    const interval = setInterval(fetchTrades, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const updateTradeEmotion = (tradeId, newEmotion) => {
    // Aquí a futuro haríamos un fetch a la DB para guardarlo. Por ahora actualiza la UI local.
    setTrades(trades.map(t => t.id === tradeId ? { ...t, localEmotion: newEmotion } : t));
  };

  const totalTrades = trades.length;
  const uniqueTraders = new Set(trades.map(t => t.trader_id)).size;
  const totalLots = trades.reduce((acc, t) => acc + (t.lots || 0), 0);

  if (!user) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Panel Principal</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Supervisión de operaciones en tiempo real</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
              background: loading ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 211, 238, 0.1)',
              border: loading ? '1px solid rgba(234, 179, 8, 0.2)' : '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '99px', color: loading ? '#facc15' : '#22d3ee', fontSize: '0.875rem', fontWeight: 'bold'
           }}>
             <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: loading ? '#facc15' : '#22d3ee' }}></span>
             {loading ? 'CONECTANDO...' : 'ONLINE'}
           </div>
        </div>
      </div>

      {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '24px' }}>Error: {error}</div>}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#94a3b8' }}>Operaciones</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{totalTrades}</p>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#94a3b8' }}>Volumen (Lotes)</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{totalLots}</p>
        </div>
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#94a3b8' }}>Traders Conectados</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{uniqueTraders}</p>
        </div>
      </div>

      {/* API Key */}
      <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.1)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '16px' }}>🔑 Conexión al Cerebro Central</h2>
        {apiKey ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            <input type="text" value={apiKey} readOnly style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#f8fafc', fontFamily: 'monospace' }} />
            <button onClick={() => navigator.clipboard.writeText(apiKey)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Copiar</button>
          </div>
        ) : (
          <button onClick={generateApiKey} disabled={loadingKey} style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Generar Licencia
          </button>
        )}
      </div>

      {/* Bitácora / Tabla */}
      <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '24px' }}>Bitácora de Operaciones</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <th style={{ padding: '16px 8px', color: '#94a3b8', fontWeight: '600' }}>Hora</th>
                <th style={{ padding: '16px 8px', color: '#94a3b8', fontWeight: '600' }}>Acción</th>
                <th style={{ padding: '16px 8px', color: '#94a3b8', fontWeight: '600' }}>Lotes</th>
                <th style={{ padding: '16px 8px', color: '#94a3b8', fontWeight: '600' }}>Precio</th>
                <th style={{ padding: '16px 8px', color: '#94a3b8', fontWeight: '600' }}>Superpoder</th>
                <th style={{ padding: '16px 8px', color: '#94a3b8', fontWeight: '600' }}>🧠 Tiltmeter (Psicología)</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Aún no hay operaciones registradas.</td></tr>
              ) : (
                trades.map(trade => {
                  const dateObj = new Date(trade.server_timestamp || trade.timestamp);
                  const isBuy = trade.action === 'BUY';
                  return (
                    <tr key={trade.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.05)' }}>
                      <td style={{ padding: '16px 8px', color: '#cbd5e1' }}>{isNaN(dateObj) ? trade.timestamp : dateObj.toLocaleTimeString()}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ color: isBuy ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{trade.action}</span>
                      </td>
                      <td style={{ padding: '16px 8px' }}>{trade.lots} {trade.instrument}</td>
                      <td style={{ padding: '16px 8px', fontFamily: 'monospace' }}>{trade.price?.toFixed(2)}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {trade.superpower || 'Copier'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        {/* TILTMETER */}
                        <select 
                          value={trade.localEmotion}
                          onChange={(e) => updateTradeEmotion(trade.id, e.target.value)}
                          style={{
                            background: 'rgba(15, 23, 42, 0.6)', color: '#f8fafc', border: '1px solid rgba(148, 163, 184, 0.2)',
                            padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', outline: 'none'
                          }}
                        >
                          <option disabled>Seleccionar...</option>
                          {EMOTIONS.map(emo => <option key={emo} value={emo}>{emo}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
