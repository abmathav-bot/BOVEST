import React, { createContext, useState, useContext } from 'react';
import { mockUserData } from '../utils/mockData';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(mockUserData);
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('bovestLoggedIn') === 'true');
  const login = () => { sessionStorage.setItem('bovestLoggedIn', 'true'); setIsLoggedIn(true); };
  const logout = () => { sessionStorage.removeItem('bovestLoggedIn'); setIsLoggedIn(false); };
  const addInvestment = (investmentDetails) => setUser(prev => ({ ...prev, investments: [...prev.investments, { id: Date.now(), ...investmentDetails }] }));
  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));
  return <AppContext.Provider value={{ user, setUser, updateUser, addInvestment, isLoggedIn, login, logout }}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
