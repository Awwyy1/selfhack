import React, { useState } from 'react';
import { Zap, Mail, Lock, User, Loader2, Eye, EyeOff, ArrowRight, Ticket } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { user, error } = await authService.signIn(email, password);
        if (error) {
          setError(error.message);
        } else if (user) {
          onAuthSuccess();
        }
      } else if (mode === 'signup') {
        const { user, error } = await authService.signUp(email, password, displayName);
        if (error) {
          setError(error.message);
        } else if (user) {
          setMessage('Check your email to confirm your account!');
          setMode('login');
        }
      } else if (mode === 'forgot') {
        const { error } = await authService.resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Password reset link sent to your email!');
          setMode('login');
        }
      }
    } catch (e) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await authService.signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap size={28} className="text-white dark:text-black" />
            </div>
            <span className="font-orbitron font-black text-3xl tracking-tighter neon-glow text-cyan-600 dark:text-cyan-400">SELFHACK</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-mono uppercase tracking-widest">
            {mode === 'login' ? 'Initialize Neural Link' : mode === 'signup' ? 'Create Neural Profile' : 'Reset Access Code'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm font-mono">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={18} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter callsign..."
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="neural@link.io"
                  required
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono uppercase tracking-widest hover:underline"
              >
                Forgot Access Code?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'login' ? 'Connect' : mode === 'signup' ? 'Initialize' : 'Reset'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="px-4 bg-white dark:bg-[#0f0f0f] text-slate-400 dark:text-slate-600 font-mono tracking-widest">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 glass border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold uppercase tracking-widest rounded-xl hover:border-cyan-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </>
          )}

          <div className="mt-8 text-center">
            {mode === 'login' ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                New to the matrix?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setMessage(''); }} className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                  Create Profile
                </button>
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Already connected?{' '}
                <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Promo hint */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-600 font-mono uppercase tracking-widest">
            <Ticket size={14} />
            <span>Have a promo code? Redeem after sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
