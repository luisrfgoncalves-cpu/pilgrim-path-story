import { useState, useEffect, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface GameNotificationProps {
  visible: boolean;
  onDismiss: () => void;
  /** Duration in ms before auto-dismiss. Default 10000 (10s). 0 = no auto-dismiss. */
  duration?: number;
  children: ReactNode;
  className?: string;
  /** Position: 'top' | 'top-offset' | 'center'. Default 'top'. */
  position?: 'top' | 'top-offset' | 'center';
  /** If true, won't auto-dismiss (manual only via X) */
  persistent?: boolean;
}

const GameNotification = ({
  visible,
  onDismiss,
  duration = 10000,
  children,
  className = '',
  position = 'top',
  persistent = false,
}: GameNotificationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      if (!persistent && duration > 0) {
        const t = setTimeout(() => {
          onDismiss();
        }, duration);
        return () => clearTimeout(t);
      }
    } else {
      setShow(false);
    }
  }, [visible, duration, persistent, onDismiss]);

  if (!show) return null;

  const posClass = position === 'top'
    ? 'fixed top-4 left-1/2 -translate-x-1/2'
    : position === 'top-offset'
    ? 'fixed top-16 left-1/2 -translate-x-1/2'
    : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

  return (
    <div className={`${posClass} z-50 animate-fade-in max-w-sm w-[90vw] ${className}`}>
      <div className="relative">
        <button
          onClick={onDismiss}
          className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default GameNotification;
