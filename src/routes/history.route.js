import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

import historyController from "../controllers/history.controller.js";

const history_route = Router();

history_route.post('/:videoId', verifyJWT, mongoIdPathVariableValidator('videoId'), historyController.addHistory);

history_route.delete('/deleteByHistoryId/:historyId', verifyJWT, mongoIdPathVariableValidator('historyId'), historyController.removedSingleHistory);

history_route.delete('/delete-all-history', verifyJWT, historyController.removedAllHistory);

history_route.get('/get-all-history', verifyJWT, historyController.getAllHistory);

export default history_route;
