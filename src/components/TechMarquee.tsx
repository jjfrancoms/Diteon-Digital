const technologies = [
  ['react', 'React'],
  ['typescript', 'TypeScript'],
  ['nodejs', 'Node.js'],
  ['postgresql', 'PostgreSQL'],
  ['supabase', 'Supabase'],
  ['github', 'GitHub'],
] as const
export function TechMarquee() {
  return (
    <div className="technology">
      <p>Una base técnica elegida según tu proyecto</p>
      <ul>
        {technologies.map(([asset, label]) => (
          <li key={asset}>
            <img
              src={`/brands/${asset}.svg`}
              width="26"
              height="26"
              alt=""
              loading="lazy"
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
