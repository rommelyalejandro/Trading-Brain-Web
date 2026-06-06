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
  const [syncingHistory, setSyncingHistory] = useState(false);
  const router = useRouter();

  const handleSyncHistory = () => {
    if (!user) return;
    setSyncingHistory(true);
    try {
      const ws = new WebSocket('ws://localhost:8000/ws/frontend');
      
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'SYNC_HISTORY', userId: user.uid }));
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'HISTORY_SYNC_RESULT') {
          if (data.status === 'success' && data.data.length > 0) {
            try {
              const token = await user.getIdToken();
              const res = await fetch('/api/trades/sync', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trades: data.data })
              });
              const result = await res.json();
              if (result.success) {
                alert(`¡Éxito! Se sincronizaron ${result.count} operaciones históricas desde NinjaTrader a tu Bitácora.`);
              } else {
                alert('Hubo un error al guardar el historial en la nube: ' + result.error);
              }
            } catch (apiError) {
              console.error(apiError);
              alert('Error conectando a la API: ' + apiError.message);
            }
          } else {
            alert('No se encontraron operaciones históricas en NinjaTrader.');
          }
          setSyncingHistory(false);
          ws.close();
        }
      };

      ws.onerror = (e) => {
        alert('No se pudo conectar con el Motor Local de Python. Asegúrate de tenerlo encendido en tu computadora.');
        setSyncingHistory(false);
      };
    } catch(err) {
      alert('Error al iniciar sincronización: ' + err.message);
      setSyncingHistory(false);
    }
  };

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

  const unlinkDevice = async () => {
    if (!confirm('¿Estás seguro de que deseas desvincular tu NinjaTrader actual? Deberás reiniciar NinjaTrader para enlazar uno nuevo.')) return;
    try {
      setLoadingKey(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/keys/unlink', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Hubo un error de conexión.');
    } finally {
      setLoadingKey(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0f1c', color: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#0b101e', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        {/* Logo Area */}
        <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/icon.png" alt="Trading Brain AI" style={{ width: '32px', height: '32px', filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Trading Brain</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 24px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid #22c55e', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '600' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </div>
          <div onClick={() => router.push('/pricing')} style={{ padding: '12px 24px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderLeft: '3px solid transparent', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#f8fafc'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Licencia y Planes
          </div>
        </nav>

        {/* Sidebar Footer Buttons */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Bitácora Analítica</h1>
            <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(239,68,68,0.2)' }}>TBAI*********</span>
            <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(34,197,94,0.2)' }}>Evaluación Activa</span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {apiKey && (
              <button onClick={unlinkDevice} disabled={loadingKey} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>
                Desvincular Dispositivo
              </button>
            )}
            <button style={{ background: 'rgba(30, 41, 59, 0.6)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-3l8.44-8.44A6 6 0 0115 7zm6 0v-.01M19 7v-.01"></path></svg>
              Credenciales
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '24px' }}>Error: {error}</div>}

        {/* Top Cards (License & Download) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* License Key Card */}
          <div style={{ background: '#101726', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: loading ? '#facc15' : '#22c55e', boxShadow: loading ? '0 0 8px #facc15' : '0 0 8px #22c55e' }}></div>
                <h2 style={{ fontSize: '1rem', margin: 0, color: '#94a3b8' }}>Conexión API (Licencia)</h2>
              </div>
            </div>
            {apiKey ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="text" value={apiKey} readOnly style={{ flex: 1, background: '#0a0f1c', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '6px', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.875rem' }} />
                <button onClick={() => navigator.clipboard.writeText(apiKey)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'background 0.2s' }}>Copiar</button>
              </div>
            ) : (
              <button onClick={generateApiKey} disabled={loadingKey} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
                Generar Licencia
              </button>
            )}
          </div>

          {/* Download Card */}
          <div style={{ background: '#101726', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: '700' }}>Motor de Superpoderes (Local)</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Descargar AddOn para NinjaTrader 8</p>
              </div>
              <button onClick={() => window.open('https://github.com/rommelyalejandro', '_blank')} style={{ background: '#22c55e', color: '#022c22', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#16a34a'} onMouseOut={e => e.target.style.background = '#22c55e'}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg>
                Descargar NT8
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Main Stats Area (Graph & Side Cards) */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          
          {/* Main Chart Area (Placeholder matching screenshot) */}
          <div style={{ flex: 1, background: '#101726', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
              <div style={{ width: '4px', height: '16px', background: '#22c55e', borderRadius: '2px' }}></div>
              <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: '600' }}>Curva de Crecimiento</h2>
              <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '8px' }}>05 Ene 2026 - Hoy</span>
            </div>
            
            {/* Fake Graph Lines matching screenshot */}
            <div style={{ position: 'relative', height: '200px', width: '100%', borderBottom: '1px solid #ef4444', borderTop: '1px dashed #22c55e', display: 'flex', alignItems: 'center' }}>
              <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                  </linearGradient>
                </defs>
                <path d="M0,100 Q100,80 200,100 T400,120 T600,140 T700,180 L750,150 L800,150 L800,200 L0,200 Z" fill="url(#gradient)" />
                <path d="M0,100 Q100,80 200,100 T400,120 T600,140 T700,180 L750,150 L800,150" fill="none" stroke="#22c55e" strokeWidth="2" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: '#475569', fontSize: '0.65rem' }}>
              <span>Ene 5</span><span>Ene 10</span><span>Ene 15</span><span>Ene 20</span><span>Ene 25</span><span>Ene 30</span><span>Feb 5</span><span>Feb 10</span>
            </div>
          </div>

          {/* Right Stat Cards */}
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#101726', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', color: '#ef4444' }}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></div>
              <div><p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Ganancia Neta</p><h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>${(totalLots * 12.5).toFixed(2)}</h3></div>
            </div>
            <div style={{ background: '#101726', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px', color: '#22c55e' }}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <div><p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Operaciones Totales</p><h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{totalTrades}</h3></div>
            </div>
            <div style={{ background: '#101726', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px', color: '#22c55e' }}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
              <div><p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Traders Conectados</p><h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{uniqueTraders}</h3></div>
            </div>
            <div style={{ background: '#101726', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '10px', borderRadius: '8px', color: '#facc15' }}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
              <div><p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Volumen Total (Lotes)</p><h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{totalLots}</h3></div>
            </div>
          </div>
        </div>

        {/* Bitácora de Operaciones (Account Data Match) */}
        <div style={{ background: '#101726', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px' }}></div>
              <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: '600' }}>Trading Log (Bitácora)</h2>
            </div>
            <button 
              onClick={handleSyncHistory} 
              disabled={syncingHistory}
              style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: syncingHistory ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              {syncingHistory ? 'Sincronizando...' : 'Sync NT8 Data'}
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Time</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Action</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Size / Asset</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Price</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Superpower</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>🧠 Tiltmeter</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#475569' }}>Aún no hay operaciones registradas.</td></tr>
                ) : (
                  trades.map(trade => {
                    const dateObj = new Date(trade.server_timestamp || trade.timestamp);
                    const isBuy = trade.action === 'BUY';
                    return (
                      <tr key={trade.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)' }}>
                        <td style={{ padding: '16px', color: '#94a3b8' }}>{isNaN(dateObj) ? trade.timestamp : dateObj.toLocaleTimeString()}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ color: isBuy ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{trade.action}</span>
                        </td>
                        <td style={{ padding: '16px', color: '#f8fafc' }}>{trade.lots} <span style={{ color: '#94a3b8' }}>{trade.instrument}</span></td>
                        <td style={{ padding: '16px', fontFamily: 'monospace', color: '#f8fafc' }}>{trade.price?.toFixed(2)}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {trade.superpower || 'Copier'}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <select 
                            value={trade.localEmotion}
                            onChange={(e) => updateTradeEmotion(trade.id, e.target.value)}
                            style={{
                              background: '#0a0f1c', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)',
                              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', outline: 'none', fontSize: '0.8rem'
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
    </div>
  );
}
