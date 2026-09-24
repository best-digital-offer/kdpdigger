import express from 'express';
import { handleKdpDiggerMcpRequest } from '../server/kdpDiggerMcp.ts';

const app = express();

app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization, Mcp-Session-Id, Last-Event-ID'
  );
  res.header('Access-Control-Expose-Headers', 'Mcp-Session-Id');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/', (_req, res) => {
  res.json({
    name: 'KDP Digger MCP',
    status: 'ok',
    transport: 'streamable-http',
    message: 'KDP Digger ChatGPT app endpoint'
  });
});

app.all('/', async (req, res) => {
  try {
    await handleKdpDiggerMcpRequest(req, res, req.body);
  } catch (error) {
    console.error('KDP Digger MCP request failed:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'KDP Digger MCP request failed.' });
    }
  }
});

export default app;
