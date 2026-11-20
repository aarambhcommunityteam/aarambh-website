import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import './article.css';

const components = {
  // Keep wide tables inside the reading column on small screens.
  table: ({ children }) => (
    <div className="journal-table-scroll" role="region" aria-label="Article table" tabIndex={0}>
      <table>{children}</table>
    </div>
  ),
  img: ({ src, alt, title }) => <img src={src} alt={alt || ''} title={title} loading="lazy" decoding="async" />,
};

// The title already appears as the page H1. Reuse a matching, plain leading
// Markdown title there; leave the stored string and all other headings intact.
function remarkTitleInHeader({ headerTitle }) {
  return tree => {
    const first = tree.children[0];
    if (headerTitle && first?.type === 'heading' && first.depth === 1 &&
        first.children.length === 1 && first.children[0].type === 'text' &&
        first.children[0].value.trim() === headerTitle.trim()) {
      tree.children.shift();
    }
  };
}

export default function ArticleContent({ content, headerTitle }) {
  return (
    <div className="journal-content">
      <Markdown
        remarkPlugins={[remarkGfm, [remarkTitleInHeader, { headerTitle }]]}
        // Parse existing HTML too, then remove unsafe tags, attributes and URLs.
        // Never inject the source directly with dangerouslySetInnerHTML.
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {typeof content === 'string' ? content : ''}
      </Markdown>
    </div>
  );
}
