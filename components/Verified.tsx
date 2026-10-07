export function Verified({ source }: { source: string }) {
  return (
    <span className="ver">
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {source}
    </span>
  );
}
