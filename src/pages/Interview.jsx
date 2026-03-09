import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Inline SVG Icons (no extra library) ───────────────────────────────────
const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  video:       'M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  mic:         'M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zM8 11a4 4 0 008 0M12 19v4M8 23h8',
  micOff:      'M1 1l22 22M9 9v3a3 3 0 005.12 2.12M15 9.34V5a3 3 0 00-5.94-.6M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8',
  type:        'M4 7V4h16v3M9 20h6M12 4v16',
  send:        'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  stop:        'M6 6h12v12H6z',
  check:       'M20 6L9 17l-5-5',
  alert:       'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  plug:        'M18.36 6.64a9 9 0 11-12.73 0M12 2v10',
  refresh:     'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  briefcase:   'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  clock:       'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2',
  eye:         'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  loader:      'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  info:        'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 16v-4M12 8h.01',
  arrowRight:  'M5 12h14M12 5l7 7-7 7',
  star:        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
};

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  white:       '#FFFFFF',
  grey50:      '#F8F9FB',
  grey100:     '#F0F2F7',
  grey200:     '#E2E6EF',
  grey400:     '#9CA3B8',
  grey600:     '#6B7280',
  grey900:     '#111827',
  purple:      '#7C3AED',
  purpleLight: '#EDE9FE',
  purpleMid:   '#A78BFA',
  purpleDark:  '#4C1D95',
  green:       '#059669',
  greenLight:  '#D1FAE5',
  red:         '#DC2626',
  redLight:    '#FEE2E2',
  amber:       '#D97706',
  amberLight:  '#FEF3C7',
  blue:        '#2563EB',
  blueLight:   '#DBEAFE',
};

