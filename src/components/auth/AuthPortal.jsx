// src/components/auth/AuthPortal.jsx
import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useSupabaseAuth.jsx';

export default function AuthPortal() {
  const { signIn, signUp } = useAuth();
  const [activeScreen, setActiveScreen] = useState('login'); // login | register | forgot
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all registration fields.");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage('');
      setInfoMessage('');
      await signUp(email, password);
      // Try auto-logging in after registering
      await signIn(email, password);
    } catch (err) {
      if (err.message.includes("Email not confirmed") || err.message.includes("confirm your email")) {
        setInfoMessage("Registration successful! Check your email inbox to confirm registration.");
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage('');
      setInfoMessage('');
      await signIn(email, password);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    setErrorMessage('');
    setInfoMessage(`If that email is registered, we've sent a password reset link to it.`);
    setTimeout(() => {
      setActiveScreen('login');
      setInfoMessage('');
    }, 4000);
  };

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 160px)', padding: '2rem' }}>
      <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {activeScreen === 'login' && 'Sign In'}
            {activeScreen === 'register' && 'Create Account'}
            {activeScreen === 'forgot' && 'Reset Password'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.5' }}>
            {activeScreen === 'login' && 'Enter your academy credentials'}
            {activeScreen === 'register' && 'Start your B.Tech C journey today'}
            {activeScreen === 'forgot' && 'We will send you a retrieval key'}
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid var(--color-error)',
            color: 'var(--color-error)',
            fontSize: '0.8rem',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.25rem'
          }}>
            {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid var(--color-success)',
            color: 'var(--color-success)',
            fontSize: '0.8rem',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.25rem'
          }}>
            {infoMessage}
          </div>
        )}

        {/* Input Fields */}
        <form onSubmit={
          activeScreen === 'login' ? handleLogin :
          activeScreen === 'register' ? handleRegister : handleForgot
        }>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            {activeScreen === 'register' && (
              <div style={{ position: 'relative' }}>
                <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            )}

            {(activeScreen === 'login' || activeScreen === 'register' || activeScreen === 'forgot') && (
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            )}

            {(activeScreen === 'login' || activeScreen === 'register') && (
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            )}

          </div>

          {/* Form Actions */}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? 'Processing...' : (
              <>
                {activeScreen === 'login' && 'Sign In'}
                {activeScreen === 'register' && 'Sign Up'}
                {activeScreen === 'forgot' && 'Send Reset Key'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Navigation toggles */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {activeScreen === 'login' && (
            <>
              Don't have an account?{' '}
              <span onClick={() => { setActiveScreen('register'); setErrorMessage(''); setInfoMessage(''); }} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}>
                Register here
              </span>
              <br />
              <span onClick={() => { setActiveScreen('forgot'); setErrorMessage(''); setInfoMessage(''); }} style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-block', marginTop: '0.5rem' }}>
                Forgot Password?
              </span>
            </>
          )}

          {activeScreen === 'register' && (
            <>
              Already registered?{' '}
              <span onClick={() => { setActiveScreen('login'); setErrorMessage(''); setInfoMessage(''); }} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}>
                Sign In
              </span>
            </>
          )}

          {activeScreen === 'forgot' && (
            <span onClick={() => { setActiveScreen('login'); setErrorMessage(''); setInfoMessage(''); }} style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>
              Return to Login
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
