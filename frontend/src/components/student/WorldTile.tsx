import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

interface WorldTileProps {
  label: string;
  masteryPct: number;
  emoji: string;
}

const barColor: Record<string, string> = {
  "English Island": "bg-lumora",
  "Math Mountain": "bg-mint",
  "Science Garden": "bg-sun",
};

// Learning world metaphor (Bagian 16): progress ditampilkan sebagai
// eksplorasi dunia, bukan leaderboard kompetitif.
export function WorldTile({ label, masteryPct, emoji }: WorldTileProps) {
  return (
    <Card className="world-tile text-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="mt-2 font-bold text-midnight">{label}</h3>
      <div className="mt-3">
        <ProgressBar percent={masteryPct} colorClassName={barColor[label] ?? "bg-lumora"} />
      </div>
    </Card>
  );
}
