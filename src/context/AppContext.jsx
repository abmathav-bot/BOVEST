import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api, getToken, removeToken } from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());
  const [loadingUser, setLoadingUser] = useState(false);

  // ── Fetch the real profile from the backend ──────────────────────────────
  const fetchMe = useCallback(async () => {
    if (!getToken()) return;
    setLoadingUser(true);
    try {
      const data = await api.user.me();
      setUser(data);
    } catch (err) {
      console.error('Failed to load profile:', err.message);
      // If token is invalid the api layer will redirect to /login
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Load profile on mount (or when token appears)
  useEffect(() => {
    if (isLoggedIn) fetchMe();
  }, [isLoggedIn, fetchMe]);

  // Heartbeat: lets the farm dashboard show this investor as online while the app is open
  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const ping = () => { if (getToken()) api.user.heartbeat().catch(() => {}); };
    ping();
    const timer = setInterval(ping, 30000);
    return () => clearInterval(timer);
  }, [isLoggedIn]);

  // ── Auth actions ─────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    // Token is stored inside api.auth.login
    setUser({ name: res.name, email: res.email, id: res.user_id });
    setIsLoggedIn(true);
    return res;
  };

  const logout = () => {
    api.auth.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  // ── Helpers kept for backward compat with pages that still use them ──────

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));
  const addInvestment = () => fetchMe(); // re-fetch instead of local state patch
  const refreshUser = fetchMe;

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      updateUser,
      addInvestment,
      refreshUser,
      isLoggedIn,
      loadingUser,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
