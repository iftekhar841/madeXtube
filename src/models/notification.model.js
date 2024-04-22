import mongoose, { Schema} from "mongoose";

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    subscriberUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
         type: String,
         default: "Your Channel has been subscribed"   
    },
    type: {
        type: String,
        required: true,
        enum: ["subscribe", "videoUpload"]
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    subscribeDate: {
        type: Date,
        default: Date.now
    },
},
  { timestamps: true }
)

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;