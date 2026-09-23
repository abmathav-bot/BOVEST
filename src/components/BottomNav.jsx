import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CowIcon, ChartIcon, UserIcon } from './Icons';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', Icon: HomeIcon },
    { path: '/cows', label: 'Cows', Icon: CowIcon },
    { path: '/reports', label: 'Reports', Icon: ChartIcon },
    { path: '/profile', label: 'Profile', Icon: UserIcon },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map(({ path, label, Icon }) => {
        const isActive = location.pathname === path;
        return (
          <div key={path} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="nav-icon-wrap">
                <Icon size={22} color={isActive ? 'var(--bovest-green-dark)' : '#8fa4a0'} strokeWidth={isActive ? 2.2 : 1.7} />
                {isActive && <div className="nav-active-dot" />}
              </div>
              <div className="nav-label">{label}</div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
