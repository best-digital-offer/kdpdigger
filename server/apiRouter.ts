import express from 'express';
import { db } from './db.ts';
import { amazonProvider } from './amazonProvider.ts';
import { geminiService } from './geminiService.ts';
import { billingService } from './billingService.ts';
import { createClient, type User as SupabaseUser } from '@supabase/supabase-js';

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use(express.urlencoded({ extended: true }));

// Supabase Auth is the only source of identity.
// The browser must send: Authorization: Bearer <Supabase access token>
const supabaseAuth = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : '';

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const { data, error } = await supabaseAuth.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired authentication session.' });
    }

    (req as any).supabaseUser = data.user;

    const email = data.user.email?.trim().toLowerCase();
    if (!email) {
      return res.status(401).json({ error: 'Authenticated account has no email address.' });
    }

    let localUser = db.getUserById(data.user.id);
    if (!localUser) {
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(value => value.trim().toLowerCase())
        .filter(Boolean);
      const role = adminEmails.includes(email) ? 'admin' : 'user';
      localUser = db.createUser(
        email,
        (data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split('@')[0]) as string,
        data.user.id,
        role
      );
    } else {
      db.updateUser(localUser.id, {
        email,
        name: (data.user.user_metadata?.full_name || data.user.user_metadata?.name || localUser.name) as string
      });
      localUser = db.getUserById(data.user.id) || localUser;
    }

    (req as any).appUser = localUser;
    next();
  } catch (error) {
    console.error('Supabase authentication verification failed:', error);
    return res.status(401).json({ error: 'Authentication verification failed.' });
  }
};

apiRouter.use(requireAuth);

const getUserFromReq = (req: express.Request) => {
  const user = (req as any).appUser;
  if (!user) {
    throw new Error('Authenticated application user is missing.');
  }
  return user;
};
// ===================== AUTH ROUTES =====================

apiRouter.get('/auth/me', (req, res) => {
  res.json({ user: getUserFromReq(req) });
});

// ===================== RESEARCH ROUTES =====================

// Real Amazon search autocomplete suggestions
apiRouter.get('/research/suggestions', async (req, res) => {
  const q = (typeof req.query?.q === 'string' ? req.query.q : (req.query?.q as any)?.toString()) || '';
  if (!q.trim()) {
    return res.json({ suggestions: [] });
  }
  const suggestions = await amazonProvider.getSearchSuggestions(q);
  res.json({ suggestions, source: 'amazon_public_books_index' });
});

// Parse Amazon book URL or ASIN
apiRouter.post('/research/parse-url', async (req, res) => {
  const { urlOrAsin } = req.body;
  if (!urlOrAsin) {
    return res.status(400).json({ error: 'Amazon URL or ASIN is required.' });
  }

  const bookInfo = await amazonProvider.getBook(urlOrAsin);
  res.json({ bookInfo });
});

// Competitor Positioning Analysis
apiRouter.post('/research/positioning', async (req, res) => {
  const { title, subtitle, format, price } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Book title is required.' });
  }

  const analysis = await geminiService.analyzeCompetitorPositioning(title, subtitle, format, price);
  res.json({ analysis });
});

// Topic narrowing pipeline for Opportunity Finder
apiRouter.post('/research/narrow-topic', async (req, res) => {
  const { topic } = req.body;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  const narrowed = await geminiService.narrowTopic(topic);
  res.json(narrowed);
});

// Core Full Research Engine
apiRouter.post('/research/search', async (req, res) => {
  const { topic } = req.body;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Research topic or keyword is required.' });
  }

  const cleanTopic = topic.trim();
  const user = getUserFromReq(req);
  const activeUserId = user.id;

  // Credit check
  if (user.role !== 'admin') {
    const creditRes = db.deductUserCredit(activeUserId, 1);
    if (!creditRes.success) {
      return res.status(402).json({
        error: creditRes.message || 'Insufficient research credits.',
        creditsRemaining: user.credits,
        requiresUpgrade: true
      });
    }
  }

  try {
    const realSuggestions = await amazonProvider.getSearchSuggestions(cleanTopic);
    const report = await geminiService.generateFullResearch(cleanTopic, realSuggestions);

    db.addHistory(activeUserId, cleanTopic, 'full_report', report.id);
    db.logUsage(activeUserId, user.email, cleanTopic, 'full_report', 1, false);

    const updatedUser = db.getUserById(activeUserId);

    res.json({
      report,
      creditsRemaining: updatedUser ? updatedUser.credits : 0,
      realSuggestionsFound: realSuggestions.length
    });
  } catch (err: any) {
    console.error('Research generation failure:', err);
    res.status(500).json({
      error: 'Unable to complete research request. Please try a different keyword or retry.',
    });
  }
});

