import React from 'react';
// This is a simplified mock encryption system
// In a real app, use a proper encryption library
// Simple XOR encryption (for demonstration only - NOT secure)
export const encryptData = (data: string, key: string): string => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  // Convert to base64 for storage
  return btoa(result);
};
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    // Decode from base64
    const decodedData = atob(encryptedData);
    let result = '';
    for (let i = 0; i < decodedData.length; i++) {
      const charCode = decodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Decryption error', error);
    return '';
  }
};
// Generate a random strong password
export const generateStrongPassword = (length = 12, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSpecial = true): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let chars = '';
  if (includeUppercase) chars += uppercase;
  if (includeLowercase) chars += lowercase;
  if (includeNumbers) chars += numbers;
  if (includeSpecial) chars += special;
  if (chars.length === 0) chars = lowercase + numbers; // Default if nothing selected
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};
// AI-based password suggestion (simplified mock)
export const suggestPassword = (userInput: string): string => {
  // In a real app, this would use more sophisticated algorithms
  // This is a simplified version for demonstration
  // Extract meaningful parts from user input
  const parts = userInput.split(/\s+/).filter(part => part.length > 3);
  if (parts.length > 0) {
    // Use part of the input as a base
    const basePart = parts[Math.floor(Math.random() * parts.length)];
    // Capitalize first letter
    const capitalizedPart = basePart.charAt(0).toUpperCase() + basePart.slice(1);
    // Add random numbers
    const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    // Add a special character
    const specials = '!@#$%^&*';
    const special = specials.charAt(Math.floor(Math.random() * specials.length));
    return `${capitalizedPart}${special}${numbers}`;
  } else {
    // Fallback to random password
    return generateStrongPassword(12);
  }
};
// Check password strength
export const checkPasswordStrength = (password: string): {
  score: number; // 0-4, with 4 being strongest
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  // Length check
  if (password.length < 8) {
    feedback.push('Password is too short');
  } else if (password.length >= 12) {
    score += 1;
  }
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;else feedback.push('Add uppercase letters');
  if (/[a-z]/.test(password)) score += 1;else feedback.push('Add lowercase letters');
  if (/[0-9]/.test(password)) score += 1;else feedback.push('Add numbers');
  if (/[^A-Za-z0-9]/.test(password)) score += 1;else feedback.push('Add special characters');
  // Common patterns check
  if (/123|abc|qwerty|password/i.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid common patterns');
  }
  return {
    score,
    feedback: feedback.join('. ')
  };
};