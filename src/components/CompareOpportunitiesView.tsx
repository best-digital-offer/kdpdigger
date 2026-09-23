import React from 'react';
import { GitCompare, X, AlertCircle, ArrowRight, Check, Sparkles } from 'lucide-react';
import { OpportunityItem } from '../types.ts';
import { CompetitionBadge, DemandBadge, MarketMaturityBadge } from './Badges.tsx';

interface CompareOpportunitiesViewProps {
  opportunities: OpportunityItem[];
  onRemoveFromCompare: (oppId: string) => void;
  onSelectOpportunity: (opp: OpportunityItem) => void;
  onClearAll: () => void;
}

export const CompareOpportunitiesView: React.FC<CompareOpportunitiesViewProps> = ({
  opportunities,
  onRemoveFromCompare,
  onSelectOpportunity,
  onClearAll
}) => {
  if (opportunities.length < 2) {
    return (
      <div id="compare-opportunities-empty" className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <GitCompare className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Compare 2 to 4 Opportunities Side-by-Side
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Select opportunities from the Opportunity Finder by clicking &ldquo;Compare Opportunity&rdquo; to analyze trade-offs, audience specificity, and competition signals side-by-side.
        </p>
        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 border border-slate-200/80 max-w-md mx-auto">
          Currently selected: <strong>{opportunities.length}</strong> opportunity. Add at least one more to compare.
        </div>
      </div>
    );
  }

  return (
    <div id="compare-opportunities-page" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Feature 10 &middot; Side-by-Side Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Opportunity Comparison ({opportunities.length} Selected)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating analytical trade-offs so you can choose the best fit for your publishing strategy.
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors"
        >
          Clear Comparison
        </button>
      </div>

      {/* Strict Anti-Winner Rule Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>No Single &ldquo;Winner&rdquo; Rule:</strong> Every publishing opportunity involves deliberate trade-offs between competition, audience size, and production effort.
          This tool presents objective analytical indicators so you can decide based on your own skills, budget, and catalog goals.
        </p>
      </div>

      {/* Side-by-Side Table Matrix */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-44 font-bold text-slate-500 uppercase tracking-wider text-[11px] shrink-0">
                Opportunity Dimension
              </th>
              {opportunities.map((opp) => (
                <th key={opp.id} className="p-4 font-bold text-slate-900 min-w-[280px] max-w-[340px]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-extrabold">{opp.title}</span>
                    <button
                      onClick={() => onRemoveFromCompare(opp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Signals */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Market Signals</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    <CompetitionBadge signal={opp.competitionSignal} />
                    <DemandBadge signal={opp.demandSignal} />
                    <MarketMaturityBadge maturity={opp.marketMaturity} />
                  </div>
                </td>
              ))}
            </tr>

            {/* Narrowed From */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Topic Narrowing Path</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 text-slate-700 leading-relaxed">
                  <div className="space-y-1">
                    {opp.narrowingHierarchy.map((h, i) => (
                      <div key={i} className="text-[11px] font-mono text-slate-600">
                        {i > 0 ? '↳ ' : ''}{h}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Target Audience */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Target Buyer</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 text-slate-800 leading-relaxed font-medium">
                  {opp.whyInvestigate.audience}
                </td>
              ))}
            </tr>

            {/* Specific Problem */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Core Reader Pain Point</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 text-slate-700 leading-relaxed">
                  {opp.whyInvestigate.problem}
                </td>
              ))}
            </tr>

            {/* Competitor Situation */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Competitor Density</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 text-slate-700 leading-relaxed">
                  {opp.whyInvestigate.competitorSituation}
                </td>
              ))}
            </tr>

            {/* Key Opportunity Explanation */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Strategic Rationale</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 text-slate-600 leading-relaxed italic">
                  {opp.opportunityExplanation}
                </td>
              ))}
            </tr>

            {/* Suggested Angles */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Example Book Concepts</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4 space-y-1.5">
                  {opp.suggestedBookAngles.slice(0, 3).map((angle, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200/80 text-slate-800 font-medium text-[11px]">
                      &ldquo;{angle}&rdquo;
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Top Keywords */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Primary Target Keywords</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {opp.relatedKeywords.slice(0, 5).map((kw, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Actions Row */}
            <tr className="bg-slate-50/80">
              <td className="p-4 font-semibold text-slate-600">Select For Publishing</td>
              {opportunities.map((opp) => (
                <td key={opp.id} className="p-4">
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Opportunity Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
