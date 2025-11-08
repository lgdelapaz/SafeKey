import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LockIcon, UserIcon, FingerprintIcon, KeyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('password'); // 'password', 'pin', or 'biometric'
  const [userSecuritySettings, setUserSecuritySettings] = useState<{
    useBiometric: boolean;
    usePin: boolean;
  } | null>(null);
  const {
    login,
    loginWithPin,
    loginWithBiometric,
    verifyUsername
  } = useAuth();
  const navigate = useNavigate();
  // Check available auth methods when username changes
  useEffect(() => {
    const checkAuthMethods = async () => {
      if (username) {
        try {
          const { exists, userId } = await verifyUsername(username);
          if (exists && userId) {
            // Load user security settings from Supabase
            const { data, error } = await supabase
              .from('security_settings')
              .select('use_biometric, use_pin')
              .eq('user_id', userId)
              .single();

            if (error) {
              console.error('Error loading security settings:', error);
              setUserSecuritySettings({ useBiometric: false, usePin: false });
              setAuthMethod('password');
              return;
            }

            const settings = {
              useBiometric: data?.use_biometric || false,
              usePin: data?.use_pin || false
            };
            
            setUserSecuritySettings(settings);
            
            // Set initial auth method based on available methods
            if (settings.useBiometric) {
              setAuthMethod('biometric');
            } else if (settings.usePin) {
              setAuthMethod('pin');
            } else {
              setAuthMethod('password');
            }
          } else {
            setUserSecuritySettings(null);
            setAuthMethod('password');
          }
        } catch (error) {
          console.error('Error checking auth methods:', error);
          setUserSecuritySettings(null);
          setAuthMethod('password');
        }
      } else {
        setUserSecuritySettings(null);
        setAuthMethod('password');
      }
    };
    checkAuthMethods();
  }, [username, verifyUsername]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username');
      return;
    }
    setIsLoading(true);
    try {
      let success = false;
      switch (authMethod) {
        case 'password':
          if (!password) {
            toast.error('Please enter your master password');
            setIsLoading(false);
            return;
          }
          success = await login(username, password);
          break;
        case 'pin':
          if (!pin) {
            toast.error('Please enter your PIN');
            setIsLoading(false);
            return;
          }
          success = await loginWithPin(username, pin);
          break;
        case 'biometric':
          success = await loginWithBiometric(username);
          break;
        default:
          toast.error('Invalid authentication method');
          break;
      }
      if (success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        if (authMethod === 'password') {
          toast.error('Invalid username or password');
        } else if (authMethod === 'pin') {
          toast.error('Invalid PIN code');
        } else {
          toast.error('Authentication failed');
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleBiometricAuth = async () => {
    if (!username) {
      toast.error('Please enter your username first');
      return;
    }
    setIsLoading(true);
    try {
      const success = await loginWithBiometric(username);
      if (success) {
        toast.success('Biometric authentication successful!');
        navigate('/');
      } else {
        toast.error('Biometric authentication failed');
      }
    } catch (error) {
      toast.error('Biometric authentication error');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              SafeKey
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Password Vault for Seniors
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
                  <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your username" />
                </div>
              </div>
              {/* Authentication method selector - only show if user exists and has security settings */}
              {userSecuritySettings && <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    Login Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button type="button" onClick={() => setAuthMethod('password')} className={`flex items-center justify-center px-4 py-3 rounded-lg border ${authMethod === 'password' ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                      <LockIcon className="h-5 w-5 mr-2" />
                      <span>Password</span>
                    </button>
                    {userSecuritySettings.usePin && <button type="button" onClick={() => setAuthMethod('pin')} className={`flex items-center justify-center px-4 py-3 rounded-lg border ${authMethod === 'pin' ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                        <KeyIcon className="h-5 w-5 mr-2" />
                        <span>PIN</span>
                      </button>}
                    {userSecuritySettings.useBiometric && <button type="button" onClick={() => setAuthMethod('biometric')} className={`flex items-center justify-center px-4 py-3 rounded-lg border ${authMethod === 'biometric' ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                        <FingerprintIcon className="h-5 w-5 mr-2" />
                        <span>Biometric</span>
                      </button>}
                  </div>
                </div>}
              {/* Conditional rendering based on selected auth method */}
              {authMethod === 'password' && <div>
                  <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    Master Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your master password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>}
              {authMethod === 'pin' && <div>
                  <label htmlFor="pin" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
                    PIN Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="pin" type="password" inputMode="numeric" pattern="[0-9]*" maxLength={8} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your PIN code" autoComplete="off" />
                  </div>
                </div>}
              {authMethod === 'biometric' && <div className="flex flex-col items-center py-4">
                  <button type="button" onClick={handleBiometricAuth} className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                    <FingerprintIcon className="h-12 w-12" />
                  </button>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Tap to authenticate with biometrics
                  </p>
                </div>}
              <div>
                <button type="submit" disabled={isLoading || authMethod === 'biometric'} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors ${isLoading || authMethod === 'biometric' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                Forgot password?
              </Link>
            </div>
            <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Login;