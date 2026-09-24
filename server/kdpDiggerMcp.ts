import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { amazonProvider } from './amazonProvider.ts';
import { geminiService } from './geminiService.ts';

export function createKdpDiggerMcpServer() {
  const server = new McpServer(
    {
      name: 'kdp-digger',
      version: '1.0.0'
    },
    {
      instructions:
        'KDP Digger is a specialized Kindle Direct Publishing market-research app. Use it for KDP niche discovery, keyword exploration, market-gap analysis, and book opportunity research. Preview tools are free and do not consume KDP Digger credits. Full account research will require the user to connect their KDP Digger account.'
    }
  );

  server.registerTool(
    'kdp_digger_info',
    {
      title: 'KDP Digger',
      description:
        'Explain what KDP Digger does and how to use it for Kindle Direct Publishing market research.',
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      },
      securitySchemes: [{ type: 'noauth' }]
    },
    async () => {
      const output = {
        name: 'KDP Digger',
        purpose: 'KDP market research for authors and publishers',
        website: 'https://kdpdigger.vercel.app',
        capabilities: [
          'Keyword Research',
          'Niche Research',
          'Market Gap Analysis',
          'Opportunity Finder',
          'Full Opportunity Reports',
          'Saved Reports'
        ],
        note:
          'The ChatGPT integration is being prepared around the existing KDP Digger backend. Full account features will use the user’s own KDP Digger account and credits.'
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output
      };
    }
  );

  server.registerTool(
    'kdp_digger_preview_research',
    {
      title: 'Preview KDP Research',
      description:
        'Use this when a user wants an initial KDP niche or keyword direction. Returns a lightweight research preview without consuming KDP Digger credits. For a complete report, the user will later connect their KDP Digger account.',
      inputSchema: {
        topic: z
          .string()
          .min(2)
          .max(120)
          .describe('KDP niche, keyword, book idea, or topic to research')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true
      },
      securitySchemes: [{ type: 'noauth' }]
    },
    async ({ topic }) => {
      const cleanTopic = topic.trim();

      try {
        const [suggestions, narrowed] = await Promise.all([
          amazonProvider.getSearchSuggestions(cleanTopic),
          geminiService.narrowTopic(cleanTopic)
        ]);

        const output = {
          topic: cleanTopic,
          amazonSuggestions: suggestions.slice(0, 10),
          narrowedTopic: narrowed,
          fullResearch:
            'For keyword clusters, niche analysis, market gaps, opportunity scoring, and the complete report, connect a KDP Digger account when account linking is enabled.'
        };

        return {
          content: [{ type: 'text', text: JSON.stringify(output) }],
          structuredContent: output
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: 'KDP Digger preview research is temporarily unavailable. Please try again.'
            }
          ],
          isError: true
        };
      }
    }
  );

  return server;
}

export async function handleKdpDiggerMcpRequest(
  req: any,
  res: any,
  body?: unknown
) {
  const server = createKdpDiggerMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  await server.connect(transport);

  try {
    await transport.handleRequest(req, res, body);
  } finally {
    await transport.close();
    await server.close();
  }
}
