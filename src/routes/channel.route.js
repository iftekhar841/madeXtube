import { Router } from "express";

const channel_route = Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import channelController from "../controllers/channel.controller.js";

channel_route.post('/create-channel', channelController.createChannel);

channel_route.get('/:userId', channelController.getChannelInfoByUserId);

channel_route.delete('/delete-channel/:channelId', verifyJWT, channelController.deleteChannel);

export default channel_route;