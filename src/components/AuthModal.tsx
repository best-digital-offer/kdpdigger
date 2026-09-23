import React from 'react';
import { X, Sparkles, Chrome } from 'lucide-react';
import { supabase, getAppUrl } from '../lib/supabase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => Promise<void>;
  passwordRecovery?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    window.sessionStorage.setItem('kdp_oauth_pending', '1');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAppUrl(),
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
    } catch (err: any) {
      window.sessionStorage.removeItem('kdp_oauth_pending');
      setError(err?.message || 'Google sign-in is not available right now.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Sign in to KDP Digger</h3>
          <p className="text-xs text-amber-800 font-semibold mt-1">
            Dig Deeper. Find Better KDP Opportunities.
          </p>
        </div>

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
