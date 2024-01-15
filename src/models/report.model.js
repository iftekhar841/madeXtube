import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    reportName: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);