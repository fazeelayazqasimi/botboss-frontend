import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Interview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // State variables
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
  const [inputMode, setInputMode] = useState('text'); // Default to text
  const [processing, setProcessing] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const eyeCheckRef = useRef(null);
  
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    // Check user login
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'candidate') {
      navigate('/login');
      return;
    }
    setUser(userData);

    // Get job details
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobData = jobs.find(j => j.id === parseInt(jobId));
    if (jobData) {
      setJob(jobData);
    } else {
      navigate('/jobs');
    }

    // Check backend connection
    checkBackendConnection();
    
    // Check if voice is available
    checkVoiceAvailability();
  }, [jobId, navigate]);

  const checkVoiceAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');
      setVoiceAvailable(hasMic);
    } catch (err) {
      console.log('Voice not available:', err);
      setVoiceAvailable(false);
    }
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      if (response.ok) {
        setBackendStatus('connected');
        setError('');
      } else {
        setBackendStatus('error');
        setError('Backend server is not responding properly');
      }
    } catch (err) {
      console.error('Backend connection error:', err);
      setBackendStatus('error');
      setError('Cannot connect to backend server. Please make sure it\'s running on port 8000');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (eyeCheckRef.current) clearInterval(eyeCheckRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer for recording
  useEffect(() => {
    if (status === 'recording' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'recording') {
      stopRecording();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, status]);

  // Simulated eye contact check
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

  // Start interview
  const startInterview = async () => {
    try {
      setStatus('loading');
      setError('');
      
      const response = await fetch(`${API_URL}/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_description: job.description
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start interview: ${errorText}`);
      }

      const data = await response.json();
      console.log('Interview started:', data);
      
      setSessionId(data.session_id);
      setTotalQuestions(data.questions_count || 5);
      
      // Get first question
      await getNextQuestion(data.session_id);
      
    } catch (error) {
      console.error('Failed to start interview:', error);
      setError('Failed to start interview. Please try again.');
      setStatus('initial');
    }
  };

  // Get next question
  const getNextQuestion = async (sid) => {
    try {
      const response = await fetch(`${API_URL}/interview/next/${sid}`);
      
      if (!response.ok) {
        throw new Error('Failed to get question');
      }

      const data = await response.json();
      console.log('Next question response:', data);
      
      if (data.message === "Interview Completed" || data.status === "completed") {
        setStatus('completed');
        setTimeout(() => {
          navigate(`/report/${sid}`);
        }, 2000);
      } else {
        setCurrentQuestion(data.question);
        setQuestionNumber(data.question_number);
        setTotalQuestions(data.total_questions || 5);
        setStatus('ready');
        setTimeLeft(60);
        setAnswerText('');
      }
      
    } catch (error) {
      console.error('Failed to get question:', error);
      setError('Failed to load question. Please try again.');
      setStatus('ready');
    }
  };

  // Start camera and recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      videoRef.current.srcObject = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = sendVoiceAnswer;
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setTimeLeft(60);
      
    } catch (error) {
      console.error('Camera access denied:', error);
      setError('Camera/Microphone access denied. Please use text mode.');
      setInputMode('text');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setStatus('processing');
      setProcessing(true);
    }
  };

  // Send voice answer
  const sendVoiceAnswer = async () => {
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'answer.webm');
      
      const response = await fetch(`${API_URL}/interview/voice-answer/${sessionId}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send answer');
      }

      const data = await response.json();
      console.log('Voice answer saved:', data);
      
      if (data.completed) {
        setStatus('completed');
        setTimeout(() => {
          navigate(`/report/${sessionId}`);
        }, 2000);
      } else {
        await getNextQuestion(sessionId);
      }
      
    } catch (error) {
      console.error('Failed to send voice answer:', error);
      setError('Voice recording failed. Switching to text mode.');
      setInputMode('text');
      setStatus('ready');
    } finally {
      setProcessing(false);
    }
  };

  // Send text answer
  const sendTextAnswer = async () => {
    if (!answerText.trim()) {
      setError('Please enter your answer');
      return;
    }

    try {
      setProcessing(true);
      
      // Create a text file and send as FormData
      const textBlob = new Blob([answerText], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', textBlob, 'answer.txt');
      
      const response = await fetch(`${API_URL}/interview/voice-answer/${sessionId}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send answer: ${errorText}`);
      }

      const data = await response.json();
      console.log('Text answer saved:', data);
      
      if (data.completed) {
        setStatus('completed');
        setTimeout(() => {
          navigate(`/report/${sessionId}`);
        }, 2000);
      } else {
        await getNextQuestion(sessionId);
      }
      
    } catch (error) {
      console.error('Failed to send text answer:', error);
      setError('Failed to submit answer. Please try again.');
      setStatus('ready');
    } finally {
      setProcessing(false);
    }
  };

  // Cancel interview
  const cancelInterview = () => {
    if (window.confirm('Are you sure you want to cancel the interview?')) {
      navigate('/my-applications');
    }
  };

  // Toggle input mode
  const toggleInputMode = (mode) => {
    setInputMode(mode);
    setError('');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    main: {
      flex: 1,
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#666',
      fontSize: '1rem'
    },
    backendStatus: {
      padding: '0.5rem',
      borderRadius: '5px',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      background: backendStatus === 'connected' ? '#4caf5020' : '#f4433620',
      border: `1px solid ${backendStatus === 'connected' ? '#4caf50' : '#f44336'}`,
      color: backendStatus === 'connected' ? '#4caf50' : '#f44336',
      textAlign: 'center'
    },
    jobInfo: {
      background: '#f3f4f6',
      padding: '1rem',
      borderRadius: '10px',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    jobTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '0.25rem'
    },
    jobCompany: {
      color: '#667eea'
    },
    questionSection: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    questionNumber: {
      color: '#667eea',
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '0.5rem'
    },
    questionText: {
      fontSize: '1.5rem',
      color: '#333',
      lineHeight: 1.6,
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '10px',
      marginBottom: '1rem'
    },
    timer: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: timeLeft < 10 ? '#f44336' : '#333',
      marginBottom: '1rem'
    },
    progressBar: {
      width: '100%',
      height: '10px',
      background: '#e5e7eb',
      borderRadius: '5px',
      marginBottom: '1rem',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: '#667eea',
      width: `${(questionNumber / totalQuestions) * 100}%`,
      transition: 'width 0.3s ease'
    },
    videoSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    },
    videoContainer: {
      width: '100%',
      maxWidth: '640px',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      position: 'relative'
    },
    video: {
      width: '100%',
      height: 'auto',
      display: 'block',
      background: '#000'
    },
    eyeContactWarning: {
      position: 'absolute',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#f44336',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      fontSize: '0.9rem',
      fontWeight: 500,
      animation: 'pulse 1s infinite'
    },
    modeToggle: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    },
    modeBtn: {
      padding: '0.75rem 1.5rem',
      borderRadius: '30px',
      border: '2px solid #667eea',
      background: 'transparent',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 500,
      transition: 'all 0.3s',
      minWidth: '150px'
    },
    activeMode: {
      background: '#667eea',
      color: 'white'
    },
    textInputSection: {
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto'
    },
    textArea: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '1rem',
      minHeight: '150px',
      marginBottom: '1rem',
      outline: 'none',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '1rem'
    },
    btn: {
      padding: '0.75rem 2rem',
      borderRadius: '30px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      minWidth: '200px'
    },
    btnPrimary: {
      background: '#667eea',
      color: 'white',
      ':hover': {
        background: '#764ba2',
        transform: 'translateY(-2px)'
      }
    },
    btnSecondary: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea'
    },
    btnDanger: {
      background: '#f44336',
      color: 'white',
      ':hover': {
        background: '#d32f2f'
      }
    },
    btnSuccess: {
      background: '#4caf50',
      color: 'white',
      ':hover': {
        background: '#45a049'
      }
    },
    btnCancel: {
      background: 'transparent',
      color: '#666',
      border: '2px solid #ccc'
    },
    btnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      color: '#666'
    },
    pulse: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#4caf50',
      animation: 'pulse 1.5s infinite'
    },
    error: {
      color: '#f44336',
      textAlign: 'center',
      marginTop: '1rem',
      padding: '1rem',
      background: '#ffebee',
      borderRadius: '5px',
      border: '1px solid #f44336'
    },
    warning: {
      color: '#ff9800',
      textAlign: 'center',
      marginTop: '0.5rem',
      padding: '0.5rem',
      background: '#fff3e0',
      borderRadius: '5px',
      fontSize: '0.9rem'
    },
    startScreen: {
      textAlign: 'center',
      padding: '2rem'
    },
    startIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    startTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1rem'
    },
    startText: {
      color: '#666',
      marginBottom: '2rem',
      lineHeight: 1.6
    },
    guidelines: {
      textAlign: 'left',
      background: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '10px',
      marginBottom: '2rem'
    },
    guidelineItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.75rem',
      color: '#4b5563'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    completedScreen: {
      textAlign: 'center',
      padding: '3rem'
    },
    completedIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    }
  };

  // Backend error screen
  if (backendStatus === 'error') {
    return (
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.startScreen}>
              <div style={styles.startIcon}>🔌</div>
              <h2 style={styles.startTitle}>Backend Not Connected</h2>
              <p style={styles.startText}>
                Cannot connect to the backend server. Please make sure it's running on port 8000.
              </p>
              <button 
                onClick={checkBackendConnection}
                style={{...styles.btn, ...styles.btnPrimary}}
              >
                Retry Connection
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Initial screen
  if (status === 'initial') {
    return (
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.backendStatus}>
              ✅ Backend Connected
            </div>
            <div style={styles.startScreen}>
              <div style={styles.startIcon}>🎥</div>
              <h2 style={styles.startTitle}>AI Interview</h2>
              
              {job && (
                <div style={styles.jobInfo}>
                  <div style={styles.jobTitle}>{job.title}</div>
                  <div style={styles.jobCompany}>{job.company}</div>
                </div>
              )}

              <div style={styles.guidelines}>
                <h3 style={{marginBottom: '1rem'}}>Guidelines:</h3>
                <div style={styles.guidelineItem}>
                  <span>🎯</span> <span>5 questions based on job description</span>
                </div>
                <div style={styles.guidelineItem}>
                  <span>⏱️</span> <span>60 seconds per question</span>
                </div>
                <div style={styles.guidelineItem}>
                  <span>👁️</span> <span>Maintain eye contact with camera</span>
                </div>
                <div style={styles.guidelineItem}>
                  <span>📝</span> <span><strong>Text mode is recommended</strong> - Type your answers</span>
                </div>
                <div style={styles.guidelineItem}>
                  <span>🎤</span> <span>Voice mode available (experimental)</span>
                </div>
              </div>

              <button 
                onClick={startInterview}
                style={{...styles.btn, ...styles.btnPrimary}}
              >
                Start Interview
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading screen
  if (status === 'loading') {
    return (
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.loading}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
              <h3>Starting interview...</h3>
              <p style={{color: '#666'}}>Please wait while AI generates questions</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Completed screen
  if (status === 'completed') {
    return (
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.completedScreen}>
              <div style={styles.completedIcon}>✅</div>
              <h2>Interview Completed!</h2>
              <p style={{color: '#666', marginTop: '1rem'}}>
                Generating your report...
              </p>
              <p style={{color: '#667eea', marginTop: '0.5rem'}}>
                Redirecting to report page
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main interview screen
  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.card}>
          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>AI Interview</h1>
            <p style={styles.subtitle}>
              Question {questionNumber} of {totalQuestions}
            </p>
          </div>

          {/* Job Info */}
          {job && (
            <div style={styles.jobInfo}>
              <div style={styles.jobTitle}>{job.title}</div>
              <div style={styles.jobCompany}>{job.company}</div>
            </div>
          )}

          {/* Error Message */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Question Section */}
          <div style={styles.questionSection}>
            <div style={styles.questionNumber}>Current Question</div>
            <div style={styles.questionText}>{currentQuestion}</div>
            
            {status === 'recording' && (
              <div style={styles.timer}>
                {timeLeft} seconds left
              </div>
            )}
          </div>

          {/* Video Section */}
          <div style={styles.videoSection}>
            <div style={styles.videoContainer}>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                style={styles.video}
              />
              {eyeContactWarning && (
                <div style={styles.eyeContactWarning}>
                  ⚠️ Please look at the camera
                </div>
              )}
            </div>

            {/* Mode Indicator */}
            <div style={{
              padding: '0.5rem 1rem',
              background: inputMode === 'text' ? '#2196f320' : '#ff980020',
              borderRadius: '20px',
              color: inputMode === 'text' ? '#2196f3' : '#ff9800',
              fontWeight: 500
            }}>
              {inputMode === 'text' ? '📝 Text Mode Active' : '🎤 Voice Mode Active'}
            </div>

            {/* Mode Toggle */}
            {status === 'ready' && !processing && (
              <div style={styles.modeToggle}>
                <button 
                  onClick={() => toggleInputMode('text')}
                  style={{
                    ...styles.modeBtn,
                    ...(inputMode === 'text' ? styles.activeMode : {})
                  }}
                >
                  📝 Text Mode (Recommended)
                </button>
                {voiceAvailable && (
                  <button 
                    onClick={() => toggleInputMode('voice')}
                    style={{
                      ...styles.modeBtn,
                      ...(inputMode === 'voice' ? styles.activeMode : {})
                    }}
                  >
                    🎤 Voice Mode
                  </button>
                )}
              </div>
            )}

            {/* Text Input Section */}
            {status === 'ready' && inputMode === 'text' && !processing && (
              <div style={styles.textInputSection}>
                <textarea
                  style={styles.textArea}
                  placeholder="Type your answer here... (detailed answers get better scores)"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                />
                <div style={{textAlign: 'left', color: '#666', fontSize: '0.9rem'}}>
                  💡 Tip: Write 3-4 sentences for best score
                </div>
              </div>
            )}

            {/* Voice Mode Warning */}
            {status === 'ready' && inputMode === 'voice' && (
              <div style={styles.warning}>
                ⚠️ Voice mode is experimental. If it doesn't work, switch to text mode.
              </div>
            )}

            {/* Controls */}
            <div style={styles.controls}>
              {status === 'ready' && inputMode === 'voice' && !processing && (
                <>
                  <button 
                    onClick={startRecording}
                    style={{...styles.btn, ...styles.btnPrimary}}
                  >
                    🎤 Start Recording
                  </button>
                  <button 
                    onClick={cancelInterview}
                    style={{...styles.btn, ...styles.btnCancel}}
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === 'ready' && inputMode === 'text' && !processing && (
                <>
                  <button 
                    onClick={sendTextAnswer}
                    style={{...styles.btn, ...styles.btnSuccess}}
                    disabled={!answerText.trim()}
                  >
                    📝 Submit Answer
                  </button>
                  <button 
                    onClick={cancelInterview}
                    style={{...styles.btn, ...styles.btnCancel}}
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {status === 'recording' && (
                <button 
                  onClick={stopRecording}
                  style={{...styles.btn, ...styles.btnDanger}}
                >
                  ⏹ Stop Recording
                </button>
              )}
              
              {(status === 'processing' || processing) && (
                <button 
                  style={{...styles.btn, ...styles.btnSecondary, ...styles.btnDisabled}}
                  disabled
                >
                  ⏳ Processing...
                </button>
              )}
            </div>

            {/* Status Indicator */}
            <div style={styles.statusIndicator}>
              {status === 'ready' && inputMode === 'text' && !processing && (
                <>
                  <div style={{...styles.pulse, background: '#2196f3'}}></div>
                  <span>Ready - Type your answer</span>
                </>
              )}
              {status === 'ready' && inputMode === 'voice' && !processing && (
                <>
                  <div style={{...styles.pulse, background: '#ff9800'}}></div>
                  <span>Ready - Click Start Recording</span>
                </>
              )}
              {status === 'recording' && (
                <>
                  <div style={{...styles.pulse, background: '#f44336'}}></div>
                  <span>Recording... Speak clearly</span>
                </>
              )}
              {(status === 'processing' || processing) && (
                <>
                  <div style={{...styles.pulse, background: '#4caf50'}}></div>
                  <span>Saving your answer...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Interview;