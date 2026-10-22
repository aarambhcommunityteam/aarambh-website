
import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
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

const pageMetadata = {
  '/': {
    title: 'AARAMBH | The First Step of Entrepreneurship',
    description:
      'Discover AARAMBH, an entrepreneurship and innovation community connecting students, aspiring founders, builders, mentors, and curious minds.',
  },
  '/about': {
    title: 'About AARAMBH | Our Mission and Vision',
    description:
      'Discover AARAMBH, our mission, vision, and commitment to entrepreneurship and innovation.',
  },
  '/community': {
    title: 'Community | AARAMBH',
    description:
      'Explore the AARAMBH community of students, founders, mentors, innovators, and aspiring entrepreneurs.',
  },
  '/opportunities': {
    title: 'Startup Opportunities | AARAMBH',
    description:
      'Discover startup opportunities, learning experiences, and ways to take your first step with AARAMBH.',
  },
  '/events': {
    title: 'Events and Gatherings | AARAMBH',
    description:
      'Discover AARAMBH events and gatherings that bring aspiring entrepreneurs and innovators together.',
  },
  '/founder': {
    title: 'Founder | Sandarsh Jeripothula | AARAMBH',
    description:
      'Meet Sandarsh Jeripothula, founder of AARAMBH, an entrepreneurship and innovation community.',
  },
  '/join': {
    title: 'Join AARAMBH | Take Your First Step',
    description:
      'Join AARAMBH to connect with aspiring founders, innovators, mentors, and the entrepreneurship community.',
  },
  '/contact': {
    title: 'Contact AARAMBH | Get in Touch',
    description:
      'Get in touch with the AARAMBH team about our entrepreneurship community and collaboration opportunities.',
  },
  '/privacy': {
    title: 'Privacy Policy | AARAMBH',
    description:
      'Read the AARAMBH privacy policy to understand how information is handled.',
  },
  '/terms': {
    title: 'Terms of Use | AARAMBH',
    description:
      'Read the terms of use for the AARAMBH website and community.',
  },
};

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

function escapeHtml(value) {
  return value.replace(/[&"<>]/g, character => ({
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  })[character]);
}

function routeOutput(route) {
  return route === '/'
    ? join(dist, 'index.html')
    : join(dist, `${route.slice(1)}.html`);
}

function generateMetadataOnly() {
  const template = readFileSync(join(dist, 'index.html'), 'utf8');

  for (const [route, metadata] of Object.entries(pageMetadata)) {
    const url = `${siteUrl}${route === '/' ? '/' : route}`;
    const title = escapeHtml(metadata.title);
    const description = escapeHtml(metadata.description);

    const replacements = [
      [
        /<title>[\s\S]*?<\/title>/i,
        `<title>${title}</title>`,
      ],
      [
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${description}">`,
      ],
      [
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        `<link rel="canonical" href="${url}">`,
      ],
      [
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:url" content="${url}">`,
      ],
      [
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:title" content="${title}">`,
      ],
      [
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${description}">`,
      ],
      [
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:title" content="${title}">`,
      ],
      [
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:description" content="${description}">`,
      ],
    ];

    let html = template;

    for (const [pattern, replacement] of replacements) {
      if (!pattern.test(html)) {
        throw new Error(
          `Could not find required metadata tag for ${route}: ${pattern}`
        );
      }

      html = html.replace(pattern, replacement);
    }

    writeFileSync(routeOutput(route), html, 'utf8');
    console.log(`Generated Vercel SEO HTML: ${routeOutput(route)}`);
  }

  console.log(
    '\nMetadata-only generation completed. React will render page content in the browser.'
  );
}

// On Vercel, avoid launching Puppeteer's Chrome because the build
// environment may not include the browser's required Linux libraries.
if (process.env.VERCEL === '1') {
  generateMetadataOnly();
} else {
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
        file = join(dist, 'index.html');
      }

      res.writeHead(200, {
        'Content-Type':
          mimeTypes[extname(file).toLowerCase()] ||
          'application/octet-stream',
        'Cache-Control': 'no-store',
      });

      const stream = createReadStream(file);

      stream.on('error', error => {
        console.error('File read error:', error.message);

        if (!res.headersSent) {
          res.writeHead(500);
        }

        res.end('Internal server error');
      });

      stream.pipe(res);
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

      const output = routeOutput(route);
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
}
