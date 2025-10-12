import React, { useEffect, useState, createContext, useContext } from 'react';
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  colorFilter: string;
  setColorFilter: (filter: string) => void;
};
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
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
  // Save font size and color filter preferences
  useEffect(() => {
    localStorage.setItem('safekey_fontSize', fontSize);
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem('safekey_colorFilter', colorFilter);
  }, [colorFilter]);
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return <ThemeContext.Provider value={{
    darkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    colorFilter,
    setColorFilter
  }}>
      {children}
    </ThemeContext.Provider>;
};