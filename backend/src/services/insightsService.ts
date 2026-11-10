import { prisma } from "../lib/prisma";

/**
 * Menghasilkan ringkasan yang "teacher-ready" dan "parent-readable" (Bagian 23)
 * dari data mastery mentah — guru & orang tua tidak melihat angka teknis,
 * tapi kalimat yang bisa langsung ditindaklanjuti.
 */

export async function buildClassSummary(classId: string) {
  const classRoom = await prisma.classRoom.findUnique({
    where: { id: classId },
    include: {
      students: {
        include: {
          mastery: { include: { skill: true } },
          sessions: true,
        },
      },
    },
  });
  if (!classRoom) return null;

  const activeLearners = classRoom.students.length;

  const allMasteryScores = classRoom.students.flatMap((s) =>
    s.mastery.map((m) => m.masteryScore)
  );
  const avgMastery = allMasteryScores.length
    ? allMasteryScores.reduce((a, b) => a + b, 0) / allMasteryScores.length
    : 0;

  const needSupport = classRoom.students.filter((s) =>
    s.mastery.some((m) => m.masteryScore < 0.55)
  ).length;

  // completionPct: persentase siswa yang punya minimal 1 sesi selesai
  const studentsWithCompletion = classRoom.students.filter((s) =>
    s.sessions.some((sess) => sess.endedAt)
  ).length;
  const completionPct = activeLearners > 0
    ? Math.round((studentsWithCompletion / activeLearners) * 100)
    : 0;

  return {
    className: classRoom.name,
    activeLearners,
    avgMasteryPct: Math.round(avgMastery * 100),
    needSupport,
    completionPct,
  };
}

export async function buildParentInsight(studentId: string) {
  const masteries = await prisma.mastery.findMany({
    where: { studentId },
    include: {
      skill: {
        include: {
          learningObjective: { include: { strand: { include: { subject: true } } } },
        },
      },
    },
  });

  if (masteries.length === 0) return null;

  const strongest = [...masteries].sort((a, b) => b.masteryScore - a.masteryScore)[0];
  const weakest = [...masteries].sort((a, b) => a.masteryScore - b.masteryScore)[0];

  const strongSubject = strongest.skill.learningObjective.strand.subject.name;
  const weakSubject = weakest.skill.learningObjective.strand.subject.name;
  const strongSkill = strongest.skill.name;
  const weakSkill = weakest.skill.name;

  const summary =
    strongSubject === weakSubject
      ? `Progress konsisten pada ${strongSubject} (${strongSkill}). Terus semangat berlatih!`
      : `Progress konsisten pada ${strongSubject} (${strongSkill}). Latihan tambahan pada ${weakSubject} (${weakSkill}) bisa membantu penguatan.`;

  return prisma.parentInsight.create({ data: { studentId, summary } });
}
