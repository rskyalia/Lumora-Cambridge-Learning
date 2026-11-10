interface ProgressBarProps {
  percent: number;
  colorClassName?: string;
  label?: string;
}

// Progress ditampilkan sebagai perkembangan kemampuan, bukan ranking
// (prinsip Calm progress, Bagian 12 & 20).
export function ProgressBar({ percent, colorClassName = "bg-lumora", label }: ProgressBarProps) {
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm font-semibold text-midnight/70">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-pill bg-lavender">
        <div
          className={`h-full rounded-pill ${colorClassName}`}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}
