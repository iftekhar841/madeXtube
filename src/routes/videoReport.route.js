import { Router } from "express";
import videoReportController from "../controllers/videoReport.controller.js";

const videoReport_route = Router();

videoReport_route.post(
  "/create-video-report",
  videoReportController.CreateVideoReport
);

export default videoReport_route;
