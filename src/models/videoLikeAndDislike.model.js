import mongoose from "mongoose";

const videoLikeAndDislikeSchema = new mongoose.Schema({
 videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true 
  },
 likes: {
    type: Number,
    default: 0
 },
 dislikes: {
    type: Number,
    default: 0
 },
 likedBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
 ],
 dislikedBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
 ],

});

export const VideoLikeAndDislike = mongoose.model('VideoLikeAndDislike', videoLikeAndDislikeSchema);
