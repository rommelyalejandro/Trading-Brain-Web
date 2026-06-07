'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function CommunicationsAdmin() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [msgType, setMsgType] = useState('info'); // info, warning, update, offer
  const [audience, setAudience] = useState('all'); // all, free, gold, platinum, palladium, specific
  const [targetEmail, setTargetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await addDoc(collection(db, 'brain_messages'), {
        title,
        body,
        type: msgType,
        target_audience: audience,
        target_email: audience === 'specific' ? targetEmail : null,
        created_at: serverTimestamp(),
        is_active: true,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
      setSuccess('¡Mensaje enviado con éxito a la red neuronal!');
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Verificando Credenciales...</div>;

  return (
    <main className="dashboard-container">
      <div className="header" style={{ marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px' }}>WEB-ADMIN COMMUNICATIONS</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
            Brain AddOn Direct Messaging System
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => router.push('/admin')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            Volver al CentCom
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
        <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          Redactar Nuevo Mensaje
        </h2>

        {success && <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid var(--accent-green)', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'var(--accent-green)' }}>{success}</div>}
        {error && <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid var(--accent-red)', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'var(--accent-red)' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Título del Mensaje</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '16px' }}
              placeholder="Ej. ¡Nueva Actualización del Protector AI!"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Cuerpo del Mensaje</label>
            <textarea 
              required
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '16px', resize: 'vertical' }}
              placeholder="Describe los detalles aquí..."
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Tipo de Mensaje</label>
              <select 
                value={msgType}
                onChange={(e) => setMsgType(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '16px' }}
              >
                <option value="info">Info (Azul)</option>
                <option value="success">Éxito (Verde)</option>
                <option value="warning">Alerta / Advertencia (Naranja)</option>
                <option value="error">Crítico / Urgente (Rojo)</option>
                <option value="offer">Oferta Especial (Morado)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Audiencia Objetivo</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '16px' }}
              >
                <option value="all">Todos los Usuarios</option>
                <option value="free">Solo Plan FREE</option>
                <option value="gold">Solo Plan GOLD</option>
                <option value="platinum">Solo Plan PLATINUM</option>
                <option value="palladium">Solo Plan PALLADIUM</option>
                <option value="specific">Usuario Específico (Email)</option>
              </select>
            </div>
          </div>

          {audience === 'specific' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px' }}>Email del Usuario Destino</label>
              <input 
                type="email" 
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '16px' }}
                placeholder="usuario@email.com"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '10px',
              padding: '15px', 
              background: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '18px', 
              borderRadius: '8px', 
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Transmitiendo a la red...' : 'ENVIAR MENSAJE A NINJATRADER 🚀'}
          </button>
        </form>
      </div>
    </main>
  );
}
