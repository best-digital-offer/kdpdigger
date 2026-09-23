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
      setError(err?.message || 'Google sign-in is not available right now.');
      setLoading(false);
    }
  };

  const title = 'Sign in to KDP Digger';

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
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

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 border border-slate-300 hover:bg-slate-50 disabled:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-3"
        >
          <Chrome className="w-5 h-5" />
          {loading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <p className="text-[11px] text-center text-slate-500 mt-4">
          Use your Google account to securely sign in or create your KDP Digger account.
        </p>
      </div>
    </div>
  );
};