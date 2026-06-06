'use client';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navItems = [
    { name: 'Bitácora (Trades)', path: '/dashboard', icon: '📊' },
    { name: 'Licencia y Planes', path: '/pricing', icon: '💳' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#020617',
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(148, 163, 184, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ fontSize: '24px' }}>🧠</div>
          <span style={{ fontSize: '1.25rem', fontWeight: '900', background: 'linear-gradient(90deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Trading Brain
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <button 
                    onClick={() => router.push(item.path)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                      background: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid transparent',
                      borderRadius: '12px', color: isActive ? '#67e8f9' : '#94a3b8',
                      fontSize: '0.95rem', fontWeight: isActive ? '700' : '500', cursor: 'pointer',
                      transition: 'all 0.2s', textAlign: 'left'
                    }}
                    onMouseOver={e => !isActive && (e.currentTarget.style.color = '#f8fafc')}
                    onMouseOut={e => !isActive && (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
        {children}
      </main>
    </div>
  );
}
