/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains helper functions for authentication
 */

import bcrypt from 'bcrypt';

// Hashes a password using bcrypt
export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    // Generate a salt with 10 rounds
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  })
}

// Compares a password with a hashed password using bcrypt
export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
}