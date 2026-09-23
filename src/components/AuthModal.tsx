import React from 'react';
import { X, Search, BarChart3, Users2, Lightbulb, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase, getAppUrl } from '../lib/supabase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => Promise<void>;
  passwordRecovery?: boolean;
}

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.15c1.84-1.69 2.91-4.18 2.91-7.26Z"/>
    <path fill="#34A853" d="M12 21.66c2.63 0 4.84-.87 6.45-2.37l-3.15-2.45c-.87.58-1.98.92-3.3.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.66Z"/>
    <path fill="#FBBC05" d="M6.54 13.73A5.85 5.85 0 0 1 6.23 12c0-.6.1-1.19.31-1.73V7.74H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.26l3.25-2.53Z"/>
    <path fill="#EA4335" d="M12 6.24c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.28 14.63 2.34 12 2.34a9.74 9.74 0 0 0-8.71 5.4l3.25 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"/>
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [forgotMode, setForgotMode] = React.useState(false);

  if (!isOpen) return null;

  const clearFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const switchMode = (next: 'signin' | 'signup') => {
    clearFeedback();
    setForgotMode(false);
    setMode(next);
  };

  const handleGoogle = async () => {
    clearFeedback();
    setLoading(true);
    try {
      await supabase.auth.signOut({ scope: 'local' });
      window.sessionStorage.removeItem('kdp_oauth_pending');
      window.sessionStorage.setItem('kdp_oauth_pending', '1');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAppUrl(),
          queryParams: { prompt: 'select_account' }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      window.sessionStorage.removeItem('kdp_oauth_pending');
      setError(err?.message || 'Google sign-in is not available right now.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter your email address and password.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password,
            name: name.trim() || cleanEmail.split('@')[0]
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to create your account.');

        // The server creates the Supabase Auth user with email_confirm=true.
        // Sign in immediately so the normal session/profile loading flow takes over.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (signInError) throw signInError;
        setMessage('Account created successfully. Signing you in...');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        setMessage('Signed in successfully.');
      }
    } catch (err: any) {
      setError(err?.message || (mode === 'signup' ? 'Unable to create your account.' : 'Unable to sign in.'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: getAppUrl()
      });
      if (error) throw error;
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setError(err?.message || 'Unable to send password reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full p-2 sm:p-3 flex items-center justify-center">
        <div className="relative w-full max-w-4xl min-h-0 max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-white/60 flex flex-col lg:flex-row">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-sm border border-slate-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Marketing panel */}
          <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-100 to-amber-400" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/90 via-orange-500/20 to-transparent" />
            <div className="relative z-10 p-5 sm:p-6 lg:p-7 h-full flex flex-col">
              <div className="max-w-lg">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 leading-[1.02]">
                  Find Your<br />Next KDP<br />Opportunity
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-md">
                  AI-powered research tools to help you discover profitable low-competition niches on Amazon KDP.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    { icon: Search, title: 'Niche Research', text: 'Find profitable, low-competition niches', cls: 'bg-amber-100 text-amber-700' },
                    { icon: BarChart3, title: 'Keyword Research', text: 'Discover high-ranking keywords', cls: 'bg-blue-100 text-blue-700' },
                    { icon: Users2, title: 'Competitor Analysis', text: 'Analyze top-performing books', cls: 'bg-emerald-100 text-emerald-700' },
                    { icon: Lightbulb, title: 'AI-Powered Insights', text: 'Get actionable recommendations', cls: 'bg-rose-100 text-rose-700' }
                  ].map(({ icon: Icon, title, text, cls }) => (
                    <div key={title} className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-2 ring-white/80 ${cls}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base">{title}</div>
                        <div className="text-xs sm:text-sm text-slate-600">{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 text-white">
                <div className="text-xl sm:text-2xl font-black leading-tight max-w-md">
                  “Opportunities don't happen.<br />You find them.”
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="w-9 h-1 bg-amber-400 rounded-full" />
                  <span className="text-xs tracking-[0.3em] font-semibold">KDP DIGGER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication panel */}
          <div className="lg:w-1/2 bg-white flex items-center justify-center p-5 sm:p-7 lg:p-8 overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="text-center">
                <img src="/kdp-digger-logo.png" alt="KDP Digger" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover mx-auto shadow-lg" />
                <h2 className="mt-4 text-xl sm:text-2xl font-black text-slate-950">Sign {mode === 'signin' ? 'in' : 'up'} to KDP Digger</h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">Access your account and continue your research journey</p>
              </div>

              {forgotMode ? (
                <form onSubmit={handleForgotPassword} className="mt-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="Enter your email" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                    </div>
                  </div>
                  {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{error}</div>}
                  {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">{message}</div>}
                  <button disabled={loading} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold">{loading ? 'Sending...' : 'Send reset link'}</button>
                  <button type="button" onClick={() => { clearFeedback(); setForgotMode(false); }} className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700">Back to sign in</button>
                </form>
              ) : (
                <>
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="mt-5 w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:bg-slate-50 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-sm"
                  >
                    <GoogleLogo />
                    {loading ? 'Connecting to Google...' : 'Continue with Google'}
                  </button>

                  <div className="flex items-center gap-4 my-4">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold text-slate-400">OR</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Full name</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" autoComplete="name" placeholder="Enter your name" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="Enter your email" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-slate-800">Password</label>
                        {mode === 'signin' && <button type="button" onClick={() => { clearFeedback(); setForgotMode(true); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</button>}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder="Enter your password" className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{error}</div>}
                    {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">{message}</div>}

                    <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-sm shadow-sm">
                      {loading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'signup' ? 'Sign up' : 'Sign in')}
                    </button>
                  </form>

                  <div className="text-center mt-4 text-sm text-slate-500">
                    {mode === 'signin' ? (
                      <>Don't have an account? <button onClick={() => switchMode('signup')} className="font-bold text-blue-600 hover:text-blue-700">Sign up</button></>
                    ) : (
                      <>Already have an account? <button onClick={() => switchMode('signin')} className="font-bold text-blue-600 hover:text-blue-700">Sign in</button></>
                    )}
                  </div>
                </>
              )}

              <div className="mt-5 p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Secure & Protected</div>
                  <div className="text-xs text-slate-500 mt-0.5">Your data is encrypted and secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
