import { Router } from "express";
import { authRouter } from "./auth.routes";
import { studentRouter } from "./student.routes";
import { activityRouter } from "./activity.routes";
import { recommendationRouter } from "./recommendation.routes";
import { teacherRouter } from "./teacher.routes";
import { parentRouter } from "./parent.routes";
import { sessionRouter } from "./session.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/students", studentRouter);
apiRouter.use("/activities", activityRouter);
apiRouter.use("/recommendations", recommendationRouter);
apiRouter.use("/teacher", teacherRouter);
apiRouter.use("/parent", parentRouter);
apiRouter.use("/sessions", sessionRouter);
