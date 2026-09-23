import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, BookOpen, ChevronDown, Lightbulb } from 'lucide-react';

interface ResearchHeroProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
  activeTopic?: string;
}

interface NicheGroup {
  name: string;
  icon: string;
  subNiches: string[];
}

const POPULAR_NICHE_GROUPS: NicheGroup[] = [
  {
    name: 'Christian & Prayer',
    icon: '✝',
    subNiches: [
      'Daily Christian Prayer',
      'Morning Prayers',
      'Bedtime Prayers',
      'Prayer for Anxiety & Peace',
      'Prayer Journals',
      'Bible Verse Prayer',
      'Prayers for Women',
      'Prayers for Men',
      'Prayers for Seniors',
      'Prayers for Children',
      'Prayers for Couples',
      'Healing & Strength Prayers'
    ]
  },
  {
    name: 'Coloring Books',
    icon: '✎',
    subNiches: [
      'Animals',
      'Kids Coloring',
      'Mandala',
      'Stress Relief',
      'Cute & Cozy',
      'Seasonal Coloring',
      'Educational Coloring',
      'Large Print Coloring'
    ]
  },
  {
    name: 'Journals & Planners',
    icon: '▤',
    subNiches: [
      'Gratitude Journals',
      'Anxiety Journals',
      'Wellness Journals',
      'Prayer Journals',
      'Daily Planners',
      'Fitness Journals',
      'Meal Planners',
      'Prompt Journals'
    ]
  },
  {
    name: 'Puzzles & Activity',
    icon: '▦',
    subNiches: [
      'Word Search',
      'Crossword Puzzles',
      'Sudoku',
      'Mazes',
      'Logic Puzzles',
      'Murder Mystery Puzzles',
      'Kids Activity Books',
      'Brain Games'
    ]
  },
  {
    name: 'Self-Help & Wellness',
    icon: '♡',
    subNiches: [
      'Anxiety & Stress',
      'Mindfulness',
      'Sleep & Relaxation',
      'Personal Growth',
      'Motivation',
      'Habit Building',
      'Confidence',
      'Relationships'
    ]
  },
  {
    name: 'Kids & Education',
    icon: '★',
    subNiches: [
      'Preschool Learning',
      'Alphabet & Numbers',
      'Handwriting Practice',
      'Math Workbooks',
      'Science Activity',
      'Homeschool',
      'Reading Practice',
      'Kids Coloring'
    ]
  },
  {
    name: 'Cookbooks & Food',
    icon: '♨',
    subNiches: [
      'Air Fryer',
      'Healthy Recipes',
      'Easy Family Meals',
      'Baking',
      'Slow Cooker',
      'Meal Prep',
      'Diabetic-Friendly',
      'High-Protein Recipes'
    ]
  },
  {
    name: 'Large Print',
    icon: 'A',
    subNiches: [
      'Large Print Word Search',
      'Large Print Puzzles',
      'Large Print Coloring',
      'Large Print Crosswords',
      'Large Print Bible',
      'Large Print Devotionals',
      'Large Print Activity Books',
      'Large Print Books for Seniors'
    ]
  }
];

export const ResearchHero: React.FC<ResearchHeroProps> = ({
  onSearch,
  isLoading,
  activeTopic = ''
}) => {
  const [inputVal, setInputVal] = useState(activeTopic || 'Christian prayer');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState('Christian & Prayer');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTopic) setInputVal(activeTopic);
  }, [activeTopic]);

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

  const handleSelectNiche = (group: NicheGroup) => {
    setSelectedNiche(group.name);
    setShowDropdown(false);
  };

  const handleSelectSubNiche = (subNiche: string) => {
    setInputVal(subNiche);
    setShowDropdown(false);
  };

  const selectedGroup = POPULAR_NICHE_GROUPS.find(group => group.name === selectedNiche) || POPULAR_NICHE_GROUPS[0];

  return (
    <div id="dashboard-hero-section" className="bg-gradient-to-b from-white via-amber-50/20 to-white border border-slate-200/80 rounded-2xl p-5 sm:p-8 shadow-xs mb-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>KDP Digger · Dig Deeper</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            Dig Deeper. Find Better KDP Opportunities.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Start with a KDP topic, then explore popular niches and drill down into focused sub-niches before researching the opportunity.
          </p>
        </div>

        <div ref={wrapperRef} className="relative max-w-3xl mx-auto mb-6">
          <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-xl border-2 border-amber-400 focus-within:ring-4 focus-within:ring-amber-100 transition-all shadow-sm">
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
                placeholder="Search a KDP topic, keyword, niche or Amazon book URL..."
                className="w-full py-3 px-3 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base outline-none bg-transparent"
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
                      onClick={() => {
                        setInputVal(item);
                        setShowDropdown(false);
                      }}
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

        <section aria-labelledby="popular-kdp-niches" className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 id="popular-kdp-niches" className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                KDP Popular Niches
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Choose a broad niche to reveal related sub-niches.
              </p>
            </div>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Explore &amp; drill down
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {POPULAR_NICHE_GROUPS.map(group => {
              const active = group.name === selectedNiche;
              return (
                <button
                  key={group.name}
                  type="button"
                  onClick={() => handleSelectNiche(group)}
                  className={`shrink-0 px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span aria-hidden="true">{group.icon}</span>
                  <span>{group.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/50' : 'bg-slate-100 text-slate-500'
                  }`}>{group.subNiches.length}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 bg-slate-50/80 border border-slate-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <div className="text-xs font-extrabold text-slate-900">{selectedGroup.name} Sub-Niches</div>
                <div className="text-[10px] text-slate-500">Click a sub-niche to place it in the research bar.</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedGroup.subNiches.map(subNiche => (
                <button
                  key={subNiche}
                  type="button"
                  onClick={() => handleSelectSubNiche(subNiche)}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 text-[11px] sm:text-xs font-medium text-slate-700 transition-colors disabled:opacity-50"
                >
                  {subNiche}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50/90 border border-slate-200/60 rounded-lg py-2 px-3 max-w-2xl mx-auto mt-5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Research results are based on available market data and AI analysis. Results are indicators, not guarantees of sales.</span>
        </div>
      </div>
    </div>
  );
};
