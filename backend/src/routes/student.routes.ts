import { Router } from "express";
import { completeOnboarding, getLearningWorld, getStudentProgress } from "../controllers/student.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

export const studentRouter = Router();

studentRouter.post("/onboarding", requireAuth, asyncHandler(completeOnboarding));
studentRouter.get("/:studentId/world", requireAuth, asyncHandler(getLearningWorld));
studentRouter.get("/:studentId/progress", requireAuth, asyncHandler(getStudentProgress));
