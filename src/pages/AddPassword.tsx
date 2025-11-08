// src/pages/AddPassword.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobeIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon, TagIcon, RefreshCwIcon, AlertCircleIcon, CheckIcon, XIcon, EditIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { encryptData, generateStrongPassword, checkPasswordStrength } from '../utils/encryption';
import { toast } from 'sonner';
// 1. Import the Supabase client
import { supabase } from '../lib/supabaseClient'; // Ensure path is correct
import { generateAIPassword } from '../lib/huggingfaceClient';

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
  const [category, setCategory] = useState(''); // Stores the selected category NAME
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isGeneratingAIPassword, setIsGeneratingAIPassword] = useState(false);
  // State for categories fetched from Supabase
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
  const passwordStrength = checkPasswordStrength(password);

  // 2. Effect to load categories from Supabase on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (user) {
        try {
          console.log("Fetching categories for user:", user.id);
          // Fetch categories from Supabase for the current user
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('category_id, category_name') // Select ID and name
            .eq('user_id', user.id)
            .order('category_name'); // Order alphabetically

          if (categoriesError) {
            console.error('Error fetching categories from Supabase:', categoriesError);
            // Optionally, toast an error message
            // toast.error('Failed to load categories.');
            // Still allow proceeding, perhaps with only 'Uncategorized' option
            setCategories([]); // Or set a default like [{ id: 'uncategorized', name: 'Uncategorized' }]
            return;
          }

          // Map Supabase data to component state format
          const mappedCategories = (categoriesData || []).map(cat => ({
            id: cat.category_id,
            name: cat.category_name
          }));

          // Combine preset categories with user categories (avoid duplicates)
          const userCategoryNames = mappedCategories.map(cat => cat.name);
          const uniquePresets = presetCategories.filter(preset => !userCategoryNames.includes(preset));
          const presetCategoryObjects = uniquePresets.map(name => ({ id: `preset-${name}`, name }));
          
          setCategories([...presetCategoryObjects, ...mappedCategories]);
          console.log("Fetched categories from Supabase:", mappedCategories);

        } catch (err) {
          console.error('Unexpected error fetching categories:', err);
          // toast.error('Failed to load categories.');
          setCategories([]);
        }
      }
    };

    fetchCategories();
  }, [user]);

  // 3. Updated handleSubmit function to save to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to save a password.');
      return;
    }
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
      // 4. Encrypt the password
      const encryptedPassword = encryptData(password, 'MASTER_KEY');
      console.log("Encrypted password:", encryptedPassword);

      // 5. Resolve category name to category_id if a category is selected
      let categoryIdToInsert: string | null = null;
      if (category && category.trim() !== '') {
        const matchedCategory = categories.find(cat => cat.name === category.trim());
        if (matchedCategory && !matchedCategory.id.startsWith('preset-')) {
          // Existing user category
          categoryIdToInsert = matchedCategory.id;
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
          
          categoryIdToInsert = newCategoryId;
          // Update local categories list
          setCategories(prev => {
            // Remove preset version if it exists
            const filtered = prev.filter(cat => cat.name !== category.trim());
            return [...filtered, { id: newCategoryId, name: category.trim() }];
          });
        }
      }

      // 6. Prepare data for Supabase INSERT
      const passwordEntry = {
        user_id: user.id, // Associate with the current user
        category_id: categoryIdToInsert, // Use the resolved category ID, or null for Uncategorized
        platform_name: title, // Map 'title' to 'platform_name'
        username: username,
        password_value: encryptedPassword, // Map 'password' (encrypted) to 'password_value'
        url: website || null, // Map 'website' to 'url', allow null
        notes: notes || null // Allow null for notes
        // created_at and updated_at are handled by default in Supabase
      };
      console.log("Password entry prepared for Supabase:", passwordEntry);

      // 7. Insert the password entry using service function
      console.log("Attempting to insert password into Supabase...");
      const { data, error } = await supabase
        .rpc('safe_insert_password', {
          p_user_id: user.id,
          p_category_id: categoryIdToInsert,
          p_platform_name: title,
          p_username: username,
          p_password_value: encryptedPassword,
          p_url: website || null,
          p_notes: notes || null
        });

      console.log("Supabase password insert response - Data:", data, "Error:", error);

      if (error) {
        console.error('Error saving password to Supabase:', error);
        toast.error(`Failed to save password: ${error.message || 'Unknown error'}`);
        return; // Stop execution if there's an error
      }

      // 8. Success: Update UI and navigate
      console.log("Password saved successfully to Supabase");
      toast.success('Password saved successfully!');
      // Clear form fields after successful save (optional)
      setTitle('');
      setWebsite('');
      setUsername('');
      setPassword('');
      setNotes('');
      setCategory('');
      navigate('/passwords'); // Navigate back to passwords list

    } catch (error) {
      console.error('Unexpected error saving password:', error);
      toast.error('Failed to save password due to an unexpected error. Please try again.');
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
            <div className="mt-3 space-y-2">
              <button type="button" onClick={generatePassword} disabled={isGeneratingPassword} className="flex items-center justify-center w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">
                {isGeneratingPassword ? <RefreshCwIcon size={20} className="mr-2 animate-spin" /> : <RefreshCwIcon size={20} className="mr-2" />}
                Generate Strong Password
              </button>
              <button type="button" onClick={generateAIPasswordHandler} disabled={isGeneratingAIPassword} className="flex items-center justify-center w-full bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600 text-blue-800 dark:text-blue-200 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                {isGeneratingAIPassword ? <RefreshCwIcon size={20} className="mr-2 animate-spin" /> : <RefreshCwIcon size={20} className="mr-2" />}
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
              {/* 9. Updated category input to use state and datalist */}
              <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Select or type a category" list="categories" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              {/* 10. Populate datalist with categories fetched from Supabase */}
              <datalist id="categories">
                {/* Map fetched categories */}
                {categories.map((cat) => <option key={cat.id} value={cat.name} />)}
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