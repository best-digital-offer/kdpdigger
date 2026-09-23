import express from 'express';
import { db } from './db.ts';
import { amazonProvider } from './amazonProvider.ts';
import { geminiService } from './geminiService.ts';
import { billingService } from './billingService.ts';
import { createClient } from '@supabase/supabase-js';

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use(express.urlencoded({ extended: true }));

// Supabase Auth is the only source of identity.
// The browser must send: Authorization: Bearer <Supabase access token>
const supabaseAuth = createClient(
  process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://placeholder.supabase.co',
  process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_placeholder',
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

    let localUser = await db.getUserById(data.user.id);
    if (!localUser) {
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(value => value.trim().toLowerCase())
        .filter(Boolean);
      const role = adminEmails.includes(email) ? 'admin' : 'user';
      localUser = await db.createUser(
        email,
        (data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split('@')[0]) as string,
        data.user.id,
        role
      );
    } else {
      await db.updateUser(localUser.id, {
        email,
        name: (data.user.user_metadata?.full_name || data.user.user_metadata?.name || localUser.name) as string
      });
      localUser = (await db.getUserById(data.user.id)) || localUser;
    }

    (req as any).appUser = localUser;
    next();
  } catch (error) {
    console.error('Supabase authentication verification failed:', error);
    return res.status(401).json({ error: 'Authentication verification failed.' });
  }
};


// ===================== PUBLIC AUTH SIGNUP =====================
// Email/password signup is handled server-side so newly created accounts are
// immediately confirmed. This avoids blocking users on Supabase's email SMTP
// configuration while Google OAuth continues to use Supabase Auth normally.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key',
  { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
);

apiRouter.post('/auth/signup', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const name = String(req.body?.name || '').trim();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (password.length > 72) {
    return res.status(400).json({ error: 'Password must be 72 characters or fewer.' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name || email.split('@')[0] }
    });

    if (error) {
      if (/already registered|already exists|duplicate/i.test(error.message || '')) {
        return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      message: 'Account created successfully. You can now sign in.'
    });
  } catch (error: any) {
    console.error('Email signup failed:', error);
    res.status(500).json({ error: error?.message || 'Unable to create your account right now.' });
  }
});

apiRouter.use(requireAuth);

const getUserFromReq = (req: express.Request) => {
  const user = (req as any).appUser;
  if (!user) {
    throw new Error('Authenticated application user is missing.');
  }
  return user;
};
// ===================== AUTH ROUTES =====================

apiRouter.get('/auth/me', async (req, res) => {
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
  if (!bookInfo.isAvailable) {
    return res.status(400).json({ error: bookInfo.statusMessage, bookInfo });
  }

  if (!bookInfo.title) {
    return res.status(422).json({
      error: 'We found the ASIN, but could not verify the Amazon book page details. Please use the direct Amazon book detail URL or ASIN and try again.',
      bookInfo
    });
  }

  const positioning = await geminiService.analyzeCompetitorPositioning(
    bookInfo.title,
    '',
    bookInfo.format || 'Paperback',
    bookInfo.price || ''
  );

  const competitor = {
    id: `custom_${bookInfo.asin}`,
    asin: bookInfo.asin,
    title: bookInfo.title,
    subtitle: bookInfo.subtitle,
    author: bookInfo.author || 'Data unavailable',
    price: bookInfo.price || 'Data unavailable',
    format: bookInfo.format || 'Data unavailable',
    pages: bookInfo.pages,
    publicationDate: bookInfo.publicationDate,
    categories: bookInfo.categories,
    bsr: bookInfo.bsr,
    availableFormats: [bookInfo.format || 'Data unavailable'],
    positioningAnalysis: {
      ...positioning,
      pageLengthAssessment: bookInfo.pages ? `${bookInfo.pages} pages; verify current edition details on Amazon.` : 'Data unavailable',
      pricingAssessment: bookInfo.price ? `Current extracted price: ${bookInfo.price}; verify at purchase time.` : 'Data unavailable'
    }
  };

  res.json({ bookInfo: competitor });
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
    const creditRes = await db.deductUserCredit(activeUserId, 1);
    if (!creditRes.success) {
      return res.status(402).json({
        error: creditRes.message || 'Insufficient research credits.',
        creditsRemaining: user.credits,
        requiresUpgrade: true
      });
    }
  }

  let charged = false;

  try {
    // Keep Amazon enrichment bounded. Research must never fail just because
    // the optional public autocomplete endpoint is slow or unavailable.
    const realSuggestions = await amazonProvider.getSearchSuggestions(cleanTopic);

    if (user.role !== 'admin') {
      charged = true;
    }

    const report = await geminiService.generateFullResearch(cleanTopic, realSuggestions);

    // Persistence is secondary to delivering the report. A history/log write
    // failure must not turn a successfully generated report into a 500 error.
    try {
      await db.addHistory(activeUserId, cleanTopic, 'full_report');
      await db.logUsage(activeUserId, user.email, cleanTopic, 'full_report', 1, false);
    } catch (persistenceError) {
      console.error('Research persistence warning:', persistenceError);
    }

    const updatedUser = await db.getUserById(activeUserId);

    res.json({
      report,
      creditsRemaining: updatedUser ? updatedUser.credits : 0,
      realSuggestionsFound: realSuggestions.length
    });
  } catch (err: any) {
    console.error('Research generation failure:', err);

    // Do not leave the user permanently charged for a failed generation.
    if (charged && user.role !== 'admin') {
      try {
        await db.addUserCredits(activeUserId, 1);
      } catch (refundError) {
        console.error('Failed to refund research credit:', refundError);
      }
    }

    res.status(500).json({
      error: 'Unable to generate the report right now. Please try again.',
      detail: process.env.NODE_ENV === 'development' ? (err?.message || 'Unknown error') : undefined
    });
  }
});

