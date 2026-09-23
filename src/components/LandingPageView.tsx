import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  DollarSign,
  Compass,
  Layers,
  FileText,
  GitCompare,
  Zap,
  HelpCircle,
  Coins
} from 'lucide-react';
import { DEMO_CHRISTIAN_PRAYER_REPORT } from '../data/sampleData.ts';
import { CompetitionBadge, DemandBadge, MarketMaturityBadge } from './Badges.tsx';
import { ResearchScorecard } from './ResearchScorecard.tsx';

interface LandingPageViewProps {
  onStartResearch: (sampleTopic?: string) => void;
  onOpenPricing: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onStartResearch,
  onOpenPricing
}) => {
  const [demoTopic, setDemoTopic] = useState('Christian prayer');
  const [showDemoPreview, setShowDemoPreview] = useState(true);

  const demoOpp = DEMO_CHRISTIAN_PRAYER_REPORT.opportunities[0];

  return (
    <div id="landing-page-root" className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>KDP Digger &middot; The Micro-SaaS for Independent Authors</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Dig Deeper. Find Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700">KDP Opportunities</span>.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Validate keywords, uncover underserved sub-niches, and deconstruct competitor positioning before you spend weeks writing.
        </p>

        {/* Quick CTA Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border-2 border-slate-300 hover:border-amber-500 shadow-lg transition-all">
            <div className="flex-1 flex items-center pl-3 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={demoTopic}
                onChange={(e) => setDemoTopic(e.target.value)}
                placeholder="Enter broad idea (e.g. Christian prayer, anxiety journal)..."
                className="w-full px-3 py-2.5 text-sm sm:text-base outline-none bg-transparent text-slate-900"
              />
            </div>
            <button
              onClick={() => onStartResearch(demoTopic)}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Research</span>
            </button>
          </div>
        </div>

        {/* Analytical Disclaimer */}
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No fake search volumes. Verifiable qualitative indicators, real Amazon bookstore suggestions, and actionable positioning gaps.
        </p>
      </section>

      {/* Interactive Demo Preview (Preloaded with Christian Prayer) */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Live Product Demo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              See How &ldquo;Christian prayer&rdquo; Narrows Into a Viable Opportunity
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Instead of competing with 50,000 broad prayer books, the engine discovers uncrowded angles with high buyer intent.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <CompetitionBadge signal={demoOpp.competitionSignal} />
                  <DemandBadge signal={demoOpp.demandSignal} />
                  <MarketMaturityBadge maturity={demoOpp.marketMaturity} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {demoOpp.title}
                </h3>
              </div>

              <button
                onClick={() => onStartResearch('Christian prayer')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-colors shadow-xs"
              >
                <span>Open Full Research App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Educational Narrowing Path */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Discovery Hierarchy (How We Narrowed It)
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                {demoOpp.narrowingHierarchy.map((step, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded ${idx === demoOpp.narrowingHierarchy.length - 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white border border-slate-200'}`}>
                      {step}
                    </span>
                    {idx < demoOpp.narrowingHierarchy.length - 1 && <span className="text-slate-400">&rarr;</span>}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                {demoOpp.narrowingExplanation}
              </p>
            </div>

            {/* Scorecard Widget Preview */}
            <ResearchScorecard scorecard={demoOpp.scorecard} title="Analytical Scorecard for This Opportunity" />

            {/* Suggested Angles */}
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Ready-to-Publish Angles:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {demoOpp.suggestedBookAngles.map((angle, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs font-bold text-slate-900">
                    &ldquo;{angle}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            Proven Workflow
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            How KDP Digger Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From broad concept to validated publishing blueprint in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Enter Broad Topic</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Start with any seed keyword or topic you are passionate about. No need for complex query syntax.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Automated Narrowing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The engine queries live Amazon book suggestions and groups them into 4 distinct thematic clusters.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Competitor Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deconstruct trim sizes, price tiers, and subtitle positioning without backward-looking review bias.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Export Blueprint</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a 14-section validation synthesis with PDF, Markdown, and CSV exports ready for your book launch.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
            Pocket-Change Micro-SaaS
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mb-4">
            Just $1 to $3 per Research Sprint
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Traditional publishing research tools charge $67&ndash;$99 each month. We believe independent authors should only pay when they are actually researching a book.
          </p>

          <button
            onClick={onOpenPricing}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            Explore Plans & Top Up Credits
          </button>
        </div>
      </section>
    </div>
  );
};
