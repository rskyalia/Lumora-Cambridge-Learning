import { Router } from "express";
import { getActivity, listActivities, submitAttempt } from "../controllers/activity.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

export const activityRouter = Router();

// GET /api/activities?stage=3&type=LESSON
activityRouter.get("/", requireAuth, asyncHandler(listActivities));
activityRouter.get("/:activityId", requireAuth, asyncHandler(getActivity));
activityRouter.post("/attempt", requireAuth, asyncHandler(submitAttempt));
