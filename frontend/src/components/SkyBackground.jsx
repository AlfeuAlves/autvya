function Cloud({ x, y, scale = 1, opacity = 0.85 }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${scale})`, opacity, transformOrigin: 'left top' }}>
      <div style={{ position: 'relative', width: 110, height: 45 }}>
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 65, height: 42, bottom: 0, left: 0 }} />
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 55, height: 38, bottom: 0, left: 32 }} />
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 45, height: 32, bottom: 0, right: 0 }} />
        <div style={{ position: 'absolute', background: 'white', borderRadius: '50%', width: 42, height: 42, bottom: 10, left: 22 }} />
      </div>
    </div>
  );
}

export default function SkyBackground({ children, style = {} }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #6EC4E8 0%, #93D3EF 22%, #BDE5F5 50%, #DFF2FB 72%, #EFF8FD 100%)',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Nuvens */}
      <Cloud x="-10px" y="20px" scale={1.1} opacity={0.8} />
      <Cloud x="55%" y="10px" scale={0.9} opacity={0.75} />
      <Cloud x="70%" y="35px" scale={0.75} opacity={0.7} />

      {/* Grama no rodapé */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: 'linear-gradient(180deg, #7BC745 0%, #5DA828 100%)',
        borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
        zIndex: 0,
      }} />

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
