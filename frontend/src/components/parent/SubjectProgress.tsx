import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

interface SubjectProgressProps {
  data: { subject: string; label: string; masteryPct: number }[];
  overallProgress: number;
}

const colorBySubject: Record<string, string> = {
  English: "bg-lumora",
  Mathematics: "bg-mint",
  Science: "bg-sun",
};

// Parent-readable (Bagian 23): progress ditampilkan dengan bahasa yang
// mudah dipahami, bukan data akademik teknis.
export function SubjectProgress({ data, overallProgress }: SubjectProgressProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-midnight">Progress by subject</h2>
        <span className="text-sm font-bold text-lumora">{overallProgress}% overall</span>
      </div>
      <div className="space-y-4">
        {data.map((d) => (
          <ProgressBar
            key={d.subject}
            label={`${d.subject} — ${d.label}`}
            percent={d.masteryPct}
            colorClassName={colorBySubject[d.subject] ?? "bg-lumora"}
          />
        ))}
      </div>
    </Card>
  );
}
