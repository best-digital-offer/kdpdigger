import React from 'react';
import { HelpCircle, AlertCircle, ShieldCheck, CheckCircle2, XCircle, Sparkles, BookOpen, Layers, Target } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div id="help-guidelines-page" className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Research Principles & Help Center</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          How to Research Viable KDP Opportunities
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Understanding our analytical indicators, topic narrowing philosophy, and data standards.
        </p>
      </div>

      {/* The Core Problem & Our Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-3">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>The Traditional KDP Failure Loop</span>
          </div>
          <ul className="space-y-2 text-xs text-rose-900 leading-relaxed">
            <li>&bull; Entering broad keywords like &ldquo;prayer book&rdquo; or &ldquo;coloring book&rdquo;.</li>
            <li>&bull; Relying on tools that fabricate exact monthly search volume numbers.</li>
            <li>&bull; Spending 6 weeks designing a 300-page book only to get buried on page 28.</li>
            <li>&bull; Getting trapped in expensive $99/month subscription software.</li>
          </ul>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>The KDP Digger Way</span>
          </div>
          <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed">
            <li>&bull; Actively narrows broad concepts into specific, uncrowded publishing angles.</li>
            <li>&bull; Focuses on positioning, format strategy, and subtitle architectures.</li>
            <li>&bull; Uses verifiable Amazon bookstore query patterns and qualitative signals.</li>
            <li>&bull; Accessible $1 - $3 fair-use micro-plans with 0 recurring traps.</li>
          </ul>
        </div>
      </div>

      {/* Strict Data Quality Principles (Prompt Requirement) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>Our Strict Data Quality Standard</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-0.5">1. No Fabricated Exact Search Volumes</strong>
            <p>
              Amazon never publishes exact monthly search counts. Tools that display &ldquo;28,450 searches/mo&rdquo; are guessing or extrapolating from Google search trends, which do not reflect Amazon buyer behavior. We provide qualitative indicators (Strong / Moderate / Emerging) backed by real Amazon autocomplete depth.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-0.5">2. Positioning-First (Excluding Reviews)</strong>
            <p>
              We deliberately exclude reviews and star ratings. Why? Because an indie author cannot copy another book&rsquo;s 2,000 reviews. Instead, our research analyzes <em>trim size, page count, price point, subtitle keyword strategy, and audience pain points</em>—things you can actively out-position on Day 1.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-900 block mb-0.5">3. Multi-Dimensional Scorecards</strong>
            <p>
              Success on KDP is not a single score. Our scorecards evaluate six distinct vectors: Keyword Relevance, Competition Signal, Niche Specificity, Market Maturity, Data Confidence, and Differentiation Potential.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs">
          <details className="group p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
            <summary className="font-bold text-slate-900 list-none flex items-center justify-between">
              <span>Does this application generate or write the book for me?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
            </summary>
            <p className="mt-2 text-slate-600 leading-relaxed">
              No. KDP Digger is exclusively a market validation and opportunity research tool. It helps you decide what book to create, how to position it, and which keywords to target. You remain the creator of your own book.
            </p>
          </details>

          <details className="group p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
            <summary className="font-bold text-slate-900 list-none flex items-center justify-between">
              <span>Do your research indicators guarantee that my book will make sales?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
            </summary>
            <p className="mt-2 text-slate-600 leading-relaxed">
              No tool can guarantee book sales. Sales depend on cover design quality, interior typesetting, pricing, blurb copy, and Amazon advertising execution. Our indicators highlight uncrowded market opportunities to maximize your odds of discovery.
            </p>
          </details>

          <details className="group p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
            <summary className="font-bold text-slate-900 list-none flex items-center justify-between">
              <span>How do research credits work?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
            </summary>
            <p className="mt-2 text-slate-600 leading-relaxed">
              1 credit unlocks 1 complete research cycle: querying live Amazon suggestions, extracting long-tail keyword clusters, identifying sub-niches, analyzing competitor positioning, discovering market gaps, and producing a 14-section AI Opportunity Report.
            </p>
          </details>

          <details className="group p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
            <summary className="font-bold text-slate-900 list-none flex items-center justify-between">
              <span>Can I export my research to Excel or Google Docs?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
            </summary>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Yes! Every opportunity report can be printed/saved as a PDF, copied as formatted Markdown for Notion/Google Docs, or exported as a clean CSV table for spreadsheet analysis.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};
