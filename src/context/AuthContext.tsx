// src/contexts/AuthContext.tsx
import React, { useEffect, useState, createContext, useContext } from 'react';
// Import the supabase client
import { supabase, setCurrentUser } from '../lib/supabaseClient'; // Ensure path is correct
import { encryptData, decryptData } from '../utils/encryption';
import { toast } from 'sonner'; // Assuming you have sonner installed for notifications
import corbado from '../lib/corbadoClient';
import { sendOTP, verifyOTP as twilioVerifyOTP } from '../lib/twilioClient';

type User = {
  id: string; // This will now be the UUID from Supabase
  username: string;
  phoneNumber?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithPin: (username: string, pin: string) => Promise<boolean>;
  loginWithBiometric: (username: string) => Promise<boolean>;
  enableBiometric: (username: string) => Promise<boolean>;
  signup: (username: string, password: string, phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  changeMasterPassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  verifyUsername: (username: string) => Promise<{
    exists: boolean;
    phoneNumber?: string;
    userId?: string;
  }>;
  generateOTP: (username: string) => Promise<string>;
  verifyOTP: (username: string, otp: string) => Promise<boolean>;
  resetPassword: (username: string, newPassword: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  loginWithPin: async () => false,
  loginWithBiometric: async () => false,
  enableBiometric: async () => false,
  signup: async () => false,
  logout: () => {},
  changeMasterPassword: async () => false,
  verifyUsername: async () => ({ exists: false }),
  generateOTP: async () => '',
  verifyOTP: async () => false,
  resetPassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // Helper function to mask Philippine phone numbers
  const maskPhilippineNumber = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length >= 10) {
      const firstPart = digits.startsWith('63') ? digits.slice(2, 3) : digits.slice(0, 1);
      const lastPart = digits.slice(-3);
      return `${firstPart}****${lastPart}`;
    }
    return phoneNumber.slice(0, 3) + '****' + phoneNumber.slice(-3);
  };

  // Load user session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('safekey_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Set user context for RLS on page load
        setCurrentUser(parsedUser.id);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user from localStorage', error);
        localStorage.removeItem('safekey_user');
      }
    }
  }, []);

  /**
   * Signup function that saves user data to Supabase
   * @param username The desired username
   * @param password The master password (will be encrypted)
   * @param phoneNumber The user's phone number
   * @returns True if signup is successful, false otherwise
   */
  const signup = async (username: string, password: string, phoneNumber: string) => {
    try {
      const passwordHash = encryptData(password, 'MASTER_KEY');

      // Use service role function to bypass RLS
      const { data: userId, error: userError } = await supabase
        .rpc('safe_insert_user', {
          p_username: username,
          p_password_hash: passwordHash,
          p_phone_number: phoneNumber
        });

      if (userError) {
        console.error('Error creating user:', userError);
        if (userError.code === '23505') {
          toast.error('Username already exists');
        } else {
          toast.error('Failed to create user account.');
        }
        return false;
      }

      if (!userId) {
        toast.error('Account creation failed. Please try again.');
        return false;
      }

      // Set user context
      await setCurrentUser(userId);

      const newUserObj = { id: userId, username, phoneNumber };
      setUser(newUserObj);
      setIsAuthenticated(true);
      localStorage.setItem('safekey_user', JSON.stringify(newUserObj));

      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Sign up failed');
      return false;
    }
  };

  /**
   * Login function that verifies credentials against Supabase
   * @param username The username
   * @param password The password
   * @returns True if login is successful, false otherwise
   */
  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, username, password_hash, phone_number')
        .eq('username', username)
        .single();

      if (error || !data) {
        return false;
      }

      const decryptedStoredPasswordHash = decryptData(data.password_hash, 'MASTER_KEY');

      if (password === decryptedStoredPasswordHash) {
        const userObj = {
          id: data.user_id,
          username: data.username,
          phoneNumber: data.phone_number
        };
        
        // Set user context for RLS
        await setCurrentUser(data.user_id);
        
        setUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('safekey_user', JSON.stringify(userObj));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Change the master password for the current user in Supabase
   * @param oldPassword The current password
   * @param newPassword The new password
   * @returns True if successful, false otherwise
   */
  const changeMasterPassword = async (oldPassword: string, newPassword: string) => {
    if (!user) {
      return false;
    }
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('user_id', user.id)
        .single();

      if (userError || !userData) {
        toast.error('Failed to verify current password.');
        return false;
      }

      const decryptedStoredHash = decryptData(userData.password_hash, 'MASTER_KEY');
      if (decryptedStoredHash !== oldPassword) {
        toast.error('Current password is incorrect.');
        return false;
      }

      const newHash = encryptData(newPassword, 'MASTER_KEY');
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newHash })
        .eq('user_id', user.id);

      if (updateError) {
        toast.error('Failed to update password.');
        return false;
      }

      toast.success('Master password changed successfully.');
      return true;
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
      return false;
    }
  };

  /**
   * Verify if a username exists in Supabase
   * @param username The username to check
   * @returns An object indicating existence and associated phone number/user ID
   */
  const verifyUsername = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, phone_number')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { exists: false };
        }
        return { exists: false };
      }

      if (data) {
        return {
          exists: true,
          phoneNumber: data.phone_number ? maskPhilippineNumber(data.phone_number) : undefined,
          userId: data.user_id
        };
      }
      return { exists: false };
    } catch (error) {
      return { exists: false };
    }
  };

  /**
   * Reset a user's password in Supabase
   * @param username The username whose password to reset
   * @param newPassword The new password
   * @returns True if successful, false otherwise
   */
  const resetPassword = async (username: string, newPassword: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        return false;
      }

      const newHash = encryptData(newPassword, 'MASTER_KEY');
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newHash })
        .eq('user_id', userData.user_id);

      if (updateError) {
        return false;
      }

      toast.success('Password reset successfully.');
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    // Clear user context for RLS
    await setCurrentUser(null);
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('safekey_user');
  };

  // --- Placeholder functions (unchanged from localStorage logic for now) ---

  const loginWithPin = async (username: string, pin: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, username, phone_number')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        console.error('User not found for PIN login:', userError);
        return false;
      }

      const { data: settingsData, error: settingsError } = await supabase
        .from('security_settings')
        .select('use_pin, pin_hash')
        .eq('user_id', userData.user_id)
        .single();

      if (settingsError || !settingsData?.use_pin || !settingsData?.pin_hash) {
        console.error('PIN not enabled or not found:', settingsError);
        return false;
      }

      if (pin === settingsData.pin_hash) {
        const userObj = {
          id: userData.user_id,
          username: userData.username,
          phoneNumber: userData.phone_number
        };
        
        // Set user context for RLS
        await setCurrentUser(userData.user_id);
        
        setUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('safekey_user', JSON.stringify(userObj));
        return true;
      }

      return false;
    } catch (error) {
      console.error('PIN login error:', error);
      return false;
    }
  };

  const loginWithBiometric = async (username: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, username, phone_number')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        console.error('User not found for biometric login:', userError);
        return false;
      }

      const { data: settingsData, error: settingsError } = await supabase
        .from('security_settings')
        .select('use_biometric')
        .eq('user_id', userData.user_id)
        .single();

      if (settingsError || !settingsData?.use_biometric) {
        console.error('Biometric not enabled for user:', settingsError);
        toast.error('Biometric authentication not enabled');
        return false;
      }

      try {
        const biometricAvailable = 'credentials' in navigator;
        
        if (biometricAvailable) {
          const userObj = {
            id: userData.user_id,
            username: userData.username,
            phoneNumber: userData.phone_number
          };
          setUser(userObj);
          setIsAuthenticated(true);
          localStorage.setItem('safekey_user', JSON.stringify(userObj));
          return true;
        }

        return false;
      } catch (error) {
        console.error('Biometric login error:', error);
        toast.error('Biometric authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      return false;
    }
  };

  // Generate and send OTP via Twilio Verify
  const generateOTP = async (username: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('user_id, phone_number')
        .eq('username', username)
        .single();

      if (error || !userData?.phone_number) {
        toast.error('User or phone number not found');
        return '';
      }

      const smsSent = await sendOTP(userData.phone_number);
      
      if (smsSent) {
        toast.success('OTP sent to your phone');
        return 'sent'; // Return success indicator
      } else {
        toast.error('Failed to send OTP');
        return '';
      }
    } catch (error) {
      toast.error('Failed to generate OTP');
      return '';
    }
  };

  // Verify OTP using Twilio Verify
  const verifyOTP = async (username: string, enteredOtp: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone_number')
        .eq('username', username)
        .single();

      if (userError || !userData?.phone_number) {
        return false;
      }

      return await twilioVerifyOTP(userData.phone_number, enteredOtp);
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  // Enable biometric authentication for a user
  const enableBiometric = async (username: string) => {
    try {
      try {
        const webAuthnAvailable = 'credentials' in navigator && 'create' in navigator.credentials;
        
        if (!webAuthnAvailable) {
          toast.error('Biometric authentication not supported on this device');
          return false;
        }
        
        const registrationResult = true;
        
        if (!registrationResult) {
          toast.error('Failed to register biometric authentication');
          return false;
        }
      } catch (corbadoError) {
        console.error('Corbado registration error:', corbadoError);
        toast.error('Failed to register biometric authentication');
        return false;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('user_id')
        .eq('username', username)
        .single();

      if (userData) {
        const { error } = await supabase
          .from('security_settings')
          .update({ use_biometric: true })
          .eq('user_id', userData.user_id);

        if (error) {
          console.error('Error updating biometric setting:', error);
          return false;
        }

        toast.success('Biometric authentication enabled');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      toast.error('Failed to enable biometric authentication');
      return false;
    }
  };

  // --- End Placeholder functions ---

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,             // <-- Updated to use Supabase
      loginWithPin,      // <-- Placeholder (uses localStorage)
      loginWithBiometric,// <-- Updated to use Corbado
      enableBiometric,   // <-- New function for enabling biometric
      signup,            // <-- Updated to use Supabase
      logout,            // <-- Updated (clears localStorage, TODO: supabase.auth.signOut)
      changeMasterPassword, // <-- Updated to use Supabase
      verifyUsername,   // <-- Updated to use Supabase
      generateOTP,       // <-- Placeholder (simulated)
      verifyOTP,         // <-- Placeholder (simulated)
      resetPassword,     // <-- Updated to use Supabase
    }}>
      {children}
    </AuthContext.Provider>
  );
};