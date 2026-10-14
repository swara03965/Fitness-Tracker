// Decorative fixed background: glowing orbs + dot grid + grain (grain/grid in CSS).
export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <span className="orb orb-1" />
      <span className="orb orb-2" />
      <span className="orb orb-3" />
      <div className="bg-grid" />
      <div className="bg-grain" />
    </div>
  );
}
