import React from 'react';
import { QualitativeSignal, CompetitionSignal, MarketMaturity } from '../types';

export const CompetitionBadge: React.FC<{ signal: CompetitionSignal; id?: string }> = ({ signal, id }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  if (signal === 'Low') color = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  else if (signal === 'Moderate') color = 'bg-amber-50 text-amber-800 border-amber-200';
  else if (signal === 'High') color = 'bg-rose-50 text-rose-800 border-rose-200';

  return (
    <span id={id} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color} whitespace-nowrap`}>
      Competition: {signal}
    </span>
  );
};

export const DemandBadge: React.FC<{ signal: QualitativeSignal; id?: string }> = ({ signal, id }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  if (signal === 'Strong') color = 'bg-blue-50 text-blue-800 border-blue-200';
  else if (signal === 'Moderate') color = 'bg-indigo-50 text-indigo-800 border-indigo-200';
  else if (signal === 'Emerging') color = 'bg-purple-50 text-purple-800 border-purple-200';

  return (
    <span id={id} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color} whitespace-nowrap`}>
      Demand: {signal}
    </span>
  );
};

export const RelevanceBadge: React.FC<{ relevance: 'High' | 'Medium' | 'Low'; id?: string }> = ({ relevance, id }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  if (relevance === 'High') color = 'bg-teal-50 text-teal-800 border-teal-200';
  else if (relevance === 'Medium') color = 'bg-sky-50 text-sky-800 border-sky-200';

  return (
    <span id={id} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color} whitespace-nowrap`}>
      Relevance: {relevance}
    </span>
  );
};

export const CommercialIntentBadge: React.FC<{ intent: 'High' | 'Medium' | 'Informational'; id?: string }> = ({ intent, id }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  if (intent === 'High') color = 'bg-amber-50 text-amber-900 border-amber-200';
  else if (intent === 'Medium') color = 'bg-yellow-50 text-yellow-800 border-yellow-200';

  return (
    <span id={id} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color} whitespace-nowrap`}>
      Intent: {intent}
    </span>
  );
};

export const MarketMaturityBadge: React.FC<{ maturity: MarketMaturity; id?: string }> = ({ maturity, id }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  if (maturity === 'Emerging') color = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  else if (maturity === 'Established') color = 'bg-blue-50 text-blue-800 border-blue-200';
  else if (maturity === 'Crowded' || maturity === 'Highly competitive') color = 'bg-rose-50 text-rose-800 border-rose-200';

  return (
    <span id={id} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color} whitespace-nowrap`}>
      Market: {maturity}
    </span>
  );
};
