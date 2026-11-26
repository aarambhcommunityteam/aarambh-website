import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './product-testing.css';

export default function ProductTestingShell({ audience, title, description, children }) {
  useEffect(() => {
    const oldTitle = document.title;
    const changes = [
      ['meta[name="description"]', 'content', description],
      ['meta[property="og:title"]', 'content', title],
      ['meta[property="og:description"]', 'content', description],
      ['meta[name="twitter:title"]', 'content', title],
      ['meta[name="twitter:description"]', 'content', description],
      ['meta[property="og:url"]', 'content', `https://aarambh-community.in/product-testing${audience ? `/${audience}` : ''}`],
      ['link[rel="canonical"]', 'href', `https://aarambh-community.in/product-testing${audience ? `/${audience}` : ''}`],
    ].map(([selector, attribute, value]) => {
      const node = document.querySelector(selector);
      const previous = node?.getAttribute(attribute);
      node?.setAttribute(attribute, value);
      return () => { if (previous !== null && previous !== undefined) node?.setAttribute(attribute, previous); };
    });
    document.title = title;
    return () => { document.title = oldTitle; changes.forEach(restore => restore()); };
  }, [audience, title, description]);

  return (
    <div className={`product-testing ${audience === 'startups' ? 'pt-startup' : ''}`}>
      <div className="pt-container">
        <div className="pt-topline">
          {audience ? <Link to="/product-testing" className="pt-back"><ArrowLeft size={16} aria-hidden="true" /> Product Testing</Link> : <span className="pt-eyebrow">AARAMBH / Product Testing</span>}
          <span className="pt-pilot-tag">Introducing our first pilot</span>
        </div>
        {children}
      </div>
    </div>
  );
}
