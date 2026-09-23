import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bovestLogo from '../assets/bovest-logo.png';
export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => { const timer = setTimeout(() => navigate('/login', { replace: true }), 2200); return () => clearTimeout(timer); }, [navigate]);
  return <main className="splash-screen" aria-label="Bovest loading">
    <div className="splash-orbit orbit-one"></div><div className="splash-orbit orbit-two"></div>
    <div className="splash-logo"><img src={bovestLogo} alt="Bovest" className="splash-logo-image" /></div>
    <p>SMART DAIRY INVESTMENTS</p><div className="loading-line"><i></i></div>
  </main>;
}
