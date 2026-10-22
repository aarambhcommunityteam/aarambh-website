
import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import {
  createReadStream,
  existsSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

const dist = resolve('dist');
const baseUrl = 'http://127.0.0.1:4178';
const siteUrl = 'https://aarambh-community.vercel.app';

const routes = [
  '/',
  '/about',
  '/community',
  '/opportunities',
  '/events',
  '/founder',
  '/join',
  '/contact',
  '/privacy',
  '/terms',
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

if (!existsSync(join(dist, 'index.html'))) {
  throw new Error('dist/index.html is missing. Run npm run build first.');
}

const server = createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, baseUrl).pathname
    );

    let file = resolve(dist, `.${pathname}`);

    // Prevent requests from escaping the dist directory.
    if (file !== dist && !file.startsWith(dist + sep)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // Serve the homepage for "/".
    if (pathname === '/') {
      file = join(dist, 'index.html');
    } else if (
      existsSync(file) &&
      statSync(file).isDirectory()
    ) {
      const directoryIndex = join(file, 'index.html');
      file = existsSync(directoryIndex)
        ? directoryIndex
        : join(dist, 'index.html');
    } else if (!existsSync(file)) {
      // Vite client-side routes initially use the SPA shell.
      file = join(dist, 'index.html');
    }

    res.writeHead(200, {
      'Content-Type':
        mimeTypes[extname(file).toLowerCase()] ||
        'application/octet-stream',
      'Cache-Control': 'no-store',
    });

    createReadStream(file)
      .on('error', error => {
        console.error('File read error:', error.message);

        if (!res.headersSent) {
          res.writeHead(500);
        }

        res.end('Internal server error');
      })
      .pipe(res);
  } catch (error) {
    console.error('Request error:', error.message);
    res.writeHead(400);
    res.end('Bad request');
  }
});

let browser;

try {
  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(4178, '127.0.0.1', resolveListen);
  });

  console.log(`Local prerender server: ${baseUrl}`);

  browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);

  for (const route of routes) {
    console.log(`\nRendering ${route}`);

    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    if (!response || !response.ok()) {
      throw new Error(
        `Failed to load ${route}: HTTP ${
          response?.status() ?? 'no response'
        }`
      );
    }

    // Wait for React and its SEO effect to finish.
    await page.waitForFunction(() => {
      const root = document.querySelector('#root');
      const canonical = document.querySelector(
        'link[rel="canonical"]'
      );
      const description = document.querySelector(
        'meta[name="description"]'
      );

      return (
        root &&
        root.children.length > 0 &&
        document.title.length > 0 &&
        canonical &&
        description
      );
    }, { timeout: 15000 });

    await page.evaluate(async () => {
      await document.fonts.ready;

      await new Promise(resolve =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      );
    });

    const metadata = await page.evaluate(() => ({
      title: document.title,
      description:
        document.querySelector(
          'meta[name="description"]'
        )?.content || '',
      canonical:
        document.querySelector(
          'link[rel="canonical"]'
        )?.href || '',
      rootHasContent: Boolean(
        document.querySelector('#root')?.innerHTML.trim()
      ),
    }));

    if (!metadata.rootHasContent) {
      throw new Error(`React rendered an empty root for ${route}`);
    }

    if (!metadata.description || !metadata.canonical) {
      throw new Error(
        `Missing description or canonical URL for ${route}`
      );
    }

    const expectedCanonical =
      `${siteUrl}${route === '/' ? '/' : route}`;

    if (metadata.canonical !== expectedCanonical) {
      throw new Error(
        `Unexpected canonical for ${route}: ${metadata.canonical}`
      );
    }

    // Use index.html for the homepage and clean-URL HTML files
    // for all other routes. Vercel cleanUrls serves about.html as /about.
    const output = route === '/'
      ? join(dist, 'index.html')
      : join(dist, `${route.slice(1)}.html`);

    // Save the complete rendered page, including metadata and JSON-LD.
    const html = await page.content();
    writeFileSync(output, html, 'utf8');

    console.log(`  Title: ${metadata.title}`);
    console.log(`  Canonical: ${metadata.canonical}`);
    console.log(`  Saved: ${output}`);
  }

  console.log('\nPrerendering completed successfully.');
} catch (error) {
  console.error('\nPrerendering failed:', error);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close().catch(() => {});
  }

  if (server.listening) {
    await new Promise(resolveClose =>
      server.close(resolveClose)
    );
  }
}
