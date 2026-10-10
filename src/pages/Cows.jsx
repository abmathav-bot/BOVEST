import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { api } from '../utils/api';
import { HeartIcon, MilkIcon, StarIcon, TrendUpIcon, CalendarIcon, ChartIcon, CowOutlineIcon } from '../components/Icons';

const healthColor = (score) => {
  if (score >= 90) return '#287b45';
  if (score >= 70) return '#f59e0b';
  return '#e05252';
};

const iconProps = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const SunIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg {...iconProps}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const RupeeIcon = () => (
  <svg {...iconProps}>
    <path d="M6 4h12M6 9h12M6 4c6 0 8 2 8 5s-2 5-8 5l7 6" />
  </svg>
);

/* A saved location can be a Google Maps link or plain text; either opens in Google Maps */
const mapsUrl = (loc) => {
  const v = (loc || '').trim();
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
};

const CowCard = ({ cow }) => {
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const milkToday = cow.milk_today ?? ((cow.milk_morning || 0) + (cow.milk_evening || 0));
  const profit = cow.profit_today ?? cow.latest_profit ?? cow.net_investor_profit ?? 0;
  const lastCheckup = cow.last_checkup_date
    ? new Date(cow.last_checkup_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <>
      <div
        className={`cow-card ${expanded ? 'expanded' : ''}`}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded(v => !v)}
      >
        <div className="cow-card-header">
          <div
            className="cow-avatar"
            onClick={(e) => { e.stopPropagation(); if (cow.image_url) setIsFullscreen(true); }}
            style={{ cursor: cow.image_url ? 'zoom-in' : 'default' }}
          >
            {cow.image_url
              ? <img src={cow.image_url} alt={cow.name} />
              : <div style={{ width: '100%', height: '100%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CowOutlineIcon size={28} color="#287b45" /></div>
            }
          </div>
          <div className="cow-info-primary">
            <div className="cow-name-row">
              <h3 className="cow-name">{cow.name}</h3>
              <span className="cow-tag">{cow.tag}</span>
            </div>
            <p className="cow-breed">{cow.breed || 'Unknown'} • Age: {cow.age || '—'}</p>
            <div className="cow-milk-split">
              <span className="milk-chip morn">
                <SunIcon />
                <em>Morn</em><b>{cow.milk_morning ?? '—'} L</b>
              </span>
              <span className="milk-chip eve">
                <MoonIcon />
                <em>Eve</em><b>{cow.milk_evening ?? '—'} L</b>
              </span>
              <span className="milk-chip rate">
                <RupeeIcon />
                <em>Rate</em><b>₹{cow.rate_per_litre ?? 42}/L</b>
              </span>
            </div>
          </div>
          <div className="cow-profit-badge">
            <p className="cow-profit-label">Today's Profit</p>
            <p className="cow-profit-val">+₹{Number(profit).toFixed(0)}</p>
          </div>
        </div>

        <div className="cow-health-row">
          <div className="cow-health-label">
            <HeartIcon size={14} color={healthColor(cow.health_score)} />
            <span style={{ color: healthColor(cow.health_score) }}>Health: {cow.health_status || 'Good'}</span>
          </div>
          <span className="cow-health-pct" style={{ color: healthColor(cow.health_score) }}>{cow.health_score}%</span>
        </div>
        <div className="health-bar-track">
          <div className="health-bar-fill" style={{ width: `${cow.health_score}%`, background: healthColor(cow.health_score) }} />
        </div>

        <div className="cow-stats-grid">
          <div className="cow-stat">
            <MilkIcon size={15} color="var(--bovest-green-dark)" />
            <p className="cow-stat-label">Today</p>
            <p className="cow-stat-val">{milkToday.toFixed(1)} L</p>
          </div>
          <div className="cow-stat">
            <MilkIcon size={15} color="#888" />
            <p className="cow-stat-label">Location</p>
            {cow.location ? (
              <a
                className="cow-stat-val"
                href={mapsUrl(cow.location)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontSize: 11, color: '#1565c0', fontWeight: 700, textDecoration: 'underline' }}
              >
                View on map
              </a>
            ) : (
              <p className="cow-stat-val" style={{ fontSize: 10 }}>—</p>
            )}
          </div>
          <div className="cow-stat">
            <CalendarIcon size={15} color="var(--bovest-navy)" />
            <p className="cow-stat-label">Checkup</p>
            <p className="cow-stat-val" style={{ fontSize: 11 }}>{lastCheckup}</p>
          </div>
        </div>

        <div className="cow-expand-handle" style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
          <div className={`activity-chevron ${expanded ? 'rotated' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        {expanded && (
          <div className="activity-expanded" onClick={e => e.stopPropagation()}>
            <p className="exp-section-title">Detailed Info</p>
            <div className="exp-group">
              <p className="exp-group-label">Medical & Care</p>
              <div className="exp-row">
                <div className="exp-stat">
                  <span className="exp-stat-label">Breed</span>
                  <span className="exp-stat-val">{cow.breed || '—'}</span>
                </div>
                <div className="exp-stat">
                  <span className="exp-stat-label">Age</span>
                  <span className="exp-stat-val">{cow.age || '—'}</span>
                </div>
                <div className="exp-stat">
                  <span className="exp-stat-label">Rating</span>
                  <span className="exp-stat-val">{'⭐'.repeat(cow.rating || 0)}</span>
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
          display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out'
        }} onClick={() => setIsFullscreen(false)}>
          <img src={cow.image_url} alt={cow.name} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '16px' }} />
        </div>
      )}
    </>
  );
};

const Cows = () => {
  const [cows, setCows] = useState([]);
  const [marketRate, setMarketRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cows.list()
      .then(d => { setCows(d.cows || d || []); setMarketRate(d.summary?.market_rate ?? null); })
      .catch(() => setCows([]))
      .finally(() => setLoading(false));
  }, []);

  const totalMilk = cows.reduce((s, c) => s + Number(c.milk_today ?? ((c.milk_morning || 0) + (c.milk_evening || 0))), 0);
  const totalProfit = cows.reduce((s, c) => s + Number(c.profit_today ?? c.latest_profit ?? c.net_investor_profit ?? 0), 0);
  const avgHealth = cows.length ? Math.round(cows.reduce((s, c) => s + (c.health_score || 0), 0) / cows.length) : 0;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2 className="page-title">My Cows</h2>
        <p className="page-sub">{cows.length} active animal{cows.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Farm Visit Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d263b, #1a4163)',
        borderRadius: '18px', padding: '16px 18px', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '14px',
        boxShadow: '0 4px 16px rgba(13,38,59,0.15)',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          background: 'rgba(46,229,157,0.15)', border: '1.5px solid rgba(46,229,157,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2ee59d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>Want to Visit the Farm?</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            To schedule a farm visit and meet your cows in person, please contact our support team.
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="cows-summary-strip">
        <div className="cow-strip-item">
          <MilkIcon size={18} color="var(--bovest-green-dark)" />
          <div>
            <p className="strip-label">Total Milk Today</p>
            <p className="strip-val">{totalMilk.toFixed(1)} L</p>
          </div>
        </div>
        <div className="strip-sep" />
        <div className="cow-strip-item">
          <TrendUpIcon size={18} color="var(--bovest-green-dark)" />
          <div>
            <p className="strip-label">Today's Profit</p>
            <p className="strip-val">₹{totalProfit.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="strip-sep" />
        <div className="cow-strip-item">
          <HeartIcon size={18} color="#e06060" />
          <div>
            <p className="strip-label">Avg Health</p>
            <p className="strip-val">{avgHealth > 0 ? `${avgHealth}%` : '—'}</p>
          </div>
        </div>
        <div className="strip-sep" />
        <div className="cow-strip-item">
          <ChartIcon size={18} color="var(--bovest-navy)" />
          <div>
            <p className="strip-label">Market Rate</p>
            <p className="strip-val">{marketRate != null ? `₹${marketRate}/L` : '—'}</p>
          </div>
        </div>
      </div>

      <h3 className="section-title">
        Cow Profiles
        <span className="activity-hint">Tap to expand</span>
      </h3>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9aaba5', padding: '32px 0' }}>Loading cows...</p>
      ) : cows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f7fbf4', borderRadius: '20px' }}>
          <div style={{ marginBottom: 12 }}><CowOutlineIcon size={48} color="#287b45" /></div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#0d263b', marginBottom: 6 }}>No Cows Yet</p>
          <p style={{ fontSize: '13px', color: '#9aaba5' }}>Your cows will appear here once your investment is active and cows are assigned to you.</p>
        </div>
      ) : (
        cows.map(cow => <CowCard key={cow.id} cow={cow} />)
      )}

      <BottomNav />
    </div>
  );
};

export default Cows;
