import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  colorFilter: string;
  setColorFilter: (filter: string) => void;
  autoTheme: boolean;
  toggleAutoTheme: () => void;
  dayStartTime: string;
  setDayStartTime: (time: string) => void;
  nightStartTime: string;
  setNightStartTime: (time: string) => void;
};
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  colorFilter: 'none',
  setColorFilter: () => {},
  autoTheme: false,
  toggleAutoTheme: () => {},
  dayStartTime: '07:00',
  setDayStartTime: () => {},
  nightStartTime: '19:00',
  setNightStartTime: () => {}
});
export const useTheme = () => useContext(ThemeContext);
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  // Initialize state from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('safekey_darkMode');
    return savedMode ? savedMode === 'true' : false;
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('safekey_fontSize') || 'medium';
  });
  const [colorFilter, setColorFilter] = useState(() => {
    return localStorage.getItem('safekey_colorFilter') || 'none';
  });
  const [autoTheme, setAutoTheme] = useState(() => {
    const savedAutoTheme = localStorage.getItem('safekey_autoTheme');
    return savedAutoTheme ? savedAutoTheme === 'true' : false;
  });
  const [dayStartTime, setDayStartTime] = useState(() => {
    return localStorage.getItem('safekey_dayStartTime') || '07:00';
  });
  const [nightStartTime, setNightStartTime] = useState(() => {
    return localStorage.getItem('safekey_nightStartTime') || '19:00';
  });
  // Apply dark mode to document when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('safekey_darkMode', darkMode.toString());
  }, [darkMode]);
  // Apply font size to document root
  useEffect(() => {
    const root = document.documentElement;
    // Remove all font size classes
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    // Add the selected font size class
    root.classList.add(`text-${fontSize}`);
    localStorage.setItem('safekey_fontSize', fontSize);
  }, [fontSize]);
  // Save font size and color filter preferences
  useEffect(() => {
    localStorage.setItem('safekey_colorFilter', colorFilter);
  }, [colorFilter]);
  useEffect(() => {
    localStorage.setItem('safekey_autoTheme', autoTheme.toString());
  }, [autoTheme]);
  useEffect(() => {
    localStorage.setItem('safekey_dayStartTime', dayStartTime);
  }, [dayStartTime]);
  useEffect(() => {
    localStorage.setItem('safekey_nightStartTime', nightStartTime);
  }, [nightStartTime]);
  // Function to check time and set theme accordingly
  const checkTimeAndSetTheme = useCallback(() => {
    if (!autoTheme) return;
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    // Parse day start time
    const [dayStartHours, dayStartMinutes] = dayStartTime.split(':').map(Number);
    const dayStartTimeInMinutes = dayStartHours * 60 + dayStartMinutes;
    // Parse night start time
    const [nightStartHours, nightStartMinutes] = nightStartTime.split(':').map(Number);
    const nightStartTimeInMinutes = nightStartHours * 60 + nightStartMinutes;
    // Determine if it's day or night time
    if (currentTimeInMinutes >= dayStartTimeInMinutes && currentTimeInMinutes < nightStartTimeInMinutes) {
      // It's daytime - use light mode
      if (darkMode) setDarkMode(false);
    } else {
      // It's nighttime - use dark mode
      if (!darkMode) setDarkMode(true);
    }
  }, [autoTheme, dayStartTime, nightStartTime, darkMode]);
  // Set up interval to check time for auto theme
  useEffect(() => {
    // Check time immediately when autoTheme changes or component mounts
    if (autoTheme) {
      checkTimeAndSetTheme();
    }
    // Set up interval to check every minute
    const intervalId = setInterval(() => {
      if (autoTheme) {
        checkTimeAndSetTheme();
      }
    }, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [autoTheme, checkTimeAndSetTheme]);
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  // Toggle auto theme
  const toggleAutoTheme = () => {
    setAutoTheme(!autoTheme);
  };
  return <ThemeContext.Provider value={{
    darkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    colorFilter,
    setColorFilter,
    autoTheme,
    toggleAutoTheme,
    dayStartTime,
    setDayStartTime,
    nightStartTime,
    setNightStartTime
  }}>
      {children}
    </ThemeContext.Provider>;
};