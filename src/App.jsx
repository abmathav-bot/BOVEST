import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import BottomNav from './components/BottomNav';
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
import './index.css';

/* Pages that should display the bottom navigation bar */
const NAV_ROUTES = ['/home', '/cows', '/reports', '/profile'];

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const location = useLocation();
  const showNav = NAV_ROUTES.includes(location.pathname);

  return (
    <>
      {/*
        Page content — animated with opacity only (NO transform).
        Using transform here would create a new stacking context and
        break position:fixed on the BottomNav.
      */}
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
          <Route path="/profile"         element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/edit-profile"    element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/bank-details"    element={<PrivateRoute><BankDetails /></PrivateRoute>} />
          <Route path="/kyc-details"     element={<PrivateRoute><KYCDetails /></PrivateRoute>} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/*
        BottomNav is rendered OUTSIDE the animated wrapper div.
        This guarantees its position:fixed always anchors to the viewport,
        not to a transformed ancestor — so it never scrolls.
      */}
      {showNav && <BottomNav />}
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
