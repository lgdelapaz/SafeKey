import React from 'react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, CheckIcon, ClockIcon } from 'lucide-react';
const ThemeMode = () => {
  const {
    darkMode,
    toggleDarkMode,
    autoTheme,
    toggleAutoTheme,
    dayStartTime,
    setDayStartTime,
    nightStartTime,
    setNightStartTime
  } = useTheme();
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Theme" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Choose Theme
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Select a theme that's easier on your eyes.
          </p>
          <div className="space-y-4">
            <button onClick={() => {
            if (autoTheme) toggleAutoTheme();
            if (darkMode) toggleDarkMode();
          }} className={`w-full flex items-center p-4 rounded-lg ${!darkMode && !autoTheme ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent'}`}>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded-full mr-4">
                <SunIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 dark:text-white">
                  Light Mode
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Bright theme for daytime use
                </div>
              </div>
              {!darkMode && !autoTheme && <div className="bg-blue-500 rounded-full p-1">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>}
            </button>
            <button onClick={() => {
            if (autoTheme) toggleAutoTheme();
            if (!darkMode) toggleDarkMode();
          }} className={`w-full flex items-center p-4 rounded-lg ${darkMode && !autoTheme ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent'}`}>
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full mr-4">
                <MoonIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 dark:text-white">
                  Dark Mode
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Easier on the eyes in low light
                </div>
              </div>
              {darkMode && !autoTheme && <div className="bg-blue-500 rounded-full p-1">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>}
            </button>
            <button onClick={toggleAutoTheme} className={`w-full flex items-center p-4 rounded-lg ${autoTheme ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent'}`}>
              <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full mr-4">
                <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 dark:text-white">
                  Automatic
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Switches between light and dark based on time
                </div>
              </div>
              {autoTheme && <div className="bg-blue-500 rounded-full p-1">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>}
            </button>
          </div>
          {autoTheme && <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                Auto Theme Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="dayStartTime" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Switch to Light Mode at:
                  </label>
                  <input id="dayStartTime" type="time" value={dayStartTime} onChange={e => setDayStartTime(e.target.value)} className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="nightStartTime" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Switch to Dark Mode at:
                  </label>
                  <input id="nightStartTime" type="time" value={nightStartTime} onChange={e => setNightStartTime(e.target.value)} className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Theme Benefits
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-1 rounded-full mr-3 mt-1">
                <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Dark mode can reduce eye strain in low-light environments
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-1 rounded-full mr-3 mt-1">
                <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Light mode provides better visibility in bright conditions
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-1 rounded-full mr-3 mt-1">
                <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Automatic mode adjusts to your daily routine
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ThemeMode;