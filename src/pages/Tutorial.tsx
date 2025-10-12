import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ChevronLeftIcon, KeyIcon, PlusIcon, EyeIcon, EyeOffIcon, RefreshCwIcon, TrashIcon, ShieldIcon, CheckCircleIcon, HelpCircleIcon } from 'lucide-react';
import Header from '../components/Header';
const Tutorial = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const tutorialSteps = [{
    title: 'Welcome to SafeKey',
    content: "Your secure password vault for storing and managing all your passwords in one place. Let's learn how to use it!",
    image: <HelpCircleIcon className="w-32 h-32 text-blue-500 mx-auto mb-6" />
  }, {
    title: 'View Your Passwords',
    content: "Tap the 'Passwords' button on the home screen or in the bottom navigation bar to see all your stored passwords.",
    image: <KeyIcon className="w-32 h-32 text-green-500 mx-auto mb-6" />
  }, {
    title: 'Add New Passwords',
    content: "Tap the 'Add' button at the bottom of the screen to create a new password entry. Fill in the details and save it securely.",
    image: <PlusIcon className="w-32 h-32 text-blue-500 mx-auto mb-6" />
  }, {
    title: 'Show or Hide Passwords',
    content: 'When viewing your passwords, tap the eye icon to show or hide the actual password text for security.',
    image: <div className="flex items-center justify-center space-x-4 mb-6">
          <EyeIcon className="w-24 h-24 text-blue-500" />
          <div className="text-4xl">↔️</div>
          <EyeOffIcon className="w-24 h-24 text-blue-500" />
        </div>
  }, {
    title: 'Generate Strong Passwords',
    content: "When adding a new password, use the 'Generate Strong Password' button to create a secure, random password.",
    image: <RefreshCwIcon className="w-32 h-32 text-purple-500 mx-auto mb-6" />
  }, {
    title: 'Delete Passwords',
    content: 'To delete a password, find it in your password list and tap the trash icon. Confirm to permanently remove it.',
    image: <TrashIcon className="w-32 h-32 text-red-500 mx-auto mb-6" />
  }, {
    title: 'Security Settings',
    content: 'Access security settings from the Menu to set up PIN protection, biometric authentication, and auto-lock timers.',
    image: <ShieldIcon className="w-32 h-32 text-blue-600 mx-auto mb-6" />
  }, {
    title: "You're All Set!",
    content: 'You now know the basics of using SafeKey. Remember to keep your master password secure and never share it with anyone.',
    image: <CheckCircleIcon className="w-32 h-32 text-green-500 mx-auto mb-6" />
  }];
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step, navigate back to home
      navigate('/');
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };
  const currentTutorial = tutorialSteps[currentStep];
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Tutorial" />
      <div className="flex-1 p-4 flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex-1 flex flex-col">
          <div className="flex-1">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              {tutorialSteps.map((_, index) => <button key={index} onClick={() => goToStep(index)} className={`mx-1 w-3 h-3 rounded-full transition-colors ${currentStep === index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} aria-label={`Go to step ${index + 1}`} />)}
            </div>
            {/* Step content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {currentTutorial.title}
              </h2>
              {/* Tutorial image/icon */}
              {currentTutorial.image}
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {currentTutorial.content}
              </p>
            </div>
          </div>
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className={`flex items-center px-4 py-2 rounded-lg ${currentStep === 0 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`} disabled={currentStep === 0}>
              <ChevronLeftIcon className="h-6 w-6 mr-1" />
              Previous
            </button>
            <div className="text-gray-500 dark:text-gray-400">
              {currentStep + 1} of {tutorialSteps.length}
            </div>
            <button onClick={nextStep} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
              <ChevronRightIcon className="h-6 w-6 ml-1" />
            </button>
          </div>
        </div>
        {/* Skip tutorial button */}
        <button onClick={() => navigate('/')} className="mt-4 text-center text-gray-600 dark:text-gray-400 underline">
          Skip tutorial
        </button>
      </div>
      {/* Additional tips section */}
      <div className="p-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
            <HelpCircleIcon className="h-5 w-5 mr-2" />
            Helpful Tip
          </h3>
          {currentStep === 0 && <p className="text-blue-700 dark:text-blue-300">
              SafeKey keeps all your passwords secure in one place, so you only
              need to remember your master password.
            </p>}
          {currentStep === 1 && <p className="text-blue-700 dark:text-blue-300">
              You can search and filter your passwords by category to find them
              quickly.
            </p>}
          {currentStep === 2 && <p className="text-blue-700 dark:text-blue-300">
              Always add notes to your password entries to remember what they're
              for.
            </p>}
          {currentStep === 3 && <p className="text-blue-700 dark:text-blue-300">
              Always hide your passwords when in public places to prevent others
              from seeing them.
            </p>}
          {currentStep === 4 && <p className="text-blue-700 dark:text-blue-300">
              Using unique, strong passwords for each account is the best way to
              stay secure online.
            </p>}
          {currentStep === 5 && <p className="text-blue-700 dark:text-blue-300">
              Before deleting a password, make sure you have it stored somewhere
              else or won't need it again.
            </p>}
          {currentStep === 6 && <p className="text-blue-700 dark:text-blue-300">
              Setting up a PIN or biometric authentication adds an extra layer
              of security to your password vault.
            </p>}
          {currentStep === 7 && <p className="text-blue-700 dark:text-blue-300">
              You can revisit this tutorial anytime from the Menu if you need a
              refresher.
            </p>}
        </div>
      </div>
    </div>;
};
export default Tutorial;