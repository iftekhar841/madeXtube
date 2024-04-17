import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Use morgan middleware with the "dev" format
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Create route for allow client to subscribe to push notification.
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });

  webpush.sendNotification(subscription, payload).catch(console.log);
})

//routes imports
import user_route from "./routes/user.routes.js";
import video_route from "./routes/videos.routes.js";
import category_route from "./routes/categories.routes.js";
import channel_route from "./routes/channel.route.js";
import report_route from "./routes/report.route.js";
import videoReport_route from "./routes/videoReport.route.js";
import likeAndDislikeRoute from "./routes/videoLikeAndDislike.route.js";
import download_route from "./routes/download.route.js";
import history_route from "./routes/history.route.js";
import subscription_route from "./routes/subscription.route.js";
import watchLater_route from "./routes/watchLater.route.js";
import playlist_route from "./routes/playlist.route.js";
import comment_route from "./routes/comment.route.js";
import searchVideo_route from "./routes/searchVideo.routes.js";
import feedback_route from "./routes/feedback.route.js";



//routes declaration
app.use("/api/v1/users", user_route);
app.use("/api/v1/videos", video_route);
app.use("/api/v1/category", category_route);
app.use("/api/v1/channel", channel_route);
app.use("/api/v1/report", report_route);
app.use("/api/v1/video-report", videoReport_route);
app.use("/api/v1/video", likeAndDislikeRoute);
app.use("/api/v1/downloads", download_route);
app.use("/api/v1/history", history_route);
app.use("/api/v1/subscriptions", subscription_route);
app.use("/api/v1/watchLater", watchLater_route);
app.use("/api/v1", playlist_route);
app.use("/api/v1", comment_route);
app.use("/api/v1", searchVideo_route);
app.use("/api/v1", feedback_route);

//http://localhost:8000/api/v1/users/register

export { app };
