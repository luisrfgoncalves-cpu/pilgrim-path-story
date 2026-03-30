/**
 * Device capability detection — progressive quality tiers
 * Detects hardware capability and delivers MAXIMUM quality each device can handle
 */
import { useState, useEffect, useRef } from 'react';

export type DeviceTier = 'premium' | 'optimized' | 'essential';

interface DeviceCapability {
  tier: DeviceTier;
  /** Max particle count multiplier (0.3 - 1.0) */
  particleMultiplier: number;
  /** Enable complex shadows & glows */
  enableComplexShadows: boolean;
  /** Enable SVG filters (glow, blur) */
  enableSvgFilters: boolean;
  /** Enable bounce/pulse CSS animations */
  enableCssAnimations: boolean;
  /** Max concurrent animated elements */
  maxAnimatedElements: number;
  /** Image quality preference (affects nothing visual — just loading priority) */
  prefersReducedImages: boolean;
}

const PREMIUM: DeviceCapability = {
  tier: 'premium',
  particleMultiplier: 1.0,
  enableComplexShadows: true,
  enableSvgFilters: true,
  enableCssAnimations: true,
  maxAnimatedElements: 120,
  prefersReducedImages: false,
};

const OPTIMIZED: DeviceCapability = {
  tier: 'optimized',
  particleMultiplier: 0.6,
  enableComplexShadows: true,
  enableSvgFilters: true,
  enableCssAnimations: true,
  maxAnimatedElements: 40,
  prefersReducedImages: false,
};

const ESSENTIAL: DeviceCapability = {
  tier: 'essential',
  particleMultiplier: 0.3,
  enableComplexShadows: false,
  enableSvgFilters: false,
  enableCssAnimations: true,
  maxAnimatedElements: 20,
  prefersReducedImages: true,
};

/**
 * Measures real FPS over a short sample to detect device performance
 */
function measureFPS(callback: (fps: number) => void) {
  let frames = 0;
  let start = performance.now();
  const sample = () => {
    frames++;
    const elapsed = performance.now() - start;
    if (elapsed >= 1000) {
      callback(Math.round(frames * 1000 / elapsed));
    } else {
      requestAnimationFrame(sample);
    }
  };
  requestAnimationFrame(sample);
}

function getInitialTier(): DeviceTier {
  // Check for reduced-motion preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'essential';
  }

  // Use hardware concurrency + device memory as initial heuristic
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4; // GB, defaults to 4 if unavailable

  if (cores >= 6 && memory >= 6) return 'premium';
  if (cores >= 4 && memory >= 3) return 'optimized';
  if (cores <= 2 || memory <= 2) return 'essential';

  return 'optimized'; // default safe middle
}

/**
 * Hook that detects device capability and dynamically adjusts
 * based on real-time FPS monitoring
 */
export function useDeviceCapability(): DeviceCapability {
  const [tier, setTier] = useState<DeviceTier>(getInitialTier);
  const hasAdjusted = useRef(false);

  useEffect(() => {
    // After mount, measure actual FPS to refine the tier
    const timer = setTimeout(() => {
      measureFPS((fps) => {
        if (hasAdjusted.current) return;
        hasAdjusted.current = true;

        const initial = getInitialTier();

        if (fps >= 50) {
          // Device handles well — try promoting
          if (initial === 'essential') setTier('optimized');
          else if (initial === 'optimized') setTier('premium');
          else setTier('premium');
        } else if (fps >= 30) {
          // Decent — keep current or slight adjust
          if (initial === 'premium' && fps < 40) setTier('optimized');
          else setTier(initial);
        } else {
          // Struggling — demote with headroom
          if (initial === 'premium') setTier('optimized');
          else setTier('essential');
        }
      });
    }, 2000); // wait 2s for app to settle before measuring

    return () => clearTimeout(timer);
  }, []);

  switch (tier) {
    case 'premium': return PREMIUM;
    case 'optimized': return OPTIMIZED;
    case 'essential': return ESSENTIAL;
  }
}

/**
 * Standalone function (no hook) for non-React contexts
 */
export function getDeviceTier(): DeviceTier {
  return getInitialTier();
}
