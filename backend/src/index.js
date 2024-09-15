/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the entry point for the backend application. It starts the server and connects to the database.
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pseudocodeRoutes from "./routes/pseudocodeRoutes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

// Configure CORS
app.use(
    cors({
        origin: ["http://localhost:5173"], // Frontend server address
        credentials: true, // allows session cookie from browser to pass through
    })
);
// database connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.log(err));

// middleware
app.use(express.json());
// required for json web tokens
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// all routes go to '/', authRoutes defines the actual routes
app.use("/", authRoutes);
app.use("/api/pseudocode", pseudocodeRoutes); // Pseudocode processing routes
const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
