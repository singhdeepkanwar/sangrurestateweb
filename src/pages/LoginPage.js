import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { sendOtp, verifyOtp, register, getProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { validatePhone, validateOtp, validateField } from '../utils/validation';
import './LoginPage.css';

const STEP_VARIANTS = {
  enter:  { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -40 },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/home';

  const [step, setStep] = useState(1); // 1=phone, 2=otp, 3=profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [phone, setPhone] = useState('');

  // Step 2
  const [sessionId, setSessionId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(0);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Step 3
  const [regToken, setRegToken] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', email: '', city: '', address: '' });
  const [isBrokerBuilder, setIsBrokerBuilder] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const goTo = (s) => { setError(''); setStep(s); };

  // ── STEP 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async () => {
    const err = validatePhone(phone);
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const res = await sendOtp(phone);
      setSessionId(res.data.session_id);
      setTimer(30);
      goTo(2);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (e) {
      setError(e.response?.data?.error || 'Could not send code. Try again.');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true); setError('');
    try {
      const res = await sendOtp(phone);
      setSessionId(res.data.session_id);
      setOtp(['', '', '', '']);
      setTimer(60);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch { setError('Failed to resend code.'); }
    finally { setLoading(false); }
  };

  // ── STEP 2: Verify OTP ────────────────────────────────────────
  const handleOtpChange = useCallback((value, index) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 4).split('');
      if (digits.length === 4) {
        setOtp(digits);
        otpRefs[3].current?.focus();
        return;
      }
    }
    const next = [...otp];
    next[index] = value.replace(/\D/g, '').slice(-1);
    setOtp(next);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
  }, [otp]);

  const handleOtpKeyDown = useCallback((e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
    if (e.key === 'Enter') handleVerifyOtp();
  }, [otp]);

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    const err = validateOtp(code);
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const res = await verifyOtp(sessionId, code);
      if (res.data.status === 'LOGIN') {
        // Store tokens first — getProfile needs them in localStorage to attach the Bearer header
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        const profileRes = await getProfile();
        login(res.data.access, res.data.refresh, profileRes.data);
        navigate(from, { replace: true });
      } else {
        setRegToken(res.data.registration_token);
        goTo(3);
      }
    } catch {
      setError('Invalid or expired code. Please try again.');
      setOtp(['', '', '', '']);
      setTimeout(() => otpRefs[0].current?.focus(), 50);
    } finally { setLoading(false); }
  };

  // ── STEP 3: Complete Profile ──────────────────────────────────
  const handleProfileChange = (field, value) => setProfile((p) => ({ ...p, [field]: value }));

  const handleRegister = async () => {
    if (!profile.full_name.trim()) { setError('Full name is required.'); return; }
    if (!profile.city.trim()) { setError('City is required.'); return; }
    for (const [k, v] of Object.entries(profile)) {
      const fieldErr = validateField(v, k);
      if (fieldErr) { setError(fieldErr); return; }
    }
    if (isBrokerBuilder && !selectedRole) { setError('Please select Broker or Builder.'); return; }
    setLoading(true); setError('');
    try {
      const payload = { ...profile, role: isBrokerBuilder ? selectedRole.toLowerCase() : 'user' };
      const res = await register(regToken, payload);
      // Store tokens before getProfile so the Bearer header is present
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      const profileRes = await getProfile();
      login(res.data.access, res.data.refresh, profileRes.data);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.response?.data?.detail || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      {/* ── Left panel: branding ── */}
      <div className="login-left">
        <Link to="/" className="login-logo">
          <div className="login-logo-icon"><Home size={20} color="#fff" /></div>
          <div>
            <div className="login-logo-name">Sangrur</div>
            <div className="login-logo-sub">ESTATE</div>
          </div>
        </Link>

        <div className="login-brand-copy">
          <h1>Find the place<br />you'll love.</h1>
          <p>Sangrur's dedicated real estate platform. Buy, sell, and rent — all in one place.</p>
        </div>

        <div className="login-stats">
          <div className="ls-item"><span className="ls-num">500+</span><span className="ls-label">Properties</span></div>
          <div className="ls-div" />
          <div className="ls-item"><span className="ls-num">2K+</span><span className="ls-label">Users</span></div>
          <div className="ls-div" />
          <div className="ls-item"><span className="ls-num">4.8★</span><span className="ls-label">Rating</span></div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="login-right">
        <div className="login-card">
          {/* Progress dots */}
          <div className="login-progress">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`lp-dot ${step >= s ? 'active' : ''}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.22 }}>
                <StepPhone phone={phone} setPhone={setPhone} error={error}
                  loading={loading} onSubmit={handleSendOtp} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.22 }}>
                <StepOtp phone={phone} otp={otp} otpRefs={otpRefs} timer={timer}
                  error={error} loading={loading} onChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown} onSubmit={handleVerifyOtp}
                  onResend={handleResend} onBack={() => goTo(1)} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.22 }}>
                <StepProfile phone={phone} profile={profile} isBrokerBuilder={isBrokerBuilder}
                  selectedRole={selectedRole} error={error} loading={loading}
                  onChange={handleProfileChange}
                  onToggleBroker={() => { setIsBrokerBuilder((b) => !b); setSelectedRole(''); }}
                  onSelectRole={setSelectedRole} onSubmit={handleRegister} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step sub-components
// ─────────────────────────────────────────────────────────────────

function StepPhone({ phone, setPhone, error, loading, onSubmit }) {
  const canSubmit = phone.replace(/\D/g, '').length === 10;
  return (
    <div className="login-step">
      <h2 className="ls-title">Welcome</h2>
      <p className="ls-sub">Enter your phone number to sign in or create an account.</p>

      <label className="ls-label">Phone Number</label>
      <div className="ls-phone-row">
        <div className="ls-cc">+91</div>
        <input className="ls-input ls-phone" type="tel" inputMode="numeric" maxLength={10}
          placeholder="98765 43210" value={phone} autoFocus
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && canSubmit && onSubmit()} />
      </div>

      {error && <p className="ls-error">{error}</p>}

      <button className="ls-btn" onClick={onSubmit} disabled={loading || !canSubmit}>
        {loading ? <Loader2 className="spin" size={18} /> : <><span>Send Code</span><ArrowRight size={16} /></>}
      </button>

      <p className="ls-terms">
        By continuing you agree to our{' '}
        <Link to="/terms">Terms</Link> &amp; <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  );
}

function StepOtp({ phone, otp, otpRefs, timer, error, loading, onChange, onKeyDown, onSubmit, onResend, onBack }) {
  const complete = otp.every((d) => d !== '');
  return (
    <div className="login-step">
      <button className="ls-back" onClick={onBack}><ArrowLeft size={14} /> Change number</button>
      <h2 className="ls-title">Verification</h2>
      <p className="ls-sub">We sent a 4-digit code to <strong>+91 {phone}</strong></p>

      <div className="ls-otp-row">
        {otp.map((digit, i) => (
          <input key={i} ref={otpRefs[i]}
            className={`ls-otp-box ${digit ? 'filled' : ''}`}
            type="text" inputMode="numeric"
            maxLength={i === 0 ? 4 : 1}
            value={digit}
            onChange={(e) => onChange(e.target.value, i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            onFocus={(e) => e.target.select()} />
        ))}
      </div>

      {error && <p className="ls-error">{error}</p>}

      <div className="ls-resend">
        {timer > 0
          ? <span className="ls-timer">Resend in <strong>{timer}s</strong></span>
          : <button className="ls-resend-btn" onClick={onResend} disabled={loading}>Resend OTP</button>}
      </div>

      <button className="ls-btn" onClick={onSubmit} disabled={loading || !complete}>
        {loading ? <Loader2 className="spin" size={18} /> : <><span>Verify &amp; Continue</span><ArrowRight size={16} /></>}
      </button>
    </div>
  );
}

function StepProfile({ phone, profile, isBrokerBuilder, selectedRole, error, loading,
  onChange, onToggleBroker, onSelectRole, onSubmit }) {
  return (
    <div className="login-step login-step-profile">
      <h2 className="ls-title">Complete Profile</h2>
      <p className="ls-sub">Just a few details to set up your account.</p>

      <div className="ls-field">
        <label className="ls-label">Phone</label>
        <input className="ls-input ls-disabled" value={`+91 ${phone}`} readOnly />
      </div>

      <div className="ls-field">
        <label className="ls-label">Full Name <span className="ls-req">*</span></label>
        <input className="ls-input" placeholder="Akshit Gupta" value={profile.full_name}
          autoFocus onChange={(e) => onChange('full_name', e.target.value)} />
      </div>

      <div className="ls-field">
        <label className="ls-label">Email <span className="ls-opt">(optional)</span></label>
        <input className="ls-input" type="email" placeholder="you@example.com" value={profile.email}
          onChange={(e) => onChange('email', e.target.value)} />
      </div>

      <div className="ls-row">
        <div className="ls-field">
          <label className="ls-label">City / Town <span className="ls-req">*</span></label>
          <input className="ls-input" placeholder="Sangrur" value={profile.city}
            onChange={(e) => onChange('city', e.target.value)} />
        </div>
        <div className="ls-field">
          <label className="ls-label">Address</label>
          <input className="ls-input" placeholder="Street / Area" value={profile.address}
            onChange={(e) => onChange('address', e.target.value)} />
        </div>
      </div>

      <div className="ls-broker">
        <label className="ls-check-row" onClick={onToggleBroker}>
          <div className={`ls-checkbox ${isBrokerBuilder ? 'checked' : ''}`}>
            {isBrokerBuilder && <span>✓</span>}
          </div>
          <span>I am a Broker / Builder</span>
        </label>
        {isBrokerBuilder && (
          <div className="ls-role-row">
            {['Broker', 'Builder'].map((r) => (
              <button key={r} className={`ls-role-btn ${selectedRole === r ? 'sel' : ''}`}
                onClick={() => onSelectRole(r)}>{r}</button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="ls-error">{error}</p>}

      <button className="ls-btn" onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="spin" size={18} /> : <><span>Create Account</span><ArrowRight size={16} /></>}
      </button>
    </div>
  );
}
