import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { calculateSchemeA, calculateSchemeB } from '../utils/calculations';
import { TrendUpIcon, CalendarIcon, ShieldIcon, ChartIcon, MilkIcon } from '../components/Icons';

const schemeColor = { A: '#287b45', B: '#1565c0' };

const pastReportsData = [
  { 
    id: 1, month: 'August 2026', milkTotal: '450 L', grossRevenue: '₹18,900',
    maintenanceCost: '₹9,450', revenue: '2,350', status: 'Credited',
    healthSummary: 'Excellent. No diseases reported.', vetVisitDate: '15 Aug 2026',
    milkTrend: '+3.5% vs July', trendUp: true
  },
  { 
    id: 2, month: 'July 2026', milkTotal: '435 L', grossRevenue: '₹18,270',
    maintenanceCost: '₹9,135', revenue: '2,280', status: 'Credited',
    healthSummary: 'Good. Minor foot rot observed.', vetVisitDate: '10 Jul 2026',
    milkTrend: '-5.0% vs June', trendUp: false
  },
  { 
    id: 3, month: 'June 2026', milkTotal: '460 L', grossRevenue: '₹19,320',
    maintenanceCost: '₹9,660', revenue: '2,400', status: 'Credited',
    healthSummary: 'Excellent. Full health.', vetVisitDate: '05 Jun 2026',
    milkTrend: '+2.0% vs May', trendUp: true
  },
];

