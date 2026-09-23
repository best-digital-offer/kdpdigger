import React from 'react';
import { BookOpenCheck, X, ShieldAlert, ArrowRight, DollarSign, Layers } from 'lucide-react';
import { CompetitorBook } from '../types.ts';

interface CompetitorComparisonViewProps {
  competitors: CompetitorBook[];
  onRemoveCompetitor: (bookId: string) => void;
  onClearAll: () => void;
}

export const CompetitorComparisonView: React.FC<CompetitorComparisonViewProps> = ({
  competitors,
  onRemoveCompetitor,
  onClearAll
}) => {
  if (competitors.length < 2) {
    return (
      <div id="compare-competitors-empty" className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-200">
          <BookOpenCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Compare 2 to 4 Competitor Books Side-by-Side
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Select books from Competitor Research by clicking &ldquo;Compare Book&rdquo; to benchmark pricing, subtitle strategies, and positioning angles side-by-side.
        </p>
        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 border border-slate-200/80 max-w-md mx-auto">
          Currently selected: <strong>{competitors.length}</strong> book. Add at least one more to compare.
        </div>
      </div>
    );
  }

  return (
    <div id="competitor-comparison-page" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <BookOpenCheck className="w-4 h-4" />
            <span>Feature 11 &middot; Competitor Comparison Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Competitor Comparison ({competitors.length} Books)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Benchmarking format, pricing strategy, page length, and keyword positioning.
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors"
        >
          Clear Comparison
        </button>
      </div>

      {/* Review Exclusion Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Positioning-First Standard:</strong> Reviews, ratings, and star counts are excluded because this app focuses on competitor positioning, structure, and format rather than backward-looking social proof.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-44 font-bold text-slate-500 uppercase tracking-wider text-[11px] shrink-0">
                Book Attribute
              </th>
              {competitors.map((book) => (
                <th key={book.id} className="p-4 font-bold text-slate-900 min-w-[280px] max-w-[340px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-extrabold block">{book.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">ASIN: {book.asin}</span>
                    </div>
                    <button
                      onClick={() => onRemoveCompetitor(book.id)}
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
            {/* Subtitle */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Subtitle</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 text-slate-700 italic">
                  {book.subtitle || 'None'}
                </td>
              ))}
            </tr>

            {/* Author & Format */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Author & Format</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 space-y-1">
                  <div className="font-semibold text-slate-800">{book.author}</div>
                  <div className="text-slate-500">{book.format} ({book.availableFormats.join(', ')})</div>
                </td>
              ))}
            </tr>

            {/* Price & Pages */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Pricing & Pages</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded text-xs border border-emerald-200">
                    {book.price || 'N/A'}
                  </span>
                  <div className="text-slate-600 text-[11px] font-medium">
                    {book.pages ? `${book.pages} pages` : 'Page count not stated'}
                  </div>
                </td>
              ))}
            </tr>

            {/* BSR Velocity */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">BSR Rank Indicator</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 text-slate-700 font-medium">
                  {book.bsr || 'Available in rank reports'}
                </td>
              ))}
            </tr>

            {/* Target Audience */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Target Audience</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 text-slate-800 leading-relaxed">
                  {book.positioningAnalysis.targetAudience}
                </td>
              ))}
            </tr>

            {/* Format Type */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Format Strategy</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 text-slate-700 leading-relaxed">
                  {book.positioningAnalysis.formatType}
                </td>
              ))}
            </tr>

            {/* Subtitle Strategy */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Subtitle Positioning</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 text-slate-700 leading-relaxed">
                  {book.positioningAnalysis.subtitleStrategy}
                </td>
              ))}
            </tr>

            {/* Market Angle */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Market Angle</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4 text-slate-700 leading-relaxed">
                  {book.positioningAnalysis.marketAngle}
                </td>
              ))}
            </tr>

            {/* Detected Keyword Themes */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/60">Detected Keywords</td>
              {competitors.map((book) => (
                <td key={book.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {book.positioningAnalysis.detectedKeywordThemes.map((kw, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
