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
        plan: 'starter',
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
      backgroundColor: '#0a0f1c',
      color: '#f8fafc',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Subtle Background Element */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(ellipse at top, rgba(34, 211, 238, 0.05) 0%, rgba(10, 15, 28, 0) 70%)', pointerEvents: 'none' }} />

      {/* Login Panel */}
      <div style={{
        position: 'relative', zIndex: 10, maxWidth: '420px', width: '90%',
        background: '#101726', border: '1px solid rgba(255, 255, 255, 0.03)', 
        borderRadius: '16px', padding: '48px 40px',
        textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <img src="/icon.png" alt="Trading Brain AI Logo" style={{ width: '64px', height: '64px', marginBottom: '24px', filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.2))' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: '#f8fafc', letterSpacing: '-0.5px' }}>
          Welcome back
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9rem' }}>
          {isRegistering ? 'Create your account to start trading' : 'Enter your credentials to access your dashboard'}
        </p>

        {errorMsg && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem', border: '1px solid rgba(239,68,68,0.2)', fontWeight: '500' }}>{errorMsg}</div>}

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '14px 16px', background: '#0a0f1c', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.875rem' }}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '14px 16px', background: '#0a0f1c', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.875rem' }}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: '#3b82f6', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: '700', cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'background 0.2s, transform 0.1s', fontSize: '0.875rem', marginTop: '8px'
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.background = '#2563eb')}
            onMouseOut={e => !loading && (e.currentTarget.style.background = '#3b82f6')}
            onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />
          <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%',
            transition: 'background 0.2s', opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.background = 'transparent')}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '18px'}} />
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p style={{ marginTop: '32px', fontSize: '0.875rem', color: '#64748b' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: '600', marginLeft: '6px', cursor: 'pointer' }}
            onMouseOver={e => e.target.style.textDecoration = 'underline'}
            onMouseOut={e => e.target.style.textDecoration = 'none'}
          >
            {isRegistering ? 'Log in' : 'Sign up'}
          </button>
        </p>

      </div>
    </div>
  );
}
