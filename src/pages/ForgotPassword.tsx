import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, PhoneIcon, KeyIcon, ArrowLeftIcon, SendIcon, ShieldIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { checkPasswordStrength } from '../utils/encryption';
const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Username, 2: OTP, 3: New Password
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const {
    verifyUsername,
    generateOTP,
    verifyOTP,
    resetPassword
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
  // Format the masked phone number in Philippine format
  const formatMaskedPhone = (maskedNumber: string) => {
    if (maskedNumber && maskedNumber.includes('****')) {
      // If it's already in our masked format, we'll format it to look like +63 9XX **** XXX
      const parts = maskedNumber.split('****');
      if (parts.length === 2) {
        const prefix = parts[0];
        const suffix = parts[1];
        return `+63 ${prefix.slice(-1)}XX **** ${suffix}`;
      }
    }
    return maskedNumber;
  };
  // Step 1: Verify username and get phone number
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username');
      return;
    }
    setIsLoading(true);
    try {
      const result = await verifyUsername(username);
      if (result.exists && result.phoneNumber) {
        setMaskedPhone(formatMaskedPhone(result.phoneNumber));
        setStep(2);
        // Generate and "send" OTP
        await generateOTP(username);
        toast.success(`OTP sent to ${formatMaskedPhone(result.phoneNumber)}`);
      } else {
        toast.error('Username not found or no phone number registered');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP sent to your phone');
      return;
    }
    setIsLoading(true);
    try {
      const isValid = await verifyOTP(username, otp);
      if (isValid) {
        setStep(3);
      } else {
        toast.error('Invalid or expired OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Step 3: Reset password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength.score < 2) {
      toast.error('Please use a stronger password. ' + passwordStrength.feedback);
      return;
    }
    setIsLoading(true);
    try {
      const success = await resetPassword(username, newPassword);
      if (success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error('Password reset failed. Please try again.');
      }
    } catch (error) {
      toast.error('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Resend OTP
  const handleResendOTP = async () => {
    try {
      await generateOTP(username);
      toast.success(`New OTP sent to ${maskedPhone}`);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };
  return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {step === 1 && 'Enter your username to start the recovery process'}
              {step === 2 && 'Enter the verification code sent to your phone'}
              {step === 3 && 'Create a new strong password'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Step 1: Username Verification */}
            {step === 1 && <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your username" />
                  </div>
                </div>
                <div>
                  <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors flex items-center justify-center">
                    {isLoading ? 'Verifying...' : 'Continue'}
                    {!isLoading && <SendIcon size={18} className="ml-2" />}
                  </button>
                </div>
              </form>}
            {/* Step 2: OTP Verification */}
            {step === 2 && <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-blue-700 dark:text-blue-300 text-center">
                    We've sent a verification code to {maskedPhone}
                  </p>
                </div>
                <div>
                  <label htmlFor="otp" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <ShieldIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-widest text-center" placeholder="Enter 6-digit code" maxLength={6} />
                  </div>
                </div>
                <div>
                  <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors">
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <button type="button" onClick={handleResendOTP} className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                    Didn't receive the code? Resend
                  </button>
                </div>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep(1)} className="text-gray-600 dark:text-gray-400 hover:underline flex items-center justify-center mx-auto">
                    <ArrowLeftIcon size={16} className="mr-1" /> Back
                  </button>
                </div>
              </form>}
            {/* Step 3: New Password */}
            {step === 3 && <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label htmlFor="new-password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="new-password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Create a strong password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
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
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm your password" />
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && <p className="mt-1 text-red-500 text-sm">
                        Passwords do not match
                      </p>}
                </div>
                <div>
                  <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors">
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </div>
              </form>}
            <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ForgotPassword;