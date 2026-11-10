interface MasteryRingProps {
  percent: number;
  size?: number;
}

// Visualisasi mastery sebagai ring, dipakai di Adaptive Result (Bagian 15)
// dan Learning World (Bagian 16) — netral, tidak kompetitif.
export function MasteryRing({ percent, size = 120 }: MasteryRingProps) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="mx-auto">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#EDEAFF"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#6C5CE7"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-midnight text-2xl font-extrabold"
      >
        {percent}%
      </text>
    </svg>
  );
}
