import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

interface ClassMasteryProps {
  data: { subject: string; masteryPct: number }[];
}

const colorBySubject: Record<string, string> = {
  English: "bg-lumora",
  Mathematics: "bg-mint",
  Science: "bg-sun",
};

export function ClassMasteryChart({ data }: ClassMasteryProps) {
  return (
    <Card>
      <h2 className="mb-4 font-bold text-midnight">Class mastery by subject</h2>
      <div className="space-y-4">
        {data.map((d) => (
          <ProgressBar
            key={d.subject}
            label={d.subject}
            percent={d.masteryPct}
            colorClassName={colorBySubject[d.subject] ?? "bg-lumora"}
          />
        ))}
      </div>
    </Card>
  );
}
