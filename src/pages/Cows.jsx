import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { HeartIcon, MilkIcon, StarIcon, TrendUpIcon, CalendarIcon, ChartIcon } from '../components/Icons';

const cowData = [
  {
    id: 101,
    name: 'Gauri',
    tag: 'BOV-101',
    breed: 'HF Cross',
    health: 'Excellent',
    healthScore: 97,
    milkMorning: 4.2,
    milkEvening: 4.0,
    milkToday: 8.2,
    milkAvg: 7.9,
    age: '4 yrs',
    location: 'Shed A — Pen 3',
    lastCheckup: '18 Sep 2026',
    profitToday: 43,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=300&h=300&fit=crop',
    thisMonthMilk: '245 L',
    temperature: '38.4°C',
    foodConsumed: '540 kg',
    waterConsumed: '1860 L',
    costEarnedMonth: '₹9,800',
  },
  {
    id: 102,
    name: 'Nandini',
    tag: 'BOV-102',
    breed: 'Jersey Cross',
    health: 'Good',
    healthScore: 83,
    milkMorning: 3.5,
    milkEvening: 3.0,
    milkToday: 6.5,
    milkAvg: 6.8,
    age: '3 yrs',
    location: 'Shed B — Pen 7',
    lastCheckup: '20 Sep 2026',
    profitToday: 34,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=300&h=300&fit=crop',
    thisMonthMilk: '195 L',
    temperature: '38.2°C',
    foodConsumed: '480 kg',
    waterConsumed: '1500 L',
    costEarnedMonth: '₹7,800',
  },
];

const healthColor = (score) => {
  if (score >= 90) return '#287b45';
  if (score >= 70) return '#f59e0b';
  return '#e05252';
};

