import { Router } from "express";

const feedback_route = Router();

import feedbackController from "../controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

feedback_route.post('/feedback/create-feedback', verifyJWT, feedbackController.createFeedback);

feedback_route.get('/feedback', feedbackController.getFeedbackByUserId);

export default feedback_route;