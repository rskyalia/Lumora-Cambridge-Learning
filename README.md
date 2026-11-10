# Lumora — Cambridge Primary Adaptive Learning

Lumora adalah platform adaptive learning untuk peserta didik usia sekolah dasar (Cambridge Primary Stage 1–3). Sistem mengamati cara siswa belajar (accuracy, attempts, response time, difficulty, skill history), memperkirakan mastery per skill, lalu memilih aktivitas berikutnya secara adaptif.

> Loop utama: **Learn → Practice → Observe → Estimate → Adapt → Learn again**

Repo ini adalah scaffold awal proyek full-stack berdasarkan `Lumora_Complete_Concept.docx`. Ringkasan konsep lengkap ada di [`docs/CONCEPT_SUMMARY.md`](docs/CONCEPT_SUMMARY.md).

## Struktur Repo

```
lumora/
├── backend/     → REST API (Node.js + Express + TypeScript + Prisma/PostgreSQL)
├── frontend/    → Web app (Next.js 14 App Router + TypeScript + Tailwind)
└── docs/        → Ringkasan konsep produk
```

## Cakupan MVP

- **Student app**: Onboarding → Learn → Practice → Feedback → Adaptive Result & Mastery Update → Student Progress & Learning World
- **Teacher Dashboard**: KPI kelas, class mastery per subject, AI insight, learner overview
- **Parent Dashboard**: profil anak, learning time, streak, progress per subject, AI insight
- **Recommendation Engine**: rule-based MVP (reinforce / practice / advance) berdasarkan threshold mastery, siap dikembangkan ke model ML yang lebih canggih
- **Data model**: `Subject → Stage → Strand → Learning Objective → Skill → Activity → Question`, ditambah `learning_sessions`, `attempts`, `mastery`, `recommendations`, `achievements`

## Menjalankan Proyek

### Backend

```bash
cd backend
cp .env.example .env   # isi DATABASE_URL Postgres kamu
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev             # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:3000
```

Frontend memakai mock data (`src/lib/mockData.ts`) secara default supaya bisa langsung dijalankan tanpa backend. Ganti `USE_MOCK` di `src/lib/api.ts` ke `false` setelah backend & seed siap untuk memakai data asli.

## Prinsip Produk (dipertahankan di semua layer)

Evidence-led · Child-first · Calm progress · Teacher-ready · Parent-readable · Curriculum-grounded · Privacy-aware · Human-in-the-loop · Content integrity (tidak menyalin materi berhak cipta Cambridge)

## Design System

- **Typeface**: Nunito
- **Palette**: Midnight/Navy `#1B1B3A`, Lumora Purple `#6C5CE7`, Lavender `#EDEAFF`, Mint `#2EC4B6`, Sun/Yellow `#FFC857`
- **UI**: rounded cards, generous whitespace, soft visual cues, metafora "learning world" (bukan leaderboard kompetitif)

## Catatan tentang Figma

Struktur & isi frame (01–08) di file Figma "Lumora — Cambridge Primary Adaptive Learning" diterjemahkan ke halaman/komponen berdasarkan deskripsi di dokumen konsep (Bagian 11–16, 24). Repo ini tidak melakukan pull otomatis dari Figma karena sesi ini belum tersambung ke Figma MCP tools — jika kamu punya akses `get_design_context`/`get_code_connect_suggestions`, styling & spacing detail bisa disesuaikan lebih presisi menyusul.
