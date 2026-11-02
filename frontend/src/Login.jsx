import { useState } from 'react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to complete your request.');
      }

      if (isRegister) {
        setMessage('Account created successfully! Please sign in below.');
        setMessageType('success');
        setIsRegister(false);
        setPassword('');
      } else {
        if (!data.token || !data.user) {
          throw new Error('The server did not return a valid login response.');
        }

        localStorage.setItem('token', data.token);
        onLogin(data.user);
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister((current) => !current);
    setMessage('');
    setMessageType('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-bg-blob blob-1"></div>
      <div className="auth-bg-blob blob-2"></div>

      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo-icon">
            <span>⚡</span>
          </div>
          <span className="brand-title">TaskPulse</span>
          <span className="brand-tag">MERN Stack</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="auth-subtitle">
            {isRegister
              ? 'Start organizing and optimizing your tasks today'
              : 'Sign in to access your task dashboard and analytics'}
          </p>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={() => {
            setMessage('Google sign-in is not configured yet.');
            setMessageType('info');
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="google-icon">
            <path
              fill="#4285F4"
              d="M21.35 12.2c0-.7-.06-1.37-.18-2.02H12v3.83h5.24a4.48 4.48 0 0 1-1.95 2.94v2.4h3.16c1.85-1.7 2.9-4.2 2.9-7.15Z"
            />
            <path
              fill="#34A853"
              d="M12 21.7c2.65 0 4.88-.88 6.5-2.36l-3.16-2.4c-.88.6-2 .96-3.34.96-2.57 0-4.75-1.73-5.53-4.06H3.2v2.47A9.8 9.8 0 0 0 12 21.7Z"
            />
            <path
              fill="#FBBC05"
              d="M6.47 13.84a5.9 5.9 0 0 1 0-3.68V7.69H3.2a9.8 9.8 0 0 0 0 8.62l3.27-2.47Z"
            />
            <path
              fill="#EA4335"
              d="M12 6.1c1.44 0 2.73.5 3.75 1.5l2.81-2.81A9.4 9.4 0 0 0 12 2.1a9.8 9.8 0 0 0-8.8 5.59l3.27 2.47C7.25 7.83 9.43 6.1 12 6.1Z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span></span>
          <small>OR CONTINUE WITH EMAIL</small>
          <span></span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@charusat.edu.in"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="auth-password">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => {
                    setMessage('Password recovery is managed by the administrator.');
                    setMessageType('info');
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="password-input-wrap">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 8 : undefined}
                required
              />

              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword((curr) => !curr)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {message && (
            <div className={`auth-alert ${messageType}`} role="status">
              <span className="alert-icon">
                {messageType === 'success' ? '✅' : messageType === 'info' ? 'ℹ️' : '⚠️'}
              </span>
              <span className="alert-text">{message}</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner-wrap">
                <span className="btn-spinner"></span>
                <span>Processing...</span>
              </span>
            ) : isRegister ? (
              'Create Account'
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="auth-footer-toggle">
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
          <button type="button" className="mode-switch-btn" onClick={switchMode}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Login;

