'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showDownloads, setShowDownloads] = useState(false);
  const router = useRouter();

  // Verificar Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const [apiKey, setApiKey] = useState(null);
  const [loadingKey, setLoadingKey] = useState(false);

  // Cargar llave al iniciar sesión
  useEffect(() => {
    if (user) {
      const fetchApiKey = async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/keys', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.api_key) {
            setApiKey(data.api_key);
          }
        } catch (e) {
          console.error('Error fetching API key', e);
        }
      };
      fetchApiKey();
    }
  }, [user]);

  const generateApiKey = async () => {
    try {
      setLoadingKey(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setApiKey(data.api_key);
      } else if (data.requirePlan) {
        alert('Debes seleccionar un plan antes de generar tu API Key.');
        router.push('/pricing');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      console.error('Error generating API key', e);
    } finally {
      setLoadingKey(false);
    }
  };

  // Poll de datos cada 2 segundos
  useEffect(() => {
    // Si no hay usuario, no hacemos la consulta
    if (!user) return;

    const fetchTrades = async () => {
      try {
        const res = await fetch('/api/trades');
        const json = await res.json();
        
        if (json.success) {
          setTrades(json.data);
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

    fetchTrades();
    const interval = setInterval(fetchTrades, 2000);
    return () => clearInterval(interval);
  }, [user]);

  // Calcular métricas
  const totalTrades = trades.length;
  const uniqueTraders = new Set(trades.map(t => t.trader_id)).size;
  const totalLots = trades.reduce((acc, t) => acc + (t.lots || 0), 0);
  
  const handleDownload = async (moduleName, fileUrl) => {
    try {
      await fetch('/api/telemetry/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleName, userId: user?.uid })
      });
    } catch (err) {
      console.error("Error logging download", err);
    }
    // Proceder con la descarga
    window.location.href = fileUrl;
  };

  if (!user) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white'}}>Verificando credenciales...</div>;
  }

  return (
    <main className="dashboard-container">
      <header className="header" style={{alignItems: 'center'}}>
        <h1>
          🧠 Bright-Brain 
          <span style={{color: "var(--text-muted)", fontSize: "20px"}}>Command Center</span>
        </h1>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <div className="status-badge">
            <div className="pulse"></div>
            {loading ? 'CONECTANDO...' : 'SISTEMA ONLINE'}
          </div>
          
          {/* Botón de Upgrade */}
          <button 
            onClick={() => router.push('/pricing')}
            style={{background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}
          >
            ⭐ UPGRADE
          </button>
          
          {/* Botón de Descargas */}
          <button 
            onClick={() => setShowDownloads(true)}
            style={{background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}
          >
            📥 DOWNLOADS
          </button>
          
          {/* Perfil del Usuario */}
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
            {user.photoURL && <img src={user.photoURL} alt="Avatar" style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
            <span style={{fontSize: '14px', fontWeight: '500'}}>{user.displayName?.split(' ')[0] || 'Admin'}</span>
            <button 
              onClick={() => signOut(auth)}
              style={{background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '12px', marginLeft: '10px', fontWeight: 'bold'}}
            >
              SALIR
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="glass-panel" style={{borderColor: 'var(--accent-red)', marginBottom: '20px'}}>
          <p style={{color: 'var(--accent-red)'}}>Error de conexión: {error}</p>
        </div>
      )}

      {/* METRICAS SUPERIORES */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-title">Trades Capturados</div>
          <div className="stat-value">{totalTrades}</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-title">Traders Activos</div>
          <div className="stat-value">{uniqueTraders}</div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-title">Volumen Total (Lotes)</div>
          <div className="stat-value">{totalLots}</div>
        </div>
      </div>

      {/* MIS CREDENCIALES */}
      <section className="glass-panel" style={{marginBottom: '20px', padding: '20px', borderLeft: '4px solid var(--accent-blue)'}}>
        <h2 style={{marginTop: 0, fontSize: '18px'}}>🔑 Mis Credenciales de Conexión</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '15px'}}>
          Usa esta API Key en tu AddOn de NinjaTrader para enlazar tu plataforma con el Cerebro Central.
        </p>
        
        {apiKey ? (
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <div style={{background: 'rgba(0,0,0,0.5)', padding: '10px 15px', borderRadius: '8px', fontFamily: 'monospace', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.1)', flexGrow: 1, userSelect: 'all'}}>
              {apiKey}
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                alert("API Key copiada al portapapeles!");
              }}
              style={{background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
            >
              COPIAR
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={generateApiKey}
              disabled={loadingKey}
              style={{background: 'linear-gradient(45deg, var(--accent-blue), #00ff88)', color: 'black', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px'}}
            >
              {loadingKey ? 'GENERANDO...' : 'GENERAR MI API KEY'}
            </button>
          </div>
        )}
      </section>

      {/* TABLA EN TIEMPO REAL */}
      <section className="trades-section glass-panel">
        <h2>Transmisiones en Tiempo Real</h2>
        
        <div className="table-wrapper">
          {trades.length === 0 && !loading ? (
            <div className="empty-state">
              <p>Esperando el primer trade... Enciende tu Copiador en NinjaTrader.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Trader ID</th>
                  <th>Cuenta</th>
                  <th>Superpoder</th>
                  <th>Acción</th>
                  <th>Instrumento</th>
                  <th>Lotes</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => {
                  const dateObj = new Date(trade.server_timestamp || trade.timestamp);
                  const timeString = isNaN(dateObj) ? trade.timestamp : dateObj.toLocaleTimeString();
                  
                  return (
                    <tr key={trade.id}>
                      <td style={{color: "var(--text-muted)"}}>{timeString}</td>
                      <td>{trade.trader_id?.substring(0, 8)}...</td>
                      <td>{trade.account_name}</td>
                      <td>
                        <span style={{background: 'rgba(0,210,255,0.1)', color: 'var(--accent-blue)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(0,210,255,0.2)'}}>
                          {trade.superpower || 'Copier'}
                        </span>
                      </td>
                      <td className={trade.action === 'BUY' ? 'action-buy' : 'action-sell'}>
                        {trade.action}
                      </td>
                      <td>{trade.instrument}</td>
                      <td>{trade.lots}</td>
                      <td>{trade.price?.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* MODAL DE DESCARGAS */}
      {showDownloads && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <div className="glass-panel" style={{background: '#111', padding: '30px', borderRadius: '15px', maxWidth: '500px', width: '90%'}}>
            <h2 style={{marginTop: 0}}>📥 Centro de Descargas</h2>
            <p style={{color: 'var(--text-muted)'}}>Descarga los superpoderes individuales para NinjaTrader 8.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
              <button onClick={() => handleDownload('BrainAI_Pack', '/downloads/Paquete_Brain_AI.zip')} style={{width: '100%', background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px'}}>
                🧠 Descargar Paquete Brain AI (BrightBrain, BigTrades, Absorciones)
              </button>
              <div style={{background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#fbbf24', textAlign: 'left', lineHeight: '1.4'}}>
                <strong>⚠️ Nota de Seguridad:</strong> Como el archivo es un ejecutable cerrado (.dll) comercial, Chrome puede marcar la descarga como sospechosa.<br/>
                Para instalarlo, ve a tus Descargas (Ctrl+J) y haz clic en <strong>"Conservar archivo sospechoso"</strong>.
              </div>
            </div>
            
            <button 
              onClick={() => setShowDownloads(false)}
              style={{marginTop: '25px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', width: '100%', fontWeight: 'bold'}}
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
