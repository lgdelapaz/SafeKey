import React from 'react';
import Header from '../components/Header';
import { UsersIcon, ShieldIcon, HeartIcon } from 'lucide-react';
const AboutUs = () => {
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="About Us" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <div className="flex justify-center mb-6">
            <UsersIcon className="h-20 w-20 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Our Team
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We are a team of Information Technology students dedicated to
            developing secure and user-friendly digital tools. SafeKey was
            created as part of our ITS120L project to help elderlies strengthen
            their online safety while maintaining ease of use.
          </p>
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <p className="text-gray-700 dark:text-gray-300 italic">
              Our mission is to close the gap between security and simplicity,
              ensuring that even non-technical users can protect their personal
              data with confidence.
            </p>
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gray-200 dark:bg-gray-700 w-1/3"></div>
            <HeartIcon className="h-6 w-6 text-red-500 mx-4" />
            <div className="h-px bg-gray-200 dark:bg-gray-700 w-1/3"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-center">
            We believe that cybersecurity should be inclusive, intuitive, and
            empowering—for all ages.
          </p>
        </div>
      </div>
    </div>;
};
export default AboutUs;