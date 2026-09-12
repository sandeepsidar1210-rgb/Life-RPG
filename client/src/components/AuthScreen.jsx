import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthScreen() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Redirect if already logged in
  if (user) {
    const destination = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineError(null);
    setSuccessMessage(null);

    // Client validations
    if (!email.trim()) {
      setInlineError('Please enter your study email.');
      return;
    }

    if (!password) {
      setInlineError('Please enter your secret password.');
      return;
    }

    if (password.length < 6) {
      setInlineError('Password must be at least 6 characters long.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setInlineError('Passwords do not match. Please recheck.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const data = await signUp(email.trim(), password);
        if (data.session) {
          navigate('/dashboard', { replace: true });
        } else {
          setSuccessMessage('Character created! Please check your email to verify if required.');
        }
      } else {
        await signIn(email.trim(), password);
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setInlineError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cozy-cream flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-cozy-brown-dark">
      {/* Decorative Study Elements */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <div 
          className="inline-flex items-center justify-center w-16 h-16 pixel-box bg-cozy-parchment rounded-pixel text-3xl mb-3 shadow-pixel select-none"
          aria-hidden="true"
        >
          ☕
        </div>
        <h1 className="text-3xl sm:text-4xl font-pixel text-cozy-brown-dark tracking-wide">
          Life RPG
        </h1>
        <p className="text-xs sm:text-sm text-cozy-brown-medium font-medium mt-1">
          Enter your study haven and turn daily tasks into quests
        </p>
      </motion.header>

      {/* Main Auth Card */}
      <main className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="pixel-box bg-cozy-card rounded-pixel shadow-pixel-lg overflow-hidden"
        >
          {/* Tab Headers */}
          <div role="tablist" aria-label="Authentication Options" className="flex border-b-2 border-cozy-brown-dark bg-cozy-parchment/80">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              aria-controls="auth-form"
              onClick={() => {
                setIsSignUp(false);
                setInlineError(null);
                setSuccessMessage(null);
              }}
              className={`touch-target flex-1 py-3 text-center font-pixel text-sm sm:text-base transition-colors focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
                !isSignUp 
                  ? 'bg-cozy-card text-cozy-brown-dark font-bold' 
                  : 'text-cozy-brown-medium hover:text-cozy-brown-dark hover:bg-cozy-parchment'
              }`}
            >
              <span aria-hidden="true">🔑</span> Log In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              aria-controls="auth-form"
              onClick={() => {
                setIsSignUp(true);
                setInlineError(null);
                setSuccessMessage(null);
              }}
              className={`touch-target flex-1 py-3 text-center font-pixel text-sm sm:text-base transition-colors focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
                isSignUp 
                  ? 'bg-cozy-card text-cozy-brown-dark font-bold' 
                  : 'text-cozy-brown-medium hover:text-cozy-brown-dark hover:bg-cozy-parchment'
              }`}
            >
              <span aria-hidden="true">✨</span> Sign Up
            </button>
          </div>

          {/* Form Body */}
          <form id="auth-form" onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <h2 className="sr-only">{isSignUp ? 'Sign Up for Life RPG' : 'Log In to Life RPG'}</h2>

            {/* Inline Error Notice */}
            <AnimatePresence mode="wait">
              {inlineError && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pixel-box bg-cozy-terracotta-subtle border-2 border-cozy-terracotta-dark p-3 rounded-pixel text-xs text-cozy-terracotta-dark flex items-start gap-2"
                >
                  <span className="text-sm" aria-hidden="true">⚠️</span>
                  <span className="flex-1 font-medium">{inlineError}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pixel-box bg-cozy-sage-subtle border-2 border-cozy-sage-dark p-3 rounded-pixel text-xs text-cozy-sage-dark flex items-start gap-2"
                >
                  <span className="text-sm" aria-hidden="true">🌱</span>
                  <span className="flex-1 font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label htmlFor="auth-email" className="block font-pixel text-xs sm:text-sm text-cozy-brown-dark mb-1.5 font-bold flex items-center gap-1.5">
                <span aria-hidden="true">📧</span> Study Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@liferpg.cozy"
                className="w-full bg-cozy-parchment/60 text-cozy-brown-dark border-2 border-cozy-brown-dark/70 rounded-pixel px-3.5 py-2.5 text-sm focus:outline-none focus:border-cozy-sage-dark focus:ring-2 focus:ring-cozy-sage/40 transition placeholder:text-cozy-brown-light"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password" className="block font-pixel text-xs sm:text-sm text-cozy-brown-dark font-bold flex items-center gap-1.5">
                  <span aria-hidden="true">🔒</span> Secret Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide secret password' : 'Show secret password'}
                  aria-pressed={showPassword}
                  className="touch-target min-h-[36px] px-2 text-xs text-cozy-brown-medium hover:text-cozy-brown-dark font-medium underline focus-visible:outline-2 focus-visible:outline-cozy-brown-dark rounded"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cozy-parchment/60 text-cozy-brown-dark border-2 border-cozy-brown-dark/70 rounded-pixel px-3.5 py-2.5 text-sm focus:outline-none focus:border-cozy-sage-dark focus:ring-2 focus:ring-cozy-sage/40 transition placeholder:text-cozy-brown-light"
              />
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label htmlFor="auth-confirm-password" className="block font-pixel text-xs sm:text-sm text-cozy-brown-dark mb-1.5 font-bold flex items-center gap-1.5">
                  <span aria-hidden="true">🛡️</span> Confirm Password
                </label>
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cozy-parchment/60 text-cozy-brown-dark border-2 border-cozy-brown-dark/70 rounded-pixel px-3.5 py-2.5 text-sm focus:outline-none focus:border-cozy-sage-dark focus:ring-2 focus:ring-cozy-sage/40 transition placeholder:text-cozy-brown-light"
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="touch-target w-full pixel-box-interactive bg-cozy-sage text-white font-pixel text-sm sm:text-base py-3 rounded-pixel font-bold flex items-center justify-center gap-2 hover:bg-cozy-sage-dark active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                  <span>{isSignUp ? 'Creating Character...' : 'Opening Study Room...'}</span>
                </span>
              ) : (
                <span>{isSignUp ? '✨ Create Character' : '🚪 Enter Study Room'}</span>
              )}
            </button>
          </form>

          {/* Footer info */}
          <div className="bg-cozy-parchment/60 border-t border-cozy-border px-6 py-3.5 text-center text-xs text-cozy-brown-medium">
            {isSignUp ? (
              <span>
                Already have a character?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setInlineError(null);
                  }}
                  className="touch-target font-bold text-cozy-terracotta-dark hover:underline focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
                >
                  Log In
                </button>
              </span>
            ) : (
              <span>
                Need a character?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setInlineError(null);
                  }}
                  className="touch-target font-bold text-cozy-sage-dark hover:underline focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </main>

      {/* Cozy Theme Badge */}
      <footer className="mt-8 text-xs text-cozy-brown-medium flex items-center gap-2 font-pixel">
        <span aria-hidden="true">🍂</span> Life RPG • Accessible Pixel Study Haven
      </footer>
    </div>
  );
}
