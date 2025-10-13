import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// import PasswordRecovery from './pages/PasswordRecovery'
import Home from './pages/Home';
import Tutorial from './pages/Tutorial';
// import ViewAccounts from './pages/ViewAccounts'
import ViewPasswords from './pages/ViewPasswords';
import AddPassword from './pages/AddPassword';
// import EditPassword from './pages/EditPassword'
// import DeletePassword from './pages/DeletePassword'
// import GeneratePassword from './pages/GeneratePassword'
import Menu from './pages/Menu';
import ChangeMasterPassword from './pages/ChangeMasterPassword';
import SecuritySettings from './pages/SecuritySettings';
// import LockTimer from './pages/LockTimer'
import FontSize from './pages/FontSize';
import ThemeMode from './pages/ThemeMode';
import ColorFilters from './pages/ColorFilters';
import FAQ from './pages/FAQ';
import AboutApp from './pages/AboutApp';
import AboutUs from './pages/AboutUs';
import ContactSupport from './pages/ContactSupport';
import PrivacyPolicy from './pages/PrivacyPolicy';
// Components
import BottomNavigation from './components/BottomNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
// Protected route component
const ProtectedRoute = ({
  children
}) => {
  const {
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export function App() {
  return <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>;
}
// Separate component to use hooks inside the Router context
const AppContent = () => {
  const {
    isAuthenticated
  } = useAuth();
  return <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto pb-16">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route
           path="/password-recovery"
           element={<PasswordRecovery />}
           /> */}
          {/* Protected routes */}
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
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
          {/* <Route
           path="/edit-password/:id"
           element={
           <ProtectedRoute>
           <EditPassword />
           </ProtectedRoute>
           }
           />
           <Route
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
          <Route path="/font-size" element={<ProtectedRoute>
                <FontSize />
              </ProtectedRoute>} />
          <Route path="/theme" element={<ProtectedRoute>
                <ThemeMode />
              </ProtectedRoute>} />
          <Route path="/color-filters" element={<ProtectedRoute>
                <ColorFilters />
              </ProtectedRoute>} />
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
          {/* Redirect all other paths to login if not authenticated, home if authenticated */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
      {isAuthenticated && <BottomNavigation />}
      <Toaster position="top-center" richColors />
    </div>;
};