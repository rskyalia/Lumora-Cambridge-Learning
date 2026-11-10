import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const SALT_ROUNDS = 12;

// ---- Validation schemas ----

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  name: z.string().min(1),
  role: z.enum(["STUDENT", "TEACHER", "PARENT"]),
  stage: z.number().int().min(1).max(6).optional(), // hanya untuk STUDENT
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ---- Helpers ----

function issueToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

// ---- Controllers ----

/**
 * POST /api/auth/register
 * Membuat akun baru (STUDENT / TEACHER / PARENT).
 * Privacy-aware (Bagian 23): hanya simpan data yang diperlukan.
 */
export async function register(req: Request, res: Response) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { email, password, name, role, stage } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email sudah terdaftar" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      name,
      ...(role === "STUDENT" && {
        student: { create: { name, stage: stage ?? 1 } },
      }),
      ...(role === "TEACHER" && {
        teacher: { create: { name } },
      }),
      ...(role === "PARENT" && {
        parent: { create: { name } },
      }),
    },
    include: { student: true, teacher: true, parent: true },
  });

  const token = issueToken(user.id, user.role);

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, role: user.role },
    profile: user.student ?? user.teacher ?? user.parent ?? null,
    onboardingDone: false, // nova siswa selalu perlu onboarding
  });
}

/**
 * POST /api/auth/login
 * Email + password, kembalikan JWT 7 hari.
 */
export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { student: true, teacher: true, parent: true },
  });

  if (!user) {
    return res.status(401).json({ error: "Email atau password salah" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "Email atau password salah" });
  }

  const token = issueToken(user.id, user.role);

  // Tambahkan flag onboardingDone agar frontend bisa redirect returning student
  // ke /student/world alih-alih /onboarding (Bagian 7).
  const profile = user.student ?? user.teacher ?? user.parent ?? null;
  const onboardingDone =
    user.role === "STUDENT" && user.student
      ? user.student.interests.length > 0 || user.student.goals.length > 0
      : true;

  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role },
    profile,
    onboardingDone,
  });
}
