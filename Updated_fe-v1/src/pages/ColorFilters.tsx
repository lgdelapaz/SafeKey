import React from 'react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { CheckIcon, PaletteIcon } from 'lucide-react';
const ColorFilters = () => {
  const {
    colorFilter,
    setColorFilter
  } = useTheme();
  const colorFilterOptions = [{
    id: 'none',
    label: 'No Filter',
    description: 'Default colors'
  }, {
    id: 'protanopia',
    label: 'Red-Green (Protanopia)',
    description: 'Helps with red-green color blindness'
  }, {
    id: 'deuteranopia',
    label: 'Green Weakness (Deuteranopia)',
    description: 'Enhances distinction between greens'
  }, {
    id: 'tritanopia',
    label: 'Blue-Yellow (Tritanopia)',
    description: 'Helps with blue-yellow color blindness'
  }, {
    id: 'high-contrast',
    label: 'High Contrast',
    description: 'Maximum contrast for better visibility'
  }];
  const getFilterStyle = (filterId: string) => {
    switch (filterId) {
      case 'protanopia':
        return {
          filter: 'saturate(0.5) brightness(1.2)'
        };
      case 'deuteranopia':
        return {
          filter: 'hue-rotate(-20deg) saturate(0.8)'
        };
      case 'tritanopia':
        return {
          filter: 'hue-rotate(90deg) saturate(0.8)'
        };
      case 'high-contrast':
        return {
          filter: 'contrast(1.4) brightness(1.1)'
        };
      default:
        return {};
    }
  };
  const handleColorFilterChange = (filter: string) => {
    setColorFilter(filter);
    // Apply filter to the entire document (in a real app, this would be more sophisticated)
    if (filter === 'none') {
      document.documentElement.style.filter = '';
    } else {
      document.documentElement.style.filter = getFilterStyle(filter).filter;
    }
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Color Filters" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Accessibility Color Filters
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Adjust colors to improve visibility based on your visual needs.
          </p>
          <div className="space-y-3">
            {colorFilterOptions.map(option => <button key={option.id} onClick={() => handleColorFilterChange(option.id)} className={`w-full flex items-center justify-between p-4 rounded-lg ${colorFilter === option.id ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent'}`} style={option.id !== 'none' ? getFilterStyle(option.id) : {}}>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-red-500 via-green-500 to-blue-500 w-10 h-10 rounded-full mr-4"></div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {option.description}
                    </div>
                  </div>
                </div>
                {colorFilter === option.id && <div className="bg-blue-500 rounded-full p-1">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>}
              </button>)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <PaletteIcon className="h-5 w-5 mr-2" />
            Preview Colors
          </h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="h-8 bg-red-500 rounded"></div>
            <div className="h-8 bg-green-500 rounded"></div>
            <div className="h-8 bg-blue-500 rounded"></div>
            <div className="h-8 bg-yellow-500 rounded"></div>
            <div className="h-8 bg-purple-500 rounded"></div>
            <div className="h-8 bg-pink-500 rounded"></div>
            <div className="h-8 bg-indigo-500 rounded"></div>
            <div className="h-8 bg-gray-500 rounded"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            These color adjustments help make content more distinguishable for
            people with different types of color vision deficiencies.
          </p>
        </div>
      </div>
    </div>;
};
export default ColorFilters;