const CowCard = ({ cow }) => {
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div 
        className={`cow-card ${expanded ? 'expanded' : ''}`} 
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Card Header */}
        <div className="cow-card-header">
          <div 
            className="cow-avatar" 
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
            style={{ cursor: 'zoom-in' }}
          >
            <img src={cow.image} alt={cow.name} />
          </div>
          <div className="cow-info-primary">
          <div className="cow-name-row">
            <h3 className="cow-name">{cow.name}</h3>
            <span className="cow-tag">{cow.tag}</span>
          </div>
          <p className="cow-breed">{cow.breed} • Age: {cow.age}</p>
          <div className="cow-milk-split" style={{ fontSize: '11.5px', color: '#7a8fa0', marginTop: '4px' }}>
            ☀️ Morn: <span style={{color: 'var(--bovest-navy)', fontWeight: 600}}>{cow.milkMorning} L</span> &nbsp;•&nbsp; 🌙 Eve: <span style={{color: 'var(--bovest-navy)', fontWeight: 600}}>{cow.milkEvening} L</span> &nbsp;•&nbsp; 💰 Rate: <span style={{color: 'var(--bovest-navy)', fontWeight: 600}}>₹42/L</span>
          </div>
        </div>
        <div className="cow-profit-badge">
          <p className="cow-profit-label">Today's Profit</p>
          <p className="cow-profit-val">+₹{cow.profitToday}</p>
        </div>
      </div>

      {/* Health Bar */}
      <div className="cow-health-row">
        <div className="cow-health-label">
          <HeartIcon size={14} color={healthColor(cow.healthScore)} />
          <span style={{ color: healthColor(cow.healthScore) }}>Health: {cow.health}</span>
        </div>
        <span className="cow-health-pct" style={{ color: healthColor(cow.healthScore) }}>{cow.healthScore}%</span>
      </div>
      <div className="health-bar-track">
        <div className="health-bar-fill" style={{ width: `${cow.healthScore}%`, background: healthColor(cow.healthScore) }} />
      </div>

      {/* Stats Grid */}
      <div className="cow-stats-grid">
        <div className="cow-stat">
          <MilkIcon size={15} color="var(--bovest-green-dark)" />
          <p className="cow-stat-label">Today</p>
          <p className="cow-stat-val">{cow.milkToday} L</p>
        </div>
        <div className="cow-stat">
          <MilkIcon size={15} color="#888" />
          <p className="cow-stat-label">Daily Avg</p>
          <p className="cow-stat-val">{cow.milkAvg} L</p>
        </div>
        <div className="cow-stat">
          <CalendarIcon size={15} color="var(--bovest-navy)" />
          <p className="cow-stat-label">Checkup</p>
          <p className="cow-stat-val" style={{ fontSize: 11 }}>{cow.lastCheckup}</p>
        </div>
      </div>

      <div className="cow-expand-handle" style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
        <div className={`activity-chevron ${expanded ? 'rotated' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="activity-expanded" onClick={e => e.stopPropagation()}>
          <p className="exp-section-title">Detailed Report</p>
          <div className="exp-group">
            <p className="exp-group-label">This Month Summary</p>
            <div className="exp-earn-list">
              <div className="exp-earn-row">
                <span>Total Milk Given</span><span>{cow.thisMonthMilk}</span>
              </div>
              <div className="exp-earn-row net">
                <span>Revenue Earned</span><span className="net-val">+{cow.costEarnedMonth}</span>
              </div>
            </div>
          </div>
          <div className="exp-group" style={{ marginBottom: 0 }}>
            <p className="exp-group-label">Medical & Care</p>
            <div className="exp-row">
              <div className="exp-stat">
                <span className="exp-stat-label">Body Temp</span>
                <span className="exp-stat-val">{cow.temperature}</span>
              </div>
              <div className="exp-stat">
                <span className="exp-stat-label">Food Cons.</span>
                <span className="exp-stat-val">{cow.foodConsumed}</span>
              </div>
              <div className="exp-stat">
                <span className="exp-stat-label">Water Cons.</span>
                <span className="exp-stat-val">{cow.waterConsumed}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {isFullscreen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'zoom-out'
        }} onClick={() => setIsFullscreen(false)}>
          <img src={cow.image} alt={cow.name} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
        </div>
      )}
    </>
  );
};

const Cows = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2 className="page-title">My Cows</h2>
        <p className="page-sub">{cowData.length} active animals</p>
      </div>
      {/* Farm Visit Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d263b, #1a4163)',
        borderRadius: '18px',
        padding: '16px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 4px 16px rgba(13,38,59,0.15)',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          background: 'rgba(46,229,157,0.15)',
          border: '1.5px solid rgba(46,229,157,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2ee59d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>
            Want to Visit the Farm?
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            To schedule a farm visit and meet your cows in person, please contact our support team.
          </p>
        </div>
        <div style={{
          background: 'rgba(46,229,157,0.15)',
          border: '1px solid rgba(46,229,157,0.3)',
          borderRadius: '10px',
          padding: '6px 12px',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2ee59d' }}>Contact</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2ee59d' }}>Support</p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="cows-summary-strip">
        <div className="cow-strip-item">
          <MilkIcon size={18} color="var(--bovest-green-dark)" />
          <div>
            <p className="strip-label">Total Milk Today</p>
            <p className="strip-val">{cowData.reduce((s, c) => s + c.milkToday, 0).toFixed(1)} L</p>
          </div>
        </div>
        <div className="strip-sep" />
        <div className="cow-strip-item">
          <TrendUpIcon size={18} color="var(--bovest-green-dark)" />
          <div>
            <p className="strip-label">Today's Profit</p>
            <p className="strip-val">₹{cowData.reduce((s, c) => s + c.profitToday, 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="strip-sep" />
        <div className="cow-strip-item">
          <HeartIcon size={18} color="#e06060" />
          <div>
            <p className="strip-label">Avg Health</p>
            <p className="strip-val">{Math.round(cowData.reduce((s, c) => s + c.healthScore, 0) / cowData.length)}%</p>
          </div>
        </div>
        <div className="strip-sep" />
        <div className="cow-strip-item">
          <ChartIcon size={18} color="var(--bovest-navy)" />
          <div>
            <p className="strip-label">Market Rate</p>
            <p className="strip-val">₹42/L</p>
          </div>
        </div>
      </div>

      <h3 className="section-title">
        Cow Profiles
        <span className="activity-hint">Tap to expand</span>
      </h3>

      {cowData.map(cow => (
        <CowCard key={cow.id} cow={cow} />
      ))}

      <BottomNav />
    </div>
  );
};

export default Cows;
