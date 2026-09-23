import React, { useEffect, useState } from 'react';
import { X, Mail, Check, Sparkles, Chrome, KeyRound } from 'lucide-react';
import { supabase, getAppUrl } from '../lib/supabase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => Promise<void>;
  passwordRecovery?: boolean;
}

type Mode = 'signin' | 'signup' | 'forgot' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated, passwordRecovery = false }) => {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (passwordRecovery) setMode('reset');
  }, [passwordRecovery]);

  if (!isOpen) return null;

  const resetFeedback = () => {
    setMsg(null);
    setError(null);
  };

  const completeAuth = async () => {
    await onAuthenticated();
    setMsg('Authentication successful.');
    setTimeout(onClose, 700);
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      if (!email.trim() || password.length < 6) {
        throw new Error('Enter a valid email and a password of at least 6 characters.');
      }

      const result = mode === 'signup'
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: getAppUrl() }
          })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
          });

      if (result.error) throw result.error;

      if (mode === 'signup' && !result.data.session) {
        setMsg('Account created. Check your email to confirm your account, then sign in.');
      } else {
        await completeAuth();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    resetFeedback();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: getAppUrl() }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err?.message || 'Google sign-in is not configured yet.');
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg('Password updated successfully. You can now continue using KDP Digger.');
      await completeAuth();
    } catch (err: any) {
      setError(err?.message || 'Unable to update your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getAppUrl()
      });
      if (error) throw error;
      setMsg('If an account exists for this email, a password reset link has been sent.');
    } catch (err: any) {
      setError(err?.message || 'Unable to send the reset email.');
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === 'signup' ? 'Create your KDP Digger account' :
    mode === 'forgot' ? 'Reset your password' :
    mode === 'reset' ? 'Choose a new password' :
    'Sign in to KDP Digger';

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <p className="text-xs text-amber-800 font-semibold mt-1">Dig Deeper. Find Better KDP Opportunities.</p>
        </div>

        {msg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {mode === 'signin' || mode === 'signup' ? (
          <>
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="author@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-amber-500" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-slate-950 font-black text-xs rounded-xl">
                {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-[10px] text-slate-400">
              <span className="h-px bg-slate-200 flex-1" /> OR <span className="h-px bg-slate-200 flex-1" />
            </div>

            <button onClick={handleGoogle} disabled={loading}
              className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <Chrome className="w-4 h-4" /> Continue with Google
            </button>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { resetFeedback(); setMode('signup'); }}
                className={`py-2 rounded-lg text-xs font-bold border ${mode === 'signup' ? 'bg-amber-50 border-amber-400 text-amber-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { resetFeedback(); setMode('signin'); }}
                className={`py-2 rounded-lg text-xs font-bold border ${mode === 'signin' ? 'bg-slate-100 border-slate-400 text-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Sign In
              </button>
            </div>
            <button
              type="button"
              onClick={() => { resetFeedback(); setMode('forgot'); }}
              className="mt-3 w-full text-slate-500 text-[11px] font-semibold hover:underline"
            >
              Forgot password?
            </button>

          </>
        ) : mode === 'reset' ? (
          <form onSubmit={handlePasswordRecovery} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900" />
            </div>
            <button disabled={loading} className="w-full py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-4">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="author@example.com"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900" />
            <button disabled={loading} className="w-full py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => setMode('signin')} className="w-full text-xs text-slate-500">Back to sign in</button>
          </form>
        )}
      </div>
    </div>
  );
};
