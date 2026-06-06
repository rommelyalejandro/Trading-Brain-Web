'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#020617', // slate-950
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow Effects (Quantum Glassmorphism) */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(2,6,23,0) 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(2,6,23,0) 70%)',
        borderRadius: '50%', filter: 'blur(80px)', zIndex: 0
      }} />

      {/* Navigation Bar */}
      <nav style={{
        position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(2, 6, 23, 0.4)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Image src="/logo.png" alt="Trading Brain AI Logo" width={40} height={40} style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '1px', background: 'linear-gradient(90deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TRADING BRAIN AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => router.push('/login')} style={{
            background: 'transparent', color: '#cbd5e1', border: 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s'
          }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#cbd5e1'}>
            Iniciar Sesión
          </button>
          <button onClick={() => router.push('/pricing')} style={{
            background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '99px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(6,182,212,0.3)', transition: 'transform 0.2s'
          }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
            Ver Planes
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)',
          borderRadius: '99px', color: '#67e8f9', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '1px', marginBottom: '32px', textTransform: 'uppercase'
        }}>
          🛡️ El Escudo Anti-Quiebres Definitivo
        </div>
        
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          Nunca más quemarás una <br/>
          <span style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cuenta de Fondeo</span> por error humano.
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
          El primer ecosistema de Trading con Inteligencia Artificial diseñado para proteger tu capital. Copiadora ultra rápida, cálculo de lotajes automático y herramientas institucionales de Order Flow (Big Trades & Absorciones) incluidas de por vida.
        </p>
        
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/pricing')} style={{
            background: 'linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '12px', fontSize: '1.125rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px rgba(168,85,247,0.3)', transition: 'transform 0.2s'
          }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            Comenzar Prueba (Plan Free)
          </button>
          <button onClick={() => router.push('/dashboard')} style={{
            background: 'rgba(30, 41, 59, 0.5)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '16px 40px', borderRadius: '12px', fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseOver={e => e.target.style.background = 'rgba(30, 41, 59, 0.8)'} onMouseOut={e => e.target.style.background = 'rgba(30, 41, 59, 0.5)'}>
            Ir a mi Bitácora (Login)
          </button>
        </div>
      </main>

      {/* Feature Cards (Glassmorphism) */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto 100px auto', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '900', marginBottom: '48px', color: '#f8fafc' }}>
          Tus Nuevos Superpoderes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            { icon: '⚡', title: 'SuperCopier Ultra-Rápido', desc: 'Replica tus operaciones a múltiples cuentas reales en milisegundos. Sin retrasos ni bloqueos.' },
            { icon: '📓', title: 'Bitácora Inteligente', desc: 'Registra tus operaciones automáticamente, analiza tu psicología (Tiltmeter) y descubre tu ventaja matemática real.' },
            { icon: '🐋', title: 'Indicador: Big Trades', desc: 'Detecta en tiempo real las órdenes institucionales gigantes y sigue el rastro del dinero profesional.' },
            { icon: '🧲', title: 'Indicador: Absorciones', desc: 'Visualiza exactamente dónde el mercado está frenando el precio e identifica reversiones de altísima probabilidad.' },
            { icon: '🛡️', title: 'Escudo Risk/Reward', desc: 'Si tu riesgo excede tu límite predefinido, el sistema cambia automáticamente a Micro contratos para protegerte.' },
            { icon: '🔮', title: 'Más Superpoderes IA...', desc: 'Nuevos indicadores, detección de patrones y simuladores de rentabilidad en constante desarrollo.' }
          ].map((feat, i) => (
            <div key={i} style={{
              background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '24px', padding: '32px',
              backdropFilter: 'blur(16px)', transition: 'transform 0.3s, border-color 0.3s', cursor: 'default'
            }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.4)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{feat.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px', color: '#f8fafc' }}>{feat.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
