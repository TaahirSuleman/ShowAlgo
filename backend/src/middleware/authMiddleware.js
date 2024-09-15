/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a middleware function to check if a user is authenticated
 */

import jwt from 'jsonwebtoken';

// Function to check if a user is authenticated based on their token
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;
