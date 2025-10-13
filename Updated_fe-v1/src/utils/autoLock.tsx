import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const useAutoLock = (timeoutMinutes: number) => {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  // Reset the timer when user activity is detected
  const resetTimer = () => {
    setLastActivity(Date.now());
  };
  // Lock the app
  const lockApp = () => {
    logout();
    navigate('/login');
  };
  // Set up event listeners for user activity
  useEffect(() => {
    if (timeoutMinutes <= 0) return; // Don't set up auto-lock if disabled
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    const handleUserActivity = () => {
      resetTimer();
    };
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    // Clean up event listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [timeoutMinutes]);
  // Check for inactivity
  useEffect(() => {
    if (timeoutMinutes <= 0) return; // Don't set up auto-lock if disabled
    // Clear existing timer
    if (timer) {
      clearInterval(timer);
    }
    // Set new timer that checks every 10 seconds
    const newTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = (now - lastActivity) / (1000 * 60); // Convert to minutes
      if (timeSinceLastActivity >= timeoutMinutes) {
        lockApp();
      }
    }, 10000); // Check every 10 seconds
    setTimer(newTimer);
    // Clean up
    return () => {
      if (newTimer) {
        clearInterval(newTimer);
      }
    };
  }, [timeoutMinutes, lastActivity]);
  return {
    resetTimer
  };
};