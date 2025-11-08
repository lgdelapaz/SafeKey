// src/pages/ViewPasswords.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, EditIcon, TrashIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { decryptData } from '../utils/encryption';
import { toast } from 'sonner';
// 1. Import the Supabase client
import { supabase, setCurrentUser } from '../lib/supabaseClient'; // Ensure path is correct

// 2. Define the Password type based on the Supabase schema and joined data
interface Password {
  password_id: string;
  user_id: string;
  category_id: string | null;
  platform_name: string;
  username: string;
  password_value: string;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  categories: {
    category_name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

const ViewPasswords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 3. State for passwords fetched from Supabase
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // State for showing/hiding passwords
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  
  // State for categories (for filtering)
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All Categories' },
    { id: 'uncategorized', name: 'Uncategorized' }
  ]);

  // 4. Effect to load passwords from Supabase
  useEffect(() => {
    const fetchPasswords = async (): Promise<void> => {
      if (!user?.id) {
        console.log("No user ID available, skipping password fetch.");
        setPasswords([]);
        setFilteredPasswords([]);
        return;
      }

      try {
        console.log("Attempting to fetch passwords for user ID:", user.id);
        
        // Ensure user context is set for RLS
        await setCurrentUser(user.id);
        
        // 5. Fetch passwords using service function to bypass RLS
        const { data: passwordsData, error: passwordsError } = await supabase
          .rpc('get_user_passwords', {
            p_user_id: user.id
          });

        if (passwordsError) {
          console.error('Error fetching passwords from Supabase:', passwordsError);
          console.error('Error details:', {
            code: passwordsError.code,
            message: passwordsError.message,
            details: passwordsError.details
          });
          toast.error(`Failed to load passwords: ${passwordsError.message}`);
          return;
        }

        console.log("Fetched passwords data from Supabase:", passwordsData);
        console.log("Number of passwords found:", passwordsData?.length || 0);
        
        if (passwordsData) {
          // Transform service function response to match Password interface
          const transformedPasswords = passwordsData.map((pw: any) => ({
            ...pw,
            categories: pw.category_name ? { category_name: pw.category_name } : null
          }));
          
          setPasswords(transformedPasswords);
          setFilteredPasswords(transformedPasswords);
          
          // Update categories based on fetched data
          const uniqueCategoryNames = Array.from(
            new Set(
              passwordsData
                .map((pw: any) => pw.category_name)
                .filter((name: string | null) => name !== null && name !== undefined)
            )
          ) as string[];
          
          // Update categories state for filter dropdown
          setCategories([
            { id: 'all', name: 'All Categories' },
            { id: 'uncategorized', name: 'Uncategorized' },
            ...uniqueCategoryNames.map((name: string) => ({ id: name, name }))
          ]);
        }

      } catch (err) {
        console.error('Unexpected error fetching passwords:', err);
        toast.error('An unexpected error occurred while loading passwords.');
      }
    };

    fetchPasswords();
  }, [user?.id]);

  // 9. Effect to update filteredPasswords based on search and category
  useEffect(() => {
    let result: Password[] = [...passwords];

    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'uncategorized') {
        result = result.filter(pw => !pw.categories);
      } else {
        result = result.filter(pw => pw.categories?.category_name === selectedCategory);
      }
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pw =>
        pw.platform_name.toLowerCase().includes(term) ||
        (pw.url && pw.url.toLowerCase().includes(term)) ||
        pw.username.toLowerCase().includes(term)
      );
    }

    setFilteredPasswords(result);
  }, [passwords, searchTerm, selectedCategory]);

  // 10. Function to toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-password/${id}`);
  };

  // 12. Function to handle delete
  const handleDelete = async (id: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        console.log("Attempting to delete password with ID:", id);
        
        const { data: deleteSuccess, error } = await supabase
          .rpc('safe_delete_password', {
            p_password_id: id,
            p_user_id: user.id
          });

        if (error || !deleteSuccess) {
          console.error('Error deleting password from Supabase:', error);
          toast.error('Failed to delete password.');
          return;
        }

        const updatedPasswords = passwords.filter(pw => pw.password_id !== id);
        setPasswords(updatedPasswords);
        setFilteredPasswords(updatedPasswords);
        toast.success('Password deleted successfully');

      } catch (err) {
        console.error('Unexpected error during password deletion:', err);
        toast.error('An unexpected error occurred while deleting the password.');
      }
    }
  };

  // 15. Function to decrypt password value
  const decryptPassword = (encryptedPassword: string) => {
    try {
      return decryptData(encryptedPassword, 'MASTER_KEY');
    } catch (e) {
      console.error("Failed to decrypt password:", e);
      return "[Decryption Error]";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Your Passwords" />
      <div className="p-4">
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <div className="mr-2">
              <FilterIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password List */}
        {filteredPasswords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {passwords.length === 0 ? "You haven't saved any passwords yet." : 'No passwords match your search.'}
            </p>
            {passwords.length === 0 && (
              <button
                onClick={() => navigate('/add-password')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors"
              >
                Add Your First Password
              </button>
            )}
          </div>
        ) : (
          filteredPasswords.map((pw) => (
            <div key={pw.password_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{pw.platform_name}</h3>
                  {pw.url && <p className="text-gray-500 dark:text-gray-400">{pw.url}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pw.password_id)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"
                    aria-label="Edit"
                  >
                    <EditIcon size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(pw.password_id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                    aria-label="Delete"
                  >
                    <TrashIcon size={20} />
                  </button>
                  <button
                    onClick={() => togglePasswordVisibility(pw.password_id)}
                    className="text-blue-600 dark:text-blue-400"
                    aria-label={visiblePasswords[pw.password_id] ? "Hide Password" : "Show Password"}
                  >
                    {visiblePasswords[pw.password_id] ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Username/Email</p>
                  <p className="text-lg text-gray-800 dark:text-white">{pw.username}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Password</p>
                  <p className="text-lg text-gray-800 dark:text-white font-medium break-all">
                    {visiblePasswords[pw.password_id] ? decryptPassword(pw.password_value) : '••••••••••'}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Created: {new Date(pw.created_at).toLocaleDateString()}</span>
                  <span>Category: {pw.categories?.category_name || 'Uncategorized'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewPasswords;