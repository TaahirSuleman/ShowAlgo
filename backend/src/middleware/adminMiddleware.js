/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a middleware function to check if a user is an admin
 */

import jwt from 'jsonwebtoken';

// Function to check if a user is an admin based on their token
const adminMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and check if the user is an admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export default adminMiddleware;
