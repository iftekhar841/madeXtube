import  mongoose, { Schema } from "mongoose";

const channelSchema = new Schema({
    channelName: {
        type: String,
        required: true
    },
	owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
	description: {
        type: String,
        required: true
    }
 },
  { timestamps: true }   
);

export const Channel = mongoose.model('Channel', channelSchema);