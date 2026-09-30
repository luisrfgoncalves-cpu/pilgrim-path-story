import { useState, useCallback } from 'react';

export function useShake() {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<'light' | 'medium' | 'heavy'>('light');

  const triggerShake = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium', durationMs = 500) => {
    setShakeIntensity(intensity);
    setIsShaking(true);
    
    setTimeout(() => {
      setIsShaking(false);
    }, durationMs);
  }, []);

  let shakeClass = '';
  if (isShaking) {
    switch (shakeIntensity) {
      case 'light': shakeClass = 'animate-[shake_0.2s_ease-in-out_infinite]'; break;
      case 'medium': shakeClass = 'animate-[shake_0.15s_ease-in-out_infinite]'; break;
      case 'heavy': shakeClass = 'animate-[shake_0.1s_ease-in-out_infinite]'; break;
    }
  }

  return { isShaking, triggerShake, shakeClass };
}
