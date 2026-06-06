'use client';

import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Si ya está logueado, lo mandamos al Dashboard protegido
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        plan: 'free',
        api_key: '', 
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) await saveUserToFirestore(result.user);
    } catch (error) {
      setErrorMsg("Error con Google: " + error.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (result.user) await saveUserToFirestore(result.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('El correo ya está registrado.');
      } else {
        setErrorMsg(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#020617',
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Background Glow Effects (Quantum Glassmorphism) */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(2,6,23,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(2,6,23,0) 70%)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} />

      {/* Login Panel */}
      <div style={{
        position: 'relative', zIndex: 10, maxWidth: '400px', width: '90%',
        background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.1)', 
        borderRadius: '24px', padding: '40px 30px', backdropFilter: 'blur(16px)',
        textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🧠</div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px', background: 'linear-gradient(90deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Trading Brain AI
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
          {isRegistering ? 'Crea tu cuenta para acceder al sistema' : 'Identificación requerida para acceder al Command Center.'}
        </p>

        {errorMsg && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)' }}>{errorMsg}</div>}

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#22d3ee'}
            onBlur={e => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#22d3ee'}
            onBlur={e => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: 'linear-gradient(90deg, #22d3ee, #a855f7)', color: 'white',
              border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'transform 0.2s'
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Ingresar al Ecosistema')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)' }} />
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>O</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)' }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%',
            transition: 'background 0.2s', opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px'}} />
          {loading ? 'Verificando...' : 'Acceso Rápido con Google'}
        </button>

        <p style={{ marginTop: '24px', fontSize: '13px', color: '#94a3b8' }}>
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿Aún no tienes licencia?'}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: '#22d3ee', fontWeight: 'bold', marginLeft: '6px', cursor: 'pointer' }}
          >
            {isRegistering ? 'Inicia Sesión aquí' : 'Crea una cuenta aquí'}
          </button>
        </p>

      </div>
    </div>
  );
}
