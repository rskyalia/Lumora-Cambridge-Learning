import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Data contoh berdasarkan "Contoh Perjalanan Siswa" (Bagian 21) dan
// Teacher/Parent Dashboard (Bagian 13-14) di dokumen konsep.
// Soal & konten di sini ditulis sendiri sebagai placeholder — bukan
// menyalin materi Cambridge (prinsip Content integrity, Bagian 23).
// Password default untuk akun dev: "lumora2026"
const DEV_PASSWORD = "lumora2026";

async function main() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 12);

  // ---- Subjects (Bagian 5: English, Mathematics, Science, Global Perspectives) ----
  const mathematics = await prisma.subject.upsert({
    where: { name: "Mathematics" },
    update: {},
    create: { name: "Mathematics" },
  });
  const english = await prisma.subject.upsert({
    where: { name: "English" },
    update: {},
    create: { name: "English" },
  });
  const science = await prisma.subject.upsert({
    where: { name: "Science" },
    update: {},
    create: { name: "Science" },
  });
  const globalPerspectives = await prisma.subject.upsert({
    where: { name: "Global Perspectives" },
    update: {},
    create: { name: "Global Perspectives" },
  });

  // ---- Strands ----
  const geometryStrand = await prisma.strand.create({
    data: { subjectId: mathematics.id, name: "Geometry & Measure" },
  });
  const readingStrand = await prisma.strand.create({
    data: { subjectId: english.id, name: "Reading & Communication" },
  });
  const scienceStrand = await prisma.strand.create({
    data: { subjectId: science.id, name: "Scientific Questions" },
  });
  const globalStrand = await prisma.strand.create({
    data: { subjectId: globalPerspectives.id, name: "Reflection & Perspectives" },
  });

  // ---- Learning Objectives ----
  const geometryLO = await prisma.learningObjective.create({
    data: {
      strandId: geometryStrand.id,
      stage: 3,
      code: "3Gg.01",
      description: "Mengenali dan membandingkan bangun datar dan bangun ruang sederhana.",
    },
  });
  const readingLO = await prisma.learningObjective.create({
    data: {
      strandId: readingStrand.id,
      stage: 3,
      code: "3Rc.02",
      description: "Memahami informasi eksplisit dalam teks pendek.",
    },
  });
  const scienceLO = await prisma.learningObjective.create({
    data: {
      strandId: scienceStrand.id,
      stage: 3,
      code: "3Sq.01",
      description: "Mengajukan pertanyaan ilmiah sederhana tentang lingkungan sekitar.",
    },
  });
  const globalLO = await prisma.learningObjective.create({
    data: {
      strandId: globalStrand.id,
      stage: 3,
      code: "3Gp.01",
      description: "Merefleksikan kebiasaan sehari-hari dan dampaknya terhadap lingkungan.",
    },
  });

  // ---- Skills ----
  const geometrySkill = await prisma.skill.create({
    data: { learningObjectiveId: geometryLO.id, name: "Shapes & Measure" },
  });
  const readingSkill = await prisma.skill.create({
    data: { learningObjectiveId: readingLO.id, name: "Reading Comprehension" },
  });
  const scienceSkill = await prisma.skill.create({
    data: { learningObjectiveId: scienceLO.id, name: "Scientific Questions" },
  });
  await prisma.skill.create({
    data: { learningObjectiveId: globalLO.id, name: "Environmental Reflection" },
  });

  // ---- Activities ----
  const shapesActivity = await prisma.activity.create({
    data: {
      skillId: geometrySkill.id,
      type: "PRACTICE",
      title: "Shapes Around Us",
      storyContext: "Let's Save Water!",
      difficulty: 2,
      estimatedMins: 10,
      questions: {
        create: [
          {
            prompt: "Berapa banyak sisi yang dimiliki sebuah persegi panjang?",
            difficulty: 2,
            correctAnswer: "4",
            metadata: { options: ["3", "4", "5", "6"] },
          },
          {
            prompt: "Bangun ruang apa yang bentuknya seperti kaleng minuman?",
            difficulty: 2,
            correctAnswer: "tabung",
            metadata: { options: ["Kubus", "Tabung", "Bola", "Kerucut"] },
          },
          {
            prompt: "Berapa banyak sudut yang dimiliki sebuah segitiga?",
            difficulty: 1,
            correctAnswer: "3",
            metadata: { options: ["2", "3", "4", "5"] },
          },
        ],
      },
    },
  });

  // Reinforcement: untuk siswa dengan mastery rendah
  await prisma.activity.create({
    data: {
      skillId: geometrySkill.id,
      type: "REINFORCEMENT",
      title: "Shapes Warm-Up",
      storyContext: "Let's Save Water!",
      difficulty: 1,
      estimatedMins: 8,
      questions: {
        create: [
          {
            prompt: "Sebutkan 1 contoh benda yang berbentuk lingkaran!",
            difficulty: 1,
            correctAnswer: "bola",
            metadata: { options: ["Bola", "Kotak", "Pensil", "Meja"] },
          },
        ],
      },
    },
  });

  // Advance: untuk siswa dengan mastery tinggi (≥ 0.80)
  await prisma.activity.create({
    data: {
      skillId: geometrySkill.id,
      type: "ADVANCE",
      title: "Shapes Challenge",
      storyContext: "Let's Save Water!",
      difficulty: 4,
      estimatedMins: 12,
      questions: {
        create: [
          {
            prompt: "Jika sebuah kubus memiliki panjang sisi 3 cm, berapa luas satu sisinya?",
            difficulty: 4,
            correctAnswer: "9",
            metadata: { options: ["6", "9", "12", "27"] },
          },
        ],
      },
    },
  });

  await prisma.activity.create({
    data: {
      skillId: readingSkill.id,
      type: "LESSON",
      title: "The Little Seed",
      storyContext: "Let's Save Water!",
      difficulty: 2,
      estimatedMins: 12,
    },
  });

  await prisma.activity.create({
    data: {
      skillId: readingSkill.id,
      type: "PRACTICE",
      title: "Reading Comprehension Practice",
      difficulty: 2,
      estimatedMins: 10,
    },
  });

  await prisma.activity.create({
    data: {
      skillId: scienceSkill.id,
      type: "PRACTICE",
      title: "Water Around Us",
      storyContext: "Let's Save Water!",
      difficulty: 2,
      estimatedMins: 10,
    },
  });

  // ---- Users ----
  const teacherUser = await prisma.user.create({
    data: {
      email: "teacher@lumora.dev",
      passwordHash,
      role: "TEACHER",
      name: "Bu Sari",
      teacher: { create: { name: "Bu Sari" } },
    },
    include: { teacher: true },
  });

  const classRoom = await prisma.classRoom.create({
    data: { name: "3A", teacherId: teacherUser.teacher!.id },
  });

  const parentUser = await prisma.user.create({
    data: {
      email: "parent@lumora.dev",
      passwordHash,
      role: "PARENT",
      name: "Bapak/Ibu Alya",
      parent: { create: { name: "Bapak/Ibu Alya" } },
    },
    include: { parent: true },
  });

  const alyaUser = await prisma.user.create({
    data: {
      email: "alya@lumora.dev",
      passwordHash,
      role: "STUDENT",
      name: "Alya",
      student: {
        create: {
          name: "Alya",
          stage: 3,
          interests: ["stories", "nature"],
          goals: ["confident in maths"],
          xp: 240,
          streak: 6,
          classId: classRoom.id,
          parentId: parentUser.parent!.id,
        },
      },
    },
    include: { student: true },
  });
  const alya = alyaUser.student!;

  // Siswa tambahan untuk learner overview guru (Bagian 13)
  const rafiUser = await prisma.user.create({
    data: {
      email: "rafi@lumora.dev",
      passwordHash,
      role: "STUDENT",
      name: "Rafi",
      student: { create: { name: "Rafi", stage: 3, classId: classRoom.id } },
    },
    include: { student: true },
  });

  const nayaUser = await prisma.user.create({
    data: {
      email: "naya@lumora.dev",
      passwordHash,
      role: "STUDENT",
      name: "Naya",
      student: { create: { name: "Naya", stage: 3, classId: classRoom.id } },
    },
    include: { student: true },
  });

  // ---- Contoh Perjalanan Siswa (Bagian 21): Alya quiz 8/10 pada Geometry ----
  const session = await prisma.learningSession.create({
    data: { studentId: alya.id, activityId: shapesActivity.id, endedAt: new Date() },
  });

  const questions = await prisma.question.findMany({ where: { activityId: shapesActivity.id } });
  for (const [i, q] of questions.entries()) {
    await prisma.attempt.create({
      data: {
        sessionId: session.id,
        questionId: q.id,
        studentId: alya.id,
        isCorrect: i !== 1, // 1 dari 3 salah, mensimulasikan ~8/10
        responseTimeMs: 18_000,
        attemptNumber: i === 1 ? 2 : 1,
        difficulty: q.difficulty,
      },
    });
  }

  // ---- Mastery (sesuai konsep Bagian 15, 21) ----
  await prisma.mastery.createMany({
    data: [
      {
        studentId: alya.id,
        skillId: geometrySkill.id,
        masteryScore: 0.76,
        history: JSON.stringify([
          { score: 0.68, timestamp: "2026-09-01T00:00:00Z" },
          { score: 0.76, timestamp: new Date().toISOString() },
        ]),
      },
      { studentId: alya.id, skillId: readingSkill.id, masteryScore: 0.86 },
      { studentId: alya.id, skillId: scienceSkill.id, masteryScore: 0.81 },
    ],
  });

  // Mastery untuk Rafi dan Naya (learner overview guru)
  await prisma.mastery.createMany({
    data: [
      { studentId: rafiUser.student!.id, skillId: geometrySkill.id, masteryScore: 0.68 },
      { studentId: nayaUser.student!.id, skillId: scienceSkill.id, masteryScore: 0.84 },
    ],
  });

  // ---- Achievements Alya ----
  await prisma.achievement.createMany({
    data: [
      { studentId: alya.id, type: "STREAK", label: "6 Day Streak", value: 6 },
      { studentId: alya.id, type: "BADGE", label: "10 Activities", value: 10 },
      { studentId: alya.id, type: "BADGE", label: "Quick Thinker", value: 1 },
    ],
  });

  // ---- Teacher & Parent Insights ----
  await prisma.teacherInsight.create({
    data: {
      classId: classRoom.id,
      skillId: geometrySkill.id,
      summary:
        "Geometry membutuhkan reinforcement; 7 learners menunjukkan repeated errors pada shape & measure.",
      suggestedAction: "Assign 10-minute visual practice.",
    },
  });

  await prisma.parentInsight.create({
    data: {
      studentId: alya.id,
      summary:
        "Alya kuat di Reading & Communication (86%). Latihan tambahan pada Geometry & Measure bisa membantu.",
    },
  });

  // ---- Rekomendasi awal untuk Alya ----
  await prisma.recommendation.create({
    data: {
      studentId: alya.id,
      skillId: geometrySkill.id,
      activityId: shapesActivity.id,
      mode: "PRACTICE",
      reason: "Ready for a little more — performa konsisten kuat pada skill ini.",
    },
  });

  console.log(`
✅ Seed selesai.

Dev accounts (password: ${DEV_PASSWORD}):
  teacher@lumora.dev  — TEACHER (Class 3A)
  parent@lumora.dev   — PARENT (orang tua Alya)
  alya@lumora.dev     — STUDENT Stage 3
  rafi@lumora.dev     — STUDENT Stage 3
  naya@lumora.dev     — STUDENT Stage 3
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
