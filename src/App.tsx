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

  // Core Research State
  const [currentReport, setCurrentReport] = useState<FullOpportunityReport>(DEMO_CHRISTIAN_PRAYER_REPORT);
  const [searchTopic, setSearchTopic] = useState<string>('Christian prayer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Comparison State
  const [compareOpportunities, setCompareOpportunities] = useState<OpportunityItem[]>([
    DEMO_CHRISTIAN_PRAYER_REPORT.opportunities[0],
    DEMO_CHRISTIAN_PRAYER_REPORT.opportunities[1]
  ]);
  const [compareCompetitors, setCompareCompetitors] = useState<CompetitorBook[]>([
    DEMO_CHRISTIAN_PRAYER_REPORT.competitors[0],
    DEMO_CHRISTIAN_PRAYER_REPORT.competitors[1]
  ]);

  // Saved & History State
  // Saved research and history are account-scoped and must start empty for every new user.
  const [savedItems, setSavedItems] = useState<SavedResearchItem[]>([]);
  const [historyItems, setHistoryItems] = useState<ResearchHistoryItem[]>([]);

  // Supabase Auth session lifecycle.
  // Do not await Supabase auth methods from inside onAuthStateChange.
  // Doing so can race the auth lock during an OAuth redirect.
  useEffect(() => {
    let mounted = true;

    const applySession = async (session: any | null) => {
      if (!mounted) return;

      // A null session can be observed briefly while Supabase is still
      // processing the OAuth redirect. Do not open the login modal here.
      if (!session?.access_token) {
        if (mounted) setAuthLoading(false);
        return;
      }

      try {
        // The OAuth session can be available a moment before the API is
        // ready to create/load the corresponding KDP Digger account.
        // Retry briefly instead of treating that transient state as logout.
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < 3; attempt += 1) {
          if (!mounted) return;

          try {
            const res = await fetch('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
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
        // Keep the user signed out only after a real authenticated session
        // failed to load, rather than during the initial OAuth URL transition.
        if (mounted) {
          setCurrentUser(GUEST_USER);
          setIsAuthenticated(false);
          setAuthLoading(false);
        }
      }
    };

    // Subscribe before reading the current session so an OAuth redirect
    // event cannot be missed during initial app startup.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setCurrentUser(GUEST_USER);
        setIsAuthenticated(false);
        setPasswordRecovery(false);
        setAuthLoading(false);
        return;
      }

      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
        setIsAuthModalOpen(true);
        setAuthLoading(false);
        return;
      }

      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        // Run outside the Supabase auth callback.
        window.setTimeout(() => {
          void applySession(session);
        }, 0);
      }
    });

    // Check for a session already restored before the listener ran.
    // INITIAL_SESSION is the authoritative startup event. This fallback also
    // prevents the app from remaining on the loading screen if no session exists.
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session) {
        void applySession(session);
      }
    });

    // Safety timeout: if Supabase has no session and no auth event arrives,
    // release the loading screen and let the normal sign-in modal appear.
    const loadingTimeout = window.setTimeout(() => {
      if (mounted) setAuthLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.clearTimeout(loadingTimeout);
    };
  }, []);
  useEffect(() => {
    if (!authLoading && !isAuthenticated) setIsAuthModalOpen(true);
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

  // URL / ASIN Competitor Analyzer
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
      // Add analyzed book to competitors in current report
      setCurrentReport(prev => ({
        ...prev,
        competitors: [book, ...prev.competitors]
      }));

      // Automatically add to competitor comparison
      setCompareCompetitors(prev => {
        if (!prev.some(b => b.id === book.id)) {
          return [book, ...prev].slice(0, 4);
        }
        return prev;
      });

      showToast(`Analyzed competitor: "${book.title}"`);
    } catch (err: any) {
      alert(err.message || 'Unable to inspect book. Please verify ASIN or URL.');