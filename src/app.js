import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

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

//routes imports
import user_route from './routes/user.routes.js';
import video_route from "./routes/videos.routes.js";
import { category_route } from "./routes/categories.routes.js";

//routes declaration
app.use("/api/v1/users", user_route);
app.use("/api/v1/videos", video_route);
app.use("/api/v1/category", category_route);

//http://localhost:8000/api/v1/users/register

export { app };
