// Data contoh diambil langsung dari dokumen konsep (Bagian 13-16, 21)
// supaya UI bisa di-preview tanpa backend berjalan.

export const mockLearningWorld = {
  name: "Alya",
  stage: 3,
  xp: 240,
  streak: 6,
  world: [
    { subject: "English", label: "English Island", masteryPct: 86 },
    { subject: "Mathematics", label: "Math Mountain", masteryPct: 76 },
    { subject: "Science", label: "Science Garden", masteryPct: 81 },
  ],
  achievements: [
    { label: "6 Day Streak", type: "STREAK" },
    { label: "10 Activities", type: "BADGE" },
    { label: "Quick Thinker", type: "BADGE" },
  ],
  todaysMission: {
    title: "Shapes Around Us",
    subject: "Mathematics",
    mode: "PRACTICE",
    estimatedMins: 10,
  },
};

export const mockAdaptiveResult = {
  studentName: "Alya",
  score: "8/10",
  accuracyPct: 80,
  attempts: 2,
  responseTimeSec: 18,
  difficulty: "Practice",
  skill: "Geometry & Measure",
  masteryBefore: 68,
  masteryAfter: 76,
  adaptiveSignal: "Ready for a little more",
  nextRecommendation: "Shapes Around Us",
};

export const mockTeacherDashboard = {
  className: "3A",
  activeLearners: 24,
  avgMasteryPct: 82,
  needSupport: 7,
  completionPct: 91,
  classMastery: [
    { subject: "English", masteryPct: 86 },
    { subject: "Mathematics", masteryPct: 74 },
    { subject: "Science", masteryPct: 81 },
  ],
  aiInsights: [
    {
      summary: "Geometry membutuhkan reinforcement; 7 learners menunjukkan repeated errors pada shape & measure.",
      suggestedAction: "Assign 10-minute visual practice.",
    },
  ],
  learnerOverview: [
    { name: "Alya", focusSkill: "Reading comprehension", masteryPct: 91, status: "On track" },
    { name: "Rafi", focusSkill: "Geometry & measure", masteryPct: 68, status: "Practice" },
    { name: "Naya", focusSkill: "Scientific questions", masteryPct: 84, status: "On track" },
  ],
};

export const mockParentDashboard = {
  childName: "Alya S.",
  stage: 3,
  age: 8,
  learningTime: "2h 40m / week",
  activitiesCompleted: 18,
  streak: 6,
  overallProgress: 82,
  subjectProgress: [
    { subject: "English", label: "Reading & communication", masteryPct: 86 },
    { subject: "Mathematics", label: "Geometry & measure", masteryPct: 74 },
    { subject: "Science", label: "Scientific questions", masteryPct: 81 },
  ],
  aiInsight:
    "Alya kuat di Reading & Communication. Latihan tambahan pada Geometry & Measure bisa membantu penguatan.",
  lastSynced: "2 menit yang lalu",
};

export const mockPracticeActivity = {
  id: "shapes-around-us",
  title: "Shapes Around Us",
  storyContext: "Let's Save Water!",
  subject: "Mathematics",
  difficulty: 2,
  questions: [
    {
      id: "q1",
      prompt: "Berapa banyak sisi yang dimiliki sebuah persegi panjang?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
    },
    {
      id: "q2",
      prompt: "Bangun ruang apa yang bentuknya seperti kaleng minuman?",
      options: ["Kubus", "Tabung", "Bola", "Kerucut"],
      correctAnswer: "Tabung",
    },
  ],
};
