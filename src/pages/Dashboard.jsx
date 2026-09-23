import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import {
  TrendUpIcon, InvestIcon, DocumentIcon, HeartIcon,
  MilkIcon, CalendarIcon, NotificationIcon, ArrowUpRight, ChevronRight
} from '../components/Icons';

/* ─── Farm Alerts (important — pinned at top) ─── */
const FARM_ALERTS = [
  {
    id: 'fa1',
    title: '🚨 Veterinary Visit Scheduled',
    message: 'Dr. Ramesh will visit the farm on 24 Sep 2026 for a routine health check of all cows.',
    time: 'Just now',
    urgent: true,
  },
  {
    id: 'fa2',
    title: '🌧️ Weather Advisory',
    message: 'Heavy rainfall expected this week. Cows have been moved to covered sheds. No impact on yield expected.',
    time: '1 hr ago',
    urgent: false,
  },
];

/* ─── Notification data ─── */
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'profit',
    title: 'Daily Profit Credited',
    message: '₹35 has been credited to your wallet for today\'s milk yield.',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'health',
    title: 'Health Check Reminder',
    message: 'Scheduled veterinary check-up for Gauri (BOV-101) is due tomorrow.',
    time: '2 hrs ago',
    unread: true,
  },
  {
    id: 3,
    type: 'update',
    title: 'Market Rate Updated',
    message: 'Milk rate updated to ₹42/L for Sep 2026. Your returns will reflect this.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    type: 'investment',
    title: 'Lock-in Milestone',
    message: 'Your Scheme A investment has completed 2+ years. 3 more years to maturity.',
    time: '2 days ago',
    unread: false,
  },
];

/* ─── Notification type icon/color ─── */
const notifMeta = {
  profit:     { bg: '#e8f5e9', color: '#287b45' },
  health:     { bg: '#fce4ec', color: '#c62828' },
  update:     { bg: '#e3f2fd', color: '#1565c0' },
  investment: { bg: '#f3e5f5', color: '#7b1fa2' },
};

const NotifIcon = ({ type }) => {
  const c = notifMeta[type]?.color || '#287b45';
  if (type === 'profit') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  );
  if (type === 'health') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
  if (type === 'update') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
};

/* ─── Full day report data ─── */
const fullReport = {
  1: {
    milkMorning: '4.2 L', milkEvening: '3.8 L', totalMilk: '8.0 L',
    rate: '₹40/L', grossRevenue: '₹320', cowMaintenance: '₹160',
    profitPool: '₹160', investorShare: '25%', netProfit: '40.00',
    cowHealth: 'Good', temperature: '38.4°C', feedConsumed: '18 kg',
    waterConsumed: '62 L', veterinarian: 'No visit',
    notes: 'Normal yield day. Cow was active. No health issues observed.',
  },
  2: {
    milkMorning: '4.1 L', milkEvening: '3.9 L', totalMilk: '8.0 L',
    rate: '₹40/L', grossRevenue: '₹320', cowMaintenance: '₹160',
    profitPool: '₹160', investorShare: '25%', netProfit: '40.00',
    cowHealth: 'Good', temperature: '38.2°C', feedConsumed: '17.5 kg',
    waterConsumed: '60 L', veterinarian: 'No visit',
    notes: 'Consistent yield. Evening milking slightly higher.',
  },
  3: {
    milkMorning: '3.8 L', milkEvening: '3.7 L', totalMilk: '7.5 L',
    rate: '₹40/L', grossRevenue: '₹300', cowMaintenance: '₹150',
    profitPool: '₹150', investorShare: '25%', netProfit: '37.50',
    cowHealth: 'Good', temperature: '38.6°C', feedConsumed: '17 kg',
    waterConsumed: '58 L', veterinarian: 'No visit',
    notes: 'Slightly lower yield than average. Cow resting well post feeding.',
  },
};

