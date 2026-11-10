import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface AiInsightCardProps {
  summary: string;
  suggestedAction: string;
}

// Human-in-the-loop (Bagian 23): AI memberi insight & suggested action,
// keputusan pedagogis tetap di tangan guru.
export function AiInsightCard({ summary, suggestedAction }: AiInsightCardProps) {
  return (
    <Card className="border-2 border-lumora/20 bg-lavender/40">
      <Badge tone="purple">AI insight</Badge>
      <p className="mt-3 text-midnight">{summary}</p>
      <p className="mt-2 text-sm font-semibold text-lumora">Suggested action: {suggestedAction}</p>
    </Card>
  );
}
