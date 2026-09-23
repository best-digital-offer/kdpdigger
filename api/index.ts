import express from 'express';
import { apiRouter } from '../server/apiRouter.ts';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://kdpdigger.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'kdp-digger-api', timestamp: new Date().toISOString() });
});

// Mount all API endpoints
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
