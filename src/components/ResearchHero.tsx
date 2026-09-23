import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, BookOpen, Compass, KeyRound, Lightbulb } from 'lucide-react';

interface ResearchHeroProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
  activeTopic?: string;
}

const QUICK_EXAMPLES = [
  'Christian prayer',
  'anxiety journal',
  'kids dinosaur coloring book',
  'gratitude journal',
  'murder mystery puzzles',
  'large print word search'
];

export const ResearchHero: React.FC<ResearchHeroProps> = ({
  onSearch,
  isLoading,
  activeTopic = ''
}) => {
  const [inputVal, setInputVal] = useState(activeTopic);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTopic) setInputVal(activeTopic);
  }, [activeTopic]);

  // Real Amazon autocomplete suggestions
  useEffect(() => {
    if (!inputVal.trim() || inputVal.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/research/suggestions?q=${encodeURIComponent(inputVal.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions?.slice(0, 8) || []);
        }
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inputVal]);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      setShowDropdown(false);
      onSearch(inputVal.trim());
    }
  };

  const handleSelectExample = (example: string) => {
    setInputVal(example);
    setShowDropdown(false);
    onSearch(example);
  };

  return (
    <div id="dashboard-hero-section" className="bg-gradient-to-b from-white via-amber-50/20 to-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>KDP Digger &middot; Dig Deeper</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          Dig Deeper. Find Better KDP Opportunities.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
          Research keywords, niches, competitor positioning, and market gaps before you spend time creating a book.
        </p>

        {/* Large Input Box */}
        <div ref={wrapperRef} className="relative max-w-2xl mx-auto mb-4">
          <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-xl border-2 border-slate-300 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100 transition-all shadow-sm">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                id="hero-topic-search-input"
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Enter a topic, keyword, niche or Amazon book URL..."
                className="w-full py-2.5 px-3 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base outline-none bg-transparent"
                disabled={isLoading}
              />
            </div>

            <button
              id="hero-research-btn"
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Research Opportunity</span>
                </>
              )}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div id="hero-suggestions-dropdown" className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 text-left">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Live Amazon Book Search Suggestions
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">Real Shopper Queries</span>
              </div>
              <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li key={idx}>
                    <button
                      id={`hero-suggestion-${idx}`}
                      type="button"
                      onClick={() => handleSelectExample(item)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-amber-50/70 hover:text-amber-950 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                        <span>{item}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quick Examples */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs mb-5">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Quick examples:
          </span>
          {QUICK_EXAMPLES.map((ex) => (
            <button
              key={ex}
              id={`quick-example-${ex.replace(/\s+/g, '-').toLowerCase()}`}
              type="button"
              onClick={() => handleSelectExample(ex)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200/80 font-medium transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Analytical Disclaimer Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50/90 border border-slate-200/60 rounded-lg py-2 px-3 max-w-xl mx-auto">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Research results are based on available market data and AI analysis. Results are indicators, not guarantees of sales.</span>
        </div>
      </div>
    </div>
  );
};
