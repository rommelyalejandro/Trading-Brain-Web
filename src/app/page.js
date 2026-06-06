'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1c', // Deep space background matching dashboard
      color: '#f8fafc',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Subtle Background Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '500px', background: 'radial-gradient(ellipse at top, rgba(34, 211, 238, 0.05) 0%, rgba(10, 15, 28, 0) 70%)', pointerEvents: 'none' }} />

      {/* Navigation Bar */}
      <nav style={{
        position: 'relative', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 64px', borderBottom: '1px solid rgba(255,255,255,0.03)',
        background: '#0b101e' // Matching dashboard sidebar
      }}>
        {/* Prominent Logo Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <img src="/icon.png" alt="Trading Brain AI Logo" style={{ width: '48px', height: '48px', filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.3))' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#f8fafc' }}>
            TRADING BRAIN <span style={{ color: '#3b82f6' }}>AI</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f8fafc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Features</span>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f8fafc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Testimonials</span>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f8fafc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>FAQ</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => router.push('/login')} style={{
            background: 'transparent', color: '#f8fafc', border: 'none', padding: '10px 20px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer'
          }}>
            Log In
          </button>
          <button onClick={() => router.push('/pricing')} style={{
            background: '#3b82f6', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)', transition: 'background 0.2s'
          }} onMouseOver={e => e.target.style.background = '#2563eb'} onMouseOut={e => e.target.style.background = '#3b82f6'}>
            Get Funded
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 80px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#101726', border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '99px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '40px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
          The Ultimate Anti-Blowout Shield
        </div>
        
        <h1 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-0.03em', color: '#ffffff' }}>
          Never blow another <br/>
          <span style={{ color: '#3b82f6' }}>Prop Account</span> again.
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px auto', lineHeight: '1.7', fontWeight: '400' }}>
          The first AI-driven trading ecosystem designed to protect your capital. Ultra-fast local trade copier, automated risk management, and institutional tools included.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/pricing')} style={{
            background: 'linear-gradient(90deg, #facc15, #eab308)', color: '#451a03', border: 'none', padding: '16px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)', transition: 'transform 0.2s'
          }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
            Start Free Trial
          </button>
          <button onClick={() => router.push('/dashboard')} style={{
            background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.target.style.background = 'transparent'}>
            Go to Dashboard
          </button>
        </div>
      </main>

      {/* Feature Cards (Prop Firm Style) */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto 120px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            { icon: '⚡', title: 'Ultra-Fast SuperCopier', desc: 'Replicate your trades across multiple real accounts in milliseconds. Zero latency, zero lockups.' },
            { icon: '📓', title: 'Smart Analytics Log', desc: 'Automatically record your trades, analyze your psychology (Tiltmeter), and discover your real mathematical edge.' },
            { icon: '🛡️', title: 'Risk/Reward Shield', desc: 'If your risk exceeds your predefined limit, the system automatically switches to Micro contracts to protect you.' }
          ].map((feat, i) => (
            <div key={i} style={{
              background: '#101726', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '40px',
              transition: 'transform 0.3s, border-color 0.3s', cursor: 'default'
            }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '24px', background: 'rgba(59, 130, 246, 0.1)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
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
