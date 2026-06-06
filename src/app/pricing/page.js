'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TdAzw6tDIdDfbEslglNojNqTmB0eJ09ldLXAsF37fN8k6RcEgl1iAu1huar0zRqTXVL8rYhf4sEJ69xhtz5H07S003mTpq9iQ');

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubscribe = async (priceId) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();
      
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });
      
      const data = await res.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al iniciar el pago: ' + data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error de red al iniciar el pago');
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      alias: "Simulaciones | $1.99 pago único de activación",
      price: "$0.00",
      period: "sin pago mensual",
      priceId: "price_free_activation",
      features: ["Super Copiadora Básica", "Solo Cuentas Simuladas (Sim101)", "Ideal para Forward Testing", "Activación única de por vida"],
      themeColor: "#94a3b8", // slate-400
      bgStyle: "rgba(30, 41, 59, 0.4)",
      borderStyle: "1px solid rgba(148, 163, 184, 0.3)",
      buttonBg: "#e2e8f0",
      buttonColor: "#0f172a",
      highlight: false,
      glow: false
    },
    {
      name: "Gold",
      alias: "Trader Intermedio",
      price: "$49",
      period: "/mes",
      priceId: "price_1TdB6I6tDIdDfbEsgE6SXCQI",
      features: ["Todo lo del plan Free", "Máx. 2 Cuentas Reales/Fondeo", "Copiado de Alta Frecuencia", "Multiplicadores Dinámicos"],
      themeColor: "#eab308", // yellow-500
      bgStyle: "rgba(30, 41, 59, 0.4)",
      borderStyle: "1px solid rgba(234, 179, 8, 0.3)",
      buttonBg: "linear-gradient(90deg, #eab308 0%, #facc15 100%)",
      buttonColor: "#422006",
      highlight: false,
      glow: false
    },
    {
      name: "Platinum",
      alias: "Fondeado Pro",
      price: "$99",
      period: "/mes",
      priceId: "price_1TdB6I6tDIdDfbEsavRzis2v",
      features: ["Todo lo del plan Gold", "Máx. 10 Cuentas Reales/Fondeo", "Soporte Prioritario 24/7", "Funciones Avanzadas de Riesgo (R/R)"],
      themeColor: "#f8fafc", // slate-50
      bgStyle: "rgba(30, 41, 59, 0.6)",
      borderStyle: "1px solid rgba(248, 250, 252, 0.4)",
      buttonBg: "linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%)",
      buttonColor: "#0f172a",
      highlight: true,
      glow: false
    },
    {
      name: "Palladium AI",
      alias: "Master Cuántico",
      price: "$199",
      period: "/mes",
      priceId: "price_1TdB6J6tDIdDfbEsjOhyGgp9",
      features: ["Todo lo del plan Platinum", "Cuentas Reales ILIMITADAS", "Inteligencia Artificial Predictiva", "Latencia Ultra-Baja Dedicada"],
      themeColor: "#06b6d4", // cyan-500
      bgStyle: "rgba(15, 23, 42, 0.8)",
      borderStyle: "1px solid rgba(6, 182, 212, 0.6)",
      buttonBg: "linear-gradient(90deg, #0891b2 0%, #0284c7 100%)",
      buttonColor: "#ffffff",
      highlight: false,
      glow: true
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#020617', // slate-950
      color: '#f8fafc', // slate-50
      padding: '80px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '900',
            letterSpacing: '-0.025em',
            margin: '0 0 16px 0',
            background: 'linear-gradient(90deg, #60a5fa 0%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Licencias de Trading Brain AI
          </h2>
          <p style={{
            maxWidth: '670px',
            margin: '0 auto',
            fontSize: '1.25rem',
            color: '#94a3b8',
            lineHeight: '1.5'
          }}>
            Escoge el nivel de potencia que tu operativa necesita. Comienza copiando en simulación y escala hasta dominar múltiples cuentas fondeadas.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {plans.map((plan, index) => (
            <div 
              key={index} 
              style={{
                position: 'relative',
                padding: '32px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: plan.bgStyle,
                border: plan.borderStyle,
                backdropFilter: 'blur(16px)',
                boxShadow: plan.glow ? '0 0 40px rgba(6, 182, 212, 0.2)' : '0 10px 25px rgba(0, 0, 0, 0.3)',
                transform: plan.highlight ? 'translateY(-16px)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#f8fafc',
                  color: '#0f172a',
                  padding: '4px 16px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }}>
                  Más Popular
                </div>
              )}
              
              <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '900',
                  color: plan.themeColor,
                  margin: '0 0 4px 0',
                  letterSpacing: '0.025em'
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  margin: '0 0 24px 0',
                  fontWeight: '600'
                }}>
                  {plan.alias}
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  marginBottom: plan.name === "Free" ? '8px' : '32px'
                }}>
                  <span style={{ fontSize: '3rem', fontWeight: '800', color: '#ffffff' }}>{plan.price}</span>
                  <span style={{ marginLeft: '8px', fontSize: '1.125rem', fontWeight: '500', color: '#94a3b8' }}>{plan.period}</span>
                </div>
                
                {plan.name === "Free" && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#22d3ee',
                    background: 'rgba(8, 145, 178, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    marginBottom: '24px',
                    lineHeight: '1.4'
                  }}>
                    Se descontará automáticamente al hacer Upgrade a cualquier plan de pago.
                  </div>
                )}

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 32px 0'
                }}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <svg style={{
                        height: '24px',
                        width: '24px',
                        flexShrink: 0,
                        color: plan.glow ? '#22d3ee' : '#94a3b8'
                      }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{
                        marginLeft: '12px',
                        fontSize: '0.875rem',
                        color: '#cbd5e1',
                        fontWeight: '500',
                        lineHeight: '1.5'
                      }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto' }}>
                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    background: plan.buttonBg,
                    color: plan.buttonColor,
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '800',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: plan.glow ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none',
                    transition: 'opacity 0.3s ease, transform 0.2s ease'
                  }}
                  onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {loading ? 'PROCESANDO...' : (plan.name === 'Free' ? 'Pagar $1.99 y Generar API' : `Elegir ${plan.name}`)}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <button 
            onClick={() => router.push('/dashboard')} 
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              gap: '8px',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
