import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobeIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon, TagIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { encryptData, generateStrongPassword, checkPasswordStrength } from '../utils/encryption';
import { toast } from 'sonner';
const AddPassword = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const passwordStrength = checkPasswordStrength(password);
  useEffect(() => {
    if (user) {
      // Load existing categories from passwords
      const storedPasswords = JSON.parse(localStorage.getItem(`safekey_passwords_${user.id}`) || '[]');
      const uniqueCategories = Array.from(new Set(storedPasswords.map((pw: any) => pw.category || '').filter(Boolean)));
      setCategories(uniqueCategories as string[]);
    }
  }, [user]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !password) {
      toast.error('Please provide at least a title and password');
      return;
    }
    if (passwordStrength.score < 2) {
      if (!window.confirm('This password is weak. Are you sure you want to save it?')) {
        return;
      }
    }
    try {
      // Encrypt the password
      const encryptedPassword = encryptData(password, 'MASTER_KEY');
      // Create new password entry
      const newPassword = {
        id: Date.now().toString(),
        title,
        website,
        username,
        password: encryptedPassword,
        notes,
        category: category || 'Uncategorized',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Get existing passwords and add the new one
      const existingPasswords = JSON.parse(localStorage.getItem(`safekey_passwords_${user?.id}`) || '[]');
      const updatedPasswords = [...existingPasswords, newPassword];
      // Save to localStorage
      localStorage.setItem(`safekey_passwords_${user?.id}`, JSON.stringify(updatedPasswords));
      toast.success('Password saved successfully!');
      navigate('/passwords');
    } catch (error) {
      toast.error('Failed to save password. Please try again.');
      console.error('Save password error:', error);
    }
  };
  const generatePassword = () => {
    setIsGeneratingPassword(true);
    setTimeout(() => {
      const newPassword = generateStrongPassword(12,
      // length
      true,
      // includeUppercase
      true,
      // includeLowercase
      true,
      // includeNumbers
      true // includeSpecial
      );
      setPassword(newPassword);
      setShowPassword(true);
      setIsGeneratingPassword(false);
    }, 500); // small delay to show loading state
  };
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
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Add New Password" />
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Title *
            </label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Facebook, Gmail, Bank Account" className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="website" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <GlobeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="website" type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g. www.facebook.com" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Username / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. john.doe@example.com" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
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
            <button type="button" onClick={generatePassword} disabled={isGeneratingPassword} className="mt-3 flex items-center justify-center w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">
              {isGeneratingPassword ? <RefreshCwIcon size={20} className="mr-2 animate-spin" /> : <RefreshCwIcon size={20} className="mr-2" />}
              Generate Strong Password
            </button>
          </div>
          <div>
            <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Social Media, Banking, Work" list="categories" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <datalist id="categories">
                {categories.map((cat, index) => <option key={index} value={cat} />)}
              </datalist>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Notes
            </label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any additional information" rows={3} className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors">
              Save Password
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddPassword;