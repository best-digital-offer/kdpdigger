/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Coins,
  History,
  FileText,
  Compass,
  KeyRound,
  Users2,
  GitCompare,
  BookOpenCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User, FullOpportunityReport, OpportunityItem, CompetitorBook, SavedResearchItem, ResearchHistoryItem } from './types.ts';
import { DEMO_CHRISTIAN_PRAYER_REPORT } from './data/sampleData.ts';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ResearchHero } from './components/ResearchHero.tsx';
import { ResearchProgress } from './components/ResearchProgress.tsx';
import { KeywordResearchView } from './components/KeywordResearchView.tsx';
import { NicheResearchView } from './components/NicheResearchView.tsx';
import { CompetitorResearchView } from './components/CompetitorResearchView.tsx';
import { OpportunityFinderView } from './components/OpportunityFinderView.tsx';
import { CompareOpportunitiesView } from './components/CompareOpportunitiesView.tsx';
import { CompetitorComparisonView } from './components/CompetitorComparisonView.tsx';
import { OpportunityReportView } from './components/OpportunityReportView.tsx';
import { SavedResearchView } from './components/SavedResearchView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { PricingModal } from './components/PricingModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { supabase, apiFetch } from './lib/supabase.ts';
import { AdminPanelView } from './components/AdminPanelView.tsx';
import { HelpView } from './components/HelpView.tsx';
import { LandingPageView } from './components/LandingPageView.tsx';
import { CompetitionBadge, DemandBadge, MarketMaturityBadge } from './components/Badges.tsx';

