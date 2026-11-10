import Link from "next/link";
import { Badge } from "../ui/Badge";

interface LearnerRowProps {
  studentId: string;
  name: string;
  focusSkill: string;
  masteryPct: number;
  status: "On track" | "Practice" | string;
}

export function LearnerRow({ studentId, name, focusSkill, masteryPct, status }: LearnerRowProps) {
  return (
    <Link
      href={`/teacher/student/${studentId}`}
      className="flex items-center justify-between border-b border-lavender py-3 last:border-none hover:bg-lavender/30 transition-colors rounded-xl px-2 -mx-2"
    >
      <div>
        <p className="font-bold text-midnight">{name}</p>
        <p className="text-sm text-midnight/60">{focusSkill}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-midnight">{masteryPct}%</span>
        <Badge tone={status === "On track" ? "mint" : "sun"}>{status}</Badge>
        <span className="text-xs text-midnight/30">→</span>
      </div>
    </Link>
  );
}
