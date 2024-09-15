import express from "express";
import { runPseudocode } from "../controllers/PseudocodeController.js";

const router = express.Router();

router.post("/run", runPseudocode);

export default router;
