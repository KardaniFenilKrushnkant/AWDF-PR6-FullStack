
import { useState } from 'react';
import './Login.css';

const API_URL = 'http://localhost:3000';

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
      const endpoint = isRegister
        ? '/auth/register'
        : '/auth/login';

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
        setMessage('Account created successfully. Please log in.');
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
      <section className="auth-container">
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 44 44" fill="none">
            <rect x="2" y="2" width="40" height="40" rx="12" fill="#005638" />
            <path
              d="M13 14H31M22 14V31"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="auth-title">
          {isRegister ? 'Create account' : 'Log in'}
        </h1>

        <p className="auth-subtitle">
          {isRegister
            ? 'Create your account to manage your tasks.'
            : 'Welcome back. Sign in to continue.'}
        </p>

        <button
          type="button"
          className="google-button"
          onClick={() => {
            setMessage('Google sign-in is not configured yet.');
            setMessageType('info');
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
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
          <span />
          <small>OR</small>
          <span />
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email or username</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <label htmlFor="auth-password" className="auth-password-label">
            Password
          </label>

          <div className="auth-password-wrap">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={isRegister ? 8 : undefined}
              required
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 3L21 21M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10 10 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-3.1 3.8M6.2 6.2C4.1 7.6 3 10 3 12s3.5 7 9 7a10 10 0 0 0 4-.8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              )}
            </button>
          </div>

          {!isRegister && (
            <button
              type="button"
              className="forgot-password"
              onClick={() => {
                setMessage('Password recovery is not configured yet. Please contact the administrator.');
                setMessageType('info');
              }}
            >
              Forgot password?
            </button>
          )}

          {message && (
            <div
              className={`auth-message ${messageType}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>

        <div className="auth-create-account">
          <p>
            {isRegister ? 'Already have an account?' : 'No account?'}
          </p>
          <button
            type="button"
            className="auth-outline-button"
            onClick={switchMode}
          >
            {isRegister ? 'Log in' : 'Create account'}
          </button>
        </div>

        <p className="auth-footer">Simple, focused task management.</p>
      </section>
    </main>
  );
}

export default Login;
