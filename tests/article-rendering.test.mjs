import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { contentPayload } from '../src/lib/contentPayloads.js';

// Exercise the actual JSX components with Node's existing test runner.
const output = resolve('.codex-checks/article-test-components.mjs');
mkdirSync(resolve('.codex-checks'), { recursive: true });
await build({ stdin: { contents: `
  export { default as ArticleContent } from './src/components/blog/ArticleContent.jsx';
  export { default as ArticleLayout } from './src/components/blog/ArticleLayout.jsx';
  export { default as ArticleEditor } from './src/components/admin/ArticleEditor.jsx';
`, resolveDir: process.cwd() }, outfile: output, bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic', loader: { '.css': 'empty' } });
const { ArticleContent, ArticleLayout, ArticleEditor } = await import(pathToFileURL(output).href);
const render = content => renderToStaticMarkup(createElement(ArticleContent, { content }));

test('Markdown headings, emphasis, lists, and paragraphs become semantic HTML', () => {
  const html = render('# Heading one\n\n## Heading two\n\n### Heading three\n\nA **bold** word and *italic* text.\n\nA second paragraph.\n\n- First bullet\n- Second bullet\n\n1. First step\n2. Second step');
  for (const tag of ['<h1>Heading one</h1>', '<h2>Heading two</h2>', '<h3>Heading three</h3>', '<strong>bold</strong>', '<em>italic</em>', '<ul>', '<ol>', '<li>First bullet</li>', '<p>A second paragraph.</p>']) assert.ok(html.includes(tag), tag);
  assert.doesNotMatch(html, /\*\*|##|# Heading/);
});

test('legacy plain text preserves separate paragraphs and Unicode', () => {
  assert.equal(render('First paragraph.\r\n\r\nSecond paragraph — नमस्ते!'), '<div class="journal-content"><p>First paragraph.</p>\n<p>Second paragraph — नमस्ते!</p></div>');
});

test('existing HTML formatting is preserved without exposing markup', () => {
  const html = render('<h2>Existing heading</h2><p>Keep <strong>bold</strong> and <em>emphasis</em>.</p><ul><li>Item</li></ul>');
  assert.match(html, /<h2>Existing heading<\/h2>/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /<li>Item<\/li>/);
  assert.doesNotMatch(html, /&lt;h2/);
});

test('unsafe HTML, handlers, inline styles and executable URLs cannot render', () => {
  const html = render('<script>alert(1)</script><style>body{display:none}</style><iframe src="https://example.com"></iframe><p style="width:1px" onclick="alert(1)">Safe text</p><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">Read</a>\n\n[Bad](javascript:alert%281%29)');
  assert.match(html, /Safe text/);
  assert.doesNotMatch(html, /<script|<style|<iframe|onerror|onclick|style=|javascript:/);
});

test('GFM tables scroll locally and readable code is preserved', () => {
  const html = render('| Name | Value |\n| --- | --- |\n| One | Two |\n\n```js\nconst value = 1;\n```');
  assert.match(html, /class="journal-table-scroll"/);
  assert.match(html, /<th>Name<\/th>/);
  assert.match(html, /<pre><code/);
  assert.match(html, /const value = 1;/);
});

test('article header separates cover, metadata, summary and full article', () => {
  const post = { title: 'Startup story', author: 'AARAMBH Editorial Team', category: 'Startup Spotlight', published_at: '2026-11-20T13:00:00Z', cover_image_url: '/cover.jpg', excerpt: 'The summary.', content: '## The story\n\nThe full article.' };
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ArticleLayout, { post })));
  assert.match(html, /class="journal-shell"/);
  assert.ok(html.indexOf('class="journal-cover"') < html.indexOf('id="article-title"'));
  assert.match(html, /width="1200" height="675"/);
  assert.match(html, /<time dateTime="2026-11-20T13:00:00.000Z">20 November 2026<\/time>/);
  assert.match(html, /aria-label="Article summary"/);
  assert.match(html, /aria-label="Full article"/);
  assert.match(html, /<h2>The story<\/h2>/);
});

test('editor preview button cannot submit and Markdown source is saved unchanged', () => {
  const content = '# Original title\n\n**Keep this**\n\n<p>Existing HTML</p>\n';
  const html = renderToStaticMarkup(createElement(ArticleEditor, { value: content, onChange: () => {}, required: true }));
  assert.match(html, /<button type="button"/);
  assert.match(html, /<textarea[^>]+required=""/);
  assert.match(html, /# Original title/);
  assert.equal(contentPayload('blog_posts', { title: 'Original title', content }).content, content);
});

test('articles without optional image or publication metadata remain readable', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ArticleLayout, { post: { title: 'Legacy article', content: 'Still readable.', published_at: 'invalid' } })));
  assert.match(html, /<p>Still readable.<\/p>/);
  assert.doesNotMatch(html, /Invalid Date|<time|class="journal-cover"/);
});

test('a matching leading title is presented once in the header without changing source', () => {
  const content = '# Startup story\n\n## First section\n\nEvery word stays.\n\n# Another heading';
  const post = { title: 'Startup story', content };
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ArticleLayout, { post })));
  assert.equal((html.match(/Startup story/g) || []).length, 1);
  assert.match(html, /<h2>First section<\/h2>/);
  assert.match(html, /<p>Every word stays.<\/p>/);
  assert.match(html, /<h1>Another heading<\/h1>/);
  assert.equal(post.content, content);
});
