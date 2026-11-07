import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import BottomNav from './components/BottomNav';
import InstallPWAModal from './components/InstallPWAModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import InvestmentForm from './pages/InvestmentForm';
import AcceptTerms from './pages/AcceptTerms';
import Cows from './pages/Cows';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import BankDetails from './pages/BankDetails';
import KYCDetails from './pages/KYCDetails';
import Invoices from './pages/Invoices';
import Support from './pages/Support';
import Agreement from './pages/Agreement';
import './index.css';

/* Pages that should display the bottom navigation bar */
const NAV_ROUTES = ['/home', '/cows', '/reports', '/profile'];

function PrivateRoute({ children }) {
  const { isLoggedIn, loadingUser, user } = useAppContext();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (loadingUser && !user) return <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', color: '#9aaba5', fontSize: '14px' }}>Loading your account...</div>;
  if (!user) return <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', color: '#9aaba5', fontSize: '14px' }}>Loading your account...</div>;
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const showNav = NAV_ROUTES.includes(location.pathname);
  const { installPrompt, isInstalled, isIOS, isStandalone, triggerInstall } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Show first-time install popup after 2 seconds (only in browser, not in standalone PWA)
  useEffect(() => {
    if (isInstalled || isStandalone) return;
    const alreadyShown = localStorage.getItem('bovest_install_popup_shown');
    if (alreadyShown) return;

    // Wait a bit so the user sees the app first
    const timer = setTimeout(() => {
      setShowInstallModal(true);
      localStorage.setItem('bovest_install_popup_shown', '1');
    }, 2500);

    return () => clearTimeout(timer);
  }, [isInstalled, isStandalone]);

  const handleInstall = async () => {
    const accepted = await triggerInstall();
    if (accepted) setShowInstallModal(false);
  };

  return (
    <>
      <div key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/"                element={<Splash />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home"            element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/invest"          element={<PrivateRoute><InvestmentForm /></PrivateRoute>} />
          <Route path="/accept-terms"    element={<PrivateRoute><AcceptTerms /></PrivateRoute>} />
          <Route path="/cows"            element={<PrivateRoute><Cows /></PrivateRoute>} />
          <Route path="/reports"         element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/profile"         element={<PrivateRoute><Profile onShowInstall={() => setShowInstallModal(true)} /></PrivateRoute>} />
          <Route path="/edit-profile"    element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/bank-details"    element={<PrivateRoute><BankDetails /></PrivateRoute>} />
          <Route path="/kyc-details"     element={<PrivateRoute><KYCDetails /></PrivateRoute>} />
          <Route path="/invoices"        element={<PrivateRoute><Invoices /></PrivateRoute>} />
          <Route path="/support"         element={<PrivateRoute><Support /></PrivateRoute>} />
          <Route path="/agreement"       element={<PrivateRoute><Agreement /></PrivateRoute>} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {showNav && <BottomNav />}

      {/* Global PWA install modal */}
      <InstallPWAModal
        open={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={handleInstall}
        isIOS={isIOS}
        installPrompt={installPrompt}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
