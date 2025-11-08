import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LockIcon, UserIcon, AlertCircleIcon, PhoneIcon } from 'lucide-react';
import { toast } from 'sonner';
import { checkPasswordStrength } from '../utils/encryption';
const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    signup
  } = useAuth();
  const navigate = useNavigate();
  const passwordStrength = checkPasswordStrength(password);
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
  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Handle different input formats
    if (digits.startsWith('63') && digits.length > 2) {
      return `+63 ${digits.slice(2)}`;
    } else if (digits.startsWith('0') && digits.length > 1) {
      return `+63 ${digits.slice(1)}`;
    } else if (digits) {
      return `+63 ${digits}`;
    }
    return '';
  };
  // Get raw phone number for validation and storage
  const getRawPhoneNumber = (formatted: string) => {
    const digits = formatted.replace(/\D/g, '');
    if (digits.startsWith('63')) {
      return digits;
    } else {
      return `63${digits}`;
    }
  };
  // Validate Philippine phone number format
  const isValidPhilippineNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    // Check if it's a valid Philippine mobile number format
    // Should be 63 + 10 digits starting with 9 (639XXXXXXXXX)
    return /^63\d{10}$/.test(digits) && digits.slice(2, 3) === '9';
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength.score < 2) {
      toast.error('Please use a stronger password. ' + passwordStrength.feedback);
      return;
    }
    const rawPhoneNumber = getRawPhoneNumber(phoneNumber);
    if (!phoneNumber || phoneNumber === '+63 ') {
      toast.error('Please enter your phone number');
      return;
    }
    if (!isValidPhilippineNumber(rawPhoneNumber)) {
      toast.error('Please enter a valid Philippine mobile number (e.g., +63 9XX XXX XXXX)');
      return;
    }
    setIsLoading(true);
    try {
      const success = await signup(username, password, rawPhoneNumber);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error('Username already exists');
      }
    } catch (error) {
      toast.error('Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Sign up for SafeKey
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Choose a username" />
                </div>
              </div>
              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="phoneNumber" type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+63 9XX XXX XXXX" />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Philippine mobile number starting with +63
                </p>
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Create a strong password" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password && <div className="mt-2">
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
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm your password" />
                </div>
                {password && confirmPassword && password !== confirmPassword && <p className="mt-1 text-red-500 text-sm">
                      Passwords do not match
                    </p>}
              </div>
              <div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Already have an account?{' '}
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
export default SignUp;