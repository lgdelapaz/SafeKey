import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldIcon, KeyIcon, EyeIcon, ClockIcon, SettingsIcon, TypeIcon, MoonIcon, PaletteIcon, HelpCircleIcon, InfoIcon, UsersIcon, PhoneIcon, FileTextIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { toast } from 'sonner';
import { useAutoLock } from '../utils/autoLock';
const MenuItem = ({
  icon,
  title,
  description,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return <button onClick={onClick} className="flex items-start p-4 w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mr-4 text-blue-600 dark:text-blue-400 mt-1">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </button>;
};
const MenuSection = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 px-1">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>;
};
const Menu = () => {
  const navigate = useNavigate();
  const {
    logout,
    user
  } = useAuth();
  // Get auto-lock timer setting for the current user
  const autoLockMinutes = user ? Number(JSON.parse(localStorage.getItem(`safekey_security_${user.id}`) || '{"autoLockTimer":5}').autoLockTimer) : 5;
  // Initialize auto-lock
  useAutoLock(autoLockMinutes);
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
      toast.success('You have been logged out');
    }
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Menu" showBack={false} />
      <div className="p-4 pb-20">
        <div className="bg-blue-600 dark:bg-blue-800 rounded-lg p-4 mb-6 text-white flex items-center">
          <div className="bg-white/20 rounded-full p-3 mr-4">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-lg font-medium">{user?.username || 'User'}</p>
            <p className="text-sm opacity-80">Logged in as master user</p>
          </div>
        </div>
        <MenuSection title="Security">
          <MenuItem icon={<KeyIcon size={24} />} title="Change Master Password" description="Update your vault's master password" onClick={() => navigate('/change-master-password')} />
          <MenuItem icon={<ShieldIcon size={24} />} title="Security Settings" description="PIN, fingerprint, and other security options" onClick={() => navigate('/security-settings')} />
        </MenuSection>
        <MenuSection title="Accessibility">
          <MenuItem icon={<TypeIcon size={24} />} title="Font Size" description="Adjust text size for better readability" onClick={() => navigate('/font-size')} />
          <MenuItem icon={<MoonIcon size={24} />} title="Theme" description="Choose between light and dark mode" onClick={() => navigate('/theme')} />
          <MenuItem icon={<PaletteIcon size={24} />} title="Color Filters" description="Color options for visual accessibility" onClick={() => navigate('/color-filters')} />
        </MenuSection>
        <MenuSection title="Help & Support">
          <MenuItem icon={<HelpCircleIcon size={24} />} title="Frequently Asked Questions" description="Get answers to common questions" onClick={() => navigate('/faq')} />
          <MenuItem icon={<InfoIcon size={24} />} title="About This App" description="Learn about SafeKey Password Vault" onClick={() => navigate('/about-app')} />
          <MenuItem icon={<UsersIcon size={24} />} title="About Us" description="Information about our team" onClick={() => navigate('/about-us')} />
          <MenuItem icon={<PhoneIcon size={24} />} title="Contact Support" description="Get help with any issues" onClick={() => navigate('/contact-support')} />
          <MenuItem icon={<FileTextIcon size={24} />} title="Privacy Policy" description="How we protect your data" onClick={() => navigate('/privacy-policy')} />
        </MenuSection>
        <div className="mt-8">
          <button onClick={handleLogout} className="w-full flex items-center justify-center bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 p-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors">
            <LogOutIcon size={20} className="mr-2" />
            <span className="text-lg font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>;
};
export default Menu;