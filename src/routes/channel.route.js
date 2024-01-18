import { Router } from "express";

const channel_route = Router();

import channelController from "../controllers/channel.controller.js";

channel_route.post('/create-channel', channelController.createChannel);

channel_route.get('/:userId', channelController.getChannelInfoByUserId);

export default channel_route;