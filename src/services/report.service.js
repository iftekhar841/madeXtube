import { Report } from "../models/report.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

// Create Report through admin
const createReport = async (reportDetails) => {
    //Todo: create Report
    const { reportName, description } = reportDetails;
  
    if (!(reportName || description)) {
      throw new ApiError(400, "Fields should not be blank");
    }
  
    if ([reportName, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
  
    const existedReport = await Report.findOne({
      reportName: { $regex: new RegExp(`^${reportName}$`, "i") },
    });

    if (existedReport) {
      throw new ApiError(409, `Report of ${reportName} Name already exists.`);
    }
  
    const report = await Report.create({
      reportName,
      description,
    });
  
    return report;
};


//Get All Reports
const getReports = async () => {
    //Todo: get Report
    const reportToFetch = await Report.find({});
  
    if (!reportToFetch) {
       throw new ApiError(400, "No report available");
    }
    return reportToFetch
};


// Update Reports
const updateReport = async (updateDetails) => {
    //Todo: update Report
    let { reportId } = updateDetails;
  
    if (mongoose.Types.ObjectId.isValid(reportId)) {
      // Now, you can safely cast the value to ObjectId
      reportId = new mongoose.Types.ObjectId(reportId);
    } else {
      throw new ApiError(409, "Invalid Report Id");
    }
  
    const dataToUpdate = await Report.findByIdAndUpdate(
      { _id: reportId },
      {
        $set: updateDetails,
      },
      { new: true }
    ).select("-_id");
  
    return  dataToUpdate;
};


//Delete Report
const deleteReport = async (paramsData) => {
    //Todo: delete Report
    const { reportId } = paramsData;

    let isValidReportId;
    if (mongoose.Types.ObjectId.isValid(reportId)) {
        // Now, you can safely cast the value to ObjectId
        isValidReportId = new mongoose.Types.ObjectId(reportId);
    } else {
        throw new ApiError(409, "Invalid Report Id");
    }
    const dataToDelete = await Report.findByIdAndDelete(isValidReportId);

    if (!dataToDelete) {
        throw new ApiError(400, "Report does not deleted");
    }

    return dataToDelete;
};


  export default {
    createReport,
    getReports,
    updateReport,
    deleteReport
  }