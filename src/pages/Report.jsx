import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const Icon = ({ d, d2, size = 18, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
    {d2 && <path d={d2} />}
  </svg>
);

const ic = {
  barChart:    'M18 20V10M12 20V4M6 20v-6',
  check:       'M20 6L9 17l-5-5',
  x:           'M18 6L6 18M6 6l12 12',
  alert:       'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  refresh:     'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  zap:         'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  clipboard:   'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z',
  helpCircle:  'M12 2a10 10 0 100 20A10 10 0 0012 2zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01',
  printer:     'M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z',
  arrowLeft:   'M19 12H5M12 5l-7 7 7 7',
  loader:      'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  type:        'M4 7V4h16v3M9 20h6M12 4v16',
  mic:         'M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zM8 11a4 4 0 008 0M12 19v4M8 23h8',
  award:       'M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  trendUp:     'M23 6l-9.5 9.5-5-5L1 18',
  messageQ:    'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z',
  star:        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  calendar:    'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  hash:        'M4 9h16M4 15h16M10 3l-4 18M14 3l-4 18',
  briefcase:   'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  users:       'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  send:        'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  engagement:  'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
  checkCircle: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  mail:        'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  clock:       'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  white:       '#FFFFFF',
  grey50:      '#F8F9FB',
  grey100:     '#F0F2F7',
  grey200:     '#E2E6EF',
  grey300:     '#CBD5E1',
  grey400:     '#9CA3B8',
  grey600:     '#6B7280',
  grey700:     '#374151',
  grey900:     '#111827',
  purple:      '#7C3AED',
  purpleLight: '#EDE9FE',
  purpleMid:   '#A78BFA',
  purpleDark:  '#4C1D95',
  green:       '#059669',
  greenLight:  '#D1FAE5',
  greenMid:    '#6EE7B7',
  red:         '#DC2626',
  redLight:    '#FEE2E2',
  amber:       '#D97706',
  amberLight:  '#FEF3C7',
  blue:        '#2563EB',
  blueLight:   '#DBEAFE',
  teal:        '#0D9488',
  tealLight:   '#CCFBF1',
};

const scoreColor = (n) => {
  if (n >= 80) return C.green;
  if (n >= 60) return C.blue;
  if (n >= 40) return C.amber;
  return C.red;
};
const scoreBg = (n) => {
  if (n >= 80) return C.greenLight;
  if (n >= 60) return C.blueLight;
  if (n >= 40) return C.amberLight;
  return C.redLight;
};
const scoreLabel = (n) => {
  if (n >= 80) return 'Excellent';
  if (n >= 60) return 'Good';
  if (n >= 40) return 'Average';
  return 'Needs Work';
};
const scoreIcon = (n) => {
  if (n >= 80) return '🌟';
  if (n >= 60) return '👍';
  if (n >= 40) return '👌';
  return '💪';
};
const recColor = (r = '') => {
  if (r.includes('Strongly')) return C.green;
  if (r.includes('Recommend')) return C.blue;
  if (r.includes('Consider')) return C.amber;
  return C.grey600;
};
const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return d; }
};

const font = "'Poppins', sans-serif";

const card = {
  background: C.white,
  borderRadius: '14px',
  border: `1px solid ${C.grey200}`,
  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
  overflow: 'hidden',
};

const sectionTitle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: C.grey900,
  letterSpacing: '-0.01em',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const label = {
  fontSize: '0.7rem',
  fontWeight: 700,
  color: C.grey400,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

const body = {
  fontSize: '0.875rem',
  color: C.grey600,
  lineHeight: 1.7,
  fontFamily: font,
};

const chip = (bg, color) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: '999px',
  background: bg,
  color: color,
  fontSize: '0.75rem',
  fontWeight: 600,
});

const btn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '7px',
  height: '42px',
  padding: '0 20px',
  borderRadius: '9px',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: font,
  textDecoration: 'none',
  transition: 'filter 0.15s',
};

// ─── Circular progress ring ───────────────────────────────────────────────────
const Ring = ({ value, size = 100, stroke = 8, showPercentage = true }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = scoreColor(value);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={C.grey100} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 2
      }}>
        {showPercentage ? (
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: C.grey900, lineHeight: 1 }}>
            {value}%
          </span>
        ) : (
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{scoreIcon(value)}</span>
        )}
      </div>
    </div>
  );
};

