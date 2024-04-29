import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import videoReportController from "../controllers/videoReport.controller.js";

const videoReport_route = Router();

videoReport_route.post(
  "/create-video-report",
  verifyJWT,
  videoReportController.CreateReportOnVideo
);

videoReport_route.get(
  "/get-all-reports",
  verifyJWT,
  videoReportController.GetAllReportsByUserId
);

export default videoReport_route;