const s = {
  // Layout
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: C.grey50,
    fontFamily: "'Poppins', sans-serif",
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  container: {
    width: '100%',
    maxWidth: '780px',
  },

  // Cards
  card: {
    background: C.white,
    borderRadius: '16px',
    border: `1px solid ${C.grey200}`,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  cardPad: { padding: '2.5rem' },

  // Chip / Badge
  chip: (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '999px',
    background: bg,
    color: color,
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  }),

  // Progress bar
  progressTrack: {
    height: '4px',
    background: C.grey100,
    borderRadius: 0,
  },
  progressFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${C.purple}, ${C.purpleMid})`,
    transition: 'width 0.5s ease',
    borderRadius: 0,
  }),

  // Section divider
  divider: {
    height: '1px',
    background: C.grey100,
    margin: '0',
  },

  // Typography
  h1: {
    fontSize: '1.625rem',
    fontWeight: 700,
    color: C.grey900,
    margin: 0,
    lineHeight: 1.25,
  },
  h2: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: C.grey900,
    margin: 0,
  },
  body: {
    fontSize: '0.9rem',
    color: C.grey600,
    lineHeight: 1.65,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: C.grey400,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  // Buttons
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0 24px',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Poppins', sans-serif",
    whiteSpace: 'nowrap',
  },
  btnPrimary: {
    background: C.purple,
    color: C.white,
    boxShadow: `0 2px 12px ${C.purple}40`,
  },
  btnOutline: {
    background: C.white,
    color: C.purple,
    border: `1.5px solid ${C.purple}`,
  },
  btnGhost: {
    background: C.grey100,
    color: C.grey600,
    border: `1.5px solid ${C.grey200}`,
  },
  btnDanger: {
    background: C.red,
    color: C.white,
    boxShadow: `0 2px 12px ${C.red}30`,
  },
  btnSuccess: {
    background: C.green,
    color: C.white,
    boxShadow: `0 2px 12px ${C.green}30`,
  },
  btnDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },

  // Question card
  questionBox: {
    background: C.grey50,
    border: `1px solid ${C.grey200}`,
    borderRadius: '12px',
    padding: '1.5rem',
    fontSize: '1.05rem',
    fontWeight: 500,
    color: C.grey900,
    lineHeight: 1.7,
  },

  // Timer
  timerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  // Textarea
  textarea: {
    width: '100%',
    padding: '1rem',
    border: `1.5px solid ${C.grey200}`,
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontFamily: "'Poppins', sans-serif",
    color: C.grey900,
    minHeight: '140px',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: C.white,
    boxSizing: 'border-box',
  },

  // Video
  videoWrap: {
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    background: C.grey900,
    position: 'relative',
    aspectRatio: '16/9',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  // Mode tabs
  tabRow: {
    display: 'flex',
    background: C.grey100,
    borderRadius: '10px',
    padding: '4px',
    gap: '4px',
  },
  tab: (active) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '8px 16px',
    borderRadius: '7px',
    border: 'none',
    background: active ? C.white : 'transparent',
    color: active ? C.purple : C.grey600,
    fontWeight: active ? 600 : 500,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
    fontFamily: "'Poppins', sans-serif",
  }),

  // Status dot
  dot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),

  // Alert / notice
  notice: (bg, border, color) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 16px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '10px',
    color: color,
    fontSize: '0.85rem',
    lineHeight: 1.55,
  }),

  // Eye contact overlay
  eyeOverlay: {
    position: 'absolute',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: C.red,
    color: C.white,
    padding: '6px 16px',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },

  // Rec indicator
  recDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: C.red,
    animation: 'blink 1.2s ease-in-out infinite',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────
const Interview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('initial');
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [eyeContactWarning, setEyeContactWarning] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [answerText, setAnswerText] = useState('');
  const [inputMode, setInputMode] = useState('text');
  const [processing, setProcessing] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(true);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const eyeCheckRef = useRef(null);

  const API_URL = 'https://Fazeelayazqasimi-botboss-backend.hf.space';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'candidate') { navigate('/login'); return; }
    setUser(userData);
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobData = jobs.find(j => j.id === parseInt(jobId));
    if (jobData) setJob(jobData);
    else navigate('/jobs');
    checkBackendConnection();
    checkVoiceAvailability();
  }, [jobId, navigate]);

  const checkVoiceAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVoiceAvailable(devices.some(d => d.kind === 'audioinput'));
    } catch { setVoiceAvailable(false); }
  };

  const checkBackendConnection = async () => {
    try {
      const r = await fetch(`${API_URL}/`);
      if (r.ok) { setBackendStatus('connected'); setError(''); }
      else { setBackendStatus('error'); setError('Backend not responding'); }
    } catch { setBackendStatus('error'); setError('Cannot connect to backend'); }
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (eyeCheckRef.current) clearInterval(eyeCheckRef.current);
    if (mediaRecorderRef.current && isRecording)
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
  }, []);

  useEffect(() => {
    if (status === 'recording' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && status === 'recording') stopRecording();
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, status]);

  useEffect(() => {
    if (status === 'recording') {
      eyeCheckRef.current = setInterval(() => {
        if (Math.random() > 0.7) {
          setEyeContactWarning(true);
          setTimeout(() => setEyeContactWarning(false), 2000);
        }
      }, 5000);
    }
    return () => clearInterval(eyeCheckRef.current);
  }, [status]);

  const startInterview = async () => {
    try {
      setStatus('loading'); setError('');
      const r = await fetch(`${API_URL}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: job.description }),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setSessionId(data.session_id);
      setTotalQuestions(data.questions_count || 5);
      await getNextQuestion(data.session_id);
    } catch (e) {
      setError('Failed to start interview. Please try again.');
      setStatus('initial');
    }
  };

  const getNextQuestion = async (sid) => {
    try {
      const r = await fetch(`${API_URL}/interview/next/${sid}`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      if (data.message === 'Interview Completed' || data.status === 'completed') {
        setStatus('completed');
        setTimeout(() => navigate(`/report/${sid}`), 2000);
      } else {
        setCurrentQuestion(data.question);
        setQuestionNumber(data.question_number);
        setTotalQuestions(data.total_questions || 5);
        setStatus('ready'); setTimeLeft(60); setAnswerText('');
      }
    } catch {
      setError('Failed to load question.'); setStatus('ready');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = sendVoiceAnswer;
      mediaRecorderRef.current.start();
      setIsRecording(true); setStatus('recording'); setTimeLeft(60);
    } catch {
      setError('Camera access denied. Please use text mode.');
      setInputMode('text');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false); setStatus('processing'); setProcessing(true);
    }
  };

  const sendVoiceAnswer = async () => {
    try {
      const formData = new FormData();
      formData.append('file', new Blob(chunksRef.current, { type: 'audio/webm' }), 'answer.webm');
      const r = await fetch(`${API_URL}/interview/voice-answer/${sessionId}`, { method: 'POST', body: formData });
      if (!r.ok) throw new Error();
      const data = await r.json();
      if (data.completed) { setStatus('completed'); setTimeout(() => navigate(`/report/${sessionId}`), 2000); }
      else await getNextQuestion(sessionId);
    } catch {
      setError('Voice recording failed. Switching to text mode.');
      setInputMode('text'); setStatus('ready');
    } finally { setProcessing(false); }
  };

  const sendTextAnswer = async () => {
    if (!answerText.trim()) { setError('Please enter your answer'); return; }
    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append('file', new Blob([answerText], { type: 'text/plain' }), 'answer.txt');
      const r = await fetch(`${API_URL}/interview/voice-answer/${sessionId}`, { method: 'POST', body: formData });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      if (data.completed) { setStatus('completed'); setTimeout(() => navigate(`/report/${sessionId}`), 2000); }
      else await getNextQuestion(sessionId);
    } catch {
      setError('Failed to submit. Please try again.'); setStatus('ready');
    } finally { setProcessing(false); }
  };

  const cancelInterview = () => {
    if (window.confirm('Cancel interview?')) navigate('/my-applications');
  };

  const timerColor = timeLeft < 10 ? C.red : timeLeft < 20 ? C.amber : C.grey900;
  const progress = (questionNumber / totalQuestions) * 100;

  // ── Backend error ────────────────────────────────────────────────────────
  if (backendStatus === 'error') return (
    <Page>
      <CenteredCard>
        <CenterBlock>
          <Icon d={icons.plug} size={40} color={C.red} />
          <h2 style={{ ...s.h2, marginTop: '1rem' }}>Connection Failed</h2>
          <p style={{ ...s.body, maxWidth: 360, margin: '0.5rem auto 1.5rem' }}>
            Unable to reach the backend server. Make sure it is running on port 8000.
          </p>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={checkBackendConnection}>
            <Icon d={icons.refresh} size={16} color={C.white} />
            Retry Connection
          </button>
        </CenterBlock>
      </CenteredCard>
    </Page>
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === 'loading') return (
    <Page>
      <CenteredCard>
        <CenterBlock>
          <div style={{ animation: 'spin 1s linear infinite', width: 40, height: 40 }}>
            <Icon d={icons.loader} size={40} color={C.purple} />
          </div>
          <h2 style={{ ...s.h2, marginTop: '1rem' }}>Preparing your interview</h2>
          <p style={{ ...s.body, marginTop: '0.4rem' }}>AI is generating personalised questions…</p>
        </CenterBlock>
      </CenteredCard>
    </Page>
  );

  // ── Completed ─────────────────────────────────────────────────────────────
  if (status === 'completed') return (
    <Page>
      <CenteredCard>
        <CenterBlock>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.greenLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <Icon d={icons.check} size={30} color={C.green} strokeWidth={2.5} />
          </div>
          <h2 style={{ ...s.h2, marginTop: '1.25rem' }}>Interview Complete</h2>
          <p style={{ ...s.body, marginTop: '0.4rem' }}>
            Generating your performance report…
          </p>
          <div style={{ ...s.chip(C.purpleLight, C.purple), marginTop: '1rem' }}>
            <Icon d={icons.arrowRight} size={13} color={C.purple} />
            Redirecting to report
          </div>
        </CenterBlock>
      </CenteredCard>
    </Page>
  );

  // ── Initial / Start ───────────────────────────────────────────────────────
  if (status === 'initial') return (
    <Page>
      <div style={s.container}>
        <div style={s.card}>
          {/* Top accent strip */}
          <div style={{ height: 5, background: `linear-gradient(90deg, ${C.purple}, ${C.purpleMid})` }} />
          <div style={s.cardPad}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={s.label}>AI Interview</div>
                <h1 style={{ ...s.h1, marginTop: '4px' }}>
                  {job ? job.title : 'Interview Session'}
                </h1>
                {job && <div style={{ ...s.body, color: C.purple, fontWeight: 600, marginTop: '2px' }}>{job.company}</div>}
              </div>
              <div style={{ ...s.chip(C.greenLight, C.green) }}>
                <div style={{ ...s.dot(C.green) }} />
                Server Connected
              </div>
            </div>

            <div style={s.divider} />

            {/* Guidelines */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ ...s.label, marginBottom: '1rem' }}>Before you begin</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { icon: icons.star,      text: '5 AI-generated questions tailored to the role' },
                  { icon: icons.clock,     text: '60 seconds per question to share your answer' },
                  { icon: icons.eye,       text: 'Maintain eye contact with the camera throughout' },
                  { icon: icons.type,      text: 'Text mode recommended for most reliable results' },
                ].map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 14px', borderRadius: '10px', background: C.grey50,
                    border: `1px solid ${C.grey100}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: C.purpleLight,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon d={g.icon} size={16} color={C.purple} />
                    </div>
                    <span style={{ ...s.body, fontSize: '0.82rem', marginTop: '2px' }}>{g.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.divider} />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => navigate('/jobs')}>
                Back to Jobs
              </button>
              <button style={{ ...s.btn, ...s.btnPrimary }} onClick={startInterview}>
                Start Interview
                <Icon d={icons.arrowRight} size={16} color={C.white} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );

  // ── Main interview ────────────────────────────────────────────────────────
  return (
    <Page>
      <div style={s.container}>
        <div style={s.card}>
          {/* Progress */}
          <div style={s.progressTrack}>
            <div style={s.progressFill(progress)} />
          </div>

          <div style={s.cardPad}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={s.label}>Question {questionNumber} of {totalQuestions}</div>
                {job && <div style={{ ...s.body, fontWeight: 600, color: C.purple, fontSize: '0.85rem', marginTop: '2px' }}>
                  {job.title} — {job.company}
                </div>}
              </div>
              {/* Timer pill */}
              {status === 'recording' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', borderRadius: '999px',
                  background: timeLeft < 10 ? C.redLight : C.grey100,
                  border: `1.5px solid ${timeLeft < 10 ? C.red : C.grey200}` }}>
                  <div style={{ ...s.recDot }} />
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              {status !== 'recording' && (
                <div style={{ ...s.chip(C.grey100, C.grey600) }}>
                  <Icon d={icons.clock} size={13} color={C.grey600} />
                  60 sec / question
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ ...s.notice(C.redLight, `${C.red}50`, C.red), marginBottom: '1.25rem' }}>
                <Icon d={icons.alert} size={16} color={C.red} />
                <span>{error}</span>
              </div>
            )}

            {/* Question */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ ...s.label, marginBottom: '8px' }}>Current Question</div>
              <div style={s.questionBox}>{currentQuestion}</div>
            </div>

            <div style={s.divider} />
            <div style={{ marginTop: '1.5rem' }}>

              {/* Video feed (always shown when recording, else smaller preview) */}
              {(status === 'recording' || inputMode === 'voice') && (
                <div style={{ ...s.videoWrap, marginBottom: '1.25rem' }}>
                  <video ref={videoRef} autoPlay muted style={s.video} />
                  {eyeContactWarning && (
                    <div style={s.eyeOverlay}>
                      <Icon d={icons.eye} size={13} color={C.white} />
                      Look at the camera
                    </div>
                  )}
                </div>
              )}

              {/* Mode tabs */}
              {status === 'ready' && !processing && (
                <div style={{ ...s.tabRow, marginBottom: '1.25rem' }}>
                  <button style={s.tab(inputMode === 'text')} onClick={() => { setInputMode('text'); setError(''); }}>
                    <Icon d={icons.type} size={15} color={inputMode === 'text' ? C.purple : C.grey600} />
                    Text Mode
                  </button>
                  {voiceAvailable && (
                    <button style={s.tab(inputMode === 'voice')} onClick={() => { setInputMode('voice'); setError(''); }}>
                      <Icon d={icons.mic} size={15} color={inputMode === 'voice' ? C.purple : C.grey600} />
                      Voice Mode
                    </button>
                  )}
                </div>
              )}

              {/* Text input */}
              {status === 'ready' && inputMode === 'text' && !processing && (
                <div style={{ marginBottom: '1rem' }}>
                  <textarea
                    style={s.textarea}
                    placeholder="Type your answer here. Aim for 3–4 sentences for the best score."
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    onFocus={e => e.target.style.borderColor = C.purple}
                    onBlur={e => e.target.style.borderColor = C.grey200}
                  />
                  <div style={{ ...s.body, fontSize: '0.78rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon d={icons.info} size={13} color={C.grey400} />
                    Detailed, structured answers receive higher scores
                  </div>
                </div>
              )}

              {/* Voice warning */}
              {status === 'ready' && inputMode === 'voice' && !processing && (
                <div style={{ ...s.notice(C.amberLight, `${C.amber}60`, C.amber), marginBottom: '1rem' }}>
                  <Icon d={icons.alert} size={16} color={C.amber} />
                  <span>Voice mode is experimental. Switch to text if recording fails.</span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                {/* Cancel always visible when ready */}
                {(status === 'ready') && !processing && (
                  <button style={{ ...s.btn, ...s.btnGhost }} onClick={cancelInterview}>
                    Cancel
                  </button>
                )}

                {status === 'ready' && inputMode === 'voice' && !processing && (
                  <button style={{ ...s.btn, ...s.btnPrimary }} onClick={startRecording}>
                    <Icon d={icons.mic} size={16} color={C.white} />
                    Start Recording
                  </button>
                )}

                {status === 'ready' && inputMode === 'text' && !processing && (
                  <button
                    style={{ ...s.btn, ...s.btnPrimary, ...(answerText.trim() ? {} : s.btnDisabled) }}
                    onClick={sendTextAnswer}
                    disabled={!answerText.trim()}
                  >
                    Submit Answer
                    <Icon d={icons.send} size={15} color={C.white} />
                  </button>
                )}

                {status === 'recording' && (
                  <button style={{ ...s.btn, ...s.btnDanger }} onClick={stopRecording}>
                    <Icon d={icons.stop} size={15} color={C.white} />
                    Stop Recording
                  </button>
                )}

                {(status === 'processing' || processing) && (
                  <button style={{ ...s.btn, ...s.btnOutline, ...s.btnDisabled }} disabled>
                    <div style={{ animation: 'spin 1s linear infinite' }}>
                      <Icon d={icons.loader} size={15} color={C.purple} />
                    </div>
                    Processing…
                  </button>
                )}
              </div>

              {/* Status line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                {status === 'ready' && inputMode === 'text' && !processing && (
                  <><div style={s.dot(C.blue)} /><span style={{ ...s.body, fontSize: '0.78rem' }}>Ready — type your answer above</span></>
                )}
                {status === 'ready' && inputMode === 'voice' && !processing && (
                  <><div style={s.dot(C.amber)} /><span style={{ ...s.body, fontSize: '0.78rem' }}>Ready — click Start Recording</span></>
                )}
                {status === 'recording' && (
                  <><div style={{ ...s.dot(C.red), animation: 'blink 1s ease-in-out infinite' }} /><span style={{ ...s.body, fontSize: '0.78rem' }}>Recording — speak clearly</span></>
                )}
                {(status === 'processing' || processing) && (
                  <><div style={s.dot(C.green)} /><span style={{ ...s.body, fontSize: '0.78rem' }}>Saving your answer…</span></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        button:hover { filter: brightness(0.94); }
      `}</style>
    </Page>
  );
};

// ─── Layout helpers ──────────────────────────────────────────────────────────
const Page = ({ children }) => (
  <div style={s.page}>
    <Navbar />
    <main style={s.main}>{children}</main>
    <Footer />
  </div>
);

const CenteredCard = ({ children }) => (
  <div style={{ ...s.container, maxWidth: 480 }}>
    <div style={s.card}>
      <div style={{ height: 5, background: `linear-gradient(90deg, ${C.purple}, ${C.purpleMid})` }} />
      <div style={s.cardPad}>{children}</div>
    </div>
  </div>
);

const CenterBlock = ({ children }) => (
  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>{children}</div>
);

export default Interview;
