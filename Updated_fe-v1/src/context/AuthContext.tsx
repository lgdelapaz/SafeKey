import React, { useEffect, useState, createContext, useContext } from 'react';
import { encryptData, decryptData } from '../utils/encryption';
type User = {
  id: string;
  username: string;
};
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changeMasterPassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
};
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  changeMasterPassword: async () => false
});
export const useAuth = () => useContext(AuthContext);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check local storage for saved user session
    const savedUser = localStorage.getItem('safekey_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('safekey_user');
      }
    }
  }, []);
  const login = async (username: string, password: string) => {
    // In a real app, this would validate against a server
    // For demo, we'll check if the user exists in localStorage
    try {
      const users = JSON.parse(localStorage.getItem('safekey_users') || '[]');
      const foundUser = users.find((u: any) => u.username === username);
      if (foundUser) {
        // Decrypt the stored password and check
        const decryptedPassword = decryptData(foundUser.password, 'MASTER_KEY');
        if (decryptedPassword === password) {
          const userObj = {
            id: foundUser.id,
            username: foundUser.username
          };
          setUser(userObj);
          setIsAuthenticated(true);
          localStorage.setItem('safekey_user', JSON.stringify(userObj));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };
  const signup = async (username: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('safekey_users') || '[]');
      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        return false;
      }
      // Encrypt password
      const encryptedPassword = encryptData(password, 'MASTER_KEY');
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password: encryptedPassword
      };
      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('safekey_users', JSON.stringify(users));
      // Auto login
      const userObj = {
        id: newUser.id,
        username: newUser.username
      };
      setUser(userObj);
      setIsAuthenticated(true);
      localStorage.setItem('safekey_user', JSON.stringify(userObj));
      return true;
    } catch (error) {
      console.error('Signup error', error);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('safekey_user');
  };
  const changeMasterPassword = async (oldPassword: string, newPassword: string) => {
    if (!user) return false;
    try {
      const users = JSON.parse(localStorage.getItem('safekey_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex >= 0) {
        // Verify old password
        const decryptedPassword = decryptData(users[userIndex].password, 'MASTER_KEY');
        if (decryptedPassword !== oldPassword) {
          return false;
        }
        // Update with new password
        const encryptedNewPassword = encryptData(newPassword, 'MASTER_KEY');
        users[userIndex].password = encryptedNewPassword;
        // Save updated users
        localStorage.setItem('safekey_users', JSON.stringify(users));
        // Need to re-encrypt all passwords with the new master password in a real app
        // This would involve decrypting with old password and re-encrypting with new
        return true;
      }
      return false;
    } catch (error) {
      console.error('Change password error', error);
      return false;
    }
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    changeMasterPassword
  }}>
      {children}
    </AuthContext.Provider>;
};