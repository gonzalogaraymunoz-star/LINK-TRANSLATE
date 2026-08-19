export function Logo({ light = false }: { light?: boolean }) {
  return <div className={light ? 'logo light' : 'logo'}><span className="logo-dot" />LINK <b>Translate</b></div>;
}
