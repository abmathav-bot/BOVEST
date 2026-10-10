import React from 'react';
import { useNavigate } from 'react-router-dom';

const PHONE_DISPLAY = '+91 63833 14975';
const PHONE_DIGITS = '916383314975';
const EMAIL = 'engineertecher@gmail.com';

const ArrowLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const OPTIONS = [
  {
    key: 'call',
    title: 'Call us',
    value: PHONE_DISPLAY,
    href: `tel:+${PHONE_DIGITS}`,
    Icon: PhoneIcon,
    cls: 'call',
  },
  {
    key: 'whatsapp',
    title: 'WhatsApp us',
    value: PHONE_DISPLAY,
    href: `https://wa.me/${PHONE_DIGITS}`,
    Icon: WhatsAppIcon,
    cls: 'whatsapp',
    external: true,
  },
  {
    key: 'mail',
    title: 'Email us',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    Icon: MailIcon,
    cls: 'mail',
  },
];

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="sup-page">
      <div className="sup-hero">
        <button type="button" className="sup-back" onClick={() => navigate('/profile')}><ArrowLeft /></button>
        <h2>Support</h2>
        <p>We are here to help you</p>
      </div>

      <div className="sup-body">
        {OPTIONS.map(({ key, title, value, href, Icon, cls, external }) => (
          <a
            key={key}
            className={`sup-card ${cls}`}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="sup-icon"><Icon /></span>
            <span className="sup-text">
              <b>{title}</b>
              <span>{value}</span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sup-chevron">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Support;
