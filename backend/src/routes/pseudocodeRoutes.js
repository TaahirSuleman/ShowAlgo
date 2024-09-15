import express from "express";
import { runPseudocode } from "../controllers/PseudocodeController.js";

const router = express.Router();

/**
 * Route configuration for handling pseudocode execution requests.
 *
 * This router handles HTTP POST requests sent to the `/run` endpoint.
 * It uses the `runPseudocode` controller to process the pseudocode provided
 * in the request body. The result is then sent back as a JSON response.
 *
 * @author Taahir Suleman
 */
router.post("/run", runPseudocode);

export default router;
