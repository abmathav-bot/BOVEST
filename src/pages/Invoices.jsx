import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../utils/api';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const fmtPeriod = (v) => (v ? new Date(`${v}-01`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—');

const ArrowLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const TABS = [
  { key: 'payout', label: 'Monthly Payouts' },
  { key: 'investment', label: 'Investment Invoices' },
];

/* ─── The slip / invoice itself ─── */
const Slip = ({ inv, user, onClose }) => {
  const isPayout = inv.type === 'payout';
  const investorId = user?.investor_id || `BOV-${String(user?.id || '').padStart(4, '0')}`;

  const rows = [
    isPayout && { label: 'Payout month', val: fmtPeriod(inv.period) },
    { label: 'Date', val: fmtDate(inv.issued_date) },
    { label: 'Payment mode', val: inv.payment_mode || '—' },
    { label: 'Reference / UTR', val: inv.reference_no || '—' },
    isPayout && { label: 'Credited to', val: inv.bank_name ? `${inv.bank_name}${inv.account_last4 ? ` · A/C ••••${inv.account_last4}` : ''}` : '—' },
    isPayout && inv.account_holder && { label: 'Account holder', val: inv.account_holder },
  ].filter(Boolean);

  return (
    <div className="slip-backdrop" onClick={onClose}>
      <div className="slip-sheet" onClick={e => e.stopPropagation()}>
        <div className="slip-paper">
          <div className="slip-head">
            <div>
              <p className="slip-brand">Bovest</p>
              <p className="slip-tag">Smart Dairy Investments</p>
            </div>
            <span className={`slip-status ${inv.status === 'Paid' ? 'paid' : 'pending'}`}>{inv.status}</span>
          </div>

          <p className="slip-title">{isPayout ? 'Payout Slip' : 'Investment Invoice'}</p>
          <p className="slip-no">{inv.invoice_no}</p>

          <div className="slip-amount">
            <span>{isPayout ? 'Amount credited' : 'Amount invested'}</span>
            <strong>{money(inv.amount)}</strong>
          </div>

          <div className="slip-party">
            <div>
              <span>Investor</span>
              <b>{user?.name}</b>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span>Investor ID</span>
              <b>{investorId}</b>
            </div>
          </div>

          <div className="slip-rows">
            {rows.map(r => (
              <div key={r.label} className="slip-row">
                <span>{r.label}</span>
                <b>{r.val}</b>
              </div>
            ))}
          </div>

          {inv.notes && <p className="slip-notes">{inv.notes}</p>}
          <p className="slip-foot">This is a computer-generated document issued by Bovest and does not need a signature.</p>
        </div>

        <div className="slip-actions no-print">
          <button type="button" className="slip-btn ghost" onClick={onClose}>Close</button>
          <button type="button" className="slip-btn" onClick={() => window.print()}>Print / Save PDF</button>
        </div>
      </div>
    </div>
  );
};

const Invoices = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [tab, setTab] = useState('payout');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api.invoices.list()
      .then(d => { setItems(d.invoices || []); setSetupNeeded(!!d.setup_needed); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => items.filter(i => i.type === tab), [items, tab]);
  const totalReceived = items.filter(i => i.type === 'payout' && i.status === 'Paid').reduce((s, i) => s + Number(i.amount), 0);
  const totalInvested = items.filter(i => i.type === 'investment').reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="inv-page">
      <div className="inv-hero">
        <button type="button" className="inv-back" onClick={() => navigate('/profile')}><ArrowLeft /></button>
        <h2>Invoice / Invest History</h2>
        <p>Your investment invoices and monthly payout slips</p>
        <div className="inv-totals">
          <div><span>Total payouts received</span><b>{money(totalReceived)}</b></div>
          <div><span>Total invested</span><b>{money(totalInvested)}</b></div>
        </div>
      </div>

      <div className="inv-body">
        <div className="inv-tabs">
          {TABS.map(t => (
            <button key={t.key} type="button" className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <p className="inv-empty">Loading…</p>
        ) : setupNeeded ? (
          <p className="inv-empty">This section is being set up. Please check back soon.</p>
        ) : shown.length === 0 ? (
          <p className="inv-empty">
            {tab === 'payout' ? 'No payout slips yet. They appear here after each monthly payout.' : 'No investment invoices yet.'}
          </p>
        ) : (
          shown.map(inv => (
            <button key={inv.id} type="button" className="inv-card" onClick={() => setOpen(inv)}>
              <div className="inv-card-main">
                <p className="inv-card-title">
                  {inv.type === 'payout' ? fmtPeriod(inv.period) : 'Investment invoice'}
                </p>
                <p className="inv-card-sub">{inv.invoice_no} · {fmtDate(inv.issued_date)}</p>
                {inv.type === 'payout' && inv.bank_name && (
                  <p className="inv-card-sub">{inv.bank_name}{inv.account_last4 ? ` ••••${inv.account_last4}` : ''}</p>
                )}
              </div>
              <div className="inv-card-side">
                <b>{inv.type === 'payout' ? '+' : ''}{money(inv.amount)}</b>
                <span className={`slip-status small ${inv.status === 'Paid' ? 'paid' : 'pending'}`}>{inv.status}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {open && <Slip inv={open} user={user} onClose={() => setOpen(null)} />}
    </div>
  );
};

export default Invoices;
