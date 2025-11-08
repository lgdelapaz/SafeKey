import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GlobeIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  TagIcon,
  RefreshCwIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import {
  encryptData,
  decryptData,
  generateStrongPassword,
  checkPasswordStrength,
} from '../utils/encryption';
import { toast } from 'sonner';
import { supabase, setCurrentUser } from '../lib/supabaseClient';
import { generateAIPassword } from '../lib/huggingfaceClient';

const EditPassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [title, setTitle] = useState('');
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isGeneratingAIPassword, setIsGeneratingAIPassword] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  // Preset categories
  const presetCategories = [
    'Social Media',
    'Banking', 
    'Email',
    'Work',
    'Shopping',
    'Entertainment',
    'Gaming',
    'Education',
    'Health',
    'Travel'
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [passwordNotFound, setPasswordNotFound] = useState(false);
  
  const passwordStrength = checkPasswordStrength(password);

  // Load password data and categories
  useEffect(() => {
    const loadData = async () => {
      if (!user || !id) return;

      try {
        // Ensure user context is set for RLS
        await setCurrentUser(user.id);
        
        // Load password data using service function
        const { data: passwordDataArray, error: passwordError } = await supabase
          .rpc('get_single_password', {
            p_password_id: id,
            p_user_id: user.id
          });
          
        const passwordData = passwordDataArray && passwordDataArray.length > 0 ? passwordDataArray[0] : null;

        if (passwordError || !passwordData) {
          setPasswordNotFound(true);
          toast.error('Password not found');
          setIsLoading(false);
          return;
        }

        // Set form data
        setTitle(passwordData.platform_name);
        setWebsite(passwordData.url || '');
        setUsername(passwordData.username || '');
        
        // Decrypt password with error handling
        try {
          const decryptedPassword = decryptData(passwordData.password_value, 'MASTER_KEY');
          setPassword(decryptedPassword);
        } catch (error) {
          console.error('Error decrypting password:', error);
          setPassword('[Decryption Error]');
        }
        
        setNotes(passwordData.notes || '');
        
        // Handle category from service function response
        setCategory(passwordData.category_name || '');

        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('category_id, category_name')
          .eq('user_id', user.id)
          .order('category_name');

        if (!categoriesError && categoriesData) {
          const mappedCategories = categoriesData.map(cat => ({
            id: cat.category_id,
            name: cat.category_name
          }));
          
          // Combine preset categories with user categories (avoid duplicates)
          const userCategoryNames = mappedCategories.map(cat => cat.name);
          const uniquePresets = presetCategories.filter(preset => !userCategoryNames.includes(preset));
          const presetCategoryObjects = uniquePresets.map(name => ({ id: `preset-${name}`, name }));
          
          setCategories([...presetCategoryObjects, ...mappedCategories]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading password:', error);
        toast.error('Failed to load password');
        setIsLoading(false);
        setPasswordNotFound(true);
      }
    };

    loadData();
  }, [user, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

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
      const encryptedPassword = encryptData(password, 'MASTER_KEY');

      // Handle category
      let categoryIdToUpdate: string | null = null;
      if (category && category.trim() !== '') {
        const matchedCategory = categories.find(cat => cat.name === category.trim());
        if (matchedCategory && !matchedCategory.id.startsWith('preset-')) {
          // Existing user category
          categoryIdToUpdate = matchedCategory.id;
        } else {
          // Create new category using service function
          const { data: newCategoryId, error: categoryError } = await supabase
            .rpc('safe_insert_category', {
              p_user_id: user.id,
              p_category_name: category.trim()
            });
          
          if (categoryError) {
            console.error('Error creating category:', categoryError);
            toast.error('Failed to create category');
            return;
          }
          
          categoryIdToUpdate = newCategoryId;
          setCategories(prev => {
            // Remove preset version if it exists
            const filtered = prev.filter(cat => cat.name !== category.trim());
            return [...filtered, { id: newCategoryId, name: category.trim() }];
          });
        }
      }

      // Update password using service function
      const { data: updateSuccess, error } = await supabase
        .rpc('safe_update_password', {
          p_password_id: id,
          p_user_id: user.id,
          p_platform_name: title,
          p_username: username,
          p_password_value: encryptedPassword,
          p_url: website || null,
          p_notes: notes || null,
          p_category_id: categoryIdToUpdate
        });

      if (error || !updateSuccess) {
        console.error('Error updating password:', error);
        toast.error('Failed to update password');
        return;
      }

      toast.success('Password updated successfully!');
      navigate('/passwords');
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Failed to update password. Please try again.');
    }
  };

  const generatePassword = () => {
    setIsGeneratingPassword(true);
    setTimeout(() => {
      const newPassword = generateStrongPassword(12, true, true, true, true);
      setPassword(newPassword);
      setShowPassword(true);
      setIsGeneratingPassword(false);
    }, 500);
  };

  const generateAIPasswordHandler = async () => {
    setIsGeneratingAIPassword(true);
    try {
      const aiPassword = await generateAIPassword();
      setPassword(aiPassword);
      setShowPassword(true);
      toast.success('AI password generated!');
    } catch (error) {
      toast.error('Failed to generate AI password');
    } finally {
      setIsGeneratingAIPassword(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength.score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Enter a password';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header title="Edit Password" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (passwordNotFound) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header title="Edit Password" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Password not found
            </p>
            <button
              onClick={() => navigate('/passwords')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Back to Passwords
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Edit Password" />
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Facebook, Gmail, Bank Account"
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <GlobeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. www.facebook.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. john.doe@example.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
            
            {password && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className={`h-2.5 rounded-full ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={passwordStrength.score >= 3 ? 'text-green-500' : 'text-gray-500'}>
                    {getStrengthText()}
                  </span>
                  {passwordStrength.feedback && (
                    <span className="text-orange-500 flex items-center">
                      <AlertCircleIcon size={14} className="mr-1" />
                      {passwordStrength.feedback}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={generatePassword}
                disabled={isGeneratingPassword}
                className="flex items-center justify-center w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              >
                {isGeneratingPassword ? (
                  <RefreshCwIcon size={20} className="mr-2 animate-spin" />
                ) : (
                  <RefreshCwIcon size={20} className="mr-2" />
                )}
                Generate Strong Password
              </button>
              <button
                type="button"
                onClick={generateAIPasswordHandler}
                disabled={isGeneratingAIPassword}
                className="flex items-center justify-center w-full bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600 text-blue-800 dark:text-blue-200 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                {isGeneratingAIPassword ? (
                  <RefreshCwIcon size={20} className="mr-2 animate-spin" />
                ) : (
                  <RefreshCwIcon size={20} className="mr-2" />
                )}
                Generate AI Password
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or type a category"
                list="categories"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-gray-700 dark:text-gray-300 text-lg mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information"
              rows={3}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => navigate('/passwords')}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;