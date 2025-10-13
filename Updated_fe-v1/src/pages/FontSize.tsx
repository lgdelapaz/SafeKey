import React, { useState } from 'react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { CheckIcon, MinusIcon, PlusIcon } from 'lucide-react';
const FontSize = () => {
  const {
    fontSize,
    setFontSize
  } = useTheme();
  const [customSize, setCustomSize] = useState<number>(() => {
    switch (fontSize) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      case 'x-large':
        return 20;
      default:
        return 16;
    }
  });
  const fontSizeOptions = [{
    id: 'small',
    label: 'Small',
    description: 'Compact text for more content',
    size: 14
  }, {
    id: 'medium',
    label: 'Medium',
    description: 'Default text size',
    size: 16
  }, {
    id: 'large',
    label: 'Large',
    description: 'Larger text for better readability',
    size: 18
  }, {
    id: 'x-large',
    label: 'Extra Large',
    description: 'Maximum size for easiest reading',
    size: 20
  }];
  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    // Update custom size value
    const option = fontSizeOptions.find(opt => opt.id === size);
    if (option) {
      setCustomSize(option.size);
    }
  };
  const handleCustomSizeChange = (newSize: number) => {
    // Limit size between 12 and 24
    const limitedSize = Math.max(12, Math.min(24, newSize));
    setCustomSize(limitedSize);
    // Apply custom font size
    document.documentElement.style.fontSize = `${limitedSize}px`;
    // Set closest preset or keep the current one
    if (limitedSize <= 14) {
      setFontSize('small');
    } else if (limitedSize <= 16) {
      setFontSize('medium');
    } else if (limitedSize <= 18) {
      setFontSize('large');
    } else {
      setFontSize('x-large');
    }
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Font Size" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Adjust Text Size
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Choose a comfortable text size for better readability.
          </p>
          <div className="space-y-3">
            {fontSizeOptions.map(option => <button key={option.id} onClick={() => handleFontSizeChange(option.id)} className={`w-full flex items-center justify-between p-4 rounded-lg ${fontSize === option.id ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent'}`}>
                <div>
                  <div className={`font-medium text-gray-800 dark:text-white`} style={{
                fontSize: `${option.size}px`
              }}>
                    {option.label}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {option.description}
                  </div>
                </div>
                {fontSize === option.id && <div className="bg-blue-500 rounded-full p-1">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>}
              </button>)}
          </div>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Custom Size
            </h3>
            <div className="flex items-center justify-between">
              <button onClick={() => handleCustomSizeChange(customSize - 1)} className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                <MinusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {customSize}px
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Font Size
                </span>
              </div>
              <button onClick={() => handleCustomSizeChange(customSize + 1)} className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Preview
          </h3>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Sample Header
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              This is how your text will appear throughout the app.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You can change this setting at any time.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default FontSize;