import fs from 'fs';
import path from 'path';
import { User, PricingPlan, SavedResearchItem, ResearchHistoryItem, UsageLog, SystemSettings } from '../src/types.ts';

interface DatabaseSchema {
  users: User[];
  plans: PricingPlan[];
  savedReports: SavedResearchItem[];
  history: ResearchHistoryItem[];
  usageLogs: UsageLog[];
  settings: SystemSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter-3day',
    name: '3-Day Sprint',
    price: 1,
    durationDays: 3,
    durationLabel: '3 Days Full Access',
    credits: 10,
    popular: true,
    description: 'Perfect for validating a single book idea before publishing.',
    features: [
      '10 Research Credits',
      'Keyword Research & Clustering',
      'Niche Breakdown & Angles',
      'Competitor Positioning Analysis',
      'Opportunity Finder Engine',
      'AI Opportunity Reports',
      'Full PDF & CSV Export'
    ]
  },
  {
    id: 'growth-10day',
    name: '10-Day Deep Dive',
    price: 2,
    durationDays: 10,
    durationLabel: '10 Days Full Access',
    credits: 25,
    popular: false,
    description: 'Ideal for researching an entire publishing category or series.',
    features: [
      '25 Research Credits',
      'All Research Tools & Signals',
      'Competitor Gap Analysis',
      'Side-by-Side Opportunity Comparison',
      'Saved Research Library',
      'Export to PDF & CSV'
    ]
  },
  {
    id: 'publisher-30day',
    name: '30-Day Pro Publisher',
    price: 3,
    durationDays: 30,
    durationLabel: '30 Days Full Access',
    credits: 60,
    popular: false,
    description: 'Best for active publishers validating multiple quarterly releases.',
    features: [
      '60 Research Credits',
      'Priority Gemini Analysis',
      'Unlimited Saved Reports',
      'Competitor Comparison Matrix',
      'Market Gap Discovery',
      'Fair-use Protection'
    ]
  }
];

const DEFAULT_SETTINGS: SystemSettings = {
  geminiConfigured: !!process.env.GEMINI_API_KEY,
  amazonDataProvider: 'autocomplete_public',
  paymentProvider: 'simulation',
  freeCreditsOnSignup: 3,
  rateLimitPerMinute: 30,
  maintenanceMode: false
};

