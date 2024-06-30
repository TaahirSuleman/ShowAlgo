// This file is the entry point of the backend application.
// It will be used to start the server and connect to the database.

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

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

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
