import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.route.js";
import solutionsRoutes from "./routes/solutions.route.js";
import servicesRoutes from "./routes/services.route.js";
import systemsRoutes from "./routes/systems.route.js";
import portfolioRoutes from "./routes/portfolio.route.js";
import langRoutes from "./routes/lang.routes.js";
import imageRoutes from "./routes/image.route.js";
import cookieParser from "cookie-parser";
// import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const prodOrigins = process.env.OUTER_URL;
const allowedOrigins =
  process.env.NODE_ENV === "online" ? prodOrigins : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

// const __dirname = path.resolve();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});


app.use("/", (req,res)=> res.json("Server is working..."));
app.use("/api/post", postRoutes);
app.use("/api/solutions", solutionsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/systems", systemsRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/locales", langRoutes);
app.use("/api/images", imageRoutes);
app.use("/uploads", express.static("uploads"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
