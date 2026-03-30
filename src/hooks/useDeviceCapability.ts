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

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const touchScreen = navigator.maxTouchPoints > 0 && window.innerWidth <= 1024;
  return mobileUA || touchScreen;
}

/**
 * Measures real FPS over a short sample to detect device performance
 */
function measureFPS(callback: (fps: number) => void) {
  let frames = 0;
  const start = performance.now();
  const sample = () => {
    frames++;
    const elapsed = performance.now() - start;
    if (elapsed >= 1000) {
      callback(Math.round((frames * 1000) / elapsed));
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

  const mobile = isMobileDevice();

  // CRITICAL FIX: Mobile always starts as 'essential' to prevent OOM crash
  // during the ~2s before FPS measurement completes. Can upgrade after measurement.
  if (mobile) {
    return 'essential';
  }

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4;

  if (cores >= 6 && memory >= 6) return 'premium';
  if (cores >= 4 && memory >= 3) return 'optimized';
  if (cores <= 2 || memory <= 2) return 'essential';

  return 'optimized';
}

/**
 * Hook that detects device capability and dynamically adjusts
 * based on real-time FPS monitoring
 */
export function useDeviceCapability(): DeviceCapability {
  const [tier, setTier] = useState<DeviceTier>(getInitialTier);
  const hasAdjusted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      measureFPS((fps) => {
        if (hasAdjusted.current) return;
        hasAdjusted.current = true;

        const initial = getInitialTier();
        const mobile = isMobileDevice();

        if (mobile) {
          // On mobile, never promote to premium (protect RAM/GPU stability)
          if (fps >= 45) {
            setTier(initial === 'essential' ? 'optimized' : 'optimized');
          } else {
            setTier('essential');
          }
          return;
        }

        if (fps >= 50) {
          if (initial === 'essential') setTier('optimized');
          else if (initial === 'optimized') setTier('premium');
          else setTier('premium');
        } else if (fps >= 30) {
          if (initial === 'premium' && fps < 40) setTier('optimized');
          else setTier(initial);
        } else {
          if (initial === 'premium') setTier('optimized');
          else setTier('essential');
        }
      });
    }, 2000);

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
