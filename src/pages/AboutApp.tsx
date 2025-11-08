import React from 'react';
import Header from '../components/Header';
import { ShieldIcon, EyeIcon, KeyIcon } from 'lucide-react';
const AboutApp = () => {
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="About This App" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 rounded-full p-4 inline-block">
              <KeyIcon className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            SafeKey
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            SafeKey is a mobile password vault developed with cybersecurity and
            accessibility in mind. It enables elderlies to manage their online
            accounts easily and securely without the struggle of remembering
            multiple complex passwords.
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                <ShieldIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Security
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  All passwords are protected using AES encryption.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
                <EyeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Simplicity
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Designed with large text, high contrast, and clear icons for
                  easy navigation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-4">
                <div className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Convenience
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Offers fingerprint or PIN login and an AI-powered password
                  suggestion feature.
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 italic border-t border-gray-200 dark:border-gray-700 pt-4">
            SafeKey's mission is to empower elderlies to use technology safely,
            confidently, and independently by making digital security accessible
            to everyone.
          </p>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Version 1.0.0
        </div>
      </div>
    </div>;
};
export default AboutApp;