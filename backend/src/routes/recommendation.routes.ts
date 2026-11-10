import { Router } from "express";
import { getNextRecommendation } from "../controllers/recommendation.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

export const recommendationRouter = Router();

recommendationRouter.get("/:studentId/:skillId", requireAuth, asyncHandler(getNextRecommendation));
