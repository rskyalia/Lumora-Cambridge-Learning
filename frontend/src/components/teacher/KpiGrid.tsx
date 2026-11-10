import { StatTile } from "../ui/StatTile";

interface KpiGridProps {
  activeLearners: number;
  avgMasteryPct: number;
  needSupport: number;
  completionPct: number;
}

export function KpiGrid({ activeLearners, avgMasteryPct, needSupport, completionPct }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile value={activeLearners} label="Active learners" tone="purple" />
      <StatTile value={`${avgMasteryPct}%`} label="Avg. mastery" tone="mint" />
      <StatTile value={needSupport} label="Need support" tone="sun" />
      <StatTile value={`${completionPct}%`} label="Completion" tone="navy" />
    </div>
  );
}
