import React, { useState } from 'react';
import { KeyRound, Copy, Check, Filter, Layers, Info, Sparkles } from 'lucide-react';
import { KeywordItem, KeywordCluster } from '../types.ts';
import { CompetitionBadge, DemandBadge, RelevanceBadge, CommercialIntentBadge } from './Badges.tsx';

interface KeywordResearchViewProps {
  primaryKeyword: string;
  keywords: {
    highRelevance: KeywordItem[];
    longTail: KeywordItem[];
    audienceSpecific: KeywordItem[];
    clusters: KeywordCluster[];
  };
  onSelectKeyword: (kw: string) => void;
}

export const KeywordResearchView: React.FC<KeywordResearchViewProps> = ({
  primaryKeyword,
  keywords,
  onSelectKeyword
}) => {
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'longtail' | 'audience' | 'clusters'>('all');

  const copyToClipboard = (text: string, groupName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGroup(groupName);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const normalizedFilter = filterQuery.trim().toLowerCase();

  const filterKeywords = (list: KeywordItem[]) => {
    if (!normalizedFilter) return list;
    return list.filter(item => String(item.keyword || '').trim().toLowerCase().includes(normalizedFilter));
  };

  const highFiltered = filterKeywords(keywords.highRelevance);
  const longTailFiltered = filterKeywords(keywords.longTail);
  const audienceFiltered = filterKeywords(keywords.audienceSpecific);

  // Keep the global filter consistent across the entire keyword view,
  // including thematic clusters.
  const filteredClusters = !normalizedFilter
    ? keywords.clusters
    : keywords.clusters
        .map(cluster => ({
          ...cluster,
          keywords: (cluster.keywords || []).filter(kw =>
            String(kw || '').trim().toLowerCase().includes(normalizedFilter)
          )
        }))
        .filter(cluster => cluster.keywords.length > 0);

  const filteredKeywordCount =
    highFiltered.length + longTailFiltered.length + audienceFiltered.length +
    filteredClusters.reduce((total, cluster) => total + cluster.keywords.length, 0);

  const tabCounts = {
    high: highFiltered.length,
    longtail: longTailFiltered.length,
    audience: audienceFiltered.length,
    clusters: filteredClusters.reduce((total, cluster) => total + cluster.keywords.length, 0)
  };

  const renderKeywordRow = (item: KeywordItem) => (
    <div
      key={item.id}
      className="p-3 bg-white rounded-lg border border-slate-200/90 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm">{item.keyword}</span>
          <button
            onClick={() => onSelectKeyword(item.keyword)}
            title="Research this keyword"
            className="text-xs text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-50 rounded"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <RelevanceBadge relevance={item.relevance} />
        <CompetitionBadge signal={item.competitionSignal} />
        <DemandBadge signal={item.demandSignal} />
        <CommercialIntentBadge intent={item.commercialIntent} />
      </div>
    </div>
  );

  return (
    <div id="keyword-research-page" className="space-y-6">
      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <KeyRound className="w-4 h-4" />
            <span>Keyword Research Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Keywords for &ldquo;{primaryKeyword}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized by qualitative demand indicators, search intent, and long-tail depth.
          </p>
        </div>

        {/* Copy 7 KDP slots button */}
        <div className="flex items-center gap-2">
          <button
            id="copy-7-slots-btn"
            onClick={() => {
              const allKw = [
                ...keywords.longTail.slice(0, 4).map(k => k.keyword),
                ...keywords.audienceSpecific.slice(0, 3).map(k => k.keyword)
              ].join(', ');
              copyToClipboard(allKw, '7slots');
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            {copiedGroup === '7slots' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied 7 Keywords!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Top 7 for KDP Backend</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strict Data Quality Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Data Quality Standard:</strong> We do not fabricate fake exact search volume figures.
          Amazon does not publish exact monthly query volume. Indicators below reflect qualitative shopper signals,
          Amazon bookstore autocomplete patterns, and commercial buyer intent.
        </p>
      </div>

      {/* Navigation & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Keywords' },
            { id: 'high', label: `High Relevance (${normalizedFilter ? tabCounts.high : keywords.highRelevance.length})` },
            { id: 'longtail', label: `Long-Tail (${normalizedFilter ? tabCounts.longtail : keywords.longTail.length})` },
            { id: 'audience', label: `Audience-Specific (${normalizedFilter ? tabCounts.audience : keywords.audienceSpecific.length})` },
            { id: 'clusters', label: `Thematic Clusters (${normalizedFilter ? tabCounts.clusters : keywords.clusters.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="keyword-filter-input"
            type="search"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter keywords..."
            aria-label="Filter all keywords"
            autoComplete="off"
            className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-amber-500"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs font-bold"
              aria-label="Clear keyword filter"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {normalizedFilter && filteredKeywordCount === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <Filter className="w-7 h-7 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No matching keywords</p>
          <p className="text-xs text-slate-500 mt-1">
            Try another word or clear the filter to see all keywords.
          </p>
        </div>
      )}

      {/* Thematic Keyword Clusters View */}
      {(activeTab === 'all' || activeTab === 'clusters') && filteredClusters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              AI-Synthesized Keyword Clusters
            </h3>
            <span className="text-xs text-slate-500">Grouped into publishing themes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClusters.map((cluster, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">{cluster.theme}</h4>
                  <button
                    onClick={() => copyToClipboard(cluster.keywords.join(', '), cluster.theme)}
                    className="text-xs text-slate-500 hover:text-slate-900 p-1 rounded hover:bg-slate-100"
                    title="Copy cluster keywords"
                  >
                    {copiedGroup === cluster.theme ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-3">{cluster.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.keywords.map((kw, kidx) => (
                    <button
                      key={kidx}
                      onClick={() => onSelectKeyword(kw)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-amber-50 hover:text-amber-900 text-slate-700 rounded-md text-xs border border-slate-200/80 font-medium transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-Relevance Keywords */}
      {(activeTab === 'all' || activeTab === 'high') && highFiltered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              High-Relevance Keywords ({highFiltered.length})
            </h3>
            <button
              onClick={() => copyToClipboard(highFiltered.map(k => k.keyword).join('\n'), 'high')}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              {copiedGroup === 'high' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy list</span>
            </button>
          </div>
          <div className="space-y-2">
            {highFiltered.map(renderKeywordRow)}
          </div>
        </div>
      )}

      {/* Long-Tail Keywords */}
      {(activeTab === 'all' || activeTab === 'longtail') && longTailFiltered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Long-Tail Keywords ({longTailFiltered.length})
            </h3>
            <button
              onClick={() => copyToClipboard(longTailFiltered.map(k => k.keyword).join('\n'), 'longtail')}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              {copiedGroup === 'longtail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy list</span>
            </button>
          </div>
          <div className="space-y-2">
            {longTailFiltered.map(renderKeywordRow)}
          </div>
        </div>
      )}

      {/* Audience-Specific Keywords */}
      {(activeTab === 'all' || activeTab === 'audience') && audienceFiltered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Audience-Specific Keywords ({audienceFiltered.length})
            </h3>
            <button
              onClick={() => copyToClipboard(audienceFiltered.map(k => k.keyword).join('\n'), 'audience')}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              {copiedGroup === 'audience' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy list</span>
            </button>
          </div>
          <div className="space-y-2">
            {audienceFiltered.map(renderKeywordRow)}
          </div>
        </div>
      )}
    </div>
  );
};
