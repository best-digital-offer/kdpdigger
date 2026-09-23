import React, { useState } from 'react';
import { Users2, Link as LinkIcon, Search, AlertCircle, ShieldAlert, Sparkles, BookOpen, Layers, Check, ExternalLink, GitCompare } from 'lucide-react';
import { CompetitorBook, MarketGap } from '../types.ts';

interface CompetitorResearchViewProps {
  competitors: CompetitorBook[];
  marketGaps: MarketGap[];
  topic: string;
  onCompareCompetitor: (book: CompetitorBook) => void;
  isBookInComparison: (bookId: string) => boolean;
  onAnalyzeCustomUrl: (urlOrAsin: string) => Promise<void>;
  isAnalyzingUrl: boolean;
}

export const CompetitorResearchView: React.FC<CompetitorResearchViewProps> = ({
  competitors,
  marketGaps,
  topic,
  onCompareCompetitor,
  isBookInComparison,
  onAnalyzeCustomUrl,
  isAnalyzingUrl
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUrlError('');
    try {
      await onAnalyzeCustomUrl(urlInput.trim());
      setUrlInput('');
    } catch (err: any) {
      setUrlError(err.message || 'Unable to analyze URL. Please check ASIN or format.');
    }
  };

  return (
    <div id="competitor-research-page" className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <Users2 className="w-4 h-4" />
            <span>Competitor Intelligence & Positioning</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Competitor Analysis for &ldquo;{topic}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deconstruct title architecture, trim sizes, subtitle strategies, and positioning gaps.
          </p>
        </div>
      </div>

      {/* Feature 12: Amazon URL / ASIN Quick Analyzer */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <LinkIcon className="w-4 h-4" />
            <span>Feature 12 &middot; Amazon URL & ASIN Analyzer</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            Inspect Any Existing Competitor on Amazon
          </h3>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Paste any Amazon book listing URL or 10-digit ASIN/ISBN (e.g. <code className="bg-slate-700 text-amber-300 px-1 py-0.5 rounded">https://amazon.com/dp/B08XYZ101A</code>).
            We parse metadata and generate a strategic positioning assessment.
          </p>

          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="url-analyzer-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste Amazon book URL or ASIN (e.g., B09ABC202B)..."
                className="w-full pl-10 pr-3 py-2 bg-slate-950/80 border border-slate-700 focus:border-amber-400 rounded-lg text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none"
                disabled={isAnalyzingUrl}
              />
            </div>
            <button
              id="url-analyzer-submit-btn"
              type="submit"
              disabled={isAnalyzingUrl || !urlInput.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              {isAnalyzingUrl ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Competitor</span>
                </>
              )}
            </button>
          </form>
          {urlError && (
            <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{urlError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Review Exclusion Note (Strict Prompt Requirement) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Positioning-First Standard:</strong> Reviews, star ratings, and review counts are intentionally excluded.
          This tool analyzes competitive <em>structure, format, page length, pricing, and keyword positioning</em> rather than backward-looking social proof.
        </p>
      </div>

      {/* Competitor Snapshot Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600" />
          Competitor Positioning Snapshots ({competitors.length})
        </h3>

        <div className="grid grid-cols-1 gap-5">
          {competitors.map((book) => {
            const inCompare = isBookInComparison(book.id);
            return (
              <div
                key={book.id}
                id={`competitor-card-${book.id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-amber-300 transition-all space-y-4"
              >
                {/* Title & Metadata Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        ASIN: {book.asin}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                        {book.format}
                      </span>
                      {book.price && (
                        <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                          {book.price}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {book.title}
                    </h4>
                    {book.subtitle && (
                      <p className="text-xs text-slate-600 italic mt-0.5">
                        {book.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      By <strong className="text-slate-700">{book.author}</strong> &bull; {book.pages ? `${book.pages} pages` : 'Page count varies'} &bull; Published {book.publicationDate}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      id={`compare-comp-btn-${book.id}`}
                      onClick={() => onCompareCompetitor(book)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        inCompare
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {inCompare ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-amber-700" />
                          <span>Added to Compare</span>
                        </>
                      ) : (
                        <>
                          <GitCompare className="w-3.5 h-3.5 text-slate-500" />
                          <span>Compare Book</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* BSR & Category Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">BSR Velocity</span>
                    <span className="font-semibold text-slate-800">{book.bsr || 'Available in category ranks'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Categories</span>
                    <span className="text-slate-700 truncate block" title={book.categories.join(' | ')}>
                      {book.categories.join(' | ')}
                    </span>
                  </div>
                </div>

                {/* In-Depth Positioning Analysis */}
                <div className="pt-2 border-t border-slate-100">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Positioning Architecture
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <strong className="text-slate-700 block mb-0.5">Target Audience</strong>
                      <p className="text-slate-600 leading-relaxed">{book.positioningAnalysis.targetAudience}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <strong className="text-slate-700 block mb-0.5">Format & Architecture</strong>
                      <p className="text-slate-600 leading-relaxed">{book.positioningAnalysis.formatType}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <strong className="text-slate-700 block mb-0.5">Subtitle Strategy</strong>
                      <p className="text-slate-600 leading-relaxed">{book.positioningAnalysis.subtitleStrategy}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <strong className="text-slate-700 block mb-0.5">Market Angle</strong>
                      <p className="text-slate-600 leading-relaxed">{book.positioningAnalysis.marketAngle}</p>
                    </div>
                  </div>

                  {/* Detected Keyword Themes */}
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Detected Keyword Themes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {book.positioningAnalysis.detectedKeywordThemes.map((kw, kwIdx) => (
                        <span
                          key={kwIdx}
                          className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 4: Competitor Gap Analysis */}
      {marketGaps && marketGaps.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <Layers className="w-4 h-4" />
              <span>Feature 4 &middot; Competitor Gap Analysis</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Unmet Market Gaps & Underserved Angles
            </h3>
            <p className="text-xs text-slate-500">
              Where existing competitors fall short and where new books can cleanly differentiate.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900">
            <strong>Opportunity Hypotheses:</strong> These are AI-generated opportunity hypotheses based on the analyzed market. Validate them before publishing.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {marketGaps.map((gap) => (
              <div key={gap.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                    What Competitors Do:
                  </div>
                  <p className="text-xs text-slate-700 font-medium mb-3">
                    {gap.commonTheme}
                  </p>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                    Underserved Opportunity:
                  </div>
                  <p className="text-xs text-slate-900 font-semibold mb-3">
                    {gap.underservedAngle}
                  </p>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs mb-3 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target Audience:</span>
                    <p className="text-slate-700">{gap.targetAudience}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Example Book Concept:</span>
                  <p className="text-xs font-bold text-slate-900 italic mt-0.5">&ldquo;{gap.exampleConcept}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
