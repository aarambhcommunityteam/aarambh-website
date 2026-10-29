
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Events', path: '/events' },
  { name: 'Members', path: '/members' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'IRDP', path: '/irdp' },
  { name: 'Founder', path: '/founder' },
  { name: 'Resources', path: '/resources' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLogoClick = (event) => {
    event.preventDefault();
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current === 3) {
      clickCountRef.current = 0;
      navigate('/builder');
    } else {
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path, mobile = false) =>
    `${mobile ? 'block w-full' : 'whitespace-nowrap'} rounded-lg px-3 py-2.5 ${
      mobile ? 'text-base' : 'text-sm'
    } font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'bg-[#087BFF]/15 text-[#19C8FF]'
        : 'text-gray-300 hover:bg-white/5 hover:text-[#19C8FF]'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#080d1a]/95 text-white backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-2 py-2">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
            aria-label="AARAMBH home"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden sm:h-12 sm:w-12">
              <img
                src="/assets/aarambh-logo.png"
                alt="AARAMBH logo"
                width="48"
                height="48"
                fetchPriority="high"
                className="h-full w-full object-contain"
              />
            </span>

            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-extrabold tracking-[0.12em] text-white sm:text-base sm:tracking-[0.16em]">
                AARAMBH
              </span>
              <span className="mt-1 max-w-[205px] text-[8px] font-semibold uppercase tracking-[0.06em] text-[#19C8FF] sm:max-w-none sm:text-[10px] sm:tracking-[0.1em]">
                The First Step of Entrepreneurship
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={linkClass(link.path)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19C8FF] lg:hidden"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="aarambh-mobile-navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="aarambh-mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-800 bg-[#080d1a] lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-1 px-3 py-3 sm:grid-cols-2 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={linkClass(link.path, true)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
