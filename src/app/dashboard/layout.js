export default function DashboardLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0a0f1c',
      color: '#f8fafc',
      fontFamily: '"Inter", sans-serif'
    }}>
      {children}
    </div>
  );
}
