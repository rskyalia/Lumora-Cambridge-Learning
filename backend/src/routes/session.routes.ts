import { Router } from "express";
import { createSession, endSession } from "../controllers/session.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

export const sessionRouter = Router();

sessionRouter.post("/", requireAuth, asyncHandler(createSession));
sessionRouter.patch("/:sessionId/end", requireAuth, asyncHandler(endSession));
