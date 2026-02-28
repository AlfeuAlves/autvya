import { Outlet, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Início', icon: '🏠' },
  { to: '/relatorios', label: 'Relatórios', icon: '📊' },
  { to: '/configuracoes', label: 'Config.', icon: '⚙️' },
];

export default function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  // Dashboard tem seu próprio fundo — demais páginas usam fundo neutro
  return (
    <div style={{ minHeight: '100vh', background: isDashboard ? 'transparent' : '#F0F6FF', display: 'flex', flexDirection: 'column' }}>
      {/* Conteúdo */}
      <main style={{ flex: 1, paddingBottom: 66 }}>
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.95)',
        borderTop: '1px solid rgba(200,220,240,0.6)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '10px 0 8px',
              textDecoration: 'none',
              fontSize: 11,
              fontWeight: 700,
              color: isActive ? '#4A90D9' : '#9BB8D0',
              transition: 'color 0.2s',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ fontSize: 22, filter: isActive ? 'none' : 'grayscale(40%)' }}>{item.icon}</span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
