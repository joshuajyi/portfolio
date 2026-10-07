export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * 100,
    33 - ((v - min) / (max - min || 1)) * 30,
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <div className="spark-wrap">
      <svg className="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
        <path className="ar" d={`${line} L100 36 L0 36 Z`} />
        <path className="ln" d={line} />
      </svg>
      <span className="spark-dot" style={{ left: `${lx}%`, top: `${(ly / 36) * 100}%` }} />
    </div>
  );
}
