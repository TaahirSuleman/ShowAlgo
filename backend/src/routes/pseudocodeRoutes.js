import express from "express";
import { runPseudocode } from "../controllers/pseudocodeController.js";

const router = express.Router();

router.post("/run", runPseudocode);

export default router;
