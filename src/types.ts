export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  plan: string;
  planExpiresAt?: string;
  createdAt: string;
  lastActive?: string;
}

export type QualitativeSignal = 'Strong' | 'Moderate' | 'Emerging' | 'Limited data';
export type CompetitionSignal = 'Low' | 'Moderate' | 'High' | 'Insufficient data';
export type MarketMaturity = 'Emerging' | 'Established' | 'Crowded' | 'Highly competitive';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface KeywordItem {
  id: string;
  keyword: string;
  relevance: 'High' | 'Medium' | 'Low';
  competitionSignal: CompetitionSignal;
  commercialIntent: 'High' | 'Medium' | 'Informational';
  keywordType: 'core' | 'long-tail' | 'audience' | 'problem' | 'format';
  demandSignal: QualitativeSignal;
}

export interface KeywordCluster {
  theme: string;
  description: string;
  keywords: string[];
}

export interface NicheItem {
  id: string;
  nicheName: string;
  broadCategory: string;
  relatedKeywords: string[];
  competitionSignal: CompetitionSignal;
  demandSignal: QualitativeSignal;
  competitorCountEstimated: string; // e.g. "Data unavailable" or "15-25 detected"
  priceRange: string; // e.g. "$7.99 - $14.99"
  bsrRange: string; // e.g. "25k - 180k" or "Data unavailable"
  marketMaturity: MarketMaturity;
  opportunityInterpretation: string;
  suggestedAngles: string[];
}

export interface CompetitorBook {
  id: string;
  asin: string;
  title: string;
  subtitle?: string;
  author: string;
  price: string;
  format: string; // e.g. Paperback, Kindle, Hardcover
  pages?: number | string;
  publicationDate?: string;
  categories: string[];
  bsr?: string;
  availableFormats: string[];
  // NO review counts or ratings!
  positioningAnalysis: {
    targetAudience: string;
    exactTopic: string;
    formatType: string;
    pageLengthAssessment: string;
    pricingAssessment: string;
    subtitleStrategy: string;
    detectedKeywordThemes: string[];
    marketAngle: string;
  };
}

export interface MarketGap {
  id: string;
  commonTheme: string;
  underservedAngle: string;
  targetAudience: string;
  rationale: string;
  exampleConcept: string;
}

export interface OpportunityScorecard {
  keywordRelevance: 'High' | 'Medium' | 'Low';
  competitionSignal: 'High' | 'Medium' | 'Low' | 'Moderate';
  nicheSpecificity: 'High' | 'Medium' | 'Low';
  marketMaturity: 'Emerging' | 'Established' | 'Crowded';
  dataConfidence: 'High' | 'Medium' | 'Low';
  differentiationPotential: 'High' | 'Medium' | 'Low';
}

export interface OpportunityItem {
  id: string;
  title: string;
  narrowingHierarchy: string[]; // e.g. ["Christian Books", "Christian Prayer", "Bedtime Prayers", "Christian Bedtime Prayers for Anxiety"]
  narrowingExplanation: string;
  relatedKeywords: string[];
  competitionSignal: CompetitionSignal;
  demandSignal: QualitativeSignal;
  marketMaturity: MarketMaturity;
  competitorCountInfo: string;
  priceRangeInfo: string;
  bsrSignalInfo: string;
  opportunityExplanation: string;
  whyInvestigate: {
    specificity: string;
    audience: string;
    problem: string;
    competitorSituation: string;
    keywordOpportunities: string;
  };
  suggestedBookAngles: string[];
  scorecard: OpportunityScorecard;
}

export interface FullOpportunityReport {
  id: string;
  researchTopic: string;
  createdAt: string;
  summary: string;
  sections: {
    researchTopic: string;
    marketOverview: string;
    keywordOpportunitiesSummary: string;
    nicheOpportunitiesSummary: string;
    competitorLandscape: string;
    pricingLandscape: string;
    bsrSignals: string;
    marketGapsSummary: string;
    potentialAudienceSegments: string[];
    suggestedAngles: string[];
    competitionAssessment: string;
    researchRisks: string[];
    whatToValidateNext: string[];
    finalResearchSummary: string;
  };
  keywords: {
    highRelevance: KeywordItem[];
    longTail: KeywordItem[];
    audienceSpecific: KeywordItem[];
    clusters: KeywordCluster[];
  };
  niches: NicheItem[];
  competitors: CompetitorBook[];
  marketGaps: MarketGap[];
  opportunities: OpportunityItem[];
}

export interface SavedResearchItem {
  id: string;
  userId: string;
  topic: string;
  type: 'full_report' | 'keyword' | 'niche' | 'competitor' | 'opportunity';
  createdAt?: string;
  savedAt?: string;
  opportunitiesCount?: number;
  reportData?: FullOpportunityReport;
  notes?: string;
  favorite?: boolean;
}

export interface ResearchHistoryItem {
  id: string;
  userId: string;
  topic?: string;
  query?: string;
  type?: string;
  resultType?: string;
  createdAt?: string;
  timestamp?: string;
  reportId?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  durationLabel?: string;
  credits: number;
  popular?: boolean;
  recommended?: boolean;
  features: string[];
  description?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers?: number;
  newUsersToday?: number;
  activeUsersToday?: number;
  totalResearchRequests: number;
  totalAiRequests?: number;
  aiRequestsCount?: number;
  creditsConsumedTotal?: number;
  totalRevenue: number;
  estimatedRevenue?: number;
  conversionRate?: string;
  topTopics?: { topic: string; count: number }[];
  topQueriedNiches: { topic: string; count: number }[];
}

export interface UsageLog {
  id: string;
  userId: string;
  userEmail: string;
  query: string;
  researchType: string;
  creditsUsed: number;
  timestamp: string;
  cacheHit: boolean;
}

export interface SystemSettings {
  geminiConfigured: boolean;
  groqConfigured?: boolean;
  activeAiProviders?: string[];
  rollupStrategy?: string;
  amazonDataProvider: string; // 'autocomplete_public' | 'mock_compliant' | 'custom_api'
  paymentProvider: 'stripe' | 'lemon_squeezy' | 'paddle' | 'dodo' | 'simulation';
  freeCreditsOnSignup: number;
  rateLimitPerMinute: number;
  maintenanceMode: boolean;
  amazonDataProviderEnabled?: boolean;
  geminiEnabled?: boolean;
  groqEnabled?: boolean;
  simulationMode?: boolean;
}
