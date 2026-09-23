import React from 'react';
import { History, Search, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { ResearchHistoryItem } from '../types.ts';

interface HistoryViewProps {
  history: ResearchHistoryItem[];
  onReRunSearch: (topic: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onReRunSearch
}) => {
  return (
    <div id="history-page" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <History className="w-4 h-4" />
            <span>Feature 13 &middot; Query Audit Log</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Research History ({history.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Past topics and searches. Click to instantly re-analyze market conditions.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-md mx-auto my-8">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Past Searches</h3>
          <p className="text-xs text-slate-500">
            Searches you run will appear here automatically for easy 1-click re-runs.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {history.map((item) => (
              <li
                key={item.id}
                className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.query || item.topic || 'Research Topic'}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.timestamp || item.createdAt || Date.now()).toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onReRunSearch(item.query || item.topic || '')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Run</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
