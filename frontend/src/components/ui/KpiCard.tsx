import { TrendBadge } from "./TrendBadge";

interface KpiCardProps {
  /** A react-icons component, e.g. `RiTeamLine` */
  IconComponent: React.ElementType;
  value: string | number;
  label: string;
  sublabel?: string;
  /** Tailwind bg class for the icon bubble — default "bg-lumora/10" */
  accentClass?: string;
  /** Tailwind text color for the icon — default "text-lumora" */
  iconColor?: string;
  trend?: number;
}

export function KpiCard({
  IconComponent,
  value,
  label,
  sublabel,
  accentClass = "bg-lumora/10",
  iconColor   = "text-lumora",
  trend,
}: KpiCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.1)]">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accentClass} ${iconColor}`}>
        <IconComponent size={22} />
      </div>
      <div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-extrabold leading-none text-midnight">{value}</span>
          {trend !== undefined && <TrendBadge value={trend} size="xs" />}
        </div>
        <p className="mt-1 text-sm font-semibold text-midnight/60">{label}</p>
        {sublabel && <p className="text-xs text-midnight/35">{sublabel}</p>}
      </div>
    </div>
  );
}