// ─── Score metric card ────────────────────────────────────────────────────────
const MetricCard = ({ label: lbl, value, showPercentage = true }) => (
  <div style={{ ...card, padding: '1.25rem', textAlign: 'center' }}>
    <Ring value={value} size={88} stroke={7} showPercentage={showPercentage} />
    <div style={{ ...label, display: 'block', marginBottom: '4px', marginTop: '8px' }}>{lbl}</div>
    <div style={chip(scoreBg(value), scoreColor(value))}>
      {scoreLabel(value)}
    </div>
  </div>
);

// ─── Question item (company only) ────────────────────────────────────────────
const QuestionItem = ({ qa, index, showPercentage = true }) => {
  const qScore = qa.score || 0;
  const isText = qa.mode === 'text' || !qa.mode;

  return (
    <div style={{ border: `1px solid ${C.grey200}`, borderRadius: '12px',
      overflow: 'hidden', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1.125rem', background: C.grey50,
        borderBottom: `1px solid ${C.grey200}`, gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={chip(C.purpleLight, C.purple)}>Q{qa.question_number || index + 1}</span>
          <span style={chip(isText ? C.blueLight : C.amberLight, isText ? C.blue : C.amber)}>
            <Icon d={isText ? ic.type : ic.mic} size={11} color={isText ? C.blue : C.amber} />
            {isText ? 'Text' : 'Voice'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: C.grey200, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${qScore}%`, background: scoreColor(qScore),
              borderRadius: 3, transition: 'width 0.6s ease' }} />
          </div>
          {showPercentage ? (
            <span style={chip(scoreBg(qScore), scoreColor(qScore))}>{qScore}%</span>
          ) : (
            <span style={chip(scoreBg(qScore), scoreColor(qScore))}>{scoreLabel(qScore)}</span>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem 1.125rem' }}>
        <p style={{ margin: '0 0 0.875rem', fontSize: '0.9rem', fontWeight: 600,
          color: C.grey900, lineHeight: 1.6 }}>{qa.question}</p>
        <div style={{ background: C.grey50, border: `1px solid ${C.grey100}`,
          borderRadius: '8px', padding: '0.875rem', marginBottom: '0.75rem' }}>
          <div style={{ ...label, marginBottom: '6px' }}>Candidate's Answer</div>
          <p style={{ ...body, fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap' }}>
            {qa.answer || 'No answer recorded'}
          </p>
        </div>
        {qa.feedback && (
          <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start',
            padding: '0.75rem', background: C.purpleLight, borderRadius: '8px',
            border: `1px solid ${C.purple}20` }}>
            <Icon d={ic.helpCircle} size={15} color={C.purple} />
            <p style={{ ...body, fontSize: '0.83rem', margin: 0, color: C.purpleDark }}>
              <strong>Feedback:</strong> {qa.feedback}
            </p>
          </div>
        )}
        {(qa.confidence_score != null || qa.clarity_score != null || qa.engagement_score != null) && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {qa.confidence_score != null && (
              <span style={chip(scoreBg(qa.confidence_score), scoreColor(qa.confidence_score))}>
                ⚡ Confidence: {showPercentage ? `${qa.confidence_score}%` : scoreLabel(qa.confidence_score)}
              </span>
            )}
            {qa.clarity_score != null && (
              <span style={chip(scoreBg(qa.clarity_score), scoreColor(qa.clarity_score))}>
                🎯 Clarity: {showPercentage ? `${qa.clarity_score}%` : scoreLabel(qa.clarity_score)}
              </span>
            )}
            {qa.engagement_score != null && (
              <span style={chip(scoreBg(qa.engagement_score), scoreColor(qa.engagement_score))}>
                ✍️ Engagement: {showPercentage ? `${qa.engagement_score}%` : scoreLabel(qa.engagement_score)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CANDIDATE VIEW — Simple & Friendly ──────────────────────────────────────
const CandidateView = ({ report, sessionId, user }) => {
  const overall = report.overall_score || 0;

  // Friendly message based on score
  const getMessage = () => {
    if (overall >= 80) return {
      emoji: '🎉',
      title: 'Great Interview!',
      subtitle: 'You did really well. The team was impressed with your responses.',
      color: C.green,
      bg: C.greenLight,
    };
    if (overall >= 60) return {
      emoji: '👍',
      title: 'Good Job!',
      subtitle: 'You gave a solid interview. Keep up the good work.',
      color: C.blue,
      bg: C.blueLight,
    };
    if (overall >= 40) return {
      emoji: '💪',
      title: 'Interview Completed!',
      subtitle: 'Thank you for completing the interview. Keep practicing to improve.',
      color: C.amber,
      bg: C.amberLight,
    };
    return {
      emoji: '✨',
      title: 'Interview Completed!',
      subtitle: 'Thank you for taking the time to interview. Every attempt is a learning experience.',
      color: C.purple,
      bg: C.purpleLight,
    };
  };

  const msg = getMessage();

  return (
    <Page>
      <div style={{ maxWidth: 600, margin: '0 auto', width: '100%', padding: '0 1rem' }}>

        {/* ── Hero card ── */}
        <div style={{
          ...card,
          background: `linear-gradient(135deg, ${C.purpleDark} 0%, ${C.purple} 60%, ${C.purpleMid} 100%)`,
          border: 'none',
          marginBottom: '1.25rem',
          textAlign: 'center',
          padding: '3rem 2rem',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{msg.emoji}</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: C.white,
            margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
            {msg.title}
          </h1>
          <p style={{ ...body, color: `${C.white}CC`, fontSize: '1rem',
            margin: '0 auto', maxWidth: 400 }}>
            {msg.subtitle}
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <span style={{
              ...chip(`${C.white}20`, C.white),
              fontSize: '0.85rem',
              border: `1px solid ${C.white}30`,
              padding: '6px 16px',
            }}>
              <Icon d={ic.calendar} size={13} color={C.white} />
              {formatDate(report.completion_date || report.interview_date)}
            </span>
          </div>
        </div>

        {/* ── Interview completed confirmation ── */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: C.greenLight, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon d={ic.checkCircle} size={22} color={C.green} sw={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.grey900, fontSize: '0.95rem', marginBottom: '4px' }}>
                Interview Submitted Successfully
              </div>
              <p style={{ ...body, fontSize: '0.875rem', margin: 0 }}>
                Your interview has been recorded and sent to the hiring team for review.
                You answered {report.answered_questions || 0} out of {report.total_questions || 5} questions.
              </p>
            </div>
          </div>
        </div>

        {/* ── What happens next ── */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.grey100}`,
            display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: C.purpleLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ic.clock} size={16} color={C.purple} />
            </div>
            <span style={sectionTitle}>What Happens Next?</span>
          </div>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            {[
              { icon: ic.clipboard, color: C.purple, bg: C.purpleLight, text: 'Your interview responses are being reviewed by the hiring team.' },
              { icon: ic.users,     color: C.blue,   bg: C.blueLight,   text: 'The team will evaluate your answers and match your profile with the role.' },
              { icon: ic.mail,      color: C.green,  bg: C.greenLight,  text: 'If shortlisted, the company will reach out to you directly via email or phone.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '0.75rem 0',
                borderBottom: i < 2 ? `1px solid ${C.grey100}` : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={step.icon} size={16} color={step.color} />
                </div>
                <p style={{ ...body, fontSize: '0.875rem', margin: 0, paddingTop: '6px' }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip card ── */}
        <div style={{
          ...card,
          marginBottom: '1.75rem',
          background: C.purpleLight,
          border: `1px solid ${C.purple}20`,
        }}>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💡</div>
            <div>
              <div style={{ fontWeight: 700, color: C.purpleDark, fontSize: '0.9rem', marginBottom: '4px' }}>
                Pro Tip
              </div>
              <p style={{ ...body, color: C.purpleDark, fontSize: '0.85rem', margin: 0 }}>
                While you wait, keep applying to other positions. The more interviews you do, the more confident you become!
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center',
          flexWrap: 'wrap', paddingBottom: '2rem' }}>
          <Link to="/my-applications"
            style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
            <Icon d={ic.arrowLeft} size={14} color={C.grey700} />
            Back to Applications
          </Link>
          <Link to="/jobs"
            style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}35` }}>
            <Icon d={ic.briefcase} size={14} color={C.white} />
            Browse More Jobs
          </Link>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        button:hover, a:hover { filter: brightness(0.92); }
      `}</style>
    </Page>
  );
};

// ─── PUBLIC VIEW — Minimal ────────────────────────────────────────────────────
const PublicView = ({ report, sessionId }) => (
  <Page>
    <div style={{ maxWidth: 500, margin: '0 auto', width: '100%', padding: '0 1rem' }}>
      <div style={{ ...card, textAlign: 'center', padding: '3rem 2rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: C.grey900, margin: '0 0 0.75rem' }}>
          Interview Completed
        </h2>
        <p style={{ ...body, margin: '0 0 1.5rem' }}>
          This interview report is private. Please log in to view the details.
        </p>
        <Link to="/login"
          style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}35` }}>
          Login to View
        </Link>
      </div>
    </div>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
      button:hover, a:hover { filter: brightness(0.92); }
    `}</style>
  </Page>
);

// ─── COMPANY VIEW — Full Detail ───────────────────────────────────────────────
const CompanyView = ({ report, sessionId, user, candidateInfo, fetchReport }) => {
  const overall = report.overall_score || 0;

  return (
    <Page>
      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '0 1rem' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          <div>
            <div style={label}>Interview Report</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.grey900, margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
              Performance Summary
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ ...chip(C.grey100, C.grey600), fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                <Icon d={ic.hash} size={11} color={C.grey600} />
                {report.session_id || sessionId}
              </div>
              {(report.completion_date || report.interview_date) && (
                <div style={chip(C.grey100, C.grey600)}>
                  <Icon d={ic.calendar} size={11} color={C.grey600} />
                  {formatDate(report.completion_date || report.interview_date)}
                </div>
              )}
              {candidateInfo && (
                <div style={chip(C.blueLight, C.blue)}>
                  <Icon d={ic.users} size={11} color={C.blue} />
                  {candidateInfo.name}
                </div>
              )}
              <div style={chip(C.greenLight, C.green)}>
                <Icon d={ic.briefcase} size={11} color={C.green} />
                Company View
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={fetchReport}
              style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
              <Icon d={ic.refresh} size={14} color={C.grey700} />
              Refresh
            </button>
            <button onClick={() => window.print()}
              style={{ ...btn, background: C.white, color: C.purple, border: `1.5px solid ${C.purple}` }}>
              <Icon d={ic.printer} size={14} color={C.purple} />
              Print
            </button>
          </div>
        </div>

        {/* ── Overall score banner ── */}
        <div style={{ ...card,
          background: `linear-gradient(135deg, ${C.purpleDark} 0%, ${C.purple} 60%, ${C.purpleMid} 100%)`,
          border: 'none', marginBottom: '1.25rem' }}>
          <div style={{ padding: '2rem 2.5rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ ...label, color: `${C.white}80` }}>Overall Score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: C.white, lineHeight: 1 }}>
                  {overall}
                </span>
                <span style={{ fontSize: '1.5rem', color: `${C.white}80`, fontWeight: 600 }}>/ 100</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <span style={{ ...chip(`${C.white}20`, C.white), fontSize: '0.85rem',
                  border: `1px solid ${C.white}30` }}>
                  <Icon d={ic.award} size={13} color={C.white} />
                  {report.recommendation || 'No recommendation'}
                </span>
              </div>
            </div>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={60} cy={60} r={50} fill="none" stroke={`${C.white}20`} strokeWidth={10} />
                <circle cx={60} cy={60} r={50} fill="none"
                  stroke={C.white} strokeWidth={10}
                  strokeDasharray={`${(overall / 100) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={ic.star} size={28} color={C.white} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Score metrics ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px', marginBottom: '1.25rem' }}>
          <MetricCard label="Engagement" value={report.engagement_score || 0} showPercentage={true} />
          <MetricCard label="Confidence" value={report.confidence_score || 0} showPercentage={true} />
          <MetricCard label="Clarity"    value={report.clarity_score || 0}    showPercentage={true} />
          <div style={{ ...card, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
              <svg width={88} height={88} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={44} cy={44} r={36} fill="none" stroke={C.grey100} strokeWidth={7} />
                <circle cx={44} cy={44} r={36} fill="none"
                  stroke={C.purple} strokeWidth={7}
                  strokeDasharray={`${((report.answered_questions || 0) / (report.total_questions || 5)) * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                <Icon d={ic.clipboard} size={14} color={C.purple} />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: C.grey900, lineHeight: 1 }}>
                  {report.answered_questions || 0}/{report.total_questions || 5}
                </span>
              </div>
            </div>
            <div style={{ ...label, display: 'block', marginBottom: '4px' }}>Questions</div>
            <div style={chip(C.purpleLight, C.purple)}>Answered</div>
          </div>
        </div>

        {/* ── Summary ── */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.grey100}`,
            display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: C.purpleLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ic.barChart} size={16} color={C.purple} />
            </div>
            <span style={sectionTitle}>Interview Summary</span>
          </div>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <p style={{ ...body, fontSize: '0.925rem', margin: 0 }}>
              {report.summary || 'No summary available.'}
            </p>
          </div>
        </div>

        {/* ── Strengths & Weaknesses ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={card}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${C.grey100}`,
              display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '7px', background: C.greenLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={ic.check} size={15} color={C.green} sw={2.5} />
              </div>
              <span style={{ ...sectionTitle, fontSize: '0.9rem' }}>Strengths</span>
            </div>
            <ul style={{ margin: 0, padding: '0.5rem 0', listStyle: 'none' }}>
              {report.strengths?.length > 0 ? report.strengths.map((s, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px',
                  padding: '0.625rem 1.25rem',
                  borderBottom: i < report.strengths.length - 1 ? `1px solid ${C.grey100}` : 'none' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.greenLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Icon d={ic.check} size={10} color={C.green} sw={2.5} />
                  </div>
                  <span style={{ ...body, fontSize: '0.85rem', color: C.grey700 }}>{s}</span>
                </li>
              )) : (
                <li style={{ padding: '1rem 1.25rem', ...body, fontSize: '0.85rem' }}>No specific strengths recorded.</li>
              )}
            </ul>
          </div>
          <div style={card}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${C.grey100}`,
              display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '7px', background: C.amberLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={ic.trendUp} size={15} color={C.amber} />
              </div>
              <span style={{ ...sectionTitle, fontSize: '0.9rem' }}>Areas to Improve</span>
            </div>
            <ul style={{ margin: 0, padding: '0.5rem 0', listStyle: 'none' }}>
              {report.weaknesses?.length > 0 ? report.weaknesses.map((w, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px',
                  padding: '0.625rem 1.25rem',
                  borderBottom: i < report.weaknesses.length - 1 ? `1px solid ${C.grey100}` : 'none' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.amberLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Icon d={ic.alert} size={10} color={C.amber} sw={2} />
                  </div>
                  <span style={{ ...body, fontSize: '0.85rem', color: C.grey700 }}>{w}</span>
                </li>
              )) : (
                <li style={{ padding: '1rem 1.25rem', ...body, fontSize: '0.85rem' }}>Keep up the good work!</li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Question Analysis ── */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.grey100}`,
            display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: C.purpleLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ic.messageQ} size={16} color={C.purple} />
            </div>
            <span style={sectionTitle}>Question Analysis</span>
            {report.question_analysis?.length > 0 && (
              <span style={{ ...chip(C.grey100, C.grey600), marginLeft: 'auto' }}>
                {report.question_analysis.length} questions
              </span>
            )}
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            {report.question_analysis?.length > 0
              ? report.question_analysis.map((qa, i) => (
                  <QuestionItem key={i} qa={qa} index={i} showPercentage={true} />
                ))
              : <p style={{ ...body, textAlign: 'center', padding: '2rem 0' }}>No question analysis available.</p>
            }
          </div>
        </div>

        {/* ── Candidate Contact ── */}
        {candidateInfo && (
          <div style={{ ...card, marginBottom: '1.75rem', border: `1px solid ${C.green}30`, background: C.greenLight }}>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ ...label, color: C.green }}>Candidate Contact</div>
                <p style={{ ...body, color: C.grey900, marginTop: '4px', fontSize: '0.9rem' }}>
                  {candidateInfo.name} • {candidateInfo.email}
                </p>
                {candidateInfo.phone && (
                  <p style={{ ...body, color: C.grey900, fontSize: '0.85rem' }}>{candidateInfo.phone}</p>
                )}
              </div>
              <button onClick={() => window.location.href = `mailto:${candidateInfo.email}`}
                style={{ ...btn, background: C.green, color: C.white }}>
                <Icon d={ic.send} size={14} color={C.white} />
                Contact Candidate
              </button>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center',
          flexWrap: 'wrap', paddingBottom: '2rem' }}>
          <Link to="/company/dashboard"
            style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
            <Icon d={ic.arrowLeft} size={14} color={C.grey700} />
            Back to Dashboard
          </Link>
          <button onClick={() => window.print()}
            style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}35` }}>
            <Icon d={ic.printer} size={14} color={C.white} />
            Print Report
          </button>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        button:hover, a:hover { filter: brightness(0.92); }
        @media print {
          nav, footer { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </Page>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Report = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [user, setUser]               = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [companyInfo, setCompanyInfo]     = useState(null);

  const API_URL = (process.env.REACT_APP_API_URL || 'https://fazeelayazqasimi-botboss-updated-backend.hf.space').replace(/\/$/, '');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      setLoading(true); setError('');
      const r = await fetch(`${API_URL}/interview/report/${sessionId}`);
      if (!r.ok) throw new Error(r.status === 404
        ? 'Report not found. The interview may not be completed yet.'
        : 'Failed to fetch report');
      const reportData = await r.json();
      setReport(reportData);

      try {
        const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
        const found = candidates.find(c => c.id === reportData.candidateId || c.name === reportData.candidate_name);
        if (found) setCandidateInfo(found);
      } catch (e) {}

      try {
        const companies = JSON.parse(localStorage.getItem('companies') || '[]');
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const job = jobs.find(j => j.id === reportData.jobId);
        if (job) {
          const found = companies.find(c => c.id === job.companyId);
          if (found) setCompanyInfo(found);
        }
      } catch (e) {}

    } catch (e) {
      setError(e.message || 'Could not load interview report');
    } finally { setLoading(false); }
  };

  const isCandidateView = () => {
    if (!user || !report) return false;
    if (user.type !== 'candidate') return false;
    if (report.candidateId && user.profileId) return report.candidateId === user.profileId;
    if (report.candidate_name && user.name) return report.candidate_name === user.name;
    return false;
  };

  const isCompanyView = () => {
    if (!user || !report) return false;
    return user.type === 'company';
  };

  // ── Loading ──
  if (loading) return (
    <Page>
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '1rem' }}>
          <Icon d={ic.loader} size={36} color={C.purple} />
        </div>
        <div style={{ fontWeight: 600, color: C.grey900, fontSize: '1.05rem' }}>Loading your report…</div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </Page>
  );

  // ── Error ──
  if (error || !report) return (
    <Page>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ ...card, padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.redLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Icon d={ic.alert} size={26} color={C.red} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: C.grey900, margin: 0 }}>Report Not Found</h2>
          <p style={{ ...body, margin: '0.75rem 0 1.5rem' }}>{error || 'Could not load the interview report'}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={fetchReport}
              style={{ ...btn, background: C.purple, color: C.white }}>
              <Icon d={ic.refresh} size={15} color={C.white} />
              Retry
            </button>
            <Link to="/my-applications"
              style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
              My Applications
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );

  // ── Route to correct view ──
  if (isCompanyView())   return <CompanyView   report={report} sessionId={sessionId} user={user} candidateInfo={candidateInfo} fetchReport={fetchReport} />;
  if (isCandidateView()) return <CandidateView report={report} sessionId={sessionId} user={user} />;
  return <PublicView report={report} sessionId={sessionId} />;
};

const Page = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
    background: C.grey50, fontFamily: font }}>
    <Navbar />
    <main style={{ flex: 1, padding: '2rem 1rem' }}>{children}</main>
    <Footer />
  </div>
);

export default Report;