const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    email: 'admin@kdpopportunity.com',
    name: 'KDP Admin',
    role: 'admin',
    credits: 999,
    plan: 'Admin Master',
    createdAt: '2026-09-01T00:00:00.000Z',
    lastActive: new Date().toISOString()
  },
  {
    id: 'usr_demo',
    email: 'author@kdpdemo.com',
    name: 'Sarah Publisher',
    role: 'user',
    credits: 3,
    plan: 'Free Trial',
    createdAt: '2026-09-20T10:00:00.000Z',
    lastActive: new Date().toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          users: parsed.users || INITIAL_USERS,
          plans: parsed.plans || DEFAULT_PLANS,
          savedReports: parsed.savedReports || [],
          history: parsed.history || [],
          usageLogs: parsed.usageLogs || [],
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.warn('Could not read persistent DB file, initializing defaults', e);
    }

    const initial: DatabaseSchema = {
      users: INITIAL_USERS,
      plans: DEFAULT_PLANS,
      savedReports: [],
      history: [
        {
          id: 'hist_1',
          userId: 'usr_demo',
          topic: 'Christian prayer',
          type: 'full_report',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'hist_2',
          userId: 'usr_demo',
          topic: 'anxiety journal',
          type: 'full_report',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'hist_3',
          userId: 'usr_demo',
          topic: 'murder mystery puzzles',
          type: 'keyword',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ],
      usageLogs: [],
      settings: DEFAULT_SETTINGS
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(state: DatabaseSchema = this.data): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB state:', e);
    }
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(email: string, name?: string): User {
    const newUser: User = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      email: email.trim().toLowerCase(),
      name: name?.trim() || email.split('@')[0],
      role: 'user',
      credits: this.data.settings.freeCreditsOnSignup,
      plan: 'Free Trial',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates, lastActive: new Date().toISOString() };
    this.saveData();
    return this.data.users[index];
  }

  deductUserCredit(userId: string, amount: number = 1): { success: boolean; creditsRemaining: number; message?: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, creditsRemaining: 0, message: 'User not found' };
    
    // Admin has unlimited bypass
    if (user.role === 'admin') {
      return { success: true, creditsRemaining: 999 };
    }

    if (user.credits < amount) {
      return { success: false, creditsRemaining: user.credits, message: 'Insufficient research credits. Please top up or upgrade plan.' };
    }

    user.credits -= amount;
    user.lastActive = new Date().toISOString();
    this.saveData();
    return { success: true, creditsRemaining: user.credits };
  }

  addUserCredits(userId: string, amount: number, planName?: string, durationDays?: number): User | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;
    user.credits += amount;
    if (planName) user.plan = planName;
    if (durationDays) {
      const expires = new Date();
      expires.setDate(expires.getDate() + durationDays);
      user.planExpiresAt = expires.toISOString();
    }
    user.lastActive = new Date().toISOString();
    this.saveData();
    return user;
  }

  // Plans
  getPlans(): PricingPlan[] {
    return this.data.plans;
  }

  updatePlan(planId: string, updates: Partial<PricingPlan>): PricingPlan | undefined {
    const index = this.data.plans.findIndex(p => p.id === planId);
    if (index === -1) return undefined;
    this.data.plans[index] = { ...this.data.plans[index], ...updates };
    this.saveData();
    return this.data.plans[index];
  }

  // Saved Reports
  getSavedReports(userId: string): SavedResearchItem[] {
    return this.data.savedReports.filter(r => r.userId === userId);
  }

  getSavedReportById(id: string): SavedResearchItem | undefined {
    return this.data.savedReports.find(r => r.id === id);
  }

  saveReport(userId: string, topic: string, type: SavedResearchItem['type'], reportData: any, notes?: string): SavedResearchItem {
    const reportItem: SavedResearchItem = {
      id: 'rpt_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      userId,
      topic,
      type,
      createdAt: new Date().toISOString(),
      opportunitiesCount: reportData?.opportunities?.length || 0,
      reportData,
      notes,
      favorite: false
    };
    this.data.savedReports.unshift(reportItem);
    this.saveData();
    return reportItem;
  }

  toggleFavoriteReport(id: string): boolean {
    const report = this.data.savedReports.find(r => r.id === id);
    if (!report) return false;
    report.favorite = !report.favorite;
    this.saveData();
    return report.favorite;
  }

  deleteSavedReport(id: string, userId: string): boolean {
    const initialLen = this.data.savedReports.length;
    this.data.savedReports = this.data.savedReports.filter(r => !(r.id === id && (r.userId === userId || userId === 'usr_admin')));
    const deleted = this.data.savedReports.length < initialLen;
    if (deleted) this.saveData();
    return deleted;
  }

  // History
  addHistory(userId: string, topic: string, type: string, reportId?: string): ResearchHistoryItem {
    const item: ResearchHistoryItem = {
      id: 'hist_' + Date.now().toString(36),
      userId,
      topic,
      type,
      createdAt: new Date().toISOString(),
      reportId
    };
    this.data.history.unshift(item);
    if (this.data.history.length > 500) {
      this.data.history = this.data.history.slice(0, 500);
    }
    this.saveData();
    return item;
  }

  getHistory(userId: string, limit: number = 20): ResearchHistoryItem[] {
    return this.data.history
      .filter(h => h.userId === userId || userId === 'usr_admin')
      .slice(0, limit);
  }

  // Usage Logs
  logUsage(userId: string, userEmail: string, query: string, researchType: string, creditsUsed: number, cacheHit: boolean): void {
    const log: UsageLog = {
      id: 'log_' + Date.now().toString(36),
      userId,
      userEmail,
      query,
      researchType,
      creditsUsed,
      timestamp: new Date().toISOString(),
      cacheHit
    };
    this.data.usageLogs.unshift(log);
    if (this.data.usageLogs.length > 1000) {
      this.data.usageLogs = this.data.usageLogs.slice(0, 1000);
    }
    this.saveData();
  }

  getUsageLogs(limit: number = 50): UsageLog[] {
    return this.data.usageLogs.slice(0, limit);
  }

  // Admin stats
  getAdminStats() {
    const totalUsers = this.data.users.length;
    const now = Date.now();
    const oneDay = 24 * 3600 * 1000;

    const newUsersToday = this.data.users.filter(u => now - new Date(u.createdAt).getTime() < oneDay).length;
    const activeUsersToday = this.data.users.filter(u => now - new Date(u.lastActive || u.createdAt).getTime() < oneDay).length;

    const totalResearchRequests = this.data.history.length;
    const creditsConsumedTotal = this.data.usageLogs.reduce((acc, curr) => acc + curr.creditsUsed, 0);

    // Topic frequencies
    const topicCounts: Record<string, number> = {};
    for (const h of this.data.history) {
      const t = (h.topic || h.query || 'general').toLowerCase().trim();
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    }
    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const paidUsers = this.data.users.filter(u => u.plan !== 'Free Trial').length;
    const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) + '%' : '0%';
    const estimatedRevenue = paidUsers * 2; // Approximate base pricing average

    return {
      totalUsers,
      newUsersToday,
      activeUsersToday,
      totalResearchRequests,
      aiRequestsCount: this.data.usageLogs.filter(l => !l.cacheHit).length,
      creditsConsumedTotal,
      estimatedRevenue,
      conversionRate,
      topTopics
    };
  }

  getSettings(): SystemSettings {
    this.data.settings.geminiConfigured = !!process.env.GEMINI_API_KEY;
    return this.data.settings;
  }

  updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }
}

export const db = new Database();
