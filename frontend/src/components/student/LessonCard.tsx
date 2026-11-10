import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import Link from "next/link";

interface LessonCardProps {
  title: string;
  storyContext?: string;
  subject: string;
  estimatedMins: number;
  href: string;
}

// Story-Based Learning (Bagian 10): lesson dibungkus konteks cerita yang
// dekat dengan kehidupan anak, bukan sekadar kumpulan soal.
export function LessonCard({ title, storyContext, subject, estimatedMins, href }: LessonCardProps) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <Badge tone="purple">{subject}</Badge>
        <span className="text-sm font-semibold text-midnight/50">{estimatedMins} min</span>
      </div>
      <h3 className="text-xl font-extrabold text-midnight">{title}</h3>
      {storyContext && <p className="mt-1 text-sm text-midnight/60">Part of "{storyContext}"</p>}
      <Link href={href}>
        <Button className="mt-4">Start lesson</Button>
      </Link>
    </Card>
  );
}
