import mongoose, {Schema} from "mongoose";

const videoReportSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    reportId: {
        type: Schema.Types.ObjectId,
        ref: "Report"
    },
    reportContent: {
        type: String,
        default: ""
    }
},
    { timestamps: true },
)

export const VideoReport = mongoose.model("VideoReport", videoReportSchema);