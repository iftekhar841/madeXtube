import Notification from "../models/notification.model.js";
// import { queueProcessServiceHelper } from "../utils/helperFunctions.js"

// notificationSubscriptionQueueProcessor.js
const notificationSubscriptionQueueProcessor = async (job, done) => {
  console.log("job processor---->", job.data);
  try {
    const { userId, channelId: channelOwnerId, message } = job.data;
    // Here, you can implement your logic to send the notification,
    // for example, using a messaging service or sending an email.
    const notification = new Notification({
        user: channelOwnerId,
        subscriberUser: userId,
        type: 'subscribe',
        message: message
    });

        await notification.save();
    
    console.log(
      `Sending notification to channel owner`
    );

    // Once processing is complete, call the done function
    done();
  } catch (error) {
    // If an error occurs during processing, handle it here
    console.error("Error processing job:", error);
    done(error); // Pass the error to the done function
  }
};


export default notificationSubscriptionQueueProcessor;
