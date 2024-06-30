import express from 'express';
import cors from 'cors';
import { test, registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// middleware
router.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);

// This endpoint is used to test if the server is running
router.get('/', test);
// This endpoint is used to register a new user
router.post('/register', registerUser);
// This endpoint is used to login a user
router.post('/login', loginUser);

export default router;