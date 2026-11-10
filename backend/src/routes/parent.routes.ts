import { Router } from "express";
import { getChildDashboard, getMyChildren } from "../controllers/parent.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

export const parentRouter = Router();

parentRouter.get("/me/children", requireAuth, asyncHandler(getMyChildren));
parentRouter.get("/child/:studentId", requireAuth, asyncHandler(getChildDashboard));
