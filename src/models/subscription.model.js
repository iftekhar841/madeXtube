import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //One who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //One to whom "subscriber" is subscribing
      ref: "User",
    },
    notificationSent: {
      type: Boolean, // Indicates whether a notification has been sent for this subscription
      default: false,
    },
    notificationMessage: {
      type: String, // Message to be included in the notification
    },
    notificationTimestamp: {
      type: Date, // Timestamp indicating when the notification was sent
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
