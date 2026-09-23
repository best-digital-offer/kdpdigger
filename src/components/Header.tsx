import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, User as UserIcon, Menu, ExternalLink, ShieldCheck, ChevronDown, Coins, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onSearch: (topic: string) => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onToggleLandingPage: () => void;
  isLandingPage: boolean;
  onToggleSidebar: () => void;
  onSwitchUserRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSearch,
  onOpenPricing,
  onOpenAuth,
  onToggleLandingPage,
  isLandingPage,
  onToggleSidebar,
  onSwitchUserRole
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced Amazon live autocomplete search suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/research/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions?.slice(0, 7) || []);
        }
      } catch {
        setSuggestions([]);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    onSearch(s);
  };

  return (
    <header id="app-top-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isLandingPage && (
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight block">
                KDP Digger
              </span>
              <span className="text-[10px] text-amber-700 font-semibold tracking-wide hidden sm:block">
                Dig Deeper. Find Better KDP Opportunities.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Center Search Input */}
      {!isLandingPage && (
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-auto">
          <form onSubmit={handleFormSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="top-quick-search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search KDP topic, keyword or book URL..."
              className="w-full pl-10 pr-24 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            />
            <button
              id="top-quick-search-submit"
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Research</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div id="top-search-suggestions-list" className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Live Amazon Search Suggestions</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Verified
                </span>
              </div>
              <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <li key={idx}>
                    <button
                      id={`top-suggestion-item-${idx}`}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-amber-50/70 hover:text-amber-900 flex items-center gap-2 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Right Action Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Landing / App View */}
        <button
          id="toggle-landing-app-btn"
          onClick={onToggleLandingPage}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors hidden sm:flex items-center gap-1.5"
        >
          {isLandingPage ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Open Dashboard</span>
            </>
          ) : (
            <>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Landing Page</span>
            </>
          )}
        </button>

        {/* Credits Badge */}
        <button
          id="credits-top-badge"
          onClick={onOpenPricing}
          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          title="View plan and research credits"
        >
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden xs:inline">Credits:</span>
          <span className="font-bold text-amber-950">{currentUser.credits}</span>
          <span className="text-[10px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-bold ml-0.5">+ Top up</span>
        </button>

        {/* Account Menu */}
        <div className="relative">
          <button
            id="account-menu-btn"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {showAccountMenu && (
            <div id="account-dropdown-menu" className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Plan: {currentUser.plan}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="py-1">
                <button
                  id="account-switch-role-btn"
                  onClick={() => {
                    onSwitchUserRole();
                    setShowAccountMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Switch Role Mode</span>
                  <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded">
                    {currentUser.role === 'admin' ? 'User Mode' : 'Admin Mode'}
                  </span>
                </button>

                <button
                  id="account-open-pricing-btn"
                  onClick={() => {
                    onOpenPricing();
                    setShowAccountMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Plans & Fair-Use Pricing ($1 - $3)</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  id="account-sign-out-btn"
                  onClick={() => {
                    onOpenAuth();
                    setShowAccountMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