// ===================== SAVED REPORTS & HISTORY =====================
apiRouter.get('/reports/saved', (req, res) => {
  const user = getUserFromReq(req);
  const reports = db.getSavedReports(user.id);
  res.json({ reports });
});

apiRouter.post('/reports/save', (req, res) => {
  const user = getUserFromReq(req);
  const { topic, type, reportData, notes } = req.body;

  if (!topic || !reportData) {
    return res.status(400).json({ error: 'Topic and report data are required.' });
  }

  const saved = db.saveReport(user.id, topic, type || 'full_report', reportData, notes);
  res.json({ saved, message: 'Research saved to your private library.' });
});

apiRouter.post('/reports/toggle-favorite/:id', (req, res) => {
  const fav = db.toggleFavoriteReport(req.params.id);
  res.json({ favorite: fav });
});

apiRouter.delete('/reports/:id', (req, res) => {
  const user = getUserFromReq(req);
  const deleted = db.deleteSavedReport(req.params.id, user.id);
  res.json({ success: deleted });
});

apiRouter.get('/history', (req, res) => {
  const user = getUserFromReq(req);
  const history = db.getHistory(user.id);
  res.json({ history });
});

// ===================== BILLING & PLANS =====================
apiRouter.get('/billing/plans', (req, res) => {
  const plans = db.getPlans();
  res.json({ plans });
});

apiRouter.post('/billing/checkout', async (req, res) => {
  const user = getUserFromReq(req);
  const { planId } = req.body;

  try {
    const checkout = await billingService.createCheckoutSession(user.id, planId);
    res.json(checkout);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/billing/activate', (req, res) => {
  const user = getUserFromReq(req);
  const { planId } = req.body;

  try {
    const result = billingService.applyPlanToUser(user.id, planId);
    const updatedUser = db.getUserById(user.id);
    res.json({ ...result, user: updatedUser, message: 'Research credits added successfully!' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ===================== ADMIN ROUTES =====================
apiRouter.get('/admin/stats', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const stats = db.getAdminStats();
  res.json({ stats });
});

apiRouter.get('/admin/users', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const users = db.getUsers();
  res.json({ users });
});

apiRouter.post('/admin/users/:id/credits', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const targetUserId = req.params.id;
  const { credits, plan } = req.body;

  const updated = db.updateUser(targetUserId, {
    ...(credits !== undefined ? { credits: Number(credits) } : {}),
    ...(plan ? { plan } : {})
  });

  res.json({ user: updated });
});

apiRouter.post('/admin/plans/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const updated = db.updatePlan(req.params.id, req.body);
  res.json({ plan: updated });
});

apiRouter.get('/admin/usage', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const logs = db.getUsageLogs();
  res.json({ logs });
});

apiRouter.get('/admin/settings', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const settings = db.getSettings();
  const aiStatus = geminiService.getAiStatus();
  const enrichedSettings = {
    ...settings,
    geminiConfigured: aiStatus.geminiAvailable,
    groqConfigured: aiStatus.groqAvailable,
    activeAiProviders: aiStatus.activeProviders,
    rollupStrategy: aiStatus.strategy,
    geminiEnabled: settings.geminiEnabled !== false,
    groqEnabled: aiStatus.groqAvailable
  };
  res.json({ settings: enrichedSettings });
});

apiRouter.get('/ai/status', (req, res) => {
  res.json({ ai: geminiService.getAiStatus() });
});

apiRouter.post('/admin/settings', (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const updated = db.updateSettings(req.body);
  res.json({ settings: updated });
});
