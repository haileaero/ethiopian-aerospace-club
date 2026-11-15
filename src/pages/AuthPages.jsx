import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

function AuthShell({ eyebrow, title, text, children }) {
  return (
    <section className="auth-page">
      <div className="auth-grid container">
        <div className="auth-brand-panel">
          <div className="eyebrow eyebrow-gold">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{text}</p>
          <div className="auth-security-list">
            <div>
              <ShieldCheck />
              <span>Verified email accounts</span>
            </div>
            <div>
              <LockKeyhole />
              <span>Role-protected access</span>
            </div>
            <div>
              <CheckCircle2 />
              <span>Separate member and admin areas</span>
            </div>
          </div>
        </div>
        <div className="auth-card">{children}</div>
      </div>
    </section>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  autoComplete = 'new-password',
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-wrap">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

export function Login() {
  const { signIn, user, isAdmin, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signIn({ email, password });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="EAC ACCOUNT"
      title="Welcome back."
      text="Sign in to your EAC account. Public visitors do not need an account to browse the website."
    >
      <div className="auth-card-head">
        <span className="auth-icon">
          <LockKeyhole />
        </span>
        <div>
          <h2>Member / administrator login</h2>
          <p>Use your verified email address and password.</p>
        </div>
      </div>

      {!isConfigured && (
        <div className="form-error">
          Authentication is not configured. See the setup guide included with this project.
        </div>
      )}

      <form className="auth-form" onSubmit={submit}>
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </label>

        <div className="auth-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="button button-primary auth-submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
          <ArrowRight size={16} />
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/register">Create a member account</Link>
      </p>

      <Link className="auth-back" to="/">
        <ArrowLeft size={15} /> Back to public website
      </Link>
    </AuthShell>
  );
}

export function Register() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    membershipType: 'Student',
    affiliation: '',
    department: '',
    year: '',
    profession: '',
    interests: [],
    preferredContribution: 'Technical member',
    phone: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [participationOpen, setParticipationOpen] = useState(false);
  const participationRef = React.useRef(null);

  const participationOptions = [
    'Aerospace Engineering & Design',
    'UAV / Drone Technology',
    'CAD & SolidWorks',
    'Avionics & Embedded Systems',
    'Propulsion & Turbomachinery',
    'Aircraft Structures & Materials',
    'Flight Operations & Simulation',
    'Research & Development',
    'Programming & Software',
    'Space Science & Technology',
    'Training & Workshops',
    'Technical Projects',
    'Innovation & Entrepreneurship',
    'Media, Communication & Outreach',
    'Event Organization',
    'Other',
  ];

  const toggleParticipation = (value) => {
    set('interests', form.interests.includes(value)
      ? form.interests.filter((item) => item !== value)
      : [...form.interests, value]);
  };

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (participationRef.current && !participationRef.current.contains(event.target)) {
        setParticipationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.interests.length === 0) {
      setError('Please select at least one area of participation.');
      return;
    }

    setBusy(true);
    try {
      await signUp(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        eyebrow="VERIFY YOUR EMAIL"
        title="One more step."
        text="Your member account has been created, but it must be verified before you can sign in."
      >
        <div className="auth-success">
          <CheckCircle2 size={44} />
          <h2>Check your inbox</h2>
          <p>
            We sent a verification link to <strong>{form.email}</strong>. Open that message and
            confirm your email address.
          </p>
          <Link className="button button-primary" to="/login">
            Go to sign in <ArrowRight size={16} />
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="JOIN EAC"
      title="Create your member account."
      text="Registration is for members. Administrator privileges are never selectable from this form and are assigned securely by the EAC system administrator."
    >
      <div className="auth-card-head">
        <span className="auth-icon">
          <UserPlus />
        </span>
        <div>
          <h2>Member registration</h2>
          <p>Use a real email address that you can verify.</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={submit}>
        <div className="form-row">
          <label>
            Full name *
            <input
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Full name"
              required
            />
          </label>

          <label>
            Username (optional)
            <input
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              placeholder="Display name"
            />
          </label>
        </div>

        <label>
          Email address *
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <div className="form-row">
          <label>
            Password *
            <PasswordInput value={form.password} onChange={(e) => set('password', e.target.value)} />
          </label>

          <label>
            Confirm password *
            <PasswordInput
              value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)}
              placeholder="Repeat password"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Membership type *
            <select
              value={form.membershipType}
              onChange={(e) => set('membershipType', e.target.value)}
              required
            >
              <option value="Student">Student</option>
              <option value="Graduate / Alumni">Graduate / Alumni</option>
              <option value="Professional">Professional</option>
              <option value="Researcher">Researcher</option>
              <option value="Aerospace Enthusiast">Aerospace Enthusiast</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Affiliation / organization
            <input
              value={form.affiliation}
              onChange={(e) => set('affiliation', e.target.value)}
              placeholder="e.g. Ethiopian Defence University, Ethiopian Airlines, Independent"
            />
          </label>
        </div>

        {form.membershipType === 'Student' ? (
          <div className="form-row">
            <label>
              Department
              <input
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                placeholder="e.g. Aerospace Engineering"
              />
            </label>

            <label>
              Year / level
              <input
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="e.g. 4th year"
              />
            </label>
          </div>
        ) : (
          <label>
            Profession / role
            <input
              value={form.profession}
              onChange={(e) => set('profession', e.target.value)}
              placeholder="e.g. Aircraft Maintenance Engineer"
            />
          </label>
        )}

        <div className="participation-field" ref={participationRef}>
          <label>Areas of participation *</label>
          <button
            type="button"
            className={`participation-trigger ${participationOpen ? 'is-open' : ''}`}
            onClick={() => setParticipationOpen((value) => !value)}
            aria-expanded={participationOpen}
          >
            <span>
              {form.interests.length === 0
                ? 'Select one or more areas'
                : `${form.interests.length} area${form.interests.length === 1 ? '' : 's'} selected`}
            </span>
            <span className="participation-chevron">⌄</span>
          </button>

          {participationOpen && (
            <div className="participation-menu">
              {participationOptions.map((option) => (
                <label key={option} className="participation-option">
                  <input
                    type="checkbox"
                    checked={form.interests.includes(option)}
                    onChange={() => toggleParticipation(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {form.interests.length > 0 && (
            <div className="participation-tags">
              {form.interests.map((item) => (
                <span key={item} className="participation-tag">
                  {item}
                  <button type="button" onClick={() => toggleParticipation(item)} aria-label={`Remove ${item}`}>×</button>
                </span>
              ))}
            </div>
          )}
          <small className="form-help">Choose one or more areas where you would like to participate in EAC.</small>
        </div>

        <label>
          Preferred contribution *
          <select
            value={form.preferredContribution}
            onChange={(e) => set('preferredContribution', e.target.value)}
            required
          >
            <option value="Technical member">Technical member</option>
            <option value="Research member">Research member</option>
            <option value="Project team member">Project team member</option>
            <option value="Training participant">Training participant</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Event / Outreach member">Event / Outreach member</option>
            <option value="Mentor / Professional contributor">Mentor / Professional contributor</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Phone (optional)
          <input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="Phone number"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="button button-primary auth-submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Create member account'}
          <ArrowRight size={16} />
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const { resetPasswordRequest } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      await resetPasswordRequest(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Unable to send reset email.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="ACCOUNT RECOVERY"
      title="Reset your password."
      text="We will send a secure password-reset link to your verified account email."
    >
      <div className="auth-card-head">
        <span className="auth-icon">
          <Mail />
        </span>
        <div>
          <h2>Forgot password</h2>
          <p>Enter the email used for your EAC account.</p>
        </div>
      </div>

      {sent ? (
        <div className="auth-success">
          <CheckCircle2 size={42} />
          <h2>Reset email sent</h2>
          <p>
            Check <strong>{email}</strong> for the password-reset message.
          </p>
          <Link to="/login" className="auth-back">
            Return to sign in
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="button button-primary auth-submit" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      <Link className="auth-back" to="/login">
        <ArrowLeft size={15} /> Back to sign in
      </Link>
    </AuthShell>
  );
}

export function ResetPassword() {
  const { session, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Unable to update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="SECURITY"
      title="Choose a new password."
      text="Use a strong password that you do not reuse on another service."
    >
      {done ? (
        <div className="auth-success">
          <CheckCircle2 size={44} />
          <h2>Password updated</h2>
          <p>Your EAC password has been changed successfully.</p>
          <Link className="button button-primary" to={session ? '/dashboard' : '/login'}>
            Continue <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <label>
            New password
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <label>
            Confirm new password
            <PasswordInput
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat new password"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="button button-primary auth-submit" disabled={busy}>
            {busy ? 'Updating…' : 'Update password'}
            <ArrowRight size={16} />
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function AuthCallback() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(session ? '/dashboard' : '/login', { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [session, navigate]);

  return (
    <div className="auth-loading">
      <div className="auth-spinner"></div>
      <p>Confirming your EAC account…</p>
    </div>
  );
}
