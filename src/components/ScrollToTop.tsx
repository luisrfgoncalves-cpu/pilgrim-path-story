import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Immediate scroll to top on every route or query-param change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Force scroll after a micro-delay for late-rendering pages
    const t1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, 50);
    // Extra pass for pages that render async content
    const t2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, 150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
