import React, { useState } from 'react';
import { Sparkles, ArrowRight, Bookmark, BookmarkCheck, GitCompare, FileText, CheckCircle2, ChevronRight, HelpCircle, Layers, Lightbulb } from 'lucide-react';
import { OpportunityItem } from '../types.ts';
import { CompetitionBadge, DemandBadge, MarketMaturityBadge } from './Badges.tsx';

interface OpportunityFinderViewProps {
  opportunities: OpportunityItem[];
  topic: string;
  onSaveOpportunity: (opp: OpportunityItem) => void;
  isOpportunitySaved: (oppId: string) => boolean;
  onCompareOpportunity: (opp: OpportunityItem) => void;
  isOpportunityInCompare: (oppId: string) => boolean;
  onViewFullReport: () => void;
  onSelectKeyword: (kw: string) => void;
}

export const OpportunityFinderView: React.FC<OpportunityFinderViewProps> = ({
  opportunities,
  topic,
  onSaveOpportunity,
  isOpportunitySaved,
  onCompareOpportunity,
  isOpportunityInCompare,
  onViewFullReport,
  onSelectKeyword
}) => {
  const [activeTab, setActiveTab] = useState<string>(opportunities[0]?.id || '');

  const selectedOpp = opportunities.find(o => o.id === activeTab) || opportunities[0];

  return (
    <div id="opportunity-finder-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Core Differentiator &middot; Topic Narrowing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
            Opportunity Discovery for &ldquo;{topic}&rdquo;
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
            Generic topics are almost always too competitive for indie authors. We actively narrow your broad concept down to specialized, high-intent angles where you can realistically rank and compete.
          </p>
        </div>
      </div>

      {/* Tabs / Selectors for Opportunities */}
      {opportunities.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {opportunities.map((opp, idx) => (
            <button
              key={opp.id}
              onClick={() => setActiveTab(opp.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                (activeTab === opp.id || (!activeTab && idx === 0))
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                (activeTab === opp.id || (!activeTab && idx === 0)) ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {idx + 1}
              </span>
              <span>{opp.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Opportunity Detail View */}
      {selectedOpp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
          {/* Top Title & Action bar */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CompetitionBadge signal={selectedOpp.competitionSignal} />
                <DemandBadge signal={selectedOpp.demandSignal} />
                <MarketMaturityBadge maturity={selectedOpp.marketMaturity} />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                {selectedOpp.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {selectedOpp.opportunityExplanation}
              </p>
            </div>

            {/* Actions: Compare, Save, Full Report */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                id="opp-compare-btn"
                onClick={() => onCompareOpportunity(selectedOpp)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isOpportunityInCompare(selectedOpp.id)
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>{isOpportunityInCompare(selectedOpp.id) ? 'Added to Compare' : 'Compare Opportunity'}</span>
              </button>

              <button
                id="opp-save-btn"
                onClick={() => onSaveOpportunity(selectedOpp)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isOpportunitySaved(selectedOpp.id)
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isOpportunitySaved(selectedOpp.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>Saved in Library</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save Opportunity</span>
                  </>
                )}
              </button>

              <button
                id="opp-full-report-btn"
                onClick={onViewFullReport}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Full Report</span>
              </button>
            </div>
          </div>

          {/* Educational Topic Narrowing Hierarchy */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Layers className="w-4 h-4" />
              <span>How We Narrowed This Topic</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
              {selectedOpp.narrowingHierarchy.map((step, idx) => (
                <React.Fragment key={idx}>
                  <span className={`px-2.5 py-1 rounded-md font-semibold ${
                    idx === selectedOpp.narrowingHierarchy.length - 1
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}>
                    {step}
                  </span>
                  {idx < selectedOpp.narrowingHierarchy.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200/80">
              {selectedOpp.narrowingExplanation}
            </p>
          </div>

          {/* Why Investigate This? (Prompt Specification) */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Why Investigate This? (Analytical Validation)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Specificity</span>
                <p className="text-slate-600 leading-relaxed">{selectedOpp.whyInvestigate.specificity}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Audience</span>
                <p className="text-slate-600 leading-relaxed">{selectedOpp.whyInvestigate.audience}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Acute Problem</span>
                <p className="text-slate-600 leading-relaxed">{selectedOpp.whyInvestigate.problem}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Competitor Situation</span>
                <p className="text-slate-600 leading-relaxed">{selectedOpp.whyInvestigate.competitorSituation}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs md:col-span-2">
                <span className="font-bold text-slate-900 block mb-1">Keyword Opportunities</span>
                <p className="text-slate-600 leading-relaxed">{selectedOpp.whyInvestigate.keywordOpportunities}</p>
              </div>
            </div>
          </div>

          {/* Suggested Book Concepts */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Suggested Book Concepts & Angles (3-5)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedOpp.suggestedBookAngles.map((angle, idx) => (
                <div key={idx} className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">&ldquo;{angle}&rdquo;</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Target Keywords */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
              Target Long-Tail Keywords ({selectedOpp.relatedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedOpp.relatedKeywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectKeyword(kw)}
                  className="px-3 py-1 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 rounded-md text-xs font-medium border border-slate-200/80 transition-colors flex items-center gap-1.5"
                >
                  <span>{kw}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
