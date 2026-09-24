import React, { useMemo, useState } from 'react';
import { Compass, Search, TrendingUp, Layers, ArrowRight } from 'lucide-react';
import { NicheItem } from '../types.ts';

interface CategoryExplorerViewProps {
  niches: NicheItem[];
  topic: string;
  onExploreCategory: (query: string) => void;
}

export const CategoryExplorerView: React.FC<CategoryExplorerViewProps> = ({ niches, topic, onExploreCategory }) => {
  const [filter, setFilter] = useState('');
  const categories = useMemo(() => {
    const map = new Map<string, { count: number; niches: string[]; demand: string[]; maturity: string[] }>();
    niches.forEach(n => {
      const key = n.broadCategory?.trim() || 'Other';
      const current = map.get(key) || { count: 0, niches: [], demand: [], maturity: [] };
      current.count += 1;
      if (!current.niches.includes(n.nicheName)) current.niches.push(n.nicheName);
      current.demand.push(n.demandSignal);
      current.maturity.push(n.marketMaturity);
      map.set(key, current);
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
  }, [niches]);

  const visible = categories.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div id="category-explorer-page" className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <Compass className="w-4 h-4" /><span>Amazon Category Intelligence</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Category Explorer{topic ? ` for “${topic}”` : ''}</h2>
        <p className="text-xs text-slate-500 mt-1">Explore the category groups identified by your current market research and drill into promising sub-niches.</p>
        <div className="mt-4 relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter categories..." className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-400" />
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">Run research first to populate category intelligence.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visible.map(category => (
            <div key={category.name} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-amber-300 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div><span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Research Category</span><h3 className="text-lg font-bold text-slate-900 mt-1">{category.name}</h3></div>
                <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">{category.count} sub-niches</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-3 bg-slate-50 rounded-lg"><span className="text-[10px] text-slate-400 uppercase font-semibold block">Demand Signals</span><span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-1"><TrendingUp className="w-3.5 h-3.5 text-blue-600" />{[...new Set(category.demand)].join(', ') || '—'}</span></div>
                <div className="p-3 bg-slate-50 rounded-lg"><span className="text-[10px] text-slate-400 uppercase font-semibold block">Market Maturity</span><span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-1"><Layers className="w-3.5 h-3.5 text-amber-600" />{[...new Set(category.maturity)].join(', ') || '—'}</span></div>
              </div>
              <div className="mt-4"><span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Sub-niches</span><div className="flex flex-wrap gap-1.5 mt-2">{category.niches.map(n => <button key={n} onClick={() => onExploreCategory(n)} className="px-2 py-1 bg-slate-100 hover:bg-amber-100 rounded-md text-xs text-slate-700 hover:text-amber-900">{n}</button>)}</div></div>
              <button onClick={() => onExploreCategory(category.name)} className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"><span>Research This Category</span><ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-slate-400">Category insights are derived from the current research dataset; they are not a direct replacement for Amazon's live category browser.</p>
    </div>
  );
};