const PastReportCard = ({ pr }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: '#fff',
        borderRadius: '18px',
        marginBottom: '12px',
        border: '1px solid #eaf1ee',
        overflow: 'hidden',
        boxShadow: expanded ? '0 6px 24px rgba(40,123,69,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Month accent bar */}
      <div style={{ height: '4px', background: pr.trendUp ? 'linear-gradient(90deg,#287b45,#58ae3f)' : 'linear-gradient(90deg,#e05252,#ff8a80)' }} />

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#0d263b', marginBottom: '4px' }}>{pr.month}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MilkIcon size={13} color="#7a8fa0" />
              <span style={{ fontSize: '12px', color: '#7a8fa0' }}>{pr.milkTotal}</span>
              <span style={{ fontSize: '12px', color: '#ccc', margin: '0 2px' }}>·</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: pr.trendUp ? '#287b45' : '#e05252' }}>
                {pr.milkTrend}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#287b45', marginBottom: '4px' }}>+₹{pr.revenue}</p>
            <span style={{ background: '#e8f5e9', color: '#287b45', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{pr.status}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <svg style={{ transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div style={{ background: '#f9fbf9', borderTop: '1px solid #eaf1ee', padding: '16px' }}
          onClick={e => e.stopPropagation()}>

          <p style={{ fontSize: '11px', fontWeight: 700, color: '#287b45', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Yield & Profits</p>
          {[
            { label: 'Gross Milk Revenue', val: pr.grossRevenue, color: '#0d263b' },
            { label: 'Cow Food & Maintenance', val: `-${pr.maintenanceCost}`, color: '#e05252' },
            { label: 'Investor Profit', val: `+₹${pr.revenue}`, color: '#287b45', bold: true },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eef3ee' }}>
              <span style={{ fontSize: '13px', color: '#5a7080' }}>{r.label}</span>
              <span style={{ fontSize: '13px', fontWeight: r.bold ? 800 : 600, color: r.color }}>{r.val}</span>
            </div>
          ))}

          <p style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 12px' }}>Health & Insights</p>
          {[
            { label: 'Health Status', val: pr.healthSummary },
            { label: 'Last Vet Check', val: pr.vetVisitDate },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eef3ee', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#5a7080', flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d263b', textAlign: 'right' }}>{r.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Reports = () => {
  const { user } = useAppContext();
  const totalInvested = user.investments.reduce((s, i) => s + i.amount, 0);
  const totalCows = user.investments.reduce((s, i) => s + (i.cows || 0), 0);

  return (
    <div className="dashboard-container">

      {/* Premium Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d263b 0%, #1a4163 100%)',
        borderRadius: '20px',
        padding: '24px 20px',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(13,38,59,0.18)',
        marginTop: '16px',
      }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Investment Reports</p>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Portfolio Summary</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            {
              label: 'Total Invested',
              val: `₹${totalInvested.toLocaleString('en-IN')}`,
              accent: 'rgba(46,229,157,0.15)',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v2M12 16v2M9 10h4.5a1.5 1.5 0 010 3H9.5A1.5 1.5 0 018 14.5v-.5"/>
                  <path d="M9 10V9a1 1 0 011-1h3"/>
                </svg>
              ),
            },
            {
              label: 'Growth',
              val: `+${user.growthPercentage}%`,
              accent: 'rgba(251,191,36,0.15)',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                  <polyline points="16 7 22 7 22 13"/>
                </svg>
              ),
            },
            {
              label: 'Active Cows',
              val: totalCows,
              accent: 'rgba(167,139,250,0.15)',
              icon: (
                <svg width="20" height="20" viewBox="0 0 100 100" fill="rgba(255,255,255,0.85)">
                  <ellipse cx="50" cy="62" rx="28" ry="20"/>
                  <ellipse cx="50" cy="38" rx="22" ry="16"/>
                  <ellipse cx="32" cy="30" rx="10" ry="7"/>
                  <ellipse cx="68" cy="30" rx="10" ry="7"/>
                  <ellipse cx="28" cy="22" rx="5" ry="8" transform="rotate(-15 28 22)"/>
                  <ellipse cx="72" cy="22" rx="5" ry="8" transform="rotate(15 72 22)"/>
                  <ellipse cx="37" cy="82" rx="6" ry="10"/>
                  <ellipse cx="63" cy="82" rx="6" ry="10"/>
                </svg>
              ),
            },
          ].map(s => (
            <div key={s.label} style={{ background: s.accent, borderRadius: '14px', padding: '12px 10px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>{s.icon}</div>
              <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{s.val}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Cards */}
      <h3 className="section-title" style={{ marginBottom: '12px' }}>My Investments</h3>

      {user.investments.map(inv => {
        const monthlyProfit = inv.scheme === 'A'
          ? calculateSchemeA(inv.amount, 8, 40).investorProfitMonthly
          : calculateSchemeB(inv.amount).monthlyPayout;
        const annualProfit = monthlyProfit * 12;
        const roi = ((annualProfit / inv.amount) * 100).toFixed(1);
        const lockPct = Math.min(100, Math.round((inv.activeYears / (inv.scheme === 'A' ? 5 : 3)) * 100));

        return (
          <div key={inv.id} style={{
            background: '#fff',
            borderRadius: '20px',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
            overflow: 'hidden',
            border: '1px solid #eaf1ee',
          }}>
            {/* Top accent */}
            <div style={{ height: '5px', background: `linear-gradient(90deg, ${schemeColor[inv.scheme]}, ${inv.scheme === 'A' ? '#58ae3f' : '#42a5f5'})` }} />

            <div style={{ padding: '20px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span style={{ background: `${schemeColor[inv.scheme]}18`, color: schemeColor[inv.scheme], fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                    Scheme {inv.scheme}
                  </span>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0d263b', marginTop: '8px' }}>
                    {inv.scheme === 'A' ? 'Milk-Based Investment' : 'Amount-Based Investment'}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#e8f5e9', padding: '6px 12px', borderRadius: '20px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2ee59d', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#287b45' }}>Active</span>
                </div>
              </div>

              {/* Metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'Capital Deployed', val: `₹${inv.amount.toLocaleString('en-IN')}` },
                  { label: 'Start Date', val: inv.startDate },
                  { label: 'Active Period', val: `${inv.activeYears} yrs` },
                  { label: 'Cows / Calves', val: `${inv.cows} / ${inv.calves}` },
                ].map(m => (
                  <div key={m.label} style={{ background: '#f7fbf4', borderRadius: '12px', padding: '12px' }}>
                    <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{m.label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0d263b' }}>{m.val}</p>
                  </div>
                ))}
              </div>

              {/* Earnings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Monthly Payout', val: `₹${monthlyProfit.toLocaleString('en-IN')}`, color: schemeColor[inv.scheme] },
                  { label: 'Annual Earnings', val: `₹${annualProfit.toLocaleString('en-IN')}`, color: '#d97706' },
                  { label: 'ROI / Year', val: `${roi}%`, color: '#7c3aed' },
                ].map(e => (
                  <div key={e.label} style={{ borderLeft: `3px solid ${e.color}`, background: '#f9faf8', borderRadius: '0 10px 10px 0', padding: '10px' }}>
                    <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{e.label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: e.color }}>{e.val}</p>
                  </div>
                ))}
              </div>

              {inv.scheme === 'A' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f8ec', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', color: '#5a7a60' }}>
                  <MilkIcon size={14} color="#287b45" />
                  <span>Est. 8L/day · Rate ₹40/L · 25% investor share</span>
                </div>
              )}

              {/* Lock-in bar */}
              <div style={{ borderTop: '1px solid #eaf1ee', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldIcon size={14} color="#888" />
                    <span style={{ fontSize: '12px', color: '#7a8fa0' }}>Lock-in Progress</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d263b' }}>{lockPct}%</span>
                </div>
                <div style={{ height: '8px', background: '#eaf1ee', borderRadius: '9px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{
                    height: '100%', borderRadius: '9px',
                    width: `${lockPct}%`,
                    background: `linear-gradient(90deg, ${schemeColor[inv.scheme]}, ${inv.scheme === 'A' ? '#58ae3f' : '#42a5f5'})`,
                    transition: 'width 0.8s ease',
                  }} />
                </div>
                <p style={{ fontSize: '11px', color: '#aab5be' }}>
                  Lock-in ends: {new Date(new Date(inv.startDate).setFullYear(new Date(inv.startDate).getFullYear() + (inv.scheme === 'A' ? 5 : 3))).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Past Reports */}
      <h3 className="section-title" style={{ marginBottom: '12px' }}>
        Past 3 Months
        <span className="activity-hint">Tap to expand</span>
      </h3>
      <div style={{ paddingBottom: '20px' }}>
        {pastReportsData.map(pr => <PastReportCard key={pr.id} pr={pr} />)}
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;
