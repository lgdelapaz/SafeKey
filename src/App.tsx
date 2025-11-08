// src/App.tsx
import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
// Import Supabase client to test connection
import { supabase } from './lib/supabaseClient'; // Adjust path if needed
// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Tutorial from './pages/Tutorial';
// import ViewAccounts from './pages/ViewAccounts'
import ViewPasswords from './pages/ViewPasswords';
import AddPassword from './pages/AddPassword';
import EditPassword from './pages/EditPassword';
// import DeletePassword from './pages/DeletePassword'
// import GeneratePassword from './pages/GeneratePassword'
import Menu from './pages/Menu';
import ChangeMasterPassword from './pages/ChangeMasterPassword';
import SecuritySettings from './pages/SecuritySettings';
// import LockTimer from './pages/LockTimer'
// import Accessibility from './pages/Accessibility'
import FontSize from './pages/FontSize';
import ThemeMode from './pages/ThemeModes';
import ColorFilters from './pages/ColorFilters';
// import Help from './pages/Help'
import FAQ from './pages/FAQ';
import AboutApp from './pages/AboutApp';
import AboutUs from './pages/AboutUs';
import ContactSupport from './pages/ContactSupport';
import PrivacyPolicy from './pages/PrivacyPolicy';
// Components
import BottomNavigation from './components/BottomNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Supabase Connection Test Component ---
const SupabaseConnectionTestBanner = () => {
  return null; // Disabled connection test banner
};
// --- End Supabase Connection Test Component ---

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout component that conditionally renders the bottom navigation and the connection test
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const noNavPaths = ['/login', '/signup', '/forgot-password', '/tutorial'];
  const showNav = !noNavPaths.includes(location.pathname);
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <SupabaseConnectionTestBanner />
      <div className={`flex-1 overflow-auto ${showNav ? 'pb-16' : ''}`}>
        {children}
      </div>
      {showNav && <BottomNavigation />}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute>
                    <Home />
                  </ProtectedRoute>} />
              <Route path="/tutorial" element={<ProtectedRoute>
                    <Tutorial />
                  </ProtectedRoute>} />
              {/* <Route
               path="/accounts"
               element={
               <ProtectedRoute>
               <ViewAccounts />
               </ProtectedRoute>
               }
               /> */}
              <Route path="/passwords" element={<ProtectedRoute>
                    <ViewPasswords />
                  </ProtectedRoute>} />
              <Route path="/add-password" element={<ProtectedRoute>
                    <AddPassword />
                  </ProtectedRoute>} />
              <Route path="/edit-password/:id" element={<ProtectedRoute>
                    <EditPassword />
                  </ProtectedRoute>} />
              {/* <Route
               path="/delete-password/:id"
               element={
               <ProtectedRoute>
               <DeletePassword />
               </ProtectedRoute>
               }
               />
               <Route
               path="/generate-password"
               element={
               <ProtectedRoute>
               <GeneratePassword />
               </ProtectedRoute>
               }
               /> */}
              <Route path="/menu" element={<ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>} />
              <Route path="/change-master-password" element={<ProtectedRoute>
                    <ChangeMasterPassword />
                  </ProtectedRoute>} />
              <Route path="/security-settings" element={<ProtectedRoute>
                    <SecuritySettings />
                  </ProtectedRoute>} />
              {/* <Route
               path="/lock-timer"
               element={
               <ProtectedRoute>
               <LockTimer />
               </ProtectedRoute>
               }
               /> */}
              {/* <Route
               path="/accessibility"
               element={
               <ProtectedRoute>
               <Accessibility />
               </ProtectedRoute>
               }
               /> */}
              {<Route path="/font-size" element={<ProtectedRoute>
                      <FontSize />
                    </ProtectedRoute>} />}
              <Route path="/theme" element={<ProtectedRoute>
                    <ThemeMode />
                  </ProtectedRoute>} />
              <Route path="/color-filters" element={<ProtectedRoute>
                    <ColorFilters />
                  </ProtectedRoute>} />
              {/* <Route
               path="/help"
               element={
               <ProtectedRoute>
               <Help />
               </ProtectedRoute>
               }
               /> */}
              <Route path="/faq" element={<ProtectedRoute>
                    <FAQ />
                  </ProtectedRoute>} />
              <Route path="/about-app" element={<ProtectedRoute>
                    <AboutApp />
                  </ProtectedRoute>} />
              <Route path="/about-us" element={<ProtectedRoute>
                    <AboutUs />
                  </ProtectedRoute>} />
              <Route path="/contact-support" element={<ProtectedRoute>
                    <ContactSupport />
                  </ProtectedRoute>} />
              <Route path="/privacy-policy" element={<ProtectedRoute>
                    <PrivacyPolicy />
                  </ProtectedRoute>} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}