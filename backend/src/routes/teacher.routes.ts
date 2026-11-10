import { Router } from "express";
import { getClassDashboard, getMyClasses, getStudentDetail } from "../controllers/teacher.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

export const teacherRouter = Router();

teacherRouter.get("/me/classes", requireAuth, asyncHandler(getMyClasses));
teacherRouter.get("/class/:classId", requireAuth, asyncHandler(getClassDashboard));
teacherRouter.get("/student/:studentId", requireAuth, asyncHandler(getStudentDetail));
