import express from 'express';
import { db } from './db.ts';
import { amazonProvider } from './amazonProvider.ts';
import { geminiService } from './geminiService.ts';
import { billingService } from './billingService.ts';

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use(express.urlencoded({ extended: true }));

// Helper to extract authenticated user
const getUserFromReq = (req: express.Request) => {
  const authHeader = req.headers['x-user-id'] as string;
  if (authHeader) {
    const user = db.getUserById(authHeader);
    if (user) return user;
  }
  return db.getUserById('usr_demo') || db.getUsers()[0];
};

// ===================== AUTH ROUTES =====================
apiRouter.post('/auth/register', (req, res) => {
  const { email, name } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.json({ user: existing, message: 'Welcome back! Signed in with existing account.' });
  }

  const newUser = db.createUser(email, name);
  return res.status(201).json({ user: newUser, message: 'Account created with 3 free research credits!' });
});

apiRouter.post('/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    const created = db.createUser(email);
    return res.json({ user: created, message: 'New account provisioned with free credits.' });
  }

  db.updateUser(user.id, { lastActive: new Date().toISOString() });
  return res.json({ user, message: 'Signed in successfully.' });
});

apiRouter.get('/auth/me', (req, res) => {
  const user = getUserFromReq(req);
  res.json({ user });
});

apiRouter.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({ message: `Password reset link has been dispatched to ${email || 'your email'}.` });
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
  const { topic, userId, skipCreditDeduction } = req.body;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Research topic or keyword is required.' });
  }

  const cleanTopic = topic.trim();
  const activeUserId = userId || 'usr_demo';
  const user = db.getUserById(activeUserId);

  // Credit check
  if (!skipCreditDeduction && user && user.role !== 'admin') {
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
    db.logUsage(activeUserId, user?.email || 'guest', cleanTopic, 'full_report', 1, false);

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
      details: err?.message || 'Server error'
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
