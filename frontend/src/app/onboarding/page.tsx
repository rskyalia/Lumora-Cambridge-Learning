"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { completeOnboarding } from "@/lib/api";

const interestOptions = ["Stories", "Nature", "Space", "Animals", "Numbers", "Building things"];
const goalOptions = ["Confident in maths", "Read more fluently", "Curious about science", "Try new subjects"];

function OnboardingForm() {
  const router = useRouter();
  const { profile } = useAuth();
  const [stage, setStage] = useState<number>(3);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleStart() {
    if (!profile?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      await completeOnboarding(profile.id as string, { stage, interests, goals });
      router.push("/student/learn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-wide text-lumora">Step 1 of 1</p>
      <h1 className="mt-2 text-3xl font-extrabold text-midnight">Let's set up your learning world</h1>
      <p className="mt-2 text-midnight/70">
        Tell us a bit about you so Lumora can pick the right activities to start with.
      </p>

      <Card className="mt-8 space-y-8">
        <section>
          <h2 className="mb-3 font-bold text-midnight">Which stage are you in?</h2>
          <div className="flex gap-3">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStage(s)}
                className={`h-14 w-14 rounded-full font-extrabold transition-colors ${
                  stage === s ? "bg-lumora text-white" : "bg-lavender text-midnight"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-bold text-midnight">What do you enjoy?</h2>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((option) => (
              <button key={option} type="button" onClick={() => toggle(interests, setInterests, option)}>
                <Badge tone={interests.includes(option) ? "purple" : "navy"}>{option}</Badge>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-bold text-midnight">What's your learning goal?</h2>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map((option) => (
              <button key={option} type="button" onClick={() => toggle(goals, setGoals, option)}>
                <Badge tone={goals.includes(option) ? "mint" : "navy"}>{option}</Badge>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <p role="alert" className="rounded-xl bg-sun-soft px-4 py-2 text-sm font-semibold text-midnight">
            {error}
          </p>
        )}

        <Button className="w-full" onClick={handleStart} disabled={isLoading}>
          {isLoading ? "Saving…" : "Start learning"}
        </Button>
      </Card>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGuard allowedRoles={["STUDENT"]}>
      <OnboardingForm />
    </AuthGuard>
  );
}
