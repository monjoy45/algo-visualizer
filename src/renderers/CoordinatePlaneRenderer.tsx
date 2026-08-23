import type { MLSnapshot } from "../types/events";

const WIDTH = 480;
const HEIGHT = 280;
const PADDING = 24;

const CLUSTER_COLORS = ["var(--signal-active)", "var(--signal-compare)", "var(--signal-done)", "var(--signal-reject)", "#5eb3f0", "#e879c7"];

export function CoordinatePlaneRenderer({ snapshot }: { snapshot: MLSnapshot | null }) {
  if (!snapshot) {
    return <div className="flex h-64 items-center justify-center text-sm text-[var(--paper-faint)]">No iterations yet</div>;
  }

  const allX = [...snapshot.points.map((p) => p.x), ...snapshot.centroids.map((c) => c.x)];
  const allY = [...snapshot.points.map((p) => p.y), ...snapshot.centroids.map((c) => c.y)];
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const sx = (x: number) => PADDING + ((x - minX) / (maxX - minX || 1)) * (WIDTH - PADDING * 2);
  const sy = (y: number) => HEIGHT - PADDING - ((y - minY) / (maxY - minY || 1)) * (HEIGHT - PADDING * 2);

  return (
    <div className="h-64 w-full px-2" role="img" aria-label={`K-Means iteration ${snapshot.iteration}`}>
      <svg width={WIDTH} height={HEIGHT}>
        {snapshot.points.map((p, i) => (
          <circle
            key={i}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={4.5}
            fill={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]}
            opacity={0.75}
          />
        ))}
        {snapshot.centroids.map((c, i) => (
          <g key={i} className="transition-all duration-300">
            <circle
              cx={sx(c.x)}
              cy={sy(c.y)}
              r={9}
              fill="var(--ink-900)"
              stroke={CLUSTER_COLORS[i % CLUSTER_COLORS.length]}
              strokeWidth={3}
            />
          </g>
        ))}
      </svg>
      <div className="mt-1 flex items-center gap-3 font-mono text-xs text-[var(--paper-dim)]">
        <span>iteration {snapshot.iteration}</span>
        {snapshot.converged && <span className="text-[var(--signal-done)]">converged</span>}
      </div>
    </div>
  );
}
