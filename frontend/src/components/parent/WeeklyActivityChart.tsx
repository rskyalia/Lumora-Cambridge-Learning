import { Card } from "../ui/Card";

const days = ["M", "T", "W", "T", "F", "S", "S"];

interface WeeklyActivityChartProps {
  /** 7 values (Mon–Sun), counts or minutes per day */
  weeklyData: number[];
  lastSynced?: string;
}

export function WeeklyActivityChart({ weeklyData, lastSynced }: WeeklyActivityChartProps) {
  const data = weeklyData.length === 7 ? weeklyData : Array(7).fill(0);
  const max = Math.max(...data, 1); // avoid divide-by-zero

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-midnight">This week's activity</h2>
        {lastSynced && (
          <span className="text-xs text-midnight/40">Last synced {lastSynced}</span>
        )}
      </div>
      <div className="flex h-24 items-end gap-2">
        {data.map((value, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-lg bg-lumora/80 transition-all"
              style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? "4px" : "0" }}
              title={`${value} session${value !== 1 ? "s" : ""}`}
            />
            <span className="text-xs font-semibold text-midnight/50">{days[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
