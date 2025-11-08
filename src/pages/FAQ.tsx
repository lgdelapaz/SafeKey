import React from 'react';
import Header from '../components/Header';
const FAQ = () => {
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Frequently Asked Questions" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Q1: What is SafeKey?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            A: SafeKey is a simple and secure mobile app designed to help
            elderlies safely store, manage, and remember their passwords in one
            place.
          </p>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Q2: How does SafeKey keep my passwords safe?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            A: Your passwords are encrypted using AES (Advanced Encryption
            Standard), a trusted cybersecurity method that protects sensitive
            data from unauthorized access.
          </p>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Q3: What if I forget my master password?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            A: For your safety, SafeKey does not store or recover your master
            password. However, you can reset your vault after verification,
            which will securely clear existing data so you can start fresh.
          </p>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Q4: Can I use my fingerprint or a PIN instead of typing my master
            password every time?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            A: Yes, if your device supports biometrics or PIN authentication,
            you can enable these features in the Settings menu for faster and
            easier access.
          </p>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Q5: Will my passwords be shared with anyone?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            A: Never. Your data is stored locally on your device and encrypted
            before being saved. SafeKey does not collect, store, or transmit
            your passwords online.
          </p>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Q6: Can SafeKey help me create stronger passwords?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            A: Yes. SafeKey includes a built-in AI-based password generator that
            suggests secure, hard-to-guess passwords tailored to your
            preferences.
          </p>
        </div>
      </div>
    </div>;
};
export default FAQ;