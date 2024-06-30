import express from 'express';
import cors from 'cors';
import { test } from '../controllers/authController.js';

const router = express.Router();

// middleware
router.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);

// This endpoint is used to test if the server is running
// export this router to be used in index.js
router.get('/', test);

export default router;