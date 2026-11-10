# Ringkasan Konsep Lumora

Sumber: `Lumora_Complete_Concept.docx` (versi rangkuman konsep — September 2026)

## 1. Ringkasan Eksekutif
Lumora adalah platform adaptive learning untuk siswa sekolah dasar, memakai Cambridge Primary sebagai referensi kerangka pembelajaran, dikombinasikan dengan learning signals dan ML untuk personalisasi aktivitas berikutnya. MVP fokus pada Stage 1–3.

Loop utama: **Learn → Practice → Observe → Estimate → Adapt → Learn again**

## 2. Masalah
- Materi & soal seragam untuk semua siswa meski kemampuan berbeda
- Guru butuh insight lebih dari sekadar nilai akhir
- Orang tua butuh gambaran progress yang mudah dipahami
- Progress harus terasa sebagai perkembangan kemampuan, bukan kompetisi

## 5. Struktur Cambridge Primary
`Cambridge Primary → Subject → Stage → Strand → Learning Objective → Skill → Activity → Question`

- MVP: Stage 1–3
- Subjects: English (reading/writing/speaking/listening), Mathematics (number/geometry/measure/data handling/problem solving), Science (biology/chemistry/physics), Global Perspectives (cross-subject layer)

## 7. Core Product Flow
Onboarding → Learn → Practice → Feedback → Evidence → Mastery → Recommendation → New Evidence (loop)

## 8. Adaptive Learning & ML
**Learning signals**: accuracy, attempts, response time, difficulty, skill history, recent performance (diberi bobot lebih besar)

**MVP rule**: jika performa skill di bawah threshold → reinforcement; setelah membaik → geser ke practice/advance. Threshold adalah konfigurasi produk, divalidasi dengan data nyata.

## 11–16. UX/UI Figma Product Flow
File Figma: "Lumora — Cambridge Primary Adaptive Learning", page "01 — Product Flow", Frame 01–08.

- **Design System**: Nunito; palette Midnight/Navy, Lumora Purple, Lavender, Mint, Sun/Yellow; rounded cards, generous whitespace; prinsip Child-first, Evidence-led, Calm progress, Teacher-ready
- **Teacher Dashboard** (Frame): Class 3A · 24 learners · 3 subjects. KPI: 24 Active learners, 82% Avg. mastery, 7 Need support, 91% Completion. Class mastery: English 86%, Math 74%, Science 81%. AI insight: Geometry butuh reinforcement (7 learners repeated errors pada shape & measure) → suggested action: assign 10-minute visual practice. Learner overview: Alya 91% Reading — On track, Rafi 68% Geometry — Practice, Naya 84% Scientific questions — On track.
- **Parent Dashboard**: Child Alya S., Stage 3, 8 tahun. Learning time 2h40m/minggu, 18 activities completed, streak 6 hari, overall progress 82%. English 86%, Math 74%, Science 81%. AI insight + weekly activity graph + last synced.
- **Adaptive Result & Mastery Update** (Frame 07): Alya quiz 8/10, accuracy 80%, 2 attempts, response time 18 detik, difficulty "Practice". Mastery Geometry & Measure 68% → 76%. Adaptive signal: "Ready for a little more". Next recommendation: "Shapes Around Us". Loop: Answer → Evidence → Mastery → Next Activity.
- **Student Progress & Learning World** (Frame 08): identitas siswa, XP & streak, world map metaphor — English Island 86%, Math Mountain 76%, Science Garden 81%. Today's Mission: "Shapes Around Us" (10 min, Mathematics, Practice). Achievements: 6 Day Streak, 10 Activities, Quick Thinker.

## 18. Model Data Inti
`users, students, subjects, stages, strands, learning_objectives, skills, activities, questions, learning_sessions, attempts, mastery, recommendations, achievements, teacher_insights, parent_insights`

## 19. Recommendation Engine (konsep)
1. Identifikasi skill yang sedang dipelajari
2. Ambil riwayat performa terbaru pada skill tsb
3. Hitung/prediksi mastery
4. Periksa tingkat kesulitan aktivitas tersedia
5. Pilih mode: reinforce / practice / advance
6. Berikan aktivitas berikutnya sesuai learning objective
7. Catat hasil sebagai evidence baru
8. Update mastery, ulangi

## 20. Gamification
XP, streak, badges, missions, learning world — tanpa ranking anak sebagai mekanisme utama.

## 23. Prinsip Produk
Evidence-led · Child-first · Calm progress · Teacher-ready · Parent-readable · Curriculum-grounded · Privacy-aware · Human-in-the-loop · Content integrity
