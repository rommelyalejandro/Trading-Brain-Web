'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si ya está logueado, lo mandamos al Dashboard
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Asegurarse que exista en Firestore
      if (result.user) {
        const userRef = doc(db, 'users', result.user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: result.user.email,
            name: result.user.displayName,
            plan: 'free',
            api_key: '', // Se genera desde el dashboard si la solicita
            createdAt: new Date().toISOString()
          });
        }
      }
      
      // El onAuthStateChanged redirigirá automáticamente
    } catch (error) {
      console.error("Error signing in", error);
      alert("Error al iniciar sesión: " + error.message);
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '50px 30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', background: '-webkit-linear-gradient(0deg, var(--accent-blue), #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🧠 Bright-Brain
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '15px' }}>
          Identificación biométrica requerida para acceder al Command Center.
        </p>
        
        <button 
          onClick={handleLogin}
          disabled={loading}
          style={{
            background: 'white',
            color: '#333',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            transition: 'transform 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '24px'}} />
          {loading ? 'Verificando...' : 'Acceso con Google'}
        </button>
      </div>
    </main>
  );
}
