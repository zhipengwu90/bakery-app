/** Small four-petal poppy used as a bullet / brand accent. Inherits text colour. */
export default function PoppyMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="12" cy="7.2" r="4.8" />
        <circle cx="16.8" cy="12" r="4.8" />
        <circle cx="12" cy="16.8" r="4.8" />
        <circle cx="7.2" cy="12" r="4.8" />
      </g>
      <circle cx="12" cy="12" r="2.4" fill="#1E1916" />
    </svg>
  );
}
