// Run the same endpoint in Vite development; production uses the Vercel function.
import { createProductTestingHandler } from '../server/productTesting.mjs';

export function productTestingDev(env, handlerOptions = {}) {
  return {
    name: 'product-testing-api',
    configureServer(server) {
      const handler = createProductTestingHandler({ ...handlerOptions, env });
      server.middlewares.use('/api/product-testing', async (req, res) => {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 32768) {
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Your application is too long.' }));
            return;
          }
          chunks.push(chunk);
        }
        req.body = Buffer.concat(chunks).toString();
        res.status = code => { res.statusCode = code; return res; };
        res.json = data => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
        await handler(req, res);
      });
    },
  };
}
