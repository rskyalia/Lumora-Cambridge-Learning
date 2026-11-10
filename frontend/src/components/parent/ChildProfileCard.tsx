import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface ChildProfileCardProps {
  childName: string;
  stage: number;
  age?: number;
  learningTime: string;
  activitiesCompleted: number;
  streak: number;
}

export function ChildProfileCard({
  childName,
  stage,
  age,
  learningTime,
  activitiesCompleted,
  streak,
}: ChildProfileCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-midnight">{childName}</h2>
          <p className="text-midnight/60">Stage {stage}{age !== undefined ? ` · ${age} years old` : ""}</p>
        </div>
        <Badge tone="mint">🔥 {streak} day streak</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-bold text-midnight">{learningTime}</p>
          <p className="text-midnight/50">Learning time this week</p>
        </div>
        <div>
          <p className="font-bold text-midnight">{activitiesCompleted} completed</p>
          <p className="text-midnight/50">Activities</p>
        </div>
      </div>
    </Card>
  );
}
