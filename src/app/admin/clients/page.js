'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminClients() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPlan, setFilterPlan] = useState('All');
  
  const router = useRouter();

  // Verificar Auth y permisos
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else if (currentUser.email !== 'rommelyalejandro@gmail.com') {
        router.push('/');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch Clients
  useEffect(() => {
    if (!user) return;
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/clients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setClients(json.data);
        setFilteredClients(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterPlan === 'All') {
      setFilteredClients(clients);
    } else {
      setFilteredClients(clients.filter(c => c.plan === filterPlan));
    }
  }, [filterPlan, clients]);

  const handleUpdate = async (userId, action, newPlan = null) => {
    if (action === 'delete' && !confirm('¿Estás seguro de eliminar PERMANENTEMENTE a este usuario y destruir su API Key?')) return;
    
    try {
      const token = await user.getIdToken();
      let res;
      
      if (action === 'delete') {
        res = await fetch(`/api/admin/clients/delete?userId=${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        res = await fetch('/api/admin/clients/update', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, action, newPlan })
        });
      }

      const json = await res.json();
      if (json.success) {
        alert('Operación exitosa');
        fetchClients(); // Refresh data
      } else {
        alert('Error: ' + json.error);
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }
  };

  if (loading && clients.length === 0) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando base de datos de usuarios...</div>;
  }

  return (
    <main className="dashboard-container">
      <div className="header" style={{ marginBottom: '20px' }}>
        <div>
          <button onClick={() => router.push('/admin')} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px', fontSize: '12px' }}>
            &larr; Volver al CEO Dashboard
          </button>
          <h1 style={{ fontSize: '32px' }} className="text-gradient">CRM: CLIENTES & KEYS</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px', fontSize: '14px' }}>Gestión absoluta de licencias, planes y accesos a telemetría.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={filterPlan} 
            onChange={(e) => setFilterPlan(e.target.value)}
            style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none' }}
          >
            <option style={{ background: '#0b0f19', color: 'white' }} value="All">Todos los Planes</option>
            <option style={{ background: '#0b0f19', color: 'white' }} value="Free">Free</option>
            <option style={{ background: '#0b0f19', color: 'white' }} value="Gold">Gold</option>
            <option style={{ background: '#0b0f19', color: 'white' }} value="Palladium">Palladium</option>
          </select>
          <button onClick={fetchClients} style={{ padding: '8px 16px', background: 'var(--panel-bg)', color: 'var(--accent-blue)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
            🔄 Refrescar
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--accent-red)', marginBottom: '20px' }}>Error: {error}</div>}

      <div className="glass-panel table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Usuario (Email)</th>
              <th>API Key de Conexión</th>
              <th>Plan Actual</th>
              <th>Status</th>
              <th>Fecha de Ingreso</th>
              <th>Acciones Rápidas</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No se encontraron clientes.</td></tr>
            ) : (
              filteredClients.map(client => (
                <tr key={client.id} style={{ opacity: client.status === 'Inactive' ? 0.5 : 1 }}>
                  <td>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{client.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{client.email}</div>
                  </td>
                  <td>
                    <code style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px', color: 'var(--accent-blue)', fontSize: '11px', letterSpacing: '1px' }}>
                      {client.api_key}
                    </code>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      background: client.plan === 'Palladium' ? 'linear-gradient(90deg, #a855f7, #c084fc)' : 
                                  client.plan === 'Gold' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 
                                  'rgba(255,255,255,0.1)',
                      color: client.plan === 'Free' ? 'white' : 'black'
                    }}>
                      {client.plan}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: client.status === 'Active' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold', fontSize: '12px' }}>
                      {client.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'Desconocida'}
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      onChange={(e) => {
                        if(e.target.value) handleUpdate(client.id, 'change_plan', e.target.value);
                        e.target.value = '';
                      }}
                      style={{ padding: '4px 8px', background: 'transparent', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      <option style={{ background: '#0b0f19', color: 'white' }} value="">Cambiar Plan...</option>
                      {client.plan !== 'Free' && <option style={{ background: '#0b0f19', color: 'white' }} value="Free">Bajar a Free</option>}
                      {client.plan !== 'Gold' && <option style={{ background: '#0b0f19', color: 'white' }} value="Gold">Subir a Gold</option>}
                      {client.plan !== 'Palladium' && <option style={{ background: '#0b0f19', color: 'white' }} value="Palladium">Subir a Palladium</option>}
                    </select>

                    {client.status === 'Active' ? (
                      <button onClick={() => handleUpdate(client.id, 'deactivate')} style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Suspender</button>
                    ) : (
                      <button onClick={() => handleUpdate(client.id, 'activate')} style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Activar</button>
                    )}

                    <button onClick={() => handleUpdate(client.id, 'delete')} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>Borrar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
