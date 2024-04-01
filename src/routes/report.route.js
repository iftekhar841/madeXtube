import { Router } from "express";

import reportController from "../controllers/report.controller.js";

//import { verifyJWT } from "../middlewares/auth.middleware.js";

const report_route = Router();

//router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

report_route.post("/add-report", reportController.createReport);
report_route.get("/all-reports", reportController.getReports);
report_route.patch("/update-report", reportController.updateReport);
report_route.delete("/delete-report/:reportId", reportController.deleteReport);

export default report_route;
