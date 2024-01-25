import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

import historyController from "../controllers/history.controller.js";

const history_route = Router();

history_route.use(verifyJWT); //Apply verifyJWT middleware to all routes in this file

history_route.post('/:videoId', mongoIdPathVariableValidator('videoId'), historyController.addHistory);

history_route.delete('/deleteByHistoryId/:historyId', mongoIdPathVariableValidator('historyId'), historyController.removedSingleHistory);

history_route.delete('/delete-all-history', historyController.removedAllHistory);

history_route.get('/get-all-history', historyController.getAllHistory);

export default history_route;
