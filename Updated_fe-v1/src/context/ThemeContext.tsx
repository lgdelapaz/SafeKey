import React, { useEffect, useState, createContext, useContext } from 'react';
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  autoTheme: boolean;
  toggleAutoTheme: () => void;
  dayStartTime: string;
  setDayStartTime: (time: string) => void;
  nightStartTime: string;
  setNightStartTime: (time: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  colorFilter: string;
  setColorFilter: (filter: string) => void;
};
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  autoTheme: false,
  toggleAutoTheme: () => {},
  dayStartTime: '06:00',
  setDayStartTime: () => {},
  nightStartTime: '18:00',
  setNightStartTime: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  colorFilter: 'none',
  setColorFilter: () => {}
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
  const [autoTheme, setAutoTheme] = useState(() => {
    const savedAutoTheme = localStorage.getItem('safekey_autoTheme');
    return savedAutoTheme ? savedAutoTheme === 'true' : false;
  });
  const [dayStartTime, setDayStartTime] = useState(() => {
    return localStorage.getItem('safekey_dayStartTime') || '06:00';
  });
  const [nightStartTime, setNightStartTime] = useState(() => {
    return localStorage.getItem('safekey_nightStartTime') || '18:00';
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('safekey_fontSize') || 'medium';
  });
  const [colorFilter, setColorFilter] = useState(() => {
    return localStorage.getItem('safekey_colorFilter') || 'none';
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
  // Save auto theme preferences
  useEffect(() => {
    localStorage.setItem('safekey_autoTheme', autoTheme.toString());
  }, [autoTheme]);
  useEffect(() => {
    localStorage.setItem('safekey_dayStartTime', dayStartTime);
  }, [dayStartTime]);
  useEffect(() => {
    localStorage.setItem('safekey_nightStartTime', nightStartTime);
  }, [nightStartTime]);
  // Check time for auto theme switching
  useEffect(() => {
    if (!autoTheme) return;
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const [dayStartHour, dayStartMinute] = dayStartTime.split(':').map(Number);
      const [nightStartHour, nightStartMinute] = nightStartTime.split(':').map(Number);
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const dayStartTotalMinutes = dayStartHour * 60 + dayStartMinute;
      const nightStartTotalMinutes = nightStartHour * 60 + nightStartMinute;
      // If current time is between day start and night start, use light mode
      if (currentTotalMinutes >= dayStartTotalMinutes && currentTotalMinutes < nightStartTotalMinutes) {
        setDarkMode(false);
      } else {
        setDarkMode(true);
      }
    };
    // Check immediately and then set interval
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [autoTheme, dayStartTime, nightStartTime]);
  // Save font size and color filter preferences
  useEffect(() => {
    localStorage.setItem('safekey_fontSize', fontSize);
    // Apply font size to the document
    document.documentElement.style.fontSize = getFontSizeValue(fontSize);
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem('safekey_colorFilter', colorFilter);
  }, [colorFilter]);
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  // Toggle auto theme
  const toggleAutoTheme = () => {
    setAutoTheme(!autoTheme);
  };
  // Helper function to get font size value
  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'small':
        return '0.875rem';
      // 14px
      case 'medium':
        return '1rem';
      // 16px
      case 'large':
        return '1.125rem';
      // 18px
      case 'x-large':
        return '1.25rem';
      // 20px
      default:
        return '1rem';
    }
  };
  return <ThemeContext.Provider value={{
    darkMode,
    toggleDarkMode,
    autoTheme,
    toggleAutoTheme,
    dayStartTime,
    setDayStartTime,
    nightStartTime,
    setNightStartTime,
    fontSize,
    setFontSize,
    colorFilter,
    setColorFilter
  }}>
      {children}
    </ThemeContext.Provider>;
};