import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { toast } from 'sonner';
import { checkPasswordStrength } from '../utils/encryption';
const ChangeMasterPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    changeMasterPassword
  } = useAuth();
  const navigate = useNavigate();
  const passwordStrength = checkPasswordStrength(newPassword);
  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-red-400';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-400';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };
  const getStrengthText = () => {
    switch (passwordStrength.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Enter a password';
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate inputs
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }
    if (passwordStrength.score < 2) {
      if (!window.confirm('This password is weak. Are you sure you want to use it?')) {
        return;
      }
    }
    setIsLoading(true);
    try {
      const success = await changeMasterPassword(currentPassword, newPassword);
      if (success) {
        toast.success('Master password changed successfully');
        navigate('/menu');
      } else {
        toast.error('Current password is incorrect');
      }
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Change Master Password" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <LockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Update Master Password
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your master password is the key to all your saved passwords. Make
              sure it's strong and memorable.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                Current Password
              </label>
              <div className="relative">
                <input id="current-password" type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your current password" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                New Password
              </label>
              <div className="relative">
                <input id="new-password" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Create a strong password" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Password strength indicator */}
              {newPassword && <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className={`h-2.5 rounded-full ${getStrengthColor()}`} style={{
                  width: `${(passwordStrength.score + 1) * 20}%`
                }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={passwordStrength.score >= 3 ? 'text-green-500' : 'text-gray-500'}>
                      {getStrengthText()}
                    </span>
                    {passwordStrength.feedback && <span className="text-orange-500 flex items-center">
                        <AlertCircleIcon size={14} className="mr-1" />{' '}
                        {passwordStrength.feedback}
                      </span>}
                  </div>
                </div>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                Confirm New Password
              </label>
              <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm your new password" />
              {newPassword && confirmPassword && newPassword !== confirmPassword && <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircleIcon size={14} className="mr-1" /> Passwords do
                    not match
                  </p>}
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Updating...' : 'Update Master Password'}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2" />
            Important Information
          </h3>
          <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Your master password is the only way to access your vault. Don't
                forget it!
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Create a password that's both secure and memorable.</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                We cannot recover your master password if you forget it.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>;
};
export default ChangeMasterPassword;