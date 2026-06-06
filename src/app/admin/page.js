'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [instances, setInstances] = useState([]);
  const [metrics, setMetrics] = useState({ registrados: 0, activos: 0, inactivos: 0, free: 0, pay: 0 });
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

  const superpowers = Object.values(superpowersMap);

  return (
    <main className="dashboard-container">
      <div className="header" style={{ marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px' }}>WEB-ADMIN CENTCOM</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
            God Mode: Bright-Brain AI Global Telemetry
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Status</p>
          <div className="status-badge">
            <div className="pulse"></div>
            LIVE FEED
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ border: '1px solid var(--accent-red)', marginBottom: '30px' }}>
          <p style={{ color: 'var(--accent-red)' }}>Error de conexión telepática: {error}</p>
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>Global KPIs: Usuarios</h2>
        <div className="stats-grid">
          <div className="glass-panel stat-card" style={{ alignItems: 'center' }}>
            <span className="stat-title">Registrados</span>
            <span className="stat-value">{metrics.registrados}</span>
          </div>
          <div className="glass-panel stat-card" style={{ alignItems: 'center', borderColor: 'rgba(0, 210, 255, 0.4)' }}>
            <span className="stat-title" style={{ color: 'var(--accent-blue)' }}>Activos</span>
            <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>{metrics.activos}</span>
          </div>
          <div className="glass-panel stat-card" style={{ alignItems: 'center' }}>
            <span className="stat-title">Inactivos</span>
            <span className="stat-value" style={{ color: '#94a3b8' }}>{metrics.inactivos}</span>
          </div>
          <div className="glass-panel stat-card" style={{ alignItems: 'center' }}>
            <span className="stat-title">Free</span>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{metrics.free}</span>
          </div>
          <div className="glass-panel stat-card" style={{ alignItems: 'center' }}>
            <span className="stat-title">Pay</span>
            <span className="stat-value" style={{ color: '#f59e0b' }}>{metrics.pay}</span>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>Telemetry: Superpoderes</h2>
      
      <div className="stats-grid">
        {superpowers.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>No hay superpoderes reportando latidos en la red en este momento.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '10px' }}>Abre NinjaTrader y enciende un indicador.</p>
          </div>
        ) : (
          superpowers.map((sp, idx) => (
            <div key={idx} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>{sp.name}</h3>
                  <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 8px', background: 'rgba(0, 0, 0, 0.4)', color: 'var(--accent-blue)', fontSize: '12px', borderRadius: '4px', fontFamily: 'monospace' }}>
                    {sp.version}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>{sp.total}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Instalados</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-green)' }}>{sp.active}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Activos</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)', gridColumn: '1 / span 2' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{sp.inactive}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Inactivos (En Espera)</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '5px' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Distribución de Cuentas</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)', padding: '8px 12px', borderRadius: '6px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>Fondeada/Real</span>
                  </div>
                  <span style={{ fontWeight: 'bold' }}>{sp.live}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>Simulada</span>
                  </div>
                  <span style={{ fontWeight: 'bold' }}>{sp.sim}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
