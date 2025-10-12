import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, EditIcon, TrashIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { decryptData } from '../utils/encryption';
import { toast } from 'sonner';
type Password = {
  id: string;
  title: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  category: string;
};
const ViewPasswords = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    if (user) {
      // Load passwords from localStorage
      const storedPasswords = JSON.parse(localStorage.getItem(`safekey_passwords_${user.id}`) || '[]');
      setPasswords(storedPasswords);
      setFilteredPasswords(storedPasswords);
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(storedPasswords.map((pw: Password) => pw.category || 'Uncategorized')));
      setCategories(['all', ...uniqueCategories]);
    }
  }, [user]);
  useEffect(() => {
    let result = passwords;
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(pw => (pw.category || 'Uncategorized') === selectedCategory);
    }
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pw => pw.title.toLowerCase().includes(term) || pw.website.toLowerCase().includes(term) || pw.username.toLowerCase().includes(term));
    }
    setFilteredPasswords(result);
  }, [passwords, searchTerm, selectedCategory]);
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const handleEdit = (id: string) => {
    navigate(`/edit-password/${id}`);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      const updatedPasswords = passwords.filter(pw => pw.id !== id);
      setPasswords(updatedPasswords);
      localStorage.setItem(`safekey_passwords_${user?.id}`, JSON.stringify(updatedPasswords));
      toast.success('Password deleted successfully');
    }
  };
  const decryptPassword = (encryptedPassword: string) => {
    return decryptData(encryptedPassword, 'MASTER_KEY');
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Your Passwords" />
      <div className="p-4">
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search passwords..." className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-center">
            <FilterIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {categories.map(category => <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>)}
            </select>
          </div>
        </div>
        {/* Password List */}
        <div className="space-y-4">
          {filteredPasswords.length === 0 ? <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {passwords.length === 0 ? "You haven't saved any passwords yet." : 'No passwords match your search.'}
              </p>
              {passwords.length === 0 && <button onClick={() => navigate('/add-password')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg transition-colors">
                  Add Your First Password
                </button>}
            </div> : filteredPasswords.map(pw => <div key={pw.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {pw.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {pw.website}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(pw.id)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full">
                      <EditIcon size={20} />
                    </button>
                    <button onClick={() => handleDelete(pw.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Username/Email
                    </p>
                    <p className="text-lg text-gray-800 dark:text-white font-medium">
                      {pw.username}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Password
                      </p>
                      <button onClick={() => togglePasswordVisibility(pw.id)} className="text-blue-600 dark:text-blue-400">
                        {visiblePasswords[pw.id] ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                    </div>
                    <p className="text-lg text-gray-800 dark:text-white font-medium">
                      {visiblePasswords[pw.id] ? decryptPassword(pw.password) : '••••••••••'}
                    </p>
                  </div>
                  {pw.notes && <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Notes
                      </p>
                      <p className="text-gray-800 dark:text-white">
                        {pw.notes}
                      </p>
                    </div>}
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>
                      Created: {new Date(pw.createdAt).toLocaleDateString()}
                    </span>
                    <span>{pw.category || 'Uncategorized'}</span>
                  </div>
                </div>
              </div>)}
        </div>
        {/* Add Button */}
        <div className="fixed bottom-20 right-4">
          <button onClick={() => navigate('/add-password')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            <span className="text-2xl">+</span>
          </button>
        </div>
      </div>
    </div>;
};
export default ViewPasswords;