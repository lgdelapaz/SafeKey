import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldIcon, FingerprintIcon, KeyIcon, ClockIcon, EyeIcon, EyeOffIcon, CheckIcon, XIcon, AlertTriangleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { toast } from 'sonner';
const SecuritySettings = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  // Security settings states
  const [useBiometric, setUseBiometric] = useState(false);
  const [usePin, setUsePin] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [autoLockTimer, setAutoLockTimer] = useState(5); // minutes
  const [hidePasswordsByDefault, setHidePasswordsByDefault] = useState(true);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);
  // Load saved settings from localStorage
  useEffect(() => {
    if (user) {
      try {
        const savedSettings = JSON.parse(localStorage.getItem(`safekey_security_${user.id}`) || '{}');
        if (savedSettings.useBiometric !== undefined) {
          setUseBiometric(savedSettings.useBiometric);
        }
        if (savedSettings.usePin !== undefined) {
          setUsePin(savedSettings.usePin);
        }
        if (savedSettings.autoLockTimer !== undefined) {
          setAutoLockTimer(savedSettings.autoLockTimer);
        }
        if (savedSettings.hidePasswordsByDefault !== undefined) {
          setHidePasswordsByDefault(savedSettings.hidePasswordsByDefault);
        }
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    }
  }, [user]);
  // Save settings to localStorage
  const saveSettings = () => {
    if (user) {
      const settings = {
        useBiometric,
        usePin,
        autoLockTimer,
        hidePasswordsByDefault
      };
      localStorage.setItem(`safekey_security_${user.id}`, JSON.stringify(settings));
      toast.success('Security settings saved successfully');
    }
  };
  const handleToggleBiometric = () => {
    // In a real app, this would trigger device biometric authentication setup
    setUseBiometric(!useBiometric);
    setTimeout(saveSettings, 100);
    if (!useBiometric) {
      toast.success('Biometric authentication enabled');
    } else {
      toast.success('Biometric authentication disabled');
    }
  };
  const handleTogglePin = () => {
    if (!usePin) {
      // If enabling PIN, open PIN setup
      setIsPinSetupOpen(true);
    } else {
      // If disabling PIN, just turn it off
      setUsePin(false);
      setTimeout(saveSettings, 100);
      toast.success('PIN authentication disabled');
    }
  };
  const handlePinSetup = () => {
    if (pin.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    // In a real app, we would hash the PIN before storing it
    localStorage.setItem(`safekey_pin_${user?.id}`, pin);
    setUsePin(true);
    setIsPinSetupOpen(false);
    setPinError('');
    setPin('');
    setConfirmPin('');
    setTimeout(saveSettings, 100);
    toast.success('PIN setup successfully');
  };
  const handleCancelPinSetup = () => {
    setIsPinSetupOpen(false);
    setPinError('');
    setPin('');
    setConfirmPin('');
  };
  const handleAutoLockTimerChange = (minutes: number) => {
    setAutoLockTimer(minutes);
    setTimeout(saveSettings, 100);
  };
  const handleTogglePasswordVisibility = () => {
    setHidePasswordsByDefault(!hidePasswordsByDefault);
    setTimeout(saveSettings, 100);
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Security Settings" />
      <div className="p-4 pb-20">
        {/* Security Status Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
              <ShieldIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Security Status
              </h2>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Your vault is secure
              </p>
            </div>
          </div>
        </div>
        {/* Security Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Authentication Options
            </h3>
          </div>
          {/* Biometric Authentication */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <FingerprintIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    Biometric Authentication
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use fingerprint or face ID to unlock
                  </p>
                </div>
              </div>
              <div className="relative inline-block w-12 h-6 ml-4">
                <input type="checkbox" checked={useBiometric} onChange={handleToggleBiometric} className="opacity-0 w-0 h-0" id="biometric-toggle" />
                <label htmlFor="biometric-toggle" className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${useBiometric ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute left-1 bottom-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 ${useBiometric ? 'transform translate-x-6' : ''}`}></span>
                </label>
              </div>
            </div>
          </div>
          {/* PIN Authentication */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <KeyIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    PIN Code
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use a numeric PIN to unlock
                  </p>
                </div>
              </div>
              <div className="relative inline-block w-12 h-6 ml-4">
                <input type="checkbox" checked={usePin} onChange={handleTogglePin} className="opacity-0 w-0 h-0" id="pin-toggle" />
                <label htmlFor="pin-toggle" className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${usePin ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute left-1 bottom-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 ${usePin ? 'transform translate-x-6' : ''}`}></span>
                </label>
              </div>
            </div>
          </div>
          {/* Auto-Lock Timer */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <div className="w-full">
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  Auto-Lock Timer
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Lock vault after inactivity
                </p>
                <div className="flex flex-col space-y-3">
                  {[1, 5, 15, 30, 60].map(minutes => <button key={minutes} onClick={() => handleAutoLockTimerChange(minutes)} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${autoLockTimer === minutes ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                      <span className="text-gray-800 dark:text-white">
                        {minutes === 1 ? '1 minute' : `${minutes} minutes`}
                      </span>
                      {autoLockTimer === minutes && <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    </button>)}
                </div>
              </div>
            </div>
          </div>
          {/* Password Visibility */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                {hidePasswordsByDefault ? <EyeOffIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" /> : <EyeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />}
                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    Hide Passwords by Default
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {hidePasswordsByDefault ? 'Passwords are hidden until revealed' : 'Passwords are visible by default'}
                  </p>
                </div>
              </div>
              <div className="relative inline-block w-12 h-6 ml-4">
                <input type="checkbox" checked={hidePasswordsByDefault} onChange={handleTogglePasswordVisibility} className="opacity-0 w-0 h-0" id="visibility-toggle" />
                <label htmlFor="visibility-toggle" className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${hidePasswordsByDefault ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute left-1 bottom-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 ${hidePasswordsByDefault ? 'transform translate-x-6' : ''}`}></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Security Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Security Tips
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <AlertTriangleIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                Use a strong, unique master password that you don't use for any
                other accounts.
              </p>
            </div>
            <div className="flex items-start">
              <AlertTriangleIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                Enable biometric authentication for convenient and secure
                access.
              </p>
            </div>
            <div className="flex items-start">
              <AlertTriangleIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                Set a shorter auto-lock timer for better security, especially in
                public places.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* PIN Setup Modal */}
      {isPinSetupOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Set Up PIN Code
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="pin" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    Enter PIN (at least 4 digits)
                  </label>
                  <input type="password" id="pin" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} maxLength={8} placeholder="Enter PIN" className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="confirmPin" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    Confirm PIN
                  </label>
                  <input type="password" id="confirmPin" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))} maxLength={8} placeholder="Confirm PIN" className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                {pinError && <div className="text-red-500 dark:text-red-400 flex items-center">
                    <XIcon className="h-5 w-5 mr-2" />
                    {pinError}
                  </div>}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={handleCancelPinSetup} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Cancel
                </button>
                <button onClick={handlePinSetup} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  Save PIN
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default SecuritySettings;