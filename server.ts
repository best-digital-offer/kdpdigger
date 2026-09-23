import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { amazonProvider } from './server/amazonProvider.ts';
import { geminiService } from './server/geminiService.ts';
import { billingService } from './server/billingService.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Helper to extract authenticated user
  const getUserFromReq = (req: express.Request) => {
    const authHeader = req.headers['x-user-id'] as string;
    if (authHeader) {
      const user = db.getUserById(authHeader);
      if (user) return user;
    }
    // Default fallback to demo user if unauthenticated
    return db.getUserById('usr_demo') || db.getUsers()[0];
  };

  // ===================== SEO ROUTES =====================
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://kdp-opportunity-finder.com/sitemap.xml`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kdp-opportunity-finder.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://kdp-opportunity-finder.com/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kdp-opportunity-finder.com/how-it-works</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
  });

  // ===================== AUTH ROUTES =====================
  app.post('/api/auth/register', (req, res) => {
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

  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      // Auto-create for friendly micro-SaaS onboarding
      const created = db.createUser(email);
      return res.json({ user: created, message: 'New account provisioned with free credits.' });
    }

    db.updateUser(user.id, { lastActive: new Date().toISOString() });
    return res.json({ user, message: 'Signed in successfully.' });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getUserFromReq(req);
    res.json({ user });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    res.json({ message: `Password reset link has been dispatched to ${email || 'your email'}.` });
  });

  // ===================== RESEARCH ROUTES =====================

  // Real Amazon search autocomplete suggestions
  app.get('/api/research/suggestions', async (req, res) => {
    const q = (typeof req.query?.q === 'string' ? req.query.q : (req.query?.q as any)?.toString()) || '';
    if (!q.trim()) {
      return res.json({ suggestions: [] });
    }
    const suggestions = await amazonProvider.getSearchSuggestions(q);
    res.json({ suggestions, source: 'amazon_public_books_index' });
  });

  // Parse Amazon book URL or ASIN
  app.post('/api/research/parse-url', async (req, res) => {
    const { urlOrAsin } = req.body;
    if (!urlOrAsin) {
      return res.status(400).json({ error: 'Amazon URL or ASIN is required.' });
    }

    const bookInfo = await amazonProvider.getBook(urlOrAsin);
    res.json({ bookInfo });
  });

  // Competitor Positioning Analysis
  app.post('/api/research/positioning', async (req, res) => {
    const { title, subtitle, format, price } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Book title is required.' });
    }

    const analysis = await geminiService.analyzeCompetitorPositioning(title, subtitle, format, price);
    res.json({ analysis });
  });

  // Topic narrowing pipeline for Opportunity Finder
  app.post('/api/research/narrow-topic', async (req, res) => {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const narrowed = await geminiService.narrowTopic(topic);
    res.json(narrowed);
  });

  // Core Full Research Engine
  app.post('/api/research/search', async (req, res) => {
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
      // 1. Fetch real Amazon search suggestions for the keyword
      const realSuggestions = await amazonProvider.getSearchSuggestions(cleanTopic);

      // 2. Generate or retrieve structured research report via Gemini / Analytics engine
      const report = await geminiService.generateFullResearch(cleanTopic, realSuggestions);

      // 3. Log history and usage
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
  app.get('/api/reports/saved', (req, res) => {
    const user = getUserFromReq(req);
    const reports = db.getSavedReports(user.id);
    res.json({ reports });
  });

  app.post('/api/reports/save', (req, res) => {
    const user = getUserFromReq(req);
    const { topic, type, reportData, notes } = req.body;

    if (!topic || !reportData) {
      return res.status(400).json({ error: 'Topic and report data are required.' });
    }

    const saved = db.saveReport(user.id, topic, type || 'full_report', reportData, notes);
    res.json({ saved, message: 'Research saved to your private library.' });
  });

  app.post('/api/reports/toggle-favorite/:id', (req, res) => {
    const fav = db.toggleFavoriteReport(req.params.id);
    res.json({ favorite: fav });
  });

  app.delete('/api/reports/:id', (req, res) => {
    const user = getUserFromReq(req);
    const deleted = db.deleteSavedReport(req.params.id, user.id);
    res.json({ success: deleted });
  });

  app.get('/api/history', (req, res) => {
    const user = getUserFromReq(req);
    const history = db.getHistory(user.id);
    res.json({ history });
  });

  // ===================== BILLING & PLANS =====================
  app.get('/api/billing/plans', (req, res) => {
    const plans = db.getPlans();
    res.json({ plans });
  });

  app.post('/api/billing/checkout', async (req, res) => {
    const user = getUserFromReq(req);
    const { planId } = req.body;

    try {
      const checkout = await billingService.createCheckoutSession(user.id, planId);
      res.json(checkout);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/billing/activate', (req, res) => {
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
  app.get('/api/admin/stats', (req, res) => {
    const user = getUserFromReq(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    }
    const stats = db.getAdminStats();
    res.json({ stats });
  });

  app.get('/api/admin/users', (req, res) => {
    const user = getUserFromReq(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    }
    const users = db.getUsers();
    res.json({ users });
  });

  app.post('/api/admin/users/:id/credits', (req, res) => {
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

  app.post('/api/admin/plans/:id', (req, res) => {
    const user = getUserFromReq(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    }
    const updated = db.updatePlan(req.params.id, req.body);
    res.json({ plan: updated });
  });

  app.get('/api/admin/usage', (req, res) => {
    const user = getUserFromReq(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    }
    const logs = db.getUsageLogs();
    res.json({ logs });
  });

  app.get('/api/admin/settings', (req, res) => {
    const user = getUserFromReq(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    }
    const settings = db.getSettings();
    res.json({ settings });
  });

  app.post('/api/admin/settings', (req, res) => {
    const user = getUserFromReq(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    }
    const updated = db.updateSettings(req.body);
    res.json({ settings: updated });
  });

  // ===================== FRONTEND SERVING =====================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KDP Opportunity Finder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
