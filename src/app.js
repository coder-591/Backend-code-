import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  // cors => cross origin resource sharing
  cors({
    origin: process.env.CROS_ORIGIN,
    credentials: true,
  })
);
// In super simple words:
// Middlewares
// express.json() =>"Backend, please read JSON data from frontend."
app.use(express.json({ limit: "16kb" })); // for JSON (from frontend apps)
// express.urlencoded() =>"Backend, please read form data from frontend."
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // for HTML forms
app.use(express.static("public"));
app.use(cookieParser());

// Routes import standard practice
import router from "./routes/user.routes.js";
// routes declerations
app.use("/api/v1/users", router);

export default app;
