import React from 'react';
import Header from '../components/Header';
import { ShieldIcon, DatabaseIcon, UserIcon, LockIcon, ClipboardIcon, TrashIcon } from 'lucide-react';
const PrivacyPolicy = () => {
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Privacy Policy" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <div className="flex justify-center mb-6">
            <ShieldIcon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            How We Protect Your Data
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            At SafeKey, your privacy and security are our highest priorities.
          </p>
          <div className="space-y-6 mb-6">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4 mt-1">
                <ShieldIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Data Encryption
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  All your passwords and sensitive information are encrypted
                  using AES encryption, ensuring only you can decrypt and view
                  your data.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4 mt-1">
                <DatabaseIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Local Data Storage
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  SafeKey stores your data only on your device. Nothing is
                  uploaded, backed up, or shared with external servers or the
                  cloud.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-4 mt-1">
                <UserIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  No Data Sharing
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  SafeKey does not sell, rent, or share your information with
                  anyone.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-4 mt-1">
                <LockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Secure Authentication
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You can unlock your vault with a master password, PIN, or
                  fingerprint. Biometric data is processed only by your device's
                  secure system and never leaves your phone.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full mr-4 mt-1">
                <ClipboardIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Minimal Data Collection
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  SafeKey collects only the essential information (such as name
                  and email) for support and personalization purposes.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-4 mt-1">
                <TrashIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  User Control
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You can delete your vault and all stored passwords at any time
                  directly from the app's settings.
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 italic border-t border-gray-200 dark:border-gray-700 pt-4">
            By using SafeKey, you trust us to safeguard your data—and we take
            that trust seriously by following strict data protection practices
            at every step.
          </p>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>;
};
export default PrivacyPolicy;