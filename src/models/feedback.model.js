import mongoose, {Schema} from "mongoose";

const sendFeedBack = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    feedBackDescription: {
        type: String,
        required: true
    }
},
 {timestamps: true}
);

const SendFeedBack = mongoose.model('FeedBack', sendFeedBack);

export default SendFeedBack;