export default function AuTvyaLogo({ size = 'lg' }) {
  const heights = { sm: 32, md: 40, lg: 52, xl: 68 };
  const h = heights[size] || heights.lg;

  return (
    <img
      src="/logoaltvya.png"
      alt="AuTvya"
      style={{ height: h, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}