const GUEST_USER: User = {
  id: '',
  email: 'Not signed in',
  name: 'Guest',
  plan: 'Sign in required',
  credits: 0,
  role: 'user',
  createdAt: new Date(0).toISOString()
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(GUEST_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [currentReport, setCurrentReport] = useState<FullOpportunityReport>(DEMO_CHRISTIAN_PRAYER_REPORT);
  const [searchTopic, setSearchTopic] = useState<string>('Christian prayer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [compareOpportunities, setCompareOpportunities] = useState<OpportunityItem[]>([
    DEMO_CHRISTIAN_PRAYER_REPORT.opportunities[0],
    DEMO_CHRISTIAN_PRAYER_REPORT.opportunities[1]
  ]);
  const [compareCompetitors, setCompareCompetitors] = useState<CompetitorBook[]>([
    DEMO_CHRISTIAN_PRAYER_REPORT.competitors[0],
    DEMO_CHRISTIAN_PRAYER_REPORT.competitors[1]
  ]);

  const [savedItems, setSavedItems] = useState<SavedResearchItem[]>([]);
  const [historyItems, setHistoryItems] = useState<ResearchHistoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    let initialized = false;

    const finishSignedOut = () => {
      if (!mounted) return;
      setCurrentUser(GUEST_USER);
      setIsAuthenticated(false);
      setPasswordRecovery(false);
      setAuthLoading(false);
    };

    const loadAuthenticatedUser = async (session: any | null) => {
      if (!mounted || !session?.access_token) {
        if (!initialized) finishSignedOut();
        return;
      }

      try {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < 5; attempt += 1) {
          if (!mounted) return;

          try {
            const res = await fetch('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              cache: 'no-store'
            });
            const data = await res.json();

            if (res.ok && data.user) {
              if (mounted) {
                setCurrentUser(data.user);
                setIsAuthenticated(true);
                setIsAuthModalOpen(false);
                setPasswordRecovery(false);
                setIsLandingPage(false);
                setAuthLoading(false);
                initialized = true;
              }
              return;
            }

            lastError = new Error(data.error || `Unable to load account (HTTP ${res.status})`);
          } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unable to load account');
          }

          await new Promise(resolve => window.setTimeout(resolve, 500 * (attempt + 1)));
        }

        throw lastError || new Error('Unable to load account');
      } catch (error) {
        console.error('Failed to load authenticated KDP Digger user:', error);
        if (mounted) {
          // Keep the auth modal closed while a real Supabase session still exists.
          // The user should never be bounced back to Google sign-in merely because
          // the application profile endpoint is temporarily unavailable.
          setCurrentUser(GUEST_USER);
          setIsAuthenticated(false);
          setAuthLoading(false);
          setIsAuthModalOpen(false);
          initialized = true;
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        initialized = true;
        finishSignedOut();
        return;
      }

      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
        setIsAuthModalOpen(true);
        setAuthLoading(false);
        initialized = true;
        return;
      }

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        window.setTimeout(() => {
          void loadAuthenticatedUser(session);
        }, 0);
      }
    });

    // Read the persisted session after installing the listener. OAuth redirects
    // are therefore handled by either INITIAL_SESSION or this explicit check.
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.access_token) {
        void loadAuthenticatedUser(session);
      } else if (!initialized) {
        finishSignedOut();
      }
    }).catch((error) => {
      console.error('Unable to restore Supabase session:', error);
      finishSignedOut();
    });

    const loadingTimeout = window.setTimeout(() => {
      if (mounted && !initialized) {
        // Do not open the sign-in modal here. If Supabase is still restoring an
        // OAuth session, opening it creates the repeated "sign in again" loop.
        setAuthLoading(false);
        initialized = true;
      }
    }, 12000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.clearTimeout(loadingTimeout);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Only show sign-in after initialization has completed. The auth callback
      // explicitly keeps the modal closed when a valid Supabase session exists
      // but the application profile endpoint is temporarily unavailable.
      setIsAuthModalOpen(true);
    }
  }, [authLoading, isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Core Research Execution
  const handleSearch = async (topic: string) => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) return;

    setSearchTopic(cleanTopic);
    setIsLoading(true);
    setIsLandingPage(false);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 55000);

    try {
      const res = await apiFetch('/api/research/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: cleanTopic }),
        signal: controller.signal
      });

      if (res.status === 402) {
        setIsPricingModalOpen(true);
        showToast('You have used all research credits. Top up for $1-$3 to continue.');
        return;
      }

      const data = await res.json();
      if (res.ok && data.report) {
        setCurrentReport(data.report);
        if (data.creditsRemaining !== undefined) {
          setCurrentUser(prev => ({ ...prev, credits: data.creditsRemaining }));
        }
        setHistoryItems(prev => [
          {
            id: `hist_${Date.now()}`,
            userId: currentUser.id,
            query: cleanTopic,
            timestamp: new Date().toISOString(),
            resultType: 'full_report',
            reportId: data.report.id
          },
          ...prev
        ]);
        showToast(`Research completed for "${cleanTopic}"!`);
      } else {
        throw new Error(data.error || `Research failed (HTTP ${res.status})`);
      }
    } catch (err: any) {
      console.error('Research request failed:', err);
      if (err?.name === 'AbortError') {
        showToast('Research timed out. Please try again; your credit was not charged if generation did not start.');
      } else {
        showToast(err?.message || 'Research failed. Please try again.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleAnalyzeCustomUrl = async (urlOrAsin: string) => {
    setIsAnalyzingUrl(true);
    try {
      const parseRes = await apiFetch('/api/research/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrAsin })
      });
      const parseData = await parseRes.json();
      if (!parseRes.ok || !parseData.bookInfo) {
        throw new Error(parseData.error || 'Failed to inspect book');
      }

      const book = parseData.bookInfo;
      setCurrentReport(prev => ({ ...prev, competitors: [book, ...prev.competitors] }));
      setCompareCompetitors(prev => {
        if (!prev.some(b => b.id === book.id)) return [book, ...prev].slice(0, 4);
        return prev;
      });
      showToast(`Analyzed competitor: "${book.title}"`);
    } catch (err: any) {
      alert(err.message || 'Unable to inspect book. Please verify ASIN or URL.');
    } finally {
      setIsAnalyzingUrl(false);
    }
  };

  const handleSaveOpportunity = (opp: OpportunityItem) => {
    const existing = savedItems.find(s => s.id === `saved_${opp.id}`);
    if (existing) {
      setSavedItems(prev => prev.filter(s => s.id !== existing.id));
      showToast('Removed from saved library.');
      return;
    }

    const newItem: SavedResearchItem = {
      id: `saved_${opp.id}`,
      userId: currentUser.id,
      topic: opp.title,
      type: 'opportunity',
      reportData: currentReport,
      savedAt: new Date().toISOString(),
      notes: opp.opportunityExplanation
    };
    setSavedItems(prev => [newItem, ...prev]);
    showToast(`Saved "${opp.title}" to library!`);
  };

  const isOpportunitySaved = (oppId: string) => savedItems.some(s => s.id === `saved_${oppId}`);

  const handleCompareOpportunity = (opp: OpportunityItem) => {
    setCompareOpportunities(prev => {
      const exists = prev.some(o => o.id === opp.id);
      if (exists) return prev.filter(o => o.id !== opp.id);
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 opportunities at once.');
        return prev;
      }
      return [...prev, opp];
    });
    showToast('Updated comparison matrix.');
  };

  const isOpportunityInCompare = (oppId: string) => compareOpportunities.some(o => o.id === oppId);

  const handleCompareCompetitor = (book: CompetitorBook) => {
    setCompareCompetitors(prev => {
      const exists = prev.some(b => b.id === book.id);
      if (exists) return prev.filter(b => b.id !== book.id);
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 books at once.');
        return prev;
      }
      return [...prev, book];
    });
    showToast('Updated competitor comparison.');
  };

  const isBookInComparison = (bookId: string) => compareCompetitors.some(b => b.id === bookId);

  const handleActivatePlan = async (planId: string) => {
    const res = await apiFetch('/api/billing/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId })
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setCurrentUser(data.user);
      showToast(data.message || 'Plan activated!');
    } else {
      throw new Error(data.error || 'Failed to activate plan');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
    } catch (error) {
      console.error('KDP Digger sign-out failed:', error);
    } finally {
      setCurrentUser(GUEST_USER);
      setIsAuthenticated(false);
      setPasswordRecovery(false);
      setIsAuthModalOpen(true);
      setActiveTab('dashboard');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600 text-sm">
        Loading secure KDP Digger session...
      </div>
    );
  }

  return (
    <div id="kdp-app-root" className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      {toastMessage && (
        <div id="app-toast-notification" className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        currentUser={currentUser}
        onSearch={handleSearch}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onToggleLandingPage={() => setIsLandingPage(!isLandingPage)}
        isLandingPage={isLandingPage}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onSignOut={handleSignOut}
      />

      {!isAuthenticated || isLandingPage ? (
        <LandingPageView
          onStartResearch={(sampleTopic) => {
            if (!isAuthenticated) {
              setIsAuthModalOpen(true);
              return;
            }
            setIsLandingPage(false);
            if (sampleTopic) handleSearch(sampleTopic);
          }}
          onOpenPricing={() => setIsPricingModalOpen(true)}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentUser={currentUser}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            savedCount={savedItems.length}
          />

          <main className="flex-1 lg:pl-64 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {isLoading && <ResearchProgress topic={searchTopic} />}

              {!isLoading && (
                <>
                  {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                      <ResearchHero onSearch={handleSearch} isLoading={isLoading} activeTopic={searchTopic} />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div onClick={() => setActiveTab('keywords')} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-400 transition-colors cursor-pointer">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Keywords</span>
                          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-between">
                            <span>{currentReport.keywords.highRelevance.length + currentReport.keywords.longTail.length}</span>
                            <KeyRound className="w-5 h-5 text-amber-500" />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Live Amazon queries</span>
                        </div>
                        <div onClick={() => setActiveTab('niches')} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-400 transition-colors cursor-pointer">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Sub-Niches</span>
                          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-between">
                            <span>{currentReport.niches.length}</span>
                            <Compass className="w-5 h-5 text-blue-500" />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Market angles</span>
                        </div>
                        <div onClick={() => setActiveTab('competitors')} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-400 transition-colors cursor-pointer">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Competitors</span>
                          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-between">
                            <span>{currentReport.competitors.length}</span>
                            <Users2 className="w-5 h-5 text-purple-500" />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Title & format snapshots</span>
                        </div>
                        <div onClick={() => setActiveTab('opportunity-finder')} className="bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 rounded-xl p-4 shadow-xs hover:border-amber-400 transition-colors cursor-pointer">
                          <span className="text-[11px] font-extrabold text-amber-900 uppercase block mb-1">Opportunities</span>
                          <div className="text-xl sm:text-2xl font-black text-amber-950 flex items-center justify-between">
                            <span>{currentReport.opportunities.length}</span>
                            <Sparkles className="w-5 h-5 text-amber-600" />
                          </div>
                          <span className="text-[10px] text-amber-800 font-semibold mt-1 block">Narrowed concepts &rarr;</span>
                        </div>
                      </div>
                      {currentReport.opportunities[0] && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <CompetitionBadge signal={currentReport.opportunities[0].competitionSignal} />
                                <DemandBadge signal={currentReport.opportunities[0].demandSignal} />
                                <MarketMaturityBadge maturity={currentReport.opportunities[0].marketMaturity} />
                              </div>
                              <h3 className="text-xl font-black text-slate-900">Top Opportunity: {currentReport.opportunities[0].title}</h3>
                            </div>
                            <button onClick={() => setActiveTab('opportunity-finder')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start transition-colors shadow-xs">
                              <span>Explore in Opportunity Finder</span><ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{currentReport.opportunities[0].opportunityExplanation}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {currentReport.opportunities[0].suggestedBookAngles.map((angle, idx) => (
                              <div key={idx} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-slate-800 font-medium">&ldquo;{angle}&rdquo;</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'keywords' && <KeywordResearchView primaryKeyword={searchTopic} keywords={currentReport.keywords} onSelectKeyword={handleSearch} />}
                  {activeTab === 'niches' && <NicheResearchView niches={currentReport.niches} topic={searchTopic} onExploreNiche={handleSearch} onSelectKeyword={handleSearch} />}
                  {activeTab === 'competitors' && <CompetitorResearchView competitors={currentReport.competitors} marketGaps={currentReport.marketGaps} topic={searchTopic} onCompareCompetitor={handleCompareCompetitor} isBookInComparison={isBookInComparison} onAnalyzeCustomUrl={handleAnalyzeCustomUrl} isAnalyzingUrl={isAnalyzingUrl} />}
                  {activeTab === 'opportunity-finder' && <OpportunityFinderView opportunities={currentReport.opportunities} topic={searchTopic} onSaveOpportunity={handleSaveOpportunity} isOpportunitySaved={isOpportunitySaved} onCompareOpportunity={handleCompareOpportunity} isOpportunityInCompare={isOpportunityInCompare} onViewFullReport={() => setActiveTab('opportunity-report')} onSelectKeyword={handleSearch} />}
                  {activeTab === 'compare-opportunities' && <CompareOpportunitiesView opportunities={compareOpportunities} onRemoveFromCompare={(id) => setCompareOpportunities(prev => prev.filter(o => o.id !== id))} onSelectOpportunity={() => setActiveTab('opportunity-finder')} onClearAll={() => setCompareOpportunities([])} />}
                  {activeTab === 'compare-competitors' && <CompetitorComparisonView competitors={compareCompetitors} onRemoveCompetitor={(id) => setCompareCompetitors(prev => prev.filter(b => b.id !== id))} onClearAll={() => setCompareCompetitors([])} />}
                  {activeTab === 'opportunity-report' && <OpportunityReportView report={currentReport} onSelectKeyword={handleSearch} />}
                  {activeTab === 'saved-research' && <SavedResearchView savedItems={savedItems} onOpenItem={(item) => { if (item.reportData) { setCurrentReport(item.reportData); setSearchTopic(item.topic); setActiveTab('opportunity-finder'); showToast(`Opened saved research for "${item.topic}".`); } }} onDeleteItem={(id) => { setSavedItems(prev => prev.filter(s => s.id !== id)); showToast('Item deleted.'); }} onToggleFavorite={(id) => setSavedItems(prev => prev.map(s => s.id === id ? { ...s, favorite: !s.favorite } : s))} />}
                  {activeTab === 'history' && <HistoryView history={historyItems} onReRunSearch={handleSearch} />}
                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1"><Coins className="w-4 h-4" /><span>Plans & Credits</span></div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Research Credits & Fair-Use Pricing</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Active balance: <strong>{currentUser.credits} research credits</strong> on <strong>{currentUser.plan}</strong>.</p>
                      </div>
                      <button onClick={() => setIsPricingModalOpen(true)} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2"><Coins className="w-4 h-4" /><span>Open Plans & Add Credits ($1 &ndash; $3)</span></button>
                    </div>
                  )}
                  {activeTab === 'account' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-xl mx-auto space-y-4">
                      <h3 className="text-lg font-bold text-slate-900">Your Account Profile</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Name</span><span className="font-semibold text-slate-900">{currentUser.name}</span></div>
                        <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Email</span><span className="font-semibold text-slate-900">{currentUser.email}</span></div>
                        <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Active Plan</span><span className="font-semibold text-slate-900">{currentUser.plan}</span></div>
                        <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Credits Remaining</span><span className="font-bold text-amber-700 text-sm">{currentUser.credits}</span></div>
                        <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Role</span><span className="font-semibold text-indigo-700 uppercase">{currentUser.role}</span></div>
                      </div>
                      <div className="pt-4 flex items-center justify-end"><button onClick={handleSignOut} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold">Sign Out</button></div>
                    </div>
                  )}
                  {activeTab === 'help' && <HelpView />}
                  {activeTab === 'admin' && currentUser.role === 'admin' && <AdminPanelView currentUser={currentUser} />}
                </>
              )}
            </div>
          </main>
        </div>
      )}

      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} currentUser={currentUser} onActivatePlan={handleActivatePlan} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => { setIsAuthModalOpen(false); setPasswordRecovery(false); }}
        passwordRecovery={passwordRecovery}
        onAuthenticated={async () => {
          const res = await apiFetch('/api/auth/me');
          const data = await res.json();
          if (!res.ok || !data.user) throw new Error(data.error || 'Unable to load account');
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          setPasswordRecovery(false);
          setIsLandingPage(false);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
