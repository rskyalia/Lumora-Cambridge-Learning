import { Card } from "./Card";

interface StatTileProps {
  value: string | number;
  label: string;
  tone?: "purple" | "mint" | "sun" | "navy";
}

const toneClasses: Record<NonNullable<StatTileProps["tone"]>, string> = {
  purple: "text-lumora",
  mint: "text-mint",
  sun: "text-sun",
  navy: "text-midnight",
};

export function StatTile({ value, label, tone = "purple" }: StatTileProps) {
  return (
    <Card className="text-center">
      <p className={`text-3xl font-extrabold ${toneClasses[tone]}`}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-midnight/60">{label}</p>
    </Card>
  );
}
