export function Logo({ light = false }: { light?: boolean }) {
  const stroke = light ? '#F7F7F5' : '#14142B'
  return (
    <a href="#inicio" className={`brand ${light ? 'brand--light' : ''}`} aria-label="DITEON - Inicio">
      <svg className="brand__mark" viewBox="0 0 1000 1000" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={light ? 'diteonMarkLight' : 'diteonMark'} x1="230" y1="210" x2="760" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1C6FE0" />
            <stop offset="0.52" stopColor="#7B61FF" />
            <stop offset="1" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#${light ? 'diteonMarkLight' : 'diteonMark'})`} strokeWidth="78" strokeLinecap="round" strokeLinejoin="round">
          <line x1="332" y1="246" x2="395" y2="742" />
          <line x1="332" y1="246" x2="684" y2="449" />
          <line x1="395" y1="742" x2="684" y2="449" />
        </g>
        <g fill={`url(#${light ? 'diteonMarkLight' : 'diteonMark'})`}>
          <circle cx="332" cy="246" r="120" />
          <circle cx="395" cy="742" r="120" />
          <circle cx="684" cy="449" r="120" />
        </g>
      </svg>
      <span style={{ color: stroke }}>DITEON</span>
    </a>
  )
}
