import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Download,
  Check,
  Sparkles,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { FullOpportunityReport } from '../types.ts';
import { ResearchScorecard } from './ResearchScorecard.tsx';

interface OpportunityReportViewProps {
  report: FullOpportunityReport;
  onSelectKeyword: (kw: string) => void;
}

export const OpportunityReportView: React.FC<OpportunityReportViewProps> = ({
  report,
  onSelectKeyword
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const { sections, opportunities } = report;
  const primaryScorecard = opportunities[0]?.scorecard || {
    keywordRelevance: 'High',
    competitionSignal: 'Moderate',
    nicheSpecificity: 'High',
    marketMaturity: 'Emerging',
    dataConfidence: 'High',
    differentiationPotential: 'High'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# KDP Opportunity Research Report: ${sections.researchTopic}
Generated: ${new Date(report.createdAt).toLocaleDateString()}

## 1. Research Topic
${sections.researchTopic}

## 2. Market Overview
${sections.marketOverview}

## 3. Keyword Opportunities Summary
${sections.keywordOpportunitiesSummary}

## 4. Niche Opportunities Summary
${sections.nicheOpportunitiesSummary}

## 5. Competitor Landscape
${sections.competitorLandscape}

## 6. Pricing Landscape
${sections.pricingLandscape}

## 7. BSR Signals
${sections.bsrSignals}

## 8. Market Gaps Summary
${sections.marketGapsSummary}

## 9. Potential Audience Segments
${sections.potentialAudienceSegments.map(s => `- ${s}`).join('\n')}

## 10. Suggested Angles
${sections.suggestedAngles.map(a => `- ${a}`).join('\n')}

## 11. Competition Assessment
${sections.competitionAssessment}

## 12. Research Risks
${sections.researchRisks.map(r => `- ${r}`).join('\n')}

## 13. What to Validate Next
${sections.whatToValidateNext.map(v => `- ${v}`).join('\n')}

## 14. Final Research Summary
${sections.finalResearchSummary}

---
KDP Digger — Dig Deeper. Find Better KDP Opportunities. Research indicators are informational and do not guarantee sales or profitability.
`;
    navigator.clipboard.writeText(md);
    setCopiedFormat('markdown');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ['Category', 'Item', 'Relevance', 'Competition', 'Intent/Details'],
      ...report.keywords.highRelevance.map(k => ['High Relevance Keyword', k.keyword, k.relevance, k.competitionSignal, k.commercialIntent]),
      ...report.keywords.longTail.map(k => ['Long-Tail Keyword', k.keyword, k.relevance, k.competitionSignal, k.commercialIntent]),
      ...report.keywords.audienceSpecific.map(k => ['Audience Keyword', k.keyword, k.relevance, k.competitionSignal, k.commercialIntent]),
      ...report.niches.map(n => ['Sub-Niche', n.nicheName, n.demandSignal, n.competitionSignal, n.priceRange])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kdp-research-${sections.researchTopic.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedFormat('csv');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div id="opportunity-report-document" className="space-y-6 max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
      {/* Top Header & Export Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <FileText className="w-4 h-4" />
            <span>Feature 6 & 14 &middot; Full AI Opportunity Report</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Research Report: &ldquo;{sections.researchTopic}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive 14-section validation synthesis with exportable indicators.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="report-print-btn"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            id="report-copy-md-btn"
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedFormat === 'markdown' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            id="report-download-csv-btn"
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copiedFormat === 'csv' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Branding Header */}
        <div className="border-b border-slate-200 pb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                KDP Digger
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-amber-700 font-semibold">Dig Deeper. Find Better KDP Opportunities.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Market Opportunity Report
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Topic: <strong className="text-slate-900 font-semibold">{sections.researchTopic}</strong> &bull; Generated on {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <div>Confidential Research</div>
            <div>For KDP Self-Publishing</div>
          </div>
        </div>

        {/* Feature 7 Scorecard Included */}
        <ResearchScorecard scorecard={primaryScorecard} title={`Scorecard for "${sections.researchTopic}"`} />

        {/* Section 1 & 2: Research Topic & Market Overview */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              Section 1 & 2 &middot; Research Topic & Market Overview
            </h3>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{sections.researchTopic}</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {sections.marketOverview}
            </p>
          </div>
        </div>

        {/* Section 3 & 4: Keyword & Niche Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section 3 &middot; Keyword Opportunities Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {sections.keywordOpportunitiesSummary}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Section 4 &middot; Niche Opportunities Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {sections.nicheOpportunitiesSummary}
            </p>
          </div>
        </div>

        {/* Section 5, 6 & 7: Competitor Landscape, Pricing & BSR */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Section 5, 6 & 7 &middot; Competitor, Pricing & Sales Velocity Dynamics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Competitor Landscape</span>
              <p className="text-slate-600 leading-relaxed">{sections.competitorLandscape}</p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Pricing Landscape</span>
              <p className="text-slate-600 leading-relaxed">{sections.pricingLandscape}</p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">BSR Signals</span>
              <p className="text-slate-600 leading-relaxed">{sections.bsrSignals}</p>
            </div>
          </div>
        </div>

        {/* Section 8: Market Gaps Summary */}
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
            Section 8 &middot; Market Gaps Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            {sections.marketGapsSummary}
          </p>
        </div>

        {/* Section 9 & 10: Audience Segments & Suggested Angles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Section 9 &middot; Potential Audience Segments
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {sections.potentialAudienceSegments.map((segment, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span className="leading-snug">{segment}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Section 10 &middot; Suggested Angles
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {sections.suggestedAngles.map((angle, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span className="leading-snug font-medium text-slate-900">&ldquo;{angle}&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 11 & 12: Competition Assessment & Research Risks */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Section 11 & 12 &middot; Competition Assessment & Publishing Risks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1.5">Competition Assessment</span>
              <p className="text-slate-600 leading-relaxed">{sections.competitionAssessment}</p>
            </div>

            <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200">
              <span className="font-bold text-rose-900 block mb-1.5">Research Risks to Mitigate</span>
              <ul className="space-y-1.5 text-rose-800">
                {sections.researchRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span className="leading-snug">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 13: What to Validate Next */}
        <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2.5">
            Section 13 &middot; What to Validate Next (Actionable Checklist)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {sections.whatToValidateNext.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-blue-100 flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-800 font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 14: Final Research Summary */}
        <div className="p-6 bg-slate-900 text-white rounded-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            Section 14 &middot; Final Analytical Synthesis
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {sections.finalResearchSummary}
          </p>
        </div>

        {/* Mandatory Watermark / Footer Disclaimer (Prompt Requirement) */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">
            KDP Digger &mdash; Dig Deeper. Find Better KDP Opportunities.
          </p>
          <p className="text-[11px] text-slate-400">
            Research indicators are informational and do not guarantee sales or profitability. Always inspect live Amazon search results, copyright registries, and print cost calculators before publishing.
          </p>
        </div>
      </div>
    </div>
  );
};
