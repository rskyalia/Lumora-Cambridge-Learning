interface DonutRingProps {
  percent: number;       // 0–100
  size?: number;         // px, default 80
  stroke?: number;       // px, default 8
  color?: string;        // tailwind hex or CSS color, default lumora purple
  trackColor?: string;
  label?: string;        // centre label override (default: percent%)
}

/**
 * SVG donut ring — same math as MasteryRing but more configurable.
 * Used in dashboard stat tiles and subject cards.
 */
export function DonutRing({
  percent,
  size = 80,
  stroke = 8,
  color = "#6C5CE7",
  trackColor = "#EDEAFF",
  label,
}: DonutRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} aria-label={`${clamped}%`}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
      {/* Fill */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Centre label */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.2}
        fontWeight="800"
        fill="#1B1B3A"
      >
        {label ?? `${clamped}%`}
      </text>
    </svg>
  );
}
