'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const dict = {
  en: {
    features: "Features", testimonials: "Testimonials", faq: "FAQ",
    login: "Log In", getFunded: "Get Funded",
    badge: "The Ultimate Anti-Blowout Shield",
    title1: "Never blow another", title2: "Prop Account", title3: "again.",
    desc: "The first AI-driven trading ecosystem designed to protect your capital. Ultra-fast local trade copier, automated risk management, and institutional tools included.",
    trialBtn: "Start Free Trial", dashBtn: "Go to Dashboard",
    f1Title: "Ultra-Fast SuperCopier", f1Desc: "Replicate your trades across multiple real accounts in milliseconds. Zero latency, zero lockups.",
    f2Title: "Smart Analytics Log", f2Desc: "Automatically record your trades, analyze your psychology (Tiltmeter), and discover your real mathematical edge.",
    f3Title: "Risk/Reward Shield", f3Desc: "If your risk exceeds your predefined limit, the system automatically switches to Micro contracts to protect you."
  },
  es: {
    features: "Funciones", testimonials: "Testimonios", faq: "FAQ",
    login: "Iniciar Sesión", getFunded: "Obtener Fondeo",
    badge: "El Escudo Anti-Quiebres Definitivo",
    title1: "Nunca vuelvas a quemar", title2: "una Cuenta de Fondeo", title3: ".",
    desc: "El primer ecosistema de Trading con Inteligencia Artificial diseñado para proteger tu capital. Copiadora ultrarrápida local, gestión de riesgo automática y herramientas institucionales.",
    trialBtn: "Empezar Prueba Gratis", dashBtn: "Ir al Dashboard",
    f1Title: "SuperCopier Ultrarrápido", f1Desc: "Replica tus operaciones a múltiples cuentas reales en milisegundos. Cero latencia, cero bloqueos.",
    f2Title: "Bitácora Analítica", f2Desc: "Registra tus operaciones automáticamente, analiza tu psicología (Tiltmeter) y descubre tu ventaja matemática.",
    f3Title: "Escudo Risk/Reward", f3Desc: "Si tu riesgo excede tu límite predefinido, el sistema cambia automáticamente a contratos Micro para protegerte."
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
  const t = dict[lang];

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0f1c', color: '#f8fafc',
      fontFamily: '"Inter", sans-serif', position: 'relative', overflowX: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '500px', background: 'radial-gradient(ellipse at top, rgba(34, 197, 94, 0.05) 0%, rgba(10, 15, 28, 0) 70%)', pointerEvents: 'none' }} />

      <nav style={{
        position: 'relative', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 64px', borderBottom: '1px solid rgba(255,255,255,0.03)', background: '#0b101e'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <img src="/icon.png" alt="Trading Brain AI Logo" style={{ width: '48px', height: '48px', filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#f8fafc' }}>
            TRADING BRAIN <span style={{ color: '#22c55e' }}>AI</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f8fafc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>{t.features}</span>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f8fafc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>{t.testimonials}</span>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f8fafc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>{t.faq}</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
            <button onClick={() => setLang('es')} style={{ background: lang === 'es' ? '#22c55e' : 'transparent', color: lang === 'es' ? '#022c22' : '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>ES</button>
            <button onClick={() => setLang('en')} style={{ background: lang === 'en' ? '#22c55e' : 'transparent', color: lang === 'en' ? '#022c22' : '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>EN</button>
          </div>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', color: '#f8fafc', border: 'none', padding: '10px 20px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}>
            {t.login}
          </button>
          <button onClick={() => router.push('/pricing')} style={{ background: '#22c55e', color: '#022c22', border: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#16a34a'} onMouseOut={e => e.target.style.background = '#22c55e'}>
            {t.getFunded}
          </button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#101726', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '99px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '40px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
          {t.badge}
        </div>
        
        <h1 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-0.03em', color: '#ffffff' }}>
          {t.title1} <br/>
          <span style={{ color: '#22c55e' }}>{t.title2}</span> {t.title3}
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px auto', lineHeight: '1.7', fontWeight: '400' }}>
          {t.desc}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/pricing')} style={{ background: 'linear-gradient(90deg, #facc15, #eab308)', color: '#451a03', border: 'none', padding: '16px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            {t.trialBtn}
          </button>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.target.style.background = 'transparent'}>
            {t.dashBtn}
          </button>
        </div>
      </main>

      <section style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto 120px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            { icon: '⚡', title: t.f1Title, desc: t.f1Desc },
            { icon: '📓', title: t.f2Title, desc: t.f2Desc },
            { icon: '🛡️', title: t.f3Title, desc: t.f3Desc }
          ].map((feat, i) => (
            <div key={i} style={{ background: '#101726', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '40px', transition: 'transform 0.3s, border-color 0.3s', cursor: 'default' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '24px', background: 'rgba(34, 197, 94, 0.1)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px', color: '#f8fafc' }}>{feat.title}</h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '0.9rem', margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
