import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, BarChart2 } from 'lucide-react';
import { OpportunityScorecard } from '../types.ts';

interface ResearchScorecardProps {
  scorecard: OpportunityScorecard;
  title?: string;
}

export const ResearchScorecard: React.FC<ResearchScorecardProps> = ({
  scorecard,
  title = 'Opportunity Scorecard & Validation Metrics'
}) => {
  const getBadgeStyle = (val: string, type: 'positive' | 'neutral' | 'caution') => {
    if (val === 'High' || val === 'Emerging' || val === 'Strong') {
      return type === 'caution' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (val === 'Low') {
      return type === 'caution' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200';
    }
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  const metrics = [
    { label: 'Keyword Relevance', value: scorecard.keywordRelevance, type: 'positive' as const, note: 'Direct match with buyer search intent' },
    { label: 'Competition Signal', value: scorecard.competitionSignal, type: 'caution' as const, note: 'Lower competition is easier to rank organically' },
    { label: 'Niche Specificity', value: scorecard.nicheSpecificity, type: 'positive' as const, note: 'Tightly defined audience and acute problem' },
    { label: 'Market Maturity', value: scorecard.marketMaturity, type: 'neutral' as const, note: 'Emerging niches have higher growth headroom' },
    { label: 'Data Confidence', value: scorecard.dataConfidence, type: 'positive' as const, note: 'Based on verified Amazon suggestions & signals' },
    { label: 'Differentiation Potential', value: scorecard.differentiationPotential, type: 'positive' as const, note: 'Feasibility to stand out with design/angle' },
  ];

  return (
    <div id="research-scorecard-widget" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-amber-600" />
          <span>{title}</span>
        </h4>
        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
          Analytical Indicators
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">{m.label}</span>
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getBadgeStyle(m.value, m.type)}`}>
                {m.value}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{m.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Scorecard Disclaimer */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/80">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Research indicators are analytical signals, not sales predictions or revenue guarantees.</span>
      </div>
    </div>
  );
};