/* ═══════════════════════════════════════════
   NOTIFICATION PANEL COMPONENT
═══════════════════════════════════════════ */
const NotificationPanel = ({ open, onClose, notifications, onMarkAll, farmAlerts }) => (
  <>
    {/* Backdrop */}
    <div
      className={`notif-backdrop ${open ? 'visible' : ''}`}
      onClick={onClose}
    />
    {/* Slide-in panel */}
    <div className={`notif-panel ${open ? 'open' : ''}`}>
      <div className="notif-panel-header">
        <div>
          <h3 className="notif-panel-title">Notifications</h3>
          <p className="notif-panel-sub">{notifications.filter(n => n.unread).length} unread</p>
        </div>
        <div className="notif-panel-actions">
          <button className="notif-mark-all" onClick={onMarkAll}>Mark all read</button>
          <button className="notif-close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="notif-list">

        {/* ── Farm Alerts Section ── */}
        {farmAlerts && farmAlerts.length > 0 && (
          <div style={{ marginBottom: '6px' }}>
            {/* Section header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px 8px',
            }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #c62828, #ef5350)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#c62828', letterSpacing: '0.02em' }}>Farm Alerts</p>
                <p style={{ fontSize: '11px', color: '#9aabb5' }}>Direct messages from Bovest Farm</p>
              </div>
              <span style={{ marginLeft: 'auto', background: '#fee2e2', color: '#c62828', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                {farmAlerts.length} New
              </span>
            </div>

            {/* Alert cards */}
            {farmAlerts.map((alert, i) => (
              <div key={alert.id} style={{
                margin: '0 12px 10px',
                borderRadius: '16px',
                background: alert.urgent
                  ? 'linear-gradient(135deg, #1a0a0a, #3b0d0d)'
                  : 'linear-gradient(135deg, #0a1420, #0d2137)',
                border: alert.urgent ? '1.5px solid rgba(239,83,80,0.4)' : '1.5px solid rgba(21,101,192,0.3)',
                padding: '14px 14px 12px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Pulse accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                  background: alert.urgent ? 'linear-gradient(#ef5350, #c62828)' : 'linear-gradient(#42a5f5, #1565c0)',
                  borderRadius: '4px 0 0 4px',
                }} />
                <div style={{ paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{alert.title}</p>
                    {alert.urgent && (
                      <span style={{ background: '#ef5350', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', marginLeft: '8px', flexShrink: 0, letterSpacing: '0.05em' }}>
                        URGENT
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{alert.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div style={{ margin: '4px 16px 12px', borderTop: '1px solid #f0f4f2' }} />
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px 8px' }}>Recent Updates</p>
          </div>
        )}

        {/* ── Regular Notifications ── */}
        {notifications.map((n, i) => {
          const meta = notifMeta[n.type] || notifMeta.update;
          return (
            <div
              key={n.id}
              className={`notif-item ${n.unread ? 'unread' : ''}`}
              style={{ animationDelay: open ? `${i * 60}ms` : '0ms' }}
            >
              <div className="notif-item-icon" style={{ background: meta.bg }}>
                <NotifIcon type={n.type} />
              </div>
              <div className="notif-item-body">
                <div className="notif-item-header">
                  <p className="notif-item-title">{n.title}</p>
                  {n.unread && <span className="notif-unread-dot" />}
                </div>
                <p className="notif-item-msg">{n.message}</p>
                <p className="notif-item-time">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

/* ═══════════════════════════════════════════
   ACTIVITY CARD COMPONENT
═══════════════════════════════════════════ */
const ActivityCard = ({ activity }) => {
  const [expanded, setExpanded] = useState(false);
  const report = fullReport[activity.id];

  return (
    <div
      style={{
        background: expanded
          ? 'linear-gradient(135deg, #17344b, #1a4163)'
          : '#fff',
        borderRadius: '20px',
        padding: '16px 16px',
        marginBottom: '12px',
        boxShadow: expanded
          ? '0 10px 32px rgba(13,38,59,0.22)'
          : '0 2px 12px rgba(13,38,59,0.07)',
        border: expanded
          ? '1px solid rgba(46,229,157,0.15)'
          : '1px solid #e8f0eb',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => setExpanded(v => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
    >
      {/* Collapsed header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Icon wrap */}
        <div style={{
          width: '48px', height: '48px', flexShrink: 0, borderRadius: '16px',
          background: expanded
            ? 'rgba(46,229,157,0.15)'
            : 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: expanded ? '1px solid rgba(46,229,157,0.25)' : 'none',
          transition: 'all 0.35s ease',
        }}>
          <MilkIcon size={22} color={expanded ? '#2ee59d' : 'var(--bovest-green-dark)'} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '14px', fontWeight: 800,
            color: expanded ? '#fff' : '#0d263b',
            marginBottom: '3px', letterSpacing: '-0.01em',
            transition: 'color 0.3s',
          }}>{activity.date}</p>
          <p style={{
            fontSize: '12px',
            color: expanded ? 'rgba(255,255,255,0.55)' : '#5a7d6d',
            marginBottom: '3px',
            transition: 'color 0.3s',
          }}>{activity.details} collected</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HeartIcon size={11} color={expanded ? '#ff8a8a' : '#e06060'} />
            <span style={{
              fontSize: '11px',
              color: expanded ? 'rgba(255,255,255,0.4)' : '#8ba899',
              transition: 'color 0.3s',
            }}>Health: {activity.health}</span>
          </div>
        </div>

        {/* Right: profit + chevron */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <div style={{
            background: expanded ? 'rgba(46,229,157,0.15)' : '#eaf7ee',
            border: expanded ? '1px solid rgba(46,229,157,0.3)' : '1px solid #b8e6c2',
            borderRadius: '12px',
            padding: '5px 12px',
          }}>
            <span style={{
              fontSize: '15px', fontWeight: 800,
              color: expanded ? '#2ee59d' : '#169e45',
              letterSpacing: '-0.02em',
            }}>+₹{activity.profit}</span>
          </div>
          <div style={{
            width: '26px', height: '26px', borderRadius: '8px',
            background: expanded ? 'rgba(255,255,255,0.08)' : '#f4f8f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={expanded ? 'rgba(255,255,255,0.5)' : '#8ba899'}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>{/* end header row */}

      {/* Expanded full report */}
      {expanded && report && (
        <div
          className="activity-expanded"
          onClick={e => e.stopPropagation()}
          style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}
        >
          <p className="exp-section-title" style={{ color: 'rgba(255,255,255,0.7)' }}>Daily Report — {activity.date}</p>

          {/* Milk yield */}
          <div className="exp-group">
            <p className="exp-group-label">Milk Yield</p>
            <div className="exp-row">
              <div className="exp-stat">
                <span className="exp-stat-label">Morning</span>
                <span className="exp-stat-val">{report.milkMorning}</span>
              </div>
              <div className="exp-stat">
                <span className="exp-stat-label">Evening</span>
                <span className="exp-stat-val">{report.milkEvening}</span>
              </div>
              <div className="exp-stat highlight">
                <span className="exp-stat-label">Total</span>
                <span className="exp-stat-val green">{report.totalMilk}</span>
              </div>
            </div>
          </div>

          {/* Earnings breakdown */}
          <div className="exp-group">
            <p className="exp-group-label">Earnings Breakdown</p>
            <div className="exp-earn-list">
              <div className="exp-earn-row">
                <span>Rate per Litre</span><span>{report.rate}</span>
              </div>
              <div className="exp-earn-row">
                <span>Gross Revenue (Total)</span><span>{report.grossRevenue}</span>
              </div>
              <div className="exp-earn-row" style={{ color: '#8ba899' }}>
                <span>Cow Maintenance (50%)</span><span>-{report.cowMaintenance}</span>
              </div>
              <div className="exp-earn-row">
                <span>Profit Pool (50%)</span><span>{report.profitPool}</span>
              </div>
              <div className="exp-earn-row">
                <span>Investor Share</span><span>{report.investorShare}</span>
              </div>
              <div className="exp-earn-row net">
                <span>Net Profit</span>
                <span className="net-val">+₹{report.netProfit}</span>
              </div>
            </div>
          </div>

          {/* Cow health & care */}
          <div className="exp-group">
            <p className="exp-group-label">Cow Health &amp; Care</p>
            <div className="exp-row">
              <div className="exp-stat">
                <span className="exp-stat-label">Body Temp</span>
                <span className="exp-stat-val">{report.temperature}</span>
              </div>
              <div className="exp-stat">
                <span className="exp-stat-label">Feed</span>
                <span className="exp-stat-val">{report.feedConsumed}</span>
              </div>
              <div className="exp-stat">
                <span className="exp-stat-label">Water</span>
                <span className="exp-stat-val">{report.waterConsumed}</span>
              </div>
            </div>
            <div className="exp-vet-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7a9a88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Veterinarian: {report.veterinarian}</span>
            </div>
          </div>

          {/* Farmer notes */}
          <div className="exp-notes">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9aaba5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Farmer Notes: {report.notes}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
const useCountUp = (target, duration = 1200) => {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
};

const Dashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [visible, setVisible] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const animatedPortfolio = useCountUp(visible ? user.portfolioValue : 0, 1400);
  const animatedToday = useCountUp(visible ? user.todayReturn : 0, 1000);
  const animatedMonth = useCountUp(visible ? user.monthReturn : 0, 1200);

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="dashboard-container">

      {/* Notification Panel */}
      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAll={markAllRead}
        farmAlerts={FARM_ALERTS}
      />

      {/* ── Top Bar ── */}
      <div className="dash-topbar dash-anim-0">
        <div className="dash-greeting">
          <p className="dash-hello">Welcome</p>
          <h2 className="dash-name">{user.name}</h2>
        </div>
        <button
          className={`notif-btn ${notifOpen ? 'active' : ''}`}
          aria-label="Notifications"
          onClick={() => setNotifOpen(v => !v)}
        >
          <NotificationIcon size={22} color={notifOpen ? '#fff' : 'var(--bovest-navy)'} />
          {unreadCount > 0 && (
            <span className="notif-badge-count">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* ── Portfolio Card (animated) ── */}
      <div className={`portfolio dash-anim-1 ${visible ? 'dash-visible' : ''}`}>
        {/* Animated glow orbs */}
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,229,157,0.18), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '20px',
          width: '90px', height: '90px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="portfolio-label">TOTAL PORTFOLIO VALUE</div>
        <div className="portfolio-amount">
          ₹{animatedPortfolio.toLocaleString('en-IN')}
        </div>

        <div className="portfolio-footer">
          <div className="portfolio-meta">
            <CalendarIcon size={14} color="rgba(255,255,255,0.6)" />
            <span>Since Jan 2024</span>
          </div>
          <div className="growth">
            <TrendUpIcon size={16} color="#2ee59d" />
            +{user.growthPercentage}%
          </div>
        </div>

        <div className="portfolio-mini-stats">
          <div className="mini-stat">
            <span className="mini-label">Today</span>
            <span className="mini-val" style={{ color: '#2ee59d' }}>+₹{animatedToday.toLocaleString('en-IN')}</span>
          </div>
          <div className="mini-divider" />
          <div className="mini-stat">
            <span className="mini-label">This Month</span>
            <span className="mini-val">+₹{animatedMonth.toLocaleString('en-IN')}</span>
          </div>
          <div className="mini-divider" />
          <div className="mini-stat">
            <span className="mini-label">Cows</span>
            <span className="mini-val">{user.investments.reduce((s, i) => s + (i.cows || 0), 0)}</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="row">
        <div className={`card stat-card dash-anim-2 ${visible ? 'dash-visible' : ''}`}>
          <div className="stat-icon-wrap green" style={{ background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)' }}>
            <TrendUpIcon size={20} color="var(--bovest-green-dark)" />
          </div>
          <h4>Today's Return</h4>
          <h2 className="stat-value" style={{ color: '#287b45' }}>₹{user.todayReturn}</h2>
          <p className="stat-sub">+2.3% vs yesterday</p>
        </div>
        <div className={`card stat-card dash-anim-3 ${visible ? 'dash-visible' : ''}`}>
          <div className="stat-icon-wrap navy" style={{ background: 'linear-gradient(135deg,#e3f0f8,#b3d4e8)' }}>
            <CalendarIcon size={20} color="var(--bovest-navy)" />
          </div>
          <h4>Monthly Return</h4>
          <h2 className="stat-value">₹{user.monthReturn}</h2>
          <p className="stat-sub">Sep 2026</p>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <h3 className={`section-title dash-anim-4 ${visible ? 'dash-visible' : ''}`}>Quick Actions</h3>
      <div className="quick-row">
        <div
          className={`quick-btn dash-anim-5 ${visible ? 'dash-visible' : ''}`}
          onClick={() => navigate('/invest')}
          role="button" tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, #17344b 0%, #1a4163 100%)',
            border: '1px solid rgba(46,229,157,0.2)',
            color: '#fff',
          }}
        >
          <div className="quick-icon" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <InvestIcon size={26} color="#2ee59d" />
          </div>
          <span style={{ color: '#fff' }}>Invest in Cow</span>
          <ArrowUpRight size={16} color="#2ee59d" />
        </div>
        <div
          className={`quick-btn dash-anim-6 ${visible ? 'dash-visible' : ''}`}
          onClick={() => navigate('/accept-terms')}
          role="button" tabIndex={0}
        >
          <div className="quick-icon">
            <DocumentIcon size={26} color="var(--bovest-navy-2)" />
          </div>
          <span>Agreement</span>
          <ArrowUpRight size={16} color="var(--bovest-navy-2)" />
        </div>
      </div>

      {/* ── Investment Summary ── */}
      <h3 className={`section-title dash-anim-7 ${visible ? 'dash-visible' : ''}`}>My Investments</h3>
      <div
        className={`dash-anim-8 ${visible ? 'dash-visible' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #17344b 0%, #1a4163 60%, #0f2d40 100%)',
          borderRadius: '24px',
          padding: '22px 20px 20px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(13,38,59,0.25)',
        }}
      >
        {/* Decorative glow orb */}
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '130px', height: '130px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,229,157,0.12), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Active Scheme</p>
            <p style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Scheme A — Milk-Based</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(46,229,157,0.15)',
            border: '1px solid rgba(46,229,157,0.3)',
            borderRadius: '20px',
            padding: '5px 12px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ee59d', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2ee59d' }}>Active</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px', position: 'relative' }}>
          {[
            { label: 'Invested', value: `₹${user.investments[0]?.amount?.toLocaleString('en-IN') || '—'}`, accent: '#2ee59d' },
            { label: 'Active Since', value: '2.2 yrs', accent: '#60b4ff' },
            { label: 'Lock-in', value: '5 Years', accent: '#f9a94b' },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '12px 10px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>{item.label}</p>
              <p style={{ fontSize: '15px', fontWeight: 800, color: item.accent, letterSpacing: '-0.02em' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Lock-in progress bar */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Lock-in Progress</span>
            <span style={{ fontSize: '11px', color: '#f9a94b', fontWeight: 700 }}>2.2 / 5 Years · 44%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9px', overflow: 'hidden' }}>
            <div style={{
              width: '44%', height: '100%',
              background: 'linear-gradient(90deg, #f9a94b, #f97316)',
              borderRadius: '9px',
              boxShadow: '0 0 10px rgba(249,169,75,0.4)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <h3 className={`section-title dash-anim-9 ${visible ? 'dash-visible' : ''}`}>
        Recent Activity
        <span className="activity-hint">Tap to expand</span>
      </h3>
      {user.recentActivities.map((activity, idx) => (
        <div
          key={activity.id}
          className={`dash-anim-stagger ${visible ? 'dash-visible' : ''}`}
          style={{ '--stagger-delay': `${0.55 + idx * 0.08}s` }}
        >
          <ActivityCard activity={activity} />
        </div>
      ))}

    </div>
  );
};

export default Dashboard;
