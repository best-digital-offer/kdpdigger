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