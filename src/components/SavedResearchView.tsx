import React, { useState } from 'react';
import { BookmarkCheck, Trash2, Star, ArrowRight, Search, FileText, Calendar, Filter } from 'lucide-react';
import { SavedResearchItem } from '../types.ts';

interface SavedResearchViewProps {
  savedItems: SavedResearchItem[];
  onOpenItem: (item: SavedResearchItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const SavedResearchView: React.FC<SavedResearchViewProps> = ({
  savedItems,
  onOpenItem,
  onDeleteItem,
  onToggleFavorite
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  const filtered = savedItems.filter(item => {
    if (filterFavorites && !item.favorite) return false;
    if (filterQuery && !item.topic.toLowerCase().includes(filterQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div id="saved-research-page" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Feature 9 &middot; Private Library</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved Research Library ({savedItems.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your saved keywords, sub-niches, and validated opportunities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              filterFavorites
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
            <span>Favorites</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search library..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-amber-500 w-44"
            />
          </div>
        </div>
      </div>

      {/* List / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-md mx-auto my-8">
          <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Saved Research Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            {savedItems.length === 0
              ? 'When researching, click "Save Opportunity" or save reports to access them here anytime.'
              : 'No items match your active search filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {item.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-1 text-slate-400 hover:text-amber-500 rounded"
                      title="Toggle favorite"
                    >
                      <Star className={`w-4 h-4 ${item.favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                  {item.topic}
                </h3>

                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Saved on {new Date(item.savedAt || item.createdAt || Date.now()).toLocaleDateString()}</span>
                </p>

                {item.notes && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 mb-3">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => onOpenItem(item)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Research</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
