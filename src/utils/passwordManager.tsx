import React from 'react';
import { encryptData, decryptData } from './encryption';
export type Password = {
  id: string;
  title: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};
// Get all passwords for a user
export const getPasswords = (userId: string): Password[] => {
  try {
    const passwords = JSON.parse(localStorage.getItem(`safekey_passwords_${userId}`) || '[]');
    return passwords;
  } catch (error) {
    console.error('Error getting passwords:', error);
    return [];
  }
};
// Get a single password by ID
export const getPasswordById = (userId: string, passwordId: string): Password | null => {
  try {
    const passwords = getPasswords(userId);
    const password = passwords.find(p => p.id === passwordId);
    return password || null;
  } catch (error) {
    console.error('Error getting password by ID:', error);
    return null;
  }
};
// Add a new password
export const addPassword = (userId: string, {
  title,
  website,
  username,
  password,
  notes,
  category
}: Omit<Password, 'id' | 'createdAt' | 'updatedAt'>): Password | null => {
  try {
    const encryptedPassword = encryptData(password, 'MASTER_KEY');
    const newPassword: Password = {
      id: Date.now().toString(),
      title,
      website,
      username,
      password: encryptedPassword,
      notes,
      category: category || 'Uncategorized',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const passwords = getPasswords(userId);
    passwords.push(newPassword);
    localStorage.setItem(`safekey_passwords_${userId}`, JSON.stringify(passwords));
    return newPassword;
  } catch (error) {
    console.error('Error adding password:', error);
    return null;
  }
};
// Update an existing password
export const updatePassword = (userId: string, passwordId: string, updates: Partial<Omit<Password, 'id' | 'createdAt' | 'updatedAt'>>): Password | null => {
  try {
    const passwords = getPasswords(userId);
    const passwordIndex = passwords.findIndex(p => p.id === passwordId);
    if (passwordIndex === -1) {
      return null;
    }
    // If password field is updated, encrypt it
    if (updates.password) {
      updates.password = encryptData(updates.password, 'MASTER_KEY');
    }
    const updatedPassword = {
      ...passwords[passwordIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    passwords[passwordIndex] = updatedPassword;
    localStorage.setItem(`safekey_passwords_${userId}`, JSON.stringify(passwords));
    return updatedPassword;
  } catch (error) {
    console.error('Error updating password:', error);
    return null;
  }
};
// Delete a password
export const deletePassword = (userId: string, passwordId: string): boolean => {
  try {
    const passwords = getPasswords(userId);
    const updatedPasswords = passwords.filter(p => p.id !== passwordId);
    localStorage.setItem(`safekey_passwords_${userId}`, JSON.stringify(updatedPasswords));
    return true;
  } catch (error) {
    console.error('Error deleting password:', error);
    return false;
  }
};
// Get all unique categories
export const getCategories = (userId: string): string[] => {
  try {
    const passwords = getPasswords(userId);
    const categories = new Set(passwords.map(p => p.category || 'Uncategorized'));
    return Array.from(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return ['Uncategorized'];
  }
};
// Add example passwords for demonstration
export const addExamplePasswords = (userId: string): void => {
  try {
    // Check if user already has passwords
    const existingPasswords = getPasswords(userId);
    if (existingPasswords.length > 0) {
      return; // Don't add examples if user already has passwords
    }
    const examplePasswords = [{
      title: 'Facebook',
      website: 'facebook.com',
      username: 'john.doe@example.com',
      password: encryptData('Facebook@123', 'MASTER_KEY'),
      notes: 'Personal Facebook account',
      category: 'Social Media',
      id: '1001',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }, {
      title: 'Gmail',
      website: 'mail.google.com',
      username: 'john.doe@gmail.com',
      password: encryptData('Gmail@2023!', 'MASTER_KEY'),
      notes: 'Personal email account',
      category: 'Email',
      id: '1002',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      title: 'Amazon',
      website: 'amazon.com',
      username: 'john.doe@example.com',
      password: encryptData('Shop$Secure789', 'MASTER_KEY'),
      notes: 'Prime membership renews on January 15',
      category: 'Shopping',
      id: '1003',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    }, {
      title: 'Bank of America',
      website: 'bankofamerica.com',
      username: 'johndoe',
      password: encryptData('B@nk!Secure456', 'MASTER_KEY'),
      notes: 'Checking account #1234',
      category: 'Banking',
      id: '1004',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    }, {
      title: 'Netflix',
      website: 'netflix.com',
      username: 'john.doe@example.com',
      password: encryptData('Stream@Movies2023', 'MASTER_KEY'),
      notes: 'Family subscription',
      category: 'Entertainment',
      id: '1005',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    }];
    localStorage.setItem(`safekey_passwords_${userId}`, JSON.stringify(examplePasswords));
  } catch (error) {
    console.error('Error adding example passwords:', error);
  }
};