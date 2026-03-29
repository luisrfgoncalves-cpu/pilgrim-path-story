import { useMemo } from 'react';

/** Detects if the app is running in "preview" mode (embedded in landing page iframe) */
export const usePreviewMode = () => {
  const isPreview = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === 'landing';
  }, []);

  const notifyParent = (type: string, data?: Record<string, unknown>) => {
    try {
      window.parent?.postMessage({ type, ...data }, '*');
    } catch {
      // cross-origin, ignore
    }
  };

  return { isPreview, notifyParent };
};
