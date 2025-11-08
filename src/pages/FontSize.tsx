import React from 'react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { CheckIcon, TypeIcon } from 'lucide-react';
const FontSize = () => {
  const {
    fontSize,
    setFontSize
  } = useTheme();
  const fontSizeOptions = [{
    id: 'small',
    label: 'Small',
    description: 'Compact text size',
    sampleSize: 'text-sm'
  }, {
    id: 'medium',
    label: 'Medium',
    description: 'Default text size',
    sampleSize: 'text-base'
  }, {
    id: 'large',
    label: 'Large',
    description: 'Larger text for better readability',
    sampleSize: 'text-lg'
  }, {
    id: 'extra-large',
    label: 'Extra Large',
    description: 'Maximum text size for accessibility',
    sampleSize: 'text-xl'
  }];
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header title="Font Size" />
        <div className="p-4 pb-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Text Size Settings
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Adjust the text size to make content easier to read.
            </p>
            <div className="space-y-4">
              {fontSizeOptions.map(option => <button key={option.id} onClick={() => setFontSize(option.id)} className={`w-full flex items-center justify-between p-4 rounded-lg ${fontSize === option.id ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent'}`}>
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mr-4">
                      <TypeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className={`font-medium text-gray-800 dark:text-white ${option.sampleSize}`}>
                        {option.label}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {fontSize === option.id && <div className="bg-blue-500 rounded-full p-1">
                      <CheckIcon className="h-5 w-5 text-white" />
                    </div>}
                </button>)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Preview
            </h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                Sample Heading
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                This is how text will appear throughout the app with your selected
                font size. Make sure it's comfortable to read.
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              You can change this setting anytime from the Menu.
            </p>
          </div>
        </div>
      </div>;
};
export default FontSize;