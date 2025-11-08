import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, KeyIcon, ShieldIcon, HelpCircleIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAutoLock } from '../utils/autoLock';
import { supabase, setCurrentUser } from '../lib/supabaseClient';
const Home = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [passwordCount, setPasswordCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [autoLockMinutes, setAutoLockMinutes] = useState(5);
  
  // Load auto-lock setting from Supabase
  useEffect(() => {
    const loadAutoLockSetting = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('security_settings')
            .select('auto_lock_timer')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            setAutoLockMinutes(data.auto_lock_timer || 5);
          }
        } catch (error) {
          console.error('Error loading auto-lock setting:', error);
        }
      }
    };

    loadAutoLockSetting();
  }, [user]);

  // Initialize auto-lock
  useAutoLock(autoLockMinutes);
  useEffect(() => {
    const loadPasswordStats = async () => {
      if (user) {
        try {
          // Ensure user context is set for RLS
          await setCurrentUser(user.id);
          
          // Get password stats using service function
          const { data, error } = await supabase
            .rpc('get_password_stats', {
              p_user_id: user.id
            });

          if (error) {
            console.error('Error loading password stats:', error);
            setPasswordCount(0);
            setLastUpdated(null);
            return;
          }

          if (data && data.length > 0) {
            const stats = data[0];
            setPasswordCount(Number(stats.password_count) || 0);
            
            if (stats.last_updated) {
              const mostRecent = new Date(stats.last_updated);
              setLastUpdated(mostRecent.toLocaleDateString());
            } else {
              setLastUpdated(null);
            }
          } else {
            setPasswordCount(0);
            setLastUpdated(null);
          }
        } catch (error) {
          console.error('Error loading password stats:', error);
          setPasswordCount(0);
          setLastUpdated(null);
        }
      }
    };

    loadPasswordStats();
  }, [user]);
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-blue-600 dark:bg-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold">SafeKey</h1>
        <p className="text-lg mt-1">Welcome, {user?.username || 'User'}</p>
      </header>
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Your Vault
            </h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <KeyIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Stored Passwords
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {passwordCount}
                  </p>
                </div>
              </div>
              {lastUpdated && <div className="text-right">
                  <p className="text-gray-500 dark:text-gray-400">
                    Last Updated
                  </p>
                  <p className="text-lg text-gray-800 dark:text-white">
                    {lastUpdated}
                  </p>
                </div>}
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate('/add-password')} className="flex flex-col items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-6 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <PlusIcon className="h-10 w-10 mb-2" />
                <span className="text-lg font-medium">Add Password</span>
              </button>
              <button onClick={() => navigate('/passwords')} className="flex flex-col items-center justify-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-6 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                <KeyIcon className="h-10 w-10 mb-2" />
                <span className="text-lg font-medium">View Passwords</span>
              </button>
              <button onClick={() => navigate('/security-settings')} className="flex flex-col items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-6 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                <ShieldIcon className="h-10 w-10 mb-2" />
                <span className="text-lg font-medium">Security</span>
              </button>
              <button onClick={() => navigate('/tutorial')} className="flex flex-col items-center justify-center bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 p-6 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                <HelpCircleIcon className="h-10 w-10 mb-2" />
                <span className="text-lg font-medium">Tutorial</span>
              </button>
            </div>
          </div>
          {/* Security Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Security Tips
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircleIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">
                  Never share your master password with anyone.
                </p>
              </div>
              <div className="flex items-start">
                <AlertCircleIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">
                  Use different passwords for different accounts.
                </p>
              </div>
              <div className="flex items-start">
                <AlertCircleIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">
                  Update your passwords regularly for better security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Home;