import React, { useState } from 'react';
import { Compass, Sparkles, Filter, DollarSign, TrendingUp, Users, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { NicheItem } from '../types.ts';
import { CompetitionBadge, DemandBadge, MarketMaturityBadge } from './Badges.tsx';

interface NicheResearchViewProps {
  niches: NicheItem[];
  topic: string;
  onExploreNiche: (nicheName: string) => void;
  onSelectKeyword: (kw: string) => void;
}

export const NicheResearchView: React.FC<NicheResearchViewProps> = ({
  niches,
  topic,
  onExploreNiche,
  onSelectKeyword
}) => {
  const [filterCompetition, setFilterCompetition] = useState<string>('all');
  const [filterMaturity, setFilterMaturity] = useState<string>('all');

  const filteredNiches = niches.filter(n => {
    if (filterCompetition !== 'all' && n.competitionSignal !== filterCompetition) return false;
    if (filterMaturity !== 'all' && n.marketMaturity !== filterMaturity) return false;
    return true;
  });

  return (
    <div id="niche-research-page" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <Compass className="w-4 h-4" />
            <span>Niche Opportunity Discovery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sub-Niches for &ldquo;{topic}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted sub-markets with distinct audience needs, competitive dynamics, and pricing power.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCompetition}
              onChange={(e) => setFilterCompetition(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 outline-none"
            >
              <option value="all">All Competition</option>
              <option value="Low">Low Competition</option>
              <option value="Moderate">Moderate Competition</option>
              <option value="High">High Competition</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <select
              value={filterMaturity}
              onChange={(e) => setFilterMaturity(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 outline-none"
            >
              <option value="all">All Maturity</option>
              <option value="Emerging">Emerging</option>
              <option value="Established">Established</option>
              <option value="Crowded">Crowded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Niches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNiches.map((niche) => (
          <div
            key={niche.id}
            id={`niche-card-${niche.id}`}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {niche.broadCategory}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {niche.nicheName}
                  </h3>
                </div>
              </div>

              {/* Signals Row */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <CompetitionBadge signal={niche.competitionSignal} />
                <DemandBadge signal={niche.demandSignal} />
                <MarketMaturityBadge maturity={niche.marketMaturity} />
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50/80 rounded-lg border border-slate-100 text-xs mb-4">
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Estimated Pricing</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {niche.priceRange}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">BSR Signal</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate" title={niche.bsrRange}>
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    {niche.bsrRange}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] font-medium">Competitor Density</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate" title={niche.competitorCountEstimated}>
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    {niche.competitorCountEstimated}
                  </span>
                </div>
              </div>

              {/* AI Opportunity Interpretation */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Opportunity Assessment
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                  {niche.opportunityInterpretation}
                </p>
              </div>

              {/* Suggested Angles */}
              {niche.suggestedAngles && niche.suggestedAngles.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    Suggested Book Angles
                  </h4>
                  <ul className="space-y-1.5">
                    {niche.suggestedAngles.map((angle, aidx) => (
                      <li key={aidx} className="text-xs text-slate-700 bg-white border border-slate-200/80 p-2 rounded-md flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                        <span className="leading-snug">{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Keywords */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Related Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {niche.relatedKeywords.map((kw, kwIdx) => (
                    <button
                      key={kwIdx}
                      onClick={() => onSelectKeyword(kw)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded text-xs transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => onExploreNiche(niche.nicheName)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Research This Niche</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
