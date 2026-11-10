interface TrendBadgeProps {
  value: number; // positive = up, negative = down, 0 = flat
  suffix?: string;
  size?: "sm" | "xs";
}

export function TrendBadge({ value, suffix = "%", size = "sm" }: TrendBadgeProps) {
  const isUp = value > 0;
  const isDown = value < 0;
  const textSize = size === "xs" ? "text-xs" : "text-sm";

  if (value === 0) {
    return (
      <span className={`inline-flex items-center gap-0.5 font-semibold ${textSize} text-midnight/40`}>
        <span>—</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-bold ${textSize} ${
        isUp ? "text-mint" : "text-sun"
      }`}
    >
      <span>{isUp ? "↑" : "↓"}</span>
      <span>
        {Math.abs(value)}
        {suffix}
      </span>
    </span>
  );
}
