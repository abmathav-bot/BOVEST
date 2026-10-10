import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { api } from '../utils/api';
import { TrendUpIcon, CalendarIcon, ShieldIcon, ChartIcon, MilkIcon } from '../components/Icons';

const schemeColor = { A: '#287b45' };

const PastReportCard = ({ pr }) => {
  const [expanded, setExpanded] = useState(false);
  const trendUp = pr.trend_up ?? true;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bv-blue-card bv-click-card ${expanded ? 'is-open' : ''}`}
      style={{ borderRadius: '18px', marginBottom: '12px', overflow: 'hidden', cursor: 'pointer', userSelect: 'none' }}
    >
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#0d263b', marginBottom: '4px' }}>{pr.month}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MilkIcon size={13} color="#7a8fa0" />
              <span style={{ fontSize: '12px', color: '#7a8fa0' }}>{pr.milk_total}</span>
              {pr.milk_trend && pr.milk_trend !== '—' && (
                <>
                  <span style={{ fontSize: '12px', color: '#ccc', margin: '0 2px' }}>·</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: trendUp ? '#287b45' : '#e05252' }}>
                    {pr.milk_trend}
                  </span>
                </>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#287b45', marginBottom: '4px' }}>
              +₹{Number(pr.investor_profit || 0).toLocaleString('en-IN')}
            </p>
            <span style={{ background: '#e8f5e9', color: '#287b45', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
              {pr.status || 'Credited'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '4px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>
      {expanded && (
        <div className="bv-card-details" style={{ padding: '0 16px 16px', borderTop: '1px solid #c6d6e6', marginTop: '4px' }}>
          {[
            { label: 'Gross Revenue', val: pr.gross_revenue || '—' },
            { label: 'Maintenance Cost', val: pr.maintenance_cost || '—' },
            { label: 'Net Payout', val: `₹${Number(pr.investor_profit || 0).toLocaleString('en-IN')}` },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #d5e2ee' }}>
              <span style={{ fontSize: '13px', color: '#7a8fa0' }}>{r.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d263b' }}>{r.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Reports = () => {
  const [investments, setInvestments] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.investments.list()
        .then(d => setInvestments(Array.isArray(d) ? d : (d.investments || [])))
        .catch(() => setInvestments([])),
      api.reports.monthly()
        .then(d => setMonthlyReports(d.monthly_reports || d.reports || []))
        .catch(() => setMonthlyReports([])),
      api.reports.portfolio()
        .then(d => setPortfolio(d))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const totalInvested = portfolio?.total_invested ?? investments.reduce((s, i) => s + (i.amount || 0), 0);
  const totalCows = portfolio?.total_cows ?? investments.reduce((s, i) => s + (i.cows_count || 0), 0);

  const emptyState = (Icon, title, subtitle) => (
    <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f7fbf4', borderRadius: '20px', marginBottom: '20px' }}>
      <div style={{ marginBottom: 10 }}><Icon size={40} color="#287b45" /></div>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#0d263b', marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: '12px', color: '#9aaba5' }}>{subtitle}</p>
    </div>
  );

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d263b 0%, #1a4163 100%)',
        borderRadius: '20px', padding: '24px 20px', marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(13,38,59,0.18)', marginTop: '16px',
      }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Investment Reports
        </p>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Portfolio Summary</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Total Invested', val: `₹${Number(totalInvested).toLocaleString('en-IN')}`, accent: 'rgba(46,229,157,0.15)' },
            { label: 'Monthly Return', val: portfolio?.month_return != null ? `₹${Number(portfolio.month_return).toLocaleString('en-IN')}` : '—', accent: 'rgba(251,191,36,0.15)' },
            { label: 'Active Cows', val: totalCows || '—', accent: 'rgba(167,139,250,0.15)' },
          ].map(s => (
            <div key={s.label} style={{ background: s.accent, borderRadius: '14px', padding: '12px 10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{s.val}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Cards */}
      <h3 className="section-title" style={{ marginBottom: '12px' }}>My Investments</h3>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9aaba5', padding: '20px 0' }}>Loading...</p>
      ) : investments.length === 0 ? (
        emptyState(ChartIcon, 'No Investments Yet', 'Your investment details will appear here once you invest in a scheme.')
      ) : (
        investments.map(inv => {
          const scheme = inv.scheme || 'A';
          const amount = Number(inv.amount) || 0;
          // Real figures from the milk records pushed to this investor (not an estimate)
          const monthEarned = Number(inv.month_earned) || 0;
          const totalEarned = Number(inv.total_earned) || 0;
          const roi = amount > 0 ? ((totalEarned / amount) * 100).toFixed(2) : '0.00';
          const startDate = inv.start_date || inv.startDate;
          const activeYears = startDate
            ? ((Date.now() - new Date(startDate)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
            : 0;
          const lockYears = 5;
          const lockPct = Math.min(100, Math.round((Number(activeYears) / lockYears) * 100));
          const lockEnd = startDate
            ? new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() + lockYears))
                .toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
            : '—';
          const color = schemeColor[scheme] || '#287b45';

          return (
            <div key={inv.id} className="bv-blue-card" style={{ borderRadius: '20px', marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ background: `${schemeColor.A}18`, color: schemeColor.A, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                      Scheme {inv.scheme}
                    </span>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0d263b', marginTop: '8px' }}>
                      Milk-Based Investment
                    </h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#e8f5e9', padding: '6px 12px', borderRadius: '20px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2ee59d' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#287b45' }}>Active</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Capital Deployed', val: `₹${Number(inv.amount).toLocaleString('en-IN')}` },
                    { label: 'Start Date', val: startDate ? new Date(startDate).toLocaleDateString('en-IN') : '—' },
                    { label: 'Active Period', val: `${activeYears} yrs` },
                    { label: 'Cows / Calves', val: `${inv.cows_count || 0} / ${inv.calves_count || 0}` },
                  ].map(m => (
                    <div key={m.label} style={{ background: '#ffffff', border: '1px solid #d5e2ee', borderRadius: '12px', padding: '12px' }}>
                      <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{m.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#0d263b' }}>{m.val}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { label: 'Earned This Month', val: `₹${monthEarned.toLocaleString('en-IN')}`, color: schemeColor.A },
                    { label: 'Total Earned', val: `₹${totalEarned.toLocaleString('en-IN')}`, color: '#d97706' },
                    { label: 'Return So Far', val: `${roi}%`, color: '#7c3aed' },
                  ].map(e => (
                    <div key={e.label} style={{ borderLeft: `3px solid ${e.color}`, background: '#ffffff', borderRadius: '0 10px 10px 0', padding: '10px' }}>
                      <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{e.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: e.color }}>{e.val}</p>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #c6d6e6', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldIcon size={14} color="#888" />
                      <span style={{ fontSize: '12px', color: '#7a8fa0' }}>Lock-in Progress</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d263b' }}>{lockPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#d5e2ee', borderRadius: '9px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{
                      height: '100%', borderRadius: '9px', width: `${lockPct}%`,
                      background: `linear-gradient(90deg, ${schemeColor.A}, #58ae3f)`,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: '11px', color: '#aab5be' }}>Lock-in ends: {lockEnd}</p>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Past Reports */}
      <h3 className="section-title" style={{ marginBottom: '12px' }}>
        Past 3 Months
        <span className="activity-hint">Tap to expand</span>
      </h3>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#9aaba5', padding: '12px 0' }}>Loading reports...</p>
      ) : monthlyReports.length === 0 ? (
        emptyState(CalendarIcon, 'No Reports Yet', 'Monthly payout reports will appear here after your first investment cycle.')
      ) : (
        <div style={{ paddingBottom: '20px' }}>
          {monthlyReports.map(pr => <PastReportCard key={pr.id} pr={pr} />)}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Reports;
