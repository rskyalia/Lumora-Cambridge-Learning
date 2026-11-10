import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "lumora-api" }));
  app.use("/api", apiRouter);

  // ---- Global error handler ----
  // Menangkap semua error yang di-pass via next(err) atau throw di async handler.
  // Prisma known errors (P2025 = not found, P2002 = unique constraint, dst.)
  // dikembalikan sebagai response terstruktur, bukan stack trace mentah.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[lumora-api]", err);

    // Prisma errors memiliki properti `code`
    if (typeof err === "object" && err !== null && "code" in err) {
      const prismaErr = err as { code: string; meta?: { target?: string[] } };
      if (prismaErr.code === "P2025") {
        return res.status(404).json({ error: "Record tidak ditemukan" });
      }
      if (prismaErr.code === "P2002") {
        const field = prismaErr.meta?.target?.join(", ") ?? "field";
        return res.status(409).json({ error: `${field} sudah digunakan` });
      }
    }

    if (err instanceof SyntaxError) {
      return res.status(400).json({ error: "Request body tidak valid (JSON malformed)" });
    }

    const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server";
    res.status(500).json({ error: message });
  });

  return app;
}
