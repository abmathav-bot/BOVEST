import React from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Investment agreement content.
  Edit the values in KEY_FACTS / REFUND_TABLE (cow death refund) / SECTIONS below to change what investors see.
*/

const KEY_FACTS = [
  { label: 'Your profit share', value: '20%' },
  { label: 'Lock-in period', value: '5 years' },
  { label: 'Payouts', value: 'Monthly' },
];

const REFUND_TABLE = [
  { period: '1 – 6 months', refund: '100%' },
  { period: '6 – 12 months', refund: '90%' },
  { period: 'Year 2 (0 – 6 months)', refund: '80%' },
  { period: 'Year 2 (6 – 12 months)', refund: '70%' },
  { period: 'Year 3', refund: '60%' },
  { period: '3 – 5 years', refund: '50%' },
  { period: 'After 5 years', refund: '50%', note: 'Automatic closure' },
];

const SECTIONS = [
  {
    title: 'Introduction',
    body: [
      'Bovest is a smart dairy investment model that lets you invest in a real dairy cow through a mobile app. The farm takes full responsibility for buying, managing, feeding and maintaining the cow, while you earn monthly income from its milk.',
      'It combines traditional dairy farming, modern mobile technology and transparent profit sharing.',
    ],
  },
  {
    title: 'How it works',
    body: [
      'One investor is linked to one real cow.',
      'You invest based on the current market price of a cow. The farm buys the cow with your money and keeps it on the farm.',
      'You can track everything about your cow in the app, so the investment is real, physical and transparent, never virtual or speculative.',
    ],
  },
  {
    title: 'Investment amount',
    body: [
      'The amount you invest depends on the cow you choose. For example, a ₹30,000 cow means a ₹30,000 investment, and a ₹50,000 cow means a ₹50,000 investment.',
      'Lower-cost cows generally give less milk and higher-cost cows give more, so you can pick what suits your budget.',
    ],
  },
  {
    title: 'Milk income & profit sharing',
    body: [
      'Milk from your cow is sold every day. First the income covers the cost of looking after the cow: feed, veterinary care, labour, water, electricity and farm maintenance. What is left is profit.',
      'For example, from 10 litres of milk a day, the value of 5 litres covers expenses and the value of the other 5 litres is profit.',
      'The profit is shared 20% to you, the investor, and the rest to the farm. Profit is calculated and credited every month.',
    ],
  },
  {
    title: 'Payouts',
    body: [
      'Payouts are credited to your registered bank account on or before the 5th of every month. You receive a payout slip for each one under Profile › Invoice / Invest History.',
    ],
  },
  {
    title: 'Lock-in period',
    body: [
      'Every investment has a mandatory lock-in of 5 years, with no premature withdrawal. Your investment amount is not returned on exit; a refund is only given if your cow dies, as set out under Cow death protection below.',
    ],
  },
  {
    title: 'Cow death protection',
    body: [
      'The only case in which your investment amount is returned is if your cow dies. The refund then depends on how long the investment lasted:',
    ],
    table: true,
    after: ['The farm may insure cows to reduce risk. Every case is verified before a refund is processed.'],
  },
  {
    title: 'Calf ownership',
    body: [
      'If your cow gives birth, the first calf belongs to you. All later calves belong to the farm. This gives you an extra asset while letting the farm grow.',
    ],
  },
  {
    title: 'Calf investment rules',
    body: [
      'Your calf follows the same profit-sharing rule as your cow.',
      'The calf investment is valid for 5 years. After 5 years you receive 45% of the calf’s value and ownership passes to the farm.',
    ],
  },
  {
    title: 'Selling a calf',
    body: ['If you sell your calf, 45% of the sale amount goes to you and 55% goes to the farm.'],
  },
  {
    title: 'If a calf dies',
    body: [
      'If the calf dies within 5 years, no refund is given. The calf is a bonus benefit, not your main investment.',
    ],
  },
  {
    title: 'Transparency in the app',
    body: [
      'The app shows your cow’s photo and ID, daily and monthly milk production, profit calculations, health and vaccination records, your investment timeline and your exit eligibility.',
    ],
  },
  {
    title: 'Your commitments',
    body: [
      'Returns depend on the cow’s performance and market conditions.',
      'The ID and address documents you submit must be genuine and valid.',
    ],
  },
];

const Chevron = () => (
  <svg className="agr-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Agreement = () => {
  const navigate = useNavigate();

  return (
    <div className="agr-page">
      <div className="agr-hero">
        <button type="button" className="agr-back" onClick={() => navigate('/profile')} aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2>Investment Agreement</h2>
        <p>Terms, conditions &amp; scheme details</p>

        <div className="agr-facts">
          {KEY_FACTS.map(f => (
            <div key={f.label}>
              <b>{f.value}</b>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="agr-body">
        {SECTIONS.map((s, i) => (
          <details key={s.title} className="agr-item" open={i === 0}>
            <summary>
              <span className="agr-num">{i + 1}</span>
              <span className="agr-title">{s.title}</span>
              <Chevron />
            </summary>
            <div className="agr-content">
              {s.body.map(p => <p key={p}>{p}</p>)}
              {s.table && (
                <div className="agr-table">
                  {REFUND_TABLE.map(r => (
                    <div key={r.period} className="agr-table-row">
                      <span>{r.period}{r.note && <small>{r.note}</small>}</span>
                      <b>{r.refund} refund</b>
                    </div>
                  ))}
                </div>
              )}
              {s.after?.map(p => <p key={p}>{p}</p>)}
            </div>
          </details>
        ))}

        <button
          type="button"
          className="agr-pdf"
          onClick={() => window.open('/farm-agreement.pdf', '_blank', 'noopener,noreferrer')}
        >
          View full agreement (PDF)
        </button>
      </div>
    </div>
  );
};

export default Agreement;