// ===================== SAVED REPORTS & HISTORY =====================
apiRouter.get('/reports/saved', async (req, res) => {
  const user = getUserFromReq(req);
  const reports = await db.getSavedReports(user.id);
  res.json({ reports });
});

apiRouter.post('/reports/save', async (req, res) => {
  const user = getUserFromReq(req);
  const { topic, type, reportData, notes } = req.body;

  if (!topic || !reportData) {
    return res.status(400).json({ error: 'Topic and report data are required.' });
  }

  const saved = await db.saveReport(user.id, topic, type || 'full_report', reportData, notes);
  res.json({ saved, message: 'Research saved to your private library.' });
});

apiRouter.post('/reports/toggle-favorite/:id', async (req, res) => {
  const user = getUserFromReq(req);
  const fav = await db.toggleFavoriteReport(req.params.id, user.id);
  res.json({ favorite: fav });
});

apiRouter.delete('/reports/:id', async (req, res) => {
  const user = getUserFromReq(req);
  const deleted = await db.deleteSavedReport(req.params.id, user.id);
  res.json({ success: deleted });
});

apiRouter.get('/history', async (req, res) => {
  const user = getUserFromReq(req);
  const history = await db.getHistory(user.id);
  res.json({ history });
});

// ===================== BILLING & PLANS =====================
apiRouter.get('/billing/plans', async (req, res) => {
  const plans = await db.getPlans();
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

apiRouter.post('/billing/activate', async (req, res) => {
  const user = getUserFromReq(req);
  const { planId } = req.body;

  try {
    const result = billingService.applyPlanToUser(user.id, planId);
    const updatedUser = await db.getUserById(user.id);
    res.json({ ...result, user: updatedUser, message: 'Research credits added successfully!' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ===================== ADMIN ROUTES =====================
apiRouter.get('/admin/stats', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const stats = await db.getAdminStats();
  res.json({ stats });
});

apiRouter.get('/admin/users', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const users = await db.getUsers();
  res.json({ users });
});

apiRouter.post('/admin/users/:id/credits', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const targetUserId = req.params.id;
  const { credits, plan } = req.body;

  const updated = await db.updateUser(targetUserId, {
    ...(credits !== undefined ? { credits: Number(credits) } : {}),
    ...(plan ? { plan } : {})
  });

  res.json({ user: updated });
});

apiRouter.post('/admin/plans/:id', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const updated = await db.updatePlan(req.params.id, req.body);
  res.json({ plan: updated });
});

apiRouter.get('/admin/usage', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const logs = await db.getUsageLogs();
  res.json({ logs });
});

apiRouter.get('/admin/settings', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const settings = await db.getSettings();
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

apiRouter.get('/ai/status', async (req, res) => {
  res.json({ ai: geminiService.getAiStatus() });
});

apiRouter.post('/admin/settings', async (req, res) => {
  const user = getUserFromReq(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }
  const updated = await db.updateSettings(req.body);
  res.json({ settings: updated });
});
