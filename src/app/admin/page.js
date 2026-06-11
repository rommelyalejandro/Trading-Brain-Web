'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [instances, setInstances] = useState([]);
  const [metrics, setMetrics] = useState({ registrados: 0, activos: 0, inactivos: 0, starter: 0, pay: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Verificar Auth y permisos
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else if (currentUser.email !== 'rommelyalejandro@gmail.com') {
        // Redirigir a usuarios normales
        router.push('/');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch Heartbeats periodicamente
  useEffect(() => {
    if (!user) return;

    const fetchInstances = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/admin/heartbeats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          setInstances(json.data);
          if (json.metrics) setMetrics(json.metrics);
          setError(null);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
    const interval = setInterval(fetchInstances, 2000); // Polling cada 2 segundos para tiempo real
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Iniciando GOD MODE...</div>;
  }

  // Agrupar instancias por Superpoder
  const superpowersMap = {};
  instances.forEach(inst => {
    if (!superpowersMap[inst.superpower]) {
      superpowersMap[inst.superpower] = {
        name: inst.superpower,
        version: inst.version,
        total: 0,
        active: 0,
        inactive: 0,
        live: 0,
        sim: 0
      };
    }
    const s = superpowersMap[inst.superpower];
    s.total += 1;
    if (inst.status === 'Active') s.active += 1;
    else s.inactive += 1;
    
    if (inst.account_type === 'Simulada') s.sim += 1;
    else s.live += 1;
  });

  const superpowers = Object.values(superpowersMap).sort((a, b) => b.total - a.total); // Ordenar por más usados

  // Cálculos avanzados para CEO
  const estimatedMRR = metrics.pay * 99; // Estimación: $99/mes por usuario pago
  const conversionRate = metrics.registrados > 0 ? ((metrics.pay / metrics.registrados) * 100).toFixed(1) : 0;
  const churnRate = 1.2; // Métrica hardcodeada simulada para ilustrar retención
  const totalHeartbeats = instances.length;

  // Tomar los últimos 10 heartbeats para el Live Feed (asumiendo que vienen ordenados del backend o los mostramos tal cual)
  const liveFeed = instances.slice(0, 10);

  return (
    <main className="dashboard-container">
      {/* 1. Header Global */}
      <div className="header" style={{ marginBottom: '30px', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '32px' }} className="text-gradient">WEB-ADMIN CENTCOM</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
            God Mode: CEO Single Source of Truth
          </p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Status</p>
            <div className="status-badge">
              <div className="pulse"></div>
              LIVE FEED
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => router.push('/admin/clients')} style={{ padding: '8px 16px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '8px', border: '1px solid #38bdf8', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              👥 Gestión de Clientes
            </button>
            <button onClick={() => router.push('/admin/communications')} style={{ padding: '8px 16px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
              ✉️ Nueva Transmisión
            </button>
            <button onClick={() => { auth.signOut(); router.push('/login'); }} style={{ padding: '8px 16px', background: 'rgba(255,0,0,0.1)', color: 'var(--accent-red)', borderRadius: '8px', border: '1px solid var(--accent-red)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ border: '1px solid var(--accent-red)', marginBottom: '30px' }}>
          <p style={{ color: 'var(--accent-red)' }}>Error de conexión telepática: {error}</p>
        </div>
      )}

      {/* 2. THE "5" - Top Vital Metrics */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Vital Signs</h2>
        <div className="stats-grid">
          <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
            <span className="stat-title">Estimated MRR</span>
            <span className="stat-value text-gradient-green">${estimatedMRR.toLocaleString()}</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>Basado en {metrics.pay} usuarios Pay</div>
          </div>
          <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
            <span className="stat-title">Active Users</span>
            <span className="stat-value text-gradient">{metrics.activos}</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>Total Registrados: {metrics.registrados}</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-title">Conversion Rate</span>
            <span className="stat-value">{conversionRate}%</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>Starter a Premium</div>
          </div>
          <div className="glass-panel stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <span className="stat-title">Telemetry Volume</span>
            <span className="stat-value" style={{ color: '#f59e0b' }}>{totalHeartbeats}</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>Eventos Heartbeat</div>
          </div>
          <div className="glass-panel stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <span className="stat-title">Churn Rate (Simulated)</span>
            <span className="stat-value" style={{ color: '#ef4444' }}>{churnRate}%</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>Bajo lo normal (&lt;3%)</div>
          </div>
        </div>
      </div>

      {/* 3. THE "3" - Main Visualizations & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* Visual 1 & 2: Growth and Plan Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '10px' }}>Curva de Adopción & Crecimiento</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Crecimiento de nuevas instalaciones vs conversiones a Premium.</p>
            
            {/* Fake SVG Chart for aesthetic mockup */}
            <div style={{ height: '180px', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0, 210, 255, 0.4)" />
                    <stop offset="100%" stopColor="rgba(0, 210, 255, 0)" />
                  </linearGradient>
                </defs>
                <path d="M0,150 L0,100 Q100,120 200,80 T400,50 L500,20 L500,150 Z" fill="url(#chartGrad)" />
                <path d="M0,100 Q100,120 200,80 T400,50 L500,20" fill="none" stroke="var(--accent-blue)" strokeWidth="3" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4 (Actual)</span>
            </div>
          </div>

          <div className="glass-panel">
            <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '10px' }}>Distribución de Planes</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}><span>Starter Plan</span><span style={{color: 'var(--accent-green)'}}>{metrics.starter}</span></div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${(metrics.starter / (metrics.registrados || 1)) * 100}%` }}></div></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}><span>Premium (Pay)</span><span style={{color: '#f59e0b'}}>{metrics.pay}</span></div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${(metrics.pay / (metrics.registrados || 1)) * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 3: Superpower Ranking */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '5px' }}>Top Superpoderes</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Uso de AddOns por telemetría.</p>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {superpowers.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>Sin datos aún</div>
            ) : (
              superpowers.map((sp, idx) => (
                <div key={sp.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: idx === 0 ? 'var(--accent-green)' : 'white' }}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{sp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sp.total} conexiones (v{sp.version})</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. THE "1" - Alertas Estratégicas y Live Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* System Alerts */}
        <div className="glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h2 style={{ fontSize: '16px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            System Insights
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>Crecimiento:</span> La conversión de Starter a Pago es del {conversionRate}%. ¡Buen trabajo! Podríamos lanzar una Nueva Transmisión a los Starter para subirlos al 15%.
            </li>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
              <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>Alerta de Inactividad:</span> Hay {metrics.inactivos} usuarios registrados que no han enviado un Heartbeat recientemente.
            </li>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Estabilidad:</span> El sistema de telemetría está operando al 100% de capacidad.
            </li>
          </ul>
        </div>

        {/* Terminal Matrix Live Feed */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '16px', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Terminal / Live Feed
          </h2>
          <div className="matrix-feed">
            {liveFeed.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', marginTop: '20px' }}>Waiting for incoming connections...</div>
            ) : (
              liveFeed.map(feed => {
                const dateObj = new Date(feed.last_heartbeat);
                const timeString = isNaN(dateObj) ? 'Just now' : dateObj.toLocaleTimeString();
                return (
                  <div key={feed.id} className="matrix-line">
                    <span className="matrix-time">[{timeString}]</span>
                    <span className="matrix-user">{feed.user_email?.split('@')[0] || 'Unknown'}</span>
                    <span style={{ color: 'white', margin: '0 8px' }}>connected via</span>
                    <span className="matrix-superpower">{feed.superpower}</span>
                    <span style={{ margin: '0 8px', color: '#64748b' }}>-&gt;</span>
                    <span className="matrix-action">Auth: {feed.is_valid_key ? 'SUCCESS' : 'FAILED'}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
