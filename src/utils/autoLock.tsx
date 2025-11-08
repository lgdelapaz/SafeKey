import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
/**
 * Hook to automatically lock the app after a period of inactivity
 * @param timeoutMinutes - Number of minutes of inactivity before locking
 */
export const useAutoLock = (timeoutMinutes: number = 5): void => {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<number>(timeoutMinutes);
  // Update timeout ref when timeoutMinutes changes
  useEffect(() => {
    timeoutRef.current = timeoutMinutes;
  }, [timeoutMinutes]);
  useEffect(() => {
    // Don't set up auto-lock if timeout is 0 or less
    if (timeoutMinutes <= 0) return;
    // Function to reset the timer
    const resetTimer = () => {
      // Clear the existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Set a new timer using the current timeout value
      timerRef.current = setTimeout(() => {
        // Lock the app by logging out and redirecting to login
        logout();
        navigate('/login', {
          replace: true
        });
      }, timeoutRef.current * 60 * 1000); // Convert minutes to milliseconds
    };
    // Set up event listeners for user activity
    // Include both desktop and mobile events for comprehensive coverage
    const events = [
    // Mouse events (desktop)
    'mousedown', 'mousemove', 'click',
    // Keyboard events (desktop)
    'keypress', 'keydown', 'keyup',
    // Touch events (mobile/tablet)
    'touchstart', 'touchmove', 'touchend', 'touchcancel',
    // Scroll events (both)
    'scroll', 'wheel',
    // Other interaction events
    'focus', 'blur', 'visibilitychange'];
    // Add all event listeners with passive option for better performance
    events.forEach(event => {
      if (event === 'visibilitychange') {
        document.addEventListener(event, resetTimer);
      } else {
        document.addEventListener(event, resetTimer, {
          passive: true
        });
      }
    });
    // Initialize the timer on mount
    resetTimer();
    // Clean up event listeners and timer on unmount
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeoutMinutes, logout, navigate]);
